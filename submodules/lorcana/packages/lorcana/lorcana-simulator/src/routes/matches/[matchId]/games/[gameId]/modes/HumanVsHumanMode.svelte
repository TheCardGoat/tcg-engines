<script lang="ts">
  import { onMount, onDestroy, untrack } from 'svelte';
  import { goto } from '$app/navigation';
  import { authSession } from '$lib/auth/session.svelte.js';
  import { LorcanaTabletopSimulator } from '$lib';
  import { HvHPlayerOrchestrator } from '@/features/hvh/hvh-player-orchestrator.svelte.js';
  import { OpponentPresenceTracker } from '@/features/gateway/opponent-presence.svelte.js';
  import { OpponentAfkTracker } from '@/features/gateway/opponent-afk.svelte.js';
  import { IdleStore } from '@/features/gateway/idle-store.svelte.js';
  import {
    loadPracticeSession,
    clearPracticeSession,
    saveRankedMatchSession,
  } from '@/features/practice-match/practice-match-storage.js';
  import {
    acquirePlayerTicket,
    connectAndJoin,
    fetchQuickMatchTicket,
  } from './connect-gateway.js';
  import { createMessageRouter, type RecentHistory, type ProposalPayload } from './game-mode-message-router.js';
  import {
    buildVisualSettings,
    buildPlayerMetadataMap,
    mergeWsVisuals,
    createMatchChat,
    checkInitialPresence,
    type PlayerMatchMetadata,
  } from './game-mode-setup.js';
  import { toast } from 'svelte-sonner';
  import {
    createManualModeController,
    setManualModeContext,
  } from '@/features/manual-mode/manual-mode-context.svelte.js';
  import { trackEvent } from '$lib/analytics/analytics.js';
  import type { GamePageData } from '../+page.server.js';
  import type { CardsMaps, LorcanaMatchState } from '@tcg/lorcana-engine';
  import type { MatchChatController } from '@/features/match-chat/match-chat-controller.svelte.js';
  import type { LorcanaPlayerSettingsMap } from '$lib/features/simulator/model/player-visual-settings.js';
  import type { GatewayClientStore } from '@/features/gateway/gateway-client.svelte.js';
  import type { SpectatorRecentHistory } from '@/features/spectator/spectator-match-orchestrator.svelte.js';
  import type { MatchNavigationContext } from '@/features/simulator/model/contracts.js';

  type ServerData = Extract<GamePageData, { mode: 'server' }>;
  let { data }: { data: ServerData } = $props();

  function deriveNextGameId(match: ServerData['match'], gameId: string): string | undefined {
    if (match.currentGameId && match.currentGameId !== gameId) return match.currentGameId;
    return undefined;
  }

  const initialMatch = untrack(() => data.match);
  const initialGameId = untrack(() => data.gameId);
  const initialGameNumber = untrack(() => data.game.gameNumber ?? 1);
  let matchContext = $state<MatchNavigationContext>({
    nextGameId: deriveNextGameId(initialMatch, initialGameId),
    matchCompleted: initialMatch.status === 'completed',
    winnerId: initialMatch.winnerId,
    format: initialMatch.format,
    player1Score: initialMatch.player1Score,
    player2Score: initialMatch.player2Score,
    gameIndex: initialGameNumber,
    navigating: false,
  });

  async function handleNextGame(): Promise<void> {
    if (matchContext.nextGameId && !matchContext.navigating) {
      matchContext = { ...matchContext, navigating: true };
      await goto(`/matches/${data.matchId}`);
    }
  }

  /**
   * Single-fire notification when the server confirms terminal state for the
   * current game. Dedupes across the matchInfo/game_ended/match_state paths
   * (which may all arrive within ~200ms of each other) so the player sees
   * one system message rather than three.
   */
  let terminalToastFired = $state(false);
  function notifyTerminalState(args: {
    matchCompleted: boolean;
    hasNextGame: boolean;
    winnerId: string | null;
    reason: string | null;
  }): void {
    if (terminalToastFired) return;
    terminalToastFired = true;
    finalizingToastDismiss?.();
    finalizingToastDismiss = null;
    const selfId = presenceSelfPlayerId;
    const selfWon = !!selfId && !!args.winnerId && selfId === args.winnerId;
    const concedeReason =
      args.reason && /conced/i.test(args.reason) ? 'concede' : null;
    let message: string;
    if (args.matchCompleted) {
      message = selfWon ? 'Match won.' : 'Match over.';
    } else if (concedeReason && !selfWon) {
      // Opponent conceded the game — surface this explicitly since the only
      // other signal is the reason string buried in game_ended.
      message = args.hasNextGame
        ? 'Opponent conceded — next game ready.'
        : 'Opponent conceded.';
    } else {
      message = args.hasNextGame ? 'Game over — next game ready.' : 'Game over.';
    }
    toast.info(message, { duration: 4000 });
  }

  /**
   * Conceder-side optimistic toast: the local board flips to "finished"
   * immediately on dispatch, but server confirmation (with nextGameId or
   * matchCompleted) takes ~1–3s while persistence runs. Show "Finalizing
   * match…" during that gap so the player has a visible signal that work
   * is in flight, even if they dismiss the post-game dialog.
   */
  let finalizingToastDismiss: (() => void) | null = null;
  $effect(() => {
    const board = orchestrator?.currentEngine.getBoard();
    const finished = board?.status === 'finished';
    const awaitingServer =
      finished &&
      !matchContext.nextGameId &&
      !matchContext.matchCompleted &&
      matchContext.format !== 'best_of_1';
    if (awaitingServer && !finalizingToastDismiss && !terminalToastFired) {
      const id = toast.loading('Finalizing match…', { duration: Infinity });
      finalizingToastDismiss = () => toast.dismiss(id);
    }
  });

  let loadError = $state<string | null>(null);
  let orchestrator = $state<HvHPlayerOrchestrator | null>(null);
  let matchChatController = $state<MatchChatController | null>(null);
  let playerVisualSettings = $state<LorcanaPlayerSettingsMap>({});
  let playerMetadataMap = $state<Record<string, PlayerMatchMetadata>>({});

  const opponentPresence = new OpponentPresenceTracker();
  const opponentAfk = new OpponentAfkTracker();
  const idleStore = new IdleStore(30_000);

  /** Pending undo proposal received from the opponent — awaiting accept/decline. */
  let pendingUndoProposal = $state<{ senderPlayerId: string; deadline: number } | null>(null);
  let pendingFreeTextProposal = $state<{ senderPlayerId: string; deadline: number } | null>(null);
  let pendingManualModeProposal = $state<{
    senderPlayerId: string;
    deadline: number;
    intent: 'enable_manual_mode' | 'disable_manual_mode';
  } | null>(null);
  /**
   * Mirror of `pendingManualModeProposal` for when *we* are the sender —
   * shows an "Awaiting opponent…" banner so the request is visible after
   * a refresh and offers a Cancel button. Without this the sender's UI
   * has no trace of the in-flight proposal and a refresh appears to
   * silently drop it (the server still has it in Redis).
   */
  let outgoingManualModeProposal = $state<{
    deadline: number;
    intent: 'enable_manual_mode' | 'disable_manual_mode';
  } | null>(null);
  let gateway = $state<GatewayClientStore | null>(null);

  const manualMode = createManualModeController({
    gameId: initialGameId,
    getGateway: () => gateway,
    getExpectedVersion: () => orchestrator?.currentEngine.getStateID() ?? 0,
    onProposalSent: ({ intent, estimatedDeadline }) => {
      outgoingManualModeProposal = { intent, deadline: estimatedDeadline };
    },
  });
  setManualModeContext(manualMode);
  let gatewayStatus = $derived(gateway?.status ?? null);
  let connectionEmoji = $derived(
    gatewayStatus === 'connected' ? '\u{1F7E2}' :
    gatewayStatus === 'connecting' ? '\u{1F7E1}' :
    gatewayStatus === 'disconnected' ? '\u{1F534}' :
    '\u{23F3}',
  );
  let pendingRecentHistory = $state<SpectatorRecentHistory | null>(null);
  /** Canonical match player id for filtering `presence_change` (WS identity may differ). */
  let presenceSelfPlayerId = $state<string | null>(null);
  /** Opponent's game profile id, used to enable the player-report flow. */
  const opponentGameProfileId = $derived.by(() => {
    if (!presenceSelfPlayerId) return null;
    const opponent = data.match.participants.find((p) => p.id !== presenceSelfPlayerId);
    return opponent?.id ?? null;
  });
  /** Hoisted from session so the reconnect effect can access it. */
  let sessionUserId = $state<string | null>(null);
  /** Last `connectionId` seen — used to detect WS reconnects and re-subscribe to the game. */
  let lastConnectionId = $state<string | null>(null);
  /** Whether the current WS connection has received `game_joined` for this game. */
  let gameSubscribed = $state(false);

  const handleMessage = createMessageRouter({
    gameId: initialGameId,
    getChatController: () => matchChatController,
    getPresenceTracker: () => opponentPresence,
    getAfkTracker: () => opponentAfk,
    presenceFilter: (pid) => {
      const ownId = presenceSelfPlayerId ?? '';
      return !!ownId && pid !== ownId;
    },
    onError: (msg) => {
      const text =
        typeof msg.message === 'string' && (msg.message as string).trim() !== ''
          ? (msg.message as string)
          : 'Something went wrong';
      console.error('[hvh-mode] gateway error', msg);
      // Pre-join errors are already surfaced via loadError (connect-gateway fails fast).
      // Only toast for in-game errors received after game_joined.
      if (gameSubscribed) {
        toast.error(text, { duration: 8000 });
      }
    },
    onRecentHistory: (history) => {
      if (orchestrator) {
        orchestrator.hydrateRecentHistory({
          acceptedMoves: history.acceptedMoves,
          engineLogs: history.engineLogs,
        });
      } else {
        pendingRecentHistory = {
          acceptedMoves: history.acceptedMoves,
          engineLogs: history.engineLogs,
        };
      }
      gameSubscribed = true;
    },
    // move_accepted and state_update are parsed centrally by the router and
    // forwarded here as a LiveMovePayload with an already-constructed acceptedMove.
    onLiveMove: (payload) => {
      if (orchestrator) {
        orchestrator.applyStateUpdate({
          acceptedMove: payload.acceptedMove,
          engineLogs: payload.engineLogs,
        });
      }
      // Apply terminal-move match info in the same synchronous turn as the
      // engine state update. The board flips to "finished" this render;
      // matchContext must already carry the right nextGameId so the modal
      // opens with the correct CTA on its first paint.
      if (payload.matchInfo) {
        const nextGameId =
          payload.matchInfo.nextGameId && payload.matchInfo.nextGameId !== data.gameId
            ? payload.matchInfo.nextGameId
            : undefined;
        matchContext = {
          ...matchContext,
          nextGameId,
          matchCompleted: payload.matchInfo.matchCompleted,
          winnerId: payload.matchInfo.winnerId ?? matchContext.winnerId,
          player1Score: payload.matchInfo.player1Score,
          player2Score: payload.matchInfo.player2Score,
        };
        notifyTerminalState({
          matchCompleted: payload.matchInfo.matchCompleted,
          hasNextGame: nextGameId !== undefined,
          winnerId: payload.matchInfo.winnerId ?? null,
          reason: null,
        });
      }
    },
    onProposalReceived: (proposal) => {
      if (proposal.actionType === 'undo') {
        pendingUndoProposal = {
          senderPlayerId: proposal.senderPlayerId,
          deadline: proposal.deadline,
        };
      } else if (proposal.actionType === 'enable_free_text_chat') {
        pendingFreeTextProposal = {
          senderPlayerId: proposal.senderPlayerId,
          deadline: proposal.deadline,
        };
      } else if (
        proposal.actionType === 'enable_manual_mode' ||
        proposal.actionType === 'disable_manual_mode'
      ) {
        pendingManualModeProposal = {
          senderPlayerId: proposal.senderPlayerId,
          deadline: proposal.deadline,
          intent: proposal.actionType,
        };
      }
    },
    onProposalResolved: (proposal) => {
      if (proposal.actionType === 'undo') {
        pendingUndoProposal = null;
        if (proposal.resolution === 'accepted') {
          toast.success('Undo accepted — move reverted.', { duration: 4000 });
        } else if (proposal.resolution === 'declined') {
          toast.error('Undo request declined.', { duration: 4000 });
        }
      } else if (proposal.actionType === 'enable_free_text_chat') {
        pendingFreeTextProposal = null;
        matchChatController?.clearFreeTextProposalPending();
        if (proposal.resolution === 'accepted') {
          toast.success('Free text chat enabled.', { duration: 4000 });
        } else if (proposal.resolution === 'declined') {
          toast.error('Free text chat request declined.', { duration: 4000 });
        }
      } else if (
        proposal.actionType === 'enable_manual_mode' ||
        proposal.actionType === 'disable_manual_mode'
      ) {
        const intent = proposal.actionType;
        pendingManualModeProposal = null;
        outgoingManualModeProposal = null;
        if (proposal.resolution === 'accepted') {
          manualMode.setEnabled(intent === 'enable_manual_mode');
          // Always emit `manual_mode_accepted` for proposal-pipeline
          // symmetry with `enable_manual_mode`. Additionally emit
          // `manual_mode_disabled` for the disable case so the mode-off
          // state has its own signal.
          trackEvent('manual_mode_accepted', {
            game_id: data.gameId,
            role: 'recipient',
          });
          if (intent === 'disable_manual_mode') {
            trackEvent('manual_mode_disabled', {
              game_id: data.gameId,
              by: 'opponent',
            });
          }
          toast.success(
            intent === 'enable_manual_mode'
              ? 'Board State Correction enabled.'
              : 'Board State Correction disabled.',
            { duration: 4000 },
          );
        } else if (proposal.resolution === 'declined') {
          trackEvent('manual_mode_rejected', {
            game_id: data.gameId,
            role: 'recipient',
            reason: 'declined',
          });
          toast.error(
            intent === 'enable_manual_mode'
              ? 'Board State Correction request declined.'
              : 'Disable Board State Correction request declined.',
            { duration: 4000 },
          );
        } else {
          trackEvent('manual_mode_rejected', {
            game_id: data.gameId,
            role: 'recipient',
            reason: proposal.resolution === 'failed' ? 'failed' : 'expired',
          });
        }
      }
    },
    onUnhandled: (msg) => {
      if (msg.type === 'game_ended') {
        const gid = typeof msg.gameId === 'string' ? msg.gameId : undefined;
        if (gid && gid === data.gameId && orchestrator) {
          const board = orchestrator.currentEngine.getBoard();
          if (board.status !== 'finished') {
            gateway?.send({
              type: 'request_game_state_sync',
              gameId: data.gameId,
              stateVersion: 0,
            });
          }
        }
        // Seed match navigation from game_ended so the post-game modal shows
        // the correct CTA ("Go to next game" vs "Back to matchmaking") on the
        // first packet — the paired match_state broadcast can be dropped or
        // delayed, which previously left the UI stuck on the wrong button.
        const msgRecord = msg as Record<string, unknown>;
        const rawNextGameId =
          typeof msgRecord.nextGameId === 'string' ? msgRecord.nextGameId : null;
        const nextGameId =
          rawNextGameId && rawNextGameId !== data.gameId ? rawNextGameId : undefined;
        const matchCompletedField =
          typeof msgRecord.matchCompleted === 'boolean' ? msgRecord.matchCompleted : undefined;
        const matchStatus =
          typeof msgRecord.matchStatus === 'string' ? msgRecord.matchStatus : undefined;
        const derivedCompleted =
          matchCompletedField ??
          (matchStatus === 'completed' || matchStatus === 'abandoned' ? true : undefined);
        if (nextGameId !== undefined || derivedCompleted !== undefined) {
          matchContext = {
            ...matchContext,
            nextGameId: nextGameId ?? matchContext.nextGameId,
            matchCompleted: derivedCompleted ?? matchContext.matchCompleted,
            winnerId:
              typeof msgRecord.winnerId === 'string' ? msgRecord.winnerId : matchContext.winnerId,
            endReason:
              typeof msgRecord.reason === 'string' ? msgRecord.reason : matchContext.endReason,
            player1Score:
              typeof msgRecord.player1Score === 'number'
                ? msgRecord.player1Score
                : matchContext.player1Score,
            player2Score:
              typeof msgRecord.player2Score === 'number'
                ? msgRecord.player2Score
                : matchContext.player2Score,
          };
        }
        notifyTerminalState({
          matchCompleted: derivedCompleted ?? matchContext.matchCompleted,
          hasNextGame: (nextGameId ?? matchContext.nextGameId) !== undefined,
          winnerId:
            typeof msgRecord.winnerId === 'string' ? msgRecord.winnerId : matchContext.winnerId ?? null,
          reason: typeof msgRecord.reason === 'string' ? msgRecord.reason : null,
        });
        return;
      }
      if (msg.type === 'match_state') {
        const rawNextGameId = typeof msg.currentGameId === 'string' ? msg.currentGameId : null;
        const matchId = typeof msg.matchId === 'string' ? msg.matchId : null;
        const nextGameId =
          rawNextGameId && rawNextGameId !== data.gameId ? rawNextGameId : undefined;
        const matchCompleted = msg.status === 'completed' || msg.status === 'abandoned';
        matchContext = {
          ...matchContext,
          nextGameId,
          matchCompleted,
          winnerId: typeof msg.winnerId === 'string' ? msg.winnerId : matchContext.winnerId,
          endReason: typeof msg.reason === 'string' ? msg.reason : matchContext.endReason,
          player1Score:
            typeof msg.player1Score === 'number' ? msg.player1Score : matchContext.player1Score,
          player2Score:
            typeof msg.player2Score === 'number' ? msg.player2Score : matchContext.player2Score,
        };
        // `match_state` is broadcast on join too (with status: 'in_progress'),
        // so only notify when it actually carries terminal info — i.e. the
        // match is decided or a next game has been allocated.
        if (matchCompleted || nextGameId !== undefined) {
          notifyTerminalState({
            matchCompleted,
            hasNextGame: nextGameId !== undefined,
            winnerId:
              typeof msg.winnerId === 'string' ? msg.winnerId : matchContext.winnerId ?? null,
            reason: typeof msg.reason === 'string' ? msg.reason : null,
          });
        }
      }
    },
  });

  function handleDropOpponent(): void {
    gateway?.send({ type: 'drop_player', gameId: data.gameId });
  }

  function handleAcceptUndoProposal(): void {
    gateway?.send({ type: 'proposal_accept', gameId: data.gameId, actionType: 'undo' });
    pendingUndoProposal = null;
  }

  function handleDeclineUndoProposal(): void {
    gateway?.send({ type: 'proposal_decline', gameId: data.gameId, actionType: 'undo' });
    pendingUndoProposal = null;
  }

  function handleAcceptFreeTextProposal(): void {
    gateway?.send({
      type: 'proposal_accept',
      gameId: data.gameId,
      actionType: 'enable_free_text_chat',
    });
    pendingFreeTextProposal = null;
  }

  function handleDeclineFreeTextProposal(): void {
    gateway?.send({
      type: 'proposal_decline',
      gameId: data.gameId,
      actionType: 'enable_free_text_chat',
    });
    pendingFreeTextProposal = null;
    matchChatController?.clearFreeTextProposalPending();
  }

  function handleAcceptManualModeProposal(): void {
    if (!pendingManualModeProposal) return;
    const intent = pendingManualModeProposal.intent;
    // Defer the local state flip to `onProposalResolved` so a server-side
    // failure (`resolution === 'failed'`) doesn't leave the UI desynced
    // from the authoritative Redis flag.
    gateway?.send({ type: 'proposal_accept', gameId: data.gameId, actionType: intent });
    pendingManualModeProposal = null;
  }

  function handleDeclineManualModeProposal(): void {
    if (!pendingManualModeProposal) return;
    const intent = pendingManualModeProposal.intent;
    gateway?.send({ type: 'proposal_decline', gameId: data.gameId, actionType: intent });
    pendingManualModeProposal = null;
    trackEvent('manual_mode_rejected', {
      game_id: data.gameId,
      role: 'recipient',
      reason: 'declined',
    });
  }

  function handleDismissOutgoingManualModeProposal(): void {
    // Server-side `proposal_decline` is recipient-only, so this is a
    // local-only dismissal of the "Awaiting opponent…" banner. The
    // underlying Redis proposal expires after 15s and the standard
    // toggle cooldown blocks immediate retries.
    outgoingManualModeProposal = null;
  }

  function handleSkipOpponent(): void {
    gateway?.send({ type: 'skip_opponent_turn', gameId: data.gameId });
  }

  async function handleReturnToMatchmaking(): Promise<void> {
    clearPracticeSession();
    await goto('/matchmaking');
  }

  onMount(async () => {
    const { gameId, match, game } = data;

    idleStore.attach();
    playerVisualSettings = buildVisualSettings(match.participants);
    playerMetadataMap = buildPlayerMetadataMap(match.participants);

    // Auth may still be hydrating on first paint (svelte state starts null).
    // Wait briefly so the fallback reconstruction below can match the user.
    if (!authSession.user && authSession.isLoading) {
      for (let i = 0; i < 50 && authSession.isLoading; i++) {
        await new Promise((r) => setTimeout(r, 20));
      }
    }

    let session = loadPracticeSession(gameId);
    if (!session) {
      // localStorage holds only one session at a time — it may have been
      // overwritten by a newer game, or cleared when the player left matchmaking.
      // Reconstruct the session from the server context if the authenticated
      // user can be matched to one of the participants by userId.
      const userId = authSession.user?.id;
      const myParticipant = userId
        ? match.participants.find((p) => p.userId === userId)
        : undefined;
      if (myParticipant) {
        saveRankedMatchSession({ matchId: data.matchId, gameId, gameProfileId: myParticipant.id, userId });
        session = loadPracticeSession(gameId);
      }
    }
    if (!session) {
      loadError =
        'No session found for this match. You may need to rejoin from matchmaking.';
      return;
    }

    presenceSelfPlayerId = session.gameProfileId;
    sessionUserId = session.userId ?? null;

    void (async () => {
      const {
        ticket,
        authToken,
        error: ticketError,
      } = await acquirePlayerTicket({
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
        onMessage: (msg) => {
          if (msg.type === 'game_joined') gameSubscribed = true;
          handleMessage(msg);
        },
      });

      if (result.error) {
        loadError = result.error;
        return;
      }

      gateway = result.gateway;
      gameSubscribed = true;
      const joinedMsg = result.joinedMsg!;

      // Sync Manual Mode state from the authoritative join payload. The
      // server emits `manualModeEnabled: true` only when the flag is set;
      // an absent field means the mode is off, so always set explicitly to
      // also clear stale state on reconnect (e.g. another tab accepted an
      // exit proposal while this socket was down).
      manualMode.setEnabled(joinedMsg.manualModeEnabled === true);

      // Rehydrate any pending Manual Mode proposal on (re)join. The
      // server includes the active proposal in `game_joined.pendingProposal`
      // so neither tab loses the in-flight request after a refresh —
      // recipients re-see the Accept/Decline banner, and senders re-see
      // the "Awaiting opponent…" banner.
      const pending = joinedMsg.pendingProposal as
        | { actionType?: string; senderPlayerId?: string; deadline?: number }
        | undefined;
      if (
        pending &&
        (pending.actionType === 'enable_manual_mode' ||
          pending.actionType === 'disable_manual_mode') &&
        typeof pending.senderPlayerId === 'string' &&
        typeof pending.deadline === 'number'
      ) {
        if (pending.senderPlayerId === session.gameProfileId) {
          outgoingManualModeProposal = {
            deadline: pending.deadline,
            intent: pending.actionType,
          };
        } else {
          pendingManualModeProposal = {
            senderPlayerId: pending.senderPlayerId,
            deadline: pending.deadline,
            intent: pending.actionType,
          };
        }
      }

      playerVisualSettings = mergeWsVisuals(
        playerVisualSettings,
        joinedMsg.playerVisualSettings as LorcanaPlayerSettingsMap | undefined,
      );

      // Check initial opponent presence
      checkInitialPresence(
        joinedMsg.players as
          | Array<{ id: string; connected: boolean; disconnectedAt?: string }>
          | undefined,
        session.gameProfileId,
        opponentPresence,
      );

      matchChatController = createMatchChat({
        gameId,
        canSend: true,
        gateway: gateway!,
      });

      const joinedCardsMaps = joinedMsg.cardsMaps as CardsMaps | undefined;
      const joinedState = joinedMsg.state as
        | LorcanaMatchState
        | null
        | undefined;
      const ssrCardsMaps = game.cardsMaps as CardsMaps | undefined;
      const ssrState = game.state as LorcanaMatchState | undefined;

      const cardsMaps = joinedCardsMaps ?? ssrCardsMaps;
      const state = joinedState ?? ssrState;

      if (!state || !cardsMaps) {
        loadError = 'Match state is not yet available.';
        return;
      }

      orchestrator = new HvHPlayerOrchestrator({
        gateway: gateway!,
        gameId: data.gameId,
        state,
        cardsMaps,
        gameProfileId: session.gameProfileId,
        userId: session.userId ?? authSession.user?.id,
        recentHistory: pendingRecentHistory ?? undefined,
        idleStore,
      });
      pendingRecentHistory = null;

      // Drain pre-join messages that arrived before game_joined
      for (const pending of result.pendingMessages) {
        handleMessage(pending);
      }
    })();
  });

  // Proposal 1: auto-rejoin on WS reconnect.
  // When `connectionId` transitions to a new non-null value after the initial join,
  // send `reconnect` so the server re-subscribes this socket to game pub/sub.
  $effect(() => {
    const cid = gateway?.connectionId;
    if (!cid || !orchestrator || !presenceSelfPlayerId) return;
    if (cid === lastConnectionId) return;
    if (lastConnectionId !== null) {
      // New connectionId after a drop — re-subscribe to the game
      gateway!.send({
        type: 'reconnect',
        gameId: data.gameId,
        gameProfileId: presenceSelfPlayerId,
        ...(sessionUserId ?? authSession.user?.id
          ? { userId: sessionUserId ?? authSession.user?.id }
          : {}),
        lastReceivedVersion: 0,
      });
      gameSubscribed = false;
    }
    lastConnectionId = cid;
  });

  onDestroy(() => {
    orchestrator?.dispose();
    opponentPresence.dispose();
    idleStore.detach();
    gateway?.destroy();
  });
