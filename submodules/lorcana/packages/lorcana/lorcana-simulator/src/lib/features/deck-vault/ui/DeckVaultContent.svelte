<script lang="ts">
  import { goto } from "$app/navigation";
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import { Button } from "$lib/design-system/primitives/button";
  import { m } from "$lib/i18n/messages.js";
  import type { MatchmakingPlayerContextState } from "@/features/matchmaking/state/player-context.svelte.js";
  import {
    importDeckForProfile,
  } from "@/features/matchmaking/api/player-context-api.js";
  import ImportDeckDialog from "@/features/matchmaking/ui/ImportDeckDialog.svelte";
  import { profileDeckSummaryToVaultItem, type DeckVaultItem } from "../types.js";
  import DeckVaultDetail from "./DeckVaultDetail.svelte";
  import DeckVaultGrid from "./DeckVaultGrid.svelte";
  import DeckVaultSortSelect from "./DeckVaultSortSelect.svelte";
  import ArrowLeft from "@lucide/svelte/icons/arrow-left";
  import Plus from "@lucide/svelte/icons/plus";
  import Loader from "@lucide/svelte/icons/loader-circle";

  interface Props {
    playerContext: MatchmakingPlayerContextState;
    onBack: () => void;
    selectionDisabled?: boolean;
  }

  let { playerContext, onBack, selectionDisabled = false }: Props = $props();

  // Create deck state
  let createDeckSubmitting = $state(false);

  async function handleCreateDeck(): Promise<void> {
    createDeckSubmitting = true;
    try {
      const deckId = await playerContext.createDeck(m["sim.deckVault.create.defaultName"]({}));
      if (deckId) {
        await goto(`/matchmaking/deck-vault/${deckId}`);
      }
    } finally {
      createDeckSubmitting = false;
    }
  }

  // Import deck dialog state
  let importDeckOpen = $state(false);
  let importDeckName = $state("");
  let importDeckText = $state("");
  let importDeckSubmitting = $state(false);
  let importDeckError = $state<string | null>(null);

  // Sort state
  let sortBy = $state<"newest" | "updated" | "name">("newest");

  const activeProfile = $derived(playerContext.activeProfile);
  const decksLoading = $derived(
    activeProfile ? playerContext.isLoadingDecks(activeProfile.gameProfileId) : false,
  );
  const decksError = $derived(
    activeProfile ? playerContext.deckLoadError(activeProfile.gameProfileId) : null,
  );

  const decks: DeckVaultItem[] = $derived.by(() => {
    if (!activeProfile) return [];
    let items = (activeProfile.decks ?? []).map((deck) =>
      profileDeckSummaryToVaultItem(deck, activeProfile.selectedDeckId),
    );

    // Apply sorting
    if (sortBy === "newest" || sortBy === "updated") {
      items.sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return dateB - dateA; // Most recent first
      });
    } else if (sortBy === "name") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    }

    return items;
  });

  const deckCount = $derived(decks.length);

  const selectedDeckSummary = $derived(
    activeProfile?.decks?.find((d) => d.deckId === activeProfile.selectedDeckId) ?? null,
  );

  $effect(() => {
    if (activeProfile) {
      void playerContext.loadProfileDecks(activeProfile.gameProfileId);
    }
  });

  function handleSelect(deck: DeckVaultItem): void {
    if (selectionDisabled) return;
    void playerContext.setSelectedDeck(deck.id);
  }

  function resetImportDeckForm(): void {
    importDeckName = "";
    importDeckText = "";
    importDeckError = null;
  }

  function handleEditRequest(deck: DeckVaultItem): void {
    void goto(`/matchmaking/deck-vault/${deck.id}`);
  }

  // Delete deck state
  let deleteDeckOpen = $state(false);
  let deleteDeckTarget = $state<DeckVaultItem | null>(null);
  let deleteDeckSubmitting = $state(false);

  function handleDeleteRequest(deck: DeckVaultItem): void {
    deleteDeckTarget = deck;
    deleteDeckOpen = true;
  }

  async function handleDeleteConfirm(): Promise<void> {
    if (!deleteDeckTarget) return;

    deleteDeckSubmitting = true;
    try {
      await playerContext.deleteDeck(deleteDeckTarget.id);
      deleteDeckOpen = false;
      deleteDeckTarget = null;
    } finally {
      deleteDeckSubmitting = false;
    }
  }

  async function handleImportDeckSubmit(): Promise<void> {
    if (!activeProfile) {
      importDeckError = m["sim.deckVault.import.noProfile"]({});
      return;
    }

    importDeckSubmitting = true;
    importDeckError = null;

    try {
      const importedDeck = await importDeckForProfile(activeProfile.gameProfileId, {
        deckName: importDeckName.trim(),
        deckText: importDeckText.trim(),
      });

      await playerContext.loadProfileDecks(activeProfile.gameProfileId, {
        force: true,
      });
      await playerContext.setSelectedDeck(importedDeck.deckId);

      resetImportDeckForm();
      importDeckOpen = false;
    } catch (error) {
      importDeckError =
        error instanceof Error ? error.message : m["sim.deckVault.import.failed"]({});
    } finally {
      importDeckSubmitting = false;
    }
  }
