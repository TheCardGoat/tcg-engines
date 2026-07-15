import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  loadTestSimulatorState,
  type TestSimulatorGameSlug,
  type TestStateLoadResult,
} from "./testSimulatorState.ts";

export function useTestSimulatorState<TPayload>(
  gameSlug: TestSimulatorGameSlug,
): TestStateLoadResult<TPayload> {
  const location = useLocation();
  const [loadState, setLoadState] = useState<TestStateLoadResult<TPayload>>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;
    setLoadState({ status: "loading" });
    loadTestSimulatorState<TPayload>(gameSlug, location.search)
      .then((envelope) => {
        if (!cancelled) {
          setLoadState({ status: "ready", envelope });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setLoadState({
            status: "error",
            message: error instanceof Error ? error.message : String(error),
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [gameSlug, location.search]);

  return loadState;
}
