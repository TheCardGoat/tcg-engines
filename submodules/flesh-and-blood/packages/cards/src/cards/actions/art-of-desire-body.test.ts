import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { arakni } from "../heroes/arakni.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { artOfDesireBodyRed } from "./art-of-desire-body.ts";

describe("Art of Desire: Body (MST106) AAA", () => {
  it("happy: hitting a hero banishes the top card; a red banished card draws and gains 1{h}", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [artOfDesireBodyRed], life: 20, actionPoints: 1, deck: 6 },
      { hero: dash, deck: [snatchRed], life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.attackWith(artOfDesireBodyRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabCard(game.as(dash), snatchRed).toBeBanished();
    expectFabPlayer(Arakni).toHaveHandCount(1);
    expectFabPlayer(Arakni).toHaveLife(21);
  });

  it("boundary: banishing a non-red card does not draw or gain life", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [artOfDesireBodyRed], life: 20, actionPoints: 1, deck: 6 },
      { hero: dash, deck: [nimblismBlue], life: 20 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.attackWith(artOfDesireBodyRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(game.as(dash), nimblismBlue).toBeBanished();
    expectFabPlayer(Arakni).toHaveHandCount(0);
    expectFabPlayer(Arakni).toHaveLife(20);
  });
});
