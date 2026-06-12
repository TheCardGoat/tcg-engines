import { createProjectionState, type DerivedStateContext } from "../rules/derived-state";
import type { StaticEffectRegistry } from "../rules/static-effect-registry";
import {
  getOrBuildMoveRegistry,
  type MoveRegistryCtx,
} from "../runtime-moves/rules/move-registry-cache";

export type StaticContexts = {
  registry: StaticEffectRegistry;
  projectionState: ReturnType<typeof createProjectionState>;
};

/**
 * Co-initializes the static effect registry and the projection state from a
 * runtime move ctx. These two values are always paired at every static
 * restriction / projection-driven validation point.
 */
export function buildStaticContexts(
  ctx: MoveRegistryCtx & { G: DerivedStateContext["G"] },
): StaticContexts {
  const registry = getOrBuildMoveRegistry(ctx);
  const projectionState = createProjectionState(ctx.framework.state, ctx.G);
  return { registry, projectionState };
}
