import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op03Kaya044, op13Higuma013 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../src/index.ts";

const SOUTH_ATTACKS = { firstPlayer: "north", activeSeat: "south" } as const;

describe("Comprehensive Rules 9: Rule Processing", () => {
  test("9-1-1 and 9-2-1-1: the 0-Life Leader-damage defeat is judged automatically, with no player input (9-2-1)", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [], deck: 4 },
      SOUTH_ATTACKS,
    );
    const south = engine.asSouth();
    const north = engine.asNorth();

    south.attack(eb01MountainGod018, north.leader());

    const view = south.view();
    expect(view.status).toBe("finished");
    expect(view.winner).toBe("south");
    expect(view.finishReason).toBe("leaderDamage");
    expect(view.decisions).toHaveLength(0);
  });

  test("9-1-2 and 9-2-1-2: the 0-card-deck defeat resolves immediately, even mid-effect (9-2-1)", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Kaya044, op13Higuma013],
      activeDon: 1,
      deck: 2,
    });
    const south = engine.asSouth();

    // Kaya's On Play draws 2 cards; the second draw empties the deck, so rule
    // processing ends the game at once instead of waiting for the resolving
    // effect (which still has a trash action) to finish.
    south.play(op03Kaya044);

    const view = south.view();
    expect(view.players.south.deckCount).toBe(0);
    expect(view.status).toBe("finished");
    expect(view.winner).toBe("north");
    expect(view.finishReason).toBe("emptyDeck");
  });

  test("9-2-1-2: a player who still has cards in their deck has not fulfilled the defeat condition", () => {
    const engine = OnePieceTestEngine.create({ life: 3, deck: 2 }, { life: 4, deck: 6 });
    const south = engine.asSouth();
    const north = engine.asNorth();

    south.endTurn();
    north.endTurn();

    const view = south.view();
    expect(view.players.south.deckCount).toBe(1);
    expect(view.status).toBe("active");
    expect(view.winner).toBeNull();
    expect(view.finishReason).toBeNull();
  });
});
