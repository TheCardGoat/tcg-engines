import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { flitteringChargeRed } from "../actions/flittering-charge.ts";
import { snatchRed } from "../actions/snatch.ts";
import { lightningFlow } from "../tokens/lightning-flow.ts";
import { stormshardRed } from "./stormshard.ts";

describe("Stormshard (OMN190) AAA", () => {
  it("happy: destroying a Lightning Flow pays the alternative cost and the Lightning attack gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [stormshardRed, flitteringChargeRed],
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
    Briar.play(stormshardRed, { modeIds: ["pay"] });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(7);
    expect(Briar.zone("arena")).not.toContain(lightningFlow.canonicalId);
    expectFabCard(Briar, stormshardRed).toBeIn("graveyard");
  });

  it("boundary: a non-Lightning attack is not a legal +3 recipient", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [stormshardRed, snatchRed],
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

    expect(() => Briar.play(stormshardRed)).toThrow();
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Briar, lightningFlow).toBeIn("arena");
  });

  it("timing: declining the alternative cost still pays {r} and applies +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [stormshardRed, flitteringChargeRed],
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
    Briar.play(stormshardRed, { modeIds: ["decline"] });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(7);
    expectFabCard(Briar, lightningFlow).toBeIn("arena");
  });
});
