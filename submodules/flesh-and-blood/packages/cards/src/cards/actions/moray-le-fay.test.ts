import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { barnacleYellow } from "./barnacle.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { morayLeFayYellow } from "./moray-le-fay.ts";

describe("Moray Le Fay (SEA051) AAA", () => {
  it("happy: Instant puts a +1{p} counter on target ally", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [morayLeFayYellow, barnacleYellow],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(morayLeFayYellow, {
      abilityId: "HNFBzNgGjf6JnH9h6PKFJ:instantResourceTapPut1PowerCounterTargetAlly",
    });
    game.advanceToDecision(Gravy, "entity-target");
    Gravy.chooseTargets(barnacleYellow);
    game.passBoth();

    expectFabCard(Gravy, barnacleYellow).toHavePower(5);
    expectFabCard(Gravy, morayLeFayYellow).toBeTapped();
  });

  it("boundary: a tapped Moray cannot fire the Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [morayLeFayYellow],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(morayLeFayYellow, {
      abilityId: "HNFBzNgGjf6JnH9h6PKFJ:actionTapAttack",
    });
    game.helpers.resolveRestOfCombat();
    expect(() =>
      Gravy.activate(morayLeFayYellow, {
        abilityId: "HNFBzNgGjf6JnH9h6PKFJ:instantResourceTapPut1PowerCounterTargetAlly",
      }),
    ).toThrow();
    expectFabCard(Gravy, morayLeFayYellow).toHavePower(0);
  });

  it("timing: tap-Attack opens combat and returns Moray to the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        arena: [morayLeFayYellow],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(morayLeFayYellow, {
      abilityId: "HNFBzNgGjf6JnH9h6PKFJ:actionTapAttack",
    });
    game.passBoth();
    expect(Gravy.zone("combatChain")).toContain(morayLeFayYellow.canonicalId);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Gravy, morayLeFayYellow).toBeIn("arena");
  });
});
