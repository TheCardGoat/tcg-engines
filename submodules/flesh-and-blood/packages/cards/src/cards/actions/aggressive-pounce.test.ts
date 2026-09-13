import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinarRecklessRampage } from "../heroes/rhinar-reckless-rampage.ts";
import { packHuntRed } from "./pack-hunt.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { aggressivePounceRed } from "./aggressive-pounce.ts";

describe("Aggressive Pounce (PEN009) AAA", () => {
  it("happy: if you have intimidated an opponent this turn, this gets go again", () => {
    // Pack Hunt intimidates on attack and has go again? Check - if not, use smash instinct then pounce with extra AP.
    // Simpler: smash-instinct intimidates on attack; finish that link, then pounce.
    // Pack Hunt: on attack intimidate. Use that as first attack with go-again grant via...
    // Seed: play pack hunt (intimidate), resolve with enough AP for pounce.
    const game = FabTestEngine.start(
      {
        hero: rhinarRecklessRampage,
        hand: [packHuntRed, aggressivePounceRed],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinarRecklessRampage);

    Rhinar.attackWith(packHuntRed);
    game.helpers.resolveUntilIdle();
    // intimidate has fired; combat may still be open or closed
    if (game.combat()?.open) {
      game.helpers.resolveRestOfCombat();
    }
    Rhinar.attackWith(aggressivePounceRed);

    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("boundary: without intimidate this turn it attacks at printed 6 and does not have go again", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinarRecklessRampage,
        hand: [aggressivePounceRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );

    game.as(rhinarRecklessRampage).attackWith(aggressivePounceRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
  });
});
