import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { snatchRed } from "./snatch.ts";
import { crackedBaubleYellow } from "../resources/cracked-bauble.ts";
import { soulBondBeliefRed } from "./soul-bond-belief.ts";

describe("Soul Bond Belief (PEN186) AAA", () => {
  it("happy: revealing a yellow puts it into soul and this gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [soulBondBeliefRed],
        actionPoints: 1,
        deckTop: [crackedBaubleYellow],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(soulBondBeliefRed, { stopAt: "on-attack" });
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expect(Prism.zone("soul")).toContain(crackedBaubleYellow.canonicalId);
  });

  it("boundary: revealing a red does not put it into soul", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [soulBondBeliefRed],
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(soulBondBeliefRed);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ ordering: "listed" });
    expect(Prism.zone("soul")).toHaveLength(0);
  });
});
