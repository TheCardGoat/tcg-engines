import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { hissRed, hissYellow } from "../attack-reactions/hiss.ts";
import { sinkBelowRed } from "../defense-reactions/sink-below.ts";
import { dash } from "../heroes/dash.ts";
import { nuu } from "../heroes/nuu.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { mutuallyAssuredDestructionRed } from "./mutually-assured-destruction.ts";

describe("Mutually Assured Destruction (HNT009) AAA", () => {
  it("happy: each hero's first reaction creates diseases, banishes both deck tops, and completes the contract", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [mutuallyAssuredDestructionRed, hissRed, hissYellow],
        resourcePoints: 5,
        actionPoints: 1,
        deck: [snatchRed, nimblismBlue, snatchRed],
      },
      {
        hero: dash,
        hand: [sinkBelowRed],
        deck: [nimblismBlue, snatchRed, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);
    const Dash = game.as(dash);

    Nuu.must.playAttack(mutuallyAssuredDestructionRed);
    game.toReaction("attacker");
    Nuu.must.playReaction(hissRed);
    game.passBoth();
    game.passBoth();

    expectFabPlayer(Nuu).toHaveTokenCount("bloodrot-pox", 1).toHaveTokenCount("silver", 1);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 1);
    expect(Nuu.zone("deck")).toHaveLength(2);
    expect(Dash.zone("deck")).toHaveLength(2);
    expect(Nuu.zone("banished")).toHaveLength(1);
    expect(Dash.zone("banished")).toHaveLength(1);

    game.toReaction("attacker");
    Nuu.must.playReaction(hissYellow);
    game.passBoth();

    expectFabPlayer(Nuu).toHaveTokenCount("bloodrot-pox", 1);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 1);
    expect(Nuu.zone("banished")).toHaveLength(1);
    expect(Dash.zone("banished")).toHaveLength(1);

    game.toReaction("defender");
    Dash.must.playReaction(sinkBelowRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Nuu).toHaveTokenCount("bloodrot-pox", 2).toHaveTokenCount("silver", 1);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 2);
    expect(Nuu.zone("banished")).toHaveLength(2);
    expect(Dash.zone("banished")).toHaveLength(2);
  });

  it("boundary: no reaction means no disease, banish, or contract reward", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [mutuallyAssuredDestructionRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [snatchRed],
      },
      { hero: dash, hand: [], deck: [nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);
    const Dash = game.as(dash);

    Nuu.must.playAttack(mutuallyAssuredDestructionRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Nuu).toHaveTokenCount("bloodrot-pox", 0).toHaveTokenCount("silver", 0);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 0);
    expect(Nuu.zone("banished")).toHaveLength(0);
    expect(Dash.zone("banished")).toHaveLength(0);
  });
});
