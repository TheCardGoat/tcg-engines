import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P007 Luffy", () => {
  test.each([
    ["leader", "OP13-001", 1, true],
    ["leader", "OP01-001", 1, false],
    ["leader", "ST30-001", 1, true],
    ["character", "ST04-003", 1, true],
    ["character", "ST28-004", 1, false],
    ["leader", "OP13-001", 0, false],
  ] as const)("%s%s DON%s battle protection=%s", (kind, card, don, protectedByEffect) => {
    const e = OnePieceTestEngine.create(
      kind === "leader" ? { leaderCardId: card } : { character: [card] },
      { character: [{ cardId: "P-007", attachedDon: don, rested: true }] },
    );
    const id = e.findCardInZone("north", "character", "P-007");
    e.asSouth().attack(
      kind === "leader" ? e.leader("south") : e.findCardInZone("south", "character", card),
      id,
    );
    expect(e.getView("north").players.north.characters.some((c) => c?.instanceId === id)).toBe(
      protectedByEffect,
    );
    expect(
      e
        .getView("north")
        .players.north.trash.map((c) => c.instanceId)
        .includes(id),
    ).toBe(!protectedByEffect);
  });
  test("DON condition does not prevent effect KO", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038"], activeDon: 5 },
      { character: [{ cardId: "P-007", attachedDon: 1, rested: true }] },
    );
    const id = e.findCardInZone("north", "character", "P-007");
    e.asSouth().play("OP04-038");
    e.asSouth().chooseTargets();
    e.asSouth().chooseTargets(id);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(id);
    expect(e.getView("north").players.north.restedDon).toBe(1);
  });
});
