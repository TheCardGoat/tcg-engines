<script lang="ts">
  import { goto } from "$app/navigation";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import { Button } from "$lib/design-system/primitives/button";
  import MetaInsightsPanel from "$lib/features/matchmaking/ui/MetaInsightsPanel.svelte";

  const PAGE_TITLE = "Meta Insights - Lorcana Simulator";
</script>

<svelte:head>
  <title>{PAGE_TITLE}</title>
</svelte:head>

<div
  class="min-h-0 flex-1 overflow-y-auto px-3 pb-24 pt-1 [scrollbar-color:rgba(148,163,184,0.45)_transparent] [scrollbar-width:thin] sm:px-6 lg:px-8"
>
  <div class="mx-auto w-full max-w-6xl">
    <div class="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
      <Button
        variant="ghost"
        size="sm"
        class="size-8 shrink-0 text-slate-400 hover:text-slate-200"
        onclick={() => goto("/matchmaking")}
        aria-label="Back to matchmaking"
      >
        <ArrowLeft class="size-4" />
      </Button>
      <div class="min-w-0">
        <h1 class="truncate text-lg font-semibold tracking-tight text-slate-100">
          Meta Insights
        </h1>
        <p class="hidden text-xs text-slate-500 sm:block">
          Community game volume, color-pair performance, and matchup trends
        </p>
      </div>
    </div>

    <MetaInsightsPanel variant="full" />
  </div>
</div>
