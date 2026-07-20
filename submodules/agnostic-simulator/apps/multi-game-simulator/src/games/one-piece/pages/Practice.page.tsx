import { useCallback, useEffect, useMemo, useState } from "react";
import type { AnimationPlanV1 } from "@tcg/protocol";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import {
  useLiveTransitionController,
  useLiveTransitionSnapshot,
} from "@tcg/simulator-runtime/live-transition";
import { adaptAnimationPlans } from "@tcg/simulator-runtime/animation-adapter";
import { MotionAnimationSurface } from "@tcg/simulator-ui";
import type {
  ApplyCommandResult,
  LegalCommandDescriptor,
  MatchState,
} from "@tcg/op-engine/practice-st01";
import { buildOnePieceBoardFromState } from "../data/projectVisualFixture.ts";
import { OnePieceSimulatorShell } from "../components/OnePieceSimulatorShell.tsx";
import { useSimulatorAudio } from "../../../simulator/audio";
import { onePieceAnimationPlanAdapter } from "../animation/onePieceAnimationAdapter.ts";
import classes from "./FixtureRoutes.module.css";

const HUMAN_SEAT = "south";
const BOT_SEAT = "north";
const SETUP_TIMEOUT_MS = 30_000;

type PracticeEngine = typeof import("@tcg/op-engine/practice-st01");

function createInitialPracticeState(engine: PracticeEngine): MatchState {
  return engine.createMatch(engine.createSt01MirrorPracticeConfig({ firstPlayer: HUMAN_SEAT }));
}

