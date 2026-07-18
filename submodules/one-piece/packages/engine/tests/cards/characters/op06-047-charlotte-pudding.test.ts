import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06CharlottePudding047,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-047 Charlotte Pudding", () => {
  test("on play shuffles the opponent's entire hand into their deck, then draws five", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06CharlottePudding047], activeDon: op06CharlottePudding047.cost },
      {
        hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        deck: [
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
        ],
      },
    );
    const returnedIds = [...engine.getState().players.north.hand];

    engine.playCard(op06CharlottePudding047, "south");

    const north = engine.getView("north").players.north;
    expect(north.hand).toHaveLength(5);
    expect(north.deckCount).toBe(4);
    const northHiddenCards = [
      ...engine.getState().players.north.hand,
      ...engine.getState().players.north.deck,
    ];
    expect(returnedIds.every((id) => northHiddenCards.includes(id))).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
