import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { sharpenSteelBlue, sharpenSteelRed, sharpenSteelYellow } from "./sharpen-steel.ts";

const variants = [
  { label: "Sharpen Steel Red (TEA014)", card: sharpenSteelRed, powerBonus: 3 },
  { label: "Sharpen Steel Yellow (WTR142)", card: sharpenSteelYellow, powerBonus: 2 },
  { label: "Sharpen Steel Blue (TEA024)", card: sharpenSteelBlue, powerBonus: 1 },
] as const;

describe.each(variants)("$label AAA", ({ card, powerBonus }) => {
  it("happy: the next weapon attack gains its pitch-scaled power bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [card],
        weapon1: [dawnblade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(card);
    game.untilIdle();
    Dori.activate(dawnblade);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(3 + powerBonus);
  });

  it("boundary: a non-weapon attack is not modified", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [card, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(card);
    game.untilIdle();
    Dori.playAttack(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: a second weapon attack does not reuse Sharpen Steel", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [card],
        weapon1: [cintariSaber],
        weapon2: [cintariSaber],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(kassaiOfTheGoldenSand);

    Dori.play(card);
    game.untilIdle();
    Dori.activate(cintariSaber, { index: 0 });
    game.passBoth();
    game.closeCombat({ optionals: "decline" });
    Dori.activate(cintariSaber, { index: 1 });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(2);
  });
});
