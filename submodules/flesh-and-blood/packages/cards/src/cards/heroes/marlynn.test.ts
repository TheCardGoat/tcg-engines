import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  fabToken,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { marlynn } from "./marlynn.ts";
import { hammerheadHarpoonCannon } from "../weapons/hammerhead-harpoon-cannon.ts";
import { drillShotRed } from "../actions/drill-shot.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Hero behavior acceptance test — Marlynn (SEA083).
 *
 * Printed: "Action - {t}, destroy a Gold you control: Create a Goldfin Harpoon
 * in your hand. Go again / Whenever you draw a card during your action phase,
 * you may put an arrow from your hand face-up into your arsenal."
 *
 * Signature weapon: Hammerhead Harpoon Cannon (SEA084).
 */

const opponentHero = dash;

describe("marlynn (SEA083)", () => {
  it("core mechanic: tap + destroy a Gold creates a Goldfin Harpoon in hand, then go again", () => {
    const game = FabTestEngine.start(
      { hero: marlynn, arena: [fabToken("gold")], actionPoints: 1, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Marlynn = game.as(marlynn);

    Marlynn.activate(marlynn);
    game.passBoth();

    expectFabToken(game, "gold").toHaveCount(0);
    expectFabToken(game, "goldfin-harpoon").toHaveCount(1).toBeIn("hand");
    expectFabPlayer(Marlynn).toHaveAP(1); // −1 activation +1 go again
  });

  it("boundary: without a Gold you control the activation is illegal", () => {
    const game = FabTestEngine.start(
      { hero: marlynn, actionPoints: 1, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Marlynn = game.as(marlynn);

    expectFabUnplayable(() => Marlynn.activate(marlynn), /destroy cost is unavailable/i);
  });

  it("core mechanic: drawing during action phase offers optional Arrow → arsenal", () => {
    // Tome of Fyendal draws a card. Deck top is an Arrow (drillShotRed).
    // Use plain .play() so we control the optional decision.
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [tomeOfFyendalYellow],
        deck: [
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          drillShotRed, // top of deck — Arrow card
        ],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Marlynn = game.as(marlynn);

    Marlynn.play(tomeOfFyendalYellow);

    // Resolve the optional boolean (accept → move Arrow to arsenal face-up)
    // and entity-target (pick the Arrow from hand).
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargets: "minimum",
    });

    expectFabCard(Marlynn, drillShotRed).toBeIn("arsenal").toBeFaceUp();
  });

  it("boundaries: declining the optional does not move an Arrow to arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [tomeOfFyendalYellow],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, drillShotRed],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Marlynn = game.as(marlynn);

    Marlynn.play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Arsenal stays empty — Arrow was not moved.
    expect(Marlynn.zone("arsenal").length).toBe(0);
  });

  it("boundaries: drawing a non-Arrow card does not trigger the ability", () => {
    // Deck top is snatchRed (not an Arrow).
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        hand: [tomeOfFyendalYellow],
        deck: [
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed, // top of deck — NOT an Arrow
        ],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Marlynn = game.as(marlynn);

    Marlynn.play(tomeOfFyendalYellow);

    // No Arrow drawn → no optional trigger fires. Hand has the drawn card.
    expect(Marlynn.zone("arsenal").length).toBe(0);
  });

  it("signature weapon: Hammerhead (SEA084) gives the next arrow attack +4{p}, no overpower for non-harpoon names", () => {
    const game = FabTestEngine.start(
      {
        hero: marlynn,
        weapon1: [hammerheadHarpoonCannon],
        arsenal: [{ card: drillShotRed, state: { faceUp: true } }],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Marlynn = game.as(marlynn);

    // 4{r},{t}: the next arrow attack gets +4{p}. drill-shot (4{p}) has no
    // "harpoon" in its name, so it must not gain overpower.
    Marlynn.activate(hammerheadHarpoonCannon);
    game.passBoth(); // resolve the activation layer: go again refunds the AP
    expectFabPlayer(Marlynn).toHaveResourceCount(0);
    expectFabPlayer(Marlynn).toHaveAP(1); // −1 activation +1 go again

    Marlynn.playAttack(drillShotRed, { from: "arsenal" });
    expectCombat(game).toBeOpen().toHaveAttackPower(8).notToHaveKeyword("overpower");
    game.closeCombat({ optionals: "decline" });
    expectCombat(game).toBeClosed();
  });
});
