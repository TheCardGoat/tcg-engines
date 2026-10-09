import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st09Kaido004, st04King004 } from "@tcg/op-cards";
describe("ST09-004 Kaido", () => {
  test.each(["protected", "threeLife", "noDon"])("battle KO restriction boundary %s", (mode) => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: st09Kaido004, rested: true, attachedDon: mode === "noDon" ? 0 : 1 }],
        life: mode === "threeLife" ? 3 : 2,
      },
      { character: [{ card: st04King004, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const card = e.findCardInZone("south", "character", "ST09-004");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST04-004"), card);
    expect(e.getView("south").players.south.characters.some((c) => c?.instanceId === card)).toBe(
      mode === "protected",
    );
    expect(e.getView("south").players.south.trash.some((c) => c.instanceId === card)).toBe(
      mode !== "protected",
    );
  });
  test("battle protection does not stop effect KO", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: st09Kaido004, attachedDon: 1 }], life: 2 },
      { hand: ["ST01-015"], activeDon: 4 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const card = e.findCardInZone("south", "character", "ST09-004");
    e.asNorth().play("ST01-015");
    e.asNorth().chooseTargets(card);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(card);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
  });
});
