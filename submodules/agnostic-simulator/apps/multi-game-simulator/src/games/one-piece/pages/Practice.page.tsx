import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AnimationInteractionBoundary,
  createSimulatorAnimationScope,
  DefaultSimulatorEntityVisual,
} from "@tcg/simulator-ui";
import type {
  ApplyCommandResult,
  LegalCommandDescriptor,
  MatchState,
} from "@tcg/op-engine/practice-st01";

import { buildOnePieceBoardFromState } from "../data/projectVisualFixture.ts";
import { OnePieceSimulatorShell } from "../components/OnePieceSimulatorShell.tsx";
import { useSimulatorAudio } from "../../../simulator/audio";
import { useRegisterSimulatorDebugExportSource } from "../../../simulator/debug-export/SimulatorDebugExportContext";
import { LocalSimulatorDebugHistoryRecorder } from "../../../simulator/debug-export/local-debug-history";
import { onePieceAnimationsToAnimationPlan } from "../animation/onePieceAnimationAdapter.ts";
import classes from "./FixtureRoutes.module.css";

const HUMAN_SEAT = "south";
const BOT_SEAT = "north";
const SETUP_TIMEOUT_MS = 30_000;
const OnePieceAnimation = createSimulatorAnimationScope<MatchState>();

type PracticeEngine = typeof import("@tcg/op-engine/practice-st01");
type PracticeCommand = Parameters<PracticeEngine["applyCommand"]>[1];

function createInitialPracticeState(engine: PracticeEngine): MatchState {
  const state = engine.createMatch(
    engine.createSt01MirrorPracticeConfig({ firstPlayer: HUMAN_SEAT }),
  );
  engine.placeStartingLife(state, HUMAN_SEAT);
  engine.placeStartingLife(state, BOT_SEAT);
  return state;
}

export function OnePiecePracticePage() {
  const [session, setSession] = useState<{
    engine: PracticeEngine;
    initialState: MatchState;
  } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void import("@tcg/op-engine/practice-st01")
      .then((engine) => {
        if (!cancelled) setSession({ engine, initialState: createInitialPracticeState(engine) });
      })
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : String(error));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loadError) {
    return (
      <main className={classes.page}>
        <p className={classes.eyebrow}>Practice</p>
        <h1>Unable to load ST-01 mirror practice</h1>
        <p>{loadError}</p>
      </main>
    );
  }
  if (!session) {
    return (
      <main className={classes.page}>
        <p className={classes.eyebrow}>Practice</p>
        <h1>Loading ST-01 mirror practice</h1>
      </main>
    );
  }
  return <OnePiecePracticeSession {...session} />;
}

function OnePiecePracticeSession({
  engine,
  initialState,
}: {
  readonly engine: PracticeEngine;
  readonly initialState: MatchState;
}) {
  const { scheduleAnimationSteps, cancelScheduledCues } = useSimulatorAudio();
  const debugHistory = useMemo(
    () =>
      new LocalSimulatorDebugHistoryRecorder(
        {
          slug: "one-piece",
          gameId: "one-piece-local-practice",
          matchId: "st01-mirror-practice",
          environment: "development",
          ...(import.meta.env.VITE_GIT_SHA ? { releaseSha: import.meta.env.VITE_GIT_SHA } : {}),
        },
        initialState,
      ),
    [initialState],
  );
  useRegisterSimulatorDebugExportSource(debugHistory);
  const projection = useMemo(
    () => ({
      getEntity(state: MatchState, entityId: string) {
        return (
          buildBoard(state).entities.find((entity) => entity.id === entityId) ??
          hiddenOnePieceEntity(entityId)
        );
      },
      getZone(state: MatchState, ref: { kind: "zone"; id: string }) {
        return buildBoard(state).table.zones.find((zone) => zone.id === ref.id) ?? null;
      },
    }),
    [],
  );
  return (
    <OnePieceAnimation.Root
      sessionKey="one-piece:practice:st01"
      initialState={initialState}
      initialVersion={stateVersionOf(initialState)}
      projection={projection}
      entityRenderer={DefaultSimulatorEntityVisual}
      viewerSeatId="player"
      animationSpeed="normal"
      onScheduleAudio={scheduleAnimationSteps}
      onCancelAudio={cancelScheduledCues}
    >
      <OnePiecePracticeBoard debugHistory={debugHistory} engine={engine} />
    </OnePieceAnimation.Root>
  );
}

