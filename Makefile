# Empacy MCP Server - Makefile
# Provides common development operations and shortcuts

.PHONY: help install test test-watch test-coverage lint lint-fix format clean docker-build docker-run docker-test setup-dev setup-ci git-init git-commit git-tag npm-login npm-token-generate npm-publish-interactive npm-publish npm-version-patch npm-version-minor npm-version-major npm-release-patch npm-release-minor npm-release-major quality-check quality-fix build-prod dev start

# Default target
help:
	@echo "Empacy MCP Server - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  install      - Install dependencies"
	@echo "  test         - Run tests"
	@echo "  test-watch   - Run tests in watch mode"
	@echo "  test-coverage- Run tests with coverage"
	@echo "  lint         - Run ESLint"
	@echo "  lint-fix     - Fix ESLint issues"
	@echo "  format       - Format code with Prettier"
	@echo "  clean        - Clean build artifacts"
	@echo ""
	@echo "Docker:"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-run   - Run Docker container"
	@echo "  docker-test  - Run tests in Docker"
	@echo ""
	@echo "NPM Publishing:"
	@echo "  npm-login           - Login to npm interactively"
	@echo "  npm-token-generate  - Generate npm authentication token"
	@echo "  npm-publish-interactive - Interactive npm publish with checks"
	@echo "  npm-publish         - Direct npm publish"
	@echo "  npm-version-patch   - Bump patch version and push tags"
	@echo "  npm-version-minor   - Bump minor version and push tags"
	@echo "  npm-version-major   - Bump major version and push tags"
	@echo "  npm-release-patch   - Bump patch version and publish"
	@echo "  npm-release-minor   - Bump minor version and publish"
	@echo "  npm-release-major   - Bump major version and publish"
	@echo ""
	@echo "Setup:"
	@echo "  setup-dev    - Setup development environment"
	@echo "  setup-ci     - Setup CI environment"
	@echo ""

# Development commands
install:
	npm install

test:
	npm test

test-watch:
	npm run test:watch

test-coverage:
	npm run test:coverage

lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

clean:
	rm -rf node_modules
	rm -rf coverage
	rm -rf .nyc_output
	rm -rf dist
	rm -rf build

# Docker commands
docker-build:
	docker build -t empacy .

docker-run:
	docker run -p 3000:3000 empacy

docker-test:
	docker run --rm empacy npm test

# Setup commands
setup-dev:
	npm run setup:dev

setup-ci:
	npm run setup:ci

# Git operations
git-init:
	git init
	git branch -m main
	git add .
	git commit -m "Initial commit: Empacy MCP Server setup"

git-commit:
	git add .
	git commit -m "$(message)"

git-tag:
	git tag -a v$(version) -m "Release $(version)"
	git push origin v$(version)

# NPM Publishing
npm-login:
	npm login

npm-token-generate:
	./scripts/generate-token.sh

npm-publish-interactive:
	./scripts/publish.sh

npm-publish:
	npm publish

npm-version-patch:
	npm version patch
	git push --follow-tags

npm-version-minor:
	npm version minor
	git push --follow-tags

npm-version-major:
	npm version major
	git push --follow-tags

npm-release-patch: npm-version-patch
	npm publish

npm-release-minor: npm-version-minor
	npm publish

npm-release-major: npm-version-major
	npm publish

# Quality checks
quality-check:
	npm run lint
	npm run format:check
	npm test

quality-fix:
	npm run lint:fix
	npm run format

# Production build
build-prod:
	npm ci --only=production
	docker build -t empacy:latest .

# Development server
dev:
	npm run dev

# Start production server
start:
	npm start
