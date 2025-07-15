// Set 008 Action Cards Test Data
// Imported from actual card implementations

import {
  beyondTheHorizon,
  candyDrift,
  desperatePlan,
  forestDuel,
  getOut,
  headsHeldHigh,
  intoTheUnknown,
  mostEveryonesMadHere,
  nothingWeWontDo,
  onlySoMuchRoom,
  pullTheLever,
  quickShot,
  twitterpated,
  undermine,
  wrongLeverAction,
} from "@lorcanito/lorcana-engine/cards/008/actions/actions";
import type { ActionCardTestCase } from "./test-data-extractor";

/**
 * Helper function to convert a card to a test case
 */
function cardToTestCase(
  card: any,
  expectedAbilities: any[] = [],
  notes?: string,
  missingTestCase?: boolean,
): ActionCardTestCase {
  return {
    cardName: card.name,
    text: card.text,
    expectedAbilities,
    cost: card.cost,
    colors: card.colors,
    rarity: card.rarity,
    number: card.number,
    notes,
    missingTestCase,
  };
}

/**
 * Test cases for all action cards in set 008
 * Each test case contains the card text and expected ability structure
 */
export const SET008_ACTION_CARDS: ActionCardTestCase[] = [
  cardToTestCase(
    candyDrift,
    candyDrift.abilities,
    "Complex card with draw, attribute boost, and delayed triggered ability",
  ),
  cardToTestCase(
    onlySoMuchRoom,
    onlySoMuchRoom.abilities,
    "Card with conditional targeting and multiple move effects",
    true,
  ),
  cardToTestCase(
    pullTheLever,
    pullTheLever.abilities,
    "Modal effect with two different options",
  ),
  cardToTestCase(
    forestDuel,
    forestDuel.abilities,
    "Damage effect with conditional draw (conditional part not fully implemented)",
  ),
  cardToTestCase(
    intoTheUnknown,
    intoTheUnknown.abilities,
    "Scry-like effect (simplified representation)",
  ),
  cardToTestCase(
    wrongLeverAction,
    wrongLeverAction.abilities,
    "Affects all players with discard then draw",
  ),
  cardToTestCase(
    undermine,
    undermine.abilities,
    "Simple return to hand effect targeting items",
  ),
  cardToTestCase(
    nothingWeWontDo,
    nothingWeWontDo.abilities,
    "Area damage effect targeting all opposing characters",
  ),
  cardToTestCase(
    getOut,
    getOut.abilities,
    "Return to hand with additional restriction (restriction not fully implemented)",
  ),
  cardToTestCase(
    twitterpated,
    twitterpated.abilities,
    "Restriction effect preventing questing",
  ),
  cardToTestCase(
    mostEveryonesMadHere,
    mostEveryonesMadHere.abilities,
    "Affects all players with draw then discard",
  ),
  cardToTestCase(
    headsHeldHigh,
    headsHeldHigh.abilities,
    "Attribute boost affecting all own characters",
  ),
  cardToTestCase(
    desperatePlan,
    desperatePlan.abilities,
    "Sacrifice own character to draw cards",
  ),
  cardToTestCase(
    beyondTheHorizon,
    beyondTheHorizon.abilities,
    "Advanced scry effect (simplified representation)",
  ),
  cardToTestCase(
    quickShot,
    quickShot.abilities,
    "Conditional damage effect (conditional part not fully implemented)",
  ),
];

/**
 * Get test cases by card name
 */
export function getTestCaseByName(
  cardName: string,
): ActionCardTestCase | undefined {
  return SET008_ACTION_CARDS.find((card) => card.cardName === cardName);
}

/**
 * Get test cases by color
 */
export function getTestCasesByColor(color: string): ActionCardTestCase[] {
  return SET008_ACTION_CARDS.filter((card) => card.colors.includes(color));
}

/**
 * Get test cases by rarity
 */
export function getTestCasesByRarity(rarity: string): ActionCardTestCase[] {
  return SET008_ACTION_CARDS.filter((card) => card.rarity === rarity);
}

/**
 * Get test cases that are marked as missing test cases
 */
export function getMissingTestCases(): ActionCardTestCase[] {
  return SET008_ACTION_CARDS.filter((card) => card.missingTestCase);
}

/**
 * Get test cases suitable for basic parsing tests (simpler effects)
 */
export function getBasicTestCases(): ActionCardTestCase[] {
  return SET008_ACTION_CARDS.filter(
    (card) =>
      !(
        card.missingTestCase ||
        card.notes?.includes("conditional") ||
        card.notes?.includes("not fully implemented")
      ),
  );
}

/**
 * Get test cases for complex parsing tests (modal, conditional, etc.)
 */
export function getComplexTestCases(): ActionCardTestCase[] {
  return SET008_ACTION_CARDS.filter(
    (card) =>
      card.notes?.includes("Modal") ||
      card.notes?.includes("conditional") ||
      card.notes?.includes("Complex") ||
      card.expectedAbilities.some((ability) =>
        ability.effects?.some((effect) => effect.type === "modal"),
      ),
  );
}
