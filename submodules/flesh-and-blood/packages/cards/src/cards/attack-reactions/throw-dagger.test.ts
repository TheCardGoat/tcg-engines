import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "../actions/snatch.ts";
import { throwDaggerBlue } from "./throw-dagger.ts";

/**
 * Throw Dagger (HNT175) — Assassin / Ninja Attack Reaction, cost 0, 3{d}.
 *
 * Printed: "Target dagger you control that isn't on the active chain link
 * deals 1 damage to the defending hero. If damage is dealt this way, the
 * dagger has hit and you draw a card. Destroy the dagger."
 */

describe("Throw Dagger (HNT175) AAA", () => {
  it("happy: an off-chain dagger deals 1, hits, draws, then is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [nerveScalpel],
        hand: [snatchRed, throwDaggerBlue],
        actionPoints: 1,
        deckTop: [brutalAssaultBlue],
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.playAttack(snatchRed);
    game.toReaction("attacker");
    Arakni.must.playReaction(throwDaggerBlue);
    const wait = game.waitState();
    if (wait.kind === "decision" && wait.decision.kind === "entity-target") {
      Arakni.target(nerveScalpel);
    }
    game.passBoth();

    expectFabCard(Arakni, throwDaggerBlue).toBeIn("graveyard");
    expectFabCard(Arakni, nerveScalpel).toBeIn("graveyard");
    expectFabCard(Arakni, brutalAssaultBlue).toBeIn("hand");
    expectFabPlayer(Dash).toHaveLife(19);
    expectCombat(game).toBeOpen();
  });

  it("boundary: without an off-chain dagger the reaction does not resolve", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [snatchRed, throwDaggerBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.playAttack(snatchRed);
    game.toReaction("attacker");
    expectFabUnplayable(() => Arakni.must.playReaction(throwDaggerBlue));

    expectFabCard(Arakni, throwDaggerBlue).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: cannot play Throw Dagger outside the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        weapon1: [nerveScalpel],
        hand: [throwDaggerBlue],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(arakni).play(throwDaggerBlue)).toThrow();
    expectFabCard(game.as(arakni), throwDaggerBlue).toBeIn("hand");
  });
});
