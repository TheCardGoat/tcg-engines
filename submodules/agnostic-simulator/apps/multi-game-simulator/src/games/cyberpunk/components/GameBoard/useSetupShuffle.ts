import { useEffect, useRef, useState } from "react";
import { useEngineOptional } from "../../engine";

/** Show the prepared shuffle when a hosted game mounts or a local chooser decides. */
export function useSetupShuffle(animateLocalChoice = true): boolean {
  const engine = useEngineOptional();
  const state = engine?.matchState;
  const pending = state?.G.turnMetadata.pendingChoice?.type === "chooseFirstPlayer";
  const inSetup = state?.G.gamePhase === "setup";
  const previousPending = useRef(pending);
  const hadState = useRef(Boolean(state));
  const [active, setActive] = useState(() => Boolean(inSetup && !pending));

  useEffect(() => {
    if (
      ((animateLocalChoice && previousPending.current) || (!hadState.current && state)) &&
      !pending &&
      inSetup
    )
      setActive(true);
    previousPending.current = pending;
    hadState.current = Boolean(state);
  }, [animateLocalChoice, inSetup, pending, state]);

  useEffect(() => {
    if (!active) return;
    const timeout = window.setTimeout(() => setActive(false), 900);
    return () => window.clearTimeout(timeout);
  }, [active]);

  return active;
}
