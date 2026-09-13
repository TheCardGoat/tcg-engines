import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { malignRed } from "../actions/malign.ts";
import { arakniWebOfDeceit } from "./arakni-web-of-deceit.ts";

/**
 * Arakni, Web of Deceit (HNT002) — Chaos Assassin Young Hero.
 *
 * Printed: Your attacks with stealth that are attacking a marked hero get +1{p}
 * and "When this hits, this gets go again."
 */

describe("Arakni, Web of Deceit (HNT002) AAA", () => {
  it("happy: a stealth attack vs a marked hero gets +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: arakniWebOfDeceit, hand: [malignRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], marked: true, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniWebOfDeceit);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: a stealth attack vs an unmarked hero stays printed 3{p}", () => {
    const game = FabTestEngine.start(
      { hero: arakniWebOfDeceit, hand: [malignRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniWebOfDeceit);

    Arakni.must.playAttack(malignRed);
    game.advanceCombatTo("reaction");

    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: a stealth hit on a marked hero grants go again (AP refund)", () => {
    const game = FabTestEngine.start(
      { hero: arakniWebOfDeceit, hand: [malignRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, marked: true, deck: 6 },
    );
    const Arakni = game.as(arakniWebOfDeceit);
    const Opponent = game.as(dash);

    Arakni.must.playAttack(malignRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // The printed on-hit rider grants go again, refunding the spent action point.
    expectFabPlayer(Opponent).toHaveLife(16);
    expectFabPlayer(Arakni).toHaveAP(1);
  });
});
