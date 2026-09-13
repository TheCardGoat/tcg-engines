import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  expectFabToken,
  expectFabUnplayable,
  fabToken,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { puffin } from "./puffin.ts";
import { cogwerxBlunderbuss } from "../weapons/cogwerx-blunderbuss.ts";
import { grindingGearsBlue } from "../actions/grinding-gears.ts";

/**
 * Puffin (SEA002) — Pirate Mechanologist Hero — Young — 20hp.
 *
 * Printed: "Action - {t}, destroy a Gold you control: Create a Golden Cog
 * token. The second time you crank each turn, draw a card."
 *
 * Signature weapon: Cogwerx Blunderbuss (SEA006).
 *
 * Pattern mirrors puffin-hightail.test.ts (adult SEA001) with young stats.
 */

const opponentHero = dash;

describe("puffin (SEA002) AAA", () => {
  it("core mechanic: tapping and destroying a Gold creates a Golden Cog token", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        arena: [fabToken("gold")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Puffin = game.as(puffin);

    Puffin.activate(puffin);
    game.passBoth();

    expectFabToken(game, "gold").toHaveCount(0);
    expectFabToken(game, "golden-cog").toHaveCount(1).toBeIn("arena");
  });

  it("core mechanic: the second crank each turn draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        hand: [grindingGearsBlue, grindingGearsBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Puffin = game.as(puffin);

    // First crank (playing grinding gears cranks): no draw.
    Puffin.play(grindingGearsBlue);
    expectFabPlayer(Puffin).toHaveHandCount(1);

    // Second crank: ordinal 2 fires the draw.
    Puffin.play(grindingGearsBlue);
    expectFabPlayer(Puffin).toHaveHandCount(1);
  });

  it("signature weapon: Cogwerx Blunderbuss (SEA006) attacks at 2 power for {r}{r},{t}", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        weapon1: [cogwerxBlunderbuss],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Puffin = game.as(puffin);

    Puffin.activate(cogwerxBlunderbuss, {
      abilityId: `${cogwerxBlunderbuss.canonicalId}:actionResourceResourceTapAttack`,
    });
    game.passBoth();

    expectFabPlayer(Puffin).toHaveResourceCount(0);
    expectCombat(game).toBeOpen().toHaveAttackPower(2);
    game.closeCombat({ optionals: "decline" });
  });

  it("boundary: Cogwerx Blunderbuss cannot attack with less than {r}{r} and no pitch", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        weapon1: [cogwerxBlunderbuss],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Puffin = game.as(puffin);

    expectFabUnplayable(
      () =>
        Puffin.activate(cogwerxBlunderbuss, {
          abilityId: `${cogwerxBlunderbuss.canonicalId}:actionResourceResourceTapAttack`,
        }),
      /activation payment cannot be paid|cannot be paid/i,
    );
  });
});
