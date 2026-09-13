import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { arakni } from "../heroes/arakni.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { infectRed } from "./infect.ts";
import { preyOnInsecurityRed } from "./prey-on-insecurity.ts";

/**
 * Prey on Insecurity (MPA024) — Assassin Action - Attack, cost 0, 3{p},
 * Stealth.
 *
 * Printed: "Attack Reaction - Put a card from your hand on the bottom of your
 * deck, destroy this: Another target attack with stealth gets +3{p}."
 */

describe("Prey on Insecurity (MPA024) AAA", () => {
  it("happy: while a second stealth attack is live, this AR pumps it +3", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [preyOnInsecurityRed, infectRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.playAttack(preyOnInsecurityRed);
    Dash.defendWith();
    game.advanceUntil({ stopAt: "resolution", optionals: "decline" });

    Arakni.playAttack(infectRed);
    Dash.defendWith();
    game.toReaction();

    Arakni.activate(preyOnInsecurityRed);
    game.passBoth(); // the AR layer resolves: +3 onto the live stealth attack

    expectCombat(game).toHaveAttackPower(6); // 3 base + printed +3
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(11); // prey's own hit (3) + the pumped infect (6)
    expectFabCard(Arakni, preyOnInsecurityRed).toBeIn("graveyard"); // destroyed by the cost
  });

  it("boundary: the AR has no 'another' stealth attack while this is the only one", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [preyOnInsecurityRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.playAttack(preyOnInsecurityRed);
    game.toReaction();

    Arakni.expectActivationRejected(preyOnInsecurityRed);
    expectFabCard(Arakni, preyOnInsecurityRed).toBeIn("combatChain");
    expectCombat(game).toHaveAttackPower(3);
  });
});
