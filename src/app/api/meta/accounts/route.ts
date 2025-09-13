import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { metaGraphApiClient } from '@/lib/api-client'
import { databaseManager } from '@/lib/database'
import { cacheManager } from '@/lib/cache'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const requestId = logger.logApiRequest('/api/meta/accounts', 'GET')
  
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      logger.logApiResponse(requestId, '/api/meta/accounts', 'GET', 401, Date.now() - startTime)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check cache first
    const cacheKey = `accounts:${session.user?.email || 'unknown'}`
    let cachedData = await cacheManager.get(cacheKey)
    
    if (cachedData) {
      logger.logCacheHit(cacheKey)
      logger.logApiResponse(requestId, '/api/meta/accounts', 'GET', 200, Date.now() - startTime)
      return NextResponse.json(cachedData)
    }

    logger.logCacheMiss(cacheKey)

    // Fetch from Meta Graph API
    logger.logMetaApiCall('/me/adaccounts', 'GET')
    const accountsResponse = await metaGraphApiClient.getAdAccounts()
    
    if (!accountsResponse.data) {
      throw new Error('No accounts data received from Meta API')
    }

    // Process and store account data
    const accounts = accountsResponse.data
    const processedAccounts = []

    for (const account of accounts) {
      try {
        // Store/update account in database
        await databaseManager.upsertAdAccount({
          id: account.id,
          name: account.name,
          account_status: account.account_status,
          currency: account.currency,
          timezone_name: account.timezone_name,
          business_id: account.business?.id,
          business_name: account.business?.name,
          amount_spent: parseFloat(account.amount_spent || '0'),
          balance: parseFloat(account.balance || '0'),
          spend_cap: account.spend_cap ? parseFloat(account.spend_cap) : undefined,
          created_time: account.created_time,
          capabilities_json: account.capabilities,
        })

        processedAccounts.push({
          id: account.id,
          name: account.name,
          account_status: account.account_status,
          currency: account.currency,
          timezone_name: account.timezone_name,
          business: account.business,
          amount_spent: account.amount_spent,
          balance: account.balance,
          spend_cap: account.spend_cap,
          capabilities: account.capabilities,
          created_time: account.created_time,
        })

        logger.logDataSync('account', account.id, account.id, 1)
      } catch (dbError) {
        logger.error(`Failed to store account ${account.id}`, dbError, { accountId: account.id })
        // Continue processing other accounts even if one fails
      }
    }

    const responseData = {
      data: processedAccounts,
      total: processedAccounts.length,
      updated_at: new Date().toISOString(),
    }

    // Cache the result for 1 hour
    await cacheManager.set(cacheKey, responseData, 3600)

    logger.logApiResponse(requestId, '/api/meta/accounts', 'GET', 200, Date.now() - startTime, {
      accountsCount: processedAccounts.length,
    })

    return NextResponse.json(responseData)

  } catch (error) {
    logger.error('Failed to fetch Meta ad accounts', error, {
      requestId,
      endpoint: '/api/meta/accounts',
    })

    logger.logApiResponse(requestId, '/api/meta/accounts', 'GET', 500, Date.now() - startTime)

    return NextResponse.json(
      { 
        error: 'Failed to fetch ad accounts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function HEAD(request: NextRequest) {
  try {
    const healthCheck = await metaGraphApiClient.checkRateLimit()
    
    if (healthCheck.status === 'healthy') {
      return new NextResponse(null, { status: 200 })
    }
    
    return new NextResponse(null, { status: 503 })
  } catch (error) {
    return new NextResponse(null, { status: 503 })
  }
}