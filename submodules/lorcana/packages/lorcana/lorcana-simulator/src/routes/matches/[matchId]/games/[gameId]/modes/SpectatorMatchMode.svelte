<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount, onDestroy, untrack } from 'svelte';
  import { LorcanaTabletopSimulator } from '$lib';
  import { SpectatorMatchOrchestrator, type SpectatorRecentHistory } from '@/features/spectator/spectator-match-orchestrator.svelte.js';
  import { OpponentPresenceTracker } from '@/features/gateway/opponent-presence.svelte.js';
  import { authSession } from '$lib/auth/session.svelte.js';
  import { connectAndJoin } from './connect-gateway.js';
  import { createMessageRouter, buildAcceptedMove } from './game-mode-message-router.js';
  import {
    buildVisualSettings,
    mergeWsVisuals,
    createMatchChat,
  } from './game-mode-setup.js';
  import type { GamePageData } from '../+page.server.js';
  import type { CardsMaps, LorcanaMatchState } from '@tcg/lorcana-engine';
  import type { MatchChatController } from '@/features/match-chat/match-chat-controller.svelte.js';
  import type { LorcanaPlayerSettingsMap } from '$lib/features/simulator/model/player-visual-settings.js';
  import type { GatewayClientStore } from '@/features/gateway/gateway-client.svelte.js';

  type ServerData = Extract<GamePageData, { mode: 'server' }>;
  let { data }: { data: ServerData } = $props();

  let loadError = $state<string | null>(null);
  let spectatorOrchestrator = $state<SpectatorMatchOrchestrator | null>(null);
  let matchChatController = $state<MatchChatController | null>(null);
  let playerVisualSettings = $state<LorcanaPlayerSettingsMap>({});

  const opponentPresence = new OpponentPresenceTracker();
  // Top lane in spectator view is always playerTwo (ownerSide is null → bottomSide="playerOne").
  // We track only the top-lane player's presence so the overlay renders on the correct lane.
  let topLanePlayerId = $state<string | null>(null);
  let gateway = $state<GatewayClientStore | null>(null);
  let gatewayStatus = $derived(gateway?.status ?? null);
  let connectionEmoji = $derived(
    gatewayStatus === 'connected' ? '\u{1F7E2}' :
    gatewayStatus === 'connecting' ? '\u{1F7E1}' :
    gatewayStatus === 'disconnected' ? '\u{1F534}' :
    '\u{23F3}',
  );

  async function handleReturnToMatchmaking(): Promise<void> {
    await goto('/matchmaking');
  }

  // DEPLOYMENT CACHE STRATEGY: Auto-rejoin on WS reconnect.
  // During blue-green deploys all WebSocket connections drop and spectators
  // reconnect to the new instance. When we detect a new connectionId, we
  // re-subscribe this socket to the game's pub/sub channel. Authenticated
  // spectators can use `reconnect`, but anonymous spectators must use the
  // gateway-allowed `join_game` flow with `role: 'spectator'` since the
  // server restricts unauthenticated connections to ping/join_game/leave_game.
  // Without this, the spectator would stop receiving state_update
  // broadcasts until the heartbeat fires.
  let lastConnectionId = $state<string | null>(null);
  $effect(() => {
    const cid = gateway?.connectionId;
    if (!cid || !spectatorOrchestrator) return;
    if (cid === lastConnectionId) return;
    if (lastConnectionId !== null) {
      const userId = authSession.user?.id;
      if (userId) {
        gateway!.send({
          type: 'reconnect',
          gameId: data.gameId,
          userId,
          lastReceivedVersion: 0,
        });
      } else {
        gateway!.send({
          type: 'join_game',
          gameId: data.gameId,
          role: 'spectator',
        });
      }
    }
    lastConnectionId = cid;
  });

  const initialGameId = untrack(() => data.gameId);
  const handleMessage = createMessageRouter({
    gameId: initialGameId,
    getChatController: () => matchChatController,
    getPresenceTracker: () => opponentPresence,
    presenceFilter: (pid) => pid === topLanePlayerId,
    onError: (msg) => {
      console.error('[spectator-mode] gateway error', msg);
    },
    onRecentHistory: (history) => {
      if (spectatorOrchestrator) {
        spectatorOrchestrator.applyRecentHistory({
          acceptedMoves: history.acceptedMoves,
          engineLogs: history.engineLogs,
        });
      }
    },
    // move_accepted and state_update are parsed centrally by the router.
    onLiveMove: (payload) => {
      if (spectatorOrchestrator) {
        spectatorOrchestrator.applyStateUpdate({
          actorId: '',
          moveType: '',
          stateVersion: 0,
          patches: payload.patches ?? [],
          acceptedMove: payload.acceptedMove as SpectatorRecentHistory['acceptedMoves'][number] | undefined,
          engineLogs: payload.engineLogs as SpectatorRecentHistory['engineLogs'] | undefined,
          state: payload.state,
          cardsMaps: payload.cardsMaps as CardsMaps | undefined,
        });
      }
    },
  });

  onMount(() => {
    void (async () => {
      const { matchId, gameId, match, game } = data;

      playerVisualSettings = buildVisualSettings(match.participants);

      const result = await connectAndJoin({
        ticket: null, // spectators don't need a ticket
        gameId,
        role: 'spectator',
        matchType: match.matchType,
        userId: authSession.user?.id,
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

      // Top lane is always playerTwo (index 1). Only track that player's presence so
      // the overlay never shows on the wrong lane (e.g. bot appearing disconnected when
      // the human is disconnected on a different server instance).
      const playersList = joinedMsg.players as
        | Array<{ id: string; connected: boolean; disconnectedAt?: string }>
        | undefined;
      const topLanePlayer = playersList?.[1]; // playerTwo = index 1 = top lane
      topLanePlayerId = topLanePlayer?.id ?? null;
      if (topLanePlayer && !topLanePlayer.connected) {
        opponentPresence.handlePresenceChange('disconnected', topLanePlayer.disconnectedAt);
      }

      matchChatController = createMatchChat({
        gameId,
        canSend: false,
        gateway: gateway!,
      });

      // Resolve initial state from WS or fall back to server-prefetched state
      let state = joinedMsg.state as LorcanaMatchState | null;
      let cardsMaps = (joinedMsg.cardsMaps as CardsMaps | undefined) ?? undefined;

      if (!state || !cardsMaps) {
        if (game.state && game.cardsMaps) {
          state = game.state as LorcanaMatchState;
          cardsMaps = game.cardsMaps as CardsMaps;
        }
      }

      if (!state || !cardsMaps) {
        loadError = 'Match state is not yet available. The player may not have started yet.';
        return;
      }

      spectatorOrchestrator = new SpectatorMatchOrchestrator({
        gateway: gateway!,
        state,
        cardsMaps,
      });

      // Drain messages that arrived before game_joined
      for (const pending of result.pendingMessages) {
        if (pending.type === 'state_update') {
          const engineLogs = Array.isArray(pending.engineLogs)
            ? (pending.engineLogs as SpectatorRecentHistory['engineLogs'])
            : undefined;
          const moveType = typeof pending.moveType === 'string' ? pending.moveType : undefined;
          const moveLog = engineLogs?.find(
            (e) => (e.log as { moveType?: string } | null)?.moveType === moveType,
          );
          const actorId =
            typeof (moveLog?.log as { playerId?: string } | null)?.playerId === 'string'
              ? (moveLog!.log as { playerId: string }).playerId
              : undefined;
          spectatorOrchestrator.applyStateUpdate({
            actorId: String(pending.actorId ?? ''),
            moveType: String(pending.moveType ?? ''),
            stateVersion: Number(pending.stateVersion ?? 0),
            patches: Array.isArray(pending.patches) ? pending.patches : [],
            state: pending.state,
            cardsMaps:
              pending.cardsMaps && typeof pending.cardsMaps === 'object'
                ? (pending.cardsMaps as CardsMaps)
                : undefined,
            acceptedMove: buildAcceptedMove(
              actorId,
              moveType,
              typeof pending.stateVersion === 'number' ? pending.stateVersion : undefined,
              engineLogs,
              pending.state,
            ) as SpectatorRecentHistory['acceptedMoves'][number] | undefined,
            engineLogs,
          });
        }
      }

    })();

    return () => {
      // cleanup handled in onDestroy
    };
  });

  onDestroy(() => {
    spectatorOrchestrator?.dispose();
    opponentPresence.dispose();
    gateway?.destroy();
  });
</script>

<svelte:head>
  <title>{connectionEmoji} Spectating | Lorcanito</title>
</svelte:head>

{#if loadError}
  <div class="grid h-full place-items-center px-4 text-rose-300">
    {loadError}
  </div>
{:else if spectatorOrchestrator}
  <LorcanaTabletopSimulator
    engine={spectatorOrchestrator.currentEngine}
    readModel={spectatorOrchestrator.readModel}
    viewerMode="spectator"
    playerSettings={playerVisualSettings}
    {matchChatController}
    {opponentPresence}
    {gatewayStatus}
    serverInitiatedClose={gateway?.serverInitiatedClose ?? false}
    onReturnToMatchmaking={handleReturnToMatchmaking}
  />
{:else}
  <div class="grid h-full place-items-center px-4 text-slate-400">
    Connecting to match...
  </div>
{/if}
