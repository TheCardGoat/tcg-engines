import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { uzuri } from "../heroes/uzuri.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { spreadingPlagueYellow } from "./spreading-plague.ts";

/**
 * Spreading Plague (OUT014) — Assassin Attack Reaction, cost 1.
 * Printed: Create X Bloodrot Pox tokens under the defending hero's control,
 * where X is the number of defending cards this chain link.
 */

describe("Spreading Plague (Yellow) (OUT014) AAA", () => {
  it("happy: one defending card creates 1 Bloodrot Pox under the defender", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [brutalAssaultBlue, spreadingPlagueYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);
    const Dash = game.as(dash);

    Uzuri.playAttack(brutalAssaultBlue);
    Dash.defendWith(brutalAssaultBlue);
    game.toReaction("attacker");
    Uzuri.play(spreadingPlagueYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 1);
    expectFabPlayer(Uzuri).toHaveTokenCount("bloodrot-pox", 0);
    expectFabCard(Uzuri, spreadingPlagueYellow).toBeIn("graveyard");
  });

  it("boundary: with no defending cards, X is 0 and no pox is created", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [brutalAssaultBlue, spreadingPlagueYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);

    Uzuri.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    Uzuri.play(spreadingPlagueYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("bloodrot-pox", 0);
  });

  it("boundary: unpayable cost rejects the reaction", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [brutalAssaultBlue, spreadingPlagueYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);

    Uzuri.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    expect(() => Uzuri.play(spreadingPlagueYellow)).toThrow();
    expectFabCard(Uzuri, spreadingPlagueYellow).toBeIn("hand");
  });
});
