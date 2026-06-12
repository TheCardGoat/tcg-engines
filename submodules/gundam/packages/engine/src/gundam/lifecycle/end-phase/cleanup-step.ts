import type { LifecycleContext } from "../../../types/index.ts";
import type { GundamG } from "../../types.ts";
import { logPhaseEntered } from "../../logging.ts";

export function cleanupStepOnEnter(ctx: LifecycleContext): void {
  logPhaseEntered(ctx.framework, { phase: "end-phase", step: "cleanup-step" });

  const g = ctx.G as GundamG;
  g.continuousEffects = g.continuousEffects.filter(
    (e) => e.duration !== "this-turn" && e.duration !== "this-battle",
  );
  g.resolvedThisTurn = [];
}
