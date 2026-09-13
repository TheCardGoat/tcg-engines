import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { nomDePlume } from "./nom-de-plume.ts";

/**
 * Nom de Plume (TCC051) — Bard Equipment - Head.
 *
 * Printed: Action - Destroy this: Each hero draws a card. Go again.
 *
 * The destroy cost moves the head to the graveyard and the draw hits both
 * heroes; the go-again layer lets the activator keep acting, while a new
 * turn cannot repeat the activation from the graveyard.
 */

describe("Nom de Plume (TCC051) AAA", () => {
  it("happy: the action destroys the head and both heroes draw", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [nomDePlume], hand: [], deck: 6, actionPoints: 1 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activate(nomDePlume);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, nomDePlume).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveHandCount(1);
    expectFabPlayer(Dash).toHaveHandCount(1);
  });

  it("boundary: go again keeps the action point for a follow-up play", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [nomDePlume], hand: [], deck: 6, actionPoints: 1 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(nomDePlume);
    game.helpers.resolveUntilIdle();

    // The layer carried go again, so Bravo retains the action point.
    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, nomDePlume).toBeIn("graveyard");
  });

  it("timing: the head cannot activate again from the graveyard next turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [nomDePlume], hand: [], deck: 6, actionPoints: 1 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(nomDePlume);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    Bravo.expectActivationRejected(nomDePlume);

    expectFabCard(Bravo, nomDePlume).toBeIn("graveyard");
    // Normal turn-start draw refills hands, so only the graveyard location
    // and the rejection prove the head stayed spent.
  });
});
