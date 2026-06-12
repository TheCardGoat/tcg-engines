<script lang="ts">
  import { cn } from "$lib/utils.js";
  import type {LorcanaCardSnapshot} from "@/features/simulator/model/contracts.js";
  import LorcanaCard from "@/design-system/simulator/cards/LorcanaCard.svelte";
  import DeckStack from "@/design-system/simulator/cards/DeckStack.svelte";
  import EmptyState from "@/design-system/simulator/display/EmptyState.svelte";
  import ZoneLabel from "@/design-system/simulator/display/ZoneLabel.svelte";

  interface ZoneGroupProps {
    deckCount: number;
    discardCards: LorcanaCardSnapshot[];
    inkwellCards: LorcanaCardSnapshot[];
    inkwellCount?: number;
    ownerId?: string | null;
    isOpponent?: boolean;
    isMasked?: boolean;
    showZoneCounters?: boolean;
    onDeckClick?: () => void;
    onDiscardClick?: () => void;
  }

  let {
    deckCount,
    discardCards,
    inkwellCards,
    inkwellCount,
    ownerId = null,
    isOpponent = false,
    showZoneCounters = false,
    isMasked = false,
    onDeckClick,
    onDiscardClick,
  }: ZoneGroupProps = $props();

  const topDiscard = $derived(discardCards[discardCards.length - 1]);
  const effectiveInkwellCount = $derived(Math.max(inkwellCount ?? inkwellCards.length, inkwellCards.length));
  const visibleInkwellCards = $derived(
    inkwellCards.length > 0 ? inkwellCards.slice(-5) : Array.from({ length: Math.min(effectiveInkwellCount, 5) }),
  );
</script>

<div
  class={cn(
    "zone-group flex items-stretch justify-between gap-2 p-[0.35rem] bg-slate-900/50 border border-sky-500/15 rounded-[10px] min-h-[90px]",
    isOpponent && "zone-group--opponent"
  )}
>
  <button
    type="button"
    class="zone zone--discard flex flex-col items-center gap-1 bg-zone-bg border border-zone-border rounded-lg p-1 min-w-[70px] flex-1 cursor-pointer transition-all duration-150 ease"
    onclick={onDiscardClick}
    aria-label="Discard pile ({discardCards.length} cards)"
  >
    <ZoneLabel label="Discard" count={showZoneCounters ? discardCards.length : undefined} />
    <div class="flex-1 flex items-center justify-center w-full min-h-[60px]">
      {#if discardCards.length === 0}
        <EmptyState icon="🗑" label="Empty" />
      {:else if isMasked}
        <LorcanaCard isMasked size="small" {ownerId} />
      {:else}
        <div class="relative">
          <LorcanaCard isMasked size="small" {ownerId} />
          {#if topDiscard && showZoneCounters}
            <div class="absolute -bottom-1 -right-1 bg-slate-900/90 border border-sky-500/30 rounded-full px-1.5 py-[0.1rem]">
              <span class="text-[0.65rem] font-bold text-slate-200">{discardCards.length}</span>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </button>

  <div class="zone zone--inkwell flex flex-col items-center gap-1 bg-zone-bg border border-zone-border rounded-lg p-1 flex-[2] min-w-[100px]">
    <ZoneLabel label="Inkwell" count={showZoneCounters ? effectiveInkwellCount : undefined} />
    <div class="flex-1 flex items-center justify-center w-full min-h-[60px]">
      {#if effectiveInkwellCount === 0}
        <EmptyState icon="💧" label="No Ink" />
      {:else}
        <div class="inkwell-stack flex items-center relative">
          {#each visibleInkwellCards as card, i (`inkwell-${i}`)}
            <div class="ink-card" style:--offset="{i * 3}px">
              <LorcanaCard isMasked size="tiny" {ownerId} />
            </div>
          {/each}
          {#if effectiveInkwellCount > 5}
            <span class="ml-2 text-[0.7rem] font-bold text-slate-400 bg-black/40 px-1.5 py-[0.15rem] rounded-full">
              +{effectiveInkwellCount - 5}
            </span>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <button
    type="button"
    class="zone zone--deck flex flex-col items-center gap-1 bg-zone-bg border border-zone-border rounded-lg p-1 min-w-[70px] flex-1 cursor-pointer transition-all duration-150 ease"
    onclick={onDeckClick}
    aria-label="Deck ({deckCount} cards)"
  >
    <ZoneLabel label="Deck" count={showZoneCounters ? deckCount : undefined} />
    <div class="flex-1 flex items-center justify-center w-full min-h-[60px]">
      {#if deckCount === 0}
        <EmptyState icon="📚" label="Empty" />
      {:else}
        <DeckStack count={deckCount} {ownerId} showCount={showZoneCounters} />
      {/if}
    </div>
  </button>
</div>

<style>
  .zone-group {
    container-type: inline-size;
  }

  .zone {
    --zone-bg: rgba(15, 30, 50, 0.4);
    --zone-border: rgba(100, 150, 200, 0.15);
  }

  .zone--deck:hover,
  .zone--discard:hover {
    --zone-bg: rgba(25, 50, 80, 0.5);
    --zone-border: rgba(100, 180, 255, 0.3);
  }

  /* Inkwell Stack */
  .ink-card {
    margin-left: -15px;
    transform: translateX(var(--offset, 0));
  }

  .ink-card:first-child {
    margin-left: 0;
  }

  @media (max-width: 900px) {
    .zone-group {
      min-height: 70px;
    }

    .zone {
      min-width: 55px;
    }

    .zone--inkwell {
      min-width: 80px;
    }
  }

  @container (max-width: 300px) {
    .zone-group {
      min-height: 60px;
      gap: 0.25rem;
      padding: 0.25rem;
    }

    .zone {
      min-width: 45px;
    }
  }
</style>
