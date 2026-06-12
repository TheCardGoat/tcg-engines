<script lang="ts">
  import { Button } from "$lib/design-system/primitives/button";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import CardImage from "$lib/design-system/simulator/cards/CardImage.svelte";
  import ArtPickerDialog from "$lib/features/atelier/ui/ArtPickerDialog.svelte";
  import {
    fetchDeckVersionArtSelections,
    saveDeckVersionArtSelections,
  } from "$lib/features/atelier/api/atelier-api.js";
  import type { MatchmakingPlayerContextState } from "@/features/matchmaking/state/player-context.svelte.js";
  import {
    fetchDeckListSnapshotByDeckListId,
    updateDeckForProfile,
    type ProfileDeckSummary,
  } from "@/features/matchmaking/api/player-context-api.js";
  import { getAllCardsById } from "@tcg/lorcana-cards";
  import { cardsAuxKv } from "@tcg/lorcana-cards/data";
  import {
    getFullName,
    INK_TYPES,
    CARD_TYPES,
    type InkType,
    type CardType,
    type LorcanaCardDefinition,
  } from "@tcg/lorcana-types";
  import AlertTriangle from "@lucide/svelte/icons/triangle-alert";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import BarChart3 from "@lucide/svelte/icons/chart-column";
  import CheckCircle2 from "@lucide/svelte/icons/circle-check";
  import Copy from "@lucide/svelte/icons/copy";
  import Download from "@lucide/svelte/icons/download";
  import Grid2X2 from "@lucide/svelte/icons/grid-2x2";
  import List from "@lucide/svelte/icons/list";
  import Loader from "@lucide/svelte/icons/loader-circle";
  import Minus from "@lucide/svelte/icons/minus";
  import Plus from "@lucide/svelte/icons/plus";
  import Save from "@lucide/svelte/icons/save";
  import Search from "@lucide/svelte/icons/search";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import Upload from "@lucide/svelte/icons/upload";
  import X from "@lucide/svelte/icons/x";

  interface Props {
    playerContext: MatchmakingPlayerContextState;
    deckSummary: ProfileDeckSummary;
    onBack: () => void;
  }

  let { playerContext, deckSummary, onBack }: Props = $props();

  type DeckEntry = { cardPublicId: string; quantity: number };
  type DeckCard = LorcanaCardDefinition & { quantity: number };
  type BuilderTab = "cards" | "stats";
  type MobileMode = "cards" | "deck";
  type ViewMode = "grid" | "list";
  type InkFilter = InkType | "all";
  type CostFilter = "all" | `${number}`;
  type TypeFilter = CardType | "all";
  type InkableFilter = "all" | "inkable" | "uninkable";

  const COST_OPTIONS: CostFilter[] = ["all", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const TARGET_DECK_SIZE = 60;
  const DEFAULT_MAX_COPIES = 4;

  const inkStyles: Record<InkType, string> = {
    amber: "bg-yellow-400 text-black border-yellow-200",
    amethyst: "bg-purple-500 text-white border-purple-300",
    emerald: "bg-emerald-500 text-white border-emerald-300",
    ruby: "bg-red-500 text-white border-red-300",
    sapphire: "bg-blue-500 text-white border-blue-300",
    steel: "bg-slate-500 text-white border-slate-300",
  };

  const typeLabels: Record<CardType, string> = {
    character: "Characters",
    action: "Actions",
    item: "Items",
    location: "Locations",
  };

  let loading = $state(true);
  let loadError = $state<string | null>(null);
  let saving = $state(false);
  let saveError = $state<string | null>(null);

  let artSelections = $state<Record<string, string>>({});
  let artPickerOpen = $state(false);
  let artPickerCanonicalId = $state<string | null>(null);
  let artPickerError = $state<string | null>(null);

  // svelte-ignore state_referenced_locally
  let deckName = $state(deckSummary.deckName);
  let entries = $state<DeckEntry[]>([]);
  let cardsById = $state<Record<string, LorcanaCardDefinition>>({});

  let importOpen = $state(false);
  let importText = $state("");
  let exportOpen = $state(false);
  let copyFeedback = $state<string | null>(null);

  let search = $state("");
  let inkFilter = $state<InkFilter>("all");
  let costFilter = $state<CostFilter>("all");
  let typeFilter = $state<TypeFilter>("all");
  let setFilter = $state<string>("all");
  let inkableFilter = $state<InkableFilter>("all");
  let viewMode = $state<ViewMode>("grid");
  let builderTab = $state<BuilderTab>("cards");
  let mobileMode = $state<MobileMode>("cards");
  let statusMessage = $state("");

  $effect(() => {
    void loadDeck();
  });

  async function loadDeck(): Promise<void> {
    loading = true;
    loadError = null;
    try {
      const [snapshot, catalog, artResp] = await Promise.all([
        fetchDeckListSnapshotByDeckListId(deckSummary.activeDeckListId),
        getAllCardsById(),
        fetchDeckVersionArtSelections(deckSummary.activeDeckVersionId).catch(() => ({
          deckVersionId: deckSummary.activeDeckVersionId,
          artSelections: null,
        })),
      ]);
      cardsById = catalog;
      entries = snapshot.historicDeck.map((c) => ({
        cardPublicId: c.cardPublicId,
        quantity: c.quantity,
      }));
      artSelections = artResp.artSelections ?? {};
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Failed to load deck";
    } finally {
      loading = false;
    }
  }

  function canonicalIdForCard(card: LorcanaCardDefinition): string {
    return cardsAuxKv.canonicalIdByShortId[card.id] ?? card.canonicalId;
  }

  function selectedPrintingForCard(card: LorcanaCardDefinition): string | null {
    return artSelections[canonicalIdForCard(card)] ?? null;
  }

  function openArtPickerForCard(card: LorcanaCardDefinition): void {
    artPickerCanonicalId = canonicalIdForCard(card);
    artPickerOpen = true;
  }

  async function persistArtSelections(next: Record<string, string>): Promise<void> {
    artPickerError = null;
    try {
      const cleaned = Object.keys(next).length === 0 ? null : next;
      await saveDeckVersionArtSelections({
        deckVersionId: deckSummary.activeDeckVersionId,
        artSelections: cleaned,
      });
      artSelections = next;
    } catch (err) {
      artPickerError = err instanceof Error ? err.message : "Failed to save art selection";
    }
  }

  async function handleArtPicked(printingShortId: string | null): Promise<void> {
    if (!artPickerCanonicalId) return;
    const next = { ...artSelections };
    if (printingShortId) {
      next[artPickerCanonicalId] = printingShortId;
    } else {
      delete next[artPickerCanonicalId];
    }
    await persistArtSelections(next);
  }

  function maxCopiesFor(card: LorcanaCardDefinition): number {
    if (card.cardCopyLimit === "no-limit") return Number.POSITIVE_INFINITY;
    if (typeof card.cardCopyLimit === "number") return card.cardCopyLimit;
    return DEFAULT_MAX_COPIES;
  }

  const cardsList = $derived(Object.values(cardsById));

  const availableSets = $derived.by(() => {
    return Array.from(new Set(cardsList.map((c) => c.set))).sort((a, b) =>
      String(a).localeCompare(String(b)),
    );
  });

  const deckCards = $derived.by<DeckCard[]>(() => {
    const out: DeckCard[] = [];
    for (const e of entries) {
      const card = cardsById[e.cardPublicId];
      if (card) out.push({ ...card, quantity: e.quantity });
    }
    return out;
  });

  const deckQuantityById = $derived.by(() => {
    return new Map(entries.map((e) => [e.cardPublicId, e.quantity]));
  });

  const deckCount = $derived(deckCards.reduce((sum, c) => sum + c.quantity, 0));

  const selectedInks = $derived.by(() => {
    const inks = new Set<InkType>();
    for (const c of deckCards) for (const i of c.inkType) inks.add(i);
    return INK_TYPES.filter((i) => inks.has(i));
  });

  const costCurve = $derived.by(() => {
    const curve = new Map<number, number>();
    for (const c of deckCards) {
      const bucket = Math.min(c.cost, 8);
      curve.set(bucket, (curve.get(bucket) ?? 0) + c.quantity);
    }
    return Array.from({ length: 9 }, (_, cost) => ({
      cost,
      label: cost === 8 ? "8+" : String(cost),
      count: curve.get(cost) ?? 0,
    }));
  });

  const maxCurveCount = $derived(Math.max(1, ...costCurve.map((b) => b.count)));

  const filteredCards = $derived.by(() => {
    const q = search.trim().toLowerCase();
    return cardsList
      .filter((card) => {
        if (q) {
          const hay = `${card.name} ${card.version ?? ""} ${card.set}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (inkFilter !== "all" && !card.inkType.includes(inkFilter)) return false;
        if (typeFilter !== "all" && card.cardType !== typeFilter) return false;
        if (setFilter !== "all" && String(card.set) !== setFilter) return false;
        if (costFilter !== "all" && card.cost !== Number(costFilter)) return false;
        if (inkableFilter === "inkable" && !card.inkable) return false;
        if (inkableFilter === "uninkable" && card.inkable) return false;
        return true;
      })
      .sort((a, b) => a.cost - b.cost || getFullName(a).localeCompare(getFullName(b)));
  });

  const groupedDeckCards = $derived.by(() => {
    return CARD_TYPES.map((type) => {
      const items = deckCards
        .filter((c) => c.cardType === type)
        .sort((a, b) => a.cost - b.cost || getFullName(a).localeCompare(getFullName(b)));
      return {
        type,
        label: typeLabels[type],
        entries: items,
        count: items.reduce((sum, c) => sum + c.quantity, 0),
      };
    }).filter((g) => g.entries.length > 0);
  });

  const validationIssues = $derived.by(() => {
    const issues: string[] = [];
    if (deckCount < TARGET_DECK_SIZE) {
      const need = TARGET_DECK_SIZE - deckCount;
      issues.push(`Add ${need} more card${need === 1 ? "" : "s"} to reach 60.`);
    } else if (deckCount > TARGET_DECK_SIZE) {
      const extra = deckCount - TARGET_DECK_SIZE;
      issues.push(`Remove ${extra} card${extra === 1 ? "" : "s"} to return to 60.`);
    }
    if (selectedInks.length > 2) {
      issues.push(`Use no more than 2 ink colors. This deck currently uses ${selectedInks.length}.`);
    }
    for (const c of deckCards) {
      const limit = maxCopiesFor(c);
      if (c.quantity > limit) {
        issues.push(`${getFullName(c)} has ${c.quantity}/${limit} copies.`);
      }
    }
    return issues;
  });

  const deckIsValid = $derived(validationIssues.length === 0);

  const sortedEntries = $derived.by(() => {
    return [...entries].sort((a, b) =>
      cardNameFor(a.cardPublicId).localeCompare(cardNameFor(b.cardPublicId)),
    );
  });

  function cardNameFor(publicId: string): string {
    const card = cardsById[publicId];
    return card ? getFullName(card) : publicId;
  }

  function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function getQuantity(card: LorcanaCardDefinition): number {
    return deckQuantityById.get(card.id) ?? 0;
  }

  function setEntryQuantity(publicId: string, quantity: number): void {
    const card = cardsById[publicId];
    const limit = card ? maxCopiesFor(card) : DEFAULT_MAX_COPIES;
    const bounded = Math.max(0, Math.min(limit, quantity));
    const idx = entries.findIndex((e) => e.cardPublicId === publicId);
    if (bounded === 0) {
      if (idx !== -1) entries = entries.filter((_, i) => i !== idx);
      return;
    }
    if (idx === -1) {
      entries = [...entries, { cardPublicId: publicId, quantity: bounded }];
    } else {
      const copy = [...entries];
      copy[idx] = { ...copy[idx], quantity: bounded };
      entries = copy;
    }
  }

  function addCard(card: LorcanaCardDefinition): void {
    const current = getQuantity(card);
    const limit = maxCopiesFor(card);
    if (current >= limit) {
      statusMessage = `${getFullName(card)} is already at ${limit} ${limit === 1 ? "copy" : "copies"}.`;
      return;
    }
    setEntryQuantity(card.id, current + 1);
    statusMessage = "";
  }

  function removeCard(card: LorcanaCardDefinition): void {
    const current = getQuantity(card);
    if (current <= 0) return;
    setEntryQuantity(card.id, current - 1);
    statusMessage = "";
  }

  function clearDeck(): void {
    entries = [];
    statusMessage = "";
  }

  function clearFilters(): void {
    search = "";
    inkFilter = "all";
    costFilter = "all";
    typeFilter = "all";
    setFilter = "all";
    inkableFilter = "all";
  }

  function buildDeckText(): string {
    return sortedEntries
      .map((e) => `${e.quantity} ${cardNameFor(e.cardPublicId)}`)
      .join("\n");
  }

  async function handleSave(): Promise<void> {
    const activeProfile = playerContext.activeProfile;
    if (!activeProfile) {
      saveError = "No active profile";
      return;
    }
    const trimmedName = deckName.trim();
    if (!trimmedName) {
      saveError = "Deck name is required";
      return;
    }
    if (entries.length === 0) {
      saveError = "Deck is empty";
      return;
    }
    saving = true;
    saveError = null;
    try {
      await updateDeckForProfile(activeProfile.gameProfileId, deckSummary.deckId, {
        deckName: trimmedName,
        deckText: buildDeckText(),
      });
      await playerContext.loadProfileDecks(activeProfile.gameProfileId, { force: true });
      onBack();
    } catch (error) {
      saveError = error instanceof Error ? error.message : "Failed to save deck";
    } finally {
      saving = false;
    }
  }

  function applyImport(): void {
    const parsed = parseDeckText(importText);
    if (parsed.length === 0) return;
    entries = parsed;
    importOpen = false;
    importText = "";
  }

  function parseDeckText(text: string): DeckEntry[] {
    const byName: Record<string, string> = {};
    for (const [id, card] of Object.entries(cardsById)) {
      byName[getFullName(card).toLowerCase()] = id;
    }
    const aggregated = new Map<string, number>();
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("//")) continue;
      const match = /^(\d+)\s+(.+)$/.exec(trimmed);
      if (!match) continue;
      const qty = Number.parseInt(match[1], 10);
      const name = match[2].trim().toLowerCase();
      const id = byName[name];
      if (id && qty > 0) {
        const card = cardsById[id];
        const limit = card ? maxCopiesFor(card) : DEFAULT_MAX_COPIES;
        aggregated.set(id, Math.min((aggregated.get(id) ?? 0) + qty, limit));
      }
    }
    return Array.from(aggregated.entries()).map(([cardPublicId, quantity]) => ({
      cardPublicId,
      quantity,
    }));
  }

  async function copyExport(): Promise<void> {
    try {
      await navigator.clipboard.writeText(buildDeckText());
      copyFeedback = "Copied!";
      setTimeout(() => {
        copyFeedback = null;
      }, 1500);
    } catch {
      copyFeedback = "Copy failed";
    }
  }
</script>

<div class="mx-auto flex w-full max-w-7xl min-h-[calc(100dvh-9rem)] flex-col gap-4 py-4 text-slate-100">
  <header class="flex flex-col gap-3 border-b border-white/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
    <div class="flex min-w-0 flex-1 items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        class="size-9 shrink-0 text-slate-100 hover:bg-white/10 hover:text-white"
        onclick={onBack}
        aria-label="Back to deck vault"
      >
        <ArrowLeft class="size-5" />
      </Button>
      <div class="min-w-0 flex-1">
        <label for="lorcana-deck-name" class="sr-only">Deck name</label>
        <Input
          id="lorcana-deck-name"
          bind:value={deckName}
          maxlength={120}
          disabled={saving}
          class="h-11 border-0 bg-transparent px-0 text-xl font-semibold text-white shadow-none focus-visible:ring-0 md:text-2xl"
          placeholder="Unnamed deck"
        />
        <p class="text-sm text-slate-400">{deckCount} cards</p>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-2 sm:flex sm:items-center">
      <Button
        type="button"
        variant="outline"
        size="sm"
        class="gap-2 border-white/15 bg-transparent text-slate-100 hover:bg-white/10"
        onclick={() => {
          importOpen = !importOpen;
          exportOpen = false;
        }}
      >
        <Upload class="size-4" />
        <span class="hidden sm:inline">Import</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        class="gap-2 border-white/15 bg-transparent text-slate-100 hover:bg-white/10"
        onclick={() => {
          exportOpen = !exportOpen;
          importOpen = false;
        }}
        disabled={entries.length === 0}
      >
        <Download class="size-4" />
        <span class="hidden sm:inline">Export</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        class="gap-2 border-white/15 bg-transparent text-slate-100 hover:bg-white/10"
        onclick={clearDeck}
        disabled={entries.length === 0}
      >
        <Trash2 class="size-4" />
        <span class="hidden sm:inline">Clear</span>
      </Button>
      <Button
        type="button"
        size="sm"
        class="gap-2"
        disabled={saving || loading}
        onclick={() => void handleSave()}
      >
        {#if saving}
          <Loader class="size-4 animate-spin" />
          <span class="hidden sm:inline">Saving…</span>
        {:else}
          <Save class="size-4" />
          <span class="hidden sm:inline">Save</span>
        {/if}
      </Button>
    </div>
  </header>

  {#if saveError}
    <div
      class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
      role="alert"
    >
      {saveError}
    </div>
  {/if}

  {#if importOpen}
    <div class="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
      <p class="text-sm text-slate-300">
        Paste a deck list (one line per entry, format: <code>4 Card Name - Version</code>). This
        replaces the current list.
      </p>
      <Textarea
        bind:value={importText}
        rows={10}
        placeholder={`4 Mickey Mouse - Brave Little Tailor\n4 Tinker Bell - Giant Fairy`}
        class="min-h-40 border-white/10 bg-white/5 text-slate-100"
      />
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          class="border-white/15 bg-transparent text-slate-100 hover:bg-white/10"
          onclick={() => {
            importOpen = false;
            importText = "";
          }}
        >
          Cancel
        </Button>
        <Button type="button" size="sm" onclick={applyImport} disabled={!importText.trim()}>
          Replace deck
        </Button>
      </div>
    </div>
  {/if}

  {#if exportOpen}
    <div class="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
      <div class="flex items-center justify-between gap-2">
        <p class="text-sm text-slate-300">Deck text (paste into other tools):</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          class="border-white/15 bg-transparent text-slate-100 hover:bg-white/10"
          onclick={() => void copyExport()}
        >
          <Copy class="mr-1.5 size-3.5" />
          {copyFeedback ?? "Copy"}
        </Button>
      </div>
      <Textarea
        readonly
        value={buildDeckText()}
        rows={12}
        class="min-h-48 border-white/10 bg-white/5 text-slate-100"
      />
    </div>
  {/if}

  <div class="grid grid-cols-2 rounded-md border border-white/10 bg-white/5 p-1 lg:hidden">
    <button
      type="button"
      class="rounded-sm px-3 py-2 text-sm font-medium transition {mobileMode === 'cards'
        ? 'bg-slate-900/70 text-white shadow-sm'
        : 'text-slate-400'}"
      onclick={() => (mobileMode = "cards")}
    >
      Cards
    </button>
    <button
      type="button"
      class="rounded-sm px-3 py-2 text-sm font-medium transition {mobileMode === 'deck'
        ? 'bg-slate-900/70 text-white shadow-sm'
        : 'text-slate-400'}"
      onclick={() => (mobileMode = "deck")}
    >
      Deck {deckCount}/60
    </button>
  </div>

  {#if loadError}
    <div class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
      {loadError}
    </div>
  {/if}

  <div class="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.42fr)]">
    <section
      class="{mobileMode === 'deck'
        ? 'hidden lg:flex'
        : 'flex'} min-h-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-slate-900/40"
    >
      <div class="space-y-3 border-b border-white/10 p-3 sm:p-4">
        <div class="relative">
          <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            bind:value={search}
            class="h-11 border-white/10 bg-white/5 pl-9 text-slate-100 placeholder:text-slate-400"
            placeholder="Search cards..."
            autocomplete="off"
            disabled={loading}
          />
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <div class="flex flex-wrap gap-1.5">
            <button
              type="button"
              class="h-8 rounded-md border px-2 text-xs font-medium transition {inkFilter === 'all'
                ? 'border-sky-400 bg-sky-500 text-white'
                : 'border-white/15 bg-transparent text-slate-300 hover:text-white'}"
              onclick={() => (inkFilter = "all")}
            >
              All inks
            </button>
            {#each INK_TYPES as ink (ink)}
              <button
                type="button"
                class="size-8 rounded-md border text-[0px] transition hover:scale-105 {inkStyles[ink]} {inkFilter ===
                ink
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900'
                  : ''}"
                title={capitalize(ink)}
                aria-label={capitalize(ink)}
                onclick={() => (inkFilter = ink)}
              >
                {capitalize(ink)}
              </button>
            {/each}
          </div>

          <select
            bind:value={costFilter}
            class="h-9 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-slate-100"
          >
            {#each COST_OPTIONS as cost (cost)}
              <option value={cost} class="bg-slate-900">
                {cost === "all" ? "All costs" : cost === "9" ? "9+" : `Cost ${cost}`}
              </option>
            {/each}
          </select>

          <select
            bind:value={typeFilter}
            class="h-9 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-slate-100"
          >
            <option value="all" class="bg-slate-900">All types</option>
            {#each CARD_TYPES as type (type)}
              <option value={type} class="bg-slate-900">{typeLabels[type]}</option>
            {/each}
          </select>

          <select
            bind:value={setFilter}
            class="h-9 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-slate-100"
          >
            <option value="all" class="bg-slate-900">All sets</option>
            {#each availableSets as setName (setName)}
              <option value={String(setName)} class="bg-slate-900">{setName}</option>
            {/each}
          </select>

          <select
            bind:value={inkableFilter}
            class="h-9 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-slate-100"
          >
            <option value="all" class="bg-slate-900">Inkability</option>
            <option value="inkable" class="bg-slate-900">Inkable</option>
            <option value="uninkable" class="bg-slate-900">Uninkable</option>
          </select>

          <Button
            variant="ghost"
            size="sm"
            onclick={clearFilters}
            class="gap-2 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <X class="size-4" />
            Clear
          </Button>

          <div class="ml-auto flex rounded-md border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              class="rounded-sm p-1.5 transition {viewMode === 'grid'
                ? 'bg-slate-900/70 text-white'
                : 'text-slate-400'}"
              title="Image grid"
              aria-label="Image grid"
              onclick={() => (viewMode = "grid")}
            >
              <Grid2X2 class="size-4" />
            </button>
            <button
              type="button"
              class="rounded-sm p-1.5 transition {viewMode === 'list'
                ? 'bg-slate-900/70 text-white'
                : 'text-slate-400'}"
              title="Compact list"
              aria-label="Compact list"
              onclick={() => (viewMode = "list")}
            >
              <List class="size-4" />
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-400">
          <span>{filteredCards.length} cards found</span>
          {#if statusMessage}
            <span class="text-amber-300">{statusMessage}</span>
          {/if}
        </div>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
        {#if loading}
          <div class="flex items-center gap-2 text-sm text-slate-400">
            <Loader class="size-4 animate-spin" />
            Loading cards…
          </div>
        {:else if viewMode === "grid"}
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {#each filteredCards as card (card.id)}
              {@const qty = getQuantity(card)}
              {@const limit = maxCopiesFor(card)}
              <article class="group min-w-0">
                <div class="relative overflow-hidden rounded-md border border-white/10 bg-slate-950/60 shadow-sm transition group-hover:border-sky-400/60">
                  <CardImage
                    set={card.set}
                    number={card.cardNumber ?? 0}
                    alt={getFullName(card)}
                    crop="full"
                  />
                </div>
                <div class="mt-2 grid grid-cols-[2rem_1fr_2rem] items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    class="size-8 border-white/15 bg-transparent text-slate-200 hover:bg-white/10"
                    onclick={() => removeCard(card)}
                    disabled={qty === 0}
                    aria-label={`Remove ${getFullName(card)}`}
                  >
                    <Minus class="size-4" />
                  </Button>
                  <div class="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-center text-sm font-semibold text-slate-100">
                    {qty} / {limit === Number.POSITIVE_INFINITY ? "∞" : limit}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    class="size-8 border-white/15 bg-transparent text-slate-200 hover:bg-white/10"
                    onclick={() => addCard(card)}
                    disabled={qty >= limit}
                    aria-label={`Add ${getFullName(card)}`}
                  >
                    <Plus class="size-4" />
                  </Button>
                </div>
              </article>
            {/each}
          </div>
        {:else}
          <div class="divide-y divide-white/10 rounded-md border border-white/10">
            {#each filteredCards as card (card.id)}
              {@const qty = getQuantity(card)}
              {@const limit = maxCopiesFor(card)}
              <div class="grid grid-cols-[3rem_minmax(0,1fr)_7.5rem] items-center gap-3 p-2">
                <div class="w-12 overflow-hidden rounded border border-white/10 bg-slate-950/60">
                  <CardImage
                    set={card.set}
                    number={card.cardNumber ?? 0}
                    alt=""
                    crop="full"
                  />
                </div>
                <div class="min-w-0">
                  <div class="truncate text-sm font-medium text-slate-100">{getFullName(card)}</div>
                  <div class="flex flex-wrap items-center gap-1 text-xs text-slate-400">
                    <span>{card.cost}</span>
                    <span>{typeLabels[card.cardType]}</span>
                    <span>{card.set}</span>
                  </div>
                </div>
                <div class="grid grid-cols-[2rem_1fr_2rem] items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    class="size-8 border-white/15 bg-transparent text-slate-200 hover:bg-white/10"
                    onclick={() => removeCard(card)}
                    disabled={qty === 0}
                    aria-label={`Remove ${getFullName(card)}`}
                  >
                    <Minus class="size-4" />
                  </Button>
                  <div class="text-center text-sm font-semibold text-slate-100">{qty}</div>
                  <Button
                    variant="outline"
                    size="icon"
                    class="size-8 border-white/15 bg-transparent text-slate-200 hover:bg-white/10"
                    onclick={() => addCard(card)}
                    disabled={qty >= limit}
                    aria-label={`Add ${getFullName(card)}`}
                  >
                    <Plus class="size-4" />
                  </Button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </section>

    <aside
      class="{mobileMode === 'cards'
        ? 'hidden lg:flex'
        : 'flex'} min-h-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-slate-900/40"
    >
      <div class="space-y-4 border-b border-white/10 p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="text-2xl font-semibold text-white">{deckCount} cards</div>
            <div class="mt-1 flex flex-wrap gap-1">
              {#if selectedInks.length === 0}
                <span class="text-sm text-slate-400">No inks selected</span>
              {:else}
                {#each selectedInks as ink (ink)}
                  <span class="rounded-full border px-2 py-0.5 text-xs font-semibold {inkStyles[ink]}">
                    {capitalize(ink)}
                  </span>
                {/each}
              {/if}
            </div>
          </div>
          <div
            class="flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm {deckIsValid
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-amber-500/40 bg-amber-500/10 text-amber-300'}"
          >
            {#if deckIsValid}
              <CheckCircle2 class="size-4" />
              Valid
            {:else}
              <AlertTriangle class="size-4" />
              Needs fixes
            {/if}
          </div>
        </div>

        <div>
          <div class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Cost curve
          </div>
          <div class="grid grid-cols-9 items-end gap-1">
            {#each costCurve as bucket (bucket.cost)}
              <div class="flex min-w-0 flex-col items-center gap-1">
                <div class="flex h-14 w-full items-end rounded-sm bg-white/5">
                  <div
                    class="w-full rounded-sm bg-sky-500"
                    style={`height: ${Math.max(6, (bucket.count / maxCurveCount) * 56)}px`}
                  ></div>
                </div>
                <div class="text-[11px] text-slate-400">{bucket.label}</div>
              </div>
            {/each}
          </div>
        </div>

        {#if validationIssues.length > 0}
          <div class="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
            <div class="mb-1 flex items-center gap-2 font-semibold">
              <AlertTriangle class="size-4" />
              Deck issues
            </div>
            <ul class="space-y-1">
              {#each validationIssues as issue (issue)}
                <li>{issue}</li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>

      <div class="grid grid-cols-2 border-b border-white/10 bg-white/5 p-1">
        <button
          type="button"
          class="rounded-md px-3 py-2 text-sm font-medium transition {builderTab === 'cards'
            ? 'bg-slate-900/70 text-white shadow-sm'
            : 'text-slate-400'}"
          onclick={() => (builderTab = "cards")}
        >
          Cards
        </button>
        <button
          type="button"
          class="rounded-md px-3 py-2 text-sm font-medium transition {builderTab === 'stats'
            ? 'bg-slate-900/70 text-white shadow-sm'
            : 'text-slate-400'}"
          onclick={() => (builderTab = "stats")}
        >
          Stats
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto p-4">
        {#if builderTab === "cards"}
          {#if loading}
            <div class="flex items-center gap-2 text-sm text-slate-400">
              <Loader class="size-4 animate-spin" />
              Loading deck…
            </div>
          {:else if deckCards.length === 0}
            <div class="flex h-full min-h-72 flex-col items-center justify-center text-center text-slate-400">
              <List class="mb-3 size-10" />
              <p class="font-medium">Your deck is empty</p>
              <p class="text-sm">Add cards from the browser to start building.</p>
            </div>
          {:else}
            <div class="space-y-5">
              {#each groupedDeckCards as group (group.type)}
                <section>
                  <div class="mb-2 flex items-center justify-between border-b border-white/10 pb-1">
                    <h3 class="text-sm font-semibold text-slate-200">{group.label}</h3>
                    <span class="text-xs text-slate-400">{group.count}</span>
                  </div>
                  <div class="space-y-1.5">
                    {#each group.entries as card (card.id)}
                      {@const limit = maxCopiesFor(card)}
                      <div
                        class="grid grid-cols-[2rem_minmax(0,1fr)_6.75rem] items-center gap-2 rounded-md border border-transparent p-1.5 hover:border-white/10 hover:bg-white/5"
                      >
                        <div class="flex size-7 items-center justify-center rounded-full border border-white/15 bg-slate-950/60 text-xs font-semibold text-slate-100">
                          {card.cost}
                        </div>
                        <div class="min-w-0">
                          <div class="truncate text-sm font-medium text-slate-100">
                            {getFullName(card)}
                          </div>
                          <div class="mt-0.5 flex items-center gap-2">
                            <div class="flex gap-1">
                              {#each card.inkType as ink (ink)}
                                <span class="size-2 rounded-full {inkStyles[ink]}" title={capitalize(ink)}></span>
                              {/each}
                            </div>
                            <button
                              type="button"
                              class="text-[10px] uppercase tracking-wide text-slate-400 underline-offset-2 hover:text-sky-300 hover:underline"
                              onclick={() => openArtPickerForCard(card)}
                              title="Change art"
                            >
                              {selectedPrintingForCard(card) ? "Art set" : "Default art"}
                            </button>
                          </div>
                        </div>
                        <div class="grid grid-cols-[1.75rem_1fr_1.75rem] items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            class="size-7 border-white/15 bg-transparent text-slate-200 hover:bg-white/10"
                            onclick={() => removeCard(card)}
                            aria-label={`Remove ${getFullName(card)}`}
                          >
                            <Minus class="size-3.5" />
                          </Button>
                          <div class="text-center text-sm font-semibold text-slate-100">
                            {card.quantity}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            class="size-7 border-white/15 bg-transparent text-slate-200 hover:bg-white/10"
                            onclick={() => addCard(card)}
                            disabled={card.quantity >= limit}
                            aria-label={`Add ${getFullName(card)}`}
                          >
                            <Plus class="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    {/each}
                  </div>
                </section>
              {/each}
            </div>
          {/if}
        {:else}
          <div class="space-y-5">
            <section>
              <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
                <BarChart3 class="size-4" />
                Type distribution
              </h3>
              <div class="space-y-2">
                {#each CARD_TYPES as type (type)}
                  {@const typeCount = deckCards
                    .filter((c) => c.cardType === type)
                    .reduce((sum, c) => sum + c.quantity, 0)}
                  <div>
                    <div class="mb-1 flex justify-between text-sm text-slate-200">
                      <span>{typeLabels[type]}</span>
                      <span class="text-slate-400">{typeCount}</span>
                    </div>
                    <div class="h-2 rounded-full bg-white/5">
                      <div
                        class="h-2 rounded-full bg-sky-500"
                        style={`width: ${deckCount === 0 ? 0 : (typeCount / deckCount) * 100}%`}
                      ></div>
                    </div>
                  </div>
                {/each}
              </div>
            </section>

            <section>
              <h3 class="mb-3 text-sm font-semibold text-slate-200">Ink mix</h3>
              <div class="grid grid-cols-2 gap-2">
                {#each INK_TYPES as ink (ink)}
                  {@const inkCount = deckCards
                    .filter((c) => c.inkType.includes(ink))
                    .reduce((sum, c) => sum + c.quantity, 0)}
                  <div class="rounded-md border border-white/10 bg-white/5 p-3">
                    <div class="mb-1 flex items-center gap-2">
                      <span class="size-3 rounded-full {inkStyles[ink]}"></span>
                      <span class="text-sm font-medium text-slate-200">{capitalize(ink)}</span>
                    </div>
                    <div class="text-2xl font-semibold text-white">{inkCount}</div>
                  </div>
                {/each}
              </div>
            </section>
          </div>
        {/if}
      </div>
    </aside>
  </div>

  <div class="sticky bottom-3 z-20 grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-white/10 bg-slate-900/90 p-3 shadow-lg backdrop-blur lg:hidden">
    <div>
      <div class="text-sm font-semibold text-white">Deck: {deckCount}/60</div>
      <div class="text-xs {deckIsValid ? 'text-emerald-300' : 'text-amber-300'}">
        {deckIsValid ? "Valid deck" : (validationIssues[0] ?? "Needs fixes")}
      </div>
    </div>
    <Button
      size="sm"
      onclick={() => (mobileMode = mobileMode === "deck" ? "cards" : "deck")}
    >
      {mobileMode === "deck" ? "Cards" : "Deck"}
    </Button>
  </div>
</div>

<ArtPickerDialog
  bind:open={artPickerOpen}
  canonicalId={artPickerCanonicalId}
  gameSlug="lorcana"
  gameProfileId={playerContext.activeProfile?.gameProfileId ?? ""}
  selectedPrintingShortId={artPickerCanonicalId
    ? (artSelections[artPickerCanonicalId] ?? null)
    : null}
  onSelect={handleArtPicked}
  onClose={() => {
    artPickerCanonicalId = null;
  }}
/>
