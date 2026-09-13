import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { cartilageCrushYellow } from "./cartilage-crush.ts";
import { snatchRed } from "./snatch.ts";
import { stonewallConfidenceRed } from "./stonewall-confidence.ts";

/**
 * Stonewall Confidence (WTR072) — Guardian Action Aura, cost 2, go again.
 *
 * Printed: Cards you control with cost 3 or more get +4{d} while defending.
 * At the beginning of your action phase, destroy this.
 */

describe("Stonewall Confidence (WTR072) AAA", () => {
  it("happy: a cost-3+ card you control gets +4{d} while defending vs Snatch", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [stonewallConfidenceRed, cartilageCrushYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(stonewallConfidenceRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, stonewallConfidenceRed).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveAP(1);
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Dash.playAttack(snatchRed);
    Bravo.defendWith(cartilageCrushYellow);

    expectFabCard(Bravo, cartilageCrushYellow).toHaveDefense(7);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("boundary: a cost-2 defender does not get the +4{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [stonewallConfidenceRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(stonewallConfidenceRed);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Dash.playAttack(snatchRed);
    Bravo.defendWith(brutalAssaultBlue);

    expectFabCard(Bravo, brutalAssaultBlue).toHaveDefense(3);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("timing: beginning of your next action phase destroys the aura and the {d} bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [stonewallConfidenceRed, cartilageCrushYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(stonewallConfidenceRed);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Bravo, stonewallConfidenceRed).toBeIn("arena");

    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, stonewallConfidenceRed).toBeIn("graveyard");

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.playAttack(snatchRed);
    Bravo.defendWith(cartilageCrushYellow);

    expectFabCard(Bravo, cartilageCrushYellow).toHaveDefense(3);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Bravo).toHaveLife(19);
  });
});