</script>

<svelte:head>
  <title>{connectionEmoji} Game | Lorcanito</title>
</svelte:head>

{#if loadError}
  <div class="grid h-full place-items-center px-4 text-rose-300">
    <div class="flex flex-col items-center gap-4 text-center">
      <p>{loadError}</p>
      <button
        type="button"
        class="rounded-md bg-rose-500/20 px-4 py-2 text-sm font-medium text-rose-100 ring-1 ring-rose-400/40 hover:bg-rose-500/30"
        onclick={handleReturnToMatchmaking}
      >
        Return to matchmaking
      </button>
    </div>
  </div>
{:else if orchestrator}
  <!-- Proposal 3: show a non-blocking banner while the WS is up but not yet re-subscribed -->
  {#if gatewayStatus === 'connected' && !gameSubscribed}
    <div class="game-resync-banner" role="status" aria-live="polite">
      <span class="game-resync-banner__dot"></span>
      Reconnecting to game&hellip;
    </div>
  {/if}
  {#if pendingUndoProposal}
    <div class="undo-proposal-banner" role="alertdialog" aria-label="Undo request from opponent">
      <span class="undo-proposal-banner__text">Opponent requests to undo their last move</span>
      <div class="undo-proposal-banner__actions">
        <button class="undo-proposal-banner__btn undo-proposal-banner__btn--accept" onclick={handleAcceptUndoProposal}>
          Accept
        </button>
        <button class="undo-proposal-banner__btn undo-proposal-banner__btn--decline" onclick={handleDeclineUndoProposal}>
          Decline
        </button>
      </div>
    </div>
  {/if}
  {#if pendingFreeTextProposal}
    <div class="undo-proposal-banner" role="alertdialog" aria-label="Free text chat request from opponent">
      <span class="undo-proposal-banner__text">Opponent wants to enable free text chat</span>
      <div class="undo-proposal-banner__actions">
        <button class="undo-proposal-banner__btn undo-proposal-banner__btn--accept" onclick={handleAcceptFreeTextProposal}>
          Accept
        </button>
        <button class="undo-proposal-banner__btn undo-proposal-banner__btn--decline" onclick={handleDeclineFreeTextProposal}>
          Decline
        </button>
      </div>
    </div>
  {/if}
  {#if pendingManualModeProposal}
    <div class="undo-proposal-banner" role="alertdialog" aria-label="Board State Correction request from opponent">
      <span class="undo-proposal-banner__text">
        {pendingManualModeProposal.intent === 'enable_manual_mode'
          ? 'Opponent requests Board State Correction mode'
          : 'Opponent wants to exit Board State Correction mode'}
      </span>
      <div class="undo-proposal-banner__actions">
        <button class="undo-proposal-banner__btn undo-proposal-banner__btn--accept" onclick={handleAcceptManualModeProposal}>
          Accept
        </button>
        <button class="undo-proposal-banner__btn undo-proposal-banner__btn--decline" onclick={handleDeclineManualModeProposal}>
          Decline
        </button>
      </div>
    </div>
  {/if}
  {#if outgoingManualModeProposal && !pendingManualModeProposal}
    <div class="undo-proposal-banner" role="status" aria-label="Board State Correction request awaiting opponent">
      <span class="undo-proposal-banner__text">
        {outgoingManualModeProposal.intent === 'enable_manual_mode'
          ? 'Awaiting opponent — Board State Correction request sent'
          : 'Awaiting opponent — exit Board State Correction request sent'}
      </span>
      <div class="undo-proposal-banner__actions">
        <button class="undo-proposal-banner__btn undo-proposal-banner__btn--decline" onclick={handleDismissOutgoingManualModeProposal}>
          Dismiss
        </button>
      </div>
    </div>
  {/if}
  <LorcanaTabletopSimulator
    engine={orchestrator.currentEngine}
    readModel={orchestrator.readModel}
    playerSettings={playerVisualSettings}
    {playerMetadataMap}
    serverGameplaySettings={data.userSettings?.gameplaySettings}
    postGameGameId={data.gameId}
    isAuthenticated={authSession.isAuthenticated}
    {opponentGameProfileId}
    {matchChatController}
    {opponentPresence}
    {opponentAfk}
    onSkipOpponent={handleSkipOpponent}
    onDropOpponent={handleDropOpponent}
    {gatewayStatus}
    serverInitiatedClose={gateway?.serverInitiatedClose ?? false}
    authError={gateway?.authError ?? false}
    onReturnToMatchmaking={handleReturnToMatchmaking}
    {matchContext}
    onNextGame={handleNextGame}
  />
{:else}
  <div class="grid h-full place-items-center px-4 text-slate-400">
    Connecting to match...
  </div>
{/if}

<style>
  .game-resync-banner {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 50;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.8rem;
    border-radius: 9999px;
    background: rgba(217, 119, 6, 0.9);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    pointer-events: none;
    animation: resync-fade-in 0.3s ease-out both;
  }

  .game-resync-banner__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
    animation: resync-pulse 1.2s ease-in-out infinite;
  }

  @keyframes resync-fade-in {
    from { opacity: 0; transform: translate(-50%, calc(-50% - 6px)); }
    to { opacity: 1; transform: translate(-50%, -50%); }
  }

  @keyframes resync-pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  /* ---- Undo Proposal Banner ---- */

  .undo-proposal-banner {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 60;
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.65rem 0.85rem 0.65rem 1.15rem;
    border-radius: 1.25rem;
    background: rgba(30, 30, 40, 0.97);
    border: 1px solid rgba(99, 102, 241, 0.6);
    box-shadow:
      0 6px 28px rgba(0, 0, 0, 0.55),
      0 0 0 4px rgba(99, 102, 241, 0.18);
    animation:
      resync-fade-in 0.3s ease-out both,
      proposal-pulse 2.4s ease-in-out 0.3s infinite;
    max-width: min(36rem, calc(100vw - 1.25rem));
    width: max-content;
    box-sizing: border-box;
  }

  @media (max-width: 480px) {
    .undo-proposal-banner {
      flex-direction: column;
      align-items: stretch;
      gap: 0.55rem;
      padding: 0.7rem 0.85rem calc(0.7rem + env(safe-area-inset-bottom));
      border-radius: 1rem;
      width: calc(100vw - 1rem);
      max-width: calc(100vw - 1rem);
      top: auto;
      bottom: max(0.75rem, env(safe-area-inset-bottom));
      transform: translateX(-50%);
    }

    .undo-proposal-banner__text {
      text-align: center;
      line-height: 1.35;
    }

    .undo-proposal-banner__actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.45rem;
      width: 100%;
    }

    .undo-proposal-banner__btn {
      min-height: 2.6rem;
      font-size: 0.85rem;
      padding: 0.55rem 0.75rem;
    }
  }

  @keyframes proposal-pulse {
    0%,
    100% {
      box-shadow:
        0 6px 28px rgba(0, 0, 0, 0.55),
        0 0 0 4px rgba(99, 102, 241, 0.18);
      border-color: rgba(99, 102, 241, 0.6);
    }
    50% {
      box-shadow:
        0 6px 30px rgba(0, 0, 0, 0.6),
        0 0 0 8px rgba(99, 102, 241, 0.34);
      border-color: rgba(129, 140, 248, 0.9);
    }
  }

  .undo-proposal-banner__text {
    font-size: 0.8rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
  }

  .undo-proposal-banner__actions {
    display: flex;
    gap: 0.4rem;
  }

  .undo-proposal-banner__btn {
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.15s ease;
    border: 1px solid transparent;
  }

  .undo-proposal-banner__btn--accept {
    background: rgba(99, 102, 241, 0.8);
    color: white;
    border-color: rgba(99, 102, 241, 0.6);
  }

  .undo-proposal-banner__btn--accept:hover {
    background: rgba(99, 102, 241, 1);
  }

  .undo-proposal-banner__btn--decline {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.7);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .undo-proposal-banner__btn--decline:hover {
    background: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.9);
  }

</style>
