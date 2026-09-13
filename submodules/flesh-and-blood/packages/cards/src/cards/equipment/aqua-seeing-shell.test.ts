import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { enigma } from "../heroes/enigma.ts";
import { dash } from "../heroes/dash.ts";
import { aquaSeeingShell } from "./aqua-seeing-shell.ts";

/**
 * Aqua Seeing Shell (LGS274) — Mystic Head, Cloaked.
 * Printed: "Cloaked / Instant - {r}{r}{r}, turn this face-up: Draw a card. /
 * At the start of your turn, destroy this."
 */

describe("Aqua Seeing Shell (LGS274) AAA", () => {
  it("happy: paying 3 to turn the cloaked shell face up draws a card", () => {
    const game = FabTestEngine.start(
      { hero: enigma, head: [aquaSeeingShell], hand: [], resourcePoints: 3, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    expectFabCard(Enigma, aquaSeeingShell).toBeFaceDown();
    Enigma.activate(aquaSeeingShell);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Enigma).toHaveResourceCount(0);
    expectFabPlayer(Enigma).toHaveHandCount(1);
    expectFabCard(Enigma, aquaSeeingShell).toBeIn("head");
    expectFabCard(Enigma, aquaSeeingShell).toBeFaceUp();
  });

  it("boundary: with only 2 resources the Instant is rejected and the shell stays cloaked", () => {
    const game = FabTestEngine.start(
      { hero: enigma, head: [aquaSeeingShell], hand: [], resourcePoints: 2, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.expectActivationRejected(aquaSeeingShell);
    expectFabCard(Enigma, aquaSeeingShell).toBeIn("head");
    expectFabCard(Enigma, aquaSeeingShell).toBeFaceDown();
  });

  it("timing: the opponent's start phase leaves this; the controller's next start destroys it", () => {
    const game = FabTestEngine.start(
      { hero: enigma, head: [aquaSeeingShell], hand: [], resourcePoints: 3, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);
    const Dash = game.as(dash);

    Enigma.activate(aquaSeeingShell);
    game.helpers.resolveUntilIdle();

    Enigma.endTurn();
    game.helpers.resolveUntilIdle();
    // Dash's start phase is not the ability controller's start.
    expectFabCard(Enigma, aquaSeeingShell).toBeIn("head");

    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabCard(Enigma, aquaSeeingShell).toBeIn("graveyard");
  });
});
