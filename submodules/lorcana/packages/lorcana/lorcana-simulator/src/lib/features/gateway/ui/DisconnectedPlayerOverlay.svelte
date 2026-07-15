<script lang="ts">
  import { Button } from "$lib/design-system/primitives/button";
  import Maximize2 from "@lucide/svelte/icons/maximize-2";
  import Minus from "@lucide/svelte/icons/minus";
  import WifiOff from "@lucide/svelte/icons/wifi-off";

  interface Props {
    /** "opponent" shows countdown + drop button; "self" shows reconnecting state */
    variant: "opponent" | "self";
    /** Seconds remaining before drop is allowed (opponent mode only) */
    secondsRemaining?: number;
    /** Whether the drop button should be shown (opponent mode only) */
    canDrop?: boolean;
    /** Whether the viewer is a spectator (hides drop button) */
    isSpectator?: boolean;
    /** Callback to drop the opponent */
    onDrop?: () => void;
    /**
     * DEPLOYMENT CACHE STRATEGY: When true, shows a softer "Updating server…"
     * message instead of "Connection lost". Set when the server announced a
     * graceful shutdown (deploy) before the socket closed.
     */
    isServerDeploy?: boolean;
  }

  const {
    variant,
    secondsRemaining = 30,
    canDrop = false,
    isSpectator = false,
    onDrop,
    isServerDeploy = false,
  }: Props = $props();

  let confirmingDrop = $state(false);
  let minimized = $state(false);

  // Countdown ring geometry
  const RING_RADIUS = 38;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
  const MAX_SECONDS = 30;

  const ringProgress = $derived(
    variant === "opponent"
      ? RING_CIRCUMFERENCE * (1 - Math.min(secondsRemaining, MAX_SECONDS) / MAX_SECONDS)
      : 0,
  );

  function handleDropClick(): void {
    if (confirmingDrop) {
      confirmingDrop = false;
      onDrop?.();
    } else {
      confirmingDrop = true;
    }
  }

  function cancelDrop(): void {
    confirmingDrop = false;
  }
</script>

