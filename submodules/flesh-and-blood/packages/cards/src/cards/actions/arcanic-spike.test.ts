import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { snatchRed } from "./snatch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { arcanicSpikeRed } from "./arcanic-spike.ts";

/**
 * Arcanic Spike (ROS134) — Runeblade Action - Attack, cost 2, 5{p}, 3{d}.
 *
 * Printed: "If you've dealt arcane damage this turn, this gets +2{p}."
 *
 * A seated Runechant pings 1 arcane when an earlier attack action is played
 * (CR 8.6.3). Physical damage alone does not satisfy the clause.
 */

describe("Arcanic Spike (ROS134) AAA", () => {
  it("happy: after dealing arcane this turn, this gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [brutalAssaultBlue, arcanicSpikeRed],
        arena: [fabToken("runechant")],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.must.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    game.closeCombat({ ordering: "listed" });

    Viserai.must.playAttack(arcanicSpikeRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: without arcane damage this turn, this stays printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [arcanicSpikeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(arcanicSpikeRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(5);
  });

  it("timing: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: viserai, hand: [arcanicSpikeRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Viserai = game.as(viserai);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Viserai.defendWith([arcanicSpikeRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Viserai).toHaveLife(19);
    expectFabCard(Viserai, arcanicSpikeRed).toBeIn("graveyard");
  });
});
