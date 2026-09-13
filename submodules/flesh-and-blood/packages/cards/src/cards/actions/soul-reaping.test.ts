import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { battlefieldBreakerRed } from "./battlefield-breaker.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { soulReapingRed } from "./soul-reaping.ts";

/**
 * Soul Reaping Red (CHN008) — Shadow Attack, cost 6, Chane Specialization.
 *
 * Printed: You may banish 1 or more cards from your hand rather than pay
 * its {r} cost. If you do, gain {r} for each blood-debt card banished this
 * way. While attacking a hero with 1+ cards in soul, it has go again.
 */

describe("Soul Reaping (CHN008) AAA", () => {
  it("happy: banishing a blood-debt card pays the 6{r} and refunds {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [soulReapingRed, battlefieldBreakerRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    game.playInstance(
      Chane.id,
      Chane.findCardInZone("hand", soulReapingRed),
      { target: Dash.id },
      "explicit",
    );
    Chane.accept();
    Chane.target(battlefieldBreakerRed);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Chane, battlefieldBreakerRed).toBeIn("banished");
    expectFabPlayer(Chane).toHaveResourceCount(1);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: paying {r} leaves the hand card and grants no extra resources", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [soulReapingRed, battlefieldBreakerRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(soulReapingRed, { optionals: "decline" });
    expectCombat(game).notToHaveKeyword("go-again");
    expectFabCard(Chane, battlefieldBreakerRed).toBeIn("hand");
    expectFabPlayer(Chane).toHaveResourceCount(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("timing: a card in the defending hero's soul grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [soulReapingRed, nimblismBlue],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], soul: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(soulReapingRed, { optionals: "decline" });
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Chane).toHaveAP(1);
  });
});
