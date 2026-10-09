import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05Enel100, op06TheArkMaxim117, op07Bartolomeo031 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../src/index.ts";

describe("effect rest costs publish Character-rest reactions", () => {
  test("The Ark Maxim's Enel rest cost triggers Bartolomeo after its effect finishes", () => {
    const engine = OnePieceTestEngine.create({
      character: [op07Bartolomeo031, op05Enel100],
      stage: op06TheArkMaxim117,
      hand: [eb01Doma005],
      deck: 5,
    });
    const south = engine.asSouth();
    const discard = engine.findCardInZone("south", "hand", eb01Doma005);
    south.activateMain(op06TheArkMaxim117);
    south.acceptOptional();
    expect(south.view().players.south.stage?.rested).toBe(true);
    expect(
      south.view().players.south.characters.find((card) => card?.cardId === op05Enel100.id)?.rested,
    ).toBe(true);
    expect(south.view().players.south.deckCount).toBe(4);
    south.choose("effectTrashFromHandSelection", [discard]);
    expect(south.view().players.south.handCount).toBe(1);
    expect(south.view().prompts).toHaveLength(0);
  });

  test("resting a Character to attack does not count as an effect rest", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07Bartolomeo031, { card: op05Enel100, playedOnTurn: 0 }], deck: 5 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.declareAttack(
      engine.findCardInZone("south", "character", op05Enel100),
      engine.leader("north"),
    );
    expect(engine.asSouth().view().players.south.deckCount).toBe(5);
    expect(engine.asSouth().view().prompts).toHaveLength(0);
  });
});
