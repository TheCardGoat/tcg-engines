import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tectonicPlating } from "./tectonic-plating.ts";

describe("Tectonic Plating (WTR041) AAA", () => {
  it("happy: pay 1 resource to create a Seismic Surge and keep an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [tectonicPlating],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(tectonicPlating);
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("arena")).toContain("token:seismic-surge");
    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, tectonicPlating).toBeIn("chest");
  });

  it("boundary: once per turn — a second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [tectonicPlating],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(tectonicPlating);
    game.helpers.resolveUntilIdle();
    Bravo.expectActivationRejected(tectonicPlating);
  });

  it("timing: Battleworn d2 stays seated after defending", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, chest: [tectonicPlating], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(tectonicPlating);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Bravo, tectonicPlating).toBeIn("chest");
    expectFabCard(Bravo, tectonicPlating).toHaveDefenseCounters(-1);
    expectFabPlayer(Bravo).toHaveLife(18);
  });
});
