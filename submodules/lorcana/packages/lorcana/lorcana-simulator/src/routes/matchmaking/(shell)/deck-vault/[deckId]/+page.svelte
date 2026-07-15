<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import DeckBuilder from "$lib/features/deck-vault/ui/DeckBuilder.svelte";
  import { getMatchmakingLobbyContext } from "$lib/features/matchmaking/ui/useMatchmakingLobbyController.svelte.js";

  const controller = getMatchmakingLobbyContext();

  const deckId = $derived(page.params.deckId ?? "");
  const activeProfile = $derived(controller.playerContext.activeProfile);

  $effect(() => {
    if (activeProfile) {
      void controller.playerContext.loadProfileDecks(activeProfile.gameProfileId);
    }
  });

  const deckSummary = $derived(
    activeProfile?.decks?.find((d) => d.deckId === deckId) ?? null,
  );

  const decksLoading = $derived(
    activeProfile
      ? controller.playerContext.isLoadingDecks(activeProfile.gameProfileId)
      : false,
  );

  function back(): void {
    void goto("/matchmaking/deck-vault");
  }
</script>

<svelte:head>
  <title>Edit deck - Lorcana Simulator</title>
</svelte:head>

<div class="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
  {#if deckSummary}
    <DeckBuilder playerContext={controller.playerContext} {deckSummary} onBack={back} />
  {:else if decksLoading || !activeProfile}
    <div class="mx-auto w-full max-w-5xl py-8 text-sm text-slate-400">Loading…</div>
  {:else}
    <div class="mx-auto w-full max-w-5xl space-y-3 py-8">
      <p class="text-sm text-rose-200">Deck not found.</p>
      <button
        type="button"
        class="text-sm text-sky-300 underline hover:text-sky-200"
        onclick={back}
      >
        Back to deck vault
      </button>
    </div>
  {/if}
</div>
