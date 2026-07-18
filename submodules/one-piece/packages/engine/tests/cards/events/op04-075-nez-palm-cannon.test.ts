import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op04NezPalmCannon075 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP04-075 Nez-Palm Cannon", () => {
  test("at two Life, Counter power precedes the optional rested DON!! addition", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op04NezPalmCannon075],
        activeDon: 3,
        donDeckCount: 1,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op04NezPalmCannon075);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const donDecision = engine.pendingDecision("effectAddDon", "north");
    const donStep = donDecision.steps[0];
    expect(donStep?.kind).toBe("chooseOption");
    if (donStep?.kind !== "chooseOption") {
      throw new Error("Expected the low-Life defender to choose the optional rested DON!! count.");
    }
    expect(donStep.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.players.north).toMatchObject({
      activeDon: 0,
      restedDon: 4,
      donDeckCount: 0,
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger maps the optional active DON!! count without payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op04NezPalmCannon075],
        donDeckCount: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const donDecision = engine.pendingDecision("effectAddDon", "north");
    expect(donDecision.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [
        { id: "0", value: "0" },
        { id: "1", value: "1" },
      ],
    });
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({ activeDon: 1, restedDon: 0, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
