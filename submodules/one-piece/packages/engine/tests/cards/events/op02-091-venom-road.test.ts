import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op02VenomRoad091 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP02-091 Venom Road", () => {
  test("after Event payment, maps the optional active DON!! addition", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02VenomRoad091],
      activeDon: 3,
      donDeckCount: 1,
    });

    engine.playCard(op02VenomRoad091);

    const donDecision = engine.pendingDecision("effectAddDon", "south");
    const donStep = donDecision.steps[0];
    expect(donStep?.kind).toBe("chooseOption");
    if (donStep?.kind !== "chooseOption") {
      throw new Error("Expected the controller to choose the optional active DON!! count.");
    }
    expect(donStep.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 3, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("at 6 opposing DON!!, Life Trigger returns one from the opponent's field", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: 6,
      },
      {
        life: [op02VenomRoad091],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const before = engine.getView("south").players.south;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({
      activeDon: before.activeDon - 1,
      donDeckCount: before.donDeckCount + 1,
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
