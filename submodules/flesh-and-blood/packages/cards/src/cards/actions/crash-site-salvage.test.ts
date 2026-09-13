import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { snatchRed } from "./snatch.ts";
import { crashSiteSalvageYellow } from "./crash-site-salvage.ts";

describe("Crash Site Salvage (OMN239) AAA", () => {
  it("boundary: without scrap this still attacks at 3{p} (printed go again refunds AP)", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [crashSiteSalvageYellow],
        graveyard: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(crashSiteSalvageYellow);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ ordering: "listed" });
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: teklovossen, hand: [crashSiteSalvageYellow], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    game.as(dash).playAttack(snatchRed);
    game.toReaction();
    expect(() => game.as(teklovossen).play(crashSiteSalvageYellow)).toThrow();
    expectFabCard(game.as(teklovossen), crashSiteSalvageYellow).toBeIn("hand");
  });
});
