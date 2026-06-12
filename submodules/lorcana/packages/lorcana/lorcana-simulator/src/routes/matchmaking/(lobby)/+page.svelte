<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import LiveMatchesTable from "$lib/features/matchmaking/ui/LiveMatchesTable.svelte";
  import MatchmakingActiveMatchCard from "$lib/features/matchmaking/ui/MatchmakingActiveMatchCard.svelte";
  import MatchmakingDeckSelectionCard from "$lib/features/matchmaking/ui/MatchmakingDeckSelectionCard.svelte";
  import MatchmakingPlayCard from "$lib/features/matchmaking/ui/MatchmakingPlayCard.svelte";
  import MatchmakingSidebar from "$lib/features/matchmaking/ui/MatchmakingSidebar.svelte";
  import EngagementEventCard from "$lib/features/matchmaking/ui/EngagementEventCard.svelte";
  import MatchmakingLeftColumn from "$lib/features/matchmaking/ui/MatchmakingLeftColumn.svelte";
  import MatchmakingCenterColumn from "$lib/features/matchmaking/ui/MatchmakingCenterColumn.svelte";
  import { getMatchmakingLobbyContext } from "$lib/features/matchmaking/ui/useMatchmakingLobbyController.svelte.js";
  import {
    LANE_CLASS,
    LANE_SCROLL_CLASS,
    SURFACE_CARD_CLASS,
    type PlayTab,
  } from "$lib/features/matchmaking/ui/matchmaking-lobby.constants.js";
  import { getLobbyLaneContext } from "$lib/features/matchmaking/ui/lobby-lane-state.svelte.js";
  import { cn } from "$lib/utils.js";
  import { m } from "$lib/i18n/messages.js";
  import { Card, CardContent } from "$lib/design-system/primitives/card";
  import { IdleStore } from "@/features/gateway/idle-store.svelte.js";

  const PAGE_TITLE = "Lorcana Simulator Matchmaking";
  const controller = getMatchmakingLobbyContext();
  const laneState = getLobbyLaneContext();

  const VALID_PLAY_TABS: PlayTab[] = ["find-match", "lobby", "practice"];
  const subtabParam = page.url.searchParams.get("subtab") as PlayTab | null;
  const initialPlayTab: PlayTab | undefined =
    subtabParam && (VALID_PLAY_TABS as string[]).includes(subtabParam)
      ? subtabParam
      : undefined;

  function handleSpectateInline(matchId: string, gameId: string): void {
    controller.openSpectatorDialog(matchId, gameId);
  }

  const idleStore = new IdleStore(10 * 60 * 1000);

  $effect(() => {
    if (idleStore.idle) {
      goto("/idle");
    }
  });

  onMount(() => {
    idleStore.attach();

    const deckParam = page.url.searchParams.get("deck");
    if (!deckParam) return;
    try {
      const base64 = deckParam.replace(/-/g, "+").replace(/_/g, "/");
      const binary = atob(base64);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      const decoded = new TextDecoder().decode(bytes);
      if (decoded) {
        controller.importDeckText = decoded;
        controller.importDialogOpen = true;
      }
    } catch {
      // silently ignore malformed param
    }
  });

  onDestroy(() => {
    idleStore.detach();
  });
</script>

<svelte:head>
  <title>{PAGE_TITLE}</title>
  <meta
    name="description"
    content={m["sim.meta.description"]({})}
  />
</svelte:head>

<div class="relative flex min-h-0 flex-1 flex-col">
  <div class="flex-1 min-h-0 overflow-y-auto px-4 pb-4 xl:hidden">
  {#if laneState.current === "live"}
    <aside class={LANE_CLASS}>
      <div class={LANE_SCROLL_CLASS}>
        <Card class={SURFACE_CARD_CLASS}>
          <CardContent class="pt-5">
            <LiveMatchesTable
              store={controller.liveMatchesStore}
              onSpectateInline={handleSpectateInline}
            />
          </CardContent>
        </Card>
      </div>
    </aside>
  {:else if laneState.current === "queue"}
    <section class={LANE_CLASS}>
      <div class={LANE_SCROLL_CLASS}>
        <MatchmakingActiveMatchCard
          activeMatchId={controller.queueStore.activeMatchId}
          forfeiting={controller.queueStore.forfeiting}
          forfeitSuccess={controller.queueStore.forfeitSuccess}
          onRejoinMatch={() => controller.handleRejoinMatch()}
          onForfeitMatch={() => controller.handleForfeitMatch()}
        />

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

        <MatchmakingPlayCard initialTab={initialPlayTab} />
      </div>
    </section>
  {:else}
    <aside class={LANE_CLASS}>
      <div class={LANE_SCROLL_CLASS}>
        <EngagementEventCard initialState={controller.playerContext.context?.engagement ?? null} />
        <MatchmakingSidebar initialLeaderboards={controller.initialLeaderboards} />
      </div>
    </aside>
  {/if}
  </div>

  <div
    class="hidden gap-4 px-4 xl:grid sm:px-6 lg:px-8 min-h-0 flex-1 xl:grid-cols-[minmax(18rem,1fr)_minmax(28rem,1.15fr)_minmax(18rem,1fr)]"
  >
  <aside class={cn(LANE_CLASS, "xl:min-h-0")}>
    <div class={LANE_SCROLL_CLASS}>
      <MatchmakingLeftColumn />
    </div>
  </aside>

  <section class={cn(LANE_CLASS, "xl:min-h-0")}>
    <div class={LANE_SCROLL_CLASS}>
      <MatchmakingCenterColumn initialPlayTab={initialPlayTab} />
    </div>
  </section>

  <aside class={cn(LANE_CLASS, "xl:min-h-0")}>
    <div class={LANE_SCROLL_CLASS}>
      <MatchmakingSidebar initialLeaderboards={controller.initialLeaderboards} />
    </div>
  </aside>
</div>
</div>
