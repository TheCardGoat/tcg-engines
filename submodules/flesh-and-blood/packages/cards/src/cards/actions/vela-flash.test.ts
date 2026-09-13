import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { zapRed } from "./zap.ts";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { velaFlashRed } from "./vela-flash.ts";
import { weaveLightningRed } from "./weave-lightning.ts";

/**
 * Vela Flash Red (ELE076) — Elemental Runeblade Attack Action.
 *
 * Printed: Lightning Fusion
 * If Vela Flash was fused, you may play your next 'non-attack' action card
 * this turn as though it were an instant.
 */

describe("Vela Flash (ELE076) AAA", () => {
  it("happy: fused Vela Flash grants the play-next-action-as-instant permission", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [velaFlashRed, zapRed, weaveLightningRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(velaFlashRed, { fuse: true, fuseCards: [weaveLightningRed] });
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: zapRed.canonicalId,
    });
    expectFabPlayer(Dash).toHaveLife(15); // 20 - 5 (attack through unblocked)

    // Permission leg: Zap (non-attack action) follows as an instant.
    Briar.must.playInstant(zapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(12); // 15 - 3 (Zap)
    expectFabCard(Briar, velaFlashRed).toBeIn("graveyard");
    expectFabCard(Briar, zapRed).toBeIn("graveyard");
  });

  it("boundary: unfused Vela Flash grants no instant permission", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [velaFlashRed, zapRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(velaFlashRed);
    expectCombat(game).toHaveAttackPower(5);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(15); // 20 - 5
    expect(() => Briar.must.playInstant(zapRed, { target: Dash.id })).toThrow(/reject/i);
    expectFabCard(Briar, zapRed).toBeIn("hand");
  });
});
