import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { lexi } from "../heroes/lexi.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { weaveLightningRed } from "./weave-lightning.ts";
import { flashfreezeRed } from "./flashfreeze.ts";

/**
 * Flashfreeze, Red (ELE092) — Elemental Action, cost 1, pitch 1, 2{d}.
 * Printed: 'If Flashfreeze was fused with an Ice card, attacks you control
 * this turn gain "When you attack with this, it gains dominate, unless the
 * defending hero pays {r}{r}."\nIf Flashfreeze was fused with a Lightning
 * card, attacks you control this turn gain "If this hits a hero, deal 3
 * damage to them."\nGo again'
 *
 * fab-rules Mode B handoff:
 *   citations: CR 8.3.17 (fusion, and-or Ice/Lightning), CR 5.3
 *     (resolution ability), CR 1.10.2b (unless-escape payment),
 *     CR 4.4.4 ("this turn" expiry).
 *   behaviorConstraints:
 *     - The Ice branch floats a dominate-unless-pay rider onto every attack
 *       controlled this turn; the Lightning branch floats a 3-damage hit
 *       rider; each branch is gated on its own fusion kind.
 *
 * PINNED MISBEHAVIOR (plan §5, W4-C): BOTH branch gates read has-status
 * markers (`fused-with-ice-card`, `fused-with-lightning-card`) that are
 * declared in the types catalog but have NO CONDITION_STATUS_HANDLERS
 * entries (engine rules/evaluation/conditions/has-status.ts) and no
 * granter anywhere in the engine — evaluation throws `unhandled
 * has-status marker` on every play (either fusion kind, or none), wedging
 * the resolution mid-sequence. Both fusion branches are pinned below
 * (DYN185 idiom); the printed 2{d} defense is proven as the clean
 * boundary.
 */

describe("Flashfreeze (ELE092) AAA", () => {
  it("PINNED (§5 W4-C): an Ice-fused play wedges the resolution on the unhandled fusion-kind marker", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        hand: [flashfreezeRed, weaveIceRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);

    // Ice Fusion is paid by revealing Weave Ice (CR 8.3.17) — the printed
    // Ice branch qualifier is satisfied — yet the a2 gate reads the
    // unhandled `fused-with-ice-card` marker and the play throws instead
    // of resolving.
    Lexi.play(flashfreezeRed, { fuse: true, fuseCards: [weaveIceRed] });
    game.helpers.resolveUntilIdle();
    expectFabCard(Lexi, flashfreezeRed).toBeIn("graveyard");
    expectFabPlayer(Lexi).toHaveAP(1);
  });

  it("PINNED (§5 W4-C): a Lightning-fused play wedges on the same unhandled marker family", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        hand: [flashfreezeRed, weaveLightningRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);

    // The Lightning branch's `fused-with-lightning-card` gate is equally
    // unhandled — every fusion combination of the card is unplayable.
    Lexi.play(flashfreezeRed, { fuse: true, fuseCards: [weaveLightningRed] });
    game.helpers.resolveUntilIdle();
    expectFabCard(Lexi, flashfreezeRed).toBeIn("graveyard");
    expectFabPlayer(Lexi).toHaveAP(1);
  });

  it("boundary: blocks for its printed 2{d} from the defending side", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: lexi, hand: [flashfreezeRed], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Lexi = game.as(lexi);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Lexi.defendWith(flashfreezeRed);
    game.helpers.resolveRestOfCombat();

    // 4{p} − 2{d} = 2 damage.
    expectFabPlayer(Lexi).toHaveLife(18);
  });
});
