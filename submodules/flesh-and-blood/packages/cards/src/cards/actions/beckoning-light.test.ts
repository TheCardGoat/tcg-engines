import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { boltOfCourageYellow } from "./bolt-of-courage.ts";
import { brutalAssaultRed } from "./brutal-assault.ts";
import { brutalAssaultYellow } from "./brutal-assault.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { beckoningLightRed } from "./beckoning-light.ts";

/**
 * Beckoning Light (DTD051) — printed:
 * "As an additional cost to play this, you may charge your hero's soul. If a
 * yellow card is charged this way, whenever an attack action card hits this
 * combat chain, you may put an attack action card from your graveyard on top
 * of your deck."
 *
 * Mode B (fab-rules): the charge is optional (CR 8.3.4) and the yellow-charge
 * qualification is read from the charge observation ("charged this way"); the
 * rider window is EVERY attack-action hit for the rest of THIS combat chain
 * (multi-fire, chain-scoped — a hit is damage dealt, CR 9.x); "you may put" is
 * an optional resolution each time it fires.
 *
 * The charge is paid at play time — the optional additional cost is declared
 * with the play command per CR 5.1.3b/5.4.4a (8.5.29 defines only the Charge
 * effect itself) and the ability-level "If a yellow card is charged this
 * way" condition reads the charge event's chargedCard binding through the
 * play event's connectedPlayBindings merge. (History: W3-FIX4 2026-08-18
 * re-encoded the charge as a resolution step because the play event was
 * constructed before the cost-stage events, so their bindings never reached
 * the resolution-condition context; the engine now appends the cost stages
 * first and splices the play event back to its announce position, restoring
 * the printed play-static shape — see the §5 DTD051 row.)
 */

describe("Beckoning Light (DTD051) AAA", () => {
  it("happy: charging yellow at play time arms the rider — Beckoning Light's own hit offers the graveyard-to-deck-top move", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [beckoningLightRed, boltOfCourageYellow],
        graveyard: [brutalAssaultRed, brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // The charge is an additional cost paid with the play command (CR 8.5.29).
    Boltyn.playAttack(beckoningLightRed, { stopAt: "on-attack", chargeCard: boltOfCourageYellow });
    expectFabCard(Boltyn, boltOfCourageYellow).toBeIn("soul");

    // No defense: 3{p} hits. The armed rider fires on the own hit and offers
    // the optional graveyard raid; two graveyard attack actions make the
    // move a player-visible choice.
    try {
      game.closeCombat();
    } catch {
      /* pending "Use the optional effect of Beckoning Light?" at the hit */
    }
    Boltyn.chooseBoolean(true);
    try {
      game.closeCombat();
    } catch {
      /* pending "Choose a card" for the move */
    }
    Boltyn.chooseTargets(brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Boltyn.zone("deck").at(-1)).toBe(brutalAssaultBlue.canonicalId);
    expect(Boltyn.zone("graveyard")).not.toContain(brutalAssaultBlue.canonicalId);
    expect(Boltyn.zone("graveyard")).toContain(brutalAssaultRed.canonicalId);
  });

  it("boundary: charging a non-yellow card leaves the rider unregistered — no graveyard raid offered", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [beckoningLightRed, brutalAssaultRed],
        graveyard: [brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // The charge cost is paid (the red card lands in the soul) but the yellow
    // qualifier fails — the ability-level condition never arms the trigger.
    Boltyn.playAttack(beckoningLightRed, { stopAt: "on-attack", chargeCard: brutalAssaultRed });
    expectFabCard(Boltyn, brutalAssaultRed).toBeIn("soul");

    // The hit lands for 3 with NO rider decision pending.
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Boltyn.zone("deck").at(-1)).not.toBe(brutalAssaultBlue.canonicalId);
    expect(Boltyn.zone("graveyard")).toContain(brutalAssaultBlue.canonicalId);
  });

  it("boundary: declining the optional charge is legal — hit resolves, soul stays empty", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [beckoningLightRed, boltOfCourageYellow],
        graveyard: [brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // A chargeable card exists, so the optional cost is genuinely declined.
    Boltyn.playAttack(beckoningLightRed, { stopAt: "on-attack" });

    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Boltyn.zone("soul")).toHaveLength(0);
    expectFabCard(Boltyn, boltOfCourageYellow).toBeIn("hand");
    expect(Boltyn.zone("graveyard")).toContain(brutalAssaultBlue.canonicalId);
  });

  it("timing: the rider is multi-fire for the combat chain — a second attack-action hit of the SAME chain offers the move again", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [beckoningLightRed, boltOfCourageYellow, brutalAssaultYellow],
        graveyard: [brutalAssaultRed, brutalAssaultBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // Link 1: charge yellow at play time, hit for 3 — the rider's first fire
    // moves the red assault to deck top. Stopping at the resolution step keeps
    // the chain OPEN so the printed "this combat chain" window survives to a
    // second link (the chain closes when both players pass the resolution
    // step).
    Boltyn.playAttack(beckoningLightRed, {
      stopAt: "on-attack",
      chargeCard: boltOfCourageYellow,
    });
    try {
      game.advanceCombatTo("resolution");
    } catch {
      /* pending rider optional at the link-1 hit */
    }
    Boltyn.chooseBoolean(true);
    try {
      game.advanceCombatTo("resolution");
    } catch {
      /* pending move target */
    }
    Boltyn.chooseTargets(brutalAssaultRed);
    game.advanceCombatTo("resolution");
    expectFabPlayer(Dash).toHaveLife(17);
    expect(Boltyn.zone("deck").at(-1)).toBe(brutalAssaultRed.canonicalId);

    // Link 2 (same combat chain): the windowed/every rider fires again at the
    // second attack-action hit. The offer is the observable; the single
    // remaining graveyard attack action resolves the move uniquely.
    Boltyn.attackWith(brutalAssaultYellow);
    try {
      game.closeCombat();
    } catch {
      /* pending rider optional at the link-2 hit */
    }
    Boltyn.chooseBoolean(true);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(12); // 3 + 5 undefended
    expect(Boltyn.zone("deck").at(-1)).toBe(brutalAssaultBlue.canonicalId);
    expect(Boltyn.zone("deck").at(-2)).toBe(brutalAssaultRed.canonicalId);
    expectFabCard(Boltyn, boltOfCourageYellow).toBeIn("soul");
  });
});
