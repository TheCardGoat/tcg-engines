import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { mightyWindupRed } from "./mighty-windup.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { aggressivePounceRed } from "./aggressive-pounce.ts";
import { fightFairRed } from "./fight-fair.ts";
import { snatchRed } from "./snatch.ts";
import { alphaRampageRed } from "./alpha-rampage.ts";
import { songOfSinewYellow } from "./song-of-sinew.ts";

function putSongRevealBack(
  game: FabTestEngine,
  order: (entryIds: readonly string[]) => readonly string[] = (entryIds) => entryIds,
): readonly string[] {
  game.passBoth();
  const decision = game.pendingDecision();
  expect(decision?.kind).toBe("partition");
  if (decision?.kind !== "partition") throw new Error("expected Song of Sinew reorder decision");
  const entryIds = decision.entries.map((entry) => entry.id);
  const result = game.exec({
    move: "answer-decision",
    actorId: decision.actorId,
    payload: {
      decisionId: decision.decisionId,
      stateVersion: decision.stateVersion,
      answer: { kind: "partition", groups: { top: order(entryIds) } },
    },
  });
  expect(result.accepted).toBe(true);
  return entryIds;
}

describe("Song of Sinew (SUP134) AAA", () => {
  it("happy: reveal the top 4, put them back, and the next attack gets +X{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [songOfSinewYellow, aggressivePounceRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [
          snatchRed,
          snatchRed,
          fightFairRed,
          mightyWindupRed,
          aggressivePounceRed,
          alphaRampageRed,
        ],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(songOfSinewYellow);
    putSongRevealBack(game, (entryIds) => [...entryIds].reverse());
    game.helpers.resolveUntilIdle();

    expectFabCard(Rhinar, songOfSinewYellow).toBeIn("graveyard");
    expect(Rhinar.zone("deck")).toHaveLength(6);
    // The player-selected list is bottom-to-top for a top-of-deck insertion,
    // so its last card is the next card drawn.
    expect(Rhinar.zone("deck").slice(-4)).toEqual([
      fightFairRed.canonicalId,
      mightyWindupRed.canonicalId,
      aggressivePounceRed.canonicalId,
      alphaRampageRed.canonicalId,
    ]);
    Rhinar.attackWith(aggressivePounceRed);
    // Printed 6 + 4 revealed 6+{p} cards.
    expect(game.combat()?.activeLink?.attackPower).toBe(10);
  });

  it("boundary: revealing only sub-6{p} cards puts them back and the next attack stays at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [songOfSinewYellow, aggressivePounceRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(songOfSinewYellow);
    putSongRevealBack(game);
    game.helpers.resolveUntilIdle();

    expectFabCard(Rhinar, songOfSinewYellow).toBeIn("graveyard");
    Rhinar.attackWith(aggressivePounceRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("timing: go again refunds the action point so the next attack can be played this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [songOfSinewYellow, aggressivePounceRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(songOfSinewYellow);
    putSongRevealBack(game);
    game.helpers.resolveUntilIdle();

    expectFabCard(Rhinar, songOfSinewYellow).toBeIn("graveyard");
    expect(Rhinar.zone("hand")).toContain(aggressivePounceRed.canonicalId);
    Rhinar.attackWith(aggressivePounceRed);
    expect(game.combat()?.open).toBe(true);
  });
});
