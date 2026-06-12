<script lang="ts">
  import { Bot, CircleHelp, SkipForward, ArrowLeftRight } from "@lucide/svelte";
  import { AUTOMATED_ACTION_STRATEGIES } from "@tcg/lorcana-engine";
  import type { AiControllableOrchestrator } from "./context.js";
  import type { AiSpeed } from "./types.js";

  interface AiPlayerControlsProps {
    orchestrator: AiControllableOrchestrator;
  }

  let { orchestrator }: AiPlayerControlsProps = $props();

  const state = $derived(orchestrator.state);
  const isAiTurn = $derived(
    state.mode === "ai-thinking" || state.mode === "ai-paused",
  );
  const isTakeover = $derived(state.mode === "takeover");
  const isTerminal = $derived(state.mode === "complete" || state.mode === "error");

  function handleSpeedChange(event: Event): void {
    orchestrator.setSpeed((event.currentTarget as HTMLSelectElement).value as AiSpeed);
  }

  function handleStrategyChange(event: Event): void {
    orchestrator.setStrategy((event.currentTarget as HTMLSelectElement).value);
  }
</script>

<div class="ai-controls">
  <div class="ai-badge-row">
    <Bot size={14} strokeWidth={2.5} />
    <span class="ai-label">{state.strategyLabel}</span>
    <span class="ai-mode-badge" class:ai-mode-badge--active={isAiTurn}>
      {#if state.mode === "ai-thinking"}
        Thinking...
      {:else if state.mode === "ai-paused"}
        Paused
      {:else if state.mode === "takeover"}
        You control
      {:else if state.mode === "complete"}
        Done
      {:else if state.mode === "error"}
        Error
      {:else}
        Waiting
      {/if}
    </span>
  </div>

  <div class="ai-strategy-row">
    <label class="ai-control-label" for="ai-strategy">
      Strategy
      <span class="help-icon" title="The AI decision-making strategy. Change mid-game to try different play styles.">
        <CircleHelp size={10} />
      </span>
    </label>
    <select
      id="ai-strategy"
      class="ai-select"
      value={state.strategyId}
      onchange={handleStrategyChange}
      disabled={isTerminal}
    >
      {#each AUTOMATED_ACTION_STRATEGIES as option}
        <option value={option.id}>{option.label}</option>
      {/each}
    </select>
  </div>

  <div class="ai-speed-row">
    <label class="ai-control-label" for="ai-speed">
      Speed
      <span class="help-icon" title="How fast the AI executes actions in auto mode.">
        <CircleHelp size={10} />
      </span>
    </label>
    <select
      id="ai-speed"
      class="ai-select"
      value={state.aiSpeed}
      onchange={handleSpeedChange}
      disabled={isTerminal || isTakeover}
    >
      <option value="fast">Fast</option>
      <option value="balanced">Balanced</option>
      <option value="slow">Slow</option>
    </select>
  </div>

  <div class="ai-mode-row">
    <label class="ai-control-label" for="ai-mode">
      Mode
      <span class="help-icon" title="Step mode pauses after each AI action. Auto mode plays continuously.">
        <CircleHelp size={10} />
      </span>
    </label>
    <div class="ai-mode-toggle">
      <button
        type="button"
        class="mode-btn"
        class:mode-btn--active={state.aiPlayMode === "step"}
        onclick={() => { if (state.aiPlayMode !== "step") orchestrator.togglePlayMode(); }}
        disabled={isTerminal || isTakeover}
        title="Execute one AI action at a time"
      >
        Step
      </button>
      <button
        type="button"
        class="mode-btn"
        class:mode-btn--active={state.aiPlayMode === "auto"}
        onclick={() => { if (state.aiPlayMode !== "auto") orchestrator.togglePlayMode(); }}
        disabled={isTerminal || isTakeover}
        title="AI plays continuously at the selected speed"
      >
        Auto
      </button>
    </div>
  </div>

  {#if state.aiPlayMode === "step"}
    <button
      type="button"
      class="ai-action-btn"
      onclick={() => orchestrator.stepAi()}
      disabled={state.mode !== "ai-paused"}
      title="Execute the next AI action"
    >
      <SkipForward size={12} />
      Next
    </button>
  {/if}

  <button
    type="button"
    class="ai-takeover-btn"
    class:ai-takeover-btn--active={isTakeover}
    onclick={() => isTakeover ? orchestrator.releaseTakeover() : orchestrator.takeover()}
    disabled={isTerminal}
    title={isTakeover
      ? "Release control back to the AI"
      : "Take control of the AI side to play manually"}
  >
    <ArrowLeftRight size={12} />
    {isTakeover ? "Release to AI" : "Take Control"}
    <span class="help-icon" title="Swap perspective to play as the AI side. The board flips so the AI's cards are at the bottom.">
      <CircleHelp size={10} />
    </span>
  </button>

  {#if state.error}
    <div class="ai-error">{state.error}</div>
  {/if}
</div>

<style>
  .ai-controls {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 0.35rem 0;
    border-top: 1px solid rgba(109, 149, 195, 0.16);
    margin-top: 0.2rem;
  }

  .ai-badge-row {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.7rem;
    color: #94a3b8;
  }

  .ai-badge-row :global(svg) {
    color: #60a5fa;
    flex-shrink: 0;
  }

  .ai-label {
    font-weight: 600;
    color: #cbd5e1;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ai-mode-badge {
    font-size: 0.58rem;
    padding: 0.08rem 0.35rem;
    border-radius: 999px;
    background: rgba(51, 65, 85, 0.6);
    border: 1px solid rgba(100, 116, 139, 0.3);
    color: #94a3b8;
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
  }

  .ai-mode-badge--active {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(96, 165, 250, 0.3);
    color: #93c5fd;
  }

  .ai-strategy-row,
  .ai-speed-row {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .ai-control-label {
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #64748b;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.2rem;
  }

  .ai-select {
    flex: 1;
    min-width: 0;
    font-size: 0.68rem;
    padding: 0.15rem 0.3rem;
    border-radius: 0.35rem;
    border: 1px solid rgba(100, 116, 139, 0.25);
    background: rgba(15, 23, 42, 0.7);
    color: #e2e8f0;
    cursor: pointer;
    outline: none;
  }

  .ai-select:focus {
    border-color: rgba(96, 165, 250, 0.5);
  }

  .ai-select:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .ai-mode-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    margin-top: 0.15rem;
  }

  .ai-mode-toggle {
    display: flex;
    border-radius: 0.4rem;
    overflow: hidden;
    border: 1px solid rgba(100, 116, 139, 0.3);
    flex: 1;
  }

  .mode-btn {
    flex: 1;
    font-size: 0.72rem;
    font-weight: 600;
    padding: 0.32rem 0.6rem;
    background: rgba(15, 23, 42, 0.7);
    color: #94a3b8;
    border: none;
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
  }

  .mode-btn:hover:not(:disabled) {
    background: rgba(30, 41, 59, 0.8);
  }

  .mode-btn--active {
    background: rgba(59, 130, 246, 0.2);
    color: #93c5fd;
  }

  .mode-btn:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .mode-btn + .mode-btn {
    border-left: 1px solid rgba(100, 116, 139, 0.25);
  }

  .ai-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    font-size: 0.65rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 0.35rem;
    border: 1px solid rgba(96, 165, 250, 0.3);
    background: rgba(59, 130, 246, 0.12);
    color: #93c5fd;
    cursor: pointer;
    transition: background 120ms ease;
  }

  .ai-action-btn:hover:not(:disabled) {
    background: rgba(59, 130, 246, 0.22);
  }

  .ai-action-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .ai-takeover-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    font-size: 0.62rem;
    font-weight: 600;
    padding: 0.22rem 0.5rem;
    border-radius: 0.35rem;
    border: 1px solid rgba(100, 116, 139, 0.25);
    background: rgba(15, 23, 42, 0.7);
    color: #94a3b8;
    cursor: pointer;
    transition: background 120ms ease, border-color 120ms ease, color 120ms ease;
  }

  .ai-takeover-btn:hover:not(:disabled) {
    background: rgba(30, 41, 59, 0.8);
    border-color: rgba(100, 116, 139, 0.4);
    color: #cbd5e1;
  }

  .ai-takeover-btn--active {
    background: rgba(234, 179, 8, 0.12);
    border-color: rgba(234, 179, 8, 0.3);
    color: #fde68a;
  }

  .ai-takeover-btn--active:hover:not(:disabled) {
    background: rgba(234, 179, 8, 0.2);
  }

  .ai-takeover-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }

  .ai-error {
    font-size: 0.62rem;
    padding: 0.2rem 0.35rem;
    border-radius: 0.3rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: #fca5a5;
  }

  .help-icon {
    display: inline-flex;
    align-items: center;
    color: #475569;
    cursor: help;
  }

  .help-icon:hover {
    color: #64748b;
  }
</style>
