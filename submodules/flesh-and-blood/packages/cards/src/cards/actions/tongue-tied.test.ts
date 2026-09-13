import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { sigilOfSolaceRed } from "../instants/sigil-of-solace.ts";
import { snatchRed } from "./snatch.ts";
import { tongueTiedRed } from "./tongue-tied.ts";

describe("Tongue Tied (ROS222) AAA", () => {
  it("happy: hitting banishes an instant from their arsenal", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [tongueTiedRed], resourcePoints: 3, deck: 6 },
      { hero: bravo, hand: [], arsenal: [sigilOfSolaceRed], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(tongueTiedRed);
    expectCombat(game).toHaveAttackPower(7);
    game.advanceUntil({ stopAt: "idle", optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(13);
    expectFabCard(Bravo, sigilOfSolaceRed).toBeBanished();
  });

  it("boundary: an attack action in arsenal is not banished", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [tongueTiedRed], resourcePoints: 3, deck: 6 },
      { hero: bravo, hand: [], arsenal: [snatchRed], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(tongueTiedRed);
    game.advanceUntil({ stopAt: "idle", optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(13);
    expectFabCard(Bravo, snatchRed).toBeIn("arsenal");
  });

  it("timing: a miss does not banish their arsenal", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [tongueTiedRed], resourcePoints: 3, deck: 6 },
      {
        hero: bravo,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sigilOfSolaceRed],
        life: 20,
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(tongueTiedRed);
    Bravo.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabCard(Bravo, sigilOfSolaceRed).toBeIn("arsenal");
  });
});
