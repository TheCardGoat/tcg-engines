import { eb01Doma005, eb01Fourtricks025, op02Vista011 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Hatchan051 } from "../../../../../cards/src/cards/OP14EB04/characters/051-hatchan.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-051 Hatchan", () => {
  test("on K.O. with two attached DON!! draws the exact top card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04Hatchan051, attachedDon: 2 }],
        deck: [eb01Doma005, eb01Fourtricks025],
      },
      { hand: [op02Vista011], activeDon: op02Vista011.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hatchanId = engine.findCardInZone("south", "character", op14eb04Hatchan051);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op02Vista011, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hatchanId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(hatchanId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. with only one attached DON!! does not draw", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04Hatchan051, attachedDon: 1 }],
        deck: [eb01Doma005, eb01Fourtricks025],
      },
      { hand: [op02Vista011], activeDon: op02Vista011.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hatchanId = engine.findCardInZone("south", "character", op14eb04Hatchan051);
    const deckCountBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op02Vista011, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [hatchanId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(hatchanId);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.deckCount).toBe(deckCountBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
