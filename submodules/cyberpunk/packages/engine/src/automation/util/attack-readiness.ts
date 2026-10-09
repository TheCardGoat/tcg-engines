import type { FilteredCardView } from "../../view/filter.ts";

export function isReadyFieldUnit(card: FilteredCardView): boolean {
  const fieldUnit =
    card.type === "unit" ||
    card.keywords.includes("goSolo") ||
    card.grantedRules.includes("goSolo");
  return fieldUnit && !card.faceDown && !card.spent;
}

export function canAttackThisTurn(
  card: FilteredCardView,
  hasPlayedProgramThisTurn: boolean,
): boolean {
  if (!isReadyFieldUnit(card) || card.grantedRules.includes("cantAttack")) return false;
  if (card.grantedRules.includes("requiresProgramPlayedThisTurn") && !hasPlayedProgramThisTurn) {
    return false;
  }
  return (
    !card.hasLag ||
    hasCardRule(card, "adrenaline") ||
    card.grantedRules.includes("canAttackOnPlayedTurnAgainstUnits") ||
    card.grantedRules.includes("canAttackRivalOnPlayedTurn")
  );
}

export function canAttackRivalThisTurn(
  card: FilteredCardView,
  hasPlayedProgramThisTurn: boolean,
): boolean {
  if (card.grantedRules.includes("cantAttackRival")) return false;
  if (!canAttackThisTurn(card, hasPlayedProgramThisTurn)) return false;
  return (
    !card.hasLag ||
    hasCardRule(card, "adrenaline") ||
    card.grantedRules.includes("canAttackRivalOnPlayedTurn")
  );
}

export function isReadyBlocker(card: FilteredCardView): boolean {
  return isReadyFieldUnit(card) && hasCardRule(card, "blocker");
}

export function hasCardRule(card: FilteredCardView, rule: string): boolean {
  return card.keywords.includes(rule) || card.grantedRules.includes(rule);
}
