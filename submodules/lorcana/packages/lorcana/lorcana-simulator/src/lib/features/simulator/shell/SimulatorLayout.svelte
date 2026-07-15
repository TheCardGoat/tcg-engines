<script lang="ts">
  import type { Snippet } from "svelte";

  interface SimulatorLayoutProps {
    // Content snippets
    leftPanel?: Snippet;
    mainContent: Snippet;
    rightPanel?: Snippet;

    // State
    statusMessage?: string;
    errorMessage?: string | null;
  }

  let {
    leftPanel,
    mainContent,
    rightPanel,
    statusMessage = "Ready",
    errorMessage = null,
  }: SimulatorLayoutProps = $props();
</script>

<div class="simulator-layout">
  {#if leftPanel}
    <aside class="panel panel--left" aria-label="Game state">
      {@render leftPanel()}
    </aside>
  {/if}

  <main class="board-column" aria-label="Tabletop">
    {@render mainContent()}
  </main>

  {#if rightPanel}
    <aside class="panel panel--right" aria-label="Inspector and actions">
      {@render rightPanel()}
    </aside>
  {/if}

  {#if errorMessage}
    <div class="error-toast" role="alert">
      {errorMessage}
    </div>
  {/if}

  <div class="status-bar">
    <span class="status-message">{statusMessage}</span>
  </div>
</div>

<style>
  .simulator-layout {
    --bg: #070f1b;
    --panel-bg: rgba(9, 16, 28, 0.92);
    --panel-border: rgba(113, 154, 204, 0.3);
    --text-primary: #e5edf7;
    --text-muted: #9db2ca;

    height: 100vh;
    height: 100dvh;
    max-height: 100vh;
    max-height: 100dvh;
    display: grid;
    grid-template-columns: 320px minmax(0, 1fr) 320px;
    background:
      radial-gradient(circle at 10% -5%, rgba(40, 74, 115, 0.5), transparent 55%),
      radial-gradient(circle at 95% 0%, rgba(32, 78, 70, 0.22), transparent 60%),
      var(--bg);
    color: var(--text-primary);
    font-family: "Trebuchet MS", "Segoe UI", sans-serif;
    overflow: hidden;
    position: relative;
  }

  .panel {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    padding: 0.95rem;
    background: var(--panel-bg);
    border: 1px solid var(--panel-border);
    overflow-y: auto;
  }

  .panel--left {
    border-right-width: 1px;
    border-left: none;
  }

  .panel--right {
    border-left-width: 1px;
    border-right: none;
  }

  .board-column {
    min-width: 0;
    display: flex;
    flex-direction: column;
    padding: 0.7rem 0.7rem 0.9rem;
    overflow: hidden;
  }

  .status-bar {
    position: absolute;
    bottom: 0;
    left: 320px;
    right: 320px;
    padding: 0.35rem 0.75rem;
    background: rgba(7, 14, 24, 0.95);
    border-top: 1px solid rgba(108, 145, 192, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .status-message {
    font-size: 0.75rem;
    color: #c9daef;
  }

  .error-toast {
    position: absolute;
    bottom: 3rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    border: 1px solid rgba(245, 101, 101, 0.48);
    background: rgba(95, 28, 33, 0.95);
    color: #ffd3d7;
    font-size: 0.85rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    z-index: 200;
    animation: slide-up 200ms ease;
  }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  /* Scrollbar styling */
  .panel::-webkit-scrollbar {
    width: 6px;
  }

  .panel::-webkit-scrollbar-track {
    background: rgba(15, 30, 50, 0.3);
  }

  .panel::-webkit-scrollbar-thumb {
    background: rgba(100, 150, 200, 0.3);
    border-radius: 3px;
  }

  /* Responsive */
  @media (max-width: 1500px) {
    .simulator-layout {
      grid-template-columns: 290px minmax(0, 1fr) 300px;
    }

    .status-bar {
      left: 290px;
      right: 300px;
    }
  }

  @media (max-width: 1240px) {
    .simulator-layout {
      grid-template-columns: 280px minmax(0, 1fr);
      grid-template-rows: minmax(0, 1fr) auto;
    }

    .panel--right {
      grid-column: 1 / span 2;
      border-top: 1px solid var(--panel-border);
      border-left: none;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      align-items: start;
      max-height: 300px;
    }

    .status-bar {
      left: 280px;
      right: 0;
    }
  }

  @media (max-width: 980px) {
    .simulator-layout {
      grid-template-columns: 1fr;
      grid-template-rows: auto minmax(0, 1fr) auto;
      height: 100vh;
      height: 100dvh;
    }

    .panel--left {
      border-right: none;
      border-bottom: 1px solid var(--panel-border);
      max-height: 34dvh;
      overflow: auto;
    }

    .panel--right {
      grid-column: 1;
      border-top: 1px solid var(--panel-border);
      grid-template-columns: 1fr;
      max-height: 34vh;
      overflow: auto;
    }

    .board-column {
      padding: 0.5rem;
    }

    .status-bar {
      left: 0;
      right: 0;
    }
  }
</style>
