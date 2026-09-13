import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { prowlBlue } from "./prowl.ts";
import { dash } from "../heroes/dash.ts";
import { disableRed } from "./disable.ts";
import { cindra } from "../heroes/cindra.ts";
import { huntToTheEndsOfRatheRed } from "./hunt-to-the-ends-of-rathe.ts";
import { breakingPointRed } from "./breaking-point.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Breaking Point (UPR093) AAA", () => {
  it("at chain link four, hits and destroys every card in the defending hero's arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [
          huntToTheEndsOfRatheRed,
          huntToTheEndsOfRatheRed,
          huntToTheEndsOfRatheRed,
          breakingPointRed,
        ],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, arsenal: [prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Cindra = game.as(cindra);
    const Dash = game.as(dash);

    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(breakingPointRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Dash.life()).toBe(9);
    expect(Dash.zone("arsenal")).not.toContain(prowlBlue.canonicalId);
    expect(Dash.zone("graveyard")).toContain(prowlBlue.canonicalId);
  });
  it("before chain link four, hits without destroying arsenal", () => {
    const game = FabTestEngine.start(
      { hero: cindra, hand: [breakingPointRed], resourcePoints: 1, deck: 6 },
      { hero: dash, arsenal: [prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Cindra = game.as(cindra);
    const Dash = game.as(dash);

    Cindra.attackWith(breakingPointRed);
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(15);
    expect(Dash.zone("arsenal")).toContain(prowlBlue.canonicalId);
  });
  it("a fully defended link-four attack does not destroy arsenal after a later hero hit", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [
          huntToTheEndsOfRatheRed,
          huntToTheEndsOfRatheRed,
          huntToTheEndsOfRatheRed,
          breakingPointRed,
          prowlBlue,
        ],
        actionPoints: 2,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [disableRed, disableRed], arsenal: [prowlBlue], life: 20, deck: 6 },
      manual,
    );
    const Cindra = game.as(cindra);
    const Dash = game.as(dash);

    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(breakingPointRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([disableRed, disableRed]);
    game.advanceCombatTo("resolution");

    expect(Dash.zone("arsenal")).toContain(prowlBlue.canonicalId);
    Cindra.attackWith(prowlBlue);
    game.helpers.resolveUntilIdle();
    expect(Dash.zone("arsenal")).toContain(prowlBlue.canonicalId);
  });
});
