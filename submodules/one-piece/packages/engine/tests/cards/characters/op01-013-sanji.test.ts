import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01Sanji013 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-013 Sanji", () => {
  test("player activates Sanji, pays top Life, and takes up to two rested DON!!", () => {
    // Arrange: Sanji on the field, three Life cards, two rested DON!! ready to give
    const engine = OnePieceTestEngine.create(
      {
        character: [op01Sanji013],
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        restedDon: 2,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    // Act: same path a player takes in the UI
    engine.activateMain(op01Sanji013);
    engine.accept();
    engine.chooseAmount(2);

    // Assert: Life paid into hand, Sanji powered up with both DON!!, no leftover prompt
    const south = engine.getView("south").players.south;
    const sanji = south.characters.find((card) => card?.cardId === op01Sanji013.id);
    expect(south.hand.some((card) => card.cardId === eb01Doma005.id)).toBe(true);
    expect(sanji).toMatchObject({ attachedDon: 2, power: 7000 });
    expect(engine.hasPendingChoice("south")).toBe(false);

    // Once per turn — second activation fails
    const sanjiId = engine.findOnField("south", op01Sanji013);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: sanjiId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    // Temporary power ends with the turn
    engine.passTurn("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.cardId === op01Sanji013.id)?.power,
    ).toBe(3000);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op01Sanji013],
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        restedDon: 2,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.activateMain(op01Sanji013);
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
