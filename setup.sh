#!/bin/bash
# System setup script for TCG Engines
# This script sets up the development environment with all required tools
#
# Security Note: This script uses `curl | bash` pattern for convenience.
# While this is common for development tooling, users should review the
# installation scripts from fnm and Bun before running if security is a concern.

set -e  # Exit on error

echo "🚀 Setting up TCG Engines development environment..."
echo ""

# Check if running on macOS/Linux
if [[ "$OSTYPE" != "linux-gnu"* && "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script is designed for macOS and Linux. For Windows, please follow the manual setup instructions in agents.md"
    exit 1
fi

# Detect shell configuration file
if [ -n "$ZSH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.bashrc"
else
    SHELL_CONFIG="$HOME/.profile"
fi

# Step 1: Install fnm (Fast Node Manager)
echo "📦 Step 1: Installing fnm (Fast Node Manager)..."
if command -v fnm &> /dev/null; then
    echo "✅ fnm is already installed"
else
    curl -o- https://fnm.vercel.app/install | bash
    echo "✅ fnm installed successfully"
    
    # Try to source fnm in current session
    # fnm installs to ~/.local/share/fnm on Linux
    FNM_PATH="$HOME/.local/share/fnm"
    if [ -d "$FNM_PATH" ]; then
        export PATH="$FNM_PATH:$PATH"
        eval "$(fnm env --shell bash)" 2>/dev/null || eval "$(fnm env)" 2>/dev/null || true
    fi
    
    # Also try sourcing from shell config if fnm still not available
    if ! command -v fnm &> /dev/null && [ -f "$SHELL_CONFIG" ]; then
        # Source just the fnm-related lines from shell config
        if grep -q "fnm" "$SHELL_CONFIG"; then
            source "$SHELL_CONFIG" 2>/dev/null || true
        fi
    fi
    
    if ! command -v fnm &> /dev/null; then
        echo "⚠️  fnm installed but not in PATH. Please restart your terminal or run: source $SHELL_CONFIG"
    fi
fi
echo ""

# Step 2: Install Node.js using fnm
echo "📦 Step 2: Installing Node.js 24..."
# Try to use fnm if available
if command -v fnm &> /dev/null; then
    fnm install 24
    fnm use 24
    echo "✅ Node.js 24 installed"
else
    echo "⚠️  fnm not found in PATH. Please restart your terminal and run this script again, or install Node.js manually."
    exit 1
fi
echo ""

# Step 3: Verify Node.js installation
echo "🔍 Step 3: Verifying Node.js installation..."
NODE_VERSION=$(node -v 2>/dev/null || echo "")
if [[ "$NODE_VERSION" =~ ^v24\. ]]; then
    echo "✅ Node.js version: $NODE_VERSION"
else
    echo "⚠️  Node.js version is $NODE_VERSION (expected v24.x)"
    echo "   You may need to run: fnm use 24"
fi

NPM_VERSION=$(npm -v 2>/dev/null || echo "")
echo "✅ npm version: $NPM_VERSION"
echo ""

# Step 4: Install Bun
echo "📦 Step 4: Installing Bun..."
if command -v bun &> /dev/null; then
    BUN_VERSION=$(bun -v)
    echo "✅ Bun is already installed: $BUN_VERSION"
    # Ensure bun/bin is in PATH even if bun is already installed
    if [ -d "$HOME/.bun/bin" ] && [[ ":$PATH:" != *":$HOME/.bun/bin:"* ]]; then
        export PATH="$HOME/.bun/bin:$PATH"
    fi
else
    curl -fsSL https://bun.sh/install | bash
    echo "✅ Bun installed successfully"
    
    # Add bun to PATH for current session
    if [ -d "$HOME/.bun/bin" ]; then
        export PATH="$HOME/.bun/bin:$PATH"
    fi
    
    if ! command -v bun &> /dev/null; then
        echo "⚠️  Bun installed but not in PATH. Please restart your terminal or run: source $SHELL_CONFIG"
        echo "   Or manually add to PATH: export PATH=\"\$HOME/.bun/bin:\$PATH\""
    fi
fi
echo ""

# Step 5: Verify Bun installation
echo "🔍 Step 5: Verifying Bun installation..."
if command -v bun &> /dev/null; then
    BUN_VERSION=$(bun -v)
    echo "✅ Bun version: $BUN_VERSION"
    # Check if version meets minimum requirement
    if [[ "$BUN_VERSION" =~ ^1\.2\.([0-9]+) ]] && [[ "${BASH_REMATCH[1]}" -ge 18 ]] || [[ "$BUN_VERSION" =~ ^1\.([3-9]|[0-9]{2,}) ]]; then
        echo "✅ Bun version meets requirement (1.2.18+)"
    else
        echo "⚠️  Bun version $BUN_VERSION may be below required 1.2.18"
    fi
    
    # Verify bunx is available
    if command -v bunx &> /dev/null; then
        echo "✅ bunx command is available"
    else
        # Try to find bunx in bun's bin directory
        if [ -f "$HOME/.bun/bin/bunx" ]; then
            export PATH="$HOME/.bun/bin:$PATH"
            if command -v bunx &> /dev/null; then
                echo "✅ bunx command is now available"
            else
                echo "⚠️  bunx command not found. This may cause issues with scripts using bunx."
                echo "   Try: export PATH=\"\$HOME/.bun/bin:\$PATH\""
            fi
        else
            echo "⚠️  bunx command not found. This may cause issues with scripts using bunx."
            echo "   Try: export PATH=\"\$HOME/.bun/bin:\$PATH\""
        fi
    fi
else
    echo "⚠️  Bun not found in PATH. Please restart your terminal and verify installation."
fi
echo ""

# Step 6: Install project dependencies
echo "📦 Step 6: Installing project dependencies..."
if command -v bun &> /dev/null; then
    bun install
    echo "✅ Dependencies installed"
else
    echo "⚠️  Bun not available. Please install Bun and run: bun install"
fi
echo ""

echo "✨ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Restart your terminal to ensure all tools are in PATH"
echo "   2. Verify installations:"
echo "      - node -v  (should show v24.x)"
echo "      - npm -v   (should show 11.x)"
echo "      - bun -v   (should show 1.2.18 or later)"
echo "      - bunx --version  (should be available)"
echo "   3. Run project commands:"
echo "      - bun run build"
echo "      - bun test"
echo "      - bun run ci-check"
echo ""

