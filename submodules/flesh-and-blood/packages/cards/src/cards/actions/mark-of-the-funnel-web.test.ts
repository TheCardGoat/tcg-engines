import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { markOfTheFunnelWebRed } from "./mark-of-the-funnel-web.ts";

describe("Mark of the Funnel Web (HNT035) AAA", () => {
  it("happy: hitting a marked hero banishes a card in their arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [markOfTheFunnelWebRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [snatchRed], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(markOfTheFunnelWebRed);
    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).toHaveKeyword("stealth");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, snatchRed).toBeBanished();
    expectFabPlayer(Dash).notToBeMarked();
  });

  it("boundary: hitting an unmarked hero does not banish their arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [markOfTheFunnelWebRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(markOfTheFunnelWebRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, snatchRed).toBeIn("arsenal");
    expectFabPlayer(Dash).notToBeMarked();
  });

  it("timing: a miss against a marked hero does not banish their arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [markOfTheFunnelWebRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        arsenal: [snatchRed],
        marked: true,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(markOfTheFunnelWebRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, snatchRed).toBeIn("arsenal");
    expectFabPlayer(Dash).toBeMarked();
  });
});
