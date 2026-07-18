import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01ThunderBagua119 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function counterEngine(life: number) {
  return OnePieceTestEngine.create(
    {
      character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
    },
    {
      hand: [op01ThunderBagua119],
      activeDon: 2,
      donDeckCount: 1,
      life,
    },
    SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
  );
}

describe("OP01-119 Thunder Bagua", () => {
  test("at 2 Life, maps Counter power then the optional rested DON!! addition", () => {
    const engine = counterEngine(2);
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op01ThunderBagua119);
    const beforeCounter = engine.getView("north").players.north;

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
      throw new Error("Expected the defender to choose the optional rested DON!! count.");
    }
    expect(donStep.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(beforeCounter.lifeCount);
    expect(view.players.north).toMatchObject({ activeDon: 0, restedDon: 3, donDeckCount: 0 });
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("above 2 Life, resolves the Counter without offering the conditional DON!! addition", () => {
    const engine = counterEngine(3);
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op01ThunderBagua119);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({ lifeCount: 3, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("adds an optional active DON!! from its Life Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op01ThunderBagua119],
        donDeckCount: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({ activeDon: 1, restedDon: 0, donDeckCount: 0 });
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(op01ThunderBagua119.id);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
