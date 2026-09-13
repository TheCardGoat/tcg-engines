import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FabTestEngine,
  FAB_MANUAL_HARNESS,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { riptide } from "./riptide.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bloodrotTrapRed } from "../defense-reactions/bloodrot-trap.ts";
import { rapidReflexYellow } from "../attack-reactions/rapid-reflex.ts";

/**
 * Riptide (OUT092) — Ranger Hero — Young — 19hp.
 *
 * Printed: "Whenever you play a card from hand, you may put a card from hand
 * face-down into your arsenal. / Whenever a trap you control triggers, deal 1
 * damage to the attacking hero."
 *
 * Pattern mirrors riptide-lurker-of-the-deep.test.ts (adult OUT091).
 */

const opponentHero = dash;

describe("riptide (OUT092) AAA", () => {
  it("core mechanic: playing a card from hand puts another hand card face-down into arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        hand: [tomeOfFyendalYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Riptide = game.as(riptide);

    Riptide.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargets: "minimum",
    });

    expectFabCard(Riptide, snatchRed).toBeIn("arsenal").toBeFaceDown();
    expectFabCard(Riptide, tomeOfFyendalYellow).toBeIn("graveyard");
  });

  it("boundary: declining the optional arsenal leaves the hand card in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        hand: [tomeOfFyendalYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Riptide = game.as(riptide);

    Riptide.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Riptide, snatchRed).toBeIn("hand");
    expect(Riptide.zone("arsenal")).toHaveLength(0);
  });

  it("core mechanic: a trap you control triggers → deal 1 damage to the attacking hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, rapidReflexYellow],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: riptide, hand: [bloodrotTrapRed], life: 19, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Riptide = game.as(riptide);

    // The attacker plays a reaction, meeting Bloodrot Trap's trigger condition.
    Dash.playAttack(snatchRed);
    game.toReaction("attacker");
    Dash.play(rapidReflexYellow);
    game.toReaction("defender");
    Riptide.must.playReaction(bloodrotTrapRed);
    game.passBoth();
    game.passBoth();

    // The trap triggered; Riptide's rider deals 1 to the attacking hero.
    expectFabPlayer(Dash).toHaveLife(19);
  });
});
