import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { crouchingTiger } from "./crouching-tiger.ts";
import { innerChiBlue } from "../resources/inner-chi.ts";
import { zen } from "../heroes/zen.ts";
import { snatchRed } from "./snatch.ts";
import { shiftingWindsOfTheMysticBeastBlue } from "./shifting-winds-of-the-mystic-beast.ts";

/**
 * Shifting Winds of the Mystic Beast (MST052) — Mystic Ninja Action.
 *
 * Printed: Whenever you play a Crouching Tiger this turn, name a card. It gets
 * that name. If a Chi was pitched to play this, create 2 Crouching Tigers in
 * your hand. Go again.
 */

function crouchingTigersInHand(hero: ReturnType<FabTestEngine["as"]>): string[] {
  return hero.zone("hand").filter((id) => id.startsWith("token:crouching-tiger"));
}

describe("Shifting Winds of the Mystic Beast (MST052) AAA", () => {
  it("happy: a Crouching Tiger played this turn gets the named card's name", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [shiftingWindsOfTheMysticBeastBlue, crouchingTiger],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(shiftingWindsOfTheMysticBeastBlue);
    game.helpers.resolveUntilIdle();
    Zen.playAttack(crouchingTiger, { stopAt: "on-attack" });
    expectWait(game).toHaveDecision("effect-resolution");
    Zen.choose("Snatch");
    game.advanceUntil({ stopAt: "defend" });

    expectFabCard(Zen, crouchingTiger).toHaveName("Crouching Tiger").toHaveName("Snatch");
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Zen.id,
      cardName: "Snatch",
    });
    game.helpers.expectLog("flesh-and-blood.gain-name", {
      cardName: "Crouching Tiger",
      gainedName: "Snatch",
    });
  });

  it("boundary: a Generic attack played this turn does not get a named name", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [shiftingWindsOfTheMysticBeastBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(shiftingWindsOfTheMysticBeastBlue);
    game.helpers.resolveUntilIdle();
    Zen.playAttack(snatchRed);

    expectFabCard(Zen, snatchRed).toHaveName("Snatch");
    expectFabCard(Zen, snatchRed).notToHaveName("Dash");
  });

  it("timing: pitching Chi creates 2 Crouching Tigers in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [shiftingWindsOfTheMysticBeastBlue, innerChiBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(shiftingWindsOfTheMysticBeastBlue, { pitch: [innerChiBlue] });
    game.helpers.resolveUntilIdle();

    expect(crouchingTigersInHand(Zen)).toHaveLength(2);
    expectFabPlayer(Zen).toHaveAP(1);
  });
});
