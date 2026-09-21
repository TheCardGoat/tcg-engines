import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { warmongerSDiplomacyBlue } from "./warmonger-s-diplomacy.ts";

describe("Warmonger's Diplomacy (DTD230) AAA", () => {
  it("happy: default war stamps diplomacyChoice and allows attack actions next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [warmongerSDiplomacyBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(warmongerSDiplomacyBlue);
    game.helpers.resolveUntilIdle({ effectResolution: "war" });
    expectFabCard(Bravo, warmongerSDiplomacyBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveDiplomacyChoice("war");
    expectFabPlayer(Dash).toHaveDiplomacyChoice("war");

    // until-end-of-next-turn covers the following turn (Dash's next turn).
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Dash.attackWith(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("boundary: war forbids non-attack actions on the restricted turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [warmongerSDiplomacyBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(warmongerSDiplomacyBlue);
    game.helpers.resolveUntilIdle({ effectResolution: "war" });
    expectFabPlayer(Dash).toHaveDiplomacyChoice("war");

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(() => Dash.play(nimblismBlue)).toThrow();
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });

  it("boundary: opponent-played diplomacy restricts the first chooser too", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [warmongerSDiplomacyBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();
    Dash.play(warmongerSDiplomacyBlue);
    game.helpers.resolveUntilIdle({ effectResolution: "war" });
    expectFabPlayer(Bravo).toHaveDiplomacyChoice("war");
    expectFabPlayer(Dash).toHaveDiplomacyChoice("war");

    // Bravo (the hero to Dash's left, so the first chooser) is restricted on
    // their own following turn even though Dash controls the layer.
    Dash.endTurn();
    expect(() => Bravo.play(nimblismBlue)).toThrow();
    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");

    // Dash's own following turn keeps the war restriction as well.
    Bravo.endTurn();
    expect(() => Dash.play(nimblismBlue)).toThrow();
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });

  it("happy: mixed choices stamp each seat with its own restriction", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [warmongerSDiplomacyBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const answers: Record<string, "war" | "peace"> = {
      [Bravo.id]: "war",
      [Dash.id]: "peace",
    };

    Bravo.play(warmongerSDiplomacyBlue);
    // Advance the played layer through both passes so the war-or-peace
    // decisions surface, then answer each seat explicitly.
    Bravo.pass();
    Dash.pass();
    for (let remaining = 2; remaining > 0; remaining -= 1) {
      const decision = game.getState().decision;
      if (!decision || decision.kind !== "effect-resolution") {
        throw new Error("Expected a pending war-or-peace decision.");
      }
      const handle = [Bravo, Dash].find((candidate) => candidate.id === decision.actorId);
      if (!handle) throw new Error(`Unexpected diplomacy chooser ${decision.actorId}.`);
      handle.choose(answers[handle.id]!);
    }
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Bravo).toHaveDiplomacyChoice("war");
    expectFabPlayer(Dash).toHaveDiplomacyChoice("peace");

    // Dash's turn is peace-restricted: the non-attack action plays, the attack
    // action may not.
    Bravo.endTurn();
    expect(() => Dash.play(snatchRed)).toThrow();
    Dash.play(nimblismBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");

    // Bravo's following turn stays war-restricted.
    Dash.endTurn();
    expect(() => Bravo.play(nimblismBlue)).toThrow();
    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
  });
});