{#if variant === "opponent" && minimized}
  <button
    type="button"
    class="disconnect-pill"
    class:disconnect-pill--ready={canDrop}
    onclick={() => { minimized = false; }}
    aria-label="Opponent disconnected — expand options"
  >
    <span class="disconnect-pill__icon">
      {#if canDrop}
        <WifiOff size={14} strokeWidth={2} />
      {:else}
        <span class="disconnect-pill__count">{secondsRemaining}</span>
      {/if}
    </span>
    <span class="disconnect-pill__label">
      {canDrop ? "Disconnected" : "Disconnecting"}
    </span>
    <span class="disconnect-pill__expand" aria-hidden="true">
      <Maximize2 size={12} strokeWidth={2} />
    </span>
  </button>
{:else}
<div
  class="disconnect-overlay"
  class:disconnect-overlay--can-drop={canDrop && variant === "opponent"}
  role="status"
  aria-live="polite"
>
  <div class="disconnect-overlay__content">
    {#if variant === "opponent"}
      <button
        type="button"
        class="disconnect-overlay__minimize"
        onclick={() => { minimized = true; confirmingDrop = false; }}
        aria-label="Minimize"
      >
        <Minus size={14} strokeWidth={2.2} />
      </button>
      <!-- Countdown ring -->
      <div class="countdown-ring">
        <svg viewBox="0 0 96 96" class="countdown-ring__svg">
          <!-- Track -->
          <circle
            cx="48" cy="48" r={RING_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            stroke-width="3"
          />
          <!-- Progress -->
          <circle
            cx="48" cy="48" r={RING_RADIUS}
            fill="none"
            stroke={canDrop ? "#ef4444" : "rgba(252,165,165,0.7)"}
            stroke-width="3"
            stroke-linecap="round"
            stroke-dasharray={RING_CIRCUMFERENCE}
            stroke-dashoffset={ringProgress}
            class="countdown-ring__progress"
            transform="rotate(-90 48 48)"
          />
        </svg>
        <span class="countdown-ring__value" class:countdown-ring__value--ready={canDrop}>
          {#if canDrop}
            <WifiOff size={24} strokeWidth={2} />
          {:else}
            {secondsRemaining}
          {/if}
        </span>
      </div>

      <span class="disconnect-overlay__label">
        {#if canDrop}
          Opponent has disconnected
        {:else}
          Opponent disconnected
        {/if}
      </span>

      {#if canDrop && !isSpectator}
        <div class="disconnect-overlay__actions">
          {#if confirmingDrop}
            <Button variant="destructive" size="sm" onclick={handleDropClick}>
              Confirm Drop
            </Button>
            <Button variant="outline" size="sm" onclick={cancelDrop}>
              Cancel
            </Button>
          {:else}
            <button class="drop-button" onclick={handleDropClick}>
              Drop Opponent
            </button>
          {/if}
        </div>
      {/if}

    {:else}
      <!-- Self-disconnect: reconnecting state -->
      <div class="reconnecting-icon">
        <WifiOff size={28} strokeWidth={1.8} />
      </div>
      <span class="disconnect-overlay__label">
        {isServerDeploy ? "Updating server" : "Connection lost"}
      </span>
      <span class="disconnect-overlay__sublabel">
        Reconnecting&hellip;
      </span>
    {/if}
  </div>
</div>
{/if}

<style>
  .disconnect-overlay {
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
    to { opacity: 1; }
  }

  .disconnect-overlay__content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    pointer-events: auto;
    padding: 1.25rem 1.5rem 1rem;
    border-radius: 16px;
    background: rgba(5, 10, 22, 0.82);
    border: 1px solid rgba(239, 68, 68, 0.22);
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.4),
      0 8px 32px rgba(0, 0, 0, 0.55),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .disconnect-overlay__minimize {
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

  .disconnect-overlay__minimize:hover {
    color: white;
    background: rgba(255, 255, 255, 0.12);
  }

  /* ---- Minimized pill ---- */

  .disconnect-pill {
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
    border: 1px solid rgba(252, 165, 165, 0.35);
    color: rgba(252, 165, 165, 0.95);
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

  .disconnect-pill:hover {
    background: rgba(5, 10, 22, 0.92);
    border-color: rgba(239, 68, 68, 0.6);
    box-shadow: 0 0 14px rgba(239, 68, 68, 0.25);
  }

  .disconnect-pill--ready {
    border-color: rgba(239, 68, 68, 0.55);
    color: #fca5a5;
    animation: pill-fade-in 0.25s ease-out both, pulse-glow 2s ease-in-out infinite;
  }

  .disconnect-pill__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 14px;
  }

  .disconnect-pill__count {
    font-variant-numeric: tabular-nums;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .disconnect-pill__expand {
    display: inline-flex;
    opacity: 0.7;
  }

  @keyframes pill-fade-in {
    from { opacity: 0; transform: translateY(-2px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ---- Countdown Ring (Opponent) ---- */

  .countdown-ring {
    position: relative;
    width: 80px;
    height: 80px;
  }

  .countdown-ring__svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.25));
  }

  .countdown-ring__progress {
    transition: stroke-dashoffset 1s linear, stroke 0.3s ease;
  }

  .countdown-ring__value {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
    letter-spacing: -0.02em;
  }

  .countdown-ring__value--ready {
    color: #fca5a5;
    animation: pulse-glow 2s ease-in-out infinite;
  }

  @keyframes pulse-glow {
    0%, 100% { opacity: 0.85; filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.3)); }
    50% { opacity: 1; filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.6)); }
  }

  /* ---- Reconnecting Icon (Self) ---- */

  .reconnecting-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(252, 165, 165, 0.85);
    animation: reconnect-pulse 2.5s ease-in-out infinite;
  }

  @keyframes reconnect-pulse {
    0%, 100% { transform: scale(1); opacity: 0.75; }
    50% { transform: scale(1.06); opacity: 1; }
  }

  /* ---- Labels ---- */

  .disconnect-overlay__label {
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(252, 165, 165, 0.9);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
  }

  .disconnect-overlay__sublabel {
    font-size: 0.7rem;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.02em;
  }

  /* ---- Drop Button ---- */

  .disconnect-overlay__actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .drop-button {
    padding: 0.35rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: white;
    background: rgba(239, 68, 68, 0.8);
    border: 1px solid rgba(239, 68, 68, 0.5);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 0 12px rgba(239, 68, 68, 0.25);
    animation: drop-btn-glow 2.5s ease-in-out infinite;
  }

  .drop-button:hover {
    background: rgba(239, 68, 68, 0.95);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.45);
    transform: translateY(-1px);
  }

  .drop-button:active {
    transform: translateY(0);
  }

  @keyframes drop-btn-glow {
    0%, 100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.2); }
    50% { box-shadow: 0 0 18px rgba(239, 68, 68, 0.4); }
  }

  @media (prefers-reduced-motion: reduce) {
    .disconnect-overlay { animation: none; }
    .countdown-ring__value--ready { animation: none; }
    .reconnecting-icon { animation: none; }
    .drop-button { animation: none; }
    .disconnect-pill { animation: none; }
    .disconnect-pill--ready { animation: none; }
  }
</style>
