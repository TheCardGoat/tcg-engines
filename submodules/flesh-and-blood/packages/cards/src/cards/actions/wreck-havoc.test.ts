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
import { sinkBelowYellow } from "../defense-reactions/sink-below.ts";
import { wreckHavocRed } from "./wreck-havoc.ts";

describe("Wreck Havoc (OUT198) AAA", () => {
  it("happy: unblocked hit deals printed 6", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [wreckHavocRed], resourcePoints: 2, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(wreckHavocRed);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(bravo)).toHaveLife(14);
    expectFabCard(Dash, wreckHavocRed).toBeIn("graveyard");
  });

  it("boundary: a miss does not destroy an arsenal defense reaction", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [wreckHavocRed], resourcePoints: 2, deck: 6 },
      {
        hero: bravo,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sinkBelowYellow],
        life: 20,
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(wreckHavocRed);
    Bravo.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabCard(Bravo, sinkBelowYellow).toBeIn("arsenal");
  });

  it("timing: hitting turns their arsenal face-up and destroys a defense reaction there", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [wreckHavocRed], resourcePoints: 2, deck: 6 },
      { hero: bravo, hand: [], arsenal: [sinkBelowYellow], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(wreckHavocRed);
    expectCombat(game).toHaveAttackPower(6);
    game.advanceUntil({ stopAt: "idle", optionals: "accept", entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(14);
    expectFabCard(Bravo, sinkBelowYellow).toBeIn("graveyard");
  });
});
