import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { Action, GameState, LogEntry, PlayerId } from "@tcg-engines/naruto-engine";
import {
  buildInteractionSubmissionForActionId,
  EngineInteractionView,
  type InteractionSubmissionValue,
  type SimulatorAudioCueId,
} from "@tcg/protocol";
import { SimulatorRouteStatus } from "@tcg/simulator-ui";
import { acquireRootGatewayHandle } from "../../../lib/gateway/root-socket";
import { useSimulatorAudio } from "../../../simulator/audio";
import { useSimulatorRoute } from "../../../simulator/providers";
import { NarutoBoard } from "../board/NarutoBoard";
import type { NarutoParticipantNames } from "../projection/projectSimulator";

/**
 * Server-authoritative Naruto match surface. State is consumed exclusively
 * from the adapter's viewer projection; this deliberately never hydrates a
 * persisted engine snapshot in the browser.
 */
export function NarutoLiveMatchPage() {
  const route = useSimulatorRoute();
  const { matchId = "" } = useParams<{ matchId: string }>();
  const bootstrap = route.matchPageData;
  const gameId = bootstrap?.game.gameId;
  const participantNames = useMemo<NarutoParticipantNames>(() => {
    const participants = bootstrap?.match?.participants ?? [];
    const p1 = participants.find((participant) => participant.seat === 1)?.displayName;
    const p2 = participants.find((participant) => participant.seat === 2)?.displayName;
    return {
      ...(p1?.trim() ? { p1: p1.trim() } : {}),
      ...(p2?.trim() ? { p2: p2.trim() } : {}),
    };
  }, [bootstrap?.match?.participants]);
  const viewer = bootstrap?.viewer.role === "player" ? playerSeat(bootstrap.game.view) : null;
  const [state, setState] = useState<GameState | null>(() => projectedState(bootstrap?.game.view));
  const [interactionView, setInteractionView] = useState<EngineInteractionView | null>(() =>
    parseInteractionView(bootstrap?.game.interactionView),
  );
  const { playCue } = useSimulatorAudio();
  const heardLogLengthRef = useRef(state?.log.length ?? 0);
  const interactionRef = useRef(interactionView);
  useEffect(() => {
    interactionRef.current = interactionView;
  }, [interactionView]);

  useEffect(() => {
    if (!state || !viewer) return;
    const heardLogLength = heardLogLengthRef.current;
    if (state.log.length < heardLogLength) {
      heardLogLengthRef.current = state.log.length;
      return;
    }
    for (const entry of state.log.slice(heardLogLength)) {
      const cue = narutoAudioCueForLog(entry, viewer);
      if (cue) playCue(cue);
    }
    heardLogLengthRef.current = state.log.length;
  }, [playCue, state, viewer]);

  useEffect(() => {
    if (!gameId) return;
    const handle = acquireRootGatewayHandle("naruto");
    const accept = (payload: { gameId: string; state?: unknown; interactionView?: unknown }) => {
      if (payload.gameId !== gameId) return;
      const next = projectedState(payload.state);
      if (next) setState(next);
      const view = parseInteractionView(payload.interactionView);
      if (view) setInteractionView(view);
    };
    const unsubscribers = [
      handle.on("game_joined", accept),
      handle.on("state_sync", accept),
      handle.on("state_update", accept),
      handle.on("move_rejected", (payload) => {
        if (payload.gameId === gameId) {
          handle.emit("request_game_state_sync", { gameId });
        }
      }),
    ];
    handle.join({ gameId });
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      handle.leave();
      handle.release();
    };
  }, [gameId]);

  const submit = useCallback(
    (action: Action) => {
      if (!gameId || !viewer) return;
      const view = interactionRef.current;
      if (!view) return;
      const submission = submissionForAction(action, view, state);
      if (!submission) return;
      const handle = acquireRootGatewayHandle("naruto");
      handle.emit("submit_interaction", {
        gameId,
        expectedVersion: submission.stateVersion,
        submission,
        correlationId: crypto.randomUUID(),
      });
      handle.release();
    },
    [gameId, state, viewer],
  );

  if (route.error) return <SimulatorRouteStatus title="Match unavailable" message={route.error} />;
  if (bootstrap?.viewer.role !== "player") {
    return (
      <SimulatorRouteStatus
        title="Spectating unavailable"
        message="Naruto matches currently support seated players only."
      />
    );
  }
  if (!bootstrap || !gameId || !state || !viewer) {
    return (
      <SimulatorRouteStatus
        title="Loading Naruto match"
        message="Connecting to the match server."
      />
    );
  }
  return (
    <NarutoBoard
      state={state}
      viewer={viewer}
      participantNames={participantNames}
      onAction={submit}
      bugReportContext={{
        gameSlug: "naruto",
        gameId,
        ...(matchId ? { matchId } : {}),
        playerCount: 2,
        turn: state.turn,
        stateVersion: interactionView?.stateVersion ?? state.log.length,
        platform: typeof window !== "undefined" && window.innerWidth < 900 ? "mobile" : "desktop",
      }}
    />
  );
}

