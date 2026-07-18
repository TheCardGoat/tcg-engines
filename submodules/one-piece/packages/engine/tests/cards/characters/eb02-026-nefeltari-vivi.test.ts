import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02MonkeyDLuffy010,
  eb02NefeltariVivi026,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-026 Nefeltari Vivi", () => {
  test("draws 2 with a multicolored Leader at the post-play five-card hand boundary", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb02MonkeyDLuffy010,
      hand: [eb02NefeltariVivi026, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: 3,
    });

    engine.playCard(eb02NefeltariVivi026, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      handCount: 7,
      deckCount: 1,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not draw when six cards remain in hand after Vivi is played", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: eb02MonkeyDLuffy010,
      hand: [
        eb02NefeltariVivi026,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
      ],
      deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: 3,
    });

    engine.playCard(eb02NefeltariVivi026, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      handCount: 6,
      deckCount: 3,
    });
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
