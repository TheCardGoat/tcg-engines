<script lang="ts">
  import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
  import { useLorcanaBoardPresenter } from "@/features/simulator/context/game-context.svelte.js";
  import type { ResolvedActionAnimation } from "@/features/simulator/animations/action-animations.js";
  import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";
  import type { BoardLocalRect } from "@/features/simulator/animations/board-move-animations.js";
  import { m } from "$lib/i18n/messages.js";

  const ACTION_CARD_WIDTH = 122;
  const ACTION_CARD_HEIGHT = 171;

  interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
  }

  const board = useLorcanaBoardPresenter();
  const actionAnimations = $derived(board.actionAnimations);
  const cardSnapshotsById = $derived(board.cardSnapshotsById);
  let layerWidth = $state(0);
  let layerHeight = $state(0);

  function onActionAnimationFinished(id: string): void {
    board.onActionAnimationFinished(id);
  }

  function getTargetCard(targetId: string): LorcanaCardSnapshot | null {
    return cardSnapshotsById[targetId] ?? null;
  }

  function getActionCard(animation: ResolvedActionAnimation): LorcanaCardSnapshot | null {
    return cardSnapshotsById[animation.actionCardId] ?? null;
  }

  function handleAnimationEnd(animation: ResolvedActionAnimation, event: AnimationEvent): void {
    if (event.currentTarget !== event.target) {
      return;
    }

    onActionAnimationFinished(animation.id);
  }

  function markerId(animation: ResolvedActionAnimation, index: number): string {
    return `action-cast-arrow-${animation.id}-${index}`;
  }

  function castRect(): Rect {
    const x = clamp(layerWidth * 0.16 - ACTION_CARD_WIDTH / 2, 24, layerWidth - ACTION_CARD_WIDTH - 24);
    const y = clamp(layerHeight * 0.52 - ACTION_CARD_HEIGHT / 2, 24, layerHeight - ACTION_CARD_HEIGHT - 24);

    return {
      x,
      y,
      width: ACTION_CARD_WIDTH,
      height: ACTION_CARD_HEIGHT,
      centerX: x + ACTION_CARD_WIDTH / 2,
      centerY: y + ACTION_CARD_HEIGHT / 2,
    };
  }

  function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  function actionCardStyle(animation: ResolvedActionAnimation): string {
    const rect = castRect();
    const source = animation.actionCardSourceRect;
    const fromX = source ? source.centerX - rect.centerX : 0;
    const fromY = source ? source.centerY - rect.centerY : 0;
    const fromScale = source
      ? clamp(source.width / ACTION_CARD_WIDTH, 0.38, 0.86)
      : 1;

    return [
      `left:${rect.x}px`,
      `top:${rect.y}px`,
      `width:${rect.width}px`,
      `height:${rect.height}px`,
      `--from-x:${fromX}px`,
      `--from-y:${fromY}px`,
      `--from-scale:${fromScale}`,
    ].join(";");
  }

  function beamPath(targetRect: BoardLocalRect, index: number, count: number): string {
    const cast = castRect();
    const endOnRight = targetRect.centerX < cast.centerX;
    const startX = cast.x + cast.width - 4;
    const startY = cast.centerY + (index - (count - 1) / 2) * 18;
    const endX = endOnRight ? targetRect.x + targetRect.width + 8 : targetRect.x - 8;
    const endY = targetRect.centerY;
    const controlX = startX + (endX - startX) * 0.58;
    const controlY = Math.min(startY, endY) - 64 - index * 8;

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
    const offset = (index - (count - 1) / 2) * 26;
    return `left:${rect.centerX + offset}px;top:${rect.centerY}px;transform:translate(-50%, -50%);`;
  }

  function targetDamageLabel(targetId: string): string | null {
    const damage = getTargetCard(targetId)?.damage ?? 0;
    return damage > 0 ? `-${damage}` : null;
  }
</script>

<div
  class="action-cast-layer"
  aria-hidden="true"
  bind:clientWidth={layerWidth}
  bind:clientHeight={layerHeight}
