<script lang="ts">
  import { goto } from "$app/navigation";
  import DeckVaultContent from "$lib/features/deck-vault/ui/DeckVaultContent.svelte";
  import { getMatchmakingLobbyContext } from "$lib/features/matchmaking/ui/useMatchmakingLobbyController.svelte.js";

  const PAGE_TITLE = "Deck Vault - Lorcana Simulator";
  const controller = getMatchmakingLobbyContext();
</script>

<svelte:head>
  <title>{PAGE_TITLE}</title>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8 min-h-0 flex-1 overflow-y-auto">
  <div class="mb-2 flex justify-end">
    <a
      href="/matchmaking/atelier"
      class="text-xs text-slate-400 underline-offset-2 hover:text-sky-300 hover:underline"
      title="Atelier — earn and spend Inkmarks on alternate art"
    >
      Open Atelier →
    </a>
  </div>
  <DeckVaultContent
    playerContext={controller.playerContext}
    selectionDisabled={controller.deckSelection.selectionDisabled}
    onBack={() => goto("/matchmaking")}
  />
</div>
