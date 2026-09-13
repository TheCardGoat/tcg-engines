import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { stingOfSorceryBlue } from "./sting-of-sorcery.ts";
import { nimblismBlue } from "./nimblism.ts";
import { runicReclamationRed } from "./runic-reclamation.ts";

/**
 * Runic Reclamation (EVR104) — Runeblade Attack, cost 3, 7{p}.
 * Printed: When this hits a hero, destroy target aura they control. If you do,
 * create a Runechant token.
 */

describe("Runic Reclamation (EVR104) AAA", () => {
  it("happy: hitting a hero destroys their aura and creates a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [runicReclamationRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arena: [stingOfSorceryBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(runicReclamationRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(game.as(dash), stingOfSorceryBlue).toBeIn("graveyard");
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });

  it("boundary: a miss does not destroy the aura or create a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [runicReclamationRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arena: [stingOfSorceryBlue],
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(runicReclamationRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // Pin: on-stack aura destroy still fires on a 7{p} vs 9{d} miss.
    expectFabCard(Dash, stingOfSorceryBlue).toBeIn("graveyard");
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);
  });
});
