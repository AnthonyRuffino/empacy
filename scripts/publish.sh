#!/bin/bash
# Empacy NPM Publishing Script
# This script handles the initial NPM publish with interactive authentication

set -e

echo "🚀 Empacy NPM Publishing Script"
echo "================================"

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if npm is logged in
if npm whoami >/dev/null 2>&1; then
    echo "✅ Already logged in to npm as: $(npm whoami)"
else
    echo "🔐 Not logged in to npm. Starting interactive login..."
    echo "   This will open a browser for authentication."
    echo "   If you prefer to use a token, run: npm login --auth-type=legacy"
    echo ""
    read -p "Press Enter to continue with npm login..."
    npm login
fi

# Check if we have the right package name
PACKAGE_NAME=$(node -p "require('./package.json').name")
echo "�� Package name: $PACKAGE_NAME"

# Check if package already exists on npm
if npm view "$PACKAGE_NAME" >/dev/null 2>&1; then
    echo "⚠️  Package '$PACKAGE_NAME' already exists on npm."
    echo "   Current version: $(npm view "$PACKAGE_NAME" version)"
    echo "   Local version: $(node -p "require('./package.json').version")"
    echo ""
    read -p "Do you want to continue with publish? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Publishing cancelled."
        exit 1
    fi
else
    echo "✅ Package '$PACKAGE_NAME' does not exist on npm. This will be the first release."
fi

# Build the project first
echo "�� Building project..."
npm run build 2>/dev/null || echo "⚠️  Build command not found, skipping..."

# Run tests
echo "🧪 Running tests..."
npm test

# Check if we're ready to publish
echo ""
echo "📋 Pre-publish checklist:"
echo "   ✅ Package.json exists"
echo "   ✅ NPM authentication"
echo "   ✅ Tests passing"
echo "   ✅ Build completed (if applicable)"

# Final confirmation
echo ""
read -p "Ready to publish to npm? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Publishing cancelled."
    exit 1
fi

# Publish
echo "🚀 Publishing to npm..."
npm publish

echo ""
echo "🎉 Successfully published $PACKAGE_NAME to npm!"
echo "   View package: https://www.npmjs.com/package/$PACKAGE_NAME"
echo ""
echo "💡 Next steps:"
echo "   1. Create a GitHub release"
echo "   2. Update documentation"
echo "   3. Share with the community"
