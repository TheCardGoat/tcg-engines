import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage as ProtocolChatMessage, ChatPresetKey, PendingProposal } from "@tcg/protocol";
import { CHAT_PRESET_KEYS, CHAT_PRESETS } from "@tcg/simulator-runtime/chat";
import {
  ChatPanel,
  SimulatorRouteStatus,
  type ChatMessage as UiChatMessage,
} from "@tcg/simulator-ui";
import { acquireRootGatewayHandle } from "../../lib/gateway/root-socket";
import { useSimulatorRoute } from "../../simulator/providers";
import { useLiveMatchDocumentTitle } from "../../simulator/attention/useLiveMatchDocumentTitle";
import { RiftboundTabletop } from "./RiftboundTabletop";
import { nextRiftboundGameHref } from "./navigation";
import { downloadHostedReplay, saveHostedReplayOnDevice } from "../../runtime/replayActions";
import {
  parseRiftboundClientSnapshotV1,
  reduceRiftboundClientMatchStateV1,
  type RiftboundClientMatchActionV1,
  type RiftboundClientMatchStateV1,
} from "@tcg/riftbound-tabletop";

export function RiftboundLiveMatchPage() {
  const route = useSimulatorRoute();
  const page = route.matchPageData;
  const snapshot = page?.game;
  const matchId = page?.match.matchId;
  const viewerId = useMemo(() => {
    return page?.viewer.role === "player" ? page.viewer.actorId : null;
  }, [page]);
  const initialState = parseRiftboundClientSnapshotV1(snapshot?.view)?.state ?? null;
  const [authoritative, setAuthoritative] = useState<RiftboundClientMatchStateV1 | null>(
    initialState,
  );
  const [display, setDisplay] = useState<RiftboundClientMatchStateV1 | null>(initialState);
  useLiveMatchDocumentTitle({
    game: "Riftbound",
    turn: null,
    priority: null,
    finished: Boolean(display?.terminal),
  });
  const [version, setVersion] = useState<number | null>(
    initialState ? (snapshot?.stateVersion ?? 0) : null,
  );
  const [pending, setPending] = useState(false);
  const [conflict, setConflict] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(snapshot?.undoable === true);
  const [canUndoTurn, setCanUndoTurn] = useState(snapshot?.undoTurnAvailable === true);
  const [undoProposal, setUndoProposal] = useState<PendingProposal | null>(null);
  useEffect(() => {
    if (!undoProposal) return;
    const deadline = undoProposal.deadline;
    const timeout = window.setTimeout(
      () => {
        setUndoProposal((current) => (current?.deadline === deadline ? null : current));
      },
      Math.max(0, deadline - Date.now()),
    );
    return () => window.clearTimeout(timeout);
  }, [undoProposal]);
  // Seed chat from the HTTP bootstrap (player sessions only) so a refresh
  // shows history immediately; the gateway `game_chat_history` reply remains
  // the authoritative hydration for spectators and reconnects.
  const [chatMessages, setChatMessages] = useState<ProtocolChatMessage[]>(() =>
    readChatMessages(page?.history.chatMessages ?? []),
  );
  const [freeTextEnabled, setFreeTextEnabled] = useState(page?.history.freeTextEnabled === true);
  const [replayStatus, setReplayStatus] = useState<string | null>(null);
  const authoritativeRef = useRef(authoritative);
  const versionRef = useRef(version);
  useEffect(() => {
    authoritativeRef.current = authoritative;
  }, [authoritative]);
  useEffect(() => {
    versionRef.current = version;
  }, [version]);

  const acceptSnapshot = useCallback((state: unknown, nextVersion: number) => {
    const restored = parseRiftboundClientSnapshotV1(state)?.state;
    if (!restored) return;
    authoritativeRef.current = restored;
    versionRef.current = nextVersion;
    setAuthoritative(restored);
    setDisplay(restored);
    setVersion(nextVersion);
    setPending(false);
    setConflict(null);
  }, []);

  useEffect(() => {
    if (!snapshot?.gameId || !viewerId || !matchId) return;
    const handle = acquireRootGatewayHandle("riftbound");
    const unsubscribers = [
      handle.on("game_joined", (payload) => {
        if (payload.gameId !== snapshot.gameId) return;
        acceptSnapshot(payload.state, payload.stateVersion);
        setCanUndo(payload.undoable === true);
        setCanUndoTurn(payload.undoTurnAvailable === true);
        if (payload.pendingProposal?.actionType === "undo") setUndoProposal(payload.pendingProposal);
      }),
      handle.on(
        "state_update",
        (payload) => {
          if (payload.gameId !== snapshot.gameId) return;
          acceptSnapshot(payload.state, payload.stateVersion);
          setCanUndo(payload.undoable === true);
          setCanUndoTurn(payload.undoTurnAvailable === true);
        },
      ),
      handle.on(
        "state_sync",
        (payload) => {
          if (payload.gameId !== snapshot.gameId) return;
          acceptSnapshot(payload.state, payload.stateVersion);
          setCanUndo(payload.undoable === true);
          setCanUndoTurn(payload.undoTurnAvailable === true);
        },
      ),
      handle.on("move_rejected", (payload) => {
        if (payload.gameId !== snapshot.gameId) return;
        setDisplay(authoritativeRef.current);
        setPending(false);
        setConflict(payload.reason ?? "The server rejected that action. Reloaded the table.");
        handle.emit("request_game_state_sync", {
          gameId: snapshot.gameId,
          stateVersion: versionRef.current ?? undefined,
        });
      }),
      handle.on("proposal_received", (payload) => {
        if (payload.gameId === snapshot.gameId && payload.actionType === "undo")
          setUndoProposal({ ...payload, actionType: "undo" });
      }),
      handle.on("proposal_resolved", (payload) => {
        if (payload.gameId === snapshot.gameId && payload.actionType === "undo") setUndoProposal(null);
      }),
      handle.on("proposal_expired", (payload) => {
        if (payload.gameId === snapshot.gameId && payload.actionType === "undo") setUndoProposal(null);
      }),
      handle.on("proposal_send:response", (response) => {
        if (response.status === "err") setConflict(response.data.message);
        else if ("resolution" in response.data) setUndoProposal(null);
        else if (response.data.actionType === "undo")
          setUndoProposal({ ...response.data, actionType: "undo" });
      }),
      handle.on("proposal_accept:response", (response) => {
        if (response.status === "err") setConflict(response.data.message);
        setUndoProposal(null);
      }),
      handle.on("proposal_decline:response", (response) => {
        if (response.status === "err") setConflict(response.data.message);
        setUndoProposal(null);
      }),
      handle.on("game_ended", (payload) => {
        if (payload.gameId !== snapshot.gameId || payload.matchCompleted || !payload.nextGameId)
          return;
        window.location.href = nextRiftboundGameHref(
          window.location.href,
          matchId,
          payload.nextGameId,
        );
      }),
      handle.on("match_state", (payload) => {
        const currentGameId =
          typeof payload.currentGameId === "string" ? payload.currentGameId : null;
        if (
          payload.matchId !== matchId ||
          payload.status === "completed" ||
          !currentGameId ||
          currentGameId === snapshot.gameId
        )
          return;
        window.location.href = nextRiftboundGameHref(window.location.href, matchId, currentGameId);
      }),
      handle.on("game_chat_history", (payload) => {
        if (payload.gameId !== snapshot.gameId) return;
        setChatMessages(readChatMessages(payload.messages));
        setFreeTextEnabled(payload.freeTextEnabled);
      }),
      handle.on("chat_message", (payload) => {
        if (payload.gameId !== snapshot.gameId) return;
        const message = readChatMessage(payload.message);
        if (!message) return;
        if (message.kind === "system" && message.systemEvent === "free_text_chat_enabled") {
          setFreeTextEnabled(true);
        }
        setChatMessages((current) =>
          current.some((entry) => entry.id === message.id)
            ? current
            : current.concat(message).slice(-100),
        );
      }),
    ];
    handle.join({ gameId: snapshot.gameId });
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      handle.leave();
      handle.release();
    };
  }, [acceptSnapshot, matchId, snapshot?.gameId, viewerId]);

  const dispatch = useCallback(
    (action: RiftboundClientMatchActionV1) => {
      if (!snapshot?.gameId || !viewerId || pending) return;
      const base = authoritativeRef.current;
      if (!base) return;
      const next = reduceRiftboundClientMatchStateV1(base, action);
      const expectedVersion = versionRef.current;
      const handle = acquireRootGatewayHandle("riftbound");
      setDisplay(next);
      setPending(true);
      setConflict(null);
      handle.emit("execute_move", {
        gameId: snapshot.gameId,
        expectedVersion: expectedVersion ?? 0,
        moveType: action.type,
        payload: { ...action },
        correlationId: action.actionId,
      });
      handle.release();
    },
    [pending, snapshot?.gameId, viewerId],
  );
  const sendUndo = (event: "proposal_send" | "proposal_accept" | "proposal_decline",
    undoScope: "last_move" | "turn_start" = "last_move") => {
    if (!snapshot?.gameId || !viewerId) return;
    const handle = acquireRootGatewayHandle("riftbound");
    handle.emit(event, { gameId: snapshot.gameId, actionType: "undo",
      ...(event === "proposal_send" ? { undoScope } : {}) });
    handle.release();
  };

  if (route.error) return <SimulatorRouteStatus title="Match unavailable" message={route.error} />;
  if (!page || !snapshot)
    return (
      <SimulatorRouteStatus
        title="Loading Riftbound match"
        message="Fetching the private match context."
      />
    );
  if (page.viewer.role === "spectator" || !viewerId)
    return (
      <SimulatorRouteStatus
        title="Spectating disabled"
        message="Riftbound live matches are limited to the two seated players."
      />
    );
  if (snapshot.authority !== "server")
    return (
      <SimulatorRouteStatus
        title="Invalid match authority"
        message="Riftbound matches must use the hosted tabletop."
      />
    );
  if (!display)
    return (
      <SimulatorRouteStatus
        title="Initializing table"
        message="Waiting for the hosted table."
      />
    );
  const sendPreset = (presetKey: string) => {
    const handle = acquireRootGatewayHandle("riftbound");
    handle.emit("send_chat_message", {
      gameId: snapshot.gameId,
      presetKey: presetKey as ChatPresetKey,
    });
    handle.release();
  };
  const sendText = (text: string) => {
    const handle = acquireRootGatewayHandle("riftbound");
    handle.emit("send_free_text_chat_message", { gameId: snapshot.gameId, text });
    handle.release();
  };
  return (
    <RiftboundTabletop
      sessionKey={`riftbound:live:${snapshot.gameId}:${viewerId}`}
      state={display}
      viewerId={viewerId}
      pending={pending}
      conflict={conflict}
      onAction={dispatch}
      sidebarExtra={
        <>
        <div className="riftbound-match-actions">
          <button type="button" disabled={pending || Boolean(display.terminal)}
            onClick={() => dispatch({ type: "start_turn", actorId: viewerId,
              actionId: crypto.randomUUID(), at: Date.now() })}>Start turn</button>
          <button type="button" disabled={pending || !canUndo || Boolean(undoProposal)}
            onClick={() => sendUndo("proposal_send")}>Undo</button>
          <button type="button" disabled={pending || !canUndoTurn || Boolean(undoProposal)}
            onClick={() => sendUndo("proposal_send", "turn_start")}>Undo turn</button>
        </div>
        {undoProposal ? (
          <div className="riftbound-match-actions" role="status">
            <span>{undoProposal.senderPlayerId === viewerId
              ? "Waiting for opponent approval."
              : undoProposal.undoScope === "turn_start" ? "Opponent requests Undo turn." : "Opponent requests Undo."}</span>
            {undoProposal.senderPlayerId !== viewerId ? (
              <><button type="button" onClick={() => sendUndo("proposal_accept")}>Approve</button>
                <button type="button" onClick={() => sendUndo("proposal_decline")}>Decline</button></>
            ) : null}
          </div>
        ) : null}
        <ChatPanel
          messages={chatMessages.map((message) => toUiChatMessage(message, viewerId))}
          presets={CHAT_PRESET_KEYS.map((id) => ({ id, label: CHAT_PRESETS[id] }))}
          freeTextEnabled={freeTextEnabled}
          onSendPreset={sendPreset}
          onSendText={sendText}
          compact
        />
        </>
      }
      replayControls={
        display.terminal ? (
          <div className="riftbound-match-actions">
            <a href={`/riftbound/simulator/replay/${encodeURIComponent(snapshot.gameId)}`}>
              Watch replay
            </a>
            <button
              type="button"
              onClick={() => {
                void saveHostedReplayOnDevice("riftbound", snapshot.gameId).then(
                  () => setReplayStatus("Saved on this device. Browser storage has no set expiry."),
                  () =>
                    setReplayStatus(
                      "Could not save in browser storage. Download is still available.",
                    ),
                );
              }}
            >
              Save on this device
            </button>
            <button
              type="button"
              onClick={() => {
                void downloadHostedReplay("riftbound", snapshot.gameId).catch(() =>
                  setReplayStatus("Replay download failed."),
                );
              }}
            >
              Download replay
            </button>
            {replayStatus ? <span role="status">{replayStatus}</span> : null}
          </div>
        ) : undefined
      }
    />
  );
}

