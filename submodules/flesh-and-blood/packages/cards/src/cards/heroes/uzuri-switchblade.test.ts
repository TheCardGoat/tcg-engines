import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { infectRed } from "../actions/infect.ts";
import { dash } from "./dash.ts";
import { heartOfFyendalBlue } from "../resources/heart-of-fyendal.ts";
import { uzuriSwitchblade } from "./uzuri-switchblade.ts";

/**
 * Uzuri, Switchblade (OUT001) — Assassin Hero 40hp.
 *
 * Printed: Once per Turn Attack Reaction - Banish a card from your hand face
 * down: Turn it face up. If it's an attack action with cost ≤ 2, put the
 * attacking stealth card on the bottom of its owner's deck, then put the
 * banished card onto the active chain link as the attacking card.
 */

describe("Uzuri, Switchblade (OUT001) AAA", () => {
  it("happy: banish a cost-0 attack action to replace the stealth attacker", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuriSwitchblade,
        hand: [infectRed, infectRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuriSwitchblade);

    Uzuri.playAttack(infectRed);
    game.advanceCombatTo("reaction");
    Uzuri.activate(uzuriSwitchblade);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Uzuri).toHaveLife(40);
  });

  it("boundary: once-per-turn blocks a second reaction", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuriSwitchblade,
        hand: [infectRed, infectRed, infectRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuriSwitchblade);

    Uzuri.playAttack(infectRed);
    game.advanceCombatTo("reaction");
    Uzuri.activate(uzuriSwitchblade);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Uzuri.expectActivationRejected(uzuriSwitchblade);
  });

  it("boundary: a non-attack-action banish does not replace the stealth attacker", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuriSwitchblade,
        hand: [infectRed, heartOfFyendalBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuriSwitchblade);

    Uzuri.playAttack(infectRed);
    game.advanceCombatTo("reaction");
    Uzuri.activate(uzuriSwitchblade);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Uzuri, heartOfFyendalBlue).toBeIn("banished");
  });
});
