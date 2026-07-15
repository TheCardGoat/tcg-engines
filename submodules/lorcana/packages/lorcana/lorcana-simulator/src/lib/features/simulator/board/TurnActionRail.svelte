<script lang="ts">
  import Flag from "@lucide/svelte/icons/flag";
  import { m } from "$lib/i18n/messages.js";
  import PlayerTimer from "@/features/simulator/panels/PlayerTimer.svelte";
  import type { ClockSnapshot } from "@tcg/lorcana-engine";
  import type { ConfirmableDirectMoveCategoryId } from "@/features/simulator/model/direct-action-state.js";

  interface TurnActionRailProps {
    timer?: ClockSnapshot;
    timerLabel?: string;
    /** Whether the timer is showing the local player's own clock */
    isOwnClock?: boolean;
    canPassTurn?: boolean;
    armedCategoryId?: ConfirmableDirectMoveCategoryId | null;
    onPassTurn?: () => void;
  }

  let {
    timer,
    timerLabel = "Clock",
    isOwnClock = false,
    canPassTurn = false,
    armedCategoryId = null,
    onPassTurn,
  }: TurnActionRailProps = $props();

  const passTurnArmed = $derived(armedCategoryId === "pass-turn");
  const passTurnLabel = $derived(
    passTurnArmed
      ? m["sim.actions.confirmMoveLabel"]({ label: m["sim.actions.label.passTurn"]({}) })
      : m["sim.actions.label.passTurn"]({}),
  );
</script>

{#if timer || canPassTurn}
  <aside class="turn-action-rail" aria-label="Turn actions">
    {#if timer}
      <div class="turn-action-rail__timer">
        <PlayerTimer
          snapshot={timer}
          {isOwnClock}
          variant="rail"
          label={timerLabel}
        />
      </div>
    {/if}

    <div class="turn-action-rail__actions">
      {#if canPassTurn}
        <button
          type="button"
          class="turn-action-button turn-action-button--primary"
          class:turn-action-button--armed={passTurnArmed}
          onclick={onPassTurn}
          aria-label={passTurnLabel}
        >
          <span class="turn-action-button__header">
            <Flag class="size-4" />
            <span>{passTurnLabel}</span>
          </span>
        </button>
      {/if}
    </div>
  </aside>
{/if}

<style>
  .turn-action-rail {
    position: absolute;
    left: 0;
    right: 0;
    bottom: env(safe-area-inset-bottom);
    z-index: 30;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 0.9rem;
    pointer-events: none;
  }

  .turn-action-rail__timer {
    display: flex;
    align-items: flex-end;
    width: min(10.5rem, calc(100vw - 2rem));
    min-width: 0;
    pointer-events: auto;
    margin-left: 0;
  }

  .turn-action-rail__actions {
    display: grid;
    justify-items: end;
    gap: 0.45rem;
    width: min(13.5rem, calc(100vw - 2rem));
    min-width: 0;
    pointer-events: auto;
    margin-left: auto;
    margin-right: 0;
  }

  .turn-action-button {
    display: grid;
    gap: 0.28rem;
    width: 100%;
    padding: 0.7rem 0.8rem;
    border-radius: 0.95rem;
    border: 1px solid rgba(148, 163, 184, 0.22);
    background:
      linear-gradient(180deg, rgba(11, 21, 38, 0.98), rgba(7, 14, 24, 0.98));
    color: #eff6ff;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      0 14px 32px rgba(2, 6, 23, 0.32);
    text-align: left;
    transition:
      transform 160ms ease,
      border-color 160ms ease,
      background 160ms ease,
      box-shadow 160ms ease;
  }

  .turn-action-button:hover {
    transform: translateX(-1px);
    border-color: rgba(125, 211, 252, 0.34);
  }

  .turn-action-button--primary {
    border-color: rgba(250, 204, 21, 0.28);
    background:
      linear-gradient(180deg, rgba(113, 63, 18, 0.92), rgba(68, 34, 10, 0.98));
    color: #fff7db;
  }

  .turn-action-button--armed {
    border-color: rgba(251, 191, 36, 0.58);
    box-shadow:
      0 0 0 1px rgba(251, 191, 36, 0.24),
      0 14px 32px rgba(2, 6, 23, 0.34),
      inset 0 1px 0 rgba(255, 255, 255, 0.07);
  }

  .turn-action-button__header {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.82rem;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: 0.03em;
  }

  @media (max-width: 1439px) {
    .turn-action-rail {
      gap: 0.7rem;
    }

    .turn-action-rail__timer {
      width: min(9.5rem, calc(100vw - 2rem));
    }

    .turn-action-rail__actions {
      width: min(12.25rem, calc(100vw - 2rem));
    }

    .turn-action-button {
      padding: 0.62rem 0.72rem;
    }
  }
</style>
