import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { invokeOuviaRed } from "../actions/invoke-ouvia.ts";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { ash } from "../tokens/ash.ts";
import { stormOfSandikai } from "../weapons/storm-of-sandikai.ts";
import { danseMacabre } from "./danse-macabre.ts";

/**
 * Danse Macabre — Necromancer Legs d1 Blade Break.
 *
 * Printed: Whenever an ally you control enters the arena, you may pay {r}{r}
 * and {t} this. If you do, that ally's first attack this turn gets go again
 * and destroy that ally at the beginning of the end phase.
 */

describe("Danse Macabre AAA", () => {
  it("happy: paying {r}{r} and tapping grants go again then destroys the ally at end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [danseMacabre],
        weapon1: [stormOfSandikai],
        arena: [ash],
        hand: [invokeOuviaRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dash);

    const [firstAsh] = Dromai.cardsIn("arena", ash);
    Dromai.play(invokeOuviaRed, { targetInstanceId: firstAsh!.instanceId });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expect(game.renderedPlayerNarrative(Dromai.id)).toContain(
      "Danse Macabre gives Invoke Ouvia's first attack go again; when it resolves, You will gain 1 action point.",
    );

    expectFabCard(Dromai, danseMacabre).toBeTapped();
    expectFabPlayer(Dromai).toHaveResourceCount(0);
    expectFabCard(Dromai, invokeOuviaRed).toBeIn("arena");

    Dromai.activateAttack(invokeOuviaRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dromai).toHaveAP(1);

    Dromai.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    expectFabCard(Dromai, invokeOuviaRed).toBeIn("graveyard");
  });

  it("boundary: declining the payment leaves the ally in play through the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [danseMacabre],
        arena: [ash],
        hand: [invokeOuviaRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dash);

    const [firstAsh] = Dromai.cardsIn("arena", ash);
    Dromai.play(invokeOuviaRed, { targetInstanceId: firstAsh!.instanceId });
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dromai, danseMacabre).toBeReady();
    expectFabPlayer(Dromai).toHaveResourceCount(2);

    Dromai.endTurn();
    expectFabCard(Dromai, invokeOuviaRed).toBeIn("arena");
  });
});
