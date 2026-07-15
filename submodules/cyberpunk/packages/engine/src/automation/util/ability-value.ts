import type { FilteredAbilityHint, AbilityRequirementHint } from "../../view/ability-hints.ts";
import type { FilteredCardView, FilteredMatchView } from "../../view/filter.ts";

export type AbilityGameStage = "early" | "mid" | "late";

interface BoardSnapshot {
  stage: AbilityGameStage;
  ownBoard: FilteredCardView[];
  rivalBoard: FilteredCardView[];
  ownGigs: FilteredCardView[];
  rivalGigs: FilteredCardView[];
  ownTrashCount: number;
  ownFaceDownLegendCount: number;
  rivalHandSize: number;
  rivalReadyPower: number;
  attackInProgress: boolean;
}

export function getAbilityGameStage(view: FilteredMatchView): AbilityGameStage {
  const leadingGigCount = Math.max(
    0,
    ...Object.values(view.players).map((player) => player.gigCount),
  );
  if (leadingGigCount >= 5 || view.turnNumber >= 10) return "late";
  if (leadingGigCount <= 3 && view.turnNumber <= 5) return "early";
  return "mid";
}

/** Score the deployment timing and board fit of every visible ability on a card in hand. */
export function scoreCardAbilitiesForPlay(
  card: FilteredCardView,
  view: FilteredMatchView,
  playerId: string,
  options: { attachToId?: string } = {},
): number {
  const board = snapshot(view, playerId);
  const host = options.attachToId ? findCard(view, options.attachToId) : null;
  let score = 0;
  for (const hint of card.abilityHints) {
    if (hint.timing === "keyword" || hint.roles.length === 0) continue;
    const roleValue = scoreRoles(hint, board);
    const conditionFactor = conditionSupport(hint, board, host);
    const requirementsReady = requirementsSatisfied(hint.requirements, board);

    if (hint.timing === "play") {
      if (requirementsReady) score += roleValue * conditionFactor;
      else score += roleValue * 0.1 - (card.type === "program" ? 18 : 4);

      if (hint.reactive && !board.attackInProgress) {
        score -= card.type === "program" ? 22 : 5;
      } else if (hint.reactive && board.attackInProgress) {
        score += 14;
      }
      continue;
    }

    const horizon = board.stage === "early" ? 1.45 : board.stage === "mid" ? 1 : 0.55;
    const futureRequirements = requirementsReady ? 1 : 0.7;
    const futureConditionFactor =
      hint.requiredHostNames.length > 0 ? conditionFactor : Math.max(0.7, conditionFactor);
    score += (roleValue * 0.85 + 4) * horizon * futureRequirements * futureConditionFactor;
  }
  return Math.round(score);
}

/** Public board-fit score for choosing between currently legal activated abilities. */
export function scoreActivatedAbility(
  card: FilteredCardView | null,
  abilityIndex: number,
  view: FilteredMatchView,
  playerId: string,
): number {
  const hint = card?.abilityHints.find((candidate) => candidate.abilityIndex === abilityIndex);
  if (!hint) return 0;
  const board = snapshot(view, playerId);
  const host = card?.attachedToId ? findCard(view, card.attachedToId) : null;
  const requirements = requirementsSatisfied(hint.requirements, board) ? 1 : 0.25;
  return Math.min(
    40,
    Math.round(scoreRoles(hint, board) * requirements * conditionSupport(hint, board, host)),
  );
}

function scoreRoles(hint: FilteredAbilityHint, board: BoardSnapshot): number {
  return hint.roles.reduce((total, role) => {
    switch (role) {
      case "cardAdvantage":
        return total + stageValue(board.stage, 16, 12, 7);
      case "economy":
        return total + stageValue(board.stage, 18, 10, 4);
      case "setup":
        return total + stageValue(board.stage, 14, 9, 3);
      case "development":
        return total + stageValue(board.stage, 14, 10, 6);
      case "boardControl":
        return total + 4 + Math.min(20, board.rivalBoard.length * 5) + lateBonus(board, 5);
      case "combat":
        return (
          total +
          3 +
          Math.min(12, board.ownBoard.length * 3) +
          Math.min(8, board.rivalBoard.length * 2) +
          lateBonus(board, 8)
        );
      case "disruption":
        return total + 4 + Math.min(14, board.rivalHandSize * 2) + lateBonus(board, 3);
      case "gigManipulation":
        return total + 4 + Math.min(16, board.ownGigs.length * 3);
      case "gigPressure":
        return total + (board.rivalGigs.length === 0 ? 0 : stageValue(board.stage, 5, 14, 30));
      case "protection":
        return total + 4 + Math.min(20, Math.ceil(board.rivalReadyPower / 3));
    }
  }, 0);
}

