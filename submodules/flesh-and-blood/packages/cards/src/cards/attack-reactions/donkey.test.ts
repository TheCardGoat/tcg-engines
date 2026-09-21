import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { autumnSTouchBlue } from "../actions/autumn-s-touch.ts";
import { durendal } from "../weapons/durendal.ts";
import { donkeyBlue } from "./donkey.ts";

/**
 * Donkey, Blue (MPW042) — Warrior Attack Reaction, cost 0, 3{d}.
 *
 * Printed: "Target sword attack gets +1{p} and wagers with the defending
 * hero. The winner destroys a card in their own arsenal."
 */

describe("Donkey (MPW042) AAA", () => {
  it("happy: the targeted sword gets +1{p} and wagers", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [durendal],
        hand: [donkeyBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.activateAttack(durendal);
    game.toReaction();
    Kassai.must.playReaction(donkeyBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Kassai, donkeyBlue).toBeIn("graveyard");
  });

  it("boundary: a Generic attack action is not a legal sword attack (silent no-op)", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [donkeyBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.must.playAttack(snatchRed);
    game.toReaction();
    expectFabUnplayable(() => Kassai.must.playReaction(donkeyBlue));

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Kassai, donkeyBlue).toBeIn("hand");
  });

  it("timing: still defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: kassai, hand: [donkeyBlue], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Kassai = game.as(kassai);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Kassai.defendWith([donkeyBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Kassai).toHaveLife(19);
    expectFabCard(Kassai, donkeyBlue).toBeIn("graveyard");
  });

  it("seat: the wager winner destroys from their own arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [durendal],
        hand: [donkeyBlue],
        arsenal: [nimblismBlue, autumnSTouchBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.activateAttack(durendal);
    game.toReaction();
    Kassai.must.playReaction(donkeyBlue);
    // CR 1.8.6: the winner destroys from their OWN arsenal — Kassai is asked.
    for (let step = 0; step < 32; step += 1) {
      const wait = game.waitState();
      if (wait.kind === "decision") {
        const d = wait.decision;
        if (d.kind === "entity-target" && d.label.includes("Durendal")) {
          game.advanceToDecision(Kassai, "entity-target");
          Kassai.target(nimblismBlue);
          continue;
        }
        if (d.kind === "entity-target" && d.min === 0) {
          game.as(kassai).target();
          continue;
        }
        break;
      }
      if (wait.kind === "priority") {
        game.passBoth();
        continue;
      }
      if (wait.kind === "resolving") continue;
      if (wait.kind === "defense-declaration") {
        Dash.defendWith(); // no blocks — Kassai wins the wager
        continue;
      }
      break;
    }

    expectFabPlayer(Dash).toHaveLife(16); // 4{p} hit
    expectFabCard(Kassai, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Kassai, autumnSTouchBlue).toBeIn("arsenal");
  });
});
