import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { minnowismBlue } from "./minnowism.ts";
import { belittleRed } from "./belittle.ts";

describe("Belittle family AAA", () => {
  it("happy: revealing a small attack searches Minnowism", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [belittleRed, belittleRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [minnowismBlue, minnowismBlue],
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    game.playInstance(
      Dash.id,
      Dash.findCardInZone("hand", belittleRed),
      { target: game.as(bravo).id },
      "explicit",
    );
    Dash.accept();
    Dash.target(belittleRed);
    game.untilIdle({ entityTargets: "maximum" });
    expectFabCard(Dash, minnowismBlue).toBeIn("hand");
    expectFabPlayer(game.as(bravo)).toHaveLife(17);
  });
  it("boundary: a miss deals no damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [belittleRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.playAttack(belittleRed, { optionals: "decline" });
    game.as(bravo).defendWith(nimblismBlue, nimblismBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(game.as(bravo)).toHaveLife(20);
  });
  it("timing: go again refunds AP once", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [belittleRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.playAttack(belittleRed, { optionals: "decline" });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveAP(1);
  });
});
