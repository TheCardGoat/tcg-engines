import type { CardInstanceId, PlayerId } from "#core";
import type { LorcanaProjectedBoardView } from "../types";
import {
  type AutomatedActionCardTargetPreference,
  type RoleWeightMap,
  getAutomatedActionCardTargetPreference,
} from "./deck-profile";
import type { EffectPolarity } from "./effect-polarity";
import type {
  AutomatedActionCandidate,
  AutomatedActionDeckRoleTag,
  AutomatedActionFamily,
  AutomatedActionTargetId,
} from "./types";

type Contribution = {
  key: string;
  value: number;
};

export type AutomatedActionTargetPriorityContext = {
  actorId: PlayerId;
  board: LorcanaProjectedBoardView;
  getCardDefinition(cardId: CardInstanceId): { id: string } | undefined;
  getCardRoles(cardId: CardInstanceId): readonly AutomatedActionDeckRoleTag[];
  opponentId?: PlayerId;
};

function getProjectedCard(board: LorcanaProjectedBoardView, cardId: CardInstanceId) {
  return board.cards[String(cardId)];
}

function mergeRoleWeights(...weights: Array<RoleWeightMap | undefined>): RoleWeightMap {
  const merged: Partial<Record<AutomatedActionDeckRoleTag, number>> = {};

  for (const current of weights) {
    if (!current) {
      continue;
    }

    for (const [role, value] of Object.entries(current)) {
      if (typeof value !== "number") {
        continue;
      }

      const resolvedRole = role as AutomatedActionDeckRoleTag;
      merged[resolvedRole] = (merged[resolvedRole] ?? 0) + value;
    }
  }

  return merged;
}

export function mergeTargetPreferences(
  left: AutomatedActionCardTargetPreference | undefined,
  right: AutomatedActionCardTargetPreference | undefined,
): AutomatedActionCardTargetPreference | undefined {
  if (!left) {
    return right;
  }

  if (!right) {
    return left;
  }

  return {
    actorPlayerScore: (left.actorPlayerScore ?? 0) + (right.actorPlayerScore ?? 0),
    alliedRoleWeights: mergeRoleWeights(left.alliedRoleWeights, right.alliedRoleWeights),
    beneficialAlliedScore: (left.beneficialAlliedScore ?? 0) + (right.beneficialAlliedScore ?? 0),
    beneficialOpposingPenalty:
      (left.beneficialOpposingPenalty ?? 0) + (right.beneficialOpposingPenalty ?? 0),
    damagedAlliedScore: (left.damagedAlliedScore ?? 0) + (right.damagedAlliedScore ?? 0),
    damagedOpposingScore: (left.damagedOpposingScore ?? 0) + (right.damagedOpposingScore ?? 0),
    exertedOpposingScore: (left.exertedOpposingScore ?? 0) + (right.exertedOpposingScore ?? 0),
    harmfulAlliedPenalty: (left.harmfulAlliedPenalty ?? 0) + (right.harmfulAlliedPenalty ?? 0),
    harmfulOpposingScore: (left.harmfulOpposingScore ?? 0) + (right.harmfulOpposingScore ?? 0),
    highLoreOpposingMultiplier:
      (left.highLoreOpposingMultiplier ?? 0) + (right.highLoreOpposingMultiplier ?? 0),
    lowStrengthOpposingScore:
      (left.lowStrengthOpposingScore ?? 0) + (right.lowStrengthOpposingScore ?? 0),
    opposingRoleWeights: mergeRoleWeights(left.opposingRoleWeights, right.opposingRoleWeights),
    opponentPlayerScore: (left.opponentPlayerScore ?? 0) + (right.opponentPlayerScore ?? 0),
  };
}