function conditionSupport(
  hint: FilteredAbilityHint,
  board: BoardSnapshot,
  host: FilteredCardView | null,
): number {
  let factor = 1;
  for (const condition of hint.conditions) {
    let supported: boolean | null = null;
    if (condition === "hasGigPair") supported = hasGigPair(board.ownGigs);
    else if (condition === "hasDistinctGigValues") {
      supported = distinctGigValues(board.ownGigs) >= conditionMinimum(hint, condition, 2);
    } else if (condition === "hasMinGig") supported = board.ownGigs.some((gig) => gig.power === 1);
    else if (condition === "hasEvenAndOddGigValues") supported = hasEvenAndOdd(board.ownGigs);
    else if (condition === "hasEquippedUnitsOrLegends") {
      supported =
        board.ownBoard.filter((card) => card.attachedGearIds.length > 0).length >=
        conditionMinimum(hint, condition, 1);
    } else if (condition === "allFriendlyLegendsFaceUp") {
      supported = board.ownFaceDownLegendCount === 0;
    } else if (condition === "attacking" || condition === "fightKind") {
      supported = board.attackInProgress;
    } else if (condition === "cardName" && hint.requiredHostNames.length > 0) {
      supported = host !== null && hint.requiredHostNames.includes(host.cardName ?? "");
    } else if (condition === "targetExists") {
      supported = requirementsSatisfied(hint.requirements, board);
    }
    if (supported === false) factor *= 0.1;
    else if (supported === null) factor *= 0.85;
  }
  return factor;
}

function conditionMinimum(hint: FilteredAbilityHint, condition: string, fallback: number): number {
  return hint.conditionThresholds.reduce(
    (minimum, threshold) =>
      threshold.condition === condition ? Math.max(minimum, threshold.minCount) : minimum,
    fallback,
  );
}

function requirementsSatisfied(
  requirements: AbilityRequirementHint[],
  board: BoardSnapshot,
): boolean {
  return requirements.every((requirement) => {
    switch (requirement) {
      case "attackContext":
        return board.attackInProgress;
      case "equippedBoard":
        return board.ownBoard.some((card) => card.attachedGearIds.length > 0);
      case "friendlyBoard":
        return board.ownBoard.length > 0;
      case "friendlyGig":
        return board.ownGigs.length > 0;
      case "friendlyTrash":
        return board.ownTrashCount > 0;
      case "rivalBoard":
        return board.rivalBoard.length > 0;
      case "rivalGig":
        return board.rivalGigs.length > 0;
    }
  });
}

function snapshot(view: FilteredMatchView, playerId: string): BoardSnapshot {
  const own = view.players[playerId];
  const rivals = Object.entries(view.players).filter(([id]) => id !== playerId);
  const rivalBoards = rivals.flatMap(([, player]) => visibleBoard(player));
  return {
    stage: getAbilityGameStage(view),
    ownBoard: own ? visibleBoard(own) : [],
    rivalBoard: rivalBoards,
    ownGigs: own ? zoneCards(own.zones.gigArea) : [],
    rivalGigs: rivals.flatMap(([, player]) => zoneCards(player.zones.gigArea)),
    ownTrashCount: own ? zoneCount(own.zones.trash) : 0,
    ownFaceDownLegendCount: own
      ? zoneCards(own.zones.legendArea).filter((card) => card.faceDown).length
      : 0,
    rivalHandSize: rivals.reduce((total, [, player]) => total + zoneCount(player.zones.hand), 0),
    rivalReadyPower: rivalBoards.reduce(
      (total, card) =>
        total + (!card.spent && card.type === "unit" ? Math.max(0, card.effectivePower) : 0),
      0,
    ),
    attackInProgress: view.attackState !== null,
  };
}

function visibleBoard(player: FilteredMatchView["players"][string]): FilteredCardView[] {
  return [
    ...zoneCards(player.zones.field),
    ...zoneCards(player.zones.legendArea).filter((card) => !card.faceDown),
  ];
}

function hasGigPair(gigs: FilteredCardView[]): boolean {
  return new Set(gigs.map((gig) => gig.power)).size < gigs.length;
}

function distinctGigValues(gigs: FilteredCardView[]): number {
  return new Set(gigs.map((gig) => gig.power)).size;
}

function hasEvenAndOdd(gigs: FilteredCardView[]): boolean {
  return gigs.some((gig) => gig.power % 2 === 0) && gigs.some((gig) => gig.power % 2 !== 0);
}

function stageValue(stage: AbilityGameStage, early: number, mid: number, late: number): number {
  return stage === "early" ? early : stage === "mid" ? mid : late;
}

function lateBonus(board: BoardSnapshot, amount: number): number {
  return board.stage === "late" ? amount : 0;
}

function zoneCards(zone: FilteredCardView[] | number | undefined): FilteredCardView[] {
  return Array.isArray(zone) ? zone : [];
}

function zoneCount(zone: FilteredCardView[] | number | undefined): number {
  return Array.isArray(zone) ? zone.length : (zone ?? 0);
}

function findCard(view: FilteredMatchView, instanceId: string): FilteredCardView | null {
  for (const player of Object.values(view.players)) {
    for (const zone of Object.values(player.zones)) {
      if (!Array.isArray(zone)) continue;
      const card = zone.find((candidate) => candidate.instanceId === instanceId);
      if (card) return card;
    }
  }
  return null;
}
