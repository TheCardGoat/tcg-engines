import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { iraScarletRevenger } from "../heroes/ira-scarlet-revenger.ts";
import { dash } from "../heroes/dash.ts";
import { crouchingTiger } from "../actions/crouching-tiger.ts";
import { vipoxRed } from "../actions/vipox.ts";
import { snatchRed } from "../actions/snatch.ts";
import { maulYellow } from "./maul.ts";

/**
 * Maul, Yellow (MST162) — Ninja Attack Reaction, cost 0, 3{d}.
 * Printed: Choose 1 or both;
 *   - Target attack action card with 1 or less base {p} gets +3{p}.
 *   - Target Crouching Tiger gets "When this hits, create 2 Crouching Tigers
 *     in your banished zone. You may play them this turn."
 */

describe("Maul (MST162) AAA", () => {
  it("happy: mode 1 gives an attack action with 1 or less base {p} +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [maulYellow, vipoxRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraScarletRevenger);

    Ira.must.playAttack(vipoxRed);
    game.advanceCombatTo("reaction");
    Ira.must.playReaction(maulYellow, {
      modeIds: ["F7Btpwc6Cgn79D67Hkbpd:chooseAttackModes:boostLowBasePowerAttack"],
    });
    game.passBoth();

    // Vipox base 1 + 3 = 4.
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Ira, maulYellow).toBeIn("graveyard");
  });

  it("boundary: a base-4{p} attack action does not receive mode 1's +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [maulYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraScarletRevenger);

    Ira.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");

    expectFabUnplayable(() =>
      Ira.must.playReaction(maulYellow, {
        modeIds: ["F7Btpwc6Cgn79D67Hkbpd:chooseAttackModes:boostLowBasePowerAttack"],
      }),
    );
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Ira, maulYellow).toBeIn("hand");
  });

  it("timing: mode 2 on-hit creates 2 Crouching Tigers in the banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: iraScarletRevenger,
        hand: [maulYellow, crouchingTiger],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraScarletRevenger);

    Ira.must.playAttack(crouchingTiger);
    game.advanceCombatTo("reaction");
    Ira.must.playReaction(maulYellow, {
      modeIds: [
        "F7Btpwc6Cgn79D67Hkbpd:chooseAttackModes:boostLowBasePowerAttack",
        "F7Btpwc6Cgn79D67Hkbpd:chooseAttackModes:createCrouchingTigersOnHit",
      ],
    });
    game.passBoth();
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ optionals: "decline" });

    expect(
      Ira.zone("banished").filter((id) => id.startsWith("token:crouching-tiger")),
    ).toHaveLength(2);
    expectFabCard(Ira, maulYellow).toBeIn("graveyard");
  });
});
