import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST06-007 Tsuru", () => {
  test("rests to block a Leader attack and is KO instead", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { character: ["ST06-007"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const id = e.findCardInZone("north", "character", "ST06-007");
    const before = e.getView("north").players.north.lifeCount;
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("battleBlocker", { selectedIds: [id] }, "north");
    expect(e.getView("north").players.north.lifeCount).toBe(before);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(id);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
  test("may decline Blocker and remain active", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { character: ["ST06-007"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const before = e.getView("north").players.north.lifeCount;
    e.declareAttack(e.findCardInZone("south", "character", "ST02-006"), e.leader("north"), "south");
    e.resolveDecision("battleBlocker", { selectedIds: [] }, "north");
    expect(e.getView("north").players.north.lifeCount).toBe(before - 1);
    expect(
      e.getView("north").players.north.characters.find((c) => c?.cardId === "ST06-007")?.rested,
    ).toBe(false);
  });
});
