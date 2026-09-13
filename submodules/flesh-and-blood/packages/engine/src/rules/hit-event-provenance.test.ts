import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, scarForAScarRed, snatchRed } from "./fixtures.ts";
import { shroudOfDarkness } from "../../../cards/src/cards/equipment/shroud-of-darkness.ts";
import { decimatorGreatAxe } from "../../../cards/src/cards/weapons/decimator-great-axe.ts";
import { fangDracaiOfBlades } from "../../../cards/src/cards/heroes/fang-dracai-of-blades.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("finalized hit-event provenance", () => {
  it.each([
    ["attack action", false, true],
    ["weapon proxy", true, true],
    ["unmarked weapon boundary", true, false],
  ] as const)("preserves hero status for a %s hit", (_label, weapon, marked) => {
    const game = FabTestEngine.start(
      {
        hero: fangDracaiOfBlades,
        weapon1: weapon ? [decimatorGreatAxe] : undefined,
        hand: weapon ? [] : [snatchRed],
        actionPoints: 1,
        resourcePoints: weapon ? 3 : 0,
        deck: 6,
      },
      { hero: dash, marked, deck: 6 },
      manual,
    );
    const Fang = game.as(fangDracaiOfBlades);

    if (weapon) Fang.activate(decimatorGreatAxe);
    else Fang.attackWith(snatchRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    const hits = game.committedEvents().filter((event) => event.name === "hit");
    expect(hits).toEqual([
      expect.objectContaining({
        data: marked
          ? expect.objectContaining({ targetWasMarked: true })
          : expect.not.objectContaining({ targetWasMarked: true }),
      }),
    ]);
    expect(Fang.zone("arena").filter((card) => card === "token:fealty")).toHaveLength(
      marked ? 1 : 0,
    );
  });

  it("journals the active attack's exact post-prevention target damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [scarForAScarRed, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        deck: 6,
      },
      {
        hero: bravo,
        head: [shroudOfDarkness],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        life: 20,
        deck: 6,
      },
      manual,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(scarForAScarRed);
    game.advanceToDecision(Bravo, "option");
    const prevention = Bravo.expectDecision("option");
    Bravo.chooseOptions(prevention.options[0]!.id);
    game.helpers.resolveRestOfCombat();

    expect(Bravo.life()).toBe(18);
    expect(game.committedEvents().filter((event) => event.name === "hit")).toEqual([
      expect.objectContaining({
        data: expect.objectContaining({ damage: 2 }),
      }),
    ]);
    expect(game.committedEvents().filter((event) => event.name === "dealt-damage")).toEqual([
      expect.objectContaining({
        data: expect.objectContaining({ amount: 2 }),
      }),
    ]);
  });
});
