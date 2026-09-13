import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { snatchRed } from "../actions/snatch.ts";
import { shroudOfTheFateWatcher } from "./shroud-of-the-fate-watcher.ts";

describe("Shroud of the Fate Watcher (PEN107) AAA", () => {
  it("happy: Blade Break leaves the shroud and creates a Sigil of Fate", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: blazeFiremind, hand: [], head: [shroudOfTheFateWatcher], life: 20, deck: 6 },
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Blaze.defendWith(shroudOfTheFateWatcher);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Blaze, shroudOfTheFateWatcher).toBeIn("graveyard");
    expectFabPlayer(Blaze).toHaveTokenCount("sigil-of-fate", 1);
    expectFabPlayer(Blaze).toHaveLife(16);
  });

  it("boundary: a shroud that stays equipped creates nothing", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: blazeFiremind, hand: [], head: [shroudOfTheFateWatcher], life: 20, deck: 6 },
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Blaze.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Blaze, shroudOfTheFateWatcher).toBeIn("head");
    expectFabPlayer(Blaze).toHaveTokenCount("sigil-of-fate", 0);
    expectFabPlayer(Blaze).toHaveLife(16);
  });
});
