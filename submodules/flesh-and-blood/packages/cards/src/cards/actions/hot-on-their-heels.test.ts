import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { prowlBlue } from "./prowl.ts";
import { dash } from "../heroes/dash.ts";
import { disableRed } from "./disable.ts";
import { cindra } from "../heroes/cindra.ts";
import { huntToTheEndsOfRatheRed } from "./hunt-to-the-ends-of-rathe.ts";
import { hotOnTheirHeelsRed } from "./hot-on-their-heels.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Hot on Their Heels (CIN014) AAA", () => {
  it("after two Draconic links, marks the defending hero on hit and gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [huntToTheEndsOfRatheRed, huntToTheEndsOfRatheRed, hotOnTheirHeelsRed, prowlBlue],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Cindra = game.as(cindra);

    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(hotOnTheirHeelsRed);
    game.advanceCombatTo("resolution");

    expect(Cindra.actionPoints()).toBe(1);
    Cindra.attackWith(prowlBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Cindra creates Fealty when a later attack hits the hero Hot marked.
    expect(Cindra.zone("arena")).toContain("token:fealty");
  });

  it("a fully defended qualified attack does not mark the hero", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [huntToTheEndsOfRatheRed, huntToTheEndsOfRatheRed, hotOnTheirHeelsRed, prowlBlue],
        deck: 6,
      },
      { hero: dash, hand: [disableRed], life: 20, deck: 6 },
      manual,
    );
    const Cindra = game.as(cindra);
    const Dash = game.as(dash);

    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(hotOnTheirHeelsRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([disableRed]);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expect(Cindra.actionPoints()).toBe(1);
    Cindra.attackWith(prowlBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expect(Cindra.zone("arena")).not.toContain("token:fealty");
  });
  it("before two Draconic links, a hit does not mark the hero", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [hotOnTheirHeelsRed, prowlBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      manual,
    );
    const Cindra = game.as(cindra);

    Cindra.attackWith(hotOnTheirHeelsRed);
    game.helpers.resolveRestOfCombat();
    Cindra.attackWith(prowlBlue);
    game.helpers.resolveRestOfCombat();

    expect(game.as(dash).life()).toBe(16); // Hot 3 + Prowl Blue 1, no mark/Fealty
    expect(Cindra.zone("arena")).not.toContain("token:fealty");
  });
});
