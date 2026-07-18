import { describe, expect, test } from "vite-plus/test";
import { op08Carrot021, op08Nekomamushi028, op08Wanda034, op14eb04Carrot013 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-013 Carrot", () => {
  test("with a Minks Leader, sets two Minks Characters and the Leader active", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08Carrot021,
        hand: [op14eb04Carrot013],
        character: [
          { card: op08Nekomamushi028, rested: true },
          { card: op08Wanda034, rested: true },
        ],
        activeDon: op14eb04Carrot013.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const nekomamushiId = engine.findCardInZone("south", "character", op08Nekomamushi028);
    const wandaId = engine.findCardInZone("south", "character", op08Wanda034);

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    engine.playCard(op14eb04Carrot013, "south");

    const targets = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(targets?.kind).toBe("selectEntity");
    if (targets?.kind !== "selectEntity") throw new Error("Expected Carrot's Minks selection.");
    expect(targets).toMatchObject({ min: 0, max: 2 });
    expect(targets.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([nekomamushiId, wandaId]),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [nekomamushiId, wandaId] },
      "south",
    );

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === nekomamushiId)?.rested,
    ).toBe(false);
    expect(view.players.south.characters.find((card) => card?.instanceId === wandaId)?.rested).toBe(
      false,
    );
    expect(view.players.south.leader.rested).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
