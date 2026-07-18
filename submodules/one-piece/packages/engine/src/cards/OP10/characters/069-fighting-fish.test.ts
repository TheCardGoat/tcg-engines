import { describe, expect, test } from "vite-plus/test";
import { op10FightingFish069, op10Sugar065 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-069 Fighting Fish", () => {
  test("with DON!! attached may return it and K.O. an opposing cost-1 Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10FightingFish069, attachedDon: 1, playedOnTurn: 0 }] },
      { character: [op10Sugar065] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const fishId = engine.findCardInZone("south", "character", op10FightingFish069);
    const targetId = engine.findCardInZone("north", "character", op10Sugar065);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(fishId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer the effect without attached DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10FightingFish069, playedOnTurn: 0 }] },
      { character: [op10Sugar065] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const fishId = engine.findCardInZone("south", "character", op10FightingFish069);
    const targetId = engine.findCardInZone("north", "character", op10Sugar065);

    engine.declareAttack(fishId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
