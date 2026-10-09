import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("p-155-trafalgar-law", () => {
  test("attack pays only Trigger card and reduces opponent2000 until end", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-155", playedOnTurn: 0 }], hand: ["P-042", "P-012"] },
      { character: ["P-012"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack("P-155", e.leader("north"));
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "P-012"));
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("P-042");
    expect(e.getView("south").players.south.hand[0]?.cardId).toBe("P-012");
    expect(e.getView("north").players.north.characters[0]?.power).toBe(3000);
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.power).toBe(5000);
  });
  test("declines optional Trigger-card payment", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-155", playedOnTurn: 0 }], hand: ["P-042"] },
      { character: ["P-012"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack("P-155", e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("north").players.north.characters[0]?.power).toBe(5000);
  });
  test.each([3, 4])("actual Life Trigger selfplays only at opponent Life<=3: %i", (life) => {
    const e = OnePieceTestEngine.create(
      { life: ["P-155", "P-012", "P-015", "P-016"] },
      { life },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    expect(e.getView("south").players.south.characters.some((c) => c?.cardId === "P-155")).toBe(
      life === 3,
    );
    expect(e.getView("south").players.south.lifeCount).toBe(3);
  });
});
