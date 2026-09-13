import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { leaveEmSpeechlessBlue } from "./leave-em-speechless.ts";

/**
 * Leave 'em Speechless Blue (PEN301) — Reviled Aura.
 *
 * Printed: When this enters the arena, name a card. The named card can't be
 * played from hand while this is in the arena.
 */

const namedSnatch = {
  ...FAB_MANUAL_HARNESS,
  publicCardIdentities: [{ canonicalId: snatchRed.canonicalId, names: ["Snatch"] }],
} as const;

describe("Leave 'em Speechless (PEN301) AAA", () => {
  it("happy: enter-arena names a card and seats the aura", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [leaveEmSpeechlessBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      namedSnatch,
    );
    const Bravo = game.as(bravo);

    Bravo.play(leaveEmSpeechlessBlue);
    game.helpers.resolveUntilIdle({ effectResolution: "Snatch" });
    expectFabCard(Bravo, leaveEmSpeechlessBlue).toBeIn("arena");
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Bravo.id,
      cardName: "Snatch",
    });
  });

  it("boundary: a different named card still plays from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [leaveEmSpeechlessBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], actionPoints: 1, life: 15, deck: 6 },
      namedSnatch,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(leaveEmSpeechlessBlue);
    game.helpers.resolveUntilIdle({ effectResolution: "Snatch" });
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    Dash.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
  });

  it("happy: the named card cannot be played from hand while the aura remains", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [leaveEmSpeechlessBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 15, deck: 6 },
      namedSnatch,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(leaveEmSpeechlessBlue);
    game.helpers.resolveUntilIdle({ effectResolution: "Snatch" });
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabUnplayable(() => Dash.playAttack(snatchRed), /restrict|couldn't be played/i);
    expectFabCard(Dash, snatchRed).toBeIn("hand");
  });

  it("timing: start of your action phase destroys this", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [leaveEmSpeechlessBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      namedSnatch,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(leaveEmSpeechlessBlue);
    game.helpers.resolveUntilIdle({ effectResolution: "Snatch" });
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Bravo, leaveEmSpeechlessBlue).toBeIn("graveyard");
  });
});
