import type { FilteredAbilityHint } from "../../view/ability-hints.ts";
import type { FilteredCardView, FilteredMatchView } from "../../view/filter.ts";
import { abilityHintCanResolveInPlan } from "./ability-value.ts";
import { gigConditionSatisfied, isGigCondition } from "./gig-conditions.ts";

/** Value of visible cards whose Gig setup is already met. Hidden cards are never read. */
export function gigPlanValue(
  view: FilteredMatchView,
  playerId: string,
  gigValues?: readonly number[],
): number {
  const player = view.players[playerId];
  if (!player) return 0;
  const values = gigValues ?? listedCards(player.zones.gigArea).map((gig) => gig.effectivePower);
  const opportunities: number[] = [];

  for (const card of listedCards(player.zones.hand)) {
    opportunities.push(
      cardGigPlanValue(card, values, "hand", player.availableEddies, view, playerId),
    );
  }
  for (const card of listedCards(player.zones.field)) {
    opportunities.push(
      cardGigPlanValue(card, values, "field", player.availableEddies, view, playerId),
    );
  }
  for (const card of listedCards(player.zones.legendArea)) {
    if (!card.faceDown) {
      opportunities.push(
        cardGigPlanValue(card, values, "field", player.availableEddies, view, playerId),
      );
    }
  }

  opportunities.sort((a, b) => b - a);
  return (opportunities[0] ?? 0) + (opportunities[1] ?? 0) / 2;
}

function cardGigPlanValue(
  card: FilteredCardView,
  values: readonly number[],
  zone: "hand" | "field",
  availableEddies: number,
  view: FilteredMatchView,
  playerId: string,
): number {
  let best = 0;
  for (const hint of card.abilityHints) {
    if (zone === "hand" && hint.timing !== "play") continue;
    if (zone === "field" && hint.timing === "play") continue;
    const gigConditions = hint.conditions.filter(isGigCondition);
    if (gigConditions.length === 0) continue;
    if (!gigConditions.every((condition) => gigConditionSatisfied(condition, values, hint)))
      continue;
    if (
      !abilityHintCanResolveInPlan(hint, view, playerId, {
        gigValues: values,
        assumeOwnTiming: true,
        host: card,
      })
    ) {
      continue;
    }

    const payoff = Math.min(
      50,
      hint.roles.reduce((sum, role) => sum + roleValue(role), 0),
    );
    if (payoff === 0) continue;
    const body = card.type === "unit" ? Math.min(12, Math.max(0, card.effectivePower)) : 0;
    const affordability =
      zone === "hand" && (card.effectiveCost ?? card.cost ?? 0) > availableEddies ? 0.5 : 1;
    const timing = zone === "field" && card.hasLag && hint.timing === "attack" ? 0.5 : 1;
    best = Math.max(best, (payoff + body) * affordability * timing);
  }
  return best;
}

function roleValue(role: FilteredAbilityHint["roles"][number]): number {
  // This is the stable potential payoff magnitude for changing Gig values.
  // ability-value.ts separately scores immediate board fit and game stage.
  switch (role) {
    case "boardControl":
    case "gigPressure":
      return 30;
    case "cardAdvantage":
    case "development":
      return 22;
    case "combat":
    case "economy":
    case "protection":
      return 15;
    case "disruption":
    case "gigManipulation":
    case "setup":
      return 12;
  }
}

function listedCards(zone: FilteredCardView[] | number | undefined): FilteredCardView[] {
  return Array.isArray(zone) ? zone : [];
}
