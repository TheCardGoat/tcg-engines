import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { prowlBlue } from "./prowl.ts";
import { snatchRed } from "./snatch.ts";
import { shadowPuppetryRed } from "./shadow-puppetry.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Shadow Puppetry (MON193) AAA", () => {
  it("gives the next attack +1 and go again, then may banish the looked-at top card on hit", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [shadowPuppetryRed, snatchRed], deck: [prowlBlue] },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);

    Bravo.play(shadowPuppetryRed);
    game.passBoth();
    Bravo.attackWith(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    game.advanceToDecision(Bravo, "ordering");
    Bravo.chooseListedOrder();
    game.advanceToDecision(Bravo, "boolean");
    Bravo.chooseBoolean(true);
    game.helpers.resolveRestOfCombat();

    expect(game.as(dash).life()).toBe(15);
    expect(Bravo.zone("banished")).toContain(prowlBlue.canonicalId);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("leaves the looked-at card available for Snatch's later hit-trigger draw when declined", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [shadowPuppetryRed, snatchRed], deck: [prowlBlue] },
      { hero: dash, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);

    Bravo.play(shadowPuppetryRed);
    game.passBoth();
    Bravo.attackWith(snatchRed);
    game.advanceToDecision(Bravo, "ordering");
    Bravo.chooseListedOrder();
    game.advanceToDecision(Bravo, "boolean");
    Bravo.chooseBoolean(false);
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("banished")).not.toContain(prowlBlue.canonicalId);
    expect(Bravo.zone("hand")).toContain(prowlBlue.canonicalId);
  });
});
