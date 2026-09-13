import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { limpitHopALongYellow } from "../actions/limpit-hop-a-long.ts";
import { woundingBlowBlue } from "../actions/wounding-blow.ts";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { markOfPathstoneBlue } from "./mark-of-pathstone.ts";

describe("Mark of Pathstone (IAR067) AAA", () => {
  it("happy: binds to an Ally and grants +1 power", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [markOfPathstoneBlue], arena: [limpitHopALongYellow], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(markOfPathstoneBlue, {
      targetInstanceId: Dash.cardIn("arena", limpitHopALongYellow).instanceId,
    });
    game.untilIdle();
    expectFabCard(Dash, limpitHopALongYellow).toHavePower(3);
  });
  it("boundary: cannot be played without an Ally you control", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [markOfPathstoneBlue], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expectFabUnplayable(() => game.as(dash).play(markOfPathstoneBlue));
  });
  it("UST notes: a binding-card is not a defending card when the bound ally is attacked", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [markOfPathstoneBlue], arena: [limpitHopALongYellow], deck: 6 },
      { hero: bravo, hand: [woundingBlowBlue], resourcePoints: 1, actionPoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const ally = Dash.cardIn("arena", limpitHopALongYellow);
    Dash.play(markOfPathstoneBlue, { targetInstanceId: ally.instanceId });
    game.untilIdle();
    expectFabCard(Dash, markOfPathstoneBlue).toBeUnder(limpitHopALongYellow);

    Dash.endTurn();
    const boundAlly = Dash.findCardInZone("arena", limpitHopALongYellow);
    Bravo.playAttack(woundingBlowBlue, { target: boundAlly });
    Dash.defendWith([]);
    expect(Dash.zone("combatChain")).not.toContain(markOfPathstoneBlue.canonicalId);
    expectFabCard(Dash, markOfPathstoneBlue).toBeUnder(limpitHopALongYellow);
  });

  it("rider and lifecycle: hit and death gain life, then clear the hosted Aura", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [markOfPathstoneBlue], arena: [limpitHopALongYellow], deck: 6 },
      { hero: bravo, hand: [woundingBlowBlue], resourcePoints: 1, actionPoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const allyId = Dash.cardIn("arena", limpitHopALongYellow).instanceId;
    Dash.play(markOfPathstoneBlue, { targetInstanceId: allyId });
    game.untilIdle();
    Dash.endTurn();
    Bravo.play(woundingBlowBlue, { targetInstanceId: allyId });
    game.closeCombat({ optionals: "decline" });
    expectFabCard(Dash, limpitHopALongYellow).toBeIn("graveyard");
    expectFabCard(Dash, markOfPathstoneBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(21);
  });
});
