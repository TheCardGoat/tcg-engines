import { describe, expect, it } from "vitest";
import { expectFabCard, expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { eyeOfOphidiaBlue } from "../resources/eye-of-ophidia.ts";
import { dash } from "../heroes/dash.ts";
import { beastWithinYellow } from "./beast-within.ts";
import { swingBigRed } from "./swing-big.ts";
import { pulpingRed } from "./pulping.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { rhinarRecklessRampage } from "../heroes/rhinar-reckless-rampage.ts";
import { snatchRed } from "./snatch.ts";
import { bloodrushBellowYellow } from "./bloodrush-bellow.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

function startBloodrush(seed: string): FabTestEngine {
  return FabTestEngine.start(
    {
      hero: rhinarRecklessRampage,
      hand: [swingBigRed, bloodrushBellowYellow, eyeOfOphidiaBlue, beastWithinYellow],
      arsenal: [pulpingRed],
      resourcePoints: 3,
      deck: [
        wreckerRompBlue,
        wreckerRompBlue,
        wreckerRompBlue,
        wreckerRompBlue,
        wreckerRompBlue,
        wreckerRompBlue,
        wreckerRompBlue,
        wreckerRompBlue,
      ],
    },
    { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
    { ...manual, seed },
  );
}

describe("Bloodrush Bellow (WTR007) public AAA", () => {
  it("draws two, gains go again, and gives Brute attacks +2 after a seeded 6+ discard", () => {
    const game = startBloodrush("rh-h1-4");
    const Rhinar = game.as(rhinarRecklessRampage);
    const Defender = game.as(dash);

    Rhinar.must.play(bloodrushBellowYellow);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Rhinar, beastWithinYellow).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveHandCount(5).toHaveAP(1).toHaveResourceCount(2);
    expectFabPlayer(Defender).toHaveHandCount(3);

    Rhinar.must.playAttack(swingBigRed);
    game.advanceCombatTo("defend");
    Defender.must.defend();
    expect(game.combat()?.activeLink?.attackPower).toBe(10);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Defender).toHaveLife(10);
    expect(Rhinar.zone("arsenal")).toEqual([pulpingRed.canonicalId]);
    Rhinar.must.endTurn();
    expectFabPlayer(Rhinar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    expectFabPlayer(Defender).toHaveHandCount(4);
  });

  it("does not draw, intimidate, or gain go again after a seeded card without power", () => {
    const game = startBloodrush("rh-h1-7");
    const Rhinar = game.as(rhinarRecklessRampage);
    const Defender = game.as(dash);

    Rhinar.must.play(bloodrushBellowYellow);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Rhinar, eyeOfOphidiaBlue).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveHandCount(2).toHaveAP(0).toHaveResourceCount(2);
    expectFabPlayer(Defender).toHaveHandCount(4);
    expect(() => Rhinar.must.playAttack(swingBigRed)).toThrow();
    expect(Rhinar.zone("arsenal")).toEqual([pulpingRed.canonicalId]);
    Rhinar.must.endTurn();
    expectFabPlayer(Rhinar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
  });
});
