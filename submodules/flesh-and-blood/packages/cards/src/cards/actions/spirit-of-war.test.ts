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
import { spiritOfWarRed } from "./spirit-of-war.ts";

/**
 * Spirit of War (DTD052) — printed:
 * "As an additional cost to play this, you may charge your hero's soul. If a
 * yellow card is charged this way, whenever an attack action card hits this
 * combat chain, create a Courage token."
 *
 * Mode B (fab-rules): the charge is optional (CR 8.3.4) and the yellow-charge
 * qualification is read from the charge observation ("charged this way"); the
 * rider window is EVERY attack-action hit for the rest of THIS combat chain
 * (multi-fire, chain-scoped — a hit is damage dealt, CR 9.x); the token
 * creation is not optional.
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
 * the printed play-static shape — see the §5 DTD052 row.)
 */

describe("Spirit of War (DTD052) AAA", () => {
  it("happy: charging yellow arms the rider — Spirit of War's own hit creates a Courage token", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [spiritOfWarRed, boltOfCourageYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // Play the attack; the optional soul charge is declared and paid with
    // the play command itself (CR 5.1.3b/5.4.4a), not as a resolution-step
    // decision.
    Boltyn.playAttack(spiritOfWarRed, { stopAt: "on-attack", chargeCard: boltOfCourageYellow });
    expectFabCard(Boltyn, boltOfCourageYellow).toBeIn("soul");

    // No defense: 3{p} hits — the armed rider creates the token at the hit
    // with no further decision (the creation is not optional).
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 1);
    expect(Boltyn.zone("arena")).toContain("token:courage");
  });

  it("boundary: charging a non-yellow card leaves the rider unregistered — no Courage token", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [spiritOfWarRed, brutalAssaultRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // The charge is declared with the play command (the red card lands in
    // the soul) but the yellow qualifier fails — the conditional step never
    // arms the delayed trigger.
    Boltyn.playAttack(spiritOfWarRed, { stopAt: "on-attack", chargeCard: brutalAssaultRed });
    expectFabCard(Boltyn, brutalAssaultRed).toBeIn("soul");

    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 0);
    expect(Boltyn.zone("arena")).not.toContain("token:courage");
  });

  it("boundary: declining the optional charge is legal — hit resolves, soul stays empty", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [spiritOfWarRed, boltOfCourageYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // A chargeable card exists, so the optional is genuinely declined.
    Boltyn.playAttack(spiritOfWarRed, { stopAt: "on-attack" });

    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expect(Boltyn.zone("soul")).toHaveLength(0);
    expectFabCard(Boltyn, boltOfCourageYellow).toBeIn("hand");
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 0);
  });

  it("timing: the rider is multi-fire for the combat chain — a second attack-action hit of the SAME chain creates a second Courage token", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [spiritOfWarRed, boltOfCourageYellow, brutalAssaultYellow],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // Link 1: charge yellow, hit for 3 — the rider's first fire creates a
    // token. Stopping at the resolution step keeps the chain OPEN so the
    // printed "this combat chain" window survives to a second link.
    Boltyn.playAttack(spiritOfWarRed, { stopAt: "on-attack", chargeCard: boltOfCourageYellow });
    game.advanceCombatTo("resolution");
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 1);

    // Link 2 (same combat chain): the windowed/every rider fires again at the
    // second attack-action hit. The Courage token itself (DTD232) is
    // destroyed when its controller plays the link-2 attack (printed "When
    // you play an attack action card …, destroy this and the attack gets
    // +1{p}") — so the surviving count of 1 after the consume/recreate cycle
    // is the proof of the SECOND creation (without the link-2 fire the arena
    // would hold zero Courage tokens).
    Boltyn.attackWith(brutalAssaultYellow);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(12); // 3 + 5 undefended
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 1);
    expectFabCard(Boltyn, boltOfCourageYellow).toBeIn("soul");
  });
});
