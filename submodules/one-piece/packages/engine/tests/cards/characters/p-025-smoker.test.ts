import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P025 Smoker", () => {
  test.each([
    ["ST04-003", 1, true],
    ["ST15-002", 1, false],
    ["ST25-003", 1, false],
    ["ST04-003", 0, false],
  ] as const)("Character%s DON%s protection=%s", (card, don, protectedByEffect) => {
    const e = OnePieceTestEngine.create(
      { character: [card] },
      { character: [{ cardId: "P-025", rested: true, attachedDon: don }] },
    );
    const id = e.findCardInZone("north", "character", "P-025");
    e.asSouth().attack(e.findCardInZone("south", "character", card), id);
    expect(e.getView("north").players.north.characters.some((c) => c?.instanceId === id)).toBe(
      protectedByEffect,
    );
    expect(e.getView("north").players.north.trash.some((c) => c.instanceId === id)).toBe(
      !protectedByEffect,
    );
  });
  test("battle protection does not prevent effect KO", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038"], activeDon: 5 },
      { character: [{ cardId: "P-025", rested: true, attachedDon: 1 }] },
    );
    const id = e.findCardInZone("north", "character", "P-025");
    e.asSouth().play("OP04-038");
    e.asSouth().chooseTargets();
    e.asSouth().chooseTargets(id);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(id);
  });
  test("Leader without Special still KOs Smoker despite attached DON", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP13-001" },
      { character: [{ cardId: "P-025", rested: true, attachedDon: 1 }] },
    );
    const target = e.findCardInZone("north", "character", "P-025");
    e.asSouth().attack(e.leader("south"), target);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("north").players.north.restedDon).toBe(1);
  });
});