>
  {#each actionAnimations as animation (animation.id)}
    <div
      class="action-cast"
      style="--duration:{animation.durationMs}ms"
      onanimationend={(event) => handleAnimationEnd(animation, event)}
    >
      <svg
        class="action-cast-svg"
        viewBox={`0 0 ${layerWidth} ${layerHeight}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {#each animation.targets as target, index (`${animation.id}:marker:${target.cardId}:${index}`)}
            <marker
              id={markerId(animation, index)}
              markerWidth="9"
              markerHeight="9"
              refX="7.5"
              refY="4.5"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path d="M 0 1 L 7.5 4.5 L 0 8 Q 2.5 4.5 0 1" class="fill-amber-100" />
            </marker>
          {/each}
        </defs>

        {#each animation.targets as target, index (`${animation.id}:path:${target.cardId}:${index}`)}
          {#if layerWidth > 0 && layerHeight > 0 && target.targetRect}
            <path
              d={beamPath(target.targetRect, index, animation.targets.length)}
              class="action-beam-shadow"
              pathLength="1"
            />
            <path
              d={beamPath(target.targetRect, index, animation.targets.length)}
              class="action-beam"
              marker-end={`url(#${markerId(animation, index)})`}
              pathLength="1"
            />
            <path
              d={beamPath(target.targetRect, index, animation.targets.length)}
              class="action-beam-spark"
              pathLength="1"
            />
          {/if}
        {/each}
      </svg>

      <div class="action-card-stage" style={actionCardStyle(animation)}>
        {#each [getActionCard(animation)] as actionCard}
          {#if actionCard}
            <LorcanaCard
              card={actionCard}
              size="small"
              isExerted={false}
              showHoverCard={false}
              clickOpensHover={false}
            />
          {:else}
            <div class="action-card-placeholder"></div>
          {/if}
        {/each}
      </div>

      {#each animation.targets as target, index (`${animation.id}:target:${target.cardId}:${index}`)}
        {#if target.targetRect}
          <div
            class:action-target-frame={true}
            class:action-target-frame--banished={target.wasBanished}
            style={targetFrameStyle(target.targetRect)}
          ></div>
          <div class="action-impact-ring" style={targetBadgeStyle(target.targetRect, index, animation.targets.length)}></div>
          {#if target.wasBanished}
            <div class="action-impact-badge action-impact-badge--banish" style={targetBadgeStyle(target.targetRect, index, animation.targets.length)}>
              {m["sim.challengePreview.banished"]({})}
            </div>
          {:else if targetDamageLabel(target.cardId)}
            <div class="action-impact-badge action-impact-badge--damage" style={targetBadgeStyle(target.targetRect, index, animation.targets.length)}>
              {targetDamageLabel(target.cardId)}
            </div>
          {/if}
        {/if}
      {/each}
    </div>
  {/each}
</div>

<style>
  .action-cast-layer {
    position: absolute;
    inset: 0;
    z-index: 32;
    overflow: visible;
    pointer-events: none;
  }

  .action-cast,
  .action-cast-svg {
    position: absolute;
    inset: 0;
    overflow: visible;
  }

  .action-cast {
    animation: action-cast-lifecycle var(--duration, 1000ms) cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .action-card-stage {
    position: absolute;
    display: grid;
    place-items: center;
    transform-origin: center;
    filter: drop-shadow(0 22px 26px rgba(2, 6, 23, 0.55));
    animation: action-card-stage var(--duration, 1000ms) cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .action-card-stage::before {
    content: "";
    position: absolute;
    inset: -12px;
    z-index: -1;
    border: 1px solid rgba(253, 230, 138, 0.32);
    border-radius: 12px;
    background: radial-gradient(circle at 50% 40%, rgba(251, 191, 36, 0.28), transparent 64%);
    box-shadow:
      0 0 28px rgba(245, 158, 11, 0.36),
      inset 0 0 24px rgba(253, 230, 138, 0.12);
    animation: action-card-aura var(--duration, 1000ms) ease both;
  }

  .action-card-placeholder {
    width: 122px;
    height: 171px;
    border: 1px solid rgba(253, 230, 138, 0.2);
    border-radius: 8px;
    background: rgba(15, 23, 42, 0.7);
  }

  .action-beam-shadow,
  .action-beam,
  .action-beam-spark {
    fill: none;
    stroke-linecap: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
  }

  .action-beam-shadow {
    stroke: rgba(2, 6, 23, 0.7);
    stroke-width: 12;
    animation: action-beam-draw var(--duration, 1000ms) cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .action-beam {
    stroke: rgba(250, 204, 21, 0.92);
    stroke-width: 5;
    filter: drop-shadow(0 10px 18px rgba(146, 64, 14, 0.42));
    animation: action-beam-draw var(--duration, 1000ms) cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .action-beam-spark {
    stroke: rgba(254, 243, 199, 0.9);
    stroke-width: 2;
    stroke-dasharray: 0.035 0.075;
    animation: action-beam-spark var(--duration, 1000ms) linear both;
  }

  .action-target-frame {
    position: absolute;
    border-radius: 8px;
    outline: 2px solid rgba(253, 230, 138, 0.92);
    outline-offset: 7px;
    box-shadow:
      0 0 0 9999px rgba(2, 6, 23, 0.08),
      0 0 28px rgba(245, 158, 11, 0.44),
      inset 0 0 24px rgba(253, 230, 138, 0.16);
    animation: action-target-frame var(--duration, 1000ms) cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .action-target-frame--banished {
    outline-color: rgba(251, 191, 36, 0.98);
    box-shadow:
      0 0 0 9999px rgba(2, 6, 23, 0.14),
      0 0 36px rgba(251, 113, 133, 0.42),
      inset 0 0 30px rgba(251, 191, 36, 0.26);
  }

  .action-impact-ring {
    position: absolute;
    width: 72px;
    height: 72px;
    border-radius: 999px;
    border: 2px solid rgba(254, 243, 199, 0.82);
    box-shadow:
      0 0 0 8px rgba(245, 158, 11, 0.12),
      0 0 28px rgba(245, 158, 11, 0.45);
    animation: action-impact-ring var(--duration, 1000ms) cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .action-impact-badge {
    position: absolute;
    border-radius: 999px;
    font-weight: 950;
    line-height: 1;
    white-space: nowrap;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.5);
    animation: action-impact-badge var(--duration, 1000ms) cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .action-impact-badge--damage {
    border: 1px solid rgba(254, 202, 202, 0.58);
    background: rgba(225, 29, 72, 0.94);
    padding: 0.46rem 0.62rem;
    color: white;
    font-size: 1.25rem;
    letter-spacing: 0;
  }

  .action-impact-badge--banish {
    border: 1px solid rgba(253, 230, 138, 0.44);
    background: rgba(15, 23, 42, 0.9);
    padding: 0.3rem 0.62rem;
    color: rgb(254, 243, 199);
    font-size: 0.6rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  @keyframes action-cast-lifecycle {
    0%,
    100% {
      opacity: 0;
    }
    9%,
    86% {
      opacity: 1;
    }
  }

  @keyframes action-card-stage {
    0% {
      opacity: 0;
      transform: translate3d(var(--from-x), var(--from-y), 0) scale(var(--from-scale));
    }
    18% {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
    76% {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate3d(-18px, 18px, 0) scale(0.86);
    }
  }

  @keyframes action-card-aura {
    0% {
      opacity: 0;
      transform: scale(0.86);
    }
    22%,
    74% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(1.08);
    }
  }

  @keyframes action-beam-draw {
    0%,
    18% {
      opacity: 0;
      stroke-dashoffset: 1;
    }
    34% {
      opacity: 1;
    }
    62% {
      opacity: 1;
      stroke-dashoffset: 0;
    }
    100% {
      opacity: 0;
      stroke-dashoffset: 0;
    }
  }

  @keyframes action-beam-spark {
    0%,
    22% {
      opacity: 0;
      stroke-dashoffset: 1;
    }
    38% {
      opacity: 1;
    }
    82% {
      opacity: 0.65;
    }
    100% {
      opacity: 0;
      stroke-dashoffset: -0.55;
    }
  }

  @keyframes action-target-frame {
    0%,
    22% {
      opacity: 0;
      transform: scale(1.06);
    }
    36% {
      opacity: 1;
      transform: scale(1);
    }
    76% {
      opacity: 1;
      transform: scale(1.02);
    }
    100% {
      opacity: 0;
      transform: scale(0.98);
    }
  }

  @keyframes action-impact-ring {
    0%,
    34% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.3);
    }
    48% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    78% {
      opacity: 0.9;
      transform: translate(-50%, -50%) scale(1.22);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(1.42);
    }
  }

  @keyframes action-impact-badge {
    0%,
    40% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.68);
    }
    52%,
    78% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -62%) scale(0.92);
    }
  }

  @media (max-width: 720px) {
    .action-impact-badge--damage {
      font-size: 1rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .action-cast,
    .action-card-stage,
    .action-card-stage::before,
    .action-beam-shadow,
    .action-beam,
    .action-beam-spark,
    .action-target-frame,
    .action-impact-ring,
    .action-impact-badge {
      animation: none;
    }
  }
</style>
