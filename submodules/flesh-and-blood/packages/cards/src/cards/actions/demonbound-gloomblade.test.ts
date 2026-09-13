import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { demonboundGloombladeRed } from "./demonbound-gloomblade.ts";

/**
 * Demonbound Gloomblade, Red (IAR126) — Shadow Runeblade Attack Action.
 *
 * Printed: "You may play this from your banished zone.\nUsurp\nBlood Debt"
 * (cost 0, 3{p}, 3{d})
 */

describe("Demonbound Gloomblade (IAR126) AAA", () => {
  it("happy: the permission plays the card from the banished zone at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [],
        banished: [demonboundGloombladeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.attackWith(demonboundGloombladeRed, { from: "banished" });
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Viserai, demonboundGloombladeRed).toBeIn("graveyard");
  });

  it("boundary: the permission only extends playability — the hand copy is still an ordinary legal play", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [demonboundGloombladeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.attackWith(demonboundGloombladeRed);
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Viserai, demonboundGloombladeRed).toBeIn("graveyard");
  });

  it("timing: Blood Debt — a copy left in banished costs 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      { hero: viserai, hand: [], banished: [demonboundGloombladeRed], life: 20, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.endTurn();
    game.helpers.untilIdle();

    expectFabPlayer(Viserai).toHaveLife(19);
  });
});
