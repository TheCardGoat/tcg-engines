import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "../../../../testing/index.ts";
import { bravo } from "../../../../../../cards/src/cards/heroes/bravo.ts";
import { blazeFiremind } from "../../../../../../cards/src/cards/heroes/blaze-firemind.ts";
import { dash } from "../../../../../../cards/src/cards/heroes/dash.ts";
import { restlessMagisterRed } from "../../../../../../cards/src/cards/actions/restless-magister.ts";
import { restlessClericRed } from "../../../../../../cards/src/cards/actions/restless-cleric.ts";
import { cintariSellsword } from "../../../../../../cards/src/cards/tokens/cintari-sellsword.ts";
import { aetherHailBlue } from "../../../../../../cards/src/cards/actions/aether-hail.ts";

// Owns the shared Decay lifecycle, using authored allies rather than fixture cards.
describe("Decay — end-phase lifecycle", () => {
  it("adds a counter to every Decay ally controlled by the turn player only", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [restlessMagisterRed, restlessClericRed, cintariSellsword],
        hand: [],
        intellect: 0,
        life: 20,
      },
      { hero: dash, arena: [restlessMagisterRed], hand: [], intellect: 0, life: 20 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.endTurn();

    expectFabCard(Bravo, restlessMagisterRed).toHaveCounters(1).toBeIn("arena");
    expectFabCard(Bravo, restlessClericRed).toHaveCounters(1).toBeIn("arena");
    expectFabCard(Bravo, cintariSellsword).toHaveCounters(0).toBeIn("arena");
    expectFabCard(Dash, restlessMagisterRed).toHaveCounters(0).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("does not apply Decay to cards outside the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        graveyard: [restlessMagisterRed],
        banished: [restlessClericRed],
        hand: [],
        intellect: 0,
        life: 20,
      },
      { hero: dash, hand: [], intellect: 0 },
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();

    expectFabCard(Bravo, restlessMagisterRed).toBeIn("graveyard").toHaveCounters(0);
    expectFabCard(Bravo, restlessClericRed).toBeBanished().toHaveCounters(0);
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("persists across opposing turns and destroys a three-life ally on its third Decay", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [restlessMagisterRed], hand: [], intellect: 0, life: 20 },
      { hero: dash, hand: [], intellect: 0 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const magister = Bravo.cardIn("arena", restlessMagisterRed);

    Bravo.endTurn();
    expectFabCard(Bravo, magister).toHaveCounters(1).toBeIn("arena");
    Dash.endTurn();
    expectFabCard(Bravo, magister).toHaveCounters(1).toBeIn("arena");
    Bravo.endTurn();
    expectFabCard(Bravo, magister).toHaveCounters(2).toBeIn("arena");
    Dash.endTurn();
    expectFabCard(Bravo, magister).toHaveCounters(2).toBeIn("arena");
    Bravo.endTurn();

    expectFabCard(Bravo, magister).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("UST notes: Decay can kill a damaged ally before allies would heal", () => {
    // Damage the turn player's own Decay ally on this same end phase (CR 8.2.8b
    // still heals every ally at reset-assets; skipping opposing heals is illegal).
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        arena: [restlessMagisterRed],
        hand: [aetherHailBlue],
        resourcePoints: 1,
        actionPoints: 1,
        intellect: 0,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], intellect: 0, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const magister = Blaze.findCardInZone("arena", restlessMagisterRed);

    Blaze.play(aetherHailBlue, { target: magister });
    game.passBoth();
    expect(game.objectLife(magister)).toBe(1);
    expectFabCard(Blaze, restlessMagisterRed).toBeIn("arena");

    Blaze.endTurn();

    expectFabCard(Blaze, restlessMagisterRed).toBeIn("graveyard");
  });
});
