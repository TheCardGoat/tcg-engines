<script lang="ts">
  import { useLorcanaBoardPresenter } from "@/features/simulator/context/game-context.svelte.js";
  import type { ResolvedQuestAnimation } from "@/features/simulator/animations/quest-animations.js";
  import { watchCssAnimation } from "@/features/simulator/animations/animation-shared.js";

  const board = useLorcanaBoardPresenter();
  const questAnimations = $derived(board.questAnimations);

  function onQuestAnimationFinished(id: string): void {
    board.onQuestAnimationFinished(id);
  }

  function getAnimationStyle(animation: ResolvedQuestAnimation): string {
    const dx = animation.destinationRect.centerX - animation.sourceRect.centerX;
    const dy = animation.destinationRect.centerY - animation.sourceRect.centerY;
    const arcY = Math.min(-30, dy * 0.3 - 20);

    return [
      `left:${animation.sourceRect.centerX}px`,
      `top:${animation.sourceRect.centerY}px`,
      `--quest-fly-dx:${dx}px`,
      `--quest-fly-dy:${dy}px`,
      `--quest-fly-arc-y:${arcY}px`,
      `--quest-fly-duration:${animation.durationMs}ms`,
    ].join(";");
  }
</script>

<div class="quest-animation-layer" aria-hidden="true">
  {#each questAnimations as animation (animation.id)}
    <div
      class="quest-lore-pill"
      style={getAnimationStyle(animation)}
      use:watchCssAnimation={{ id: animation.id, onFinished: onQuestAnimationFinished }}
    >
      <span class="quest-lore-pill__icon">&#9670;</span>
      <span class="quest-lore-pill__value">{animation.loreGained}</span>
    </div>
  {/each}
</div>

<style>
  .quest-animation-layer {
    position: absolute;
    inset: 0;
    overflow: visible;
    pointer-events: none;
    z-index: 26;
  }

  .quest-lore-pill {
    position: absolute;
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.25rem 0.65rem;
    border-radius: 999px;
    background: linear-gradient(135deg, #f5c842 0%, #d4a017 50%, #c8961e 100%);
    border: 1.5px solid rgba(255, 230, 130, 0.8);
    box-shadow:
      0 0 14px rgba(245, 200, 66, 0.55),
      0 4px 12px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.35);
    color: #3a2800;
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.03em;
    white-space: nowrap;
    transform: translate(-50%, -50%);
    animation: quest-lore-fly var(--quest-fly-duration, 500ms) cubic-bezier(0.22, 0.68, 0.36, 1) both;
    will-change: transform, opacity;
  }

  .quest-lore-pill__icon {
    font-size: 0.72rem;
    color: #5a3e00;
  }

  .quest-lore-pill__value {
    font-variant-numeric: tabular-nums;
  }

  @keyframes quest-lore-fly {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.6);
    }
    12% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.15);
    }
    25% {
      transform: translate(
        calc(-50% + var(--quest-fly-dx) * 0.25),
        calc(-50% + var(--quest-fly-arc-y))
      ) scale(1.05);
    }
    70% {
      opacity: 1;
      transform: translate(
        calc(-50% + var(--quest-fly-dx) * 0.85),
        calc(-50% + var(--quest-fly-dy) * 0.85)
      ) scale(0.95);
    }
    100% {
      opacity: 0;
      transform: translate(
        calc(-50% + var(--quest-fly-dx)),
        calc(-50% + var(--quest-fly-dy))
      ) scale(0.7);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .quest-lore-pill {
      animation: none;
    }
  }

  @media (hover: none) and (pointer: coarse) {
    .quest-lore-pill {
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    }
  }
</style>
