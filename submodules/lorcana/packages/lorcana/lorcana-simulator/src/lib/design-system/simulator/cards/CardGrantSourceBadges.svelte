<script lang="ts">
  import * as Tooltip from "$lib/design-system/primitives/tooltip/index.js";
  import CardImage from "./CardImage.svelte";
  import {useLorcanaGameContext} from "@/features/simulator/context/game-context.svelte.js";
  import {useSimulatorCardContext} from "@/features/simulator/context/simulator-card-context.svelte.js";
  import {getInkHex, type LorcanaInkName} from "@/features/simulator/model/lorcana-colors.js";

  const VALID_INKS: readonly string[] = ["amber", "amethyst", "emerald", "ruby", "sapphire", "steel"];

  function getSourceBorderColor(inkType?: string[]): string {
    const ink = inkType?.[0]?.toLowerCase();
    if (ink && VALID_INKS.includes(ink)) {
      return getInkHex(ink as LorcanaInkName);
    }
    return "rgba(255, 255, 255, 0.7)";
  }

  interface GrantSource {
    sourceCardId: string;
    sourceLabel: string;
    sourceSet?: string;
    sourceCardNumber?: number;
    sourceInkType?: string[];
    grants: string[];
  }

  const {
    sources,
  }: {
    sources: GrantSource[];
  } = $props();

  const gameContext = useLorcanaGameContext();
  const simulatorCardContext = useSimulatorCardContext();

  function handleSourceEnter(sourceCardId: string): void {
    const sourceCard = gameContext.cardSnapshotsById()[sourceCardId] ?? null;
    if (sourceCard) {
      simulatorCardContext.setExternalPreviewCard(sourceCard);
    }
  }

  function handleSourceLeave(sourceCardId: string): void {
    const current = simulatorCardContext.previewCard;
    if (current?.cardId === sourceCardId) {
      simulatorCardContext.setExternalPreviewCard(null);
    }
  }
</script>

<div class="grant-source-badges">
  {#each sources as source (source.sourceCardId)}
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <button
            type="button"
            {...props}
            class="grant-source-badge"
            style="--badge-border: {getSourceBorderColor(source.sourceInkType)}"
            aria-label="Granted by {source.sourceLabel}"
            onpointerenter={() => handleSourceEnter(source.sourceCardId)}
            onpointerleave={() => handleSourceLeave(source.sourceCardId)}
          >
            {#if source.sourceSet && source.sourceCardNumber}
              <CardImage
                set={source.sourceSet}
                number={source.sourceCardNumber}
                crop="art_only"
                alt={source.sourceLabel}
                class="grant-source-image"
              />
            {:else}
              <span class="grant-source-fallback">?</span>
            {/if}
          </button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content
        side="bottom"
        sideOffset={6}
        class="max-w-[240px] rounded-lg border border-white/10 bg-slate-950/95 px-2.5 py-2 text-[0.7rem] leading-snug text-slate-100 shadow-xl"
      >
        <div class="font-semibold">{source.sourceLabel}</div>
        <div class="mt-1 text-slate-300">Grants: {source.grants.join(", ")}</div>
      </Tooltip.Content>
    </Tooltip.Root>
  {/each}
</div>

<style>
  .grant-source-badges {
    display: flex;
    pointer-events: auto;
  }

  .grant-source-badges :global(> * + *) {
    margin-left: -8px;
  }

  .grant-source-badge {
    position: relative;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    border: 2.5px solid var(--badge-border, rgba(255, 255, 255, 0.7));
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    padding: 0;
    background: rgba(15, 23, 42, 0.8);
    transition: transform 120ms ease, box-shadow 120ms ease;
  }

  .grant-source-badge:hover {
    transform: scale(1.15);
    z-index: 1;
    box-shadow:
      0 3px 10px rgba(0, 0, 0, 0.6),
      0 0 0 2px rgba(255, 255, 255, 0.9);
  }

  .grant-source-badge :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .grant-source-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 0.75rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.5);
  }
</style>
