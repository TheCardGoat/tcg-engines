import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP08-119 Kaido & Linlin", () => {
  test("pays exactly ten field DON, KOs both sides except itself, gains Life and trashes opposing Life", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ cardId: "OP08-119", attachedDon: 2, playedOnTurn: 0 }, "P-012"],
        activeDon: 8,
        life: ["P-012"],
        deck: ["P-015", "P-016"],
      },
      { character: ["P-015"], life: ["P-012", "P-015", "P-016"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack("OP08-119", e.leader("north"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    e.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");
    expect(
      e
        .getView("south")
        .players.south.characters.filter(Boolean)
        .map((c) => c?.cardId),
    ).toEqual(["OP08-119"]);
    expect(e.getView("south").players.south.characters[0]?.attachedDon).toBe(0);
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.restedDon).toBe(0);
    expect(e.getView("south").players.south.trash.some((c) => c.cardId === "P-012")).toBe(true);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(0);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("north").players.north.lifeCount).toBe(1);
    expect(e.getView("north").players.north.trash.some((c) => c.cardId === "P-012")).toBe(true);
  });
  test("declines optional ten-DON payment while all costs and targets are available", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ cardId: "OP08-119", attachedDon: 2, playedOnTurn: 0 }, "P-012"],
        activeDon: 8,
        life: 1,
      },
      { character: ["P-015"], life: 3 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack("OP08-119", e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.activeDon).toBe(8);
    expect(e.getView("south").players.south.characters[0]?.attachedDon).toBe(2);
    expect(e.getView("south").players.south.characters[1]?.cardId).toBe("P-012");
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("P-015");
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getView("north").players.north.lifeCount).toBe(2);
  });
});
