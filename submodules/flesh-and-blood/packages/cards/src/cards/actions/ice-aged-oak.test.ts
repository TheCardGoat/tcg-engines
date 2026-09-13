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
import { weaveIceBlue } from "./weave-ice.ts";
import { iceAgedOakBlue } from "./ice-aged-oak.ts";

/**
 * Ice Aged Oak (IAR260) — Earth Action - Attack, cost 3, 4{p}, Ice Bond.
 *
 * Printed: "When this hits a hero, create an Embodiment of Earth token.\nIce
 * Bond - If an Ice card was pitched to play this, this gets dominate and "When
 * this hits a hero, create a Frostbite token in each of their exposed head,
 * chest, arms, and legs zones.""
 */

describe("Ice Aged Oak (IAR260) AAA", () => {
  it("happy: pitching Ice grants dominate, and a hit mints Embodiment plus Frostbites in each exposed seat", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [iceAgedOakBlue, weaveIceBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.must.pitch(weaveIceBlue).playAttack(iceAgedOakBlue);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).toHaveKeyword("dominate");
    Dash.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Bravo).toHaveTokenCount("embodiment-of-earth", 1);
    expect(Dash.zone("head")).toContain("token:frostbite");
    expect(Dash.zone("chest")).toContain("token:frostbite");
    expect(Dash.zone("arms")).toContain("token:frostbite");
    expect(Dash.zone("legs")).toContain("token:frostbite");
  });

  it("boundary: pitching Generic does not grant dominate or Frostbites", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [iceAgedOakBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.must.pitch(nimblismBlue).playAttack(iceAgedOakBlue);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).notToHaveKeyword("dominate");
    Dash.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Bravo).toHaveTokenCount("embodiment-of-earth", 1);
    expect(Dash.zone("head")).not.toContain("token:frostbite");
  });

  it("timing: dominate rejects a two-card hand defense; a single legal defender still takes the hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [iceAgedOakBlue, weaveIceBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.must.pitch(weaveIceBlue).playAttack(iceAgedOakBlue);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveKeyword("dominate");
    expect(Dash.expectBlockRejected([nimblismBlue, nimblismBlue]).errorCode).toBe("dominate");
    Dash.defendWith(nimblismBlue);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabPlayer(Bravo).toHaveTokenCount("embodiment-of-earth", 1);
    expect(Dash.zone("head")).toContain("token:frostbite");
  });
});
