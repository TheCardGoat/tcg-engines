import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op04Bartolomeo089,
  op10Bartolomeo052,
  op10Kyros046,
  op10Leo057,
  op10Usopp042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-042 Usopp", () => {
  test("adds cost continuously and draws when an opponent effect removes a Dressrosa Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Usopp042,
        character: [op04Bartolomeo089, op10Leo057],
        deck: [eb01Doma005, eb01Doma005],
      },
      { hand: [op10Kyros046], activeDon: 7 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const bartolomeoId = engine.findCardInZone("south", "character", op04Bartolomeo089);
    const leoId = engine.findCardInZone("south", "character", op10Leo057);

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === bartolomeoId)?.cost,
    ).toBe(4);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === leoId)
        ?.cost,
    ).toBe(1);

    engine.playCard(op10Kyros046, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [bartolomeoId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(bartolomeoId);
    expect(view.players.south.hand).toHaveLength(2);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("draws when an opposing attack K.O.'s a Dressrosa Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Usopp042,
        character: [{ card: op10Bartolomeo052, rested: true }],
        deck: [eb01Doma005, eb01Doma005],
      },
      { activeDon: 2 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const targetId = engine.findCardInZone("south", "character", op10Bartolomeo052);

    engine.attachDon(engine.leader("north"), 2, "north");
    engine.declareAttack(engine.leader("north"), targetId, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
