import type { LifecycleContext } from "../../../types/index.ts";
import type { GundamG } from "../../types.ts";
import { logPhaseEntered } from "../../logging.ts";
import { getEffectiveStats } from "../../rules/derived-state.ts";

/**
 * Returns the set of card instance IDs that have a `prevent-active`
 * restriction via a `until-start-of-next-turn` continuous effect.
 */
function getPreventActiveIds(g: GundamG): Set<string> {
  const ids = new Set<string>();
  for (const effect of g.continuousEffects) {
    if (
      effect.payload.kind === "restriction" &&
      effect.payload.restriction === "prevent-active" &&
      effect.duration === "until-start-of-next-turn"
    ) {
      ids.add(effect.targetId);
    }
  }
  return ids;
}

export function startPhaseActiveStep(ctx: LifecycleContext): void {
  logPhaseEntered(ctx.framework, { phase: "start-phase", step: "active-step" });

  const turnPlayer = ctx.framework.state.status.turnPlayer as string | undefined;
  if (!turnPlayer) return;
  const g = ctx.G as GundamG;

  // Cards with a prevent-active restriction skip the active-setting step.
  const preventedIds = getPreventActiveIds(g);

  const battlefield = ctx.framework.zones.getCards({ zone: "battleArea", playerId: turnPlayer });
  for (const cardId of battlefield) {
    const prevented =
      preventedIds.has(cardId) ||
      getEffectiveStats(cardId, g, ctx.framework.cards, ctx.framework).restrictions.includes(
        "cannot-set-active",
      );
    if (!prevented) {
      g.exhausted[cardId] = false;
    }
    ctx.framework.cards.patchMeta(cardId, {
      exhausted: prevented ? true : false,
      deployedThisTurn: false,
      attackedThisTurn: false,
      abilityUsesThisTurn: {},
      triggerUsesThisTurn: {},
    });
  }

  const baseCards = ctx.framework.zones.getCards({ zone: "baseSection", playerId: turnPlayer });
  for (const cardId of baseCards) {
    const prevented = preventedIds.has(cardId);
    if (!prevented) {
      g.exhausted[cardId] = false;
    }
    ctx.framework.cards.patchMeta(cardId, {
      exhausted: prevented ? true : false,
      deployedThisTurn: false,
      attackedThisTurn: false,
      abilityUsesThisTurn: {},
      triggerUsesThisTurn: {},
    });
  }

  const resourceCards = ctx.framework.zones.getCards({
    zone: "resourceArea",
    playerId: turnPlayer,
  });
  for (const cardId of resourceCards) {
    g.exhausted[cardId] = false;
    // Keep the cardMeta mirror in sync. `exhaustResources` writes both
    // (see play-card-shared.ts) when a card exhausts; the projection
    // reads `meta.exhausted` (multi-game-simulator/src/games/gundam/.../mappers.ts
    // `countActiveResources`), so skipping `patchMeta` here leaves the
    // UI showing resources as still-exhausted on turn 2 even though
    // `g.exhausted` was cleared — an invisible-to-the-engine bug that
    // only multi-turn specs surface.
    ctx.framework.cards.patchMeta(cardId, { exhausted: false });
  }

  // Clean up until-start-of-next-turn effects after the active step has
  // processed them. These effects are one-shot: they prevent active-setting
  // once, then expire.
  g.continuousEffects = g.continuousEffects.filter(
    (e) => e.duration !== "until-start-of-next-turn",
  );
}
