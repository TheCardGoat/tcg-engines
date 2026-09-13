import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { nimblismBlue } from "./nimblism.ts";
import { pulseOfIsenloftBlue } from "../defense-reactions/pulse-of-isenloft.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { snatchRed } from "./snatch.ts";
import { mindMeetsMightRed } from "./mind-meets-might.ts";

/**
 * Mind Meets Might (PEN128) — Illusionist Attack. Red cost 3, 7{p}/3{d}. Mirage.
 * When this hits a hero, they reveal their hand and discard all cards with 6 or more {p}, then draw that many.
 */

describe("Mind Meets Might (PEN128) AAA", () => {
  it("happy: hit discards their 6+{p} cards and they draw that many", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [mindMeetsMightRed],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [wreckerRompBlue, snatchRed],
        deck: 6,
        deckTop: [nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(mindMeetsMightRed);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabCard(Dash, wreckerRompBlue).toBeIn("graveyard");
    expect(Dash.zone("hand")).toContain(snatchRed.canonicalId);
    expect(Dash.zone("hand")).toContain(nimblismBlue.canonicalId);
  });

  it("boundary: a blocked miss does not discard 6+{p} cards", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [mindMeetsMightRed],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, wreckerRompBlue, pulseOfIsenloftBlue],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(mindMeetsMightRed);
    Dash.defendWith(nimblismBlue);
    game.toReaction("defender");
    Dash.play(pulseOfIsenloftBlue);
    game.closeCombat();

    expect(Dash.zone("hand")).toContain(wreckerRompBlue.canonicalId);
  });

  it("timing: cards with less than 6{p} stay in hand after the hit", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [mindMeetsMightRed],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(mindMeetsMightRed);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(13);
    expect(Dash.zone("hand")).toContain(snatchRed.canonicalId);
  });
});
