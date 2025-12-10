#!/bin/bash
# System setup script for TCG Engines
# This script sets up the development environment with all required tools
# Optimized for Docker and non-interactive environments
#
# Security Note: This script uses `curl | bash` pattern for convenience.
# While this is common for development tooling, users should review the
# installation scripts from fnm and Bun before running if security is a concern.

set -e  # Exit on error

# Detect if running in non-interactive mode (Docker, CI/CD)
NON_INTERACTIVE=false
if [ -z "${PS1:-}" ] || [ -t 0 ] && [ -z "${CI:-}" ] && [ -z "${DOCKER:-}" ]; then
    # Check if we're in a TTY or have CI/DOCKER env vars
    if [ ! -t 0 ] || [ -n "${CI:-}" ] || [ -n "${DOCKER:-}" ]; then
        NON_INTERACTIVE=true
    fi
fi

# For Docker/CI, assume non-interactive
if [ -f /.dockerenv ] || [ -n "${CI:-}" ] || [ -n "${GITHUB_ACTIONS:-}" ]; then
    NON_INTERACTIVE=true
fi

echo "🚀 Setting up TCG Engines development environment..."
if [ "$NON_INTERACTIVE" = true ]; then
    echo "   (Running in non-interactive mode)"
fi
echo ""

# Check if running on macOS/Linux
if [[ "$OSTYPE" != "linux-gnu"* && "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script is designed for macOS and Linux. For Windows, please follow the manual setup instructions in agents.md"
    exit 1
fi

# Function to ensure PATH includes a directory
ensure_path() {
    local dir="$1"
    if [ -d "$dir" ] && [[ ":$PATH:" != *":$dir:"* ]]; then
        export PATH="$dir:$PATH"
    fi
}

# Step 1: Install fnm (Fast Node Manager)
echo "📦 Step 1: Installing fnm (Fast Node Manager)..."
if command -v fnm &> /dev/null; then
    echo "✅ fnm is already installed"
else
    curl -fsSL https://fnm.vercel.app/install | bash
    echo "✅ fnm installed successfully"
    
    # fnm installs to ~/.local/share/fnm on Linux
    FNM_PATH="$HOME/.local/share/fnm"
    if [ -d "$FNM_PATH" ]; then
        ensure_path "$FNM_PATH"
        # Try to initialize fnm - use --shell bash for explicit shell
        if [ -f "$FNM_PATH/fnm" ]; then
            export PATH="$FNM_PATH:$PATH"
        fi
        # Evaluate fnm environment
        eval "$($FNM_PATH/fnm env --shell bash 2>/dev/null || $FNM_PATH/fnm env 2>/dev/null || true)" || true
    fi
    
    # Verify fnm is now available
    if ! command -v fnm &> /dev/null; then
        echo "❌ ERROR: fnm installed but not available in PATH"
        echo "   FNM_PATH: $FNM_PATH"
        echo "   PATH: $PATH"
        exit 1
    fi
fi
echo ""

# Step 2: Install Node.js using fnm
echo "📦 Step 2: Installing Node.js 24..."
if ! command -v fnm &> /dev/null; then
    echo "❌ ERROR: fnm not found in PATH"
    exit 1
fi

# Ensure fnm environment is set up
FNM_PATH="${FNM_PATH:-$HOME/.local/share/fnm}"
if [ -d "$FNM_PATH" ]; then
    ensure_path "$FNM_PATH"
    eval "$($FNM_PATH/fnm env --shell bash 2>/dev/null || $FNM_PATH/fnm env 2>/dev/null || true)" || true
fi

fnm install 24 --install-if-missing
fnm use 24 --install-if-missing

# Verify Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js not found after installation"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js 24 installed: $NODE_VERSION"
echo ""

# Step 3: Verify Node.js installation
echo "🔍 Step 3: Verifying Node.js installation..."
NODE_VERSION=$(node -v 2>/dev/null || echo "")
if [[ "$NODE_VERSION" =~ ^v24\. ]]; then
    echo "✅ Node.js version: $NODE_VERSION"
else
    echo "⚠️  Node.js version is $NODE_VERSION (expected v24.x)"
    # In non-interactive mode, try to fix it
    if [ "$NON_INTERACTIVE" = true ]; then
        fnm use 24 || true
        NODE_VERSION=$(node -v 2>/dev/null || echo "")
        if [[ "$NODE_VERSION" =~ ^v24\. ]]; then
            echo "✅ Node.js version fixed: $NODE_VERSION"
        fi
    fi
fi

NPM_VERSION=$(npm -v 2>/dev/null || echo "")
echo "✅ npm version: $NPM_VERSION"
echo ""

# Step 4: Install Bun
echo "📦 Step 4: Installing Bun..."
if command -v bun &> /dev/null; then
    BUN_VERSION=$(bun -v)
    echo "✅ Bun is already installed: $BUN_VERSION"
else
    curl -fsSL https://bun.sh/install | bash
    echo "✅ Bun installed successfully"
fi

# Always ensure bun/bin is in PATH (even if bun was already installed)
ensure_path "$HOME/.bun/bin"

# Verify bun is available
if ! command -v bun &> /dev/null; then
    echo "❌ ERROR: Bun installed but not available in PATH"
    echo "   Bun path: $HOME/.bun/bin"
    echo "   PATH: $PATH"
    exit 1
fi
echo ""

# Step 5: Verify Bun installation
echo "🔍 Step 5: Verifying Bun installation..."
BUN_VERSION=$(bun -v)
echo "✅ Bun version: $BUN_VERSION"

# Check if version meets minimum requirement
if [[ "$BUN_VERSION" =~ ^1\.2\.([0-9]+) ]] && [[ "${BASH_REMATCH[1]}" -ge 18 ]] || [[ "$BUN_VERSION" =~ ^1\.([3-9]|[0-9]{2,}) ]]; then
    echo "✅ Bun version meets requirement (1.2.18+)"
else
    echo "⚠️  Bun version $BUN_VERSION may be below required 1.2.18"
fi

# Verify bunx is available
ensure_path "$HOME/.bun/bin"
if command -v bunx &> /dev/null; then
    echo "✅ bunx command is available"
else
    # bunx should be in the same directory as bun
    if [ -f "$HOME/.bun/bin/bunx" ]; then
        ensure_path "$HOME/.bun/bin"
        if command -v bunx &> /dev/null; then
            echo "✅ bunx command is now available"
        else
            echo "⚠️  WARNING: bunx command not found (may cause issues with scripts using bunx)"
        fi
    else
        echo "⚠️  WARNING: bunx command not found (may cause issues with scripts using bunx)"
    fi
fi
echo ""

# Step 6: Install project dependencies
echo "📦 Step 6: Installing project dependencies..."
if ! command -v bun &> /dev/null; then
    echo "❌ ERROR: Bun not available for installing dependencies"
    exit 1
fi

bun install
echo "✅ Dependencies installed"
echo ""

# Final verification
echo "🔍 Final verification..."
echo "   node: $(command -v node) ($(node -v))"
echo "   npm:  $(command -v npm) ($(npm -v))"
echo "   bun:  $(command -v bun) ($(bun -v))"
if command -v bunx &> /dev/null; then
    echo "   bunx: $(command -v bunx)"
else
    echo "   bunx: not found"
fi
echo ""

echo "✨ Setup complete!"
if [ "$NON_INTERACTIVE" = false ]; then
    echo ""
    echo "📝 Next steps:"
    echo "   1. Verify installations:"
    echo "      - node -v  (should show v24.x)"
    echo "      - npm -v   (should show 11.x)"
    echo "      - bun -v   (should show 1.2.18 or later)"
    echo "      - bunx --version  (should be available)"
    echo "   2. Run project commands:"
    echo "      - bun run build"
    echo "      - bun test"
    echo "      - bun run ci-check"
fi
echo ""
