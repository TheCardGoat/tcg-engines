import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { aggressivePounceRed } from "./aggressive-pounce.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { alphaRampageRed } from "./alpha-rampage.ts";
import { disableYellow } from "./disable.ts";
import { nimblismBlue } from "./nimblism.ts";
import { berserkYellow } from "./berserk.ts";

/**
 * Berserk (DYN009) — Brute Action, cost 1, 3{d}, go again.
 *
 * Printed: "Until end of turn, whenever you discard a random card with 6 or
 * more {p}, banish it. If you do, reveal the top card of your deck. If it has
 * 6 or more {p}, draw a card.\nGo again"
 */

describe("Berserk (DYN009) AAA", () => {
  it("happy: each later random 6+{p} discard is banished, then a 6+{p} top card is drawn", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [berserkYellow, alphaRampageRed, aggressivePounceRed],
        resourcePoints: 4,
        actionPoints: 2,
        deckTop: [disableYellow],
        deck: 6,
      },
      { hero: dash, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(berserkYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Rhinar, berserkYellow).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveAP(2);
    expect(Rhinar.zone("hand")).not.toContain(disableYellow.canonicalId);
    Rhinar.attackWith(alphaRampageRed);
    expectFabCard(Rhinar, aggressivePounceRed).toBeIn("banished");
    expect(Rhinar.zone("hand")).toContain(disableYellow.canonicalId);
  });

  it("boundary: a random discard with less than 6{p} is not banished", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [berserkYellow, alphaRampageRed, nimblismBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(berserkYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Rhinar.attackWith(alphaRampageRed);

    expectFabCard(Rhinar, nimblismBlue).toBeIn("graveyard");
    expect(Rhinar.zone("banished")).not.toContain(nimblismBlue.canonicalId);
  });

  it("timing: go again refunds the action point spent to play this", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [berserkYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(berserkYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Rhinar).toHaveAP(1);
    expectFabCard(Rhinar, berserkYellow).toBeIn("graveyard");
    expect(
      game
        .getView({ role: "player", actorId: Rhinar.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(true);

    Rhinar.endTurn();
    game.helpers.resolveUntilIdle();

    expect(
      game
        .getView({ role: "player", actorId: Rhinar.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(false);
  });
});
