import { describe, expect, test } from "vite-plus/test";
import { op11Arlong023 } from "../../../../cards/src/cards/OP11/characters/023-arlong.ts";
import { op14eb04Killer005 } from "../../../../cards/src/cards/OP14EB04/characters/005-killer.ts";
import { op14eb04JinbeOp14040040 } from "../../../../cards/src/cards/OP14EB04/leaders/040-jinbe-op14-040.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP11-023 Arlong", () => {
  test("costs 3 in hand when all three printed conditions are met", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op14eb04JinbeOp14040040,
        hand: [op11Arlong023],
        life: 3,
        activeDon: 3,
      },
      {
        character: Array.from({ length: 5 }, () => ({
          card: op14eb04Killer005,
          rested: true,
        })),
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const arlongId = engine.findCardInZone("south", "hand", op11Arlong023);
    const projectedArlong = engine
      .getView("south")
      .players.south.hand.find((card) => card.instanceId === arlongId);

    expect(projectedArlong?.cost).toBe(3);
    engine.playCard(op11Arlong023);

    expect(engine.findCardInZone("south", "character", op11Arlong023)).toBe(arlongId);
    expect(engine.getState().players.south.activeDon).toBe(0);
    expect(engine.getState().players.south.restedDon).toBe(3);
    expect(engine.getState().capabilityHistory).toEqual([]);
  });
});
