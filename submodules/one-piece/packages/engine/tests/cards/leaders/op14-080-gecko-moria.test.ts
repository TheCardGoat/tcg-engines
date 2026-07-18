import { describe, expect, test } from "vite-plus/test";
import {
  op14eb04GeckoMoriaOp14080080,
  op14eb04Kumacy102,
  op14eb04Mr9095,
  op14eb04SpiderMice081,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP14-080 Gecko Moria", () => {
  test("K.O.s a Thriller Bark Pirates cost and gives the whole field +1000 power", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op14eb04GeckoMoriaOp14080080,
      character: [op14eb04Kumacy102, op14eb04SpiderMice081, op14eb04Mr9095],
      deck: [op14eb04Mr9095, op14eb04Mr9095, op14eb04Mr9095, op14eb04Mr9095],
    });
    const paymentId = engine.findCardInZone("south", "character", op14eb04Kumacy102);
    const survivorId = engine.findCardInZone("south", "character", op14eb04Mr9095);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostKoCharacter", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Moria's Character K.O. cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(survivorId);
    engine.resolveDecision("effectCostKoCharacter", { selectedIds: [paymentId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(6000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === survivorId)?.power,
    ).toBe(7000);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("trashes three cards from hand while attacking and adds the top deck card to Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op14eb04GeckoMoriaOp14080080,
        hand: [op14eb04Mr9095, op14eb04Mr9095, op14eb04Mr9095],
        deck: [op14eb04Kumacy102, op14eb04Mr9095],
        life: 2,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.trash).toHaveLength(3);
    expect(view.players.south.lifeCount).toBe(3);
    expect(view.players.south.deckCount).toBe(1);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
