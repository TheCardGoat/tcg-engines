import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { fyendalSSpringTunic } from "./fyendal-s-spring-tunic.ts";

describe("Fyendal's Spring Tunic (WTR150) AAA", () => {
  it("happy: Instant — remove 3 energy counters to gain {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [{ card: fyendalSSpringTunic, state: { energyCounters: 3 } }],
        resourcePoints: 0,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, fyendalSSpringTunic).toHaveCounters(3, "energy");

    Bravo.activate(fyendalSSpringTunic);

    expectFabCard(Bravo, fyendalSSpringTunic).toHaveCounters(0, "energy");
    expectFabPlayer(Bravo).toHaveResourceCount(1);
  });

  it("boundary: fewer than 3 energy counters cannot pay the Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [{ card: fyendalSSpringTunic, state: { energyCounters: 2 } }],
        resourcePoints: 0,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(fyendalSSpringTunic);
    expectFabCard(Bravo, fyendalSSpringTunic).toHaveCounters(2, "energy");
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("timing: start of turn may add an energy counter while below 3", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [{ card: fyendalSSpringTunic, state: { energyCounters: 2 } }],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, fyendalSSpringTunic).toHaveCounters(2, "energy");

    Bravo.endTurn();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Bravo, fyendalSSpringTunic).toHaveCounters(3, "energy");

    Bravo.activate(fyendalSSpringTunic);
    expectFabPlayer(Bravo).toHaveResourceCount(1);
  });
});
