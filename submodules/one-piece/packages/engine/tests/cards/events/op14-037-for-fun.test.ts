import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op14eb04ForFun037,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-037 For Fun", () => {
  test("Main lets the controller choose three own cards to rest before K.O.ing a rested base-power-7000-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04ForFun037],
        character: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: 1,
      },
      { character: [{ card: eb01MountainGod018, rested: true }] },
    );
    const firstCost = engine.findCardInZone("south", "character", eb01Doma005);
    const secondCost = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.playCard(op14eb04ForFun037);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostRestCards", "south");
    const step = cost.steps[0];
    expect(step?.kind).toBe("payCost");
    if (step?.kind !== "payCost") throw new Error("Expected a rest-card cost choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toContain(engine.leader("south"));
    engine.resolveDecision(
      "effectCostRestCards",
      { selectedIds: [engine.leader("south"), firstCost, secondCost] },
      "south",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Counter gives the defending Leader +3000 for the battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op14eb04ForFun037], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op14eb04ForFun037);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
