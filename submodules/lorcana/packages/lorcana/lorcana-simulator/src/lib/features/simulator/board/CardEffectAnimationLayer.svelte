<script lang="ts">
  import { useLorcanaBoardPresenter } from "@/features/simulator/context/game-context.svelte.js";
  import type { ResolvedCardEffectAnimation } from "@/features/simulator/animations/card-effect-animations.js";
  import { watchCssAnimation } from "@/features/simulator/animations/animation-shared.js";
  import type { BoardLocalRect } from "@/features/simulator/animations/board-move-animations.js";

  const board = useLorcanaBoardPresenter();
  const cardEffectAnimations = $derived(board.cardEffectAnimations);
  let layerWidth = $state(0);
  let layerHeight = $state(0);

  function onCardEffectAnimationFinished(id: string): void {
    board.onCardEffectAnimationFinished(id);
  }

  function getGlowStyle(animation: ResolvedCardEffectAnimation): string {
    const rect = animation.sourceRect;
    const size = Math.max(rect.width, rect.height) * 1.6;
    return [
      `left:${rect.centerX - size / 2}px`,
      `top:${rect.centerY - size / 2}px`,
      `width:${size}px`,
      `height:${size}px`,
      `--card-effect-duration:${animation.durationMs}ms`,
    ].join(";");
  }

  function markerId(animation: ResolvedCardEffectAnimation, index: number): string {
    return `card-effect-shot-${animation.id}-${index}`.replace(/[^a-zA-Z0-9_-]/g, "-");
  }

  function beamPath(
    sourceRect: BoardLocalRect,
    targetRect: BoardLocalRect,
    index: number,
    count: number,
  ): string {
    const offset = (index - (count - 1) / 2) * 16;
    const startX = sourceRect.centerX;
    const startY = sourceRect.centerY + offset;
    const endX = targetRect.centerX;
    const endY = targetRect.centerY;
    const controlX = startX + (endX - startX) * 0.52;
    const controlY = Math.min(startY, endY) - 42 - index * 6;

    return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
  }

  function targetFrameStyle(rect: BoardLocalRect): string {
    return [
      `left:${rect.x}px`,
      `top:${rect.y}px`,
      `width:${rect.width}px`,
      `height:${rect.height}px`,
    ].join(";");
  }

  function targetBadgeStyle(rect: BoardLocalRect, index: number, count: number): string {
    const offset = (index - (count - 1) / 2) * 24;
    return `left:${rect.centerX + offset}px;top:${rect.centerY}px;--card-effect-badge-x:${offset}px;`;
  }

  function targetBanishBadgeStyle(rect: BoardLocalRect, index: number, count: number): string {
    const offset = (index - (count - 1) / 2) * 24;
    return `left:${rect.centerX + offset}px;top:${rect.y + rect.height + 18}px;`;
  }
</script>

<div
  class="card-effect-animation-layer"
  aria-hidden="true"
  bind:clientWidth={layerWidth}
  bind:clientHeight={layerHeight}
