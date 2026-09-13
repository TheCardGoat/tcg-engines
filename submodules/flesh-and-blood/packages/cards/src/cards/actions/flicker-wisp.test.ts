import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { zapRed } from "./zap.ts";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { flickerWispYellow } from "./flicker-wisp.ts";
import { weaveLightningRed } from "./weave-lightning.ts";

/**
 * Flicker Wisp Yellow (ELE065) — Elemental Runeblade Action. Go again.
 *
 * Printed: Lightning Fusion
 * If Flicker Wisp was fused, until end of turn, action card effects you
 * control that deal arcane damage, instead deal that much arcane damage
 * plus 1.
 * Deal 1 arcane damage to target hero.
 */

describe("Flicker Wisp (ELE065) AAA", () => {
  it("happy + pin: the fused ping amps (18); a LATER arcane action this turn does not (one-shot consumption)", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [flickerWispYellow, weaveLightningRed, zapRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(flickerWispYellow, { fuse: true, fuseCards: [weaveLightningRed], target: Dash.id });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(18); // 20 - (1 + 1)

    Briar.play(zapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    // PIN (§5 engine/replacement-persistence-one-shot): printed "until end
    // of turn" should amp Zap to 4; the replacement is consumed after its
    // first application (the in-resolution ping), so Zap deals printed 3.
    expectFabPlayer(Dash).toHaveLife(15); // 18 - 3
  });

  it("boundary: unfused, the ping stays printed", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [flickerWispYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(flickerWispYellow, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(19); // 20 - 1
  });
});
