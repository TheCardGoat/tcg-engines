<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button } from "$lib/design-system/primitives/button";
  import * as Select from "$lib/components/ui/select";
  import * as Tooltip from "$lib/design-system/primitives/tooltip/index.js";
  import { m } from "$lib/i18n/messages.js";
  import { cn } from "$lib/utils.js";
  import { getInkSymbolUrl } from "@/features/simulator/model/asset-urls.js";
  import { getInkRgba, type LorcanaInkName } from "@/features/simulator/model/lorcana-colors.js";
  import type { LorcanaFormatId } from "@tcg/lorcana-types";
  import type { ProfileDeckSummary, ProfileMatchmakingContext } from "../api/player-context-api.js";
  import DeckCardCountHoverCard from "./DeckCardCountHoverCard.svelte";
  import DeckValidationDetails from "./DeckValidationDetails.svelte";
  import DeckFormatBadges from "@/features/deck-vault/ui/DeckFormatBadges.svelte";
  import { EYEBROW_CLASS } from "./matchmaking-lobby.constants.js";
  import Loader from "@lucide/svelte/icons/loader-circle";
  import X from "@lucide/svelte/icons/x";

  interface Props {
    isAuthenticated: boolean;
    error: string | null;
    success: string | null;
    selectionDisabled: boolean;
    selectionDisabledReason: string | null;
    activeProfile: ProfileMatchmakingContext | null;
    selectedDeck: ProfileDeckSummary | null;
    selectedDeckId: string;
    selectedDeckInks: string[];
    activeProfileDecks: ProfileDeckSummary[];
    activeProfileDecksLoaded: boolean;
    activeProfileDecksLoading: boolean;
    activeProfileDeckError: string | null;
    selectedDeckTriggerLabel: string;
    selectableDeckItems: Array<{ value: string; label: string }>;
    selectedQueueFormat: LorcanaFormatId | null;
    isDeckValidForSelectedFormat: boolean;
    importLegacySubmitting: boolean;
    importLegacyError: string | null;
    importLegacySuccess: string | null;
    onDismissSuccess: () => void;
    onImportLegacy: () => void;
    onDeckChange: (deckId: string) => void;
    onDeckSelectOpenChange: (open: boolean) => void;
  }

  let {
    isAuthenticated,
    error,
    success,
    selectionDisabled,
    selectionDisabledReason,
    activeProfile,
    selectedDeck,
    selectedDeckId,
    selectedDeckInks,
    activeProfileDecks,
    activeProfileDecksLoaded,
    activeProfileDecksLoading,
    activeProfileDeckError,
    selectedDeckTriggerLabel,
    selectableDeckItems,
    selectedQueueFormat,
    isDeckValidForSelectedFormat,
    importLegacySubmitting,
    importLegacyError,
    importLegacySuccess,
    onDismissSuccess,
    onImportLegacy,
    onDeckChange,
    onDeckSelectOpenChange,
  }: Props = $props();

  let deckSelectOpen = $state(false);

  $effect(() => {
    onDeckSelectOpenChange(deckSelectOpen);
  });

  const deckGradientStyle = $derived.by(() => {
    if (selectedDeckInks.length === 0) {
      return ''
    }
    if (selectedDeckInks.length === 1) {
      const c = getInkRgba(selectedDeckInks[0] as LorcanaInkName, 0.22);
      return `background: linear-gradient(135deg, ${c} 0%, transparent 100%)`;
    }

    const stops = selectedDeckInks.map((ink, i) => {
      const pct = Math.round((i / (selectedDeckInks.length - 1)) * 100);
      return `${getInkRgba(ink as LorcanaInkName, 0.22)} ${pct}%`;
    });

    return `background: linear-gradient(135deg, ${stops.join(', ')})`;
  });
</script>

