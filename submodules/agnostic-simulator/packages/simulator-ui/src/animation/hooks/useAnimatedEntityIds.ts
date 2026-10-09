import { useLayoutEffect, useMemo, useState } from "react";
import type { CompiledAnimationStep } from "@tcg/simulator-runtime/animation";
import type { AnimationRuntimeContextValue } from "../provider/contexts";

type Playback = Pick<
  AnimationRuntimeContextValue,
  "activeTransition" | "compiledPlan" | "playbackStartedAtMs"
>;

/** Entities owned by moving visuals, released at each handoff rather than plan reflow. */
export function useAnimatedEntityIds(
  runtime: Playback | null,
  handoffAtMs: (entry: CompiledAnimationStep) => number = stepEnd,
): ReadonlySet<string> {
  const id = runtime?.activeTransition?.id;
  const phase = runtime?.activeTransition?.phase;
  const startedAtMs = runtime?.playbackStartedAtMs;
  const plan = runtime?.compiledPlan;
  const entries = useMemo(
    () =>
      (plan?.steps ?? []).flatMap((entry) => {
        const step = entry.step;
        const entityId =
          step.type === "entityTransfer" || step.type === "entityStateChange"
            ? step.entity.id
            : step.type === "effect" &&
                step.presentation === "source-card" &&
                step.source?.kind === "entity" &&
                step.sourceExitTo
              ? step.source.id
              : null;
        return entityId && entry.durationMs > 0
          ? [
              {
                entityId,
                endAtMs: Math.min(entry.endAtMs, Math.max(entry.startAtMs, handoffAtMs(entry))),
              },
            ]
          : [];
      }),
    [plan, handoffAtMs],
  );
  const [clock, setClock] = useState<{
    id: string;
    startedAtMs: number | undefined;
    elapsedMs: number;
  } | null>(null);
  useLayoutEffect(() => {
    if (!id || phase !== "running") return;
    const elapsed = Math.max(0, performance.now() - (startedAtMs ?? performance.now()));
    const timers = [...new Set(entries.map((entry) => entry.endAtMs))]
      .filter((endAtMs) => endAtMs > elapsed)
      .map((endAtMs) =>
        window.setTimeout(
          () => setClock({ id, startedAtMs, elapsedMs: endAtMs }),
          endAtMs - elapsed,
        ),
      );
    return () => timers.forEach(window.clearTimeout);
  }, [id, phase, startedAtMs, entries]);

  if (!id || (phase !== "preparing" && phase !== "running")) return new Set();
  const elapsed =
    phase === "preparing"
      ? 0
      : Math.max(
          0,
          performance.now() - (startedAtMs ?? performance.now()),
          clock?.id === id && clock.startedAtMs === startedAtMs ? clock.elapsedMs : 0,
        );
  return new Set(entries.filter((entry) => entry.endAtMs > elapsed).map((entry) => entry.entityId));
}

function stepEnd(entry: CompiledAnimationStep): number {
  return entry.endAtMs;
}
