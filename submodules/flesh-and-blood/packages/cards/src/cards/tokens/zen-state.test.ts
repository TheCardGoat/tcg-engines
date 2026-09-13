import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { twelvePetalKYa } from "../equipment/twelve-petal-k-ya.ts";

/**
 * Zen State (CRU075) — Ninja Aura token.
 *
 * Printed: Enters with a balance counter. At the beginning of your action
 * phase, destroy this unless you remove a balance counter from it.
 */

const zenState = fabToken("zen-state");

describe("Zen State (CRU075) AAA", () => {
  it("happy: enters with 1 balance and keeping it spends that counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [twelvePetalKYa], chiPoints: 3, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(twelvePetalKYa);
    game.helpers.resolveUntilIdle();
    const token = Bravo.cardIn("arena", zenState);
    expectFabCard(Bravo, token).toBeIn("arena").toHaveCounters(1, "balance");

    Bravo.endTurn();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Bravo, token).toBeIn("arena").toHaveCounters(0, "balance");
  });

  it("boundary: declining the unless destroys the token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [twelvePetalKYa], chiPoints: 3, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(twelvePetalKYa);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Bravo.cardsIn("arena", zenState)).toHaveLength(0);
  });

  it("timing: the opponent's action phase does not remove the balance counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [twelvePetalKYa], chiPoints: 3, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(twelvePetalKYa);
    game.helpers.resolveUntilIdle();
    const token = Bravo.cardIn("arena", zenState);
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, token).toBeIn("arena").toHaveCounters(1, "balance");
  });
});
