import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { bloodspillInvocationRed } from "./bloodspill-invocation.ts";

/**
 * Bloodspill Invocation (ARC106) — Runeblade Action - Aura. Go again. Cost 1.
 * When an attack action card you control hits, destroy this then create 3 Runechant tokens.
 * When your hero is dealt damage, destroy this.
 */

describe("bloodspillInvocation family AAA", () => {
  it("happy: when an attack action you control hits, destroy this and create 3 Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [bloodspillInvocationRed, snatchRed],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(bloodspillInvocationRed);
    game.untilIdle();
    expectFabCard(Bravo, bloodspillInvocationRed).toBeIn("arena");

    Bravo.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Bravo, bloodspillInvocationRed).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("runechant", 3);
  });

  it("boundary: a blocked attack action does not destroy this or create Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [bloodspillInvocationRed, snatchRed],
        actionPoints: 2,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(bloodspillInvocationRed);
    game.untilIdle();
    Bravo.playAttack(snatchRed);
    game.as(dash).defendWith(nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabCard(Bravo, bloodspillInvocationRed).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveTokenCount("runechant", 0);
  });

  it("timing: when your hero is dealt damage, destroy this without creating Runechants", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], actionPoints: 1, resourcePoints: 2, deck: 6 },
      {
        hero: viserai,
        arena: [bloodspillInvocationRed],
        hand: [],
        life: 20,
        deck: 6,
      },
    );
    const Dash = game.as(dash);
    const Viserai = game.as(viserai);

    Dash.playAttack(brutalAssaultBlue);
    game.closeCombat();

    expectFabCard(Viserai, bloodspillInvocationRed).toBeIn("graveyard");
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 0);
  });
});
