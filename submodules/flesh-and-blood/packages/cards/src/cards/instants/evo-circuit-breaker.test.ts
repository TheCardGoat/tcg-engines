import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { hyperDriverRed } from "../actions/hyper-driver.ts";
import { tekloBaseHead } from "../equipment/teklo-base-head.ts";
import { evoCircuitBreakerRed } from "./evo-circuit-breaker.ts";

describe("Evo Circuit Breaker (EVO030) AAA", () => {
  it("happy: with a base head equipped this transforms into the head slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        head: [tekloBaseHead],
        arena: [hyperDriverRed],
        hand: [evoCircuitBreakerRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoCircuitBreakerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expectFabCard(Teklo, evoCircuitBreakerRed).toBeIn("graveyard");
    expect(Teklo.zone("head")).not.toContain(evoCircuitBreakerRed.canonicalId);
  });

  it("boundary: without a base head equipped this does not enter the head slot", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [evoCircuitBreakerRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(evoCircuitBreakerRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    expect(Teklo.zone("head")).not.toContain(evoCircuitBreakerRed.canonicalId);
  });
});
