import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { emperorDracaiOfAesir } from "../heroes/emperor-dracai-of-aesir.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";
import { imperialEdictRed } from "./imperial-edict.ts";

function nameCard(game: FabTestEngine, actor: ReturnType<FabTestEngine["as"]>, name: string): void {
  for (let step = 0; step < 32; step += 1) {
    const wait = game.waitState();
    if (wait.kind === "decision") {
      actor.choose(name);
      return;
    }
    if (wait.kind === "priority") {
      game.pass(wait.playerId);
      continue;
    }
  }
}

describe("Imperial Edict (DYN240) AAA", () => {
  it("happy: destroy this and name a card the opponent cannot play", () => {
    const game = FabTestEngine.start(
      { hero: emperorDracaiOfAesir, arena: [imperialEdictRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [woundingBlowBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Emperor = game.as(emperorDracaiOfAesir);
    const Dash = game.as(dash);

    Emperor.activate(imperialEdictRed);
    nameCard(game, Emperor, "Wounding Blow");
    game.helpers.resolveUntilIdle();

    expectFabCard(Emperor, imperialEdictRed).toBeIn("graveyard");
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Emperor.id,
      cardName: "Wounding Blow",
    });
    Emperor.endTurn();
    game.helpers.resolveUntilIdle();
    expect(() => Dash.play(woundingBlowBlue)).toThrow();
    expectFabCard(Dash, woundingBlowBlue).toBeIn("hand");
  });

  it("boundary: plays as an item into the arena without naming a card", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [imperialEdictRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [woundingBlowBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(imperialEdictRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, imperialEdictRed).toBeIn("arena");
    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    game.as(bravo).playAttack(woundingBlowBlue);
    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: the named-card lock lasts until the start of your next turn", () => {
    const game = FabTestEngine.start(
      { hero: emperorDracaiOfAesir, arena: [imperialEdictRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [woundingBlowBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Emperor = game.as(emperorDracaiOfAesir);
    const Dash = game.as(dash);

    Emperor.activate(imperialEdictRed);
    nameCard(game, Emperor, "Wounding Blow");
    game.helpers.resolveUntilIdle();
    Emperor.endTurn();
    game.helpers.resolveUntilIdle();
    expect(() => Dash.play(woundingBlowBlue)).toThrow();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    Emperor.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.playAttack(woundingBlowBlue);
    expectCombat(game).toHaveAttackPower(2);
  });
});
