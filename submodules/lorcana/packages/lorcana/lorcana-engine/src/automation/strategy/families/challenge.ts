import type { AutomatedActionCandidate, AutomatedActionPlanningContext } from "../../types";
import type {
  ChallengePriorityMode,
  FamilyEvaluation,
  FamilyEvaluator,
  LoreRaceHeuristicPreferences,
} from "../internal-types";
import {
  canActorReachLoreGoalByQuesting,
  getPlayerLore,
  getPrintedLore,
  getProjectedCard,
  getQuestPotentialForPlayer,
  getQuestPotentialForPlayerExcluding,
  resolveOpponentId,
} from "../common";

type ChallengeCandidate = Extract<AutomatedActionCandidate, { family: "challenge" }>;

function getCharacterBoardValue(context: AutomatedActionPlanningContext, cardId: string): number {
  const card = getProjectedCard(context, cardId);
  const lore = card?.lore ?? 0;
  const cost = card?.playCost ?? 0;
  const strength = card?.strength ?? 0;
  const willpower = card?.willpower ?? 0;
  const exertedThreatBonus = card?.exerted === true && lore > 0 ? 4 : 0;
  const futurePressureBonus = lore > 0 && card?.drying !== true ? 2 : 0;

  return lore * 5 + cost * 2 + strength + willpower + exertedThreatBonus + futurePressureBonus;
}

function getAggressiveTradeSignals(
  context: AutomatedActionPlanningContext,
  candidate: ChallengeCandidate,
): Pick<
  FamilyEvaluation["ranking"],
  | "challengeAttackerValue"
  | "challengeDefenderValue"
  | "challengeMeaningfulThreat"
  | "challengeRemovesBlocker"
  | "challengeRemovesQuestThreat"
  | "challengeTradeValueDelta"
> {
  const attackerValue = getCharacterBoardValue(context, candidate.attackerId);
  const defenderValue = getCharacterBoardValue(context, candidate.defenderId);
  const defenderCard = getProjectedCard(context, candidate.defenderId);
  const attackerCard = getProjectedCard(context, candidate.attackerId);
  const defenderLore = defenderCard?.lore ?? 0;
  const defenderCost = defenderCard?.playCost ?? 0;
  const removesQuestThreat = defenderCard?.exerted === true && defenderLore > 0;
  const removesBlocker =
    (defenderCard?.strength ?? 0) + (defenderCard?.willpower ?? 0) >=
    (attackerCard?.strength ?? 0) + (attackerCard?.willpower ?? 0);
  const attackerSurvives = candidate.preview?.attackerWouldBeBanished !== true;
  const tradeValueDelta = defenderValue - (attackerSurvives ? 0 : attackerValue);
  // Tightened from `defenderLore > 0` to `defenderLore >= 2`: a single-lore
  // defender by itself isn't enough to justify giving up the attacker's
  // quest turn — removing it denies only ~1 future opp lore, which is
  // dominated by questing now for `attackerLore` lore. Higher-lore
  // defenders, expensive bodies, and blockers still register.
  const meaningfulThreat = defenderLore >= 2 || defenderCost >= 4 || removesBlocker;

  return {
    challengeAttackerValue: attackerValue,
    challengeDefenderValue: defenderValue,
    challengeMeaningfulThreat: meaningfulThreat,
    challengeRemovesBlocker: removesBlocker,
    challengeRemovesQuestThreat: removesQuestThreat,
    challengeTradeValueDelta: tradeValueDelta,
  };
}

function shouldPrioritizeChallenge(
  context: AutomatedActionPlanningContext,
  candidate: ChallengeCandidate,
  mode: ChallengePriorityMode,
): boolean {
  const opponentId = resolveOpponentId(context);
  const defenderWouldBeBanished = candidate.preview?.defenderWouldBeBanished === true;

  if (!opponentId || !defenderWouldBeBanished || canActorReachLoreGoalByQuesting(context)) {
    return false;
  }

  const actorLore = getPlayerLore(context, context.actorId);
  const opponentLore = getPlayerLore(context, opponentId);
  const attackerLore = getPrintedLore(context, candidate.attackerId);
  const defenderLore = getPrintedLore(context, candidate.defenderId);
  const attackerSurvives = candidate.preview?.attackerWouldBeBanished !== true;
  const loreSwing = defenderLore - attackerLore + (attackerSurvives ? 1 : 0);

  if (defenderLore <= 0 && mode !== "aggressive-board-control") {
    return false;
  }

  // Anti-suicide guard: when the attacker would die and the printed-lore
  // swing is non-positive, quest with the same attacker normally dominates
  // — quest closes (or grows) the lore gap by `attackerLore` while the
  // trade leaves the gap untouched and also costs the card. Reject the
  // boost in this shape unless ALL of the following hold, signalling a
  // matchup-aware aggressive trade is legitimately on the table:
  //   - opponent is at meaningful pressure (≥10 lore), AND
  //   - the attacker is a multi-lore quester (≥2): single-lore questers
  //     suiciding for swing≤0 is always a net loss; only ≥2-lore questers
  //     get the "matchup-aware trade" benefit-of-the-doubt (matches the
  //     Daisy-into-control card rule shape).
  // True end-game (≥15) is allowed for all attacker-lore values because a
  // banish-trade then buys a critical turn — that path is left to the
  // mode-specific checks and the "last quester" guard below.
  if (
    !attackerSurvives &&
    loreSwing <= 0 &&
    attackerLore > 0 &&
    opponentLore < 15 &&
    !(attackerLore >= 2 && opponentLore >= 10)
  ) {
    return false;
  }

  if (mode === "board-control") {
    const actorQuestPotential = getQuestPotentialForPlayer(context, context.actorId);
    const opponentQuestPotential = getQuestPotentialForPlayer(context, opponentId);

    // Lore-now precedence: when the attacker would survive and would gain
    // more lore by questing than the trade yields in swing, prefer questing
    // unless the defender itself outweighs the attacker in lore (denying a
    // bigger future gain) or the opponent is at end-game pressure.
    if (
      attackerSurvives &&
      attackerLore > 0 &&
      loreSwing < attackerLore &&
      defenderLore < attackerLore &&
      opponentLore < 15
    ) {
      return false;
    }

    return (
      opponentLore >= actorLore &&
      (defenderLore >= 1 || opponentQuestPotential - actorQuestPotential >= 2)
    );
  }

  if (mode === "aggressive-board-control") {
    const aggressiveSignals = getAggressiveTradeSignals(context, candidate);
    return (
      aggressiveSignals.challengeMeaningfulThreat === true &&
      ((aggressiveSignals.challengeTradeValueDelta ?? 0) > 0 ||
        ((aggressiveSignals.challengeTradeValueDelta ?? 0) === 0 &&
          ((aggressiveSignals.challengeRemovesQuestThreat ?? false) ||
            (aggressiveSignals.challengeRemovesBlocker ?? false))) ||
        opponentLore >= actorLore)
    );
  }

  // When the attacker will be banished, check if the actor would lose all quest
  // potential. Trading away your last quest-capable character leaves you unable
  // to gain lore, so prefer questing over challenging unless the opponent is
  // about to win (15+ lore).
  if (!attackerSurvives) {
    const remainingQuestPotential = getQuestPotentialForPlayerExcluding(
      context,
      context.actorId,
      candidate.attackerId,
    );

    if (remainingQuestPotential <= 0 && opponentLore < 15) {
      return false;
    }
  }

  return (
    opponentLore >= 15 ||
    (opponentLore > actorLore && defenderLore >= 2) ||
    (opponentLore - actorLore >= 4 && loreSwing >= 1) ||
    (attackerSurvives && opponentLore >= 10 && defenderLore >= 2)
  );
}

