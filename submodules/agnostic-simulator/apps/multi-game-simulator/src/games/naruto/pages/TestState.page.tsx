/**
 * test-engine-state route: renders a GameState posted by the test harness
 * through the shared test-state bridge (one-piece pattern).
 */

import { useMemo } from "react";

import type { GameState, PlayerId } from "@tcg-engines/naruto-engine";

import { TestStateRouteStatus } from "../../../test-state/TestStateRouteStatus.tsx";
import { useTestSimulatorState } from "../../../test-state/useTestSimulatorState.ts";
import type { TestSimulatorGameSlug } from "../../../test-state/testSimulatorState.ts";
import { NarutoBoard } from "../board/NarutoBoard.tsx";

interface NarutoTestStatePayload {
  readonly state: GameState;
  readonly viewer?: string;
}

// "naruto" joins TestSimulatorGameSlug with the shared slug-registration edits
// (packages/simulator-contract GameSlug + app test-state union); the cast keeps
// this file compiling independently of that landing order.
const NARUTO_TEST_SLUG = "naruto" as TestSimulatorGameSlug;

export function NarutoTestStatePage() {
  const loadState = useTestSimulatorState<NarutoTestStatePayload>(NARUTO_TEST_SLUG);

  const viewer: PlayerId = useMemo(() => {
    if (loadState.status !== "ready") return "p1";
    const raw = loadState.envelope.payload.viewer ?? loadState.envelope.viewer;
    return raw === "p2" ? "p2" : "p1";
  }, [loadState]);

  if (loadState.status === "loading") {
    return <TestStateRouteStatus title="Loading state" message="Preparing Naruto board." />;
  }
  if (loadState.status === "error") {
    return <TestStateRouteStatus title="State unavailable" message={loadState.message} />;
  }

  const state = loadState.envelope.payload.state;
  if (!state) {
    return <TestStateRouteStatus title="State unavailable" message="No Naruto state loaded." />;
  }

  return (
    <NarutoBoard state={state} viewer={viewer} interactive={false} onAction={() => undefined} />
  );
}

export default NarutoTestStatePage;
