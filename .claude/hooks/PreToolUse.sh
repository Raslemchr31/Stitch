#!/bin/bash

# Project-specific PreToolUse Hook for Meta Ads Intelligence Platform
# Enhanced security checks for Facebook/Meta API integration

set -euo pipefail

HOOK_NAME="PreToolUse[MetaAds]"
LOG_FILE="$HOME/.claude/logs/hooks.log"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

# Logging function
log_action() {
    echo "[$TIMESTAMP] $HOOK_NAME: $1" | tee -a "$LOG_FILE"
}

# Check if we have the required arguments
if [ $# -lt 2 ]; then
    log_action "ERROR: Insufficient arguments for Meta Ads Platform hook"
    exit 0
fi

TOOL_NAME="$1"
shift
TOOL_ARGS="$*"

log_action "Meta Ads Platform security checks for: $TOOL_NAME"

# Meta-specific security patterns
META_SECURITY_PATTERNS=(
    "EAA[a-zA-Z0-9_-]{100,}"           # Facebook long-lived access tokens
    "EAAG[a-zA-Z0-9_-]{100,}"          # Facebook app access tokens
    "EAAM[a-zA-Z0-9_-]{100,}"          # Facebook marketing API tokens
    "facebook\|[a-f0-9]{32}"           # Facebook app secrets
    "instagram\|[a-f0-9]{32}"          # Instagram API secrets
    "whatsapp\|[a-f0-9]{32}"           # WhatsApp Business API tokens
    "meta\|[a-f0-9]{32}"               # Meta API secrets
    "[0-9]{15,16}"                     # Facebook App IDs (if hardcoded)
)

# Meta environment variables that should never be hardcoded
META_ENV_PATTERNS=(
    "FACEBOOK_APP_SECRET=.*['\"].*['\"]"
    "FACEBOOK_ACCESS_TOKEN=.*['\"].*['\"]"
    "INSTAGRAM_ACCESS_TOKEN=.*['\"].*['\"]"
    "WHATSAPP_TOKEN=.*['\"].*['\"]"
    "META_APP_SECRET=.*['\"].*['\"]"
    "FB_APP_SECRET=.*['\"].*['\"]"
    "MARKETING_API_TOKEN=.*['\"].*['\"]"
)

# Function to check Meta-specific security issues
check_meta_security() {
    local content="$1"
    local context="$2"
    
    log_action "Running Meta Ads Platform security scan"
    
    for pattern in "${META_SECURITY_PATTERNS[@]}"; do
        if echo "$content" | grep -qiE "$pattern"; then
            log_action "⚠️  CRITICAL: Facebook/Meta API token detected in $context"
            echo "🚨 META SECURITY ALERT: Facebook/Meta API token detected!"
            echo "   Context: $context"
            echo "   This is a CRITICAL security issue for Meta Ads Platform!"
            echo "   Facebook tokens should NEVER be hardcoded."
            echo "   Use environment variables: FACEBOOK_ACCESS_TOKEN, etc."
            echo ""
            return 1
        fi
    done
    
    for pattern in "${META_ENV_PATTERNS[@]}"; do
        if echo "$content" | grep -qiE "$pattern"; then
            log_action "⚠️  WARNING: Meta API environment variable with hardcoded value in $context"
            echo "🔐 META ENV SECURITY: Hardcoded Meta API credential detected!"
            echo "   Context: $context"
            echo "   Use proper environment variable loading instead."
            echo "   Example: process.env.FACEBOOK_APP_SECRET"
            echo ""
        fi
    done
    
    return 0
}

# Meta Ads Platform specific validations
case "$TOOL_NAME" in
    "Edit"|"Write"|"MultiEdit"|"create_or_update_file")
        log_action "Checking Meta Ads Platform file modification"
        
        # Check if modifying Meta/Facebook integration files
        if echo "$TOOL_ARGS" | grep -qiE "(facebook|meta|instagram|whatsapp|ads|marketing)"; then
            log_action "Meta/Facebook integration file detected"
            echo "📈 META ADS PLATFORM: Modifying Facebook/Meta integration"
            echo "   Remember:"
            echo "   • Never hardcode App Secrets or Access Tokens"
            echo "   • Use environment variables for all credentials"
            echo "   • Test with development App ID first"
            echo "   • Monitor API rate limits and quotas"
            echo "   • Validate webhook signatures for security"
            echo ""
            
            # Run Meta-specific security check
            if ! check_meta_security "$TOOL_ARGS" "Meta integration file"; then
                echo "   ❌ BLOCKING: Critical Meta security issue detected!"
                echo "   Please remove hardcoded credentials before proceeding."
                exit 1
            fi
        fi
        
        # Check for Facebook SDK configuration
        if echo "$TOOL_ARGS" | grep -qiE "(FacebookAdsApi|AdAccount|Campaign|AdSet|Ad\.)" && echo "$TOOL_ARGS" | grep -qE "new_string|content"; then
            echo "🔧 FACEBOOK SDK: Facebook Business SDK usage detected"
            echo "   Security checklist:"
            echo "   ✅ App Secret stored in environment variables"
            echo "   ✅ Access tokens obtained through OAuth flow"
            echo "   ✅ Using appropriate API version (v18.0+)"
            echo "   ✅ Implementing proper error handling"
            echo "   ✅ Rate limiting and retry logic implemented"
            echo ""
        fi
        
        # Check for database operations with Meta data
        if echo "$TOOL_ARGS" | grep -qiE "(ad_account|campaign|adset|creative)" && echo "$TOOL_ARGS" | grep -qiE "(INSERT|UPDATE|CREATE TABLE)"; then
            echo "🗄️ META DATA: Database operations with Meta Ads data"
            echo "   Important considerations:"
            echo "   • Comply with Facebook Data Use Policy"
            echo "   • Implement proper data retention policies"
            echo "   • Secure sensitive advertising data"
            echo "   • Log data access for audit purposes"
            echo ""
        fi
        ;;
        
    "Bash")
        log_action "Checking Meta Ads Platform bash operations"
        
        # Check for production deployment commands
        if echo "$TOOL_ARGS" | grep -qiE "(docker.*build|npm.*run.*build|deploy|production)"; then
            echo "🚀 META ADS DEPLOYMENT: Production deployment detected"
            echo "   Pre-deployment checklist:"
            echo "   ✅ Facebook App reviewed and approved for production"
            echo "   ✅ Production App ID and App Secret configured"
            echo "   ✅ Webhook endpoints secured with HTTPS"
            echo "   ✅ Rate limiting implemented and tested"
            echo "   ✅ Error logging and monitoring configured"
            echo "   ✅ Data backup and recovery procedures tested"
            echo ""
        fi
        
        # Check for testing commands
        if echo "$TOOL_ARGS" | grep -qiE "(test|spec|cypress|playwright)"; then
            echo "🧪 META ADS TESTING: Testing Meta Ads integration"
            echo "   Testing recommendations:"
            echo "   • Use Facebook Test Users for automated tests"
            echo "   • Mock Facebook API responses for unit tests"
            echo "   • Test with development App ID (never production)"
            echo "   • Validate webhook signature verification"
            echo "   • Test API error handling and retry logic"
            echo ""
        fi
        ;;
esac

# Check for Facebook Graph API Explorer usage hints
if echo "$TOOL_ARGS" | grep -qiE "(graph\.facebook\.com|/debug_token|/me\?fields)"; then
    echo "🔍 FACEBOOK GRAPH API: API exploration detected"
    echo "   Graph API Explorer tips:"
    echo "   • Use Graph API Explorer for testing queries"
    echo "   • Validate permissions for each endpoint"
    echo "   • Check API version compatibility"
    echo "   • Review field permissions and data access"
    echo ""
fi

# Meta Business verification reminders
if echo "$TOOL_ARGS" | grep -qiE "(business_discovery|instagram_business|whatsapp_business)"; then
    echo "🏢 META BUSINESS: Business API usage detected"
    echo "   Business verification requirements:"
    echo "   • Business must be verified with Meta"
    echo "   • App must undergo App Review for advanced permissions"
    echo "   • Business Manager must be properly configured"
    echo "   • Terms of Service and Privacy Policy required"
    echo ""
fi

log_action "Meta Ads Platform security checks completed"
echo "✅ Meta Ads Platform security pre-flight completed"
echo ""

# Always exit with success unless critical security issue found
exit 0