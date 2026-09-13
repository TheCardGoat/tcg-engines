import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { zephyrNeedle } from "../weapons/zephyr-needle.ts";
import { snatchRed } from "../actions/snatch.ts";
import { dangerDigits } from "./danger-digits.ts";

describe("Danger Digits (ARK005) AAA", () => {
  it("happy: destroy this so an unused dagger deals 1 then is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arms: [dangerDigits],
        weapon1: [zephyrNeedle],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.playAttack(snatchRed);
    game.toReaction("attacker");
    Arakni.activate(dangerDigits);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabCard(Arakni, dangerDigits).toBeIn("graveyard");
    expectFabCard(Arakni, zephyrNeedle).toBeIn("graveyard");
  });

  it("boundary: without an off-chain dagger the AR is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arms: [dangerDigits],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.playAttack(snatchRed);
    game.toReaction("attacker");
    Arakni.expectActivationRejected(dangerDigits);
    expectFabCard(Arakni, dangerDigits).toBeIn("arms");
  });

  it("timing: the AR is illegal outside the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arms: [dangerDigits],
        weapon1: [zephyrNeedle],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.expectActivationRejected(dangerDigits);
    expectFabCard(Arakni, dangerDigits).toBeIn("arms");
  });
});
