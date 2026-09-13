import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { remorselessRed } from "./remorseless.ts";

/**
 * Remorseless (CRU123) — Ranger Arrow Attack, 5{p}/3{d}.
 *
 * Printed: If Remorseless is put into your arsenal face up, until end of turn
 * it gains "Defense reaction cards can't be played from arsenal to
 * Remoreseless's chain link."
 * If Remorseless hits a hero, until the end of their next turn, whenever they
 * play an action card, they lose 1{h}.
 */

describe("Remorseless (CRU123) AAA", () => {
  it("happy: a face-up arsenal load then hits a hero for 5", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: remorselessRed, state: { faceDown: false } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(remorselessRed, { from: "arsenal" });
    game.closeCombat();

    expectFabCard(Azalea, remorselessRed).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: a face-down arsenal load still attacks at printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: remorselessRed, state: { faceDown: true } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.playAttack(remorselessRed, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("timing: after a hit, the defending hero loses 1{h} when they play an action", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: remorselessRed, state: { faceDown: false } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(remorselessRed, { from: "arsenal" });
    game.closeCombat();
    expect(
      game
        .getView({ role: "player", actorId: Dash.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(true);
    Azalea.endTurn();
    game.helpers.resolveUntilIdle();
    Dash.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    Dash.play(nimblismBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(13);
    expect(
      game
        .getView({ role: "player", actorId: Dash.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(true);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expect(
      game
        .getView({ role: "player", actorId: Dash.id })
        .effects.some((effect) => effect.origin.kind === "delayed-trigger"),
    ).toBe(false);
  });
});
