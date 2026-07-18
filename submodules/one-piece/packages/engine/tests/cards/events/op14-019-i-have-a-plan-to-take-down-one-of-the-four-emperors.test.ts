import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Caribou007,
  op13SunnyKun026,
  op14eb04IHaveAPlanToTakeDownOneOfTheFourEmperors019,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-019 I Have a Plan to Take Down One of the Four Emperors!!", () => {
  test("Main accepts either a Supernovas or Straw Hat Crew Character and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04IHaveAPlanToTakeDownOneOfTheFourEmperors019],
      deck: [op01Caribou007, op13SunnyKun026, eb01Doma005, eb01MountainGod018],
      activeDon: 4,
    });
    const supernovasId = engine.findCardInZone("south", "deck", op01Caribou007);
    const strawHatId = engine.findCardInZone("south", "deck", op13SunnyKun026);
    const initialDeck = [...engine.getState().players.south.deck];
    engine.playCard(op14eb04IHaveAPlanToTakeDownOneOfTheFourEmperors019);
    const decision = engine.pendingDecision("effectSearchSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected a search choice.");
    expect(step.candidates.find((candidate) => candidate.ref.id === supernovasId)?.legal).toBe(
      true,
    );
    expect(step.candidates.find((candidate) => candidate.ref.id === strawHatId)?.legal).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [strawHatId] }, "south");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: initialDeck.filter((id) => id !== strawHatId) },
      "south",
    );
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      strawHatId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Life Trigger draws one without Event payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op14eb04IHaveAPlanToTakeDownOneOfTheFourEmperors019], deck: 6 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(engine.getView("north").players.north.hand).toHaveLength(1);
    expect(engine.getView("north").players.north.activeDon).toBe(0);
  });
});
