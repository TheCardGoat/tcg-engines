import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { evoCircuitBreakerRed } from "../instants/evo-circuit-breaker.ts";
import { evoAtomBreakerRed } from "../instants/evo-atom-breaker.ts";
import { evoFaceBreakerRed } from "../instants/evo-face-breaker.ts";
import { pulsewaveProtocolYellow } from "./pulsewave-protocol.ts";

describe("Pulsewave Protocol (EVO058) AAA", () => {
  it("happy: with three Evos, a revealed action with {d} less than X is added as a defender", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [evoCircuitBreakerRed],
        chest: [evoAtomBreakerRed],
        arms: [evoFaceBreakerRed],
        hand: [pulsewaveProtocolYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(pulsewaveProtocolYellow, { stopAt: "on-attack" });
    Bravo.chooseTargets(snatchRed);
    game.advanceUntil({ stopAt: "defend" });

    expectFabCard(Bravo, snatchRed).toBeIn("combatChain");
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: a revealed non-action is not added as a defending card", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [evoCircuitBreakerRed],
        chest: [evoAtomBreakerRed],
        arms: [evoFaceBreakerRed],
        hand: [pulsewaveProtocolYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [lightningPressRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(pulsewaveProtocolYellow, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });

    expectFabCard(Bravo, lightningPressRed).toBeIn("hand");
  });

  it("timing: with no Evos equipped, X is 0 and the opponent's hand stays put", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [pulsewaveProtocolYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(pulsewaveProtocolYellow, { stopAt: "on-attack" });
    Bravo.target();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Bravo, snatchRed).toBeIn("hand");
  });
});
