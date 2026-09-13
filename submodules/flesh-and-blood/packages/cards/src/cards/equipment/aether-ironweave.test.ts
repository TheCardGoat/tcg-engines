import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { aetherIronweave } from "./aether-ironweave.ts";

describe("Aether Ironweave (CHN005) AAA", () => {
  it("happy: after an attack action and a non-attack action, destroy this for 2 resources", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        chest: [aetherIronweave],
        hand: [nimblismBlue, snatchRed],
        actionPoints: 2,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Viserai.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    Viserai.activate(aetherIronweave);
    game.helpers.resolveUntilIdle();

    expectFabCard(Viserai, aetherIronweave).toBeIn("graveyard");
    expectFabPlayer(Viserai).toHaveResourceCount(2);
  });

  it("boundary: only an attack action this turn does not unlock the activation", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        chest: [aetherIronweave],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    Viserai.expectActivationRejected(aetherIronweave);
    expectFabCard(Viserai, aetherIronweave).toBeIn("chest");
  });

  it("timing: Battleworn d1 stays seated after defending", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: viserai, life: 20, chest: [aetherIronweave], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    game.as(bravo).attackWith(snatchRed);
    Viserai.defendWith(aetherIronweave);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Viserai, aetherIronweave).toBeIn("chest");
    expectFabCard(Viserai, aetherIronweave).toHaveDefenseCounters(-1);
    expectFabPlayer(Viserai).toHaveLife(17);
  });
});
