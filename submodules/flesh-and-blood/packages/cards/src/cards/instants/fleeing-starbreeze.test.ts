import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { fleeingStarbreezeBlue } from "./fleeing-starbreeze.ts";

describe("Fleeing Starbreeze (AZS027) AAA", () => {
  it("happy: entering the arena grants go again to the targeted attack", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [brutalAssaultBlue, fleeingStarbreezeBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.attackWith(brutalAssaultBlue);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.advanceCombatTo("reaction");
    Zyggy.play(fleeingStarbreezeBlue);
    game.passBoth();
    Zyggy.chooseTargets(brutalAssaultBlue);
    game.passBoth();

    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expectFabCard(Zyggy, fleeingStarbreezeBlue).toBeIn("arena");
    expectFabCard(Zyggy, fleeingStarbreezeBlue).toHaveKeyword("ward");
  });

  it("boundary: with no attack on the chain, the aura still enters and spends no action point", () => {
    const game = FabTestEngine.start(
      { hero: zyggyStarlight, hand: [fleeingStarbreezeBlue], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.play(fleeingStarbreezeBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Zyggy, fleeingStarbreezeBlue).toBeIn("arena");
    expectFabPlayer(Zyggy).toHaveAP(1);
    expect(game.combat()).toBeNull();
  });
});
