import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { exudeConfidenceRed } from "./exude-confidence.ts";

describe("Exude Confidence (MON245) AAA", () => {
  it("happy: attacks at printed 4{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [exudeConfidenceRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    game.as(dash).playAttack(exudeConfidenceRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: the Instant cannot activate after the attack leaves combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [exudeConfidenceRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(exudeConfidenceRed);
    expectCombat(game).toHaveAttackPower(4);
    game.as(azalea).defendWith();
    game.advanceCombatTo("reaction");
    expectFabCard(Dash, exudeConfidenceRed).toBeIn("graveyard");
    expect(Dash.expectActivationRejected(exudeConfidenceRed).errorCode).toBe(
      "invalid_activation_source",
    );
  });

  it("timing: printed 4{p} is only on this attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [exudeConfidenceRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(exudeConfidenceRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabCard(Dash, exudeConfidenceRed).toBeIn("graveyard");
  });
});
