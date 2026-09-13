import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { cartilageCrushBlue } from "../actions/cartilage-crush.ts";
import { craterFist } from "./crater-fist.ts";

/**
 * Crater Fist (CRU025) — Guardian Arms d2, Temper.
 * Printed: "Action - {r}{r}{r}, destroy Crater Fist: Your attacks with crush
 * gain +2{p} this turn. Go again. Temper"
 * Cartilage Crush (a real Guardian Crush attack) rides the load.
 */

describe("Crater Fist (CRU025) AAA", () => {
  it("happy: the destroyed fist arms the Crush attack with +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [craterFist],
        hand: [cartilageCrushBlue],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(craterFist);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Bravo, craterFist).toBeIn("graveyard");
    // Printed Go again refunds the action point.
    expectFabPlayer(Bravo).toHaveAP(1);

    Bravo.playAttack(cartilageCrushBlue);
    expectCombat(game).toHaveAttackPower(7); // printed 5{p} + 2{p}
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveResourceCount(1); // 7 - 3 (fist) - 3 (crush)
  });

  it("boundary: without the fist the same Crush attack swings for its printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [craterFist],
        hand: [cartilageCrushBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(cartilageCrushBlue);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Bravo, craterFist).toBeIn("arms");
  });
});
