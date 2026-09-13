import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { briar } from "../heroes/briar.ts";
import { weaveEarthRed } from "./weave-earth.ts";
import { brambleSparkRed } from "./bramble-spark.ts";

/**
 * Bramble Spark, Red (ELE085) — Elemental Runeblade Action, cost 0, pitch 1, 2{d}.
 * Printed: 'The next attack action card you play this turn gains "When you
 * attack with this, deal 1 arcane damage to target hero."\nIf Bramble Spark
 * was fused, the next attack action card you play this turn gains +3{p}.\nGo again'
 *
 * fab-rules Mode B handoff:
 *   citations: CR 8.3.17 (Earth fusion optional cost), CR 5.3 (resolution),
 *     CR 4.4.4 ("this turn" expiry), CR 1.11.3b (pronoun resolution),
 *     CR 5.1.3a (go again refund).
 *   behaviorConstraints:
 *     - a2 floats an unconditional "next attack action card this turn" latch
 *       granting the on-attack arcane rider (fusion-independent).
 *     - a3 floats the fusion-conditional +3{p} latch on the same next
 *       attack; both latches expire at turn end.
 *
 * PINNED MISBEHAVIOR (plan §5, W4-C — CHN014/CHN016 family): the a2
 * grant's triggered ability is authored as `event:"attack"` +
 * `observes.filter.name:"This"` + any-hero target — the known engine gap
 * where granted name:"This" on-attack triggers never fire (no arcane
 * ping, no entity-target decision; see §5 rows CHN014/CHN016). The
 * boundary test pins the rider's silence while proving the unfused a3
 * skip; the fused +3{p} latch and turn expiry are proven green.
 */

describe("Bramble Spark family AAA", () => {
  it("happy: fused — the next attack action card this turn gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [brambleSparkRed, weaveEarthRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    // Earth Fusion paid by revealing Weave Earth (stays in hand, CR 8.3.17);
    // the printed go again refunds the action point.
    Briar.play(brambleSparkRed, { fuse: true, fuseCards: [weaveEarthRed] });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Briar).toHaveAP(1);

    Briar.attackWith(snatchRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(7); // 4 + 3
    // Snatch's own damage trigger and Briar's Embodiment of Earth passive
    // queue simultaneously at combat close — preserve listed order.
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(13); // 7 through, no block
  });

  it("PINNED (§5 W4-C, CHN014 family): unfused — printed power holds and the granted on-attack arcane rider never fires", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [brambleSparkRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    // Declining fusion correctly skips the a3 +3{p} latch...
    Briar.play(brambleSparkRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(snatchRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(4);
    game.closeCombat({ ordering: "listed" });

    // ...but the a2 rider grant (unconditional) is authored with the
    // name:"This" observes filter: the "When you attack with this" trigger
    // never fires — no arcane ping lands and no any-hero target decision
    // ever materializes (decision null at idle).
    expectFabPlayer(Dash).toHaveLife(16); // 4 through, no rider ping
    expectWait(game).notToHaveDecision();
  });

  it("timing: unfused this turn — next turn's attack action card reads its printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [brambleSparkRed, weaveEarthRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    // Fused Bramble Spark resolves, but no attack is declared this turn.
    Briar.play(brambleSparkRed, { fuse: true, fuseCards: [weaveEarthRed] });
    game.helpers.resolveUntilIdle();
    Briar.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // "This turn" has rolled over (CR 4.4.4): the +3{p} latch died with
    // the turn — Snatch attacks at its printed 4{p}.
    Briar.attackWith(snatchRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(4);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
  });
});