function scoreDefinitionRoles(args: {
  context: AutomatedActionTargetPriorityContext;
  roles: readonly AutomatedActionDeckRoleTag[];
  targetId: CardInstanceId;
  weights: RoleWeightMap;
}): {
  contributors: Contribution[];
  score: number;
} {
  if (args.roles.length === 0) {
    return {
      contributors: [],
      score: 0,
    };
  }

  const definitionId = args.context.getCardDefinition(args.targetId)?.id;
  const override = definitionId ? getAutomatedActionCardTargetPreference(definitionId) : undefined;
  const contributors: Contribution[] = [];
  let score = 0;

  for (const role of args.roles) {
    const contribution = args.weights[role] ?? 0;
    if (contribution === 0) {
      continue;
    }

    contributors.push({
      key: role,
      value: contribution,
    });
    score += contribution;
  }

  return {
    contributors,
    score: score + (override?.actorPlayerScore ?? 0) * 0,
  };
}

function getGenericTargetPreference(
  candidateFamily: AutomatedActionCandidate["family"],
  sourceRoles: readonly AutomatedActionDeckRoleTag[],
): AutomatedActionCardTargetPreference | undefined {
  const prefersThreatRemoval =
    candidateFamily === "challenge" ||
    sourceRoles.includes("removal") ||
    sourceRoles.includes("sweeper");

  if (!prefersThreatRemoval) {
    return undefined;
  }

  return {
    exertedOpposingScore: candidateFamily === "challenge" ? 2 : 1,
    highLoreOpposingMultiplier: candidateFamily === "challenge" ? 2 : 1,
    lowStrengthOpposingScore: candidateFamily === "challenge" ? 0 : 1,
    opposingRoleWeights: {
      drawEngine: 2,
      evasiveThreat: 3,
      mustAnswerThreat: 4,
      synergyAnchor: 2,
      tempoThreat: 3,
    },
  };
}

function getEffectPolarityPreference(
  polarity: EffectPolarity | undefined,
): AutomatedActionCardTargetPreference | undefined {
  if (!polarity || polarity === "mixed" || polarity === "neutral") {
    return undefined;
  }

  if (polarity === "beneficial") {
    return {
      alliedRoleWeights: {
        drawEngine: 2,
        evasiveThreat: 2,
        mustAnswerThreat: 2,
        synergyAnchor: 2,
        tempoThreat: 3,
      },
      beneficialOpposingPenalty: -10,
    };
  }

  return {
    harmfulAlliedPenalty: -10,
    harmfulOpposingScore: 2,
    opposingRoleWeights: {
      drawEngine: 2,
      evasiveThreat: 3,
      mustAnswerThreat: 4,
      synergyAnchor: 2,
      tempoThreat: 3,
    },
  };
}

