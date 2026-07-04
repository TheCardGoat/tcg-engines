import { useCallback, useEffect, useMemo, useState } from "react";
import type { LegalCommandDescriptor, MatchState } from "@tcg/op-engine/practice-st01";
import { buildOnePieceBoardFromState } from "../data/projectVisualFixture.ts";
import { OnePieceSimulatorShell } from "../components/OnePieceSimulatorShell.tsx";
import classes from "./FixtureRoutes.module.css";

const HUMAN_SEAT = "south";
const BOT_SEAT = "north";

type PracticeEngine = typeof import("@tcg/op-engine/practice-st01");

function createInitialPracticeState(engine: PracticeEngine): MatchState {
  const initialState = engine.createMatch(
    engine.createSt01MirrorPracticeConfig({ firstPlayer: HUMAN_SEAT }),
  );
  const startResult = engine.applyCommand(initialState, { type: "startGame", seat: HUMAN_SEAT });
  return startResult.accepted ? startResult.state : initialState;
}

export function OnePiecePracticePage() {
  const [engine, setEngine] = useState<PracticeEngine | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [state, setState] = useState<MatchState | null>(null);

  useEffect(() => {
    let cancelled = false;

    void import("@tcg/op-engine/practice-st01")
      .then((loadedEngine) => {
        if (cancelled) {
          return;
        }
        setEngine(loadedEngine);
        setState(createInitialPracticeState(loadedEngine));
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
  }, []);

  useEffect(() => {
    if (!engine || state?.status !== "active" || state.activeSeat !== BOT_SEAT) {
      return;
    }

    const timer = window.setTimeout(() => {
      setState((current) => {
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
          const result = engine.applyCommand(current, fallback);
          return result.state;
        }

        const result = engine.applyCommand(current, command);
        return result.state;
      });
    }, 450);

    return () => window.clearTimeout(timer);
  }, [engine, state]);

  const board = useMemo(
    () =>
      state
        ? buildOnePieceBoardFromState(state, {
            id: "st01-practice",
            label: "ST-01 mirror practice",
            description: "You and the practice bot both use STARTER DECK -Straw Hat Crew- [ST-01].",
            logPrefix: "Started ST-01 mirror practice.",
          })
        : null,
    [state],
  );

  const actions = useMemo(
    () => (engine && state ? engine.getLegalCommands(state, HUMAN_SEAT) : []),
    [engine, state],
  );

  const submitAction = useCallback(
    (action: LegalCommandDescriptor) => {
      setState((current) => {
        if (!engine || !current) {
          return current;
        }

        const command = engine.commandFromDescriptor(current, HUMAN_SEAT, action);
        if (!command) {
          return current;
        }
        const result = engine.applyCommand(current, command);
        return result.state;
      });
    },
    [engine],
  );

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

  return <OnePieceSimulatorShell board={board} actions={actions} onAction={submitAction} />;
}
