import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { corruptedCorpse } from "../actions/corrupted-corpse.ts";
import { restlessMagisterRed } from "../actions/restless-magister.ts";
import { malice } from "../heroes/malice.ts";
import { gateToIArathael } from "../tokens/gate-to-i-arathael.ts";
import { voxNecropolis } from "./vox-necropolis.ts";

/**
 * Vox Necropolis (IAR055) — Shadow Necromancer 2H Staff.
 * Printed: Zombies you control get "Action - {r}, {t}: Attack".
 */

describe("Vox Necropolis (IAR055) AAA", () => {
  it("happy: grants a zombie Attack that opens combat", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [restlessMagisterRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(restlessMagisterRed);
    game.passBoth();

    expect(game.combat()?.activeLink).toMatchObject({
      attackingPlayerId: Malice.id,
      defendingPlayerId: game.as(dash).id,
    });
    expect(Malice.zone("combatChain")).toContain(restlessMagisterRed.canonicalId);

    game.helpers.resolveRestOfCombat();
    expectFabCard(Malice, restlessMagisterRed).toBeIn("arena");
  });

  it("boundary: without Vox a seated zombie has no Attack activation", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        arena: [restlessMagisterRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(malice).expectActivationRejected(restlessMagisterRed);
  });

  it("boundary: a Zombie played from hand enters untapped and does not trigger an attack", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        hand: [restlessMagisterRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.play(restlessMagisterRed);
    game.untilIdle();

    expectCombat(game).toBeClosed();
    expectFabCard(Malice, restlessMagisterRed).toBeIn("arena").toBeReady();
  });

  it("UST notes: a graveyard Zombie enters tapped before its distinct ETB attack resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        graveyard: [restlessMagisterRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(malice);
    game.untilIdle();
    expectFabPlayer(Malice).toHaveAP(2);

    Malice.play(restlessMagisterRed, { from: "graveyard" });
    game.passBoth();

    // The identity replacement is part of the enter event. The Zombie is
    // therefore already tapped while Vox's separate attack trigger is waiting
    // to resolve, and there was no priority window where it was untapped.
    expectCombat(game).toBeClosed();
    expectFabCard(Malice, restlessMagisterRed).toBeIn("arena").toBeTapped();
    expectFabPlayer(Malice).toHaveAP(1);

    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });

    expectCombat(game).toBeOpen();
    expectFabCard(Malice, restlessMagisterRed).toBeIn("combatChain").toBeTapped();
    expectFabPlayer(Malice).toHaveAP(1);

    game.closeCombat({ ordering: "listed", entityTargets: "minimum" });
    expectFabCard(Malice, restlessMagisterRed).toBeIn("arena").toBeTapped();
  });

  it("UST notes: a Zombie played from banished also enters tapped and triggers its attack", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [gateToIArathael],
        banished: [corruptedCorpse],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Malice = game.as(malice);

    Malice.activate(gateToIArathael);
    game.untilIdle({ entityTargets: "maximum" });
    Malice.play(corruptedCorpse, { from: "banished" });
    game.passBoth();

    expectCombat(game).toBeClosed();
    expectFabCard(Malice, corruptedCorpse).toBeIn("arena").toBeTapped();

    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    expectCombat(game).toBeOpen();
    expectFabCard(Malice, corruptedCorpse).toBeIn("combatChain").toBeTapped();
  });
});
