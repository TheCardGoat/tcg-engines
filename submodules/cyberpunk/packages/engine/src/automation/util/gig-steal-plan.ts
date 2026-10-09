import type { CardColor } from "@tcg/cyberpunk-types";
import type { FilteredCardView, FilteredMatchView } from "../../view/filter.ts";
import { gigPlanValue } from "./gig-plan.ts";

type EligibleDie = { dieId: string; faceValue: number };

/** The deck's known Legends are its stable color signal; cards in play/hand break ties. */
function ownColor(view: FilteredMatchView, playerId: string): CardColor | undefined {
  const zones = view.players[playerId]?.zones;
  if (!zones) return undefined;
  const known = (zone: string): FilteredCardView[] => {
    const cards = zones[zone];
    return Array.isArray(cards) ? cards.filter((card) => card.color != null) : [];
  };
  const legends = [
    ...known("legendArea"),
    ...known("field").filter((card) => card.type === "legend"),
    ...known("trash").filter((card) => card.type === "legend"),
    ...known("removedFromGame").filter((card) => card.type === "legend"),
  ];
  const other = [...known("hand"), ...known("field").filter((card) => card.type !== "legend")];
  const colors: CardColor[] = ["red", "blue", "green", "yellow"];
  return colors
    .map((color) => ({
      color,
      legends: legends.filter((card) => card.color === color).length,
      other: other.filter((card) => card.color === color).length,
    }))
    .filter((entry) => entry.legends + entry.other > 0)
    .sort(
      (a, b) =>
        b.legends - a.legends ||
        b.other - a.other ||
        colors.indexOf(a.color) - colors.indexOf(b.color),
    )[0]?.color;
}

function pairCount(values: readonly number[]): number {
  const counts = new Map<number, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.values()].reduce((total, count) => total + Math.floor(count / 2), 0);
}

function compareScores(a: readonly number[], b: readonly number[]): number {
  for (let index = 0; index < Math.max(a.length, b.length); index++) {
    const difference = (a[index] ?? 0) - (b[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

/** Own playable Gig setup and color shape come before damage to the rival's Street Cred. */
export function bestGigsToSteal(
  view: FilteredMatchView,
  playerId: string,
  eligibleDice: readonly EligibleDie[],
  count: number,
): string[] | null {
  if (count < 0 || eligibleDice.length < count) return null;
  const ownGigs = view.players[playerId]?.zones.gigArea;
  const ownValues = Array.isArray(ownGigs) ? ownGigs.map((gig) => gig.effectivePower) : [];
  const color = ownColor(view, playerId);
  const sorted = [...eligibleDice].sort((a, b) => a.dieId.localeCompare(b.dieId));
  let bestIds: string[] | null = null;
  let bestScore: number[] | null = null;

  const visit = (start: number, selected: EligibleDie[]): void => {
    if (selected.length === count) {
      const values = [...ownValues, ...selected.map((die) => die.faceValue)];
      const ownCred = values.reduce((total, value) => total + value, 0);
      const rivalCredLoss = selected.reduce((total, die) => total + die.faceValue, 0);
      const payoff = gigPlanValue(view, playerId, values);
      const colorScore = (() => {
        switch (color) {
          case "red":
            return [ownCred];
          case "blue":
            return [values.filter((value) => value === 1).length, -ownCred];
          case "green":
            return [pairCount(values)];
          case "yellow":
            return [new Set(values).size];
          case undefined:
            return [];
        }
      })();
      const score = [payoff, ...colorScore, rivalCredLoss];
      const ids = selected.map((die) => die.dieId);
      if (
        bestScore === null ||
        compareScores(score, bestScore) > 0 ||
        (compareScores(score, bestScore) === 0 && ids.join() < (bestIds ?? []).join())
      ) {
        bestScore = score;
        bestIds = ids;
      }
      return;
    }
    for (let index = start; index <= sorted.length - (count - selected.length); index++) {
      visit(index + 1, [...selected, sorted[index]!]);
    }
  };
  visit(0, []);
  return bestIds;
}
