import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07Atlas098,
  op07HePossessesTheWorldSMostBrilliantMind114,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP07-114 He Possesses the World's Most Brilliant Mind", () => {
  test("Main searches included Egghead cards, excludes itself, and orders the remainder", () => {
    const deck = [
      op07Atlas098,
      op07HePossessesTheWorldSMostBrilliantMind114,
      eb01Doma005,
      eb01Fourtricks025,
      eb01MountainGod018,
    ];
    const engine = OnePieceTestEngine.create({
      hand: [op07HePossessesTheWorldSMostBrilliantMind114],
      deck,
      activeDon: 1,
    });
    const selectedId = engine.findCardInZone("south", "deck", op07Atlas098);
    const excludedId = engine.findCardInZone(
      "south",
      "deck",
      op07HePossessesTheWorldSMostBrilliantMind114,
    );
    const initial = [...engine.getState().players.south.deck];
    engine.playCard(op07HePossessesTheWorldSMostBrilliantMind114);
    const step = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected Egghead search.");
    expect(step.candidates.find((c) => c.ref.id === selectedId)?.legal).toBe(true);
    expect(step.candidates.find((c) => c.ref.id === excludedId)?.legal).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: initial.filter((id) => id !== selectedId) },
      "south",
    );
    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Life Trigger draws 1 without Main payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op07HePossessesTheWorldSMostBrilliantMind114],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attacker = engine.findCardInZone("south", "character", eb01MountainGod018);
    const drawId = engine.findCardInZone("north", "deck", eb01Doma005);
    engine.declareAttack(attacker, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    expect(engine.getView("north").players.north.hand.map((c) => c.instanceId)).toContain(drawId);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