function readChatMessages(value: unknown[]): ProtocolChatMessage[] {
  return value.flatMap((entry) => {
    const message = readChatMessage(entry);
    return message ? [message] : [];
  });
}

function readChatMessage(value: unknown): ProtocolChatMessage | null {
  if (!value || typeof value !== "object") return null;
  const message = value as Partial<ProtocolChatMessage>;
  if (
    typeof message.id !== "string" ||
    typeof message.senderPlayerId !== "string" ||
    typeof message.createdAt !== "string" ||
    (message.kind !== "preset" && message.kind !== "text" && message.kind !== "system")
  ) {
    return null;
  }
  return message as ProtocolChatMessage;
}

function toUiChatMessage(message: ProtocolChatMessage, viewerId: string): UiChatMessage {
  const senderSide =
    message.kind === "system"
      ? "system"
      : message.senderPlayerId === viewerId
        ? "player"
        : "opponent";
  const text =
    message.kind === "preset"
      ? CHAT_PRESETS[message.presetKey]
      : message.kind === "text"
        ? message.text
        : message.systemEvent.replaceAll("_", " ");
  return {
    id: message.id,
    senderSide,
    senderLabel: senderSide === "system" ? "System" : senderSide === "player" ? "You" : "Rival",
    text,
    timestamp: message.createdAt,
  };
}
