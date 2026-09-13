import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { snatchRed } from "./snatch.ts";
import { blossomingDecayRed } from "./blossoming-decay.ts";

/**
 * Blossoming Decay (ROS049) — Earth Action - Attack, cost 2, 5{p}.
 *
 * Printed: When this attacks, you may banish 2 Earth cards and an action
 * card from your graveyard. If you do, gain 1{h}.
 */

describe("Blossoming Decay (ROS049) AAA", () => {
  it("happy: decomposing 2 Earth and an action gain 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [blossomingDecayRed],
        graveyard: [autumnSTouchBlue, autumnSTouchBlue, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(blossomingDecayRed, { stopAt: "on-attack" });
    Briar.accept();
    Briar.target(autumnSTouchBlue, autumnSTouchBlue);
    Briar.target(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    expectFabPlayer(Briar).toHaveLife(21);
    game.closeCombat();

    expect(Briar.zone("banished")).toHaveLength(3);
    expectFabCard(Briar, blossomingDecayRed).toBeIn("graveyard");
  });

  it("boundary: empty graveyard does not open the decompose boolean", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [blossomingDecayRed],
        graveyard: [],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(blossomingDecayRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    expectFabPlayer(Briar).toHaveLife(20);
    game.closeCombat();
  });

  it("timing: declining decompose leaves the graveyard untouched", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [blossomingDecayRed],
        graveyard: [autumnSTouchBlue, autumnSTouchBlue, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(blossomingDecayRed, { stopAt: "on-attack" });
    Briar.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    expectFabPlayer(Briar).toHaveLife(20);
    game.closeCombat();

    expect(Briar.zone("graveyard")).toHaveLength(4);
  });
});
