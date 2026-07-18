import { describe, expect, test } from "vite-plus/test";
import {
  op13Higuma013,
  op14eb04CoffinBoat039,
  op14eb04DraculeMihawkOp14020020,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP14-039 Coffin Boat", () => {
  test("draws for Dracule Mihawk on play and lets its controller set up to 1 DON!! active at end of turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op14eb04DraculeMihawkOp14020020,
      hand: [op14eb04CoffinBoat039],
      deck: [op13Higuma013, op13Higuma013],
      activeDon: 1,
      restedDon: 1,
    });
    const drawnId = engine.findCardInZone("south", "deck", op13Higuma013);

    engine.playCard(op14eb04CoffinBoat039);

    let view = engine.getView("south");
    expect(view.players.south.stage?.cardId).toBe(op14eb04CoffinBoat039.id);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([drawnId]);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });

    engine.endTurn("south");

    const donDecision = engine.pendingDecision("effectSetActiveDon", "south");
    const donStep = donDecision.steps[0];
    expect(donDecision.actorId).toBe("south");
    expect(donStep?.kind).toBe("chooseOption");
    if (donStep?.kind !== "chooseOption") {
      throw new Error("Expected Coffin Boat to publish its DON!! count choice.");
    }
    expect(donStep.options.map((option) => option.id)).toEqual(["0", "1"]);

    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(view.activeSeat).toBe("north");
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
