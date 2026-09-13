import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { consumingVolitionRed } from "./consuming-volition.ts";

describe("Consuming Volition (CRU148) AAA", () => {
  it("happy: after arcane damage this turn, a hit discards a card", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [volticBoltRed, consumingVolitionRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);
    Viserai.play(volticBoltRed, { target: Dash });
    game.helpers.resolveUntilIdle();
    Viserai.playAttack(consumingVolitionRed);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(11);
  });

  it("boundary: without arcane this turn, a hit does not discard", () => {
    const game = FabTestEngine.start(
      { hero: viserai, hand: [consumingVolitionRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);
    Viserai.playAttack(consumingVolitionRed);
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("hand")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: viserai, hand: [consumingVolitionRed], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Viserai.defendWith([consumingVolitionRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Viserai).toHaveLife(19);
  });
});
