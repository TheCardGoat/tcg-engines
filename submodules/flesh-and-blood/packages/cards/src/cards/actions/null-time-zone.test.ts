import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";
import { nimblismBlue } from "./nimblism.ts";
import { nullTimeZoneBlue } from "./null-time-zone.ts";

function nameCard(game: FabTestEngine, actor: ReturnType<FabTestEngine["as"]>, name: string): void {
  for (let step = 0; step < 24; step += 1) {
    const wait = game.waitState();
    if (wait.kind === "decision") {
      actor.choose(name);
      return;
    }
    if (wait.kind === "priority") {
      game.pass(wait.playerId);
      continue;
    }
    break;
  }
}

describe("Null Time Zone (HNT251) AAA", () => {
  it("happy: the named card cannot be played from hand while this is in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [nullTimeZoneBlue, woundingBlowBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(nullTimeZoneBlue);
    nameCard(game, Teklo, "Wounding Blow");
    game.untilIdle();

    // The named card's play from hand is rejected by the continuous rule.
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Teklo.id,
      cardName: "Wounding Blow",
    });
    expect(() => Teklo.play(woundingBlowBlue)).toThrow(/restricts/);
    expectFabCard(Teklo, woundingBlowBlue).toBeIn("hand");
  });

  it("boundary: a different card can still be played from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [nullTimeZoneBlue, woundingBlowBlue, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(nullTimeZoneBlue);
    nameCard(game, Teklo, "Wounding Blow");
    game.untilIdle();

    Teklo.play(nimblismBlue);
    game.untilIdle();
    expectFabCard(Teklo, nimblismBlue).toBeIn("graveyard");
  });

  it("timing: start of your turn you may keep this by removing steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: nullTimeZoneBlue, state: { steamCounters: 2 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    expectFabCard(Teklo, nullTimeZoneBlue).toBeIn("arena");

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Teklo, nullTimeZoneBlue).toBeIn("arena");
  });
});
