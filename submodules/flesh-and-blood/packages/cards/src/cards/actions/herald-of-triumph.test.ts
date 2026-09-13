import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { prism } from "../heroes/prism.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { heraldOfTriumphRed } from "./herald-of-triumph.ts";

describe("Herald of Triumph (MON008) AAA", () => {
  it("happy: a defending AAC has -1{p} and a hit puts this into soul", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfTriumphRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfTriumphRed);
    Dash.defendWith(snatchRed);
    expectFabCard(Dash, snatchRed).toHavePower(3);
    game.closeCombat();
    expectFabCard(Prism, heraldOfTriumphRed).toBeIn("soul");
  });

  it("boundary: a miss does not put this into soul", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfTriumphRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfTriumphRed);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();
    expectFabCard(Prism, heraldOfTriumphRed).toBeIn("graveyard");
  });
});
