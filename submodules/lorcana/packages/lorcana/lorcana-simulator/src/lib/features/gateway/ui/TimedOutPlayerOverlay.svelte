<script lang="ts">
  import Hourglass from "@lucide/svelte/icons/hourglass";
  import Minus from "@lucide/svelte/icons/minus";
  import Maximize2 from "@lucide/svelte/icons/maximize-2";

  interface Props {
    /** Whether the skip-turn button should be shown */
    canSkip?: boolean;
    /** Whether the drop button should be shown */
    canDrop?: boolean;
    /** Whether the viewer is a spectator (hides action buttons) */
    isSpectator?: boolean;
    /** Called when the user clicks "Skip Their Turn" — opens a confirmation dialog upstream */
    onSkip?: () => void;
    /** Called when the user clicks "Drop Opponent" — opens a confirmation dialog upstream */
    onDrop?: () => void;
  }

  const {
    canSkip = false,
    canDrop = false,
    isSpectator = false,
    onSkip,
    onDrop,
  }: Props = $props();

  let minimized = $state(false);
</script>

{#if minimized}
  <button
    type="button"
    class="timeout-pill"
    onclick={() => { minimized = false; }}
    aria-label="Opponent's time expired — expand options"
  >
    <span class="timeout-pill__icon">
      <Hourglass size={14} strokeWidth={2} />
    </span>
    <span class="timeout-pill__label">Time expired</span>
    <span class="timeout-pill__expand" aria-hidden="true">
      <Maximize2 size={12} strokeWidth={2} />
    </span>
  </button>
{:else}
  <div class="timeout-overlay" role="status" aria-live="polite">
    <div class="timeout-overlay__content">
      <button
        type="button"
        class="timeout-overlay__minimize"
        onclick={() => { minimized = true; }}
        aria-label="Minimize"
      >
        <Minus size={14} strokeWidth={2.2} />
      </button>

      <div class="timeout-icon">
        <Hourglass size={28} strokeWidth={1.8} />
      </div>

      <span class="timeout-overlay__label">Opponent's time expired</span>

      {#if !isSpectator}
        <div class="timeout-overlay__actions">
          {#if canSkip}
            <button class="skip-button" onclick={onSkip}>Skip Their Turn</button>
          {/if}
          {#if canDrop}
            <button class="drop-button" onclick={onDrop}>Drop Opponent</button>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .timeout-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    border-radius: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    background: radial-gradient(
      ellipse at 50% 50%,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.48) 100%
    );
    animation: overlay-fade-in 0.4s ease-out both;
  }

  @keyframes overlay-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .timeout-overlay__content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    pointer-events: auto;
    padding: 1.25rem 1.5rem 1rem;
    border-radius: 16px;
    background: rgba(5, 10, 22, 0.82);
    border: 1px solid rgba(251, 191, 36, 0.22);
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.4),
      0 8px 32px rgba(0, 0, 0, 0.55),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .timeout-overlay__minimize {
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    color: rgba(255, 255, 255, 0.7);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .timeout-overlay__minimize:hover {
    color: white;
    background: rgba(255, 255, 255, 0.12);
  }

  .timeout-icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(251, 191, 36, 0.12);
    border: 1.5px solid rgba(251, 191, 36, 0.3);
    color: rgba(251, 191, 36, 0.9);
    animation: timeout-pulse 2s ease-in-out infinite;
  }

  @keyframes timeout-pulse {
    0%, 100% { transform: scale(1);    opacity: 0.8; box-shadow: 0 0 8px  rgba(251, 191, 36, 0.15); }
    50%       { transform: scale(1.05); opacity: 1;   box-shadow: 0 0 20px rgba(251, 191, 36, 0.30); }
  }

  .timeout-overlay__label {
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(251, 191, 36, 0.9);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  }

  .timeout-overlay__actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .skip-button,
  .drop-button {
    padding: 0.35rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .skip-button {
    background: rgba(99, 102, 241, 0.7);
    border: 1px solid rgba(99, 102, 241, 0.5);
    box-shadow: 0 0 12px rgba(99, 102, 241, 0.2);
  }

  .skip-button:hover {
    background: rgba(99, 102, 241, 0.9);
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
    transform: translateY(-1px);
  }

  .drop-button {
    background: rgba(251, 191, 36, 0.7);
    border: 1px solid rgba(251, 191, 36, 0.5);
    animation: drop-btn-glow 2.5s ease-in-out infinite;
  }

  .drop-button:hover {
    background: rgba(251, 191, 36, 0.9);
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
    transform: translateY(-1px);
  }

  .skip-button:active,
  .drop-button:active {
    transform: translateY(0);
  }

  @keyframes drop-btn-glow {
    0%, 100% { box-shadow: 0 0 10px rgba(251, 191, 36, 0.15); }
    50%       { box-shadow: 0 0 18px rgba(251, 191, 36, 0.35); }
  }

  .timeout-pill {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 10;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.6rem;
    border-radius: 999px;
    background: rgba(5, 10, 22, 0.78);
    border: 1px solid rgba(251, 191, 36, 0.35);
    color: rgba(251, 191, 36, 0.95);
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: pointer;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
    transition: all 0.15s ease;
    animation: pill-fade-in 0.25s ease-out both;
  }

  .timeout-pill:hover {
    background: rgba(5, 10, 22, 0.92);
    border-color: rgba(251, 191, 36, 0.6);
    box-shadow: 0 0 14px rgba(251, 191, 36, 0.25);
  }

  .timeout-pill__icon {
    display: inline-flex;
    animation: timeout-pulse 2s ease-in-out infinite;
  }

  .timeout-pill__expand {
    display: inline-flex;
    opacity: 0.7;
  }

  @keyframes pill-fade-in {
    from { opacity: 0; transform: translateY(-2px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .timeout-overlay { animation: none; }
    .timeout-icon    { animation: none; }
    .drop-button     { animation: none; }
    .timeout-pill    { animation: none; }
    .timeout-pill__icon { animation: none; }
  }
</style>
