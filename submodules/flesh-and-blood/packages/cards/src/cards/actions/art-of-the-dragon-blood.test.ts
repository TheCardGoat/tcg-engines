import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";

import { snatchRed } from "./snatch.ts";
import { artOfTheDragonBloodRed } from "./art-of-the-dragon-blood.ts";

describe("Art of the Dragon Blood (HNT071) AAA", () => {
  it("happy: attacking with this refunds AP from printed go again", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [artOfTheDragonBloodRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(artOfTheDragonBloodRed, { stopAt: "on-attack" });
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Katsu).toHaveAP(1);
  });

  it("boundary: without Draconic, printed go again still refunds but the rider does not fire extra", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [artOfTheDragonBloodRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(artOfTheDragonBloodRed);
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Katsu).toHaveAP(1);
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [artOfTheDragonBloodRed], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Katsu = game.as(katsu);

    Dash.playAttack(snatchRed);
    game.toReaction();
    expect(() => Katsu.play(artOfTheDragonBloodRed)).toThrow();
    expectFabCard(Katsu, artOfTheDragonBloodRed).toBeIn("hand");
  });
});