export function scoreAutomatedActionTarget(args: {
  context: AutomatedActionTargetPriorityContext;
  effectPolarity?: EffectPolarity;
  preference: AutomatedActionCardTargetPreference;
  targetId: CardInstanceId | PlayerId;
}): {
  contributors: Contribution[];
  score: number;
} {
  const { context, effectPolarity, preference, targetId } = args;
  const contributors: Contribution[] = [];

  if (targetId === context.actorId) {
    if ((preference.actorPlayerScore ?? 0) !== 0) {
      contributors.push({
        key: "targetActor",
        value: preference.actorPlayerScore ?? 0,
      });
    }

    return {
      contributors,
      score: contributors.reduce((total, entry) => total + entry.value, 0),
    };
  }

  if (targetId === context.opponentId) {
    if ((preference.opponentPlayerScore ?? 0) !== 0) {
      contributors.push({
        key: "targetOpponent",
        value: preference.opponentPlayerScore ?? 0,
      });
    }

    return {
      contributors,
      score: contributors.reduce((total, entry) => total + entry.value, 0),
    };
  }

  const cardId = targetId as CardInstanceId;
  const card = getProjectedCard(context.board, cardId);
  if (!card) {
    return {
      contributors: [],
      score: 0,
    };
  }

  const controllerId = card.controllerId ?? card.ownerId;
  const alliedTarget = controllerId === context.actorId;
  const roleWeights = alliedTarget ? preference.alliedRoleWeights : preference.opposingRoleWeights;
  const roleScore = scoreDefinitionRoles({
    context,
    roles: context.getCardRoles(cardId),
    targetId: cardId,
    weights: roleWeights ?? {},
  });
  contributors.push(
    ...roleScore.contributors.map((entry) => ({
      key: alliedTarget ? `ally:${entry.key}` : `opponent:${entry.key}`,
      value: entry.value,
    })),
  );

  if (alliedTarget) {
    if ((card.damage ?? 0) > 0 && (preference.damagedAlliedScore ?? 0) !== 0) {
      contributors.push({
        key: "damagedAlly",
        value: preference.damagedAlliedScore ?? 0,
      });
    }

    if (effectPolarity === "beneficial" && (preference.beneficialAlliedScore ?? 0) !== 0) {
      contributors.push({
        key: "polarity:beneficialAlly",
        value: preference.beneficialAlliedScore ?? 0,
      });
    }

    if (effectPolarity === "harmful" && (preference.harmfulAlliedPenalty ?? 0) !== 0) {
      contributors.push({
        key: "polarity:harmfulAlly",
        value: preference.harmfulAlliedPenalty ?? 0,
      });
    }
  } else {
    if ((card.damage ?? 0) > 0 && (preference.damagedOpposingScore ?? 0) !== 0) {
      contributors.push({
        key: "damagedOpponent",
        value: preference.damagedOpposingScore ?? 0,
      });
    }

    if (card.exerted === true && (preference.exertedOpposingScore ?? 0) !== 0) {
      contributors.push({
        key: "exertedOpponent",
        value: preference.exertedOpposingScore ?? 0,
      });
    }

    const loreContribution = (card.lore ?? 0) * (preference.highLoreOpposingMultiplier ?? 0);
    if (loreContribution !== 0) {
      contributors.push({
        key: "opponentLore",
        value: loreContribution,
      });
    }

    if ((card.strength ?? 0) <= 2 && (preference.lowStrengthOpposingScore ?? 0) !== 0) {
      contributors.push({
        key: "lowStrengthOpponent",
        value: preference.lowStrengthOpposingScore ?? 0,
      });
    }

    if (effectPolarity === "beneficial" && (preference.beneficialOpposingPenalty ?? 0) !== 0) {
      contributors.push({
        key: "polarity:beneficialOpponent",
        value: preference.beneficialOpposingPenalty ?? 0,
      });
    }

    if (effectPolarity === "harmful" && (preference.harmfulOpposingScore ?? 0) !== 0) {
      contributors.push({
        key: "polarity:harmfulOpponent",
        value: preference.harmfulOpposingScore ?? 0,
      });
    }
  }

  return {
    contributors,
    score: contributors.reduce((total, entry) => total + entry.value, 0),
  };
}

export function scoreAutomatedActionTargets(args: {
  additionalPreference?: AutomatedActionCardTargetPreference;
  context: AutomatedActionTargetPriorityContext;
  effectPolarity?: EffectPolarity;
  family: AutomatedActionFamily;
  sourceDefinitionId?: string;
  sourceRoles: readonly AutomatedActionDeckRoleTag[];
  targets: readonly AutomatedActionTargetId[];
}): {
  contributors: Contribution[];
  score: number;
} {
  const cardPreference = args.sourceDefinitionId
    ? getAutomatedActionCardTargetPreference(args.sourceDefinitionId)
    : undefined;
  const polarityPreference = getEffectPolarityPreference(args.effectPolarity);
  const preference = mergeTargetPreferences(
    mergeTargetPreferences(
      mergeTargetPreferences(
        getGenericTargetPreference(args.family, args.sourceRoles),
        cardPreference,
      ),
      args.additionalPreference,
    ),
    polarityPreference,
  );

  if (!preference) {
    return {
      contributors: [],
      score: 0,
    };
  }

  const contributors: Contribution[] = [];
  let score = 0;

  for (const targetId of args.targets) {
    const targetScore = scoreAutomatedActionTarget({
      context: args.context,
      effectPolarity: args.effectPolarity,
      preference,
      targetId,
    });
    contributors.push(...targetScore.contributors);
    score += targetScore.score;
  }

  return {
    contributors,
    score,
  };
}
