import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { snatchRed } from "./snatch.ts";
import { headLeadsTheTailRed } from "./head-leads-the-tail.ts";

describe("Head Leads the Tail (OUT052) AAA", () => {
  it("happy: when this attacks, name Crouching Tiger and this still hits for 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [headLeadsTheTailRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(headLeadsTheTailRed, { stopAt: "on-attack" });
    const wait = game.waitState();
    if (wait.kind !== "decision" || wait.decision.kind !== "effect-resolution") {
      throw new Error("Expected Head Leads the Tail to open a card-name decision.");
    }
    expect(wait.decision.options.map((option) => option.label)).not.toContain(
      "Head Leads the Tail",
    );
    expect(wait.decision.options.map((option) => option.label)).toContain("Crouching Tiger");
    Katsu.choose("Crouching Tiger");
    game.advanceUntil({
      stopAt: "defend",
      entityTargets: "minimum",
      optionals: "decline",
    });
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Katsu.id,
      cardName: "Crouching Tiger",
    });
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("boundary: a differently named attack does not get the +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [headLeadsTheTailRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(headLeadsTheTailRed, { stopAt: "on-attack" });
    Katsu.choose("Crouching Tiger");
    game.advanceUntil({
      stopAt: "defend",
      entityTargets: "minimum",
      optionals: "decline",
    });
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Katsu.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [headLeadsTheTailRed], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    game.as(dash).playAttack(snatchRed);
    game.toReaction();
    expect(() => game.as(katsu).play(headLeadsTheTailRed)).toThrow();
    expectFabCard(game.as(katsu), headLeadsTheTailRed).toBeIn("hand");
  });
});
