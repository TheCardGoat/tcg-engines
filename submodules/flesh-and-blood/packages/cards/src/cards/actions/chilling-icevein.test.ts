import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { lexi } from "../heroes/lexi.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { heartOfFyendalBlue } from "../resources/heart-of-fyendal.ts";
import { nimblismBlue } from "./nimblism.ts";
import { brutalAssaultRed } from "./brutal-assault.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { chillingIceveinRed } from "./chilling-icevein.ts";

/**
 * Chilling Icevein (ELE050) — printed:
 * "Ice Fusion
 * If Chilling Icevein was fused, whenever an attack deals damage to a hero
 * this turn, they discard a card unless they pay {r}."
 *
 * Mode B (fab-rules): CR 8.3.17 fusion is an optional additional cost —
 * reveal an Ice card from hand; the rider schedules at play resolution only
 * when fused (CR 8.3.17c "was fused"); the window is every attack dealing
 * damage to a hero THIS TURN (multi-fire, turn-scoped) and the "they" is the
 * hero who was dealt the damage (CR 1.11.3b pronoun resolution) — they either
 * discard 1 card from hand or pay 1{r} as the unless-escape (CR 1.10.2b).
 * Arrows fire only from arsenal with a bow (CR 8.2.6a).
 *
 * Turn scoping (W3-FIX4 2026-08-18, plan §5 defect row): the module now
 * authors the engine-supported multi-fire shape `policy: { kind: "windowed",
 * duration: "this-turn", matching: "every" }` (golden: AIO004 heavy-industry
 * power plant), so the rider re-fires on EVERY damaging attack this turn and
 * expires at turn end. The timing test asserts both boundaries directly.
 */

describe("Chilling Icevein (ELE050) AAA", () => {
  it("happy: fused — damage dealt, the damaged hero declines to pay and discards a chosen card", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [chillingIceveinRed],
        hand: [weaveIceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      {
        hero: dash,
        hand: [nimblismBlue, brutalAssaultRed],
        life: 20,
        resourcePoints: 1,
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    // Ice Fusion paid by revealing an Ice card (it stays in hand, CR 8.3.17).
    Lexi.attackWith(chillingIceveinRed, {
      from: "arsenal",
      fuse: true,
      fuseCards: [weaveIceRed],
    });
    // Damage resolution surfaces the unless decision to the damaged hero.
    try {
      game.closeCombat();
    } catch {
      /* pending "Use the optional effect of Chilling Icevein?" */
    }
    Dash.chooseBoolean(false);
    try {
      game.closeCombat();
    } catch {
      /* pending "Choose a card" for the discard */
    }
    Dash.chooseTargets(nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Dash, brutalAssaultRed).toBeIn("hand");
    expectFabCard(Lexi, weaveIceRed).toBeIn("hand");
  });

  it("boundary: unfused, the arrow damages but no discard-or-pay decision exists", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [chillingIceveinRed],
        hand: [weaveIceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      {
        hero: dash,
        hand: [nimblismBlue, brutalAssaultRed],
        life: 20,
        resourcePoints: 1,
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    // Declining the optional fusion cost leaves the rider unregistered, so
    // closeCombat runs to completion with no decision pending.
    Lexi.attackWith(chillingIceveinRed, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabCard(Dash, brutalAssaultRed).toBeIn("hand");
    expectFabPlayer(Dash).toHaveResourceCount(1);
  });

  it("escape: fused — the damaged hero takes the pay branch, keeping their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [chillingIceveinRed],
        hand: [weaveIceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      {
        hero: dash,
        hand: [nimblismBlue, brutalAssaultRed],
        life: 20,
        resourcePoints: 1,
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.attackWith(chillingIceveinRed, {
      from: "arsenal",
      fuse: true,
      fuseCards: [weaveIceRed],
    });
    try {
      game.closeCombat();
    } catch {
      /* pending unless decision */
    }
    Dash.chooseBoolean(true); // pay 1{r} instead of discarding
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabCard(Dash, brutalAssaultRed).toBeIn("hand");
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });

  it("timing: the decision waits for damage, not play — then re-fires on a second attack and expires at turn end", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [chillingIceveinRed],
        hand: [
          weaveIceRed,
          heartOfFyendalBlue,
          heartOfFyendalBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
        ],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 4,
      },
      {
        hero: dash,
        hand: [nimblismBlue, brutalAssaultRed],
        life: 20,
        resourcePoints: 1,
        deck: 4,
      },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    // The delay itself: at the reaction step no damage and no decision yet.
    Lexi.attackWith(chillingIceveinRed, {
      from: "arsenal",
      fuse: true,
      fuseCards: [weaveIceRed],
    });
    game.advanceCombatTo("reaction");
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");

    try {
      game.closeCombat();
    } catch {
      /* pending unless decision */
    }
    Dash.chooseBoolean(false);
    try {
      game.closeCombat();
    } catch {
      /* pending discard target */
    }
    Dash.chooseTargets(nimblismBlue);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");

    // Printed "whenever ... this turn" re-fires on the second damaging
    // attack: the decision returns and Dash discards their last card (the
    // single remaining candidate force-resolves) — life 11, hand emptied.
    Lexi.attackWith(brutalAssaultBlue, { pitch: [heartOfFyendalBlue] });
    try {
      game.closeCombat();
    } catch {
      /* pending unless decision */
    }
    Dash.chooseBoolean(false);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(11);
    expectFabCard(Dash, brutalAssaultRed).toBeIn("graveyard");

    // Turn boundary: the "this turn" window has expired — a next-turn
    // damaging attack completes with NO discard-or-pay decision (bare
    // closeCombat resolving is the proof; a pending pay boolean would throw)
    // and deals a plain 4 (life 7).
    Lexi.endTurn();
    Dash.endTurn();
    game.helpers.untilIdle();
    Lexi.attackWith(brutalAssaultBlue, { pitch: [heartOfFyendalBlue] });
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(7);
  });
});
