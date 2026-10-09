import { useEffect, useState } from "react";
import type { useOptionalAnimationRuntime } from "@tcg/simulator-ui";
import { isUnitHandPlay } from "./three-card-transfer-plan";

/** Entry choices become visible after the moving card has settled. */
export function useUnitEntryPromptPending(
  runtime: Pick<
    NonNullable<ReturnType<typeof useOptionalAnimationRuntime>>,
    "activeTransition" | "compiledPlan" | "playbackStartedAtMs"
  > | null,
): boolean {
  const [readyTransition, setReadyTransition] = useState<string | null>(null);
  const id = runtime?.activeTransition?.id;
  const phase = runtime?.activeTransition?.phase;
  const endAtMs = Math.max(
    0,
    ...(runtime?.compiledPlan?.steps ?? []).flatMap((entry) =>
      entry.step.type === "entityTransfer" && isUnitHandPlay(entry.step) ? [entry.endAtMs] : [],
    ),
  );
  const startedAtMs = runtime?.playbackStartedAtMs;
  useEffect(() => {
    if (!id || phase !== "running" || endAtMs <= 0) return;
    const remaining = endAtMs - Math.max(0, performance.now() - (startedAtMs ?? performance.now()));
    const timer = setTimeout(() => setReadyTransition(id), Math.max(0, remaining));
    return () => clearTimeout(timer);
  }, [id, phase, endAtMs, startedAtMs]);
  return Boolean(
    id && endAtMs > 0 && (phase === "preparing" || (phase === "running" && readyTransition !== id)),
  );
}
