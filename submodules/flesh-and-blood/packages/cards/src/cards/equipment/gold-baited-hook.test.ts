import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gold } from "../tokens/gold.ts";
import { rustyHarpoonBlue } from "../actions/rusty-harpoon.ts";
import { scurvStowaway } from "../heroes/scurv-stowaway.ts";
import { goldBaitedHook } from "./gold-baited-hook.ts";
import { hammerheadHarpoonCannon } from "../weapons/hammerhead-harpoon-cannon.ts";

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("Gold-Baited Hook (SEA125) AAA", () => {
  it("steals the opposing Gold when the next Pirate attack hits", () => {
    const game = FabTestEngine.start(
      {
        hero: scurvStowaway,
        arms: [goldBaitedHook],
        weapon1: [hammerheadHarpoonCannon],
        arsenal: [rustyHarpoonBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, arena: [gold], deck: 6 },
      manual,
    );
    const Scurv = game.as(scurvStowaway);
    const Dash = game.as(dash);

    const opposingGold = Dash.cardIn("arena", gold);
    Scurv.activate(goldBaitedHook);
    game.passBoth();
    Scurv.attackWith(rustyHarpoonBlue, { from: "arsenal" });
    game.advanceCombatTo("resolution");
    if (game.pendingDecision()?.kind === "entity-target") Scurv.target(opposingGold);
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("arena")).not.toContain(gold.canonicalId);
    expect(Scurv.zone("arena")).toContain(gold.canonicalId);
    Scurv.endTurn();
    expectFabCard(Scurv, goldBaitedHook).toBeIn("arms");
  });

  it("creates Gold when the defending hero controls none", () => {
    const game = FabTestEngine.start(
      {
        hero: scurvStowaway,
        arms: [goldBaitedHook],
        weapon1: [hammerheadHarpoonCannon],
        arsenal: [rustyHarpoonBlue],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      manual,
    );

    const Scurv = game.as(scurvStowaway);
    Scurv.activate(goldBaitedHook);
    game.passBoth();
    Scurv.attackWith(rustyHarpoonBlue, { from: "arsenal" });
    game.helpers.resolveRestOfCombat();

    expect(game.as(scurvStowaway).zone("arena")).toContain("token:gold");
  });

  it("destroys itself at end phase when its granted hit ability did not make Gold", () => {
    const game = FabTestEngine.start(
      { hero: scurvStowaway, arms: [goldBaitedHook], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Scurv = game.as(scurvStowaway);

    Scurv.activate(goldBaitedHook);
    game.passBoth();
    Scurv.endTurn();
    game.helpers.resolveUntilIdle();

    expect(Scurv.zone("arms")).not.toContain(goldBaitedHook.canonicalId);
    expect(Scurv.zone("graveyard")).toContain(goldBaitedHook.canonicalId);
  });

  it("cannot activate again while tapped", () => {
    const game = FabTestEngine.start(
      { hero: scurvStowaway, arms: [goldBaitedHook], actionPoints: 2, deck: 6 },
      { hero: dash, deck: 6 },
      manual,
    );
    const Scurv = game.as(scurvStowaway);

    Scurv.activate(goldBaitedHook);
    game.passBoth();

    expect(() => Scurv.activate(goldBaitedHook)).toThrow();
  });
});
