<script lang="ts">
  import { onMount, onDestroy, untrack } from 'svelte';
  import { goto } from '$app/navigation';
  import { LorcanaTabletopSimulator } from '$lib';
  import { PracticeMatchOrchestrator } from '@/features/practice-match/practice-match-orchestrator.svelte.js';
  import { createHumanVsAiContext } from '@/features/simulator-devtools/vs-ai/context.js';
  import { authSession } from '$lib/auth/session.svelte.js';
  import {
    loadPracticeSession,
    clearPracticeSession,
    saveRankedMatchSession,
  } from '@/features/practice-match/practice-match-storage.js';
  import { acquirePlayerTicket, connectAndJoin, fetchQuickMatchTicket } from './connect-gateway.js';
  import { createMessageRouter } from './game-mode-message-router.js';
  import {
    buildVisualSettings,
    buildPlayerMetadataMap,
    mergeWsVisuals,
    createMatchChat,
    type PlayerMatchMetadata,
  } from './game-mode-setup.js';
  import type { GamePageData } from '../+page.server.js';
  import type { CardsMaps, LorcanaServerAuthoritativeSnapshot } from '@tcg/lorcana-engine';
  import type { MatchChatController } from '@/features/match-chat/match-chat-controller.svelte.js';
  import type { LorcanaPlayerSettingsMap } from '$lib/features/simulator/model/player-visual-settings.js';
  import type { GatewayClientStore } from '@/features/gateway/gateway-client.svelte.js';
  import type { PracticeMatchRecentHistory } from '@/features/practice-match/types.js';

  type ServerData = Extract<GamePageData, { mode: 'server' }>;
  let { data }: { data: ServerData } = $props();

  // AI context must be set at component init time (Svelte context system)
  const aiCtx = createHumanVsAiContext();

  let loadError = $state<string | null>(null);
  let practiceOrchestrator = $state<PracticeMatchOrchestrator | null>(null);
  let matchChatController = $state<MatchChatController | null>(null);
  let playerVisualSettings = $state<LorcanaPlayerSettingsMap>({});
  let playerMetadataMap = $state<Record<string, PlayerMatchMetadata>>({});

  let gateway = $state<GatewayClientStore | null>(null);
  let gatewayStatus = $derived(gateway?.status ?? null);
  let connectionEmoji = $derived(
    gatewayStatus === 'connected' ? '\u{1F7E2}' :
    gatewayStatus === 'connecting' ? '\u{1F7E1}' :
    gatewayStatus === 'disconnected' ? '\u{1F534}' :
    '\u{23F3}',
  );
  let pendingRecentHistory = $state<PracticeMatchRecentHistory | null>(null);

  // DEPLOYMENT CACHE STRATEGY: Auto-rejoin on WS reconnect.
  // During blue-green deploys all WebSocket connections drop and players
  // reconnect to the new instance. When we detect a new connectionId
  // (meaning the WS reconnected), we send a `reconnect` message so the
  // server re-subscribes this socket to the game's pub/sub channel and
  // sends fresh state. Without this, the client would sit in a dead UI
  // until the heartbeat mismatch check fires.
  let lastConnectionId = $state<string | null>(null);
  $effect(() => {
    const cid = gateway?.connectionId;
    if (!cid || !practiceOrchestrator) return;
    if (cid === lastConnectionId) return;
    if (lastConnectionId !== null) {
      const session = loadPracticeSession(data.gameId);
      gateway!.send({
        type: 'reconnect',
        gameId: data.gameId,
        ...(session?.gameProfileId ? { gameProfileId: session.gameProfileId } : {}),
        ...(session?.userId ?? authSession.user?.id
          ? { userId: session?.userId ?? authSession.user?.id }
          : {}),
        lastReceivedVersion: 0,
      });
    }
    lastConnectionId = cid;
  });

  const initialGameId = untrack(() => data.gameId);
  const handleMessage = createMessageRouter({
    gameId: initialGameId,
    getChatController: () => matchChatController,
    onError: (msg) => {
      console.error('[bot-match-mode] gateway error', msg);
    },
    onRecentHistory: (history) => {
      // The server sends full AcceptedMoveRecord/EngineLogRecord objects;
      // the router's RecentHistory type captures the common subset.
      const recentHistory = history as unknown as PracticeMatchRecentHistory;
      if (practiceOrchestrator) {
        practiceOrchestrator.hydrateRecentHistory(recentHistory);
      } else {
        pendingRecentHistory = recentHistory;
      }
    },
    onUnhandled: (msg) => {
      if (msg.type === 'request_state_sync' && practiceOrchestrator) {
        practiceOrchestrator.forcePush();
      }
    },
  });

  async function handleReturnToMatchmaking(): Promise<void> {
    await practiceOrchestrator?.flushPendingState("return");
    clearPracticeSession();
    await goto('/matchmaking');
  }

  onMount(() => {
    void (async () => {
      const { matchId, gameId, match, game } = data;

      playerVisualSettings = buildVisualSettings(match.participants);
      playerMetadataMap = buildPlayerMetadataMap(match.participants);

      let session = loadPracticeSession(gameId);
      if (!session) {
        // localStorage holds only one session at a time — reconstruct from server
        // context if the authenticated user is a participant.
        const userId = authSession.user?.id;
        const myParticipant = userId
          ? match.participants.find((p) => p.userId === userId)
          : undefined;
        if (myParticipant) {
          saveRankedMatchSession({ matchId, gameId, gameProfileId: myParticipant.id, userId });
          session = loadPracticeSession(gameId);
        }
      }
      if (!session) {
        loadError = 'No session found for this match. You may need to rejoin from matchmaking.';
        return;
      }

      const { ticket, authToken, error: ticketError } = await acquirePlayerTicket({
        wsTicket: session.wsTicket,
        fetchQuickMatchTicket: session.wsTicket
          ? () => fetchQuickMatchTicket(session.matchId, session.gameProfileId)
          : undefined,
      });

      if (ticketError) {
        loadError = ticketError;
        return;
      }

      const result = await connectAndJoin({
        ticket,
        authToken,
        gameId,
        role: 'player',
        matchType: match.matchType,
        gameProfileId: session.gameProfileId,
        userId: session.userId ?? authSession.user?.id,
        onMessage: handleMessage,
      });

      if (result.error) {
        loadError = result.error;
        return;
      }

      gateway = result.gateway;
      const joinedMsg = result.joinedMsg!;

      playerVisualSettings = mergeWsVisuals(
        playerVisualSettings,
        joinedMsg.playerVisualSettings as LorcanaPlayerSettingsMap | undefined,
      );

      matchChatController = createMatchChat({
        gameId,
        canSend: true,
        gateway: gateway!,
      });

      const cardsMaps = joinedMsg.cardsMaps as CardsMaps | undefined;
      const authority = game.authority === 'server' ? 'server' : 'client';

      if (joinedMsg.state != null) {
        if (!cardsMaps) {
          loadError = 'Match state is missing card data (cardsMaps). The match may have expired.';
          return;
        }
        const restoredSnapshot: LorcanaServerAuthoritativeSnapshot = {
          state: joinedMsg.state as LorcanaServerAuthoritativeSnapshot['state'],
          cardsMaps,
        };
        practiceOrchestrator = await PracticeMatchOrchestrator.create({
          gameId,
          playerId: session.gameProfileId,
          botPlayerId: session.botPlayerId,
          deckConfig: session.deckConfig,
          gateway: gateway!,
          humanSeat: 'playerOne', // bot matches always have human as playerOne
          authority,
          restoredSnapshot,
          restoredVersion: (joinedMsg.stateVersion as number) ?? 0,
          restoredRecentHistory: pendingRecentHistory ?? undefined,
        });
        pendingRecentHistory = null;
      } else {
        practiceOrchestrator = await PracticeMatchOrchestrator.create({
          gameId,
          playerId: session.gameProfileId,
          botPlayerId: session.botPlayerId,
          deckConfig: session.deckConfig,
          gateway: gateway!,
          humanSeat: 'playerOne',
          authority,
        });
      }

      aiCtx.set(practiceOrchestrator.orchestrator);
    })();

    return () => {
      // cleanup handled in onDestroy
    };
  });

  onDestroy(() => {
    aiCtx.set(null);
    practiceOrchestrator?.dispose();
    gateway?.destroy();
  });
</script>

<svelte:head>
  <title>{connectionEmoji} Game | Lorcanito</title>
</svelte:head>

{#if loadError}
  <div class="grid h-full place-items-center px-4 text-rose-300">
    {loadError}
  </div>
{:else if practiceOrchestrator}
  {#key practiceOrchestrator.orchestrator.sessionRevision}
    <LorcanaTabletopSimulator
      engine={practiceOrchestrator.currentEngine}
      readModel={practiceOrchestrator.readModel}
      playerSettings={playerVisualSettings}
      {playerMetadataMap}
      serverGameplaySettings={data.userSettings?.gameplaySettings}
      postGameGameId={data.gameId}
      isAuthenticated={authSession.isAuthenticated}
      {matchChatController}
      opponentPresence={null}
      onDropOpponent={null}
      {gatewayStatus}
      serverInitiatedClose={gateway?.serverInitiatedClose ?? false}
      onReturnToMatchmaking={handleReturnToMatchmaking}
    />
  {/key}
{:else}
  <div class="grid h-full place-items-center px-4 text-slate-400">
    Connecting to match...
  </div>
{/if}
