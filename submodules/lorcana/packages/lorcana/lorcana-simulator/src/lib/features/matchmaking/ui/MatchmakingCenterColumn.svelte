<script lang="ts">
  import MatchmakingActiveMatchCard from "./MatchmakingActiveMatchCard.svelte";
  import MatchmakingDeckSelectionCard from "./MatchmakingDeckSelectionCard.svelte";
  import MatchmakingPlayCard from "./MatchmakingPlayCard.svelte";
  import { getMatchmakingLobbyContext } from "./useMatchmakingLobbyController.svelte.js";
  import {cn} from "@/utils.js";
  import {SURFACE_CARD_CLASS, type PlayTab} from "@/features/matchmaking/ui/matchmaking-lobby.constants.js";
  import {Card, CardContent, CardHeader} from "@/design-system/primitives/card";

  interface Props {
    initialPlayTab?: PlayTab;
  }

  let { initialPlayTab }: Props = $props();

  const controller = getMatchmakingLobbyContext();
</script>

<MatchmakingActiveMatchCard
      activeMatchId={controller.queueStore.activeMatchId}
      forfeiting={controller.queueStore.forfeiting}
      forfeitSuccess={controller.queueStore.forfeitSuccess}
      onRejoinMatch={() => controller.handleRejoinMatch()}
      onForfeitMatch={() => controller.handleForfeitMatch()}
    />

<Card class={cn(SURFACE_CARD_CLASS, 'overflow-hidden')}>
    <CardHeader>
        <MatchmakingDeckSelectionCard
                isAuthenticated={controller.auth.isAuthenticated}
                error={controller.deckSelection.error}
                success={controller.deckSelection.success}
                selectionDisabled={controller.deckSelection.selectionDisabled}
                selectionDisabledReason={controller.deckSelection.selectionDisabledReason}
                activeProfile={controller.deckSelection.activeProfile}
                selectedDeck={controller.deckSelection.selectedDeck}
                selectedDeckId={controller.deckSelection.selectedDeckId}
                selectedDeckInks={controller.deckSelection.selectedDeckInks}
                activeProfileDecks={controller.deckSelection.activeProfileDecks}
                activeProfileDecksLoaded={controller.deckSelection.activeProfileDecksLoaded}
                activeProfileDecksLoading={controller.deckSelection.activeProfileDecksLoading}
                activeProfileDeckError={controller.deckSelection.activeProfileDeckError}
                selectedDeckTriggerLabel={controller.deckSelection.selectedDeckTriggerLabel}
                selectableDeckItems={controller.deckSelection.selectableDeckItems}
                selectedQueueFormat={controller.queue.activeQueueFormat}
                isDeckValidForSelectedFormat={controller.queue.isDeckValidForSelectedFormat}
                importLegacySubmitting={controller.deckSelection.importLegacySubmitting}
                importLegacyError={controller.deckSelection.importLegacyError}
                importLegacySuccess={controller.deckSelection.importLegacySuccess}
                onDismissSuccess={() => controller.dismissImportSuccess()}
                onImportLegacy={() => controller.handleImportLegacy()}
                onDeckChange={(deckId) => controller.handleDeckChange(deckId)}
                onDeckSelectOpenChange={(open) => controller.handleDeckSelectOpenChange(open)}
        />
    </CardHeader>

    <CardContent class="space-y-4 pt-5">



    <MatchmakingPlayCard initialTab={initialPlayTab} />
    </CardContent>
</Card>