<script lang="ts">
    import type {LorcanaPlayerSide} from "@/features/simulator/model/contracts.js";

  interface TurnPhaseBarProps {
    turnNumber: number;
    phase?: string;
    step?: string;
    activeSide?: LorcanaPlayerSide;
  }

  let { turnNumber, phase, step, activeSide }: TurnPhaseBarProps = $props();

  const activeLabel = $derived(
    activeSide === "playerOne"
      ? "Player One"
      : activeSide === "playerTwo"
        ? "Player Two"
        : "No Active Player",
  );

  const phaseLabel = $derived(phase ? phase.toUpperCase() : "-");
  const stepLabel = $derived(step ? step.toUpperCase() : "-");
</script>

<div class="turn-phase-bar" role="status" aria-live="polite">
  <span class="pill">Turn {turnNumber}</span>
  <span class="divider" aria-hidden="true">•</span>
  <span class="pill">{phaseLabel}</span>
  <span class="divider" aria-hidden="true">•</span>
  <span class="pill">{stepLabel}</span>
  <span class="divider" aria-hidden="true">•</span>
  <span class="pill" class:pill--p1={activeSide === "playerOne"} class:pill--p2={activeSide === "playerTwo"}>
    {activeLabel}
  </span>
</div>

<style>
  .turn-phase-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    padding: 0.5rem 0.75rem;
    border-radius: 999px;
    background: rgba(7, 14, 24, 0.92);
    border: 1px solid rgba(108, 145, 192, 0.32);
    backdrop-filter: blur(8px);
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .pill {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #dbeafe;
  }

  .pill--p1 {
    color: #7cc4ff;
  }

  .pill--p2 {
    color: #ff8f8f;
  }

  .divider {
    color: rgba(148, 163, 184, 0.65);
    font-size: 0.72rem;
  }
</style>
