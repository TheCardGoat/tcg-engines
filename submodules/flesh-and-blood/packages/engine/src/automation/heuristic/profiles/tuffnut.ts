/**
 * Tuffnut, Bumbling Hulkster profile.
 *
 * The hero instant turns the top card of the deck into resources for the
 * current turn.  That is primarily an attacking resource: use it before the
 * bot commits to its own turn.  On an opponent's turn it is deliberately
 * narrow — only spend the once-per-turn activation when it unlocks a paid
 * defensive line (a defense reaction, or Dig In's paid defend trigger).
 */
import { buildFabRulesView } from "../../../rules/state-rules-view.ts";
import type { FabBotStrategy } from "../../bot-strategies.ts";
import { rulesViewForLegalCommands } from "../../legal-commands.ts";
import { chooseCompiledLineCommand, compileTurnLine } from "../line-compiler.ts";
import { buildHeuristicSnapshot, cardByInstance } from "../snapshot.ts";
import type { FabCompiledLine, FabHeuristicSnapshot } from "../types.ts";
import { isDigIn, isTuffnut, isTuffnutHero } from "./names.ts";

const OWN_TURN_ACTIVATION_BONUS = 700;
const DEFENSIVE_ACTIVATION_BONUS = 650;
const UNNEEDED_OPPONENT_TURN_ACTIVATION = -10_000;

/**
 * Whether Tuffnut's pitch can immediately fund a defensive resource spend.
 * A deck-top pitch produces one to three resources, so a reaction is a
 * candidate only when its shortfall is at most three. Dig In is the deck's
 * defensive card with a paid defend trigger; it wants resources after it is
 * declared as a defender.
 */
export function tuffnutNeedsDefensiveResources(snapshot: FabHeuristicSnapshot): boolean {
  if (!snapshot.defending || (snapshot.remainingDamage ?? 0) <= 0) return false;
  const cards = [...snapshot.hand, ...snapshot.arsenal, ...snapshot.combatChain];
  return cards.some(
    (card) =>
      (card.isDefenseReaction &&
        card.defense > 0 &&
        card.cost > snapshot.resourcePoints &&
        card.cost <= snapshot.resourcePoints + 3) ||
      (isDigIn(card) && card.defense > 0 && snapshot.resourcePoints < 3),
  );
}

export function tuffnutAdjustScore(line: FabCompiledLine, snapshot: FabHeuristicSnapshot): number {
  if (line.kind !== "activate" || !line.playInstanceId) return 0;
  const source = cardByInstance(snapshot, line.playInstanceId);
  if (!source || !isTuffnut(source)) return 0;

  if (snapshot.isActive && !snapshot.defending) {
    return OWN_TURN_ACTIVATION_BONUS;
  }
  if (tuffnutNeedsDefensiveResources(snapshot)) return DEFENSIVE_ACTIVATION_BONUS;
  return UNNEEDED_OPPONENT_TURN_ACTIVATION;
}

export const tuffnutStrategy: FabBotStrategy = (runtime, actorId, legalCommands, context) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const line = compileTurnLine(snapshot, legalCommands, {
    onRanked: context?.onRanked,
    persona: "value-extract",
    hint: context?.ranking,
    adjustScore: tuffnutAdjustScore,
  });
  return chooseCompiledLineCommand(line, legalCommands);
};

export function tuffnutProfileApplies(snapshot: FabHeuristicSnapshot): boolean {
  return isTuffnutHero(snapshot);
}
