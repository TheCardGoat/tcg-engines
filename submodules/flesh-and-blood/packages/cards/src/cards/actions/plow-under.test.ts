import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { fryRed } from "./fry.ts";
import { plowUnderYellow } from "./plow-under.ts";

describe("Plow Under (ROS032) AAA", () => {
  it("happy: 4+ Earth cards in banished grants +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [plowUnderYellow],
        banished: [autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).attackWith(plowUnderYellow);
    // Printed 2 + 4.
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("boundary: 3 Earth cards in banished grants no +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [plowUnderYellow],
        banished: [autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).attackWith(plowUnderYellow);
    expect(game.combat()?.activeLink?.attackPower).toBe(2);
  });

  it("timing: Decompose bottoms each hero's arsenal card", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [plowUnderYellow],
        graveyard: [autumnSTouchBlue, autumnSTouchBlue, fryRed],
        arsenal: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arsenal: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(plowUnderYellow);
    game.advanceToDecision(Briar, "boolean");
    Briar.chooseBoolean(true);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });

    expect(Briar.zone("deck")).toContain(nimblismBlue.canonicalId);
    expect(Dash.zone("deck")).toContain(nimblismBlue.canonicalId);
    expect(Briar.zone("arsenal")).toHaveLength(0);
    expect(Dash.zone("arsenal")).toHaveLength(0);
    expect(Briar.zone("banished")).toEqual(
      expect.arrayContaining([
        autumnSTouchBlue.canonicalId,
        autumnSTouchBlue.canonicalId,
        fryRed.canonicalId,
      ]),
    );
  });
});
