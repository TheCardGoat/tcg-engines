import { describe, expect, test } from "vite-plus/test";
import {
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Hajrudin018,
  op04ColorsTrap074,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP04-074 Colors Trap", () => {
  test("maps DON!! -1, Counter power, then the opposing effective cost-4 rest choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: op01Hajrudin018, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      {
        hand: [op04ColorsTrap074],
        activeDon: 2,
        restedDon: 1,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const selectedId = engine.findCardInZone("south", "character", op01Hajrudin018);
    const excludedId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op04ColorsTrap074);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const donDecision = engine.pendingDecision("effectCostReturnDon", "north");
    const donStep = donDecision.steps[0];
    expect(donStep?.kind).toBe("payCost");
    if (donStep?.kind !== "payCost") {
      throw new Error("Expected the defender to choose the DON!! returned after Event payment.");
    }
    expect(donStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      "active-don:0",
      "rested-don:0",
      "rested-don:1",
    ]);
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["rested-don:0"] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const restDecision = engine.pendingDecision("effectTargetSelection", "north");
    const restStep = restDecision.steps[0];
    expect(restStep?.kind).toBe("selectEntity");
    if (restStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to choose an opposing low-cost Character to rest.");
    }
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === selectedId)?.rested,
    ).toBe(true);
    expect(view.players.north).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger maps the optional active DON!! count without payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op04ColorsTrap074],
        donDeckCount: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const before = engine.getView("north").players.north;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const donDecision = engine.pendingDecision("effectAddDon", "north");
    const donStep = donDecision.steps[0];
    expect(donStep?.kind).toBe("chooseOption");
    if (donStep?.kind !== "chooseOption") {
      throw new Error("Expected the damaged player to choose the optional active DON!! count.");
    }
    expect(donStep.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({
      activeDon: before.activeDon + 1,
      donDeckCount: before.donDeckCount - 1,
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
