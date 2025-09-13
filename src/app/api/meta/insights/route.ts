import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { metaGraphApiClient } from '@/lib/api-client'
import { databaseManager } from '@/lib/database'
import { cacheManager } from '@/lib/cache'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const requestId = logger.logApiRequest('/api/meta/insights', 'GET')
  
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      logger.logApiResponse(requestId, '/api/meta/insights', 'GET', 401, Date.now() - startTime)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('account_id')
    const level = searchParams.get('level') || 'campaign' // campaign, adset, ad
    const entityId = searchParams.get('entity_id') // specific campaign/adset/ad ID
    const dateStart = searchParams.get('date_start') || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days ago
    const dateEnd = searchParams.get('date_end') || new Date().toISOString().split('T')[0] // today
    const breakdowns = searchParams.get('breakdowns')?.split(',') || []
    const actionBreakdowns = searchParams.get('action_breakdowns')?.split(',') || []
    const limit = parseInt(searchParams.get('limit') || '1000')

    if (!accountId) {
      logger.logApiResponse(requestId, '/api/meta/insights', 'GET', 400, Date.now() - startTime)
      return NextResponse.json({ error: 'account_id parameter is required' }, { status: 400 })
    }

    // Validate level parameter
    if (!['account', 'campaign', 'adset', 'ad'].includes(level)) {
      logger.logApiResponse(requestId, '/api/meta/insights', 'GET', 400, Date.now() - startTime)
      return NextResponse.json({ error: 'level must be one of: account, campaign, adset, ad' }, { status: 400 })
    }

    // Check cache first
    const cacheKey = `insights:${accountId}:${level}:${entityId || 'all'}:${dateStart}:${dateEnd}`
    let cachedData = await cacheManager.getCachedInsights(accountId, level)
    
    if (cachedData && cachedData.date_range && 
        cachedData.date_range.since === dateStart && 
        cachedData.date_range.until === dateEnd) {
      logger.logCacheHit(cacheKey)
      logger.logApiResponse(requestId, '/api/meta/insights', 'GET', 200, Date.now() - startTime)
      return NextResponse.json(cachedData)
    }

    logger.logCacheMiss(cacheKey)

    // Define comprehensive insights fields for v23.0
    const insightsFields = [
      'spend', 'impressions', 'clicks', 'ctr', 'cpc', 'cpm', 'cpp',
      'reach', 'frequency', 'actions', 'action_values', 'conversions',
      'conversion_values', 'cost_per_action_type', 'unique_clicks',
      'unique_ctr', 'unique_link_clicks_ctr', 'cost_per_unique_click',
      'video_play_actions', 'video_p25_watched_actions', 'video_p50_watched_actions',
      'video_p75_watched_actions', 'video_p100_watched_actions',
      'video_avg_time_watched_actions', 'video_complete_watched_actions'
    ]

    const insightsOptions = {
      fields: insightsFields,
      timeRange: { since: dateStart, until: dateEnd },
      breakdowns: breakdowns.length > 0 ? breakdowns : undefined,
      actionBreakdowns: actionBreakdowns.length > 0 ? actionBreakdowns : undefined,
      level: level as any,
      limit,
    }

    // Fetch insights based on level and entity
    let insightsResponse
    if (entityId && level !== 'account') {
      // Get insights for specific entity (campaign, adset, or ad)
      logger.logMetaApiCall(`/${entityId}/insights`, 'GET', accountId)
      insightsResponse = await metaGraphApiClient.getCampaignInsights(entityId, insightsOptions)
    } else {
      // Get account-level insights
      logger.logMetaApiCall(`/act_${accountId}/insights`, 'GET', accountId)
      insightsResponse = await metaGraphApiClient.getAccountInsights(accountId, insightsOptions)
    }
    
    if (!insightsResponse.data) {
      throw new Error('No insights data received from Meta API')
    }

    // Process and store insights data
    const insights = insightsResponse.data
    const processedInsights = []

    for (const insight of insights) {
      try {
        // Determine entity information
        const entityType = level === 'account' ? 'campaign' : level as 'campaign' | 'adset' | 'ad'
        const currentEntityId = entityId || 
          (level === 'campaign' ? insight.campaign_id : 
           level === 'adset' ? insight.adset_id : 
           level === 'ad' ? insight.ad_id : accountId)
        
        // Store daily insights in database
        await databaseManager.upsertDailyInsights({
          entity_type: entityType,
          entity_id: currentEntityId,
          entity_name: insight.campaign_name || insight.adset_name || insight.ad_name,
          account_id: accountId,
          date_start: insight.date_start,
          date_stop: insight.date_stop,
          spend: parseFloat(insight.spend || '0'),
          impressions: parseInt(insight.impressions || '0'),
          clicks: parseInt(insight.clicks || '0'),
          reach: parseInt(insight.reach || '0'),
          frequency: parseFloat(insight.frequency || '0'),
          ctr: parseFloat(insight.ctr || '0'),
          cpc: parseFloat(insight.cpc || '0'),
          cpm: parseFloat(insight.cpm || '0'),
          cpp: parseFloat(insight.cpp || '0'),
          actions_json: insight.actions || [],
          action_values_json: insight.action_values || [],
          conversions_json: insight.conversions || [],
          conversion_values_json: insight.conversion_values || [],
          cost_per_action_type_json: insight.cost_per_action_type || [],
          video_metrics_json: {
            video_play_actions: insight.video_play_actions || [],
            video_p25_watched_actions: insight.video_p25_watched_actions || [],
            video_p50_watched_actions: insight.video_p50_watched_actions || [],
            video_p75_watched_actions: insight.video_p75_watched_actions || [],
            video_p100_watched_actions: insight.video_p100_watched_actions || [],
            video_avg_time_watched_actions: insight.video_avg_time_watched_actions || [],
            video_complete_watched_actions: insight.video_complete_watched_actions || [],
          },
        })

        // Process actions for easier consumption
        const processedActions = {}
        if (insight.actions) {
          insight.actions.forEach((action: any) => {
            processedActions[action.action_type] = parseFloat(action.value || '0')
          })
        }

        const processedActionValues = {}
        if (insight.action_values) {
          insight.action_values.forEach((actionValue: any) => {
            processedActionValues[actionValue.action_type] = parseFloat(actionValue.value || '0')
          })
        }

        const processedConversions = {}
        if (insight.conversions) {
          insight.conversions.forEach((conversion: any) => {
            processedConversions[conversion.action_type] = parseFloat(conversion.value || '0')
          })
        }

        processedInsights.push({
          entity_id: currentEntityId,
          entity_type: entityType,
          date_start: insight.date_start,
          date_stop: insight.date_stop,
          spend: parseFloat(insight.spend || '0'),
          impressions: parseInt(insight.impressions || '0'),
          clicks: parseInt(insight.clicks || '0'),
          ctr: parseFloat(insight.ctr || '0'),
          cpc: parseFloat(insight.cpc || '0'),
          cpm: parseFloat(insight.cpm || '0'),
          cpp: parseFloat(insight.cpp || '0'),
          reach: parseInt(insight.reach || '0'),
          frequency: parseFloat(insight.frequency || '0'),
          unique_clicks: parseInt(insight.unique_clicks || '0'),
          unique_ctr: parseFloat(insight.unique_ctr || '0'),
          unique_link_clicks_ctr: parseFloat(insight.unique_link_clicks_ctr || '0'),
          cost_per_unique_click: parseFloat(insight.cost_per_unique_click || '0'),
          actions: processedActions,
          action_values: processedActionValues,
          conversions: processedConversions,
          cost_per_action_type: insight.cost_per_action_type || [],
          video_metrics: {
            video_play_actions: insight.video_play_actions || [],
            video_p25_watched_actions: insight.video_p25_watched_actions || [],
            video_p50_watched_actions: insight.video_p50_watched_actions || [],
            video_p75_watched_actions: insight.video_p75_watched_actions || [],
            video_p100_watched_actions: insight.video_p100_watched_actions || [],
            video_avg_time_watched_actions: insight.video_avg_time_watched_actions || [],
            video_complete_watched_actions: insight.video_complete_watched_actions || [],
          },
          // Include breakdown data if present
          ...(insight.age && { age: insight.age }),
          ...(insight.gender && { gender: insight.gender }),
          ...(insight.country && { country: insight.country }),
          ...(insight.region && { region: insight.region }),
          ...(insight.placement && { placement: insight.placement }),
          ...(insight.platform_position && { platform_position: insight.platform_position }),
          ...(insight.device_platform && { device_platform: insight.device_platform }),
        })

        logger.logDataSync('insights', currentEntityId, accountId, 1)
      } catch (dbError) {
        logger.error(`Failed to store insights for entity ${insight.campaign_id || insight.adset_id || insight.ad_id}`, dbError, { 
          accountId,
          level,
          entityId: insight.campaign_id || insight.adset_id || insight.ad_id,
        })
        // Continue processing other insights even if one fails
      }
    }

    // Calculate summary metrics
    const summary = processedInsights.reduce((acc, insight) => {
      acc.total_spend += insight.spend
      acc.total_impressions += insight.impressions
      acc.total_clicks += insight.clicks
      acc.total_reach = Math.max(acc.total_reach, insight.reach) // Reach should not be summed
      return acc
    }, {
      total_spend: 0,
      total_impressions: 0,
      total_clicks: 0,
      total_reach: 0,
    })

    // Calculate average metrics
    const avgMetrics = {
      avg_ctr: summary.total_impressions > 0 ? (summary.total_clicks / summary.total_impressions) * 100 : 0,
      avg_cpc: summary.total_clicks > 0 ? summary.total_spend / summary.total_clicks : 0,
      avg_cpm: summary.total_impressions > 0 ? (summary.total_spend / summary.total_impressions) * 1000 : 0,
    }

    const responseData = {
      data: processedInsights,
      summary: { ...summary, ...avgMetrics },
      total: processedInsights.length,
      account_id: accountId,
      level,
      entity_id: entityId,
      date_range: { since: dateStart, until: dateEnd },
      breakdowns,
      action_breakdowns: actionBreakdowns,
      updated_at: new Date().toISOString(),
    }

    // Cache the result for 15 minutes (insights can be cached for shorter periods)
    await cacheManager.cacheInsights(accountId, level, responseData, 15)

    logger.logApiResponse(requestId, '/api/meta/insights', 'GET', 200, Date.now() - startTime, {
      accountId,
      level,
      entityId,
      insightsCount: processedInsights.length,
      dateRange: `${dateStart} to ${dateEnd}`,
    })

    return NextResponse.json(responseData)

  } catch (error) {
    logger.error('Failed to fetch Meta insights', error, {
      requestId,
      endpoint: '/api/meta/insights',
      accountId: new URL(request.url).searchParams.get('account_id'),
      level: new URL(request.url).searchParams.get('level'),
    })

    logger.logApiResponse(requestId, '/api/meta/insights', 'GET', 500, Date.now() - startTime)

    return NextResponse.json(
      { 
        error: 'Failed to fetch insights',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}