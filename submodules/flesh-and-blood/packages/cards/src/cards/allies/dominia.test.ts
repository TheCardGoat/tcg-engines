import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { stormOfSandikai } from "../weapons/storm-of-sandikai.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { dominia } from "./dominia.ts";

/**
 * Dominia (UPR008) — "Whenever Dominia attacks a hero, reveal the top card of
 * your deck. If it's a red card, look at their hand and banish a card from it."
 *
 * Dragon allies have no printed Attack ability. Storm of Sandikai grants
 * "Once per Turn Action - 0: Attack" to Dragon allies you control.
 */

describe("Dominia (UPR008) AAA", () => {
  it("happy: attacking a hero reveals a red card and banishes from their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [stormOfSandikai],
        arena: [dominia],
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 4,
      },
      { hero: dash, hand: [nimblismBlue], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.activate(dominia);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Dash, nimblismBlue).toBeBanished();
    expectFabCard(Blaze, dominia).toBeIn("arena");
  });

  it("boundary: without Storm of Sandikai, Dominia has no Attack activation", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        arena: [dominia],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.expectActivationRejected(dominia);
    expectFabCard(Blaze, dominia).toBeIn("arena");
  });

  it("timing: a blue reveal does not banish from the defending hero's hand", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        weapon1: [stormOfSandikai],
        arena: [dominia],
        actionPoints: 1,
        deckTop: [nimblismBlue],
        deck: 4,
      },
      { hero: dash, hand: [snatchRed], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.activate(dominia);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Dash, snatchRed).toBeIn("hand");
  });
});
