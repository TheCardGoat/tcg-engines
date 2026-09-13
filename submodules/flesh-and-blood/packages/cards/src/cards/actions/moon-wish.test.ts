import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { sunKissRed } from "./sun-kiss.ts";
import { moonWishRed } from "./moon-wish.ts";

describe("Moon Wish (ARC185) AAA", () => {
  it("happy: hit searches a Sun Kiss into hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [moonWishRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [sunKissRed, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(moonWishRed);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expect(Bravo.zone("hand")).toContain(sunKissRed.canonicalId);
  });

  it("boundary: a miss does not tutor Sun Kiss", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [moonWishRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [sunKissRed, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(moonWishRed);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Bravo.zone("hand")).not.toContain(sunKissRed.canonicalId);
    expect(Bravo.zone("deck")).toContain(sunKissRed.canonicalId);
  });

  it("timing: putting a hand card on top pays the alternative cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [moonWishRed, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [sunKissRed, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(moonWishRed, { modeIds: ["pay"] });
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });

    expect(Bravo.zone("hand")).not.toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("hand")).toContain(sunKissRed.canonicalId);
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });
});
