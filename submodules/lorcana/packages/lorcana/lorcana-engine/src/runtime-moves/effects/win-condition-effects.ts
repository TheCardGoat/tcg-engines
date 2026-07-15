/**
 * Win Condition Effects
 *
 * Utilities for managing static win-condition-modification abilities.
 *
 * Cards like Donald Duck - Flustered Sorcerer have a static ability that raises
 * the lore required for opponents to win. When such a card enters or leaves play,
 * we scan all cards currently in the play zone and recompute the per-player lore
 * thresholds stored in G.loreToWin.
 *
 * Design notes:
 * - G.loreToWin is a derived projection stored in G so that endIf (which only
 *   receives MatchState) can read it without needing staticResources.
 * - We recompute fully on every play/leave rather than maintaining incremental
 *   state, to stay correct under edge cases (multiple Donalds, banish+replay).
 */

import type { Draft } from "mutative";
import type { PlayerId } from "#core";
import type { LorcanaCard } from "@tcg/lorcana-types";
import type { LorcanaG, LorcanaMatchState } from "../../types";

type WinConditionCtx = {
  G: Draft<LorcanaG>;
  framework: {
    state: {
      _zonesPrivate?: {
        cardIndex?: Record<
          string,
          { zoneKey?: string; controllerID?: string; ownerID?: string } | undefined
        >;
      };
    };
  };
  cards: {
    getDefinition: (cardId: string) => unknown;
  };
};

/**
 * Recomputes G.loreToWin by scanning all cards currently in play zones and
 * collecting their win-condition-modification static abilities.
 *
 * Should be called after any card enters or leaves play so that endIf sees
 * the up-to-date thresholds.
 */
export function recomputeLoreToWin(ctx: WinConditionCtx): void {
  const overrides: Record<PlayerId, number> = {};

  const cardIndex = ctx.framework.state._zonesPrivate?.cardIndex ?? {};

  for (const [cardId, entry] of Object.entries(cardIndex)) {
    if (!entry) continue;

    const zoneKey = entry.zoneKey ?? "";
    // Only consider cards in a play zone (e.g. "play:player_one")
    if (zoneKey !== "play" && !zoneKey.startsWith("play:")) continue;

    const controllerId = (entry.controllerID ?? entry.ownerID) as PlayerId | undefined;
    if (!controllerId) continue;

    const definition = ctx.cards.getDefinition(cardId) as Partial<LorcanaCard> | undefined;
    if (!definition?.abilities) continue;

    for (const ability of definition.abilities) {
      if (ability.type !== "static") continue;
      const effect = ability.effect as { type?: string; loreRequired?: number; target?: string };
      if (effect.type !== "win-condition-modification") continue;
      if (typeof effect.loreRequired !== "number") continue;

      // "opponent" target: raises the lore threshold for all players who are
      // NOT the controller of this card.
      if (
        effect.target === "opponent" ||
        effect.target === "OPPONENT" ||
        effect.target === "OPPONENTS" ||
        effect.target === "EACH_OPPONENT"
      ) {
        // We need to find all players that are not the controller.
        // Player IDs are available from the lore map in G.
        for (const playerId of Object.keys(ctx.G.lore) as PlayerId[]) {
          if (playerId === controllerId) continue;
          const current = overrides[playerId] ?? 20;
          // The highest override wins (multiple Donalds don't stack, rule 4.4.c)
          overrides[playerId] = Math.max(current, effect.loreRequired);
        }
      } else if (
        effect.target === "all" ||
        effect.target === "ALL_PLAYERS" ||
        effect.target === "EACH_PLAYER"
      ) {
        for (const playerId of Object.keys(ctx.G.lore) as PlayerId[]) {
          const current = overrides[playerId] ?? 20;
          overrides[playerId] = Math.max(current, effect.loreRequired);
        }
      }
    }
  }

  // Only store non-default values to keep the map lean
  const nonDefault = Object.fromEntries(
    Object.entries(overrides).filter(([, threshold]) => threshold !== 20),
  ) as Record<PlayerId, number>;

  ctx.G.loreToWin = Object.keys(nonDefault).length > 0 ? nonDefault : undefined;
}
