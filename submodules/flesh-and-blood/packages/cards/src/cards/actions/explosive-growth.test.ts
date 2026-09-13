import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../heroes/briar.ts";
import { dash } from "../heroes/dash.ts";
import { harvestSeasonRed } from "./harvest-season.ts";
import { snatchRed } from "./snatch.ts";
import { explosiveGrowthRed } from "./explosive-growth.ts";

/**
 * Explosive Growth, Red (ELE067) — Elemental Runeblade Action - Attack,
 * cost 1, 3{p}, 3{d}, 1 arcane, Fusion (Earth).
 * Printed a1: "If Explosive Growth was fused, whenever it deals damage,
 * attacks gain +1{p} this combat chain."
 * Printed a2: "When you attack with Explosive Growth, deal 1 arcane damage
 * to target hero."
 * Fused rider proven by play (eg-damage-source-it closed 2026-08-26):
 * observes damage-source as kind:"source" — only this card's damage arms
 * the rider.
 */

describe("Explosive Growth, Red (ELE067) AAA", () => {
  it("timing: attacking with it deals 1 arcane damage before combat damage", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [explosiveGrowthRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(explosiveGrowthRed, { stopAt: "on-attack" });
    const wait = game.waitState();
    if (wait.kind === "decision" && wait.decision.kind === "entity-target") {
      Briar.target(Dash);
    }
    game.advanceCombatTo("defend");

    // Arcane 1 has landed; the 3{p} hit has not resolved yet.
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("happy: fused, once Explosive Growth deals damage attacks gain +1{p} this combat chain", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [explosiveGrowthRed, harvestSeasonRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(explosiveGrowthRed, {
      fuse: true,
      fuseCards: [harvestSeasonRed],
      stopAt: "on-attack",
    });
    const wait = game.waitState();
    if (wait.kind === "decision" && wait.decision.kind === "entity-target") {
      Briar.target(Dash);
    }
    // Printed: once the on-attack arcane damage commits, attacks gain
    // +1{p} for the rest of this combat chain — the hit lands for printed
    // power +1...
    // Keep the chain open while answering trigger ordering through the
    // supported deterministic intent surface.
    game.advanceUntil({ stopAt: "resolution", ordering: "listed" });

    // ...and an attack that JOINS the chain later inherits the bonus from
    // EVERY damage instance (1 arcane + the 4{p} hit): 4 printed + 2.
    Briar.playAttack(snatchRed, { stopAt: "on-attack" });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);

    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(9); // 15 - 6 from the twice-buffed Snatch
  });

  it("timing: the chain rider expires when the combat chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [explosiveGrowthRed, harvestSeasonRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(explosiveGrowthRed, {
      fuse: true,
      fuseCards: [harvestSeasonRed],
      stopAt: "on-attack",
    });
    const wait = game.waitState();
    if (wait.kind === "decision" && wait.decision.kind === "entity-target") {
      Briar.target(Dash);
    }
    game.closeCombat({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });
    expectFabPlayer(Dash).toHaveLife(15); // 1 arcane + (3+1) hit

    // A fresh chain after close carries no leftover bonus.
    Briar.playAttack(snatchRed, { stopAt: "on-attack" });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: unfused, later attacks this chain stay at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [explosiveGrowthRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(explosiveGrowthRed, { stopAt: "on-attack" });
    const wait = game.waitState();
    if (wait.kind === "decision" && wait.decision.kind === "entity-target") {
      Briar.target(Dash);
    }
    game.advanceCombatTo("resolution");
    Briar.playAttack(snatchRed, { stopAt: "on-attack" });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });
});
