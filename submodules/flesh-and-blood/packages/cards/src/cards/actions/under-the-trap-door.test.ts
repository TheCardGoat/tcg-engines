import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { snatchRed } from "./snatch.ts";
import { frailtyTrapRed } from "../defense-reactions/frailty-trap.ts";
import { anaphylacticShockBlue } from "../instants/anaphylactic-shock.ts";
import { underTheTrapDoorBlue } from "./under-the-trap-door.ts";

describe("Under the Trap-Door (HNT013) AAA", () => {
  it("happy: Instant Discard this banishes a trap from graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [underTheTrapDoorBlue],
        graveyard: [anaphylacticShockBlue],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.activate(underTheTrapDoorBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });

    expectFabCard(Arakni, underTheTrapDoorBlue).toBeIn("graveyard");
    expectFabCard(Arakni, anaphylacticShockBlue).toBeBanished();
    expectFabPlayer(Arakni).toHaveAP(0);
  });

  it("boundary: playing it as an attack does not banish a trap", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [underTheTrapDoorBlue],
        graveyard: [anaphylacticShockBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(underTheTrapDoorBlue);
    expectCombat(game).toHaveAttackPower(1);
    expectCombat(game).toHaveKeyword("stealth");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Arakni, underTheTrapDoorBlue).toBeIn("graveyard");
    expectFabCard(Arakni, anaphylacticShockBlue).toBeIn("graveyard");
  });

  it("timing: the Instant discard can activate on the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], actionPoints: 1, deck: 6 },
      {
        hero: arakni,
        hand: [underTheTrapDoorBlue],
        graveyard: [anaphylacticShockBlue],
        actionPoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Arakni = game.as(arakni);

    Dash.pass();
    Arakni.activate(underTheTrapDoorBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });

    expectFabCard(Arakni, underTheTrapDoorBlue).toBeIn("graveyard");
    expectFabCard(Arakni, anaphylacticShockBlue).toBeBanished();
  });

  it("timing: playing the trap this turn banishes it instead of the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: arakni,
        hand: [underTheTrapDoorBlue],
        graveyard: [frailtyTrapRed],
        actionPoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Arakni = game.as(arakni);

    Dash.pass();
    Arakni.activate(underTheTrapDoorBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Dash.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Arakni.defendWith();
    game.advanceCombatTo("reaction");
    Dash.pass();
    Arakni.play(frailtyTrapRed, { from: "banished" });
    game.helpers.resolveRestOfCombat();

    expectFabCard(Arakni, underTheTrapDoorBlue).toBeIn("graveyard");
    expectFabCard(Arakni, frailtyTrapRed).toBeBanished();
  });
});
