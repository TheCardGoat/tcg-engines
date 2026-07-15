import { useMemo } from "react";

import { TestStateRouteStatus } from "../../../test-state/TestStateRouteStatus.tsx";
import { useTestSimulatorState } from "../../../test-state/useTestSimulatorState.ts";
import { SimulatorApp } from "../src/SimulatorApp.tsx";
import { reconstructFromSnapshot, type MatchSnapshot } from "../src/game/snapshot.ts";
import { asViewerId } from "../src/game/types.ts";

interface GundamTestStatePayload {
  readonly snapshot: MatchSnapshot;
}

export function GundamTestStatePage() {
  const loadState = useTestSimulatorState<GundamTestStatePayload>("gundam");

  const match = useMemo(() => {
    if (loadState.status !== "ready") {
      return null;
    }
    return reconstructFromSnapshot(loadState.envelope.payload.snapshot);
  }, [loadState]);

  if (loadState.status === "loading") {
    return <TestStateRouteStatus title="Loading state" message="Preparing Gundam board." />;
  }
  if (loadState.status === "error") {
    return <TestStateRouteStatus title="State unavailable" message={loadState.message} />;
  }
  if (!match) {
    return <TestStateRouteStatus title="State unavailable" message="No Gundam state loaded." />;
  }

  return (
    <SimulatorApp
      runtime={match.runtime}
      staticResources={match.staticResources}
      viewerId={asViewerId(loadState.envelope.viewer ?? match.p1Id)}
    />
  );
}
