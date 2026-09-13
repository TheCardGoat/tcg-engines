import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { shiyanaDiamondGemini } from "../heroes/shiyana-diamond-gemini.ts";
import { snatchRed } from "../actions/snatch.ts";
import { embodyGreatnessYellow } from "./embody-greatness.ts";

/**
 * Embody Greatness (PEN121) — Shapeshifter Instant, cost 0.
 * Shiyana Specialization. Printed: Name a living legend hero. Become that
 * hero until the start of your next turn, except your base {h} doesn't change.
 *
 * Become copies the named living-legend hero onto Shiyana until her next
 * start phase, except base {h}.
 */

const namedShowstopper = {
  ...FAB_MANUAL_HARNESS,
  publicCardIdentities: [
    {
      canonicalId: bravoShowstopper.canonicalId,
      names: ["Bravo, Showstopper"],
      isHero: true,
      legalInLivingLegend: true,
    },
    {
      canonicalId: dash.canonicalId,
      names: ["Dash"],
      isHero: true,
    },
    {
      canonicalId: snatchRed.canonicalId,
      names: ["Snatch"],
    },
  ],
} as const;

describe("Embody Greatness (PEN121) AAA", () => {
  it("happy: naming Bravo, Showstopper copies Guardian identity and keeps 20{h}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: shiyanaDiamondGemini,
        hand: [embodyGreatnessYellow],
        inventory: [bravoShowstopper],
        deck: 6,
      },
      namedShowstopper,
    );
    const Dash = game.as(dash);
    const Shiyana = game.as(shiyanaDiamondGemini);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Shiyana.play(embodyGreatnessYellow);
    game.passBoth();
    const wait = game.waitState();
    if (wait.kind !== "decision" || wait.decision.kind !== "effect-resolution") {
      throw new Error("Expected Embody Greatness to open a card-name decision.");
    }
    expect(wait.decision.options.map((option) => option.label)).toEqual(["Bravo, Showstopper"]);
    Shiyana.choose("Bravo, Showstopper");

    expectFabCard(Shiyana, shiyanaDiamondGemini).toBeIn("heroZone");
    expectFabCard(Shiyana, shiyanaDiamondGemini).toHaveSupertype("Guardian");
    expectFabPlayer(Shiyana).toHaveLife(20);
    expectFabCard(Shiyana, embodyGreatnessYellow).toBeIn("graveyard");
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Shiyana.id,
      cardName: "Bravo, Showstopper",
    });
  });

  it("boundary: Instant play does not open a combat chain of its own", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: shiyanaDiamondGemini,
        hand: [embodyGreatnessYellow],
        inventory: [bravoShowstopper],
        deck: 6,
      },
      namedShowstopper,
    );
    const Dash = game.as(dash);
    const Shiyana = game.as(shiyanaDiamondGemini);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Shiyana.play(embodyGreatnessYellow);
    game.passBoth();
    Shiyana.choose("Bravo, Showstopper");
    expectCombat(game).toHaveAttackPower(4);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    expectCombat(game).toBeClosed();
  });

  it("timing: can be played as an Instant on the defending reaction window", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: shiyanaDiamondGemini,
        hand: [embodyGreatnessYellow],
        inventory: [bravoShowstopper],
        deck: 6,
      },
      namedShowstopper,
    );
    const Dash = game.as(dash);
    const Shiyana = game.as(shiyanaDiamondGemini);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Shiyana.play(embodyGreatnessYellow);
    game.passBoth();
    Shiyana.choose("Bravo, Showstopper");
    expectFabCard(Shiyana, embodyGreatnessYellow).toBeIn("graveyard");
  });
});
