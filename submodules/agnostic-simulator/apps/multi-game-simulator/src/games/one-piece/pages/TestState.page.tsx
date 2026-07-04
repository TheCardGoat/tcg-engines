import { useMemo } from "react";
import type { MatchState } from "@tcg/op-engine/practice-st01";

import { TestStateRouteStatus } from "../../../test-state/TestStateRouteStatus.tsx";
import { useTestSimulatorState } from "../../../test-state/useTestSimulatorState.ts";
import { OnePieceSimulatorShell } from "../components/OnePieceSimulatorShell.tsx";
import { buildOnePieceBoardFromState } from "../data/projectVisualFixture.ts";

interface OnePieceTestStatePayload {
  readonly state: MatchState;
}

type OnePieceTestViewer = "north" | "south" | "judge" | "spectator";

export function OnePieceTestStatePage() {
  const loadState = useTestSimulatorState<OnePieceTestStatePayload>("one-piece");

  const board = useMemo(() => {
    if (loadState.status !== "ready") {
      return null;
    }
    return buildOnePieceBoardFromState(loadState.envelope.payload.state, {
      id: "test-engine-state",
      label: "Test engine state",
      description: "Board state opened from OnePieceTestEngine.",
      logPrefix: "Opened test engine state.",
      viewer: onePieceViewer(loadState.envelope.viewer),
    });
  }, [loadState]);

  if (loadState.status === "loading") {
    return <TestStateRouteStatus title="Loading state" message="Preparing One Piece board." />;
  }
  if (loadState.status === "error") {
    return <TestStateRouteStatus title="State unavailable" message={loadState.message} />;
  }
  if (!board) {
    return <TestStateRouteStatus title="State unavailable" message="No One Piece state loaded." />;
  }

  return <OnePieceSimulatorShell board={board} />;
}

function onePieceViewer(viewer: string | undefined): OnePieceTestViewer {
  return viewer === "north" || viewer === "judge" || viewer === "spectator" ? viewer : "south";
}
