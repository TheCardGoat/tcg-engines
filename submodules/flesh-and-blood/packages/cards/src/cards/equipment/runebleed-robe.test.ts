import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { bravo } from "../heroes/bravo.ts";
import { runebleedRobe } from "./runebleed-robe.ts";

/**
 * Runebleed Robe (PEN094) — Runeblade Chest d0 Arcane Barrier 1.
 *
 * Printed: Instant - Destroy this and a Runechant you control: Prevent the
 * next 1 arcane damage that would be dealt to you this turn.
 *
 * DYN171 response-activation flow: the mixed destroy cost consumes the robe
 * and the seeded Runechant; Voltic Bolt's 5 arcane lands as 4. With two
 * Runechants the destroy cost opens an entity-target decision.
 */

describe("Runebleed Robe (PEN094) AAA", () => {
  it("happy: destroy the robe and a Runechant to prevent 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: 20,
        chest: [runebleedRobe],
        arena: [fabToken("runechant")],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: Bravo.id });
    Blaze.pass();
    Bravo.activate(runebleedRobe);
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, runebleedRobe).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("runechant", 0);
    expectFabPlayer(Bravo).toHaveLife(16);
  });

  it("boundary: two Runechants seeded, exactly one is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: 20,
        chest: [runebleedRobe],
        arena: [fabToken("runechant"), fabToken("runechant")],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: Bravo.id });
    Blaze.pass();
    Bravo.activate(runebleedRobe);
    Bravo.expectDecision("entity-target");
    Bravo.chooseTargets(Bravo.cardsIn("arena", fabToken("runechant"))[0]!);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, runebleedRobe).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("runechant", 1);
    expectFabPlayer(Bravo).toHaveLife(16);
  });

  it("timing: the prevention expires with the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [runebleedRobe],
        arena: [fabToken("runechant")],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(runebleedRobe);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, runebleedRobe).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("runechant", 0);
    expectFabPlayer(Bravo).toHaveLife(20);
  });
});
