import { describe, it } from "vitest";
import {
  FabTestEngine,
  fabToken,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { snatchRed } from "../actions/snatch.ts";
import { glovesOfErasure } from "./gloves-of-erasure.ts";

describe("Gloves of Erasure (PEN109) AAA", () => {
  it("happy: Blade Break leaves the gloves and destroys the target aura token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: blazeFiremind,
        hand: [],
        arms: [glovesOfErasure],
        arena: [fabToken("runechant")],
        life: 20,
        deck: 6,
      },
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Blaze.defendWith(glovesOfErasure);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Blaze, glovesOfErasure).toBeIn("graveyard");
    expectFabPlayer(Blaze).toHaveTokenCount("runechant", 0);
    expectFabPlayer(Blaze).toHaveLife(16);
  });

  it("boundary: gloves that stay equipped leave the aura token alone", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: blazeFiremind,
        hand: [],
        arms: [glovesOfErasure],
        arena: [fabToken("runechant")],
        life: 20,
        deck: 6,
      },
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Blaze.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Blaze, glovesOfErasure).toBeIn("arms");
    expectFabPlayer(Blaze).toHaveTokenCount("runechant", 1);
    expectFabPlayer(Blaze).toHaveLife(16);
  });
});
