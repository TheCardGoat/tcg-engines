import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { barnacleYellow } from "./barnacle.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { chumFriendlyFirstMateYellow } from "./chum-friendly-first-mate.ts";

describe("Chum, Friendly First Mate (SEA050) AAA", () => {
  it("happy: resolves into the arena as a 4-power ally", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [chumFriendlyFirstMateYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(chumFriendlyFirstMateYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Gravy, chumFriendlyFirstMateYellow).toBeIn("arena");
    expectFabCard(Gravy, chumFriendlyFirstMateYellow).toHavePower(4);
  });

  it("boundary: the Instant lure requires discarding a watery-grave card", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [chumFriendlyFirstMateYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(chumFriendlyFirstMateYellow);
    game.helpers.resolveUntilIdle();
    expect(() =>
      Gravy.activate(chumFriendlyFirstMateYellow, {
        abilityId: `${chumFriendlyFirstMateYellow.canonicalId}:instantDiscardWateryGraveUntilEndTurnOpponentsMust`,
      }),
    ).toThrow();
  });

  it("happy: opponents must choose this as the attack target if able", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: gravyBones,
        arena: [chumFriendlyFirstMateYellow],
        hand: [barnacleYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Gravy = game.as(gravyBones);
    const chum = Gravy.findCardInZone("arena", chumFriendlyFirstMateYellow);

    Dash.pass();
    Gravy.activate(chumFriendlyFirstMateYellow, {
      abilityId: `${chumFriendlyFirstMateYellow.canonicalId}:instantDiscardWateryGraveUntilEndTurnOpponentsMust`,
    });
    game.passBoth();

    expect(() => Dash.attackWith(snatchRed)).toThrow();
    Dash.attackWith(snatchRed, { target: chum });
    expectCombat(game).toBeOpen();
  });

  it("timing: tap-Attack opens combat and returns Chum to the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [chumFriendlyFirstMateYellow],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(chumFriendlyFirstMateYellow, {
      abilityId: `${chumFriendlyFirstMateYellow.canonicalId}:actionAttack`,
    });
    game.passBoth();
    expect(Gravy.zone("combatChain")).toContain(chumFriendlyFirstMateYellow.canonicalId);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Gravy, chumFriendlyFirstMateYellow).toBeIn("arena");
  });
});
