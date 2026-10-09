import { describe, expect, test } from "vite-plus/test";
import { op10FightingFish069, op10Sugar065 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-069 Fighting Fish", () => {
  test("returning its only attached DON!! pays the cost but prevents the K.O.", () => {
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

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === fishId)?.attachedDon,
    ).toBe(0);
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
  test("may decline the DON cost and keep its attachment without K.O.ing the target", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "OP10-069", attachedDon: 1, playedOnTurn: 0 }] },
      { character: ["OP10-065"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const fish = e.findCardInZone("south", "character", "OP10-069");
    const before = e.getView("south").players.south.donDeckCount;
    e.asSouth().attack(fish, e.leader("north"));
    e.asSouth().declineOptional();
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === fish)?.attachedDon,
    ).toBe(1);
    expect(e.getView("south").players.south.donDeckCount).toBe(before);
    expect(e.getView("north").players.north.characters.some((c) => c?.cardId === "OP10-065")).toBe(
      true,
    );
  });
});
