import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { copperCogBlue } from "./copper-cog.ts";
import { nimblismBlue } from "./nimblism.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { gearTurnerRed } from "./gear-turner.ts";

/**
 * Gear Turner (OMN235) — Mechanologist Attack. Red cost 1, 5{p}/3{d}.
 * When this hits, you may search your deck for a cog, put it into the arena, then shuffle.
 */

describe("Gear Turner (OMN235) AAA", () => {
  it("happy: when this hits, search a Cog into the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [gearTurnerRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
        deckTop: [copperCogBlue],
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(gearTurnerRed);
    game.helpers.resolveUntilIdle({
      optionals: "accept",
      entityTargets: "maximum",
      entityTargetCanonicalId: copperCogBlue.canonicalId,
    });

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expect(Teklo.zone("arena")).toContain(copperCogBlue.canonicalId);
  });

  it("boundary: a blocked miss does not search a Cog", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [gearTurnerRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
        deckTop: [copperCogBlue],
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, wreckerRompBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Dash = game.as(dash);

    Teklo.playAttack(gearTurnerRed);
    Dash.defendWith(nimblismBlue, wreckerRompBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Teklo.zone("deck")).toContain(copperCogBlue.canonicalId);
  });

  it("timing: declining the search leaves the Cog in the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [gearTurnerRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
        deckTop: [copperCogBlue],
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(gearTurnerRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabCard(Teklo, gearTurnerRed).toBeIn("graveyard");
    expect(Teklo.zone("deck")).toContain(copperCogBlue.canonicalId);
  });
});
