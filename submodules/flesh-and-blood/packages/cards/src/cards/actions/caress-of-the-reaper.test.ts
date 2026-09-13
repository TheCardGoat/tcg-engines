import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { teklovossen } from "../heroes/teklovossen.ts";
import { dash } from "../heroes/dash.ts";
import { runebloodIncantationRed } from "./runeblood-incantation.ts";
import { nimblismBlue } from "./nimblism.ts";
import { regurgitatingSlogRed } from "./regurgitating-slog.ts";
import { snatchRed } from "./snatch.ts";
import { caressOfTheReaperRed } from "./caress-of-the-reaper.ts";

/**
 * Caress of the Reaper, Red (OMN087) — Runeblade Action - Attack, cost 1,
 * 5{p}, 3{d}.
 * Printed: "Whenever this deals damage to a hero, destroy target aura they
 * control."
 */

describe("Caress of the Reaper, Red (OMN087) AAA", () => {
  it("happy: an unblocked 5 hit destroys an aura the defender controls", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [caressOfTheReaperRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [runebloodIncantationRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(caressOfTheReaperRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(game.as(dash), runebloodIncantationRed).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: a fully blocked hit deals no damage and spares the aura", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [caressOfTheReaperRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, regurgitatingSlogRed, snatchRed],
        arena: [runebloodIncantationRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(caressOfTheReaperRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith([nimblismBlue, regurgitatingSlogRed, snatchRed]);
    game.helpers.resolveRestOfCombat();

    expectFabCard(game.as(dash), runebloodIncantationRed).toBeIn("arena");
  });

  it("timing: partial damage still triggers, destroying the aura", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [caressOfTheReaperRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [regurgitatingSlogRed],
        arena: [runebloodIncantationRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(caressOfTheReaperRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith([regurgitatingSlogRed]);
    game.helpers.resolveRestOfCombat();

    expectFabCard(game.as(dash), runebloodIncantationRed).toBeIn("graveyard");
  });
});
