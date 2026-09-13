import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { fang } from "../heroes/fang.ts";
import { arakni } from "../heroes/arakni.ts";
import { dash } from "../heroes/dash.ts";
import { forTheRealmRed } from "../actions/for-the-realm.ts";
import { heartOfVengeance } from "./heart-of-vengeance.ts";

/**
 * Heart of Vengeance — Draconic Equipment - Chest, d1 Blade Break.
 *
 * Printed: "Instant - Destroy this: Your next attack this turn that targets
 * Arakni costs {r} less to play or activate."
 */

describe("Heart of Vengeance (HNT145) AAA", () => {
  it("happy: destroy this so the attack targeting Arakni costs {r} less", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        chest: [heartOfVengeance],
        hand: [forTheRealmRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: arakni, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    // For the Realm costs 2{r}: only the destroyed chest's {r} discount
    // makes the seeded single resource point cover it.
    Fang.activate(heartOfVengeance);
    game.helpers.resolveUntilIdle();
    Fang.playAttack(forTheRealmRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Fang).toHaveResourceCount(0);
    expectFabPlayer(game.as(arakni)).toHaveLife(34);
  });

  it("boundary: an attack that does not target Arakni pays full cost", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        chest: [heartOfVengeance],
        hand: [forTheRealmRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.activate(heartOfVengeance);
    game.helpers.resolveUntilIdle();

    // No Arakni on the other seat: the discount never applies and 1{r}
    // cannot pay For the Realm's printed 2{r}.
    expectFabUnplayable(() => Fang.playAttack(forTheRealmRed), /resource|cost|paid/i);
    expectFabPlayer(Fang).toHaveResourceCount(1);
  });
});
