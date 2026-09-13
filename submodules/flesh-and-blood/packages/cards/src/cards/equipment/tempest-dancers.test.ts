import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tempestDancers } from "./tempest-dancers.ts";

describe("Tempest Dancers (PEN106) AAA", () => {
  it("happy: accepting the leave-arena permission casts an arsenal bolt as an instant", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: blazeFiremind,
        arsenal: [volticBoltRed],
        resourcePoints: 2,
        legs: [tempestDancers],
        life: 20,
        deck: 6,
      },
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Blaze.defendWith(tempestDancers);
    game.closeCombat({ optionals: "accept", ordering: "listed" });
    Dash.pass();
    Blaze.play(volticBoltRed, { from: "arsenal", target: Dash.id });

    expectFabCard(Blaze, tempestDancers).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: declining the permission leaves the bolt an action-only card", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        legs: [tempestDancers],
        life: 20,
        deck: 6,
      },
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Blaze.defendWith(tempestDancers);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabUnplayable(() => Blaze.must.playInstant(volticBoltRed, { target: Dash.id }), /reject/);

    expectFabCard(Blaze, tempestDancers).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
