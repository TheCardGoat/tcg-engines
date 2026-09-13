import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { unrelentingWarden } from "./unrelenting-warden.ts";

function leveledClassChampion(matching: boolean, level: number) {
  const base = createClassBonusTestChampion(unrelentingWarden, matching, "activation-discount");
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

/** @covers icvkegsdve-a1 */
describe("Unrelenting Warden — Class Bonus Taunt", () => {
  for (const classBonus of [false, true]) {
    it(`Class Bonus=${classBonus}`, () => {
      const champion = createClassBonusTestChampion(
        unrelentingWarden,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: { champion, zones: { field: [unrelentingWarden, woodlandSquirrels] } },
        playerTwo: { champion, zones: { field: [automatedGardener, automatedGardener] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const warden = player.card(unrelentingWarden, { zone: "field" });
      const other = player.card(woodlandSquirrels, { zone: "field" });
      const attackers = opponent.cards(automatedGardener, { zone: "field" });
      if (classBonus) {
        const before = game.state;
        expect(() => opponent.declareAttack(attackers[0]!, other)).toThrow();
        expect(game.state).toEqual(before);
        expect(() => opponent.declareAttack(attackers[0]!, player.card(champion))).toThrow();
        expect(game.state).toEqual(before);
      } else {
        opponent.declareAttack(attackers[0]!, other);
        game.resolveCombatWithoutRetaliation();
        expect(player.zone("graveyard")).toContainEqual(other);
      }
      const wait = game.waitState();
      if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
        game.player(wait.playerId).pass();
      opponent.declareAttack(attackers[classBonus ? 0 : 1]!, warden);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[warden.objectId]!.damage).toBe(2);
    });
  }
});

/** @covers icvkegsdve-a2 */
describe("Unrelenting Warden — Level 2+ Vigor", () => {
  for (const level of [1, 2]) {
    it(`level ${level} ${level >= 2 ? "wakes" : "stays rested"} at end phase`, () => {
      const { champion, lineage } = leveledClassChampion(false, level);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          lineage,
          zones: {
            field: [unrelentingWarden],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const warden = player.card(unrelentingWarden, { zone: "field" });
      player.declareAttack(warden, game.player("player-two").card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[warden.objectId]!.states.has("rested")).toBe(true);
      passToEnd(game);
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "icvkegsdve-a2",
        ),
      ).toBe(level >= 2);
      passEffectsStack(game);
      expect(game.state.objects[warden.objectId]!.states.has("rested")).toBe(level < 2);
    });
  }
});
