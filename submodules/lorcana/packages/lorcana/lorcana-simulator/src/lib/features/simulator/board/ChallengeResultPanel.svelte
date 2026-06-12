<script lang="ts">
  import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
  import type { LorcanaCardSnapshot, LorcanaPlayerSide } from "@/features/simulator/model/contracts.js";
  import type { ResolvedChallengeAnimation } from "@/features/simulator/animations/challenge-animations.js";
  import { m } from "$lib/i18n/messages.js";

  // Teleport: moves the panel to document.body so position:fixed is always
  // relative to the viewport, regardless of CSS transforms on ancestors.
  function teleport(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        node.remove();
      },
    };
  }

  interface ChallengeResultPanelProps {
    animation: ResolvedChallengeAnimation;
    attackerCard: LorcanaCardSnapshot | null;
    defenderCard: LorcanaCardSnapshot | null;
    bottomSide: LorcanaPlayerSide;
  }

  let { animation, attackerCard, defenderCard, bottomSide }: ChallengeResultPanelProps = $props();

  // The bottom side's card is shown at the bottom, top side's at the top — mirrors the board.
  const attackerIsBottom = $derived(animation.actorSide === bottomSide);

  const topCard = $derived(attackerIsBottom ? defenderCard : attackerCard);
  const bottomCard = $derived(attackerIsBottom ? attackerCard : defenderCard);

  // Arrow points toward the defender.
  // Up = attacker is bottom player (arrow goes up toward opponent).
  // Down = attacker is top player (arrow goes down toward local player).
  const arrowPointsUp = $derived(attackerIsBottom);

  const dealDamage = $derived(animation.preview.attackerDamageDealt);
  const takeDamage = $derived(animation.preview.defenderDamageDealt);
  const isCharacterChallenge = $derived(animation.preview.defenderKind === "character");

  const topCardBanished = $derived(attackerIsBottom ? animation.preview.defenderWouldBeBanished : animation.preview.attackerWouldBeBanished);
  const bottomCardBanished = $derived(attackerIsBottom ? animation.preview.attackerWouldBeBanished : animation.preview.defenderWouldBeBanished);

  const arrowMarkerId = $derived(`challenge-result-arrow-${animation.id}`);
</script>

<div
  use:teleport
  class="challenge-result-panel"
  style="--duration:{animation.durationMs}ms"
  aria-hidden="true"
>
  <!-- Top card (opponent or local depending on attacker) -->
  <div class="card-slot">
    {#if topCard}
      <LorcanaCard
        card={topCard}
        size="small"
        isExerted={false}
        isBanishedPreview={topCardBanished}
      />
    {:else}
      <div class="card-placeholder"></div>
    {/if}
    {#if topCardBanished}
      <span class="banish-badge">{m["sim.challengePreview.banished"]({})}</span>
    {/if}
  </div>

  <!-- Arrow connecting the two cards, pointing toward the defender -->
  <div class="arrow-area">
    <svg
      class="arrow-svg"
      viewBox="0 0 20 60"
      aria-hidden="true"
      overflow="visible"
    >
      <defs>
        <marker
          id={arrowMarkerId}
          markerWidth="10"
          markerHeight="10"
          refX="8.5"
          refY="5"
          orient="auto"
        >
          <path d="M 0 1 L 8.5 5 L 0 9 Q 2.8 5 0 1" class="fill-amber-300" />
        </marker>
      </defs>

      {#if arrowPointsUp}
        <!-- Attacker is at bottom → arrow points up (y decreases toward defender) -->
        <line x1="10" y1="56" x2="10" y2="8"
          class="stroke-slate-950/55" stroke-width="14" stroke-linecap="round" />
        <line x1="10" y1="56" x2="10" y2="8"
          class="stroke-amber-300/95" stroke-width="8" stroke-linecap="round"
          marker-end="url(#{arrowMarkerId})" />
      {:else}
        <!-- Attacker is at top → arrow points down -->
        <line x1="10" y1="4" x2="10" y2="52"
          class="stroke-slate-950/55" stroke-width="14" stroke-linecap="round" />
        <line x1="10" y1="4" x2="10" y2="52"
          class="stroke-amber-300/95" stroke-width="8" stroke-linecap="round"
          marker-end="url(#{arrowMarkerId})" />
      {/if}
    </svg>

    <!-- DEAL badge near the defender (top of arrow if up, bottom if down) -->
    <span class="deal-badge" class:near-top={arrowPointsUp} class:near-bottom={!arrowPointsUp}>
      {m["sim.challengePreview.deal"]({})} {dealDamage}
    </span>

    <!-- TAKE badge near the attacker (bottom of arrow if up, top if down), only for character challenges -->
    {#if isCharacterChallenge}
      <span class="take-badge" class:near-bottom={arrowPointsUp} class:near-top={!arrowPointsUp}>
        {m["sim.challengePreview.take"]({})} {takeDamage}
      </span>
    {/if}
  </div>

  <!-- Bottom card -->
  <div class="card-slot">
    {#if bottomCard}
      <LorcanaCard
        card={bottomCard}
        size="small"
        isExerted={false}
        isBanishedPreview={bottomCardBanished}
      />
    {:else}
      <div class="card-placeholder"></div>
    {/if}
    {#if bottomCardBanished}
      <span class="banish-badge">{m["sim.challengePreview.banished"]({})}</span>
    {/if}
  </div>
</div>

<style>
  .challenge-result-panel {
    position: fixed;
    right: 1.5rem;
    top: 50%;
    z-index: 50;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    background: rgba(9, 16, 28, 0.96);
    border: 1px solid rgba(113, 154, 204, 0.25);
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    animation: challenge-result-panel-lifecycle var(--duration, 1000ms) ease both;
  }

  @keyframes challenge-result-panel-lifecycle {
    0% {
      opacity: 0;
      transform: translate3d(120%, -50%, 0);
    }
    8% {
      opacity: 1;
      transform: translate3d(0, -50%, 0);
    }
    88% {
      opacity: 1;
      transform: translate3d(0, -50%, 0);
    }
    100% {
      opacity: 0;
      transform: translate3d(0, -50%, 0);
    }
  }

  .card-slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .card-placeholder {
    width: 90px;
    height: 126px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .arrow-area {
    position: relative;
    width: 100%;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .arrow-svg {
    width: 20px;
    height: 60px;
    flex-shrink: 0;
  }

  .deal-badge,
  .take-badge,
  .banish-badge {
    position: absolute;
    border-radius: 999px;
    padding: 0.2rem 0.55rem;
    font-size: 0.6rem;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .deal-badge {
    border: 1px solid rgba(167, 243, 208, 0.5);
    background: rgba(16, 185, 129, 0.92);
    color: white;
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
    right: 0;
  }

  .take-badge {
    border: 1px solid rgba(253, 164, 175, 0.45);
    background: rgba(244, 63, 94, 0.92);
    color: white;
    box-shadow: 0 6px 16px rgba(244, 63, 94, 0.32);
    left: 0;
  }

  .banish-badge {
    position: static;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(15, 23, 42, 0.85);
    color: rgb(253, 230, 138);
    letter-spacing: 0.2em;
    font-size: 0.58rem;
    box-shadow: 0 10px 28px rgba(15, 23, 42, 0.45);
  }

  .near-top {
    top: 6px;
  }

  .near-bottom {
    bottom: 6px;
  }

  @media (prefers-reduced-motion: reduce) {
    .challenge-result-panel {
      animation: none;
    }
  }
</style>
