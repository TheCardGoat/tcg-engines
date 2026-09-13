import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { flitteringChargeRed } from "../actions/flittering-charge.ts";
import { snatchRed } from "../actions/snatch.ts";
import { lightningFlow } from "../tokens/lightning-flow.ts";
import { stormshatterYellow } from "./stormshatter.ts";

/**
 * Stormshatter, Yellow (OMN191) — Lightning Instant, cost 1.
 * Printed: "You may destroy a Lightning Flow you control rather than pay this
 * card's {r} cost. Target Lightning attack gets -3{p}."
 */

describe("Stormshatter (OMN191) AAA", () => {
  it("happy: destroying a Lightning Flow pays the alternative cost and the Lightning attack gets -3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [stormshatterYellow, flitteringChargeRed],
        arena: [lightningFlow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(flitteringChargeRed);
    game.advanceCombatTo("reaction");
    Briar.play(stormshatterYellow, { modeIds: ["pay"] });
    game.passBoth();

    // Flittering Charge base 4 − 3 = 1.
    expectCombat(game).toHaveAttackPower(1);
    expect(Briar.zone("arena")).not.toContain(lightningFlow.canonicalId);
    expectFabCard(Briar, stormshatterYellow).toBeIn("graveyard");
  });

  it("boundary: a non-Lightning attack is not a legal -3{p} recipient", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [stormshatterYellow, snatchRed],
        arena: [lightningFlow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(snatchRed);
    game.advanceCombatTo("reaction");

    // Illegal Generic target is a silent no-op (ELE125 family): play is accepted
    // and Stormshatter stays in hand; Snatch is unbuffed.
    expectFabUnplayable(() => Briar.play(stormshatterYellow));
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Briar, stormshatterYellow).toBeIn("hand");
    expectFabCard(Briar, lightningFlow).toBeIn("arena");
  });

  it("timing: declining the alternative cost still pays {r} and applies -3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [stormshatterYellow, flitteringChargeRed],
        arena: [lightningFlow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(flitteringChargeRed);
    game.advanceCombatTo("reaction");
    Briar.play(stormshatterYellow, { modeIds: ["decline"] });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(1);
    expectFabCard(Briar, lightningFlow).toBeIn("arena");
  });
});
