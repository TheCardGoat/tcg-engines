import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { riftedTormentRed } from "./rifted-torment.ts";

/**
 * Rifted Torment (CHN012) — Shadow Runeblade Action-Attack, cost 2, 4{p}.
 *
 * Printed: "You may play Rifted Torment from your banished zone. If you do,
 * deal 1 arcane damage to target hero. Blood Debt"
 *
 * Not Rune Gate — the play-static is a zone permission, paid at printed cost.
 */

describe("Rifted Torment (CHN012) AAA", () => {
  it("boundary: from hand does not deal the bonus 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [riftedTormentRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.attackWith(riftedTormentRed);

    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Viserai).toHaveLife(20);
  });

  it("timing: Blood Debt loses 1 life at the end phase while banished", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [],
        banished: [riftedTormentRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6, life: 20 },
      FAB_MANUAL_HARNESS,
    );

    game.as(viserai).endTurn();
    expectFabPlayer(game.as(viserai)).toHaveLife(19);
  });
});
