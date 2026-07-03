<script lang="ts">
  import { getActionCardStageRect } from "@/features/simulator/animations/action-animations.js";
  import { maybeUseSimulatorCardContext } from "@/features/simulator/context/simulator-card-context.svelte.js";
  import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";
  import ActionCardStage from "./ActionCardStage.svelte";

  interface Props {
    sourceCard: LorcanaCardSnapshot | null;
    selectedTargetCount?: number;
    hidePreviewableStage?: boolean;
  }

  let { sourceCard, selectedTargetCount = 0, hidePreviewableStage = false }: Props = $props();

  let layerWidth = $state(0);
  let layerHeight = $state(0);
  const simulatorCardContext = maybeUseSimulatorCardContext();
  const displaySourceCard = $derived(
    sourceCard ? { ...sourceCard, readyState: "ready" as const } : null,
  );

  $effect(() => {
    if (
      hidePreviewableStage &&
      displaySourceCard &&
      simulatorCardContext?.previewCard?.cardId === displaySourceCard.cardId
    ) {
      simulatorCardContext.setExternalPreviewCard(null);
    }
  });

  const sourceCardStyle = $derived.by(() => {
    const rect = getActionCardStageRect(layerWidth, layerHeight);

    return [
      `left:${rect.x}px`,
      `top:${rect.y}px`,
      `width:${rect.width}px`,
      `height:${rect.height}px`,
    ].join(";");
  });
</script>

<div
  class="action-targeting-source-layer"
  aria-hidden="true"
  bind:clientWidth={layerWidth}
  bind:clientHeight={layerHeight}
>
  {#if !hidePreviewableStage && displaySourceCard && layerWidth > 0 && layerHeight > 0}
    <ActionCardStage
      card={displaySourceCard}
      variant="targeting"
      hasTarget={selectedTargetCount > 0}
      style={sourceCardStyle}
      testId="action-targeting-source"
      enableTopLeftPreview
    />
  {/if}
</div>

<style>
  .action-targeting-source-layer {
    position: absolute;
    inset: 0;
    z-index: 31;
    overflow: visible;
    pointer-events: none;
  }
</style>
