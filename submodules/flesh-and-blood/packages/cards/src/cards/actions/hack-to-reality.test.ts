import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { emergingPowerRed } from "./emerging-power.ts";
import { snatchRed } from "./snatch.ts";
import { hackToRealityYellow } from "./hack-to-reality.ts";

describe("Hack to Reality (DTD229) AAA", () => {
  it("happy: next attack gets +2{p} and a hit destroys a cheap non-token aura", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [hackToRealityYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], arena: [emergingPowerRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(hackToRealityYellow);
    game.helpers.resolveUntilIdle();
    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ entityTargets: "minimum", optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(bravo)).toHaveLife(14);
    expectFabCard(game.as(bravo), emergingPowerRed).toBeIn("graveyard");
  });

  it("boundary: a token aura is not destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [hackToRealityYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], arena: [fabToken("ponder")], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(hackToRealityYellow);
    game.helpers.resolveUntilIdle();
    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveLife(14);
    expect(Bravo.zone("arena")).toContain("token:ponder");
  });

  it("timing: go again refunds the action point spent to play Hack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [hackToRealityYellow], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(hackToRealityYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveAP(1);
    expectFabCard(Dash, hackToRealityYellow).toBeIn("graveyard");
  });
});
