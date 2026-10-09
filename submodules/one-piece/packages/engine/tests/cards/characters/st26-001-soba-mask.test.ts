import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST26-001 Soba Mask", () => {
  test.each(["OP05-065", "OP13-027"])(
    "high-base named %s discounts actual play then returns all both names",
    (high) => {
      const e = OnePieceTestEngine.create({
        hand: ["ST26-001"],
        character: [high, "ST01-004", "ST18-003", "ST02-002"],
        activeDon: 2,
      });
      const ids = e
        .getView("south")
        .players.south.characters.filter((c) => c && c.cardId !== "ST02-002")
        .map((c) => c!.instanceId);
      e.asSouth().play("ST26-001");
      expect(e.getView("south").players.south.activeDon).toBe(0);
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual(
        expect.arrayContaining(ids),
      );
      const soba = e
        .getView("south")
        .players.south.characters.find((c) => c?.cardId === "ST26-001");
      expect(soba?.cost).toBe(7);
      expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(2);
    },
  );
  test("boosted low-base Sanji does not discount", () => {
    let e = OnePieceTestEngine.create({
      hand: ["ST26-001"],
      character: ["ST01-004"],
      activeDon: 5,
    });
    e.asSouth().attachDon(e.findCardInZone("south", "character", "ST01-004"), 3);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
    const failed = e.expectFailure({
      type: "playCard",
      seat: "south",
      instanceId: e.findCardInZone("south", "hand", "ST26-001"),
    });
    e = OnePieceTestEngine.fromState(failed.state);
    expect(e.getView("south").players.south.activeDon).toBe(2);
  });
  test("unrelated high-base Character does not discount", () => {
    let e = OnePieceTestEngine.create({
      hand: ["ST26-001"],
      character: ["ST22-003"],
      activeDon: 2,
    });
    const failed = e.expectFailure({
      type: "playCard",
      seat: "south",
      instanceId: e.findCardInZone("south", "hand", "ST26-001"),
    });
    e = OnePieceTestEngine.fromState(failed.state);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
  test("without qualifying high-base name full price still returns low-base names", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST26-001"],
      character: ["ST01-004", "ST18-003", "ST02-002"],
      activeDon: 7,
    });
    e.asSouth().play("ST26-001");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(
      expect.arrayContaining(["ST01-004", "ST18-003"]),
    );
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(2);
  });
  test("reduced current power of a high-base Sanji still discounts next turn", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST26-001"], character: ["OP13-027"], activeDon: 0, deck: ["ST01-006", "ST02-002"] },
      { hand: ["OP15-020"], activeDon: 7 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const sanji = e.findCardInZone("south", "character", "OP13-027");
    e.asNorth().play("OP15-020");
    e.asNorth().chooseTargets(sanji);
    e.resolveDecision("effectActionOptional", { optionId: "no" }, "north");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(-1000);
    e.asNorth().endTurn();
    e.asSouth().play("ST26-001");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(sanji);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.cardId === "ST26-001")?.cost,
    ).toBe(7);
  });
});
