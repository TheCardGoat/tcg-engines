<script lang="ts">
  import type { LorcanaCardSnapshot } from "$lib/lorcana-simulator";
  import { getManualModeContext } from "@/features/manual-mode/manual-mode-context.svelte.js";

  interface Props {
    card: LorcanaCardSnapshot;
  }

  const { card }: Props = $props();
  const manualMode = getManualModeContext();
  const enabled = $derived(manualMode?.enabled ?? false);
  const damage = $derived(card.damage ?? 0);
  const inPlay = $derived(card.zoneId === "play");

  function handleDelta(delta: number, event: MouseEvent): void {
    // Stop the click from selecting the card or triggering drag handlers.
    event.preventDefault();
    event.stopPropagation();
    if (!manualMode) return;
    manualMode.setDamage(card.cardId, Math.max(0, damage + delta));
  }
</script>

{#if enabled && inPlay}
  <div class="manual-damage" aria-label="Manual damage controls">
    <button
      type="button"
      class="manual-damage__btn"
      aria-label={`Decrease damage on ${card.label}`}
      disabled={damage <= 0}
      onclick={(event) => handleDelta(-1, event)}
    >−</button>
    <span class="manual-damage__value" aria-label={`Current damage: ${damage}`}>{damage}</span>
    <button
      type="button"
      class="manual-damage__btn"
      aria-label={`Increase damage on ${card.label}`}
      onclick={(event) => handleDelta(1, event)}
    >+</button>
  </div>
{/if}

<style>
  .manual-damage {
    position: absolute;
    z-index: 8;
    top: 0.25rem;
    right: 0.25rem;
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.18rem 0.32rem;
    border-radius: 9999px;
    background: rgba(15, 23, 42, 0.92);
    border: 1px solid rgba(99, 102, 241, 0.55);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
    pointer-events: auto;
  }

  .manual-damage__value {
    min-width: 1.2rem;
    text-align: center;
    color: #fecaca;
    font-size: 0.78rem;
    font-weight: 800;
    line-height: 1;
  }

  .manual-damage__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.35rem;
    height: 1.35rem;
    border-radius: 9999px;
    border: 1px solid rgba(99, 102, 241, 0.6);
    background: rgba(99, 102, 241, 0.18);
    color: #e0e7ff;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1;
    cursor: pointer;
    transition: background 120ms ease, transform 120ms ease;
  }

  .manual-damage__btn:hover:not(:disabled) {
    background: rgba(99, 102, 241, 0.4);
  }

  .manual-damage__btn:active:not(:disabled) {
    transform: scale(0.92);
  }

  .manual-damage__btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
