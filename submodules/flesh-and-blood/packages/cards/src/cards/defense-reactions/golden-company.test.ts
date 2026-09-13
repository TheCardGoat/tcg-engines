import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gold } from "../tokens/gold.ts";
import { snatchRed } from "../actions/snatch.ts";
import { hala } from "../heroes/hala.ts";
import { goldenCompanyRed } from "./golden-company.ts";

/**
 * Golden Company, Red (MPW053) — Warrior Defense Reaction.
 *
 * Printed: "You may destroy a Gold you control rather than pay this card's {r} cost."
 * (cost 2, 6{d})
 */

describe("Golden Company family AAA", () => {
  it("happy: destroying a Gold pays the alternative cost and blocks for 6{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      {
        hero: hala,
        hand: [goldenCompanyRed],
        arena: [gold],
        resourcePoints: 0,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Hala = game.as(hala);

    Dash.attackWith(snatchRed);
    game.toReaction("defender");
    Hala.must.playReaction(goldenCompanyRed, { modeIds: ["pay"] });
    game.helpers.resolveRestOfCombat();

    expect(Hala.zone("arena")).not.toContain("token:gold");
    expectFabPlayer(Hala).toHaveLife(20);
    expectFabCard(Hala, goldenCompanyRed).toBeIn("graveyard");
  });

  it("boundary: declining the Gold alternative spends the printed 2{r}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      {
        hero: hala,
        hand: [goldenCompanyRed],
        arena: [gold],
        resourcePoints: 2,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Hala = game.as(hala);

    Dash.attackWith(snatchRed);
    game.toReaction("defender");
    Hala.must.playReaction(goldenCompanyRed, { modeIds: ["decline"] });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Hala, gold).toBeIn("arena");
    expectFabPlayer(Hala).toHaveResourceCount(0);
    expectFabPlayer(Hala).toHaveLife(20);
  });

  it("timing: the defense reaction is in the graveyard after combat closes", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      {
        hero: hala,
        hand: [goldenCompanyRed],
        resourcePoints: 2,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Hala = game.as(hala);

    Dash.attackWith(snatchRed);
    game.toReaction("defender");
    Hala.must.playReaction(goldenCompanyRed);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Hala, goldenCompanyRed).toBeIn("graveyard");
  });
});
