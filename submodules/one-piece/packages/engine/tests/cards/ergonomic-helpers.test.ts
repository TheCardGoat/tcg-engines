import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Sanji013, op13Higuma013, op13MonkeyDLuffy001 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../src/index.ts";

describe("OnePieceTestEngine ergonomic helpers", () => {
  test("play puts a Character on the field the way a player would", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Higuma013],
      activeDon: op13Higuma013.cost,
    });

    engine.play(op13Higuma013);

    const south = engine.getView("south").players.south;
    expect(south.characters.some((card) => card?.cardId === op13Higuma013.id)).toBe(true);
    expect(south.restedDon).toBe(op13Higuma013.cost);
    expect(engine.hasPendingChoice("south")).toBe(false);
  });

  test("activateMain, accept, and chooseAmount drive Sanji without raw intents", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op01Sanji013],
        life: [eb01Doma005, eb01Doma005, eb01Doma005],
        restedDon: 2,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.activateMain(op01Sanji013);
    engine.accept();
    engine.chooseAmount(2);

    const sanji = engine
      .getView("south")
      .players.south.characters.find((card) => card?.cardId === op01Sanji013.id);
    expect(sanji).toMatchObject({ attachedDon: 2, power: 7000 });
  });

  test("attack is a legal public command between two field cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op13MonkeyDLuffy001,
        character: [{ card: op13Higuma013, playedOnTurn: 0 }],
        activeDon: 0,
      },
      {
        leaderCardId: op13MonkeyDLuffy001,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );

    // Same button a player presses: declare an attack. Battle may open Counter prompts.
    const result = engine.attack(op13Higuma013, engine.leader("north"));
    expect(result.accepted).toBe(true);
  });
});
