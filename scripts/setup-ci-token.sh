#!/bin/bash
# Empacy CI/CD Token Setup Script
# This script helps set up NPM authentication tokens for GitHub Actions

set -e

echo "🔐 Empacy CI/CD Token Setup Script"
echo "=================================="

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

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
echo "This script will help you generate an NPM token for CI/CD pipelines."
echo "The token will be used in GitHub Actions to publish packages automatically."
echo ""

# Generate the token
echo "🚀 Generating NPM automation token for CI/CD..."
echo "   This token will have publish permissions and is designed for automation."
echo ""

read -p "Enter a description for the token (e.g., 'Empacy CI/CD Pipeline'): " TOKEN_DESC

if [[ -z "$TOKEN_DESC" ]]; then
    TOKEN_DESC="Empacy CI/CD Pipeline"
fi

echo ""
echo "🔑 Generating token with description: '$TOKEN_DESC'"
echo "   This will open a browser window for authentication..."
echo ""

read -p "Press Enter to continue..."

# Generate the token
TOKEN_OUTPUT=$(npm token create --automation --description="$TOKEN_DESC")

# Extract the token from the output
TOKEN=$(echo "$TOKEN_OUTPUT" | grep -o '[a-f0-9]\{36\}' | head -1)

if [[ -n "$TOKEN" ]]; then
    echo ""
    echo "🎉 NPM token generated successfully!"
    echo ""
    echo "📋 Token Details:"
    echo "   Token ID: $TOKEN"
    echo "   Description: $TOKEN_DESC"
    echo "   Type: Automation token"
    echo ""
    echo "🔐 Next Steps:"
    echo "   1. Copy the token above"
    echo "   2. Go to your GitHub repository: https://github.com/AnthonyRuffino/empacy"
    echo "   3. Go to Settings > Secrets and variables > Actions"
    echo "   4. Click 'New repository secret'"
    echo "   5. Name: NPM_TOKEN"
    echo "   6. Value: $TOKEN"
    echo "   7. Click 'Add secret'"
    echo ""
    echo "💡 The token will be automatically used by the GitHub Actions workflow"
    echo "   when you push a new tag (e.g., git tag v1.0.3 && git push --tags)"
    echo ""
    echo "⚠️  Important: Keep this token secure and don't share it publicly!"
    echo "   The token will be masked in GitHub Actions logs."
else
    echo "❌ Failed to generate token. Please try again manually:"
    echo "   npm token create --automation --description='$TOKEN_DESC'"
fi
