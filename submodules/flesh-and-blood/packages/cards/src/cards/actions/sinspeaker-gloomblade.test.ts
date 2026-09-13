import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { runechantOfLustYellow as runechantOfLust } from "../instants/runechant-of-lust.ts";
import { sinspeakerGloombladeRed } from "./sinspeaker-gloomblade.ts";

/**
 * Sinspeaker Gloomblade Red (IAR112) — Shadow Runeblade Attack.
 *
 * Printed: You may play this from your banished zone. If you did, when this
 * attacks, you may search for an aura with Runechant in its name and put it
 * into the arena.
 */

describe("Sinspeaker Gloomblade (IAR112) AAA", () => {
  it("happy: playing from banished searches a Runechant aura into the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        banished: [sinspeakerGloombladeRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [runechantOfLust],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(sinspeakerGloombladeRed, {
      from: "banished",
      optionals: "accept",
      entityTargets: "pause",
    });
    Chane.target(Chane.cardIn("deck", runechantOfLust));
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });

    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Chane, runechantOfLust).toBeIn("arena");
  });

  it("boundary: playing from hand does not search", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [sinspeakerGloombladeRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [runechantOfLust],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(sinspeakerGloombladeRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expect(Chane.zone("deck")).toContain(runechantOfLust.canonicalId);
  });

  it("timing: declining the search leaves the Runechant in the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        banished: [sinspeakerGloombladeRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: [runechantOfLust],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(sinspeakerGloombladeRed, { from: "banished", optionals: "decline" });
    game.helpers.resolveUntilIdle();

    expect(Chane.zone("deck")).toContain(runechantOfLust.canonicalId);
  });
});
