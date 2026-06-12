import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { rafikiEtherealGuide } from "@tcg/lorcana-cards/cards/006";

describe("THE CIRCLE OF LIFE - Rafiki, Ethereal Guide - During your turn, whenever a card is put into your inkwell, you may draw a card.", () => {
  // Test cases to cover:
  // 1. Triggers each time a card is put into your inkwell during your turn
  // 2. Does NOT trigger when opponent puts a card into their inkwell (on: YOU)
  // 3. Does NOT trigger during opponent's turn when you ink (during-your-turn restriction)
  // 4. Trigger is optional ("you may") — player can decline the draw
  // 5. Fires once per ink action (inking one card = one trigger)
  // 6. Trigger fires even if the inked card had an effect on entry

  it.todo("It should trigger when you put a card into your inkwell during your turn", () => {});
});
