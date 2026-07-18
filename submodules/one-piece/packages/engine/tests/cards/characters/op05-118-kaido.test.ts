import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op05Kaido118 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-118 Kaido", () => {
  test("draws four on play while the opponent has three Life cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05Kaido118],
        deck: [eb01Doma005, eb01Fourtricks025, eb01Doma005, eb01Fourtricks025, eb01Doma005],
        activeDon: op05Kaido118.cost,
      },
      { life: [eb01Doma005, eb01Fourtricks025, eb01Doma005] },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(op05Kaido118, "south");

    const after = engine.getView("south").players.south;
    expect(after.handCount).toBe(before.handCount - 1 + 4);
    expect(after.deckCount).toBe(before.deckCount - 4);
    expect(after.characters.some((card) => card?.cardId === op05Kaido118.id)).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not draw while the opponent has four Life cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05Kaido118],
        deck: [eb01Doma005, eb01Fourtricks025, eb01Doma005, eb01Fourtricks025],
        activeDon: op05Kaido118.cost,
      },
      { life: [eb01Doma005, eb01Fourtricks025, eb01Doma005, eb01Fourtricks025] },
    );
    const before = engine.getView("south").players.south;

    engine.playCard(op05Kaido118, "south");

    const after = engine.getView("south").players.south;
    expect(after.handCount).toBe(before.handCount - 1);
    expect(after.deckCount).toBe(before.deckCount);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
