import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { corruptedCorpse } from "../actions/corrupted-corpse.ts";
import { limpitHopALongYellow } from "../actions/limpit-hop-a-long.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { markOfNeverestBlue } from "./mark-of-neverest.ts";

describe("Mark of Neverest (IAR066) AAA", () => {
  it("happy: binds to an Ally and grants +1 power", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [markOfNeverestBlue], arena: [limpitHopALongYellow], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(markOfNeverestBlue, {
      targetInstanceId: Dash.cardIn("arena", limpitHopALongYellow).instanceId,
    });
    game.untilIdle();
    expectFabCard(Dash, markOfNeverestBlue).toBeUnder(limpitHopALongYellow);
    expectFabCard(Dash, limpitHopALongYellow).toHavePower(3);
  });
  it("boundary: cannot be played without an Ally you control", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [markOfNeverestBlue], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expectFabUnplayable(() => game.as(dash).play(markOfNeverestBlue));
  });
  it("rider: on hit, may turn a banished card face-down to create Corrupted Corpse", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [markOfNeverestBlue],
        banished: [snatchRed],
        arena: [limpitHopALongYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(markOfNeverestBlue, {
      targetInstanceId: Dash.cardIn("arena", limpitHopALongYellow).instanceId,
    });
    game.untilIdle();
    Dash.activateAttack(limpitHopALongYellow);
    game.closeCombat({ optionals: "accept", entityTargets: "maximum" });
    expectFabCard(Dash, snatchRed).toBeIn("banished").toBeFaceDown();
    expectFabCard(Dash, corruptedCorpse).toBeIn("banished");
  });

  it("boundary: an already face-down banished card cannot pay the rider", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [markOfNeverestBlue],
        banished: [{ card: snatchRed, state: { faceDown: true } }],
        arena: [limpitHopALongYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(markOfNeverestBlue, {
      targetInstanceId: Dash.cardIn("arena", limpitHopALongYellow).instanceId,
    });
    game.untilIdle();
    Dash.activateAttack(limpitHopALongYellow);
    game.closeCombat({ optionals: "accept", entityTargets: "maximum" });

    expectFabCard(Dash, snatchRed).toBeIn("banished").toBeFaceDown();
    expect(Dash.zone("banished")).not.toContain(corruptedCorpse.canonicalId);
  });
});
