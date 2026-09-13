import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { brashDefender } from "./brash-defender.ts";

function leveledClassChampion(level: number) {
  const base = createClassBonusTestChampion(brashDefender, false, "activation-discount");
  if (base.layout.kind !== "single-faced") throw new Error("Expected a single-faced champion.");
  const baseFace = requireSingleFace(base);
  const lineage = Array.from({ length: level }, (_, index) => {
    const lv = index + 1;
    return {
      ...base,
      canonicalId: `${base.canonicalId}-lv${lv}`,
      slug: `${base.slug}-lv${lv}`,
      layout: {
        kind: "single-faced" as const,
        face: {
          ...baseFace,
          id: grandArchiveDefaultFaceId(`${base.canonicalId}-lv${lv}`),
          stats: { ...baseFace.stats, level: lv },
        },
      },
    };
  });
  return { champion: base, lineage };
}

function passToEnd(game: GrandArchiveTestEngine): void {
  for (let step = 0; game.state.turn.phase !== "end" && step < 32; step++) {
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  expect(game.state.turn.phase).toBe("end");
}

/** @covers i1sh9r9rda-a1 */
describe("Brash Defender — Level 1+ Vigor", () => {
  for (const level of [0, 1]) {
    it(`level ${level} ${level >= 1 ? "wakes" : "stays rested"} at end phase`, () => {
      const { champion, lineage } = leveledClassChampion(level);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          lineage,
          zones: {
            field: [brashDefender],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const defender = player.card(brashDefender, { zone: "field" });
      player.declareAttack(defender, game.player("player-two").card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[defender.objectId]!.states.has("rested")).toBe(true);
      passToEnd(game);
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "i1sh9r9rda-a1",
        ),
      ).toBe(level >= 1);
      passEffectsStack(game);
      expect(game.state.objects[defender.objectId]!.states.has("rested")).toBe(level < 1);
    });
  }
});

/** @covers i1sh9r9rda-a2 */
describe("Brash Defender — Retort 3", () => {
  it("deals 4 while retaliating", () => {
    const champion = createClassBonusTestChampion(brashDefender, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [brashDefender] } },
      playerTwo: { champion, zones: { field: [automatedGardener] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const defender = player.card(brashDefender, { zone: "field" });
    const attacker = opponent.card(automatedGardener, { zone: "field" });
    opponent.declareAttack(attacker, defender);
    let retaliated = false;
    for (let step = 0; game.state.combat && step < 40; step++) {
      const wait = game.waitState();
      if (game.state.decision?.kind === "choose-retaliators") {
        answerDecision(game, "choose-retaliators", [defender.objectId]);
        retaliated = true;
      } else if (game.answerForcedDecision()) continue;
      else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
      else throw new Error(`Unexpected ${wait.kind}`);
    }
    expect(retaliated).toBe(true);
    expect(game.state.combat).toBeNull();
    expect(opponent.zone("graveyard")).toContainEqual(attacker);
    expect(game.state.objects[defender.objectId]!.damage).toBe(2);
  });
});
