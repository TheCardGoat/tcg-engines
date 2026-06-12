<script lang="ts">
  import { useLorcanaBoardPresenter } from "@/features/simulator/context/game-context.svelte.js";
  import ChallengeAimOverlay from "@/features/simulator/board/ChallengeAimOverlay.svelte";
  import ChallengeResultPanel from "@/features/simulator/board/ChallengeResultPanel.svelte";
  import type { ResolvedChallengeAnimation } from "@/features/simulator/animations/challenge-animations.js";
  import type { ChallengePreviewResult } from "@tcg/lorcana-engine";
  import type { BoardLocalRect } from "@/features/simulator/animations/board-move-animations.js";
  import { watchCssAnimation } from "@/features/simulator/animations/animation-shared.js";

  const board = useLorcanaBoardPresenter();
  const challengeAnimations = $derived(board.challengeAnimations);

  function onChallengeAnimationFinished(id: string): void {
    board.onChallengeAnimationFinished(id);
  }
  const cardSnapshotsById = $derived(board.cardSnapshotsById);
  const bottomSide = $derived(board.bottomSide);

  let layerWidth = $state(0);
  let layerHeight = $state(0);

  function buildPreview(animation: ResolvedChallengeAnimation): ChallengePreviewResult {
    return {
      attackerId: animation.attackerId as never,
      defenderId: animation.defenderId as never,
      defenderKind: animation.preview.defenderKind,
      attackerCurrentDamage: 0,
      defenderCurrentDamage: 0,
      attackerNextDamage: 0,
      defenderNextDamage: 0,
      attackerWillpower: 0,
      defenderWillpower: 0,
      attackerDamageDealt: animation.preview.attackerDamageDealt,
      defenderDamageDealt: animation.preview.defenderDamageDealt,
      attackerWouldBeBanished: animation.preview.attackerWouldBeBanished,
      defenderWouldBeBanished: animation.preview.defenderWouldBeBanished,
      attackerDamageIsReduced: animation.preview.attackerDamageIsReduced,
      defenderDamageIsReduced: animation.preview.defenderDamageIsReduced,
    };
  }

  function getTargetPoint(rect: BoardLocalRect): { x: number; y: number } {
    return { x: rect.centerX, y: rect.centerY };
  }

  function hasBanish(animation: ResolvedChallengeAnimation): boolean {
    return animation.preview.attackerWouldBeBanished || animation.preview.defenderWouldBeBanished;
  }

  function badgeStyle(x: number, y: number): string {
    return `left:${x}px;top:${y}px;transform:translate(-50%,-50%);`;
  }
</script>

<div class="challenge-animation-layer" aria-hidden="true" bind:clientWidth={layerWidth} bind:clientHeight={layerHeight}>
  {#each challengeAnimations as animation (animation.id)}
    <div
      class="challenge-animation-wrapper"
      style="--challenge-animation-duration:{animation.durationMs}ms"
      use:watchCssAnimation={{ id: animation.id, onFinished: onChallengeAnimationFinished }}
    >
      {#if !hasBanish(animation)}
        <ChallengeAimOverlay
          width={layerWidth}
          height={layerHeight}
          sourceRect={animation.sourceRect}
          targetPoint={getTargetPoint(animation.destinationRect)}
          lockedTargetRect={animation.destinationRect}
          preview={buildPreview(animation)}
        />
      {:else}
        <!-- When any card is banished, suppress the arrow (it would point to an empty grid slot).
             Show only a subtle damage badge for the surviving card, if it took damage. -->
        {#if !animation.preview.attackerWouldBeBanished && animation.preview.defenderDamageDealt > 0}
          <div
            class="challenge-damage-badge"
            style={badgeStyle(animation.sourceRect.centerX, animation.sourceRect.centerY)}
          >
            -{animation.preview.defenderDamageDealt}
          </div>
        {/if}
        {#if !animation.preview.defenderWouldBeBanished && animation.preview.attackerDamageDealt > 0}
          <div
            class="challenge-damage-badge"
            style={badgeStyle(animation.destinationRect.centerX, animation.destinationRect.centerY)}
          >
            -{animation.preview.attackerDamageDealt}
          </div>
        {/if}
      {/if}
    </div>
  {/each}
</div>

{#each challengeAnimations as animation (animation.id)}
  <ChallengeResultPanel
    {animation}
    attackerCard={cardSnapshotsById[animation.attackerId] ?? null}
    defenderCard={cardSnapshotsById[animation.defenderId] ?? null}
    {bottomSide}
  />
{/each}

<style>
  .challenge-animation-layer {
    position: absolute;
    inset: 0;
    overflow: visible;
    pointer-events: none;
    z-index: 27;
  }

  .challenge-animation-wrapper {
    position: absolute;
    inset: 0;
    pointer-events: none;
    animation: challenge-animation-lifecycle var(--challenge-animation-duration, 500ms) ease both;
  }

  @keyframes challenge-animation-lifecycle {
    0% {
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    85% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .challenge-damage-badge {
    position: absolute;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(15, 23, 42, 0.85);
    padding: 0.2rem 0.55rem;
    font-size: 0.6rem;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgb(253, 230, 138);
    box-shadow: 0 10px 28px rgba(15, 23, 42, 0.45);
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .challenge-animation-wrapper {
      animation: none;
    }
  }
</style>
