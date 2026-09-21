import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { oscilio } from "../heroes/oscilio.ts";
import { dromai } from "../heroes/dromai.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { nullruneGloves } from "../equipment/nullrune-gloves.ts";
import { gold } from "../tokens/gold.ts";
import { aetherAshwing } from "../tokens/aether-ashwing.ts";
import { brainstormBlue } from "./brainstorm.ts";

const padding = () => [
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
];

describe("Brainstorm (DYN196)", () => {
  it("two cards drawn create two separately targeted arcane triggers", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [brainstormBlue, tomeOfFyendalYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: padding(),
      },
      {
        hero: dromai,
        life: 20,
        hand: [],
        resourcePoints: 0,
        arena: [aetherAshwing, nullruneGloves],
        deck: padding(),
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dromai = game.as(dromai);
    Oscilio.play(brainstormBlue);
    game.passBoth();
    expectFabPlayer(Dromai).toHaveLife(20);
    expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(1).toHaveResourceCount(1);
    Oscilio.play(tomeOfFyendalYellow);
    // The two identical draw triggers commute; explicitly choose different targets.
    game.untilIdle({ optionals: "throw", ordering: "listed", entityTargets: "pause" });
    expect(() => Oscilio.targetRequired(Dromai.ref(nullruneGloves))).toThrow(/not a legal target/i);
    Oscilio.targetRequired(Dromai);
    game.untilIdle({ optionals: "throw", ordering: "listed", entityTargets: "pause" });
    Oscilio.targetRequired(Dromai.ref(aetherAshwing));
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    expectFabPlayer(Dromai).toHaveLife(19).toHaveTokenCount("aether-ashwing", 0);
    expectFabPlayer(Oscilio).toHaveLife(20).toHaveAP(0).toHaveResourceCount(0).toHaveHandCount(2);
    expectFabCard(Oscilio, brainstormBlue).toBeIn("graveyard");
    expectFabCard(Oscilio, tomeOfFyendalYellow).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });

  it("end-phase draw to intellect creates no arcane trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [brainstormBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: padding(),
      },
      { hero: dromai, life: 20, hand: [], resourcePoints: 0, deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dromai = game.as(dromai);
    Oscilio.play(brainstormBlue);
    game.passBoth();
    expectFabPlayer(Dromai).toHaveLife(20);
    Oscilio.endTurn();
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    expectFabPlayer(Oscilio).toHaveLife(20).toHaveHandCount(4);
    expectFabPlayer(Dromai).toHaveLife(20).toBeActive();
    expectFabCard(Oscilio, brainstormBlue).toBeIn("graveyard");
    expectWait(game).toBeIdle();
  });

  it("a single Gold draw triggers once, and the grant expires before the next action phase", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [brainstormBlue],
        arena: [gold, gold],
        resourcePoints: 7,
        actionPoints: 1,
        deck: padding(),
      },
      { hero: dromai, life: 20, hand: [], resourcePoints: 0, deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dromai = game.as(dromai);
    Oscilio.play(brainstormBlue);
    game.passBoth();
    Oscilio.activate(gold, { index: 0 });
    game.untilIdle({ optionals: "throw", entityTargets: "pause" });
    Oscilio.targetRequired(Dromai);
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    expectFabPlayer(Oscilio)
      .toHaveLife(20)
      .toHaveHandCount(1)
      .toHaveTokenCount("gold", 1)
      .toHaveAP(1)
      .toHaveResourceCount(2);
    expectFabPlayer(Dromai).toHaveLife(19);
    Oscilio.endTurn();
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    Dromai.endTurn();
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    // End-of-turn resources emptied. Pay for the second Gold with a real blue card.
    Oscilio.activate(gold);
    expectWait(game).toHaveDecision("payment");
    // Every card in hand is the same authored blue Nimblism.
    Oscilio.pitchFirst();
    game.untilIdle({ optionals: "throw", entityTargets: "throw" });
    expectFabPlayer(Oscilio)
      .toHaveLife(20)
      .toHaveHandCount(4)
      .toHaveTokenCount("gold", 0)
      .toHaveAP(1)
      .toHaveResourceCount(1);
    expectFabPlayer(Dromai).toHaveLife(19);
    expectWait(game).toBeIdle();
  });
});
