import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { tuffnut } from "../heroes/tuffnut.ts";
import { dash } from "../heroes/dash.ts";
import { wreckerRompRed } from "./wrecker-romp.ts";
import { packHuntBlue } from "./pack-hunt.ts";
import { snatchRed } from "./snatch.ts";
import { tearLimbFromLimbBlue } from "./tear-limb-from-limb.ts";

const wreckerDeck = [
  wreckerRompRed,
  wreckerRompRed,
  wreckerRompRed,
  wreckerRompRed,
  wreckerRompRed,
  wreckerRompRed,
];

describe("Tear Limb from Limb (MON222) AAA", () => {
  it("happy: a 6+{p} discard doubles the next Brute attack-action's power", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [tearLimbFromLimbBlue],
        arsenal: [packHuntBlue],
        deck: wreckerDeck,
        resourcePoints: 4,
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(tearLimbFromLimbBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Tuffnut, wreckerRompRed).toBeIn("graveyard");
    expectFabPlayer(Tuffnut).toHaveAP(1);

    Tuffnut.attackWith(packHuntBlue, { from: "arsenal" });
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
  });

  it("boundary: discarding a 4{p} card does not buff the next Brute attack-action", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [tearLimbFromLimbBlue],
        arsenal: [packHuntBlue],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        resourcePoints: 4,
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(tearLimbFromLimbBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Tuffnut, snatchRed).toBeIn("graveyard");

    Tuffnut.attackWith(packHuntBlue, { from: "arsenal" });
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: a non-Brute attack-action does not receive +X{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [tearLimbFromLimbBlue],
        arsenal: [snatchRed],
        deck: wreckerDeck,
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(tearLimbFromLimbBlue);
    game.helpers.resolveUntilIdle();

    Tuffnut.attackWith(snatchRed, { from: "arsenal" });
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });
});
