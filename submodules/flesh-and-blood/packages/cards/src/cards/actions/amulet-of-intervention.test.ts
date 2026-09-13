import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { aetherWildfireRed } from "./aether-wildfire.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { amuletOfInterventionBlue } from "./amulet-of-intervention.ts";

/**
 * Amulet of Intervention (EVR180) — Generic Item, cost 0, Go again.
 *
 * Printed Instant: Destroy this: Prevent the next 1 damage that would be dealt
 * to your hero this turn. Activate only while your hero is the target of a
 * source that would deal damage ≥ your hero's {h}.
 */

describe("Amulet of Intervention (EVR180) AAA", () => {
  it("happy: while facing lethal {p}, prevent 1 and survive", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [amuletOfInterventionBlue],
        life: 4,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    Dash.defendWith();
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Dash);
    Dash.activate(amuletOfInterventionBlue);
    game.untilIdle();
    game.closeCombat();

    expectFabCard(Dash, amuletOfInterventionBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(1);
  });

  it("boundary: cannot activate when the attack would deal less than your {h}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [amuletOfInterventionBlue],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    Dash.defendWith();
    game.advanceCombatTo("reaction");
    game.helpers.passPriorityTo(Dash);
    Dash.expectActivationRejected(amuletOfInterventionBlue);
    expectFabCard(Dash, amuletOfInterventionBlue).toBeIn("arena");
  });

  it("timing: the Instant cannot activate from hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [amuletOfInterventionBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(amuletOfInterventionBlue);
    expectFabCard(Dash, amuletOfInterventionBlue).toBeIn("hand");
  });

  it("stack: lethal arcane damage on the stack legalizes the Instant with no combat open", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [aetherWildfireRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [amuletOfInterventionBlue],
        life: 4,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // 4 arcane damage pending on the stack ≥ Dash's {h} of 4 — the printed
    // gate must see effect damage, not just the active attack.
    Bravo.play(aetherWildfireRed);
    game.helpers.passPriorityTo(Dash);
    Dash.activate(amuletOfInterventionBlue);
    game.untilIdle();

    expectFabCard(Dash, amuletOfInterventionBlue).toBeIn("graveyard");
    // 4 arcane − 1 prevented = 3 dealt: 4 → 1.
    expectFabPlayer(Dash).toHaveLife(1);
  });

  it("stack boundary: sub-lethal arcane damage on the stack keeps the Instant locked", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [aetherWildfireRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        arena: [amuletOfInterventionBlue],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: bravo },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(aetherWildfireRed);
    game.helpers.passPriorityTo(Dash);
    Dash.expectActivationRejected(amuletOfInterventionBlue);
  });
});
