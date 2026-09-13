import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { envelopInDarknessRed } from "../actions/envelop-in-darkness.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { readTheRunesYellow } from "../actions/read-the-runes.ts";
import { runicReavingRed } from "../actions/runic-reaving.ts";
import { becomeTheShadowLordBlue } from "../actions/become-the-shadow-lord.ts";
import { arcaneSeedsLifeRed } from "../actions/arcane-seeds-life.ts";
import { rippleAwayBlue } from "../actions/ripple-away.ts";
import { reduceToRunechantRed } from "../defense-reactions/reduce-to-runechant.ts";
import { runechantOfEnvyYellow } from "../instants/runechant-of-envy.ts";
import { viseraiTheForsaken } from "./viserai-the-forsaken.ts";
import { PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID } from "../../runtime-registry.ts";

const viseraiForsakenPhysical = PHYSICAL_STRUCTURED_CARDS_BY_CANONICAL_ID.get(
  viseraiTheForsaken.canonicalId,
)!;

describe("Viserai, the Forsaken (IAR106) AAA", () => {
  it("happy: creating a Runechant banishes the top of your deck", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiForsakenPhysical,
        hand: [envelopInDarknessRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [nimblismBlue, snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiForsakenPhysical);

    Viserai.play(envelopInDarknessRed);
    game.untilIdle();
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);
    // The Runechant creation banished the top card of the deck.
    expectFabCard(Viserai, snatchRed).toBeIn("banished");
  });

  it("boundary: an attack that creates no Runechant does not banish", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiForsakenPhysical,
        hand: [snatchRed],
        actionPoints: 1,
        deck: [nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiForsakenPhysical);

    Viserai.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 0);
    expect(Viserai.zone("banished")).toHaveLength(0);
  });

  it("UST notes: creating 2 Runechants as one multi-event banishes once", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiForsakenPhysical,
        hand: [readTheRunesYellow],
        actionPoints: 1,
        deck: [nimblismBlue, snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiForsakenPhysical);

    Viserai.play(readTheRunesYellow);
    game.untilIdle();

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 2);
    expectFabCard(Viserai, snatchRed).toBeIn("banished");
    expect(Viserai.zone("banished")).toHaveLength(1);
    expectFabCard(Viserai, viseraiForsakenPhysical).notToHaveSupertype("Demon");
  });

  it("UST notes: separate Runechant creation events trigger and banish separately", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiForsakenPhysical,
        hand: [envelopInDarknessRed, envelopInDarknessRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: [nimblismBlue, snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiForsakenPhysical);

    Viserai.play(envelopInDarknessRed);
    game.untilIdle();
    Viserai.play(envelopInDarknessRed);
    game.untilIdle();

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 2);
    expectFabCard(Viserai, snatchRed).toBeBanished();
    expectFabCard(Viserai, nimblismBlue).toBeBanished();
    expect(Viserai.zone("banished")).toHaveLength(2);
  });

  it("UST notes: preventing the Runechant creation prevents Viserai's trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiForsakenPhysical,
        hand: [rippleAwayBlue, envelopInDarknessRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [nimblismBlue, snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiForsakenPhysical);

    Viserai.activate(rippleAwayBlue);
    game.untilIdle();
    Viserai.play(envelopInDarknessRed);
    game.untilIdle();

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 0);
    expect(Viserai.zone("banished")).toHaveLength(0);
    expect(Viserai.zone("deck")).toContain(snatchRed.canonicalId);
  });

  it("UST notes: the Runechant trigger works during the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: viseraiForsakenPhysical,
        hand: [reduceToRunechantRed],
        resourcePoints: 1,
        deck: [nimblismBlue, snatchRed],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Viserai = game.as(viseraiForsakenPhysical);

    Dash.playAttack(snatchRed);
    Viserai.defendWith();
    game.toReaction("attacker");
    Dash.pass();
    Viserai.play(reduceToRunechantRed);
    game.closeCombat();

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);
    expectFabCard(Viserai, snatchRed).toBeBanished();
  });

  it("UST notes: playing a card that counts as a Runechant does not trigger the create ability", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiForsakenPhysical,
        hand: [runechantOfEnvyYellow],
        actionPoints: 1,
        deck: [nimblismBlue, snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiForsakenPhysical);

    Viserai.play(runechantOfEnvyYellow);
    game.untilIdle();

    expect(Viserai.zone("banished")).toHaveLength(0);
    expect(Viserai.zone("deck")).toContain(snatchRed.canonicalId);
  });

  it("UST notes: extra traverse layers from the same face fail while banishes still resolve", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiForsakenPhysical,
        hand: [readTheRunesYellow, arcaneSeedsLifeRed],
        actionPoints: 2,
        life: 33,
        marked: true,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiForsakenPhysical);

    Viserai.play(readTheRunesYellow);
    game.untilIdle();
    Viserai.play(arcaneSeedsLifeRed, { playMethod: { kind: "face", face: "left" } });
    game.untilIdle();

    expectFabPlayer(Viserai).toHaveLife(33).toBeMarked();
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 4);
    expectFabCard(Viserai, viseraiForsakenPhysical).toHaveName("Viserai, Usurper");
    expect(Viserai.zone("banished")).toHaveLength(3);
  });

  it("traverses back to the Forsaken face after creating a Gate as Usurper", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiForsakenPhysical,
        hand: [readTheRunesYellow, runicReavingRed, becomeTheShadowLordBlue, envelopInDarknessRed],
        actionPoints: 2,
        resourcePoints: 4,
        deck: [nimblismBlue, snatchRed, nimblismBlue],
      },
      { hero: dash, hand: [], life: 30, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiForsakenPhysical);

    Viserai.play(readTheRunesYellow);
    game.untilIdle();
    Viserai.activate(runicReavingRed);
    game.untilIdle();
    expectFabCard(Viserai, viseraiForsakenPhysical).toHaveName("Viserai, Usurper");

    Viserai.play(becomeTheShadowLordBlue);
    Viserai.target(envelopInDarknessRed);
    game.untilIdle();
    expectFabToken(game, "gate-to-i-arathael").toHaveCount(1).toBeIn("arena");
    Viserai.endTurn();
    game.passBoth();
    expectWait(game).toHaveDecision("boolean");
    const lifeBeforeTraverse = Viserai.life();
    Viserai.accept();

    expectFabCard(Viserai, viseraiForsakenPhysical).toHaveName("Viserai, the Forsaken");
    expectFabPlayer(Viserai).toHaveLife(lifeBeforeTraverse);
  });

  it("UST notes: the third Runechant mandates traverse even with an empty deck", () => {
    const game = FabTestEngine.start(
      {
        hero: viseraiForsakenPhysical,
        hand: [readTheRunesYellow, runicReavingRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 27,
        deck: [],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viseraiForsakenPhysical);

    Viserai.play(readTheRunesYellow);
    game.untilIdle();
    Viserai.activate(runicReavingRed);
    game.untilIdle();

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 3).toHaveLife(27);
    expectFabCard(Viserai, viseraiForsakenPhysical).toHaveName("Viserai, Usurper");
    expect(Viserai.zone("banished")).toHaveLength(0);
  });
});