</script>

<div class="mx-auto w-full max-w-7xl space-y-6 py-4">
  <!-- Header -->
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          class="size-9 text-slate-100 hover:bg-white/10 hover:text-white"
          onclick={onBack}
          aria-label={m["sim.deckVault.back"]({})}
        >
          <ArrowLeft class="size-5" />
        </Button>
        <div>
          <h2 class="text-xl font-bold text-white">
            {m["sim.deckVault.title"]({})}
          </h2>
          <p class="text-sm text-slate-400">
            {m["sim.deckVault.deckCount"]({
              count: deckCount,
              deck: deckCount === 1 ? m["sim.deckVault.deckCount.singular"]({}) : m["sim.deckVault.deckCount.plural"]({}),
            })}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Button
          size="sm"
          variant="default"
          class="bg-white text-slate-900 hover:bg-slate-100"
          disabled={createDeckSubmitting}
          onclick={() => void handleCreateDeck()}
        >
          {#if createDeckSubmitting}
            <Loader class="mr-1.5 size-4 animate-spin" />
          {:else}
            <Plus class="mr-1.5 size-4" />
          {/if}
          {m["sim.deckVault.create.trigger"]({})}
        </Button>
        <Button
          size="sm"
          variant="outline"
          class="border-white/15 bg-transparent text-slate-100 hover:bg-white/10"
          onclick={() => { importDeckOpen = true; }}
        >
          {m["sim.matchmaking.importDeck.trigger"]({})}
        </Button>
      </div>
    </div>

    <!-- Sort -->
    <div class="flex items-center gap-2">
      <span class="text-xs uppercase tracking-wider text-slate-400">
        {m["sim.deckVault.sort.label"]({})}
      </span>
      <DeckVaultSortSelect
        bind:value={sortBy}
        onSort={(sort) => { sortBy = sort as "newest" | "updated" | "name"; }}
        options={[
          { value: "newest", label: m["sim.deckVault.sort.newest"]({}) },
          { value: "updated", label: m["sim.deckVault.sort.updated"]({}) },
          { value: "name", label: m["sim.deckVault.sort.name"]({}) },
        ]}
        aria-label={m["sim.deckVault.sort.aria"]({})}
      />
    </div>
  </div>

  <!-- Grid + selected deck detail (two-column on desktop) -->
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
    <DeckVaultGrid
      {decks}
      selectedDeckId={activeProfile?.selectedDeckId}
      onSelect={handleSelect}
      onDelete={handleDeleteRequest}
      onEdit={handleEditRequest}
      emptyTitle={decksLoading ? "Loading decks..." : m["sim.deckVault.empty.title"]({})}
      emptyDescription={decksError ?? (decksLoading
        ? "Decks load when this view opens."
        : m["sim.deckVault.empty.description"]({}))}
      emptyActionLabel={m["sim.matchmaking.importDeck.trigger"]({})}
      onEmptyAction={() => { importDeckOpen = true; }}
      class="self-start"
    />

    {#if selectedDeckSummary}
      <aside class="lg:sticky lg:top-4 lg:self-start">
        <DeckVaultDetail deck={selectedDeckSummary} />
      </aside>
    {:else if decks.length > 0}
      <aside class="hidden rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-slate-400 lg:block">
        Select a deck to see its cards and breakdown.
      </aside>
    {/if}
  </div>
</div>

<!-- Import Deck Dialog -->
<ImportDeckDialog
  bind:open={importDeckOpen}
  bind:deckName={importDeckName}
  bind:deckText={importDeckText}
  disabled={importDeckSubmitting ||
    !activeProfile?.gameProfileId ||
    importDeckName.trim().length === 0 ||
    importDeckText.trim().length === 0}
  submitting={importDeckSubmitting}
  error={importDeckError}
  onSubmit={handleImportDeckSubmit}
/>

<!-- Delete Deck Confirmation Dialog -->
<Dialog.Root bind:open={deleteDeckOpen}>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content class="border-white/10 bg-slate-950/98 text-slate-100 sm:max-w-md">
      <Dialog.Header>
        <Dialog.Title class="text-xl">
          {m["sim.deckVault.delete.title"]({})}
        </Dialog.Title>
        <Dialog.Description class="text-slate-300">
          {m["sim.deckVault.delete.description"]({ deckName: deleteDeckTarget?.name ?? "" })}
        </Dialog.Description>
      </Dialog.Header>

      <Dialog.Footer class="gap-2 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          class="border-white/15 bg-transparent text-slate-100 hover:bg-white/10"
          disabled={deleteDeckSubmitting}
          onclick={() => { deleteDeckOpen = false; }}
        >
          {m["sim.deckVault.delete.cancel"]({})}
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={deleteDeckSubmitting}
          class="min-w-28"
          onclick={() => void handleDeleteConfirm()}
        >
          {#if deleteDeckSubmitting}
            <Loader class="mr-2 size-4 animate-spin" />
            {m["sim.deckVault.delete.deleting"]({})}
          {:else}
            {m["sim.deckVault.delete.confirm"]({})}
          {/if}
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
