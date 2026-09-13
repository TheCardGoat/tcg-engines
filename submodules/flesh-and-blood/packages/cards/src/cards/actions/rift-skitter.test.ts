import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { riftSkitterRed } from "./rift-skitter.ts";

/**
 * Rift Skitter (DTD152) — Shadow Runeblade Action - Attack, 4{p}/3{d}, cost 3.
 * Printed: Rune Gate / Go again / Blood Debt.
 */

const runechant = fabToken("runechant");

describe("Rift Skitter (DTD152) AAA", () => {
  it("happy: rune-gates from banished with 3 Runechants, hits for 4, and go again refunds 1 AP", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [],
        banished: [riftSkitterRed],
        arena: [runechant, runechant, runechant],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.play(riftSkitterRed, { from: "banished", target: Dash.id });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
    expectFabPlayer(Viserai).toHaveAP(0).toHaveResourceCount(0);

    game.closeCombat({ ordering: "listed" });

    expectCombat(game).toBeClosed();
    expectFabPlayer(Viserai).toHaveAP(1);
    expectFabCard(Viserai, riftSkitterRed).toBeIn("graveyard");
    // 4 physical plus 3 Runechant arcane pings on play.
    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("boundary: 2 Runechants cannot rune-gate this from banished (go again is unobservable because play never resolves)", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [],
        banished: [riftSkitterRed],
        arena: [runechant, runechant],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    expect(() => Viserai.playAttack(riftSkitterRed, { from: "banished" })).toThrow();
    expectFabCard(Viserai, riftSkitterRed).toBeBanished();
    expectFabPlayer(Viserai).toHaveAP(1);
  });

  it("timing: Blood Debt loses 1 life at end phase while this remains banished", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [],
        banished: [riftSkitterRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.endTurn();

    expectFabCard(Viserai, riftSkitterRed).toBeBanished();
    expectFabPlayer(Viserai).toHaveLife(19);
  });
});