export const evaluateChallenge: FamilyEvaluator<ChallengeCandidate> = (
  context,
  candidate,
  preferences,
): FamilyEvaluation => {
  const attackerSurvives = candidate.preview?.attackerWouldBeBanished !== true;
  const challengeAttackerLore = getPrintedLore(context, candidate.attackerId);
  const challengeDefenderLore = getPrintedLore(context, candidate.defenderId);
  const ranking: FamilyEvaluation["ranking"] = {
    challengePriorityBoost: shouldPrioritizeChallenge(
      context,
      candidate,
      preferences.challengePriorityMode,
    ),
    challengeDefenderWouldBeBanished: candidate.preview?.defenderWouldBeBanished === true,
    challengeAttackerSurvives: attackerSurvives,
    challengeAttackerLore,
    challengeDefenderLore,
    challengeLoreSwing: challengeDefenderLore - challengeAttackerLore + (attackerSurvives ? 1 : 0),
  };

  if (preferences.challengePriorityMode === "aggressive-board-control") {
    Object.assign(ranking, getAggressiveTradeSignals(context, candidate));
  }

  return { ranking };
};

export function compareChallenge(
  left: FamilyEvaluation["ranking"],
  right: FamilyEvaluation["ranking"],
  preferences: LoreRaceHeuristicPreferences,
): number {
  if ((left.challengePriorityBoost ?? false) !== (right.challengePriorityBoost ?? false)) {
    return left.challengePriorityBoost ? -1 : 1;
  }

  if (
    preferences.challengePriorityMode === "aggressive-board-control" &&
    (left.challengeMeaningfulThreat ?? false) !== (right.challengeMeaningfulThreat ?? false)
  ) {
    return left.challengeMeaningfulThreat ? -1 : 1;
  }

  if (
    (left.challengeDefenderWouldBeBanished ?? false) !==
    (right.challengeDefenderWouldBeBanished ?? false)
  ) {
    return left.challengeDefenderWouldBeBanished ? -1 : 1;
  }

  if (preferences.challengePriorityMode === "aggressive-board-control") {
    const tradeValueOrder =
      (right.challengeTradeValueDelta ?? 0) - (left.challengeTradeValueDelta ?? 0);
    if (tradeValueOrder !== 0) {
      return tradeValueOrder;
    }

    if ((left.challengeAttackerSurvives ?? false) !== (right.challengeAttackerSurvives ?? false)) {
      return left.challengeAttackerSurvives ? -1 : 1;
    }

    if (
      (left.challengeRemovesQuestThreat ?? false) !== (right.challengeRemovesQuestThreat ?? false)
    ) {
      return left.challengeRemovesQuestThreat ? -1 : 1;
    }

    if ((left.challengeRemovesBlocker ?? false) !== (right.challengeRemovesBlocker ?? false)) {
      return left.challengeRemovesBlocker ? -1 : 1;
    }
  } else {
    if ((left.challengeAttackerSurvives ?? false) !== (right.challengeAttackerSurvives ?? false)) {
      return left.challengeAttackerSurvives ? -1 : 1;
    }
  }

  const loreSwingOrder = (right.challengeLoreSwing ?? 0) - (left.challengeLoreSwing ?? 0);
  if (loreSwingOrder !== 0) {
    return loreSwingOrder;
  }

  const defenderLoreOrder = (right.challengeDefenderLore ?? 0) - (left.challengeDefenderLore ?? 0);
  if (defenderLoreOrder !== 0) {
    return defenderLoreOrder;
  }

  return (left.challengeAttackerLore ?? 0) - (right.challengeAttackerLore ?? 0);
}
