import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prismAwakenerOfSol } from "../heroes/prism-awakener-of-sol.ts";
import { snatchRed } from "./snatch.ts";
import { heraldOfVictoriaYellow } from "./herald-of-victoria.ts";

/**
 * Herald of Victoria (PEN177) — Light Illusionist Attack yellow 7{p}.
 *
 * Printed Instant: Discard this: Until end of turn, attack action cards your
 * opponents control get -1{p} while attacking and defending.
 */

describe("Herald of Victoria (PEN177) AAA", () => {
  it("happy: discard this so an opposing attacking action is -1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: prismAwakenerOfSol, hand: [heraldOfVictoriaYellow], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Prism = game.as(prismAwakenerOfSol);

    Dash.playAttack(snatchRed);
    Prism.defendWith();
    Dash.pass();
    Prism.activate(heraldOfVictoriaYellow);
    game.passBoth();

    expectFabCard(Prism, heraldOfVictoriaYellow).toBeIn("graveyard");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: the controller's own attacking action is not reduced", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        hand: [heraldOfVictoriaYellow, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.activate(heraldOfVictoriaYellow);
    game.untilIdle({ ordering: "listed" });
    Prism.playAttack(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the -1{p} expires at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: prismAwakenerOfSol, hand: [heraldOfVictoriaYellow], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Prism = game.as(prismAwakenerOfSol);

    Dash.pass();
    Prism.activate(heraldOfVictoriaYellow);
    game.untilIdle({ ordering: "listed" });
    Dash.endTurn();
    game.as(prismAwakenerOfSol).endTurn();
    Dash.playAttack(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
  });
});
