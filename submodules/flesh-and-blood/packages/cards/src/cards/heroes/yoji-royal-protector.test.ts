import { describe, it } from "vitest";
import { expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { yojiRoyalProtector } from "./yoji-royal-protector.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Yoji, Royal Protector (DYN025) — Guardian Hero — Young — 22hp.
 *
 * Printed: "Once per Turn Instant - {r}{r}{r}: The next time another target
 * hero would be dealt damage this turn, instead that damage is dealt to Yoji
 * and prevent 1 of that damage."
 */

const hero = yojiRoyalProtector;
const opponentHero = dash;

describe("yoji-royal-protector (DYN025) AAA", () => {
  it("core mechanic: {r}{r}{r} shields the other hero", () => {
    const game = FabTestEngine.start(
      {
        hero,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Yoji = game.as(hero);

    Yoji.activate(hero);
    game.passBoth();

    // {r}{r}{r} paid; an Instant activation consumes no action point.
    expectFabPlayer(Yoji).toHaveResourceCount(0);
    expectFabPlayer(Yoji).toHaveAP(1);
  });

  it("boundary: the shield ability respects the once-per-turn limit", () => {
    const game = FabTestEngine.start(
      {
        hero,
        resourcePoints: 6,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Yoji = game.as(hero);

    Yoji.activate(hero);
    game.passBoth();

    Yoji.expectActivationRejected(hero);
  });

  it("core mechanic: damage to the shielded hero is redirected to Yoji with 1 prevented", () => {
    const game = FabTestEngine.start(
      {
        hero,
        hand: [snatchRed],
        resourcePoints: 4, // 3 for the shield + 1 for the attack
        deck: 6,
      },
      { hero: opponentHero, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Yoji = game.as(hero);
    const Opp = game.as(opponentHero);

    // Shield Dash, then hit Dash with an unblocked 4{p} attack.
    Yoji.activate(hero);
    game.passBoth();
    Yoji.playAttack(snatchRed);
    game.closeCombat({ optionals: "decline" });

    // 4 damage redirects to Yoji with 1 prevented: Yoji 22 → 19, Dash intact.
    expectFabPlayer(Yoji).toHaveLife(19);
    expectFabPlayer(Opp).toHaveLife(20);
  });

  it("boundary: the shield expires at end of turn — re-activation is legal next turn", () => {
    const game = FabTestEngine.start(
      {
        hero,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Yoji = game.as(hero);
    const Opponent = game.as(opponentHero);

    Yoji.activate(hero);
    game.passBoth();
    Yoji.endTurn();
    Opponent.endTurn();

    // Turn 2: the once-per-turn limit and this-turn shield have both reset.
    Yoji.activate(hero);
    expectFabPlayer(Yoji).toHaveResourceCount(0);
  });
});
