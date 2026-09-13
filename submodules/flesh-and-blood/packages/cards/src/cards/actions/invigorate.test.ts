import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { brutalAssaultBlue, briar } from "../shared/test-recipients.ts";
import { entwineLightningRed } from "./entwine-lightning.ts";
import { invigorateRed } from "./invigorate.ts";

/**
 * Invigorate, Red (ELE103) — Elemental Action, cost 0, 2{d}, go again.
 *
 * Printed: "The next attack you fuse this turn gains +4{p}. Go again."
 *
 * Go again is public. The next-attack latch filters
 * `appliesTo.next.hasStatus: "fused"`, which the future-applicability matcher
 * fail-closes (DTD072 charged-to-play family) — no throw, no +N.
 */

describe("Invigorate family AAA", () => {
  it("happy: go again refunds the action point spent to play it", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [invigorateRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    expectFabPlayer(Briar).toHaveAP(1);
    Briar.play(invigorateRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Briar).toHaveAP(1);
    expectFabCard(Briar, invigorateRed).toBeIn("graveyard");
  });

  it("happy: fusing the next attack grants +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [invigorateRed, entwineLightningRed, lightningPressRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(invigorateRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(entwineLightningRed, {
      fuse: true,
      fuseCards: [lightningPressRed],
    });
    game.advanceCombatTo("defend");

    // Entwine Lightning printed 4 + fused Invigorate +4 = 8.
    expectCombat(game).toHaveAttackPower(8);
    expectFabCard(Briar, lightningPressRed).toBeIn("hand");
  });

  it("boundary: an unfused follow-up attack stays at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [invigorateRed, entwineLightningRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(invigorateRed);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(entwineLightningRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: briar, hand: [invigorateRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    Briar.defendWith([invigorateRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Briar).toHaveLife(18);
    expectFabCard(Briar, invigorateRed).toBeIn("graveyard");
  });
});
