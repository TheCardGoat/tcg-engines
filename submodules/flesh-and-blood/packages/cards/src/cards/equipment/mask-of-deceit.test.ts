import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { arakniBlackWidow } from "../demi-heroes/arakni-black-widow.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { maskOfDeceit } from "./mask-of-deceit.ts";

/**
 * Mask of Deceit (HNT011) — Assassin Head, Arakni Specialization, Blade Break.
 * Printed: when this defends, become a random Agent of Chaos. If the attacking
 * hero is marked, instead choose the Agent of Chaos.
 */

describe("Mask of Deceit (HNT011) AAA", () => {
  it("happy: defending a marked attacker lets you choose the Agent of Chaos", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], marked: true, deck: 6 },
      {
        hero: arakniMarionette,
        head: [maskOfDeceit],
        inventory: [arakniBlackWidow],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    game.as(dash).attackWith(snatchRed);
    Arakni.defendWith(maskOfDeceit);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Arakni, arakniMarionette).toHaveName("Arakni Black Widow");
  });

  it("boundary: an unmarked attacker becomes a random Agent instead of choosing", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: arakniMarionette,
        head: [maskOfDeceit],
        inventory: [arakniBlackWidow],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    game.as(dash).attackWith(snatchRed);
    Arakni.defendWith(maskOfDeceit);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Arakni, arakniMarionette).toHaveName("Arakni Black Widow");
  });

  it("timing: Blade Break destroys this after it defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: arakniMarionette,
        head: [maskOfDeceit],
        inventory: [arakniBlackWidow],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    game.as(dash).attackWith(snatchRed);
    Arakni.defendWith(maskOfDeceit);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Arakni, maskOfDeceit).toBeIn("graveyard");
    expectFabPlayer(Arakni).toHaveLife(38);
  });
});