function OnePiecePracticeBoard({
  debugHistory,
  engine,
}: {
  readonly debugHistory: LocalSimulatorDebugHistoryRecorder;
  readonly engine: PracticeEngine;
}) {
  const snapshot = OnePieceAnimation.useState();
  const { enqueue } = OnePieceAnimation.useActions();
  const gate = OnePieceAnimation.useCommandGate();
  const state = snapshot.authoritativeState;
  const presentationState = snapshot.presentationState ?? state;

  const applyEngineResult = useCallback(
    (
      runCommand: (
        current: MatchState | null,
      ) => { command: PracticeCommand; outcome: ApplyCommandResult } | MatchState | null,
    ) => {
      if (!gate.canDispatch()) return false;
      const current = OnePieceAnimationState(snapshot).authoritativeState;
      const executed = runCommand(current);
      if (!executed || executed === current || !isExecutedCommand(executed)) return false;
      const { command, outcome } = executed;
      if (!outcome.accepted) return false;
      const version = stateVersionOf(outcome.state);
      debugHistory.record({
        stateAfter: outcome.state,
        stateVersion: version,
        turnNumber: turnNumberOf(outcome.state),
        actorId: command.seat,
        moveId: command.type,
        commandId: `one-piece:${version}`,
        input: command,
        processedCommand: command,
        timestamp: Date.now(),
        domainEvents: outcome.events,
      });
      return enqueue({
        state: outcome.state,
        version,
        plan: onePieceAnimationsToAnimationPlan(outcome.animations, `one-piece:${version}`),
        source: "local",
      });
    },
    [debugHistory, enqueue, gate, snapshot],
  );

  useEffect(() => {
    if (!state || gate.isBlocked || state.status !== "setup") return;
    const setupActionTypes = new Set([
      "chooseJoKenPo",
      "chooseFirstPlayer",
      "mulligan",
      "keepHand",
      "startGame",
    ]);
    if (
      !engine.getLegalCommands(state, BOT_SEAT).some((action) => setupActionTypes.has(action.type))
    ) {
      return;
    }
    const timer = window.setTimeout(() => {
      applyEngineResult((current) => {
        if (!current || current.status !== "setup") return current;
        const legal = engine.getLegalCommands(current, BOT_SEAT);
        const command = engine.passOnlyStrategy(current, BOT_SEAT, legal);
        return command && setupActionTypes.has(command.type)
          ? { command, outcome: engine.applyCommand(current, command) }
          : current;
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [applyEngineResult, engine, gate.isBlocked, state]);

  useEffect(() => {
    if (!state || gate.isBlocked || state.status !== "active" || state.activeSeat !== BOT_SEAT) {
      return;
    }
    const timer = window.setTimeout(() => {
      applyEngineResult((current) => {
        if (!current || current.status !== "active" || current.activeSeat !== BOT_SEAT) {
          return current;
        }
        const legal = engine.getLegalCommands(current, BOT_SEAT);
        const command =
          engine.greedyStrategy(current, BOT_SEAT, legal) ??
          (() => {
            const pass = legal.find((candidate) => candidate.type === "endTurn");
            return pass ? engine.commandFromDescriptor(current, BOT_SEAT, pass) : null;
          })();
        return command ? { command, outcome: engine.applyCommand(current, command) } : current;
      });
    }, 450);
    return () => window.clearTimeout(timer);
  }, [applyEngineResult, engine, gate.isBlocked, state]);

  const board = useMemo(
    () => (presentationState ? buildBoard(presentationState) : null),
    [presentationState],
  );
  const actions = useMemo(
    () => (state && !gate.isBlocked ? engine.getLegalCommands(state, HUMAN_SEAT) : []),
    [engine, gate.isBlocked, state],
  );
  const cardActions = useMemo(
    () => (state && !gate.isBlocked ? engine.getPotentialCardCommands(state, HUMAN_SEAT) : []),
    [engine, gate.isBlocked, state],
  );
  const submitAction = useCallback(
    (action: LegalCommandDescriptor) => {
      applyEngineResult((current) => {
        if (!current) return current;
        const command = engine.commandFromDescriptor(current, HUMAN_SEAT, action);
        return command ? { command, outcome: engine.applyCommand(current, command) } : current;
      });
    },
    [applyEngineResult, engine],
  );
  const submitJoKenPoTimeout = useCallback(() => {
    applyEngineResult((current) => {
      if (!current || current.status !== "setup" || current.setup.joKenPo.winner) return current;
      const botChose = current.setup.joKenPo.pendingSeats.includes(BOT_SEAT);
      const winner = botChose ? BOT_SEAT : Math.random() < 0.5 ? HUMAN_SEAT : BOT_SEAT;
      const command: PracticeCommand = {
        type: "resolveJoKenPoTimeout",
        seat: HUMAN_SEAT,
        winner,
        reason: botChose ? "onePlayerTimedOut" : "bothPlayersTimedOut",
        timedOutSeats: botChose ? [HUMAN_SEAT] : [HUMAN_SEAT, BOT_SEAT],
        elapsedMs: SETUP_TIMEOUT_MS,
      };
      return { command, outcome: engine.applyCommand(current, command) };
    });
  }, [applyEngineResult, engine]);

  if (!board) return null;
  return (
    <AnimationInteractionBoundary active={gate.isBlocked}>
      <OnePieceSimulatorShell
        board={board}
        actions={actions}
        cardActions={cardActions}
        onAction={submitAction}
        onJoKenPoTimeout={submitJoKenPoTimeout}
        bugReportContext={{
          gameSlug: "one-piece",
          playerCount: 2,
          turn: board.table.status.turn,
          stateVersion: board.table.status.stateVersion,
          platform: window.innerWidth < 768 ? "mobile" : "desktop",
        }}
      />
    </AnimationInteractionBoundary>
  );
}

function OnePieceAnimationState(snapshot: ReturnType<typeof OnePieceAnimation.useState>) {
  return snapshot;
}

function buildBoard(state: MatchState) {
  return buildOnePieceBoardFromState(state as Parameters<typeof buildOnePieceBoardFromState>[0], {
    id: "st01-practice",
    label: "ST-01 mirror practice",
    description: "You and the practice bot both use STARTER DECK -Straw Hat Crew- [ST-01].",
    logPrefix: "Started ST-01 mirror practice.",
  });
}

function isApplyCommandResult(value: ApplyCommandResult | MatchState): value is ApplyCommandResult {
  return "accepted" in value && "animations" in value && "state" in value;
}

function isExecutedCommand(
  value: { command: PracticeCommand; outcome: ApplyCommandResult } | MatchState,
): value is { command: PracticeCommand; outcome: ApplyCommandResult } {
  return "command" in value && "outcome" in value && isApplyCommandResult(value.outcome);
}

function turnNumberOf(state: MatchState): number {
  return typeof state.turnNumber === "number" ? state.turnNumber : 0;
}

function stateVersionOf(state: MatchState): number {
  return state.eventSequence + state.logSequence + state.capabilitySequence + 1;
}

function hiddenOnePieceEntity(entityId: string) {
  return {
    id: entityId,
    title: "Hidden card",
    subtitle: "Hidden card",
    kind: "card" as const,
    ownerId: entityId.startsWith("player-") ? "player" : "opponent",
    face: "hidden" as const,
    states: ["hidden" as const],
    stats: [],
    traits: [],
  };
}
