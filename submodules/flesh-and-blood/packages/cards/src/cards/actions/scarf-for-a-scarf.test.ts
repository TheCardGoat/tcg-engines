import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { nullruneHood } from "../equipment/nullrune-hood.ts";
import { bravo } from "../heroes/bravo.ts";
import { seekerSHood } from "../equipment/seeker-s-hood.ts";
import { snatchRed } from "./snatch.ts";
import { scarfForAScarfRed } from "./scarf-for-a-scarf.ts";

describe("Scarf for a Scarf (LSS019) AAA", () => {
  it("happy: exchanging heads grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [nullruneHood],
        hand: [scarfForAScarfRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, head: [seekerSHood], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(scarfForAScarfRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });

    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).toHaveKeyword("go-again");
    expect(Dash.zone("head")).toHaveLength(1);
    expect(Bravo.zone("head")).toHaveLength(1);
  });

  it("boundary: exchange fails when a side has no head equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [scarfForAScarfRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(scarfForAScarfRed);
    expectCombat(game).toHaveAttackPower(4);
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: go again lets a second attack start after the chain resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [nullruneHood],
        hand: [scarfForAScarfRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, head: [seekerSHood], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(scarfForAScarfRed, { stopAt: "on-attack" });
    game.advanceUntil({
      stopAt: "idle",
      entityTargets: "minimum",
      optionals: "decline",
    });
    Dash.playAttack(snatchRed);
    expectCombat(game).toBeOpen();
    expectFabCard(Dash, snatchRed).toBeIn("combatChain");
  });
});
