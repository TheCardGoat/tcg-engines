import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { channelMountIsenBlue } from "./channel-mount-isen.ts";
import { nimblismBlue } from "./nimblism.ts";
import { drowningDireRed } from "./drowning-dire.ts";

/**
 * Drowning Dire, Red (EVR110) — Runeblade Attack, cost 2, 5{p}.
 * Printed: If you have played or created an aura this turn, this gains dominate.
 * When this hits, you may put a 'non-attack' action card from your graveyard
 * on the bottom of your deck.
 *
 * Module also lists unprinted `keywords: [dominate]` — pin that the keyword
 * is present even with no aura this turn.
 */

describe("Drowning Dire (EVR110) AAA", () => {
  it("happy: a hit may put a non-attack action from the graveyard on the bottom of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [drowningDireRed],
        graveyard: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(drowningDireRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: nimblismBlue.canonicalId,
    });

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabCard(Viserai, drowningDireRed).toBeIn("graveyard");
    expect(Viserai.cardsIn("deck", nimblismBlue).length).toBe(1);
  });

  it("boundary: declining the on-hit leaves the non-attack in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [drowningDireRed],
        graveyard: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(drowningDireRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabCard(Viserai, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: without an aura this turn this does not have dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [drowningDireRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(drowningDireRed);
    expectCombat(game).notToHaveKeyword("dominate");
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("timing: after an aura this turn, this gets dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [channelMountIsenBlue, drowningDireRed],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(channelMountIsenBlue);
    game.helpers.resolveUntilIdle();
    Viserai.playAttack(drowningDireRed);
    expectCombat(game).toHaveKeyword("dominate");
  });
});
