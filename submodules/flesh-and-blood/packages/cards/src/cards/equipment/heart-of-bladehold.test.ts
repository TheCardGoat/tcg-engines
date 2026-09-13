import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { heartOfBladehold } from "./heart-of-bladehold.ts";

/**
 * Heart of Bladehold — Warrior Chest d1 Battleworn.
 *
 * Printed: Action - Destroy this: You may activate your second sword attack
 * this turn without paying its {r} cost. Go again
 */

describe("Heart of Bladehold AAA", () => {
  it("happy: the second sword attack this turn does not pay {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        chest: [heartOfBladehold],
        weapon1: [cintariSaber],
        weapon2: [cintariSaber],
        hand: [],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.activate(heartOfBladehold);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Kassai, heartOfBladehold).toBeIn("graveyard");

    Kassai.activate(cintariSaber, { index: 0 });
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Kassai).toHaveResourceCount(2);

    Kassai.activate(cintariSaber, { index: 1 });
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Kassai).toHaveResourceCount(2);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("timing: the first sword attack this turn still pays {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        chest: [heartOfBladehold],
        weapon1: [cintariSaber],
        weapon2: [cintariSaber],
        hand: [],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.activate(heartOfBladehold);
    game.untilIdle({ ordering: "listed" });
    Kassai.activate(cintariSaber, { index: 0 });
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Kassai).toHaveResourceCount(2);
  });

  it("boundary: without this the second saber still costs {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        weapon2: [cintariSaber],
        hand: [],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.activate(cintariSaber, { index: 0 });
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Kassai).toHaveResourceCount(0);

    expectFabUnplayable(
      () => Kassai.activate(cintariSaber, { index: 1 }),
      /activation payment cannot be paid/i,
    );
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });
});
