#!/bin/bash
# Empacy NPM Token Generation Script
# This script helps generate NPM authentication tokens

set -e

echo "🔑 Empacy NPM Token Generation Script"
echo "======================================"

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "This script will help you generate an NPM authentication token."
echo "You can use this token for CI/CD pipelines or non-interactive authentication."
echo ""

# Check if npm is logged in
if npm whoami >/dev/null 2>&1; then
    echo "✅ Already logged in to npm as: $(npm whoami)"
else
    echo "🔐 Not logged in to npm. You need to login first."
    echo "   Run: npm login"
    echo "   Then run this script again."
    exit 1
fi

echo ""
echo "Choose token type:"
echo "1. Read-only token (for CI/CD that only needs to install packages)"
echo "2. Publish token (for CI/CD that needs to publish packages)"
echo "3. Automation token (for CI/CD with limited scope)"
echo "4. Custom scope token"
echo ""

read -p "Enter your choice (1-4): " -n 1 -r
echo

case $REPLY in
    1)
        echo "🔒 Generating read-only token..."
        echo "   This token can only read packages and install dependencies."
        echo "   Use this for build pipelines that don't need to publish."
        echo ""
        read -p "Press Enter to continue..."
        npm token create --read-only
        ;;
    2)
        echo "🚀 Generating publish token..."
        echo "   This token can publish packages to npm."
        echo "   Use this for release pipelines."
        echo ""
        read -p "Press Enter to continue..."
        npm token create
        ;;
    3)
        echo "🤖 Generating automation token..."
        echo "   This token is designed for CI/CD automation."
        echo "   It has limited scope and expires automatically."
        echo ""
        read -p "Press Enter to continue..."
        npm token create --automation
        ;;
    4)
        echo "🎯 Generating custom scope token..."
        echo "   You can specify custom permissions and scope."
        echo ""
        read -p "Enter token description: " TOKEN_DESC
        read -p "Enter scope (e.g., @yourorg): " TOKEN_SCOPE
        read -p "Enter permissions (read-only, publish, automation): " TOKEN_PERMS
        
        if [[ -n "$TOKEN_SCOPE" ]]; then
            npm token create --scope="$TOKEN_SCOPE" --description="$TOKEN_DESC"
        else
            npm token create --description="$TOKEN_DESC"
        fi
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "💡 Token generated successfully!"
echo ""
echo "📋 Important notes:"
echo "   • Save this token securely - it won't be shown again"
echo "   • Use it in CI/CD with: npm config set //registry.npmjs.org/:_authToken=YOUR_TOKEN"
echo "   • Or set NPM_TOKEN environment variable in your CI/CD system"
echo "   • You can view all tokens with: npm token list"
echo "   • You can revoke tokens with: npm token revoke TOKEN_ID"
echo ""
echo "🔐 To use this token in CI/CD, add to your workflow:"
echo "   env:"
echo "     NPM_TOKEN: \${{ secrets.NPM_TOKEN }}"
echo ""
echo "   Or in your .npmrc file:"
echo "   //registry.npmjs.org/:_authToken=\${NPM_TOKEN}"
