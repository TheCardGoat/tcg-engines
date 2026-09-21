import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op17Shanks022 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-022 Shanks", () => {
  test("sets up to 2 DON!! active and rests all opposing Characters", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op17Shanks022], activeDon: 10, restedDon: 2 },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { cardId: "OP13-013", rested: true },
        ],
      },
    );

    engine.playCard(op17Shanks022, "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(2);
    expect(view.players.south.restedDon).toBe(10);
    const northChars = view.players.north.characters;
    const northCards = northChars.filter(
      (c): c is NonNullable<(typeof northChars)[number]> => c !== null,
    );
    expect(
      northCards.some(
        (c) =>
          c.instanceId === engine.findCardInZone("north", "character", eb01Doma005) && c.rested,
      ),
    ).toBe(true);
    expect(
      northCards.some(
        (c) => c.instanceId === engine.findCardInZone("north", "character", "OP13-013") && c.rested,
      ),
    ).toBe(true);
    expect(northCards).toHaveLength(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("declining the DON!! set still rests every opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op17Shanks022], activeDon: 10, restedDon: 2 },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
    );

    engine.playCard(op17Shanks022, "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(12);
    expect(engine.getView("south").players.north.characters[0]?.rested).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("[Rush] lets it attack the turn it is played", () => {
    const engine = OnePieceTestEngine.create({ hand: [op17Shanks022], activeDon: 12 }, {});
    engine.playCard(op17Shanks022, "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "0" }, "south");
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine
      .asSouth()
      .attack(
        engine.findCardInZone("south", "character", op17Shanks022),
        engine.asNorth().leader(),
      );

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
