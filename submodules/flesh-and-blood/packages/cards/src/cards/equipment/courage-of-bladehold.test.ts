import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { courageOfBladehold } from "./courage-of-bladehold.ts";

/**
 * Courage of Bladehold (CRU081) — Warrior Chest d2, Temper.
 * Printed: "Action - Destroy Courage of Bladehold: Your sword attacks cost
 * {r} less this turn. Go again. Temper"
 * Cintari Saber's printed activation is {r}, so the discount makes it free.
 */

describe("Courage of Bladehold (CRU081) AAA", () => {
  it("happy: destroying the courage makes the sword attack free and keeps the AP", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        chest: [courageOfBladehold],
        weapon1: [cintariSaber],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(courageOfBladehold);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Kassai, courageOfBladehold).toBeIn("graveyard");
    // Printed Go again refunds the action point the activation cost.
    expectFabPlayer(Kassai).toHaveAP(1);

    Kassai.activate(cintariSaber);
    game.advanceCombatTo("defend");
    // 1{r} activation minus the discount is free.
    expectFabPlayer(Kassai).toHaveResourceCount(1);
    game.helpers.resolveRestOfCombat();
  });

  it("boundary: without the courage the same saber attack costs its 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        chest: [courageOfBladehold],
        weapon1: [cintariSaber],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(cintariSaber);
    game.advanceCombatTo("defend");
    expectFabCard(Kassai, courageOfBladehold).toBeIn("chest");
    expectFabPlayer(Kassai).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();
  });
});
