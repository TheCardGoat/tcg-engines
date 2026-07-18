import { describe, expect, test } from "vite-plus/test";
import {
  eb01Fourtricks025,
  op02Magellan085,
  op04Crocodile058,
  op04WeaknessIsAnUnforgivableSin076,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "../events/battle-fixture.shared.ts";

describe("OP04-058 Crocodile", () => {
  test("maps a DON!! returned by its controller's Counter effect into an active DON!! choice", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }] },
      {
        leaderCardId: op04Crocodile058,
        hand: [op04WeaknessIsAnUnforgivableSin076],
        activeDon: 2,
        donDeckCount: 1,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const eventId = engine.findCardInZone("north", "hand", op04WeaknessIsAnUnforgivableSin076);
    const donDeckBefore = engine.getView("north").players.north.donDeckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const decision = engine.pendingDecision("effectAddDon", "north");
    const step = decision.steps[0];
    expect(step?.kind).toBe("chooseOption");
    if (step?.kind !== "chooseOption") {
      throw new Error("Expected Crocodile's controller to choose an active DON!! count.");
    }
    expect(step.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({
      activeDon: 1,
      restedDon: 1,
      donDeckCount: donDeckBefore,
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not react when the opponent's effect forces its DON!! to return", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02Magellan085], activeDon: 6 },
      { leaderCardId: op04Crocodile058, activeDon: 2, donDeckCount: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op02Magellan085, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({ activeDon: 1, donDeckCount: 2 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
