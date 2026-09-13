import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { cromai } from "../allies/cromai.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bonePuppetry } from "./bone-puppetry.ts";

describe("Bone Puppetry (PEN151) AAA", () => {
  it("happy: defending returns a graveyard ally, which the end phase destroys", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      {
        hero: dash,
        hand: [snatchRed],
        arms: [bonePuppetry],
        graveyard: [cromai],
        life: 20,
        deck: 6,
      },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.playAttack(snatchRed);
    Dash.defendWith(bonePuppetry);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Dash, cromai).toBeIn("arena");
    // Blade Break recycles the defending puppetry at chain close.
    expectFabCard(Dash, bonePuppetry).toBeIn("graveyard");

    Blaze.endTurn();
    // The delayed end-phase leg destroys the ally and discards Dash's hand.
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
    expectFabCard(Dash, cromai).toBeIn("graveyard");
  });

  it("boundary: declining leaves the graveyard alone", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      {
        hero: dash,
        hand: [],
        arms: [bonePuppetry],
        graveyard: [cromai],
        life: 20,
        deck: 6,
      },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.playAttack(snatchRed);
    Dash.defendWith(bonePuppetry);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, cromai).toBeIn("graveyard");
    expectFabCard(Dash, bonePuppetry).toBeIn("graveyard");
  });
});