export function OnePiecePracticePage() {
  const [engine, setEngine] = useState<PracticeEngine | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const transitionController = useLiveTransitionController<MatchState, AnimationPlanV1>();
  const transitionSnapshot = useLiveTransitionSnapshot(transitionController);
  const state = transitionSnapshot.authoritativeState;
  const displayState = transitionSnapshot.displayState ?? state;
  const { scheduleAnimationSteps } = useSimulatorAudio();

  const applyEngineResult = useCallback(
    (runCommand: (current: MatchState | null) => ApplyCommandResult | MatchState | null) => {
      const current = transitionController.getSnapshot().authoritativeState;
      const outcome = runCommand(current);
      if (!outcome || outcome === current || !isApplyCommandResult(outcome)) {
        return;
      }

      transitionController.enqueueAuthoritativeUpdate({
        state: outcome.state,
        version: stateVersionOf(outcome.state),
        animationPlan: adaptAnimationPlans(
          onePieceAnimationPlanAdapter,
          outcome.animations,
          undefined,
        ),
      });
    },
    [transitionController],
  );

  useEffect(() => {
    let cancelled = false;

    void import("@tcg/op-engine/practice-st01")
      .then((loadedEngine) => {
        if (cancelled) {
          return;
        }
        setEngine(loadedEngine);
        const initialState = createInitialPracticeState(loadedEngine);
        transitionController.hydrateAuthoritativeState({
          state: initialState,
          version: stateVersionOf(initialState),
        });
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return;
        }
        setLoadError(error instanceof Error ? error.message : String(error));
      });

    return () => {
      cancelled = true;
    };
  }, [transitionController]);

  useEffect(() => {
    if (!engine || state?.status !== "setup") {
      return;
    }

    const botActions = engine.getLegalCommands(state, BOT_SEAT);
    const setupActionTypes = new Set([
      "chooseJoKenPo",
      "chooseFirstPlayer",
      "mulligan",
      "keepHand",
      "startGame",
    ]);
    if (!botActions.some((action) => setupActionTypes.has(action.type))) {
      return;
    }

    const timer = window.setTimeout(() => {
      applyEngineResult((current) => {
        if (!engine || !current || current.status !== "setup") {
          return current;
        }

        const legalCommands = engine.getLegalCommands(current, BOT_SEAT);
        const command = engine.passOnlyStrategy(current, BOT_SEAT, legalCommands);
        if (!command || !setupActionTypes.has(command.type)) {
          return current;
        }
        return engine.applyCommand(current, command);
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [applyEngineResult, engine, state]);

  useEffect(() => {
    if (!engine || state?.status !== "active" || state.activeSeat !== BOT_SEAT) {
      return;
    }

    const timer = window.setTimeout(() => {
      applyEngineResult((current) => {
        if (!current || current.status !== "active" || current.activeSeat !== BOT_SEAT) {
          return current;
        }

        const legalCommands = engine.getLegalCommands(current, BOT_SEAT);
        const command = engine.greedyStrategy(current, BOT_SEAT, legalCommands);
        if (!command) {
          const pass = legalCommands.find((candidate) => candidate.type === "endTurn");
          const fallback = pass ? engine.commandFromDescriptor(current, BOT_SEAT, pass) : null;
          if (!fallback) {
            return current;
          }
          return engine.applyCommand(current, fallback);
        }

        return engine.applyCommand(current, command);
      });
    }, 450);

    return () => window.clearTimeout(timer);
  }, [applyEngineResult, engine, state]);

  const board = useMemo(
    () =>
      displayState
        ? buildOnePieceBoardFromState(displayState, {
            id: "st01-practice",
            label: "ST-01 mirror practice",
            description: "You and the practice bot both use STARTER DECK -Straw Hat Crew- [ST-01].",
            logPrefix: "Started ST-01 mirror practice.",
          })
        : null,
    [displayState],
  );
  const targetBoard = useMemo(
    () =>
      state
        ? buildOnePieceBoardFromState(state, {
            id: "st01-practice-target",
            label: "ST-01 mirror practice",
            description: "You and the practice bot both use STARTER DECK -Straw Hat Crew- [ST-01].",
            logPrefix: "Started ST-01 mirror practice.",
          })
        : null,
    [state],
  );
  const entityById = useMemo(
    () => new Map(targetBoard?.entities.map((entity) => [entity.id, entity]) ?? []),
    [targetBoard],
  );
  const zoneById = useMemo(
    () => new Map(board?.table.zones.map((zone) => [zone.id, zone]) ?? []),
    [board],
  );

  const actions = useMemo(
    () => (engine && state ? engine.getLegalCommands(state, HUMAN_SEAT) : []),
    [engine, state],
  );

  const submitAction = useCallback(
    (action: LegalCommandDescriptor) => {
      applyEngineResult((current) => {
        if (!engine || !current) {
          return current;
        }

        const command = engine.commandFromDescriptor(current, HUMAN_SEAT, action);
        if (!command) {
          return current;
        }
        return engine.applyCommand(current, command);
      });
    },
    [applyEngineResult, engine],
  );

  const submitJoKenPoTimeout = useCallback(() => {
    applyEngineResult((current) => {
      if (!engine || !current || current.status !== "setup" || current.setup.joKenPo.winner) {
        return current;
      }

      const botChose = current.setup.joKenPo.pendingSeats.includes(BOT_SEAT);
      const winner = botChose ? BOT_SEAT : Math.random() < 0.5 ? HUMAN_SEAT : BOT_SEAT;
      return engine.applyCommand(current, {
        type: "resolveJoKenPoTimeout",
        seat: HUMAN_SEAT,
        winner,
        reason: botChose ? "onePlayerTimedOut" : "bothPlayersTimedOut",
        timedOutSeats: botChose ? [HUMAN_SEAT] : [HUMAN_SEAT, BOT_SEAT],
        elapsedMs: SETUP_TIMEOUT_MS,
      });
    });
  }, [applyEngineResult, engine]);

  if (loadError) {
    return (
      <main className={classes.page}>
        <p className={classes.eyebrow}>Practice</p>
        <h1>Unable to load ST-01 mirror practice</h1>
        <p>{loadError}</p>
      </main>
    );
  }

  if (!board) {
    return (
      <main className={classes.page}>
        <p className={classes.eyebrow}>Practice</p>
        <h1>Loading ST-01 mirror practice</h1>
      </main>
    );
  }

  return (
    <MotionAnimationSurface
      activeTransition={transitionSnapshot.activeTransition}
      viewerSeatId="player"
      resolveEntity={(entityId) => entityById.get(entityId) ?? hiddenOnePieceEntity(entityId)}
      resolveZone={(ref) => zoneById.get(ref.id) ?? null}
      onAnimationStepsScheduled={scheduleAnimationSteps}
      onTransitionComplete={(transitionId) =>
        transitionController.markAnimationComplete(transitionId)
      }
    >
      <OnePieceSimulatorShell
        board={board}
        actions={actions}
        onAction={submitAction}
        onJoKenPoTimeout={submitJoKenPoTimeout}
      />
    </MotionAnimationSurface>
  );
}

function isApplyCommandResult(value: ApplyCommandResult | MatchState): value is ApplyCommandResult {
  return "accepted" in value && "animations" in value && "state" in value;
}

function stateVersionOf(state: MatchState): number {
  return state.eventSequence + state.logSequence + state.capabilitySequence + 1;
}

function hiddenOnePieceEntity(entityId: string): SimulatorEntity {
  return {
    id: entityId,
    title: "Hidden card",
    subtitle: "Hidden card",
    kind: "card",
    ownerId: entityId.startsWith("player-") ? "player" : "opponent",
    face: "hidden",
    states: ["hidden"],
    stats: [],
    traits: [],
  };
}