{#if isAuthenticated || error || success}
  <div class="space-y-3">
      {#if error}
        <div
          class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm leading-6 text-rose-200"
          role="alert"
        >
          {error}
        </div>
      {/if}

      {#if success}
        <div
          class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm leading-6 text-emerald-100"
          role="status"
        >
          <div class="flex items-start justify-between gap-3">
            <span>{success}</span>
            <button
              type="button"
              class="mt-0.5 text-emerald-200/70 transition-colors hover:text-emerald-100"
              aria-label={m["sim.matchmaking.importDeck.dismissSuccess"]({})}
              onclick={onDismissSuccess}
            >
              <X class="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      {/if}

      {#if isAuthenticated}
        <Tooltip.Root delayDuration={300} disabled={!selectionDisabledReason}>
          <Tooltip.Trigger>
            {#snippet child({ props })}
              <div {...props}>
        <div class="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] transition-all duration-500" style={deckGradientStyle}>
          <Select.Root
            type="single"
            bind:open={deckSelectOpen}
            value={selectedDeckId}
            items={selectableDeckItems}
            disabled={selectionDisabled || !activeProfile}
            onValueChange={onDeckChange}
          >
            <div class="flex items-center gap-2 px-3 py-2">
              {#if selectedDeck}
                <div class="flex shrink-0 items-center gap-1">
                  {#each selectedDeckInks as ink}
                    <img
                      src={getInkSymbolUrl(ink)}
                      alt={ink}
                      class="size-5 rounded-full bg-black/20 object-contain shadow-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
                    />
                  {/each}
                </div>
              {/if}

              <Select.Trigger
                id="play-deck-select"
                class="h-8 min-w-0 flex-1 rounded-lg border-transparent bg-transparent px-2 text-left text-sm text-white hover:bg-white/5 focus-visible:ring-0 dark:bg-transparent dark:hover:bg-white/5"
                aria-label={m["sim.matchmaking.deckSelect.label"]({})}
              >
                <span
                  data-slot="select-value"
                  class={cn("min-w-0 truncate", !selectedDeck && "text-slate-400")}
                >
                  {selectedDeckTriggerLabel}
                </span>
              </Select.Trigger>

              {#if selectedDeck}
                <div class="flex shrink-0 items-center gap-2">
                  <DeckFormatBadges formats={selectedDeck.validFormats} />
                  <DeckCardCountHoverCard deck={selectedDeck} />
                </div>
              {/if}

              {#if activeProfile && !selectedDeck && (!activeProfileDecksLoaded || activeProfileDecks.length === 0)}
                <div class="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    class="h-6 shrink-0 border-white/15 bg-transparent px-2 text-[0.65rem] text-slate-300 hover:bg-white/10 hover:text-slate-100"
                    disabled={importLegacySubmitting}
                    onclick={onImportLegacy}
                  >
                    {importLegacySubmitting
                      ? m["sim.matchmaking.selectedDeck.empty.importLegacyLoading"]({})
                      : m["sim.matchmaking.selectedDeck.empty.importLegacy"]({})}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    class="h-6 shrink-0 border-white/15 bg-transparent px-2 text-[0.65rem] text-slate-300 hover:bg-white/10 hover:text-slate-100"
                    onclick={() => goto("/matchmaking/deck-vault")}
                  >
                    {m["sim.matchmaking.selectedDeck.empty.importDecklist"]({})}
                  </Button>
                </div>
              {/if}

            </div>

            <Select.Content class="border-white/10 bg-slate-950/98 text-slate-100" sideOffset={8}>
              {#if activeProfileDecksLoading}
                <div class="flex items-center gap-2 px-3 py-2 text-sm text-slate-300">
                  <Loader class="size-4 animate-spin" />
                  <span>{m["sim.matchmaking.deckSelect.loading"]({})}</span>
                </div>
              {:else if activeProfileDecks.length === 0}
                <div class="px-3 py-2 text-sm text-slate-300">
                  {m["sim.matchmaking.deckSelect.nonePlayable"]({})}
                </div>
              {:else}
                {#each activeProfileDecks as deck}
                  <Select.Item value={deck.deckId} label={deck.deckName} class="px-3 py-2.5">
                    <div class="flex min-w-0 items-center justify-between gap-3">
                      <span class="truncate">{deck.deckName}</span>
                      <div class="flex shrink-0 items-center gap-2">
                        <DeckFormatBadges formats={deck.validFormats} />
                        <span class="text-xs uppercase tracking-[0.22em] text-slate-400">
                          {deck.cardCount}
                        </span>
                      </div>
                    </div>
                  </Select.Item>
                {/each}
              {/if}
            </Select.Content>
          </Select.Root>

          {#if selectedDeck && !isDeckValidForSelectedFormat && selectedQueueFormat}
            <div class="px-3 pb-2">
              <DeckValidationDetails deck={selectedDeck} formatId={selectedQueueFormat} />
            </div>
          {/if}

          {#if !selectedDeck}
            <div class="px-3 pb-2" aria-live="polite">
              <p class="text-xs text-slate-400">
                {#if activeProfileDeckError}
                  {activeProfileDeckError}
                {:else if activeProfileDecksLoaded && activeProfileDecks.length === 0}
                  {m["sim.matchmaking.selectedDeck.empty.noDecks"]({})}
                {:else if activeProfile}
                  {m["sim.matchmaking.selectedDeck.empty.select"]({})}
                {:else}
                  {m["sim.matchmaking.profile.loading"]({})}
                {/if}
              </p>
              {#if importLegacyError}
                <p class="mt-1 text-xs text-red-400">{importLegacyError}</p>
              {/if}
              {#if importLegacySuccess}
                <p class="mt-1 text-xs text-green-400">{importLegacySuccess}</p>
              {/if}
            </div>
          {/if}
        </div>
              </div>
            {/snippet}
          </Tooltip.Trigger>
          <Tooltip.Content
            side="top"
            align="start"
            sideOffset={6}
            class="border border-white/15 bg-slate-950/98 px-3 py-2 text-xs text-slate-100 shadow-xl"
          >
            {selectionDisabledReason}
          </Tooltip.Content>
        </Tooltip.Root>
      {:else}
        <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
          {m["sim.matchmaking.profile.signInPrompt"]({})}
        </div>
      {/if}
  </div>
{/if}
