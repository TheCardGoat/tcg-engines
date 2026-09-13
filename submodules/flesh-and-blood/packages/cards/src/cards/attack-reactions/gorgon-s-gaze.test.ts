import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { innerChiBlue } from "../resources/inner-chi.ts";
import { nuu } from "../heroes/nuu.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { gorgonSGazeYellow } from "./gorgon-s-gaze.ts";

/**
 * Gorgon's Gaze (MST008) — Mystic Assassin Attack Reaction, cost 2.
 * Printed: Create a Slither in your hand. Banish all defending attack action
 * cards on the combat chain.
 */

describe("Gorgon's Gaze (Yellow) (MST008) AAA", () => {
  it("happy: creates a Slither in hand and banishes a defending attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [brutalAssaultBlue, gorgonSGazeYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);
    const Dash = game.as(dash);

    Nuu.playAttack(brutalAssaultBlue);
    Dash.defendWith(brutalAssaultBlue);
    game.toReaction("attacker");
    Nuu.play(gorgonSGazeYellow);
    game.helpers.resolveUntilIdle();

    expect(Nuu.zone("hand").filter((id) => id === "token:slither")).toHaveLength(1);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("banished");
  });

  it("boundary: with unpayable resources the reaction is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [brutalAssaultBlue, gorgonSGazeYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    expect(() => Nuu.play(gorgonSGazeYellow)).toThrow();
    expectFabCard(Nuu, gorgonSGazeYellow).toBeIn("hand");
    expectFabPlayer(Nuu).toHaveTokenCount("slither", 0);
  });

  it("timing: pitching Chi still creates Slither (optional play-from-banish is not required)", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [brutalAssaultBlue, gorgonSGazeYellow, innerChiBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    Nuu.play(gorgonSGazeYellow, { pitch: [innerChiBlue] });
    game.untilIdle({ optionals: "decline" });

    expect(Nuu.zone("hand").filter((id) => id === "token:slither")).toHaveLength(1);
    expectFabCard(Nuu, innerChiBlue).toBeIn("pitch");
  });
});
