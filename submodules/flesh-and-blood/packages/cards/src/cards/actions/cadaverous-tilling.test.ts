import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { snatchRed } from "./snatch.ts";
import { cadaverousTillingRed } from "./cadaverous-tilling.ts";

/**
 * Cadaverous Tilling (FLR007) — Earth Action - Attack, cost 3, 6{p}.
 *
 * Printed: When this attacks, you may banish 2 Earth cards and an action
 * card from your graveyard. If you do, +2{p}.
 */

describe("Cadaverous Tilling (FLR007) AAA", () => {
  it("happy: decomposing 2 Earth and an action +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [cadaverousTillingRed],
        graveyard: [autumnSTouchBlue, autumnSTouchBlue, snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(cadaverousTillingRed, { stopAt: "on-attack" });
    Briar.accept();
    Briar.target(autumnSTouchBlue, autumnSTouchBlue);
    Briar.target(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat();

    expect(Briar.zone("banished")).toHaveLength(3);
    expectFabCard(Briar, cadaverousTillingRed).toBeIn("graveyard");
  });

  it("boundary: empty graveyard does not open the decompose boolean", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [cadaverousTillingRed],
        graveyard: [],
        resourcePoints: 3,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(cadaverousTillingRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();
  });

  it("timing: declining decompose leaves the graveyard untouched", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [cadaverousTillingRed],
        graveyard: [autumnSTouchBlue, autumnSTouchBlue, snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(cadaverousTillingRed, { stopAt: "on-attack" });
    Briar.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();

    expect(Briar.zone("graveyard")).toHaveLength(4);
  });
});
