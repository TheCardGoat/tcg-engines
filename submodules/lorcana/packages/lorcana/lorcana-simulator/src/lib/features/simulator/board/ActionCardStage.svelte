<script lang="ts">
  import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
  import { useSimulatorCardContext } from "@/features/simulator/context/simulator-card-context.svelte.js";
  import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";

  interface Props {
    card: LorcanaCardSnapshot | null;
    style: string;
    variant?: "targeting" | "cast";
    hasTarget?: boolean;
    enableTopLeftPreview?: boolean;
    testId?: string;
  }

  let {
    card,
    style,
    variant = "targeting",
    hasTarget = false,
    enableTopLeftPreview = false,
    testId,
  }: Props = $props();

  const simulatorCardContext = useSimulatorCardContext();

  function handlePreviewEnter(): void {
    if (!enableTopLeftPreview || !card || card.isMasked) {
      return;
    }

    simulatorCardContext.setPreviewPosition({ x: 0, y: 0 });
    simulatorCardContext.setExternalPreviewCard(card);
  }

  function handlePreviewLeave(): void {
    if (
      enableTopLeftPreview &&
      card &&
      simulatorCardContext.previewCard?.cardId === card.cardId
    ) {
      simulatorCardContext.setExternalPreviewCard(null);
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="action-card-stage"
  class:action-card-stage--targeting={variant === "targeting"}
  class:action-card-stage--cast={variant === "cast"}
  class:action-card-stage--has-target={hasTarget}
  class:action-card-stage--previewable={enableTopLeftPreview}
  {style}
  data-testid={testId}
  data-card-id={card?.cardId}
  onmouseenter={handlePreviewEnter}
  onmouseleave={handlePreviewLeave}
  onpointerenter={handlePreviewEnter}
  onpointerleave={handlePreviewLeave}
>
  {#if card}
    <LorcanaCard
      {card}
      size="small"
      isExerted={false}
      showHoverCard={false}
      clickOpensHover={false}
    />
  {:else}
    <div class="action-card-stage__placeholder"></div>
  {/if}
</div>

<style>
  .action-card-stage {
    position: absolute;
    display: grid;
    place-items: center;
    transform-origin: center;
    filter: drop-shadow(0 22px 26px rgba(2, 6, 23, 0.55));
  }

  .action-card-stage--previewable {
    pointer-events: auto;
  }

  .action-card-stage--targeting {
    animation: action-card-stage-targeting-enter 220ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .action-card-stage--cast {
    animation: action-card-stage-cast var(--duration, 1000ms) cubic-bezier(0.16, 1, 0.3, 1) both;
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
  }

  .action-card-stage--targeting::before {
    animation: action-card-stage-targeting-pulse 1500ms ease-in-out infinite;
  }

  .action-card-stage--targeting.action-card-stage--has-target::before {
    border-color: rgba(187, 247, 208, 0.42);
    background: radial-gradient(circle at 50% 40%, rgba(34, 197, 94, 0.24), transparent 64%);
    box-shadow:
      0 0 28px rgba(34, 197, 94, 0.34),
      inset 0 0 24px rgba(187, 247, 208, 0.12);
  }

  .action-card-stage--cast::before {
    animation: action-card-stage-cast-aura var(--duration, 1000ms) ease both;
  }

  .action-card-stage__placeholder {
    width: 122px;
    height: 171px;
    border: 1px solid rgba(253, 230, 138, 0.2);
    border-radius: 8px;
    background: rgba(15, 23, 42, 0.7);
  }

  @keyframes action-card-stage-targeting-enter {
    from {
      opacity: 0;
      transform: translate3d(0, 10px, 0) scale(0.94);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes action-card-stage-targeting-pulse {
    0%,
    100% {
      opacity: 0.78;
      transform: scale(0.98);
    }
    50% {
      opacity: 1;
      transform: scale(1.03);
    }
  }

  @keyframes action-card-stage-cast {
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

  @keyframes action-card-stage-cast-aura {
    0% {
      opacity: 0;
      transform: scale(0.86);
    }
    22%,
    68% {
      opacity: 1;
      transform: scale(1.04);
    }
    100% {
      opacity: 0;
      transform: scale(1.2);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .action-card-stage,
    .action-card-stage::before {
      animation: none;
    }
  }
</style>
