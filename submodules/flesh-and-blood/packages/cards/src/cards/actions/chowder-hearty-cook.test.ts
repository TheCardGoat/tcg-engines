import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { chowderHeartyCookYellow } from "./chowder-hearty-cook.ts";

describe("Chowder, Hearty Cook (SEA075) AAA", () => {
  it("happy: Instant tap gains 1 life for the controller", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [chowderHeartyCookYellow],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const life = Gravy.life();

    Gravy.activate(chowderHeartyCookYellow, {
      abilityId: `${chowderHeartyCookYellow.canonicalId}:instantGain1`,
    });
    game.passBoth();

    expectFabPlayer(Gravy).toHaveLife(life + 1);
    expectFabCard(Gravy, chowderHeartyCookYellow).toBeTapped();
  });

  it("boundary: a tapped Chowder cannot activate the Instant again", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [chowderHeartyCookYellow],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(chowderHeartyCookYellow, {
      abilityId: `${chowderHeartyCookYellow.canonicalId}:instantGain1`,
    });
    game.passBoth();
    expect(() =>
      Gravy.activate(chowderHeartyCookYellow, {
        abilityId: `${chowderHeartyCookYellow.canonicalId}:instantGain1`,
      }),
    ).toThrow();
  });

  it("timing: tap-Attack opens combat and returns Chowder to the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [chowderHeartyCookYellow],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(chowderHeartyCookYellow, {
      abilityId: `${chowderHeartyCookYellow.canonicalId}:actionAttack`,
    });
    game.passBoth();
    expect(Gravy.zone("combatChain")).toContain(chowderHeartyCookYellow.canonicalId);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Gravy, chowderHeartyCookYellow).toBeIn("arena");
  });
});
