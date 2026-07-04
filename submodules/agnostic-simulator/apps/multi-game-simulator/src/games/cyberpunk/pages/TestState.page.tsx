import { useMemo } from "react";
import {
  CyberpunkTestEngine,
  setCardRegistry,
  type CardCatalog,
  type MatchState,
} from "@tcg/cyberpunk-engine";
import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";

import { TestStateRouteStatus } from "../../../test-state/TestStateRouteStatus.tsx";
import { useTestSimulatorState } from "../../../test-state/useTestSimulatorState.ts";
import { PLAYER_SIDE_TO_ID, type Side } from "../engine";
import { BoardSharedPage } from "./BoardShared.page";

interface CyberpunkTestStatePayload {
  readonly catalog: readonly (readonly [string, StructuredCardDefinition])[];
  readonly state: MatchState;
}

export function CyberpunkTestStatePage() {
  const loadState = useTestSimulatorState<CyberpunkTestStatePayload>("cyberpunk");

  const engineBuilder = useMemo(() => {
    if (loadState.status !== "ready") {
      return undefined;
    }
    const { catalog, state } = loadState.envelope.payload;
    return () => {
      setCardRegistry(cyberpunkCatalogFromEntries(catalog));
      return CyberpunkTestEngine.fromState(structuredClone(state), { autoGainGig: false });
    };
  }, [loadState]);

  if (loadState.status === "loading") {
    return <TestStateRouteStatus title="Loading state" message="Preparing Cyberpunk board." />;
  }
  if (loadState.status === "error") {
    return <TestStateRouteStatus title="State unavailable" message={loadState.message} />;
  }

  return (
    <BoardSharedPage
      initialEngineBuilder={engineBuilder}
      initialHumanSide={cyberpunkViewerToSide(loadState.envelope.viewer)}
      autoResolveSingletonCardTargets={false}
      lockLocalResetControls
    />
  );
}

function cyberpunkViewerToSide(viewer: string | undefined): Side {
  return viewer === String(PLAYER_SIDE_TO_ID.opponent) ? "opponent" : "player";
}

function cyberpunkCatalogFromEntries(
  entries: readonly (readonly [string, StructuredCardDefinition])[],
): CardCatalog {
  const map = new Map(entries);
  return {
    get(definitionId: string) {
      return map.get(definitionId);
    },
    *entries() {
      for (const entry of map.entries()) {
        yield entry;
      }
    },
    get size() {
      return map.size;
    },
  };
}
