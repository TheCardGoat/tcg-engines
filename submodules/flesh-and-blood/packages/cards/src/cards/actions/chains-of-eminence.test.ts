import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";
import { nimblismBlue } from "./nimblism.ts";
import { chainsOfEminenceRed } from "./chains-of-eminence.ts";

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

describe("Chains of Eminence (ARC162) AAA", () => {
  it("happy: names a card that the opposing hero cannot play", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [chainsOfEminenceRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [woundingBlowBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(chainsOfEminenceRed);
    nameCard(game, Dash, "Wounding Blow");
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, chainsOfEminenceRed).toBeIn("arena");
    expectFabPlayer(Dash).toHaveAP(1);
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Dash.id,
      cardName: "Wounding Blow",
    });
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expect(() => Bravo.play(woundingBlowBlue)).toThrow();
    expectFabCard(Bravo, woundingBlowBlue).toBeIn("hand");
  });

  it("boundary: a different card can still be played", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [chainsOfEminenceRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [woundingBlowBlue, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(chainsOfEminenceRed);
    nameCard(game, Dash, "Wounding Blow");
    game.helpers.resolveUntilIdle();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    Bravo.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, nimblismBlue).toBeIn("graveyard");
    expect(() => Bravo.play(woundingBlowBlue)).toThrow();
  });

  it("timing: destroyed at the beginning of your next action phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [chainsOfEminenceRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(chainsOfEminenceRed);
    nameCard(game, Dash, "Dash");
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, chainsOfEminenceRed).toBeIn("arena");

    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, chainsOfEminenceRed).toBeIn("arena");
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, chainsOfEminenceRed).toBeIn("graveyard");
  });
});
