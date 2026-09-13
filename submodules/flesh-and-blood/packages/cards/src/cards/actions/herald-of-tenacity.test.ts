import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { soulShieldYellow } from "../defense-reactions/soul-shield.ts";
import { prism } from "../heroes/prism.ts";
import { heraldOfTenacityRed } from "./herald-of-tenacity.ts";

describe("Herald of Tenacity (MON023) AAA", () => {
  it("happy: a hit puts this into your hero's soul", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfTenacityRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(heraldOfTenacityRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabCard(Prism, heraldOfTenacityRed).toBeIn("soul");
  });

  it("boundary: a miss leaves this in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfTenacityRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [soulShieldYellow],
        resourcePoints: 2,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfTenacityRed);
    game.advanceCombatTo("reaction");
    Prism.pass();
    Dash.play(soulShieldYellow);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Prism, heraldOfTenacityRed).toBeIn("graveyard");
  });
});
