import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { barnacleYellow } from "./barnacle.ts";
import { snatchRed } from "./snatch.ts";
import { gallowEndOfTheLineYellow } from "./gallow-end-of-the-line.ts";

describe("Gallow, End of the Line (SUP267) AAA", () => {
  it("happy: Instant lockout stops opponent on-hit effects this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: [barnacleYellow], actionPoints: 1 },
      {
        hero: gravyBones,
        arena: [gallowEndOfTheLineYellow],
        hand: [barnacleYellow],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Gravy = game.as(gravyBones);

    Dash.pass();
    Gravy.activate(gallowEndOfTheLineYellow, {
      abilityId: `${gallowEndOfTheLineYellow.canonicalId}:instantDiscardWateryGraveUntilEndTurnEffectsControlled`,
    });
    game.helpers.resolveUntilIdle();

    Dash.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(Dash.handCount()).toBe(0);
  });

  it("boundary: without the Instant, Snatch still draws on hit", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: [barnacleYellow], actionPoints: 1 },
      { hero: gravyBones, arena: [gallowEndOfTheLineYellow], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, barnacleYellow).toBeIn("hand");
  });

  it("timing: tap-Attack opens combat and returns Gallow to the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [gallowEndOfTheLineYellow],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(gallowEndOfTheLineYellow, {
      abilityId: `${gallowEndOfTheLineYellow.canonicalId}:actionAttack`,
    });
    game.passBoth();
    expect(Gravy.zone("combatChain")).toContain(gallowEndOfTheLineYellow.canonicalId);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Gravy, gallowEndOfTheLineYellow).toBeIn("arena");
  });
});
