import { describe, expect, it } from "vitest";
import {
  expectFabUnplayable,
  FabTestEngine,
  FAB_MANUAL_HARNESS,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { hocusPocusYellow } from "./hocus-pocus.ts";
import { rattleBonesRed } from "./rattle-bones.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";

/**
 * Rattle Bones (CRU143) — Runeblade Action, cost 2, def 3, Go again.
 *
 * Printed text (i18n, source of truth):
 * "Banish target Runeblade attack action card from your graveyard. You may
 * play it this turn.
 * If you have dealt arcane damage to an opposing hero this turn, you may
 * play Rattle Bones as though it were an instant.
 * Go again"
 *
 * /fab-rules Mode B handoff:
 * - citations: 8.5 (Banish effect keyword), 5.1/1.11 (playing cards and
 *   layer positions; Actions are layer-1-only for the turn player,
 *   Instants are any-layer for the active player), 6.6, 8.3 (Go again),
 *   9.3-class turn-history markers for "dealt arcane damage ... this turn".
 * - constraints: a1 moves ONE Runeblade attack action card from graveyard
 *   to banish and grants a this-turn play permission for it; a2 lifts the
 *   Action timing restriction for Rattle Bones itself while the arcane-
 *   damage marker is set; Go again refunds unconditionally.
 *
 * The a2 timing permission is a self-referencing static that remains
 * functional while Rattle Bones is in hand.
 */

describe("Rattle Bones (CRU143) AAA", () => {
  it("happy: banishes the Runeblade attack action from the graveyard, and Go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [rattleBonesRed],
        graveyard: [hocusPocusYellow],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(rattleBonesRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false }); // Decline the may-play.

    // The Runeblade attack action left the graveyard for the banished zone.
    expect(Viserai.zone("banished")).toContain(hocusPocusYellow.canonicalId);
    expect(Viserai.zone("graveyard")).not.toContain(hocusPocusYellow.canonicalId);
    // Rattle Bones itself resolved normally to the graveyard.
    expect(Viserai.zone("graveyard")).toContain(rattleBonesRed.canonicalId);
    // Printed Go again: 2 AP - 1 (play) + 1 (refund) = 2.
    expect(Viserai.actionPoints()).toBe(2);
  });

  it("accept: the banished Runeblade attack action becomes playable from banish this turn at printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [rattleBonesRed],
        graveyard: [hocusPocusYellow],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.play(rattleBonesRed);
    // Accept the printed "you may play it this turn" — the accept grants a
    // this-turn play permission for the banished card (CR 8.5 Banish + 5.1).
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    expect(Viserai.zone("banished")).toContain(hocusPocusYellow.canonicalId);

    Viserai.attackWith(hocusPocusYellow, { from: "banished" });
    expect(game.combat()?.activeLink?.attackPower).toBe(2); // Printed 2{p}.
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(18); // 20 - 2.
  });

  it("boundary: declining the may-play leaves the banished card unplayable from banish", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [rattleBonesRed],
        graveyard: [hocusPocusYellow],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(rattleBonesRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false }); // Decline.
    expect(Viserai.zone("banished")).toContain(hocusPocusYellow.canonicalId);

    // Printed-correct negative direction: without accepting the optional,
    // no play permission exists and the banished card cannot be played.
    expect(() => Viserai.attackWith(hocusPocusYellow, { from: "banished" })).toThrowError(
      /Playing from banished requires a migrated permission effect/,
    );
  });

  it("timing: after dealing arcane damage it plays from hand as an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [volticBoltRed, rattleBonesRed],
        graveyard: [hocusPocusYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.play(volticBoltRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    expect(Viserai.actionPoints()).toBe(0);

    Viserai.must.playInstant(rattleBonesRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Viserai.zone("graveyard")).toContain(rattleBonesRed.canonicalId);
    expect(Viserai.actionPoints()).toBe(1);
  });

  it("boundary: without arcane damage this turn it cannot be played as an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [woundingBlowBlue, rattleBonesRed],
        graveyard: [hocusPocusYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(woundingBlowBlue);
    game.helpers.resolveRestOfCombat();
    expect(Viserai.actionPoints()).toBe(0);

    expectFabUnplayable(
      () => Viserai.must.playInstant(rattleBonesRed),
      /action-point cost cannot be paid/i,
    );
    expect(Viserai.zone("hand")).toContain(rattleBonesRed.canonicalId);
  });
});
