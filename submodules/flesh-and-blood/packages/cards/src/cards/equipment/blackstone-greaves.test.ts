import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { figmentOfRavagesYellow } from "../instants/figment-of-ravages.ts";
import { snatchRed } from "../actions/snatch.ts";
import { blackstoneGreaves } from "./blackstone-greaves.ts";

describe("Blackstone Greaves (PEN096) AAA", () => {
  it("happy: arcane dealt this turn raises the greaves to 2{d} while defending", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: blazeFiremind,
        hand: [figmentOfRavagesYellow],
        resourcePoints: 4,
        legs: [blackstoneGreaves],
        life: 20,
        deck: 6,
      },
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Dash.pass();
    Blaze.play(figmentOfRavagesYellow, { target: Dash.id });
    Dash.playAttack(snatchRed);
    Blaze.defendWith(blackstoneGreaves);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Blaze, blackstoneGreaves).toBeIn("legs");
    expectFabPlayer(Blaze).toHaveLife(18);
  });

  it("boundary: without arcane this turn the greaves defend at printed 1{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: blazeFiremind,
        hand: [],
        legs: [blackstoneGreaves],
        life: 20,
        deck: 6,
      },
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Blaze.defendWith(blackstoneGreaves);
    game.closeCombat({ ordering: "listed" });

    // Temper: defending at 1{d} with no arcane grant recycles the greaves.
    expectFabCard(Blaze, blackstoneGreaves).toBeIn("graveyard");
    expectFabPlayer(Blaze).toHaveLife(17);
  });
});
