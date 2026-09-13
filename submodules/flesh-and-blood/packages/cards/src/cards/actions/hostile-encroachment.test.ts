import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { hostileEncroachmentRed } from "./hostile-encroachment.ts";

describe("Hostile Encroachment (MPG033) AAA", () => {
  it("happy: attacking a hero draws them a card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hostileEncroachmentRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        deck: [nimblismBlue],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(hostileEncroachmentRed, { stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(8);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });

  it("boundary: a miss does not Crush-discard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [hostileEncroachmentRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue],
        deck: 6,
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(hostileEncroachmentRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue, brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Dash).toHaveHandCount(2);
  });
});
