import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06GeckoMoria080,
  op06VictoriaCindry091,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-091 Victoria Cindry", () => {
  test("with a compound Thriller Bark Pirates Leader, trashes exactly five cards on play", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06GeckoMoria080,
      hand: [op06VictoriaCindry091],
      deck: [
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
      ],
      activeDon: op06VictoriaCindry091.cost,
    });

    engine.playCard(op06VictoriaCindry091, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.trash).toHaveLength(5);
    expect(view.prompts).toHaveLength(0);
  });
});