>
  {#each cardEffectAnimations as animation (animation.id)}
    <div>
      <div
        class="card-effect-glow"
        class:card-effect-glow--activate={animation.effectKind === "activate-ability"}
        class:card-effect-glow--sing={animation.effectKind === "sing"}
        class:card-effect-glow--resolve={animation.effectKind === "resolve-effect"}
        class:card-effect-glow--damage={animation.damageTargets.length > 0}
        style={getGlowStyle(animation)}
        use:watchCssAnimation={{ id: animation.id, onFinished: onCardEffectAnimationFinished }}
      ></div>

      {#if animation.damageTargets.length > 0 && layerWidth > 0 && layerHeight > 0}
        <svg
          class="card-effect-shot-svg"
          viewBox={`0 0 ${layerWidth} ${layerHeight}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {#each animation.damageTargets as target, index (`${animation.id}:marker:${target.cardId}:${index}`)}
              <marker
                id={markerId(animation, index)}
                markerWidth="9"
                markerHeight="9"
                refX="7.5"
                refY="4.5"
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path d="M 0 1 L 7.5 4.5 L 0 8 Q 2.5 4.5 0 1" class="card-effect-marker" />
              </marker>
            {/each}
          </defs>

          {#each animation.damageTargets as target, index (`${animation.id}:shot:${target.cardId}:${index}`)}
            <path
              d={beamPath(animation.sourceRect, target.targetRect, index, animation.damageTargets.length)}
              class="card-effect-shot-shadow"
              pathLength="1"
            />
            <path
              d={beamPath(animation.sourceRect, target.targetRect, index, animation.damageTargets.length)}
              class="card-effect-shot"
              marker-end={`url(#${markerId(animation, index)})`}
              pathLength="1"
            />
            <path
              d={beamPath(animation.sourceRect, target.targetRect, index, animation.damageTargets.length)}
              class="card-effect-shot-hot"
              pathLength="1"
            />
          {/each}
        </svg>

        {#each animation.damageTargets as target, index (`${animation.id}:target:${target.cardId}:${index}`)}
          <div
            class:card-effect-target-frame={true}
            class:card-effect-target-frame--banished={target.wasBanished}
            data-card-effect-target={target.cardId}
            style={targetFrameStyle(target.targetRect)}
          ></div>
          <div
            class="card-effect-impact-ring"
            data-card-effect-target={target.cardId}
            style={targetBadgeStyle(target.targetRect, index, animation.damageTargets.length)}
          ></div>
          <div
            class:card-effect-damage-badge={true}
            class:card-effect-damage-badge--banished={target.wasBanished}
            data-card-effect-target={target.cardId}
            style={targetBadgeStyle(target.targetRect, index, animation.damageTargets.length)}
          >
            -{target.amount}
          </div>
          {#if target.wasBanished}
            <div
              class="card-effect-banish-badge"
              data-card-effect-target={target.cardId}
              style={targetBanishBadgeStyle(target.targetRect, index, animation.damageTargets.length)}
            >
              Banished
            </div>
          {/if}
        {/each}
      {/if}
    </div>
  {/each}
</div>

<style>
  .card-effect-animation-layer {
    position: absolute;
    inset: 0;
    overflow: visible;
    pointer-events: none;
    z-index: 31;
  }

  .card-effect-glow {
    position: absolute;
    border-radius: 999px;
    pointer-events: none;
    animation: card-effect-pulse var(--card-effect-duration, 400ms) ease-out both;
  }

  .card-effect-shot-svg {
    position: absolute;
    inset: 0;
    overflow: visible;
  }

  .card-effect-glow--activate {
    background:
      radial-gradient(circle, rgba(255, 215, 80, 0.35) 0%, rgba(255, 215, 80, 0.12) 40%, transparent 72%);
    box-shadow:
      0 0 28px rgba(255, 215, 80, 0.3),
      inset 0 0 20px rgba(255, 240, 160, 0.15);
  }

  .card-effect-glow--sing {
    background:
      radial-gradient(circle, rgba(180, 130, 255, 0.35) 0%, rgba(180, 130, 255, 0.12) 40%, transparent 72%);
    box-shadow:
      0 0 28px rgba(180, 130, 255, 0.3),
      inset 0 0 20px rgba(210, 180, 255, 0.15);
  }

  .card-effect-glow--resolve {
    background:
      radial-gradient(circle, rgba(80, 200, 255, 0.35) 0%, rgba(80, 200, 255, 0.12) 40%, transparent 72%);
    box-shadow:
      0 0 28px rgba(80, 200, 255, 0.3),
      inset 0 0 20px rgba(160, 225, 255, 0.15);
  }

  .card-effect-glow--damage {
    background:
      radial-gradient(circle, rgba(251, 191, 36, 0.42) 0%, rgba(251, 113, 133, 0.16) 42%, transparent 74%);
    box-shadow:
      0 0 30px rgba(251, 146, 60, 0.38),
      inset 0 0 22px rgba(254, 243, 199, 0.18);
  }

  .card-effect-marker {
    fill: rgb(254, 243, 199);
  }

  .card-effect-shot-shadow,
  .card-effect-shot,
  .card-effect-shot-hot {
    fill: none;
    stroke-linecap: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
  }

  .card-effect-shot-shadow {
    stroke: rgba(2, 6, 23, 0.64);
    stroke-width: 10;
    animation: card-effect-shot-draw var(--card-effect-duration, 400ms) cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .card-effect-shot {
    stroke: rgba(251, 113, 133, 0.95);
    stroke-width: 4.5;
    filter: drop-shadow(0 8px 16px rgba(190, 18, 60, 0.42));
    animation: card-effect-shot-draw var(--card-effect-duration, 400ms) cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .card-effect-shot-hot {
    stroke: rgba(254, 243, 199, 0.95);
    stroke-width: 1.8;
    stroke-dasharray: 0.045 0.095;
    animation: card-effect-shot-hot var(--card-effect-duration, 400ms) linear both;
  }

  .card-effect-target-frame {
    position: absolute;
    border-radius: 8px;
    outline: 2px solid rgba(251, 113, 133, 0.92);
    outline-offset: 7px;
    box-shadow:
      0 0 0 9999px rgba(2, 6, 23, 0.08),
      0 0 26px rgba(251, 113, 133, 0.42),
      inset 0 0 24px rgba(254, 202, 202, 0.2);
    animation: card-effect-target-frame var(--card-effect-duration, 400ms) cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .card-effect-target-frame--banished {
    outline-color: rgba(254, 243, 199, 0.95);
    box-shadow:
      0 0 0 9999px rgba(2, 6, 23, 0.14),
      0 0 34px rgba(251, 113, 133, 0.48),
      inset 0 0 30px rgba(253, 230, 138, 0.22);
  }

  .card-effect-impact-ring {
    position: absolute;
    width: 68px;
    height: 68px;
    border: 2px solid rgba(254, 243, 199, 0.84);
    border-radius: 999px;
    box-shadow:
      0 0 0 8px rgba(251, 113, 133, 0.14),
      0 0 24px rgba(251, 113, 133, 0.48);
    transform: translate(-50%, -50%);
    animation: card-effect-impact-ring var(--card-effect-duration, 400ms) cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .card-effect-damage-badge {
    position: absolute;
    border: 1px solid rgba(254, 202, 202, 0.58);
    border-radius: 999px;
    background: rgba(225, 29, 72, 0.96);
    padding: 0.46rem 0.62rem;
    color: white;
    font-size: 1.18rem;
    font-weight: 950;
    line-height: 1;
    letter-spacing: 0;
    white-space: nowrap;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.5);
    transform: translate(-50%, -50%);
    animation: card-effect-damage-badge var(--card-effect-duration, 400ms) cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .card-effect-damage-badge--banished {
    border-color: rgba(253, 230, 138, 0.64);
    box-shadow:
      0 14px 30px rgba(15, 23, 42, 0.52),
      0 0 24px rgba(251, 191, 36, 0.24);
  }

  .card-effect-banish-badge {
    position: absolute;
    border: 1px solid rgba(253, 230, 138, 0.54);
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.92);
    padding: 0.3rem 0.62rem;
    color: rgb(254, 243, 199);
    font-size: 0.6rem;
    font-weight: 900;
    line-height: 1;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    white-space: nowrap;
    box-shadow:
      0 12px 24px rgba(15, 23, 42, 0.48),
      0 0 20px rgba(251, 191, 36, 0.22);
    transform: translate(-50%, -50%);
    animation: card-effect-banish-badge var(--card-effect-duration, 400ms) cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes card-effect-pulse {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    25% {
      opacity: 1;
      transform: scale(1);
    }
    60% {
      opacity: 0.8;
      transform: scale(1.05);
    }
    100% {
      opacity: 0;
      transform: scale(1.15);
    }
  }

  @keyframes card-effect-shot-draw {
    0%,
    18% {
      opacity: 0;
      stroke-dashoffset: 1;
    }
    36% {
      opacity: 1;
    }
    72% {
      opacity: 1;
      stroke-dashoffset: 0;
    }
    100% {
      opacity: 0;
      stroke-dashoffset: 0;
    }
  }

  @keyframes card-effect-shot-hot {
    0%,
    24% {
      opacity: 0;
      stroke-dashoffset: 1;
    }
    42% {
      opacity: 1;
    }
    86% {
      opacity: 0.7;
    }
    100% {
      opacity: 0;
      stroke-dashoffset: -0.5;
    }
  }

  @keyframes card-effect-target-frame {
    0%,
    20% {
      opacity: 0;
      transform: scale(1.06);
    }
    38% {
      opacity: 1;
      transform: scale(1);
    }
    78% {
      opacity: 1;
      transform: scale(1.02);
    }
    100% {
      opacity: 0;
      transform: scale(0.98);
    }
  }

  @keyframes card-effect-impact-ring {
    0%,
    34% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.3);
    }
    52% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    82% {
      opacity: 0.84;
      transform: translate(-50%, -50%) scale(1.2);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(1.4);
    }
  }

  @keyframes card-effect-damage-badge {
    0%,
    38% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.68);
    }
    52%,
    80% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -62%) scale(0.92);
    }
  }

  @keyframes card-effect-banish-badge {
    0%,
    42% {
      opacity: 0;
      transform: translate(-50%, -45%) scale(0.86);
    }
    56%,
    82% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -62%) scale(0.94);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .card-effect-glow,
    .card-effect-shot-shadow,
    .card-effect-shot,
    .card-effect-shot-hot,
    .card-effect-target-frame,
    .card-effect-impact-ring,
    .card-effect-damage-badge,
    .card-effect-banish-badge {
      animation: none;
    }
  }

  @media (hover: none) and (pointer: coarse) {
    .card-effect-glow {
      box-shadow: none;
    }
  }
</style>
