import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { cerebellumProcessorBlue } from "./cerebellum-processor.ts";
import { maxxNitro } from "../heroes/maxx-nitro.ts";
import { banksy } from "../weapons/banksy.ts";
import { clampPressBlue } from "./clamp-press.ts";

describe("Clamp Press (AMX026) AAA", () => {
  it("happy: wrenches you control get +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        weapon1: [banksy],
        hand: [clampPressBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxNitro);

    Maxx.play(clampPressBlue);
    game.untilIdle();
    Maxx.activateAttack(banksy, { stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: without Clamp Press, Bank Breaker stays printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        weapon1: [banksy],
        hand: [cerebellumProcessorBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxNitro);
    Maxx.play(cerebellumProcessorBlue);
    game.untilIdle();
    Maxx.activateAttack(banksy, { stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: start of your turn you may keep this by removing steam; opponent start does not destroy it", () => {
    const game = FabTestEngine.start(
      {
        hero: maxxNitro,
        arena: [{ card: clampPressBlue, state: { steamCounters: 1 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Maxx = game.as(maxxNitro);

    Maxx.endTurn();
    game.untilIdle();
    expectFabCard(Maxx, clampPressBlue).toBeIn("arena");

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Maxx, clampPressBlue).toBeIn("arena");
    expectFabCard(Maxx, clampPressBlue).toHaveCounters(0, "steam");
  });
});
