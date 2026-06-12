<script lang="ts">
  import CardImage from "$lib/design-system/simulator/cards/CardImage.svelte";
  import * as HoverCard from "$lib/design-system/primitives/hover-card/index.js";
  import {
    fetchDeckListSnapshotByDeckListId,
    type ProfileDeckSummary,
  } from "@/features/matchmaking/api/player-context-api.js";
  import { getInkSymbolUrl } from "@/features/simulator/model/asset-urls.js";
  import { getAllCardsById } from "@tcg/lorcana-cards";
  import { getFullName } from "@tcg/lorcana-types";

  type CardDef = Awaited<ReturnType<typeof getAllCardsById>>[string];
  import Loader from "@lucide/svelte/icons/loader-circle";
  import AlertCircle from "@lucide/svelte/icons/alert-circle";
  import DeckFormatBadges from "./DeckFormatBadges.svelte";

  interface Props {
    deck: ProfileDeckSummary;
  }

  let { deck }: Props = $props();

  type Entry = { publicId: string; quantity: number; card: CardDef };

  const TYPE_ORDER: Record<string, number> = {
    character: 0,
    action: 1,
    item: 2,
    location: 3,
  };

  let loading = $state(true);
  let loadError = $state<string | null>(null);
  let entries = $state<Entry[]>([]);
  let requestSequence = 0;

  $effect(() => {
    const deckListId = deck.activeDeckListId;
    const seq = ++requestSequence;
    loading = true;
    loadError = null;
    entries = [];

    void Promise.all([fetchDeckListSnapshotByDeckListId(deckListId), getAllCardsById()])
      .then(([snapshot, catalog]) => {
        if (seq !== requestSequence) return;
        entries = snapshot.historicDeck
          .map((c) => {
            const card = catalog[c.cardPublicId];
            return card
              ? { publicId: c.cardPublicId, quantity: c.quantity, card }
              : null;
          })
          .filter((e): e is Entry => e !== null);
      })
      .catch((error: unknown) => {
        if (seq !== requestSequence) return;
        loadError = error instanceof Error ? error.message : "Failed to load deck";
      })
      .finally(() => {
        if (seq !== requestSequence) return;
        loading = false;
      });
  });

  const totalCards = $derived(entries.reduce((sum, e) => sum + e.quantity, 0));

  const sortedEntries = $derived.by(() =>
    [...entries].sort((a, b) => {
      const typeDiff =
        (TYPE_ORDER[a.card.cardType] ?? 99) - (TYPE_ORDER[b.card.cardType] ?? 99);
      if (typeDiff !== 0) return typeDiff;
      if (a.card.cost !== b.card.cost) return a.card.cost - b.card.cost;
      return getFullName(a.card).localeCompare(getFullName(b.card));
    }),
  );

  const inks = $derived.by(() => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
      for (const ink of entry.card.inkType) {
        counts.set(ink, (counts.get(ink) ?? 0) + entry.quantity);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([ink, count]) => ({ ink, count }));
  });

  const typeBreakdown = $derived.by(() => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
      counts.set(entry.card.cardType, (counts.get(entry.card.cardType) ?? 0) + entry.quantity);
    }
    return [...counts.entries()]
      .sort(
        (a, b) => (TYPE_ORDER[a[0]] ?? 99) - (TYPE_ORDER[b[0]] ?? 99),
      )
      .map(([type, count]) => ({ type, count }));
  });

  const inkableCount = $derived(
    entries.reduce((sum, e) => sum + (e.card.inkable ? e.quantity : 0), 0),
  );
  const uninkableCount = $derived(totalCards - inkableCount);

  function formatType(t: string): string {
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
</script>

<section class="space-y-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
  <!-- Header -->
  <div class="space-y-3">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 space-y-1">
        <p class="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Selected deck
        </p>
        <h3 class="truncate text-lg font-semibold text-white">{deck.deckName}</h3>
      </div>
      <span class="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
        {totalCards || deck.cardCount} cards
      </span>
    </div>

    <!-- Inks -->
    {#if inks.length > 0}
      <div class="flex flex-wrap items-center gap-1.5">
        {#each inks as entry (entry.ink)}
          <span class="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs text-slate-200">
            <img src={getInkSymbolUrl(entry.ink)} alt={entry.ink} class="size-4" />
            <span class="capitalize">{entry.ink}</span>
            <span class="text-slate-400">{entry.count}</span>
          </span>
        {/each}
      </div>
    {/if}

    <DeckFormatBadges formats={deck.validFormats} />
  </div>

  {#if loading}
    <div class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-4 text-sm text-slate-300">
      <Loader class="size-4 animate-spin text-slate-400" aria-hidden="true" />
      <span>Loading deck…</span>
    </div>
  {:else if loadError}
    <div class="flex items-center gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
      <AlertCircle class="size-4" aria-hidden="true" />
      <span>{loadError}</span>
    </div>
  {:else if entries.length === 0}
    <p class="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-4 text-sm text-slate-400">
      This deck is empty.
    </p>
  {:else}
    <!-- Stats grid -->
    <div class="grid grid-cols-2 gap-2">
      <div class="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
        <p class="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Inkable</p>
        <p class="mt-0.5 text-lg font-semibold text-slate-50">{inkableCount}</p>
      </div>
      <div class="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
        <p class="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Uninkable</p>
        <p class="mt-0.5 text-lg font-semibold text-slate-50">{uninkableCount}</p>
      </div>
    </div>

    {#if typeBreakdown.length > 0}
      <div class="flex flex-wrap gap-1.5">
        {#each typeBreakdown as entry (entry.type)}
          <span class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs text-slate-200">
            <span>{formatType(entry.type)}</span>
            <span class="text-slate-400">{entry.count}</span>
          </span>
        {/each}
      </div>
    {/if}

    <!-- Card grid -->
    <div class="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
      {#each sortedEntries as entry (entry.publicId)}
        {@const card = entry.card}
        {@const displayName = getFullName(card)}
        <HoverCard.Root openDelay={180}>
          <HoverCard.Trigger class="block">
            <div class="group relative overflow-hidden rounded-lg border border-white/10 bg-slate-900/60 transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg">
              {#if card.cardNumber !== undefined}
                <CardImage
                  set={card.set}
                  number={card.cardNumber}
                  alt={displayName}
                  crop="art_only"
                  class="w-full"
                />
              {:else}
                <div class="flex aspect-[734/602] items-center justify-center px-2 text-center text-[0.6rem] text-slate-400">
                  {displayName}
                </div>
              {/if}
              {#if entry.quantity > 1}
                <div class="pointer-events-none absolute bottom-1 left-1 flex size-6 items-center justify-center rounded-md bg-slate-950/85 text-xs font-bold text-white shadow">
                  {entry.quantity}
                </div>
              {/if}
            </div>
          </HoverCard.Trigger>
          <HoverCard.Content
            side="top"
            sideOffset={8}
            class="{card.cardType === 'location' ? 'w-[320px]' : 'w-60'} rounded-xl border-white/10 bg-slate-950/95 p-0 shadow-[0_24px_64px_-24px_rgba(2,6,23,0.95)]"
          >
            {#if card.cardNumber !== undefined}
              {#if card.cardType === "location"}
                <div class="relative overflow-hidden rounded-xl" style="height: 229px;">
                  <div
                    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90"
                    style="width: 229px; height: 320px;"
                  >
                    <CardImage
                      set={card.set}
                      number={card.cardNumber}
                      alt={displayName}
                      class="h-full w-full"
                    />
                  </div>
                </div>
              {:else}
                <CardImage
                  set={card.set}
                  number={card.cardNumber}
                  alt={displayName}
                  class="w-full rounded-xl"
                />
              {/if}
            {/if}
          </HoverCard.Content>
        </HoverCard.Root>
      {/each}
    </div>
  {/if}
</section>