export function narutoAudioCueForLog(
  entry: Pick<LogEntry, "actor" | "key">,
  viewer: PlayerId,
): SimulatorAudioCueId | null {
  switch (entry.key) {
    case "log.draw":
      return "card.draw";
    case "log.summon":
    case "log.summonFromTrash":
    case "log.setSupport":
    case "log.playFromHand":
      return "card.play";
    case "log.declareAttack":
      return "combat.start";
    case "log.hitLeader":
    case "log.hitCharacter":
      return "combat.hit";
    case "log.characterTrashed":
      return "card.destroy";
    case "log.lifeCost":
      return "life.loss";
    case "log.lifeGain":
      return "life.gain";
    case "log.turnStart":
      return "turn.change";
    case "log.reveal":
      return "card.reveal";
    case "log.victory":
      return entry.actor === viewer ? "game.win" : "game.loss";
    default:
      return null;
  }
}

function submissionForAction(action: Action, view: EngineInteractionView, state: GameState | null) {
  const payload = submissionPayloadForAction(action, state);
  if (!payload) return null;
  return buildInteractionSubmissionForActionId({ view, ...payload });
}

export function submissionPayloadForAction(action: Action, state: GameState | null) {
  const values: Record<string, InteractionSubmissionValue> = {};
  let actionId: string;
  switch (action.type) {
    case "MULLIGAN":
      actionId = "mulligan";
      values.keep = action.keep;
      break;
    case "SUMMON":
      actionId = "summon";
      values.handUid = action.handUid;
      break;
    case "SET_SUPPORT":
      actionId = "set-support";
      values.handUid = action.handUid;
      break;
    case "ACTIVATE_SUPPORT": {
      const support = state?.players[action.player].supports[action.slot];
      if (!support) return null;
      actionId = "activate-support";
      values.supportUid = support.uid;
      break;
    }
    case "ACTIVATE_SUPPORT_FROM_HAND":
      actionId = "activate-support-from-hand";
      values.handUid = action.handUid;
      break;
    case "ACTIVATE_CHARACTER":
      actionId = "activate-character";
      values.uid = action.uid;
      break;
    case "LEADER_EFFECT":
      actionId = "leader-effect";
      break;
    case "RECOVERY":
      actionId = "recovery";
      break;
    case "DECLARE_ATTACK":
      actionId = "declare-attack";
      values.attackerUid = action.attackerUid;
      values.targetUid = action.targetUid;
      break;
    case "PASS_COUNTER":
      actionId = "pass-counter";
      break;
    case "RESOLVE_CHOICE":
      actionId = "resolve-choice";
      values.key = action.key;
      break;
    case "END_TURN":
      actionId = "end-turn";
      break;
  }
  return { actionId, values };
}

function parseInteractionView(value: unknown): EngineInteractionView | null {
  const parsed = EngineInteractionView.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function playerSeat(value: unknown): PlayerId | null {
  if (!isRecord(value) || !isRecord(value.viewer)) return null;
  return value.viewer.seat === "p1" || value.viewer.seat === "p2" ? value.viewer.seat : null;
}

function projectedState(value: unknown): GameState | null {
  if (!isRecord(value) || !isRecord(value.state) || !isRecord(value.state.players)) return null;
  const players = value.state.players;
  const hydrate = (player: unknown) => {
    if (!isRecord(player)) return null;
    const deckCount = typeof player.deckCount === "number" ? player.deckCount : 0;
    const exPileCount = typeof player.exPileCount === "number" ? player.exPileCount : 0;
    return {
      ...player,
      deck: Array(deckCount).fill({ uid: "hidden", cardId: "hidden" }),
      exPile: Array(exPileCount).fill({ uid: "hidden", cardId: "hidden" }),
    };
  };
  const p1 = hydrate(players.p1);
  const p2 = hydrate(players.p2);
  if (!p1 || !p2) return null;
  return { ...value.state, seed: 0, players: { p1, p2 } } as unknown as GameState;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
