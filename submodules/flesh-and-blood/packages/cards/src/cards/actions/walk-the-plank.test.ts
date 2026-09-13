import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { nimblismBlue } from "./nimblism.ts";
import { walkThePlankRed } from "./walk-the-plank.ts";

describe("Walk the Plank (SEA235) AAA", () => {
  it("happy: hitting a Pirate hero taps them", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [walkThePlankRed], resourcePoints: 3, deck: 6 },
      { hero: gravyBones, hand: [], life: 20, deck: 6 },
    );
    const Gravy = game.as(gravyBones);

    game.as(dash).playAttack(walkThePlankRed);
    expectCombat(game).toHaveAttackPower(7);
    game.advanceUntil({ stopAt: "idle", optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Gravy).toHaveLife(13);
    expectFabCard(Gravy, gravyBones).toBeTapped();
    expectFabCard(game.as(dash), walkThePlankRed).toBeIn("graveyard");
  });

  it("boundary: hitting a non-Pirate hero does not tap them", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [walkThePlankRed], resourcePoints: 3, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(walkThePlankRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(13);
    expectFabCard(Bravo, bravo).toBeReady();
  });

  it("timing: a miss against a Pirate hero does not tap them", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [walkThePlankRed], resourcePoints: 3, deck: 6 },
      {
        hero: gravyBones,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
    );
    const Gravy = game.as(gravyBones);

    game.as(dash).playAttack(walkThePlankRed);
    Gravy.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Gravy).toHaveLife(20);
    expectFabCard(Gravy, gravyBones).toBeReady();
  });
});
