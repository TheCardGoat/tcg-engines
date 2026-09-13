import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { crackleFromAfarBlue } from "./crackle-from-afar.ts";

describe("Crackle from Afar (AZS026) AAA", () => {
  it("happy: entering the arena from an Instant play", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [snatchRed, crackleFromAfarBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
    game.toReaction("attacker");
    Prism.play(crackleFromAfarBlue);
    game.passBoth();
    Prism.target(snatchRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);

    expectFabCard(Prism, crackleFromAfarBlue).toBeIn("arena");
    expectCombat(game).toBeOpen();
  });

  it("boundary: declining the up-to leaves printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [snatchRed, crackleFromAfarBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(snatchRed);
    game.toReaction("attacker");
    Prism.play(crackleFromAfarBlue);
    game.passBoth();
    Prism.target();
    game.passBoth();

    expectFabCard(Prism, crackleFromAfarBlue).toBeIn("arena");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: with no attack, the aura still enters", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [crackleFromAfarBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(crackleFromAfarBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, crackleFromAfarBlue).toBeIn("arena");
    expectCombat(game).toBeClosed();
  });
});
