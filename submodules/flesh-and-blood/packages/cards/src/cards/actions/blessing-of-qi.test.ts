import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iraCrimsonHaze } from "../heroes/ira-crimson-haze.ts";
import { blessingOfQiRed, blessingOfQiBlue } from "./blessing-of-qi.ts";

describe("blessing-of-qi family AAA", () => {
  it("happy: start of your turn destroys this then a banished Crouching Tiger gets +3{p} and may be played", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: iraCrimsonHaze,
        arena: [blessingOfQiRed],
        hand: [],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Ira, blessingOfQiRed).toBeIn("graveyard");
    expect(
      Ira.zone("banished").filter((id) => id.startsWith("token:crouching-tiger")),
    ).toHaveLength(1);

    const [tiger] = Ira.zone("banished");
    Ira.playAttack(tiger, { from: "banished" });
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: the banished tiger is not playable after this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: iraCrimsonHaze,
        arena: [blessingOfQiRed],
        hand: [],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    game.as(dash).endTurn();
    game.untilIdle();
    const [tiger] = Ira.zone("banished");
    Ira.endTurn();
    game.untilIdle();
    game.as(dash).endTurn();
    game.untilIdle();

    expect(() => Ira.playInstance(tiger, { from: "banished" })).toThrow();
    expect(
      Ira.zone("banished").filter((id) => id.startsWith("token:crouching-tiger")),
    ).toHaveLength(1);
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        arena: [blessingOfQiRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.endTurn();
    game.untilIdle();
    expectFabCard(Ira, blessingOfQiRed).toBeIn("arena");
    expect(
      Ira.zone("banished").filter((id) => id.startsWith("token:crouching-tiger")),
    ).toHaveLength(0);
  });

  it("pitch scale: the blue aura's banished tiger gets +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: iraCrimsonHaze,
        arena: [blessingOfQiBlue],
        hand: [],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Ira, blessingOfQiBlue).toBeIn("graveyard");
    const [tiger] = Ira.zone("banished");
    Ira.playAttack(tiger, { from: "banished" });
    expectCombat(game).toHaveAttackPower(1);
  });
});
