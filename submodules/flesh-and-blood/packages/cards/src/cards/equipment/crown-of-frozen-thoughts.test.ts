import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { crownOfFrozenThoughts } from "./crown-of-frozen-thoughts.ts";

describe("Crown of Frozen Thoughts (PEN227) AAA", () => {
  it("happy: defending freezes the attacking hero; Blade Break recycles the crown", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { hero: dash, head: [crownOfFrozenThoughts], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.playAttack(snatchRed);
    Dash.defendWith(crownOfFrozenThoughts);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Blaze, blazeFiremind).toBeFrozen();
    expectFabCard(Dash, crownOfFrozenThoughts).toBeIn("graveyard");
  });

  it("boundary: without defending, the crown stays armed and the attacker runs free", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { hero: dash, head: [crownOfFrozenThoughts], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.playAttack(snatchRed);
    Dash.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, crownOfFrozenThoughts).toBeIn("head");
    expectFabCard(Blaze, blazeFiremind).notToBeFrozen();
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
