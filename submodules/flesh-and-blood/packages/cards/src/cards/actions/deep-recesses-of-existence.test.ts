import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { vynnset } from "../heroes/vynnset.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { deepRecessesOfExistenceBlue } from "./deep-recesses-of-existence.ts";

describe("Deep Recesses of Existence (PEN190) AAA", () => {
  it("happy: accepting the close optional banishes this face-down and then a graveyard card from each hero who lost {h}", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [deepRecessesOfExistenceBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, graveyard: [autumnSTouchBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);

    Vynnset.attackWith(deepRecessesOfExistenceBlue);
    game.closeCombat({ optionals: "accept", ordering: "listed" });
    const arsenal = game.pendingDecision();
    if (arsenal?.kind === "entity-target" && arsenal.min === 0) {
      game.answerDecision(Dash.id, { kind: "entity-target", instanceIds: [] });
    }
    if (game.pendingDecision()?.kind === "entity-target") Dash.target(autumnSTouchBlue);

    expectFabCard(Vynnset, deepRecessesOfExistenceBlue).toBeBanished();
    expectFabCard(Dash, autumnSTouchBlue).toBeBanished();
  });

  it("happy: hits for printed 6", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [deepRecessesOfExistenceBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.attackWith(deepRecessesOfExistenceBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    expectFabCard(Vynnset, deepRecessesOfExistenceBlue).toBeIn("graveyard");
  });

  it("boundary: declining the close optional leaves this in the graveyard and graveyards intact", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [deepRecessesOfExistenceBlue],
        graveyard: [nimblismBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, graveyard: [autumnSTouchBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);

    Vynnset.attackWith(deepRecessesOfExistenceBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Vynnset, deepRecessesOfExistenceBlue).toBeIn("graveyard");
    expectFabCard(Vynnset, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Dash, autumnSTouchBlue).toBeIn("graveyard");
  });

  it("boundary: if the attack does not hit, declining the optional still leaves graveyards intact", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [deepRecessesOfExistenceBlue],
        graveyard: [nimblismBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        graveyard: [autumnSTouchBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);

    Vynnset.attackWith(deepRecessesOfExistenceBlue);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, autumnSTouchBlue).toBeIn("graveyard");
  });
});
