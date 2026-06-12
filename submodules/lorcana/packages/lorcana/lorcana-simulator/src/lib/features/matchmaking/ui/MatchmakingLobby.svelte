<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { MatchmakingContext } from "@/features/matchmaking/api/player-context-api.js";
  import type { LiveMatchListResponse } from "@/features/matchmaking/api/live-matches-api.js";
  import type { QueueStatsResponse } from "@/features/matchmaking/api/queue-stats-api.js";
  import { canSubmitDeckImport } from "./deck-import-form.js";
  import DeckVaultContent from "@/features/deck-vault/ui/DeckVaultContent.svelte";
  import LiveMatchesTable from "./LiveMatchesTable.svelte";
  import SignInDialog from "./SignInDialog.svelte";
  import CommunityRulesDialog from "./CommunityRulesDialog.svelte";
  import ImportDeckDialog from "./ImportDeckDialog.svelte";
  import PlayerSettingsDialog from "@/features/simulator/dialogs/PlayerSettingsDialog.svelte";
  import AccountSettingsDialog from "./AccountSettingsDialog.svelte";
  import SpectatorWhileQueuedDialog from "./SpectatorWhileQueuedDialog.svelte";

  import MatchmakingActiveMatchCard from "./MatchmakingActiveMatchCard.svelte";
  import MatchmakingLobbyHero from "./MatchmakingLobbyHero.svelte";
  import MatchmakingDeckSelectionCard from "./MatchmakingDeckSelectionCard.svelte";
  import MatchmakingPlayCard from "./MatchmakingPlayCard.svelte";
  import MatchmakingSidebar from "./MatchmakingSidebar.svelte";
  import EngagementEventCard from "./EngagementEventCard.svelte";
  import MatchmakingLobbyFooter from "./MatchmakingLobbyFooter.svelte";
  import LobbyRoomScreen from "./LobbyRoomScreen.svelte";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte.js";
  import {
    LANE_CLASS,
    LANE_SCROLL_CLASS,
    SURFACE_CARD_CLASS,
  } from "./matchmaking-lobby.constants.js";
  import type { LobbyLane, LobbyView } from "./matchmaking-lobby.constants.js";
  import { cn } from "$lib/utils.js";
  import { m } from "$lib/i18n/messages.js";
  import { createMatchmakingLobbyController } from "./useMatchmakingLobbyController.svelte.js";
  import { Card, CardContent } from "$lib/design-system/primitives/card";

  let {
    initialContext = null,
    initialLiveMatches = null,
    initialQueueStats = null,
    initialRoomCode = null,
  }: {
    initialContext?: MatchmakingContext | null;
    initialLiveMatches?: LiveMatchListResponse | null;
    initialQueueStats?: QueueStatsResponse | null;
    initialRoomCode?: string | null;
  } = $props();

  let activeView = $state<LobbyView>("lobby");
  let activeLane = $state<LobbyLane>("queue");
  let middleColumnScroll = $state<HTMLDivElement | null>(null);
  const isMobile = new IsMobile();

  $effect(() => {
    if (controller.queueStore.status === "blocked") {
      middleColumnScroll?.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // svelte-ignore state_referenced_locally
  const controller = createMatchmakingLobbyController({
    initialContext,
    initialLiveMatches,
    initialQueueStats,
    initialRoomCode,
  });

  // Auto-switch to room screen when lobby store enters a room state
  const effectiveView = $derived<LobbyView>(
    controller.lobby.isInRoom ? "lobby-room" : activeView,
  );

  onMount(async () => {
    await controller.initialize();
  });

  onDestroy(() => {
    controller.destroy();
  });

  function toggleDeckVault(): void {
    if (controller.deckSelection.selectionDisabled && activeView !== "deck-vault") {
      return;
    }

    activeView = activeView === "deck-vault" ? "lobby" : "deck-vault";
  }

  function selectLane(lane: LobbyLane): void {
    activeLane = lane;
  }

  function handleSpectateInline(matchId: string, gameId: string): void {
    controller.openSpectatorDialog(matchId, gameId);
  }
</script>

<main
  class="immersive-app-shell simulator-dark relative min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_28%),linear-gradient(180deg,#020617_0%,#020617_46%,#030712_100%)] text-foreground xl:h-screen xl:overflow-hidden"
>
  <div
    class="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(96,165,250,0.12),transparent_24%),radial-gradient(circle_at_80%_100%,rgba(14,165,233,0.1),transparent_28%)]"
    aria-hidden="true"
  ></div>

  <div class="relative flex min-h-screen w-full flex-col gap-4 xl:h-full xl:min-h-0">
    <MatchmakingLobbyHero
      gateway={controller.gateway}
      {activeLane}
      mobileTabsEnabled={isMobile.current}
      hasActiveMatch={controller.queueStore.activeMatchId !== null}
      selectionDisabled={controller.deckSelection.selectionDisabled}
      isAuthenticated={controller.auth.isAuthenticated}
      isAuthLoading={controller.auth.isLoading}
      user={controller.auth.user}
      onSelectLane={selectLane}
      onResumeMatch={() => controller.handleRejoinMatch()}
      onOpenSignIn={() => controller.openSignInDialog()}
      onSignedOut={() => controller.reconnectGatewayAnonymous()}
      onOpenSettings={() => {
        controller.playerSettingsOpen = true;
      }}
      onOpenAccountSettings={() => {
        controller.accountSettingsOpen = true;
      }}
    />

    {#if effectiveView === "lobby-room"}
      <LobbyRoomScreen
        status={controller.lobby.status}
        roomCode={controller.lobby.roomCode}
        creatorName={controller.lobby.creatorName}
        creatorDeckName={controller.lobby.creatorDeckName}
        opponentName={controller.lobby.opponentName}
        opponentDeckName={controller.lobby.opponentDeckName}
        isCreator={controller.lobby.isCreator}
        selectedMode={controller.lobby.selectedMode}
        error={controller.lobby.error}
        onCancel={() => controller.handleCancelLobbyRoom()}
        onStart={() => controller.handleStartLobbyRoom()}
        onLeave={() => controller.handleLeaveLobbyRoom()}
        onBack={() => controller.handleBackFromLobbyRoom()}
      />
    {:else if effectiveView === "deck-vault"}
      <div class="px-4 sm:px-6 lg:px-8 xl:min-h-0 xl:flex-1 xl:overflow-y-auto">
        <DeckVaultContent
          playerContext={controller.playerContext}
          selectionDisabled={controller.deckSelection.selectionDisabled}
          onBack={() => {
            activeView = "lobby";
          }}
        />
      </div>
    {:else}
      <div class="px-4 md:hidden">
        {#if activeLane === "live"}
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
        {:else if activeLane === "sidebar"}
          <aside class={LANE_CLASS}>
            <div class={LANE_SCROLL_CLASS}>
              <MatchmakingSidebar gameProfileId={controller.deckSelection.activeProfile?.gameProfileId ?? null} initialLeaderboards={controller.initialLeaderboards} />
            </div>
          </aside>
        {:else if activeLane === "queue"}
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

              <MatchmakingPlayCard />
            </div>
          </section>
        {/if}
      </div>

      <div
        class="hidden gap-4 px-4 md:grid sm:px-6 lg:px-8 xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(18rem,1fr)_minmax(28rem,1.15fr)_minmax(18rem,1fr)]"
      >
        <aside class={cn(LANE_CLASS, "xl:min-h-0")}>
          <div class={LANE_SCROLL_CLASS}>
            <EngagementEventCard initialState={controller.playerContext.context?.engagement ?? null} />
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

        <section class={cn(LANE_CLASS, "xl:min-h-0")}>
          <div bind:this={middleColumnScroll} class={LANE_SCROLL_CLASS}>
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

            <MatchmakingPlayCard />
          </div>
        </section>

        <aside class={cn(LANE_CLASS, "xl:min-h-0")}>
          <div class={LANE_SCROLL_CLASS}>
            <MatchmakingSidebar gameProfileId={controller.deckSelection.activeProfile?.gameProfileId ?? null} initialLeaderboards={controller.initialLeaderboards} />
          </div>
        </aside>
      </div>
    {/if}

    <MatchmakingLobbyFooter />
  </div>

  <SignInDialog bind:open={controller.signInDialogOpen} />
  <ImportDeckDialog
    bind:open={controller.importDialogOpen}
    bind:deckName={controller.importDeckName}
    bind:deckText={controller.importDeckText}
    disabled={!canSubmitDeckImport({
      activeProfileId: controller.deckSelection.activeProfile?.gameProfileId ?? null,
      deckName: controller.importDeckName,
      deckText: controller.importDeckText,
      submitting: controller.importDeckSubmitting,
    })}
    submitting={controller.importDeckSubmitting}
    error={controller.importDeckError}
    onSubmit={() => controller.handleImportDeckSubmit()}
  />
  <CommunityRulesDialog
    bind:open={controller.showOnboardingDialog}
    loading={controller.dialogs.onboardingLoading}
    error={controller.dialogs.onboardingError}
    onAccept={() => controller.handleOnboardAccept()}
  />
  <PlayerSettingsDialog
    bind:open={controller.playerSettingsOpen}
    selectedLocale={controller.playerSettings.selectedLocale}
    hotkeyMode={controller.playerSettings.hotkeyMode}
    cardPreviewMode={controller.playerSettings.cardPreviewMode}
    cardInfoMode={controller.playerSettings.cardInfoMode}
    primaryClickAction={controller.playerSettings.primaryClickAction}
    animationSpeed={controller.playerSettings.animationSpeed}
    soundVolume={controller.playerSettings.soundVolume}
    accessibleMobileControls={controller.playerSettings.accessibleMobileControls}
    onLocaleSelection={controller.playerSettings.handleLocaleSelection}
    onHotkeyModeChange={controller.playerSettings.handleHotkeyModeChange}
    onCardPreviewModeChange={controller.playerSettings.handleCardPreviewModeChange}
    onCardInfoModeChange={controller.playerSettings.handleCardInfoModeChange}
    onPrimaryClickActionChange={controller.playerSettings.handlePrimaryClickActionChange}
    onAnimationSpeedChange={controller.playerSettings.handleAnimationSpeedChange}
    onSoundVolumeChange={controller.playerSettings.handleSoundVolumeChange}
    onToggleAccessibleMobileControls={controller.playerSettings.handleAccessibleMobileControlsToggle}
    showZoneCounters={controller.playerSettings.showZoneCounters}
    onToggleShowZoneCounters={controller.playerSettings.handleShowZoneCountersToggle}
    selectedPlaymat={controller.playerSettings.selectedPlaymat}
    selectedCardBack={controller.playerSettings.selectedCardBack}
    onPlaymatChange={controller.playerSettings.handlePlaymatChange}
    onCardBackChange={controller.playerSettings.handleCardBackChange}
  />
  <AccountSettingsDialog
    bind:open={controller.accountSettingsOpen}
    activeGameProfileId={controller.deckSelection.activeProfile?.gameProfileId ?? null}
  />
  <SpectatorWhileQueuedDialog
    bind:open={controller.spectatorDialogOpen}
    matchId={controller.spectatorMatchId}
    gameId={controller.spectatorGameId}
    queueStatus={controller.queueStore.status}
    elapsedLabel={controller.queue.elapsedLabel}
    remainingLabel={controller.queue.remainingLabel}
    progressPercent={controller.queue.progressPercent}
    selfAccepted={controller.queueStore.selfAccepted}
    opponentAccepted={controller.queueStore.opponentAccepted}
    acceptTimeRemainingMs={controller.queueStore.acceptTimeRemainingMs}
    matchCountdown={controller.queueStore.matchCountdown}
    onAcceptMatch={() => controller.handleAcceptMatch()}
    onDeclineMatch={() => controller.handleDeclineMatch()}
    onSkipCountdown={() => controller.skipMatchCountdown()}
    onClose={() => controller.closeSpectatorDialog()}
  />
</main>
