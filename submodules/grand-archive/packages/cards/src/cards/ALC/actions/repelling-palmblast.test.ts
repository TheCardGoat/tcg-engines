import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { gloamspireWraith } from "../allies/gloamspire-wraith.ts";
import { exaltedDorumegianThrone } from "../domains/exalted-dorumegian-throne.ts";
import { seekersRifle } from "../weapons/seekers-rifle.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { proveFloatingMemory } from "../../../testing/floating-memory.ts";
import { repellingPalmblast } from "./repelling-palmblast.ts";

/** @covers 4xippor7ch-a2 */
describe("Repelling Palmblast — Floating Memory", () => {
  proveFloatingMemory(repellingPalmblast);
});

/** @covers 4xippor7ch-a1 */
describe("Repelling Palmblast — return allies with current power at most two", () => {
  for (const buffed of [false, true]) {
    it(`returns both players' eligible allies with a friendly power modifier ${buffed}`, () => {
      const champion = createClassBonusTestChampion(
        repellingPalmblast,
        false,
        "activation-discount",
      );
      const allies = [woodlandSquirrels, automatedGardener, gloamspireWraith];
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [...allies, seekersRifle, ...(buffed ? [exaltedDorumegianThrone] : [])],
            hand: [repellingPalmblast, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
          },
        },
        playerTwo: { champion, zones: { field: [...allies, seekersRifle] } },
      });
      const player = game.player("player-one");
      const refs = [player, game.player("player-two")].map((owner) => ({
        owner,
        allies: allies.map((card) => owner.card(card, { zone: "field" })),
        weapon: owner.card(seekersRifle, { zone: "field" }),
        champion: owner.card(champion, { zone: "field" }),
      }));
      player.activate(repellingPalmblast, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      });
      const memories = refs.map(({ owner }) => owner.zone("memory"));
      for (const group of refs)
        for (const ally of group.allies)
          expect(game.state.objects[ally.objectId]!.zone).toBe("field");
      passEffectsStack(game);
      for (const [index, group] of refs.entries()) {
        const eligible = group.owner.id === player.id && buffed ? 1 : 2;
        for (const [position, ally] of group.allies.entries()) {
          expect(game.state.objects[ally.objectId]!.zone).toBe(
            position < eligible ? "memory" : "field",
          );
        }
        expect(group.owner.zone("memory")).toEqual([
          ...memories[index]!,
          ...group.allies.slice(0, eligible),
        ]);
        expect(game.state.objects[group.champion.objectId]!.zone).toBe("field");
        expect(game.state.objects[group.weapon.objectId]!.zone).toBe("field");
      }
      if (buffed) expect(player.cards(exaltedDorumegianThrone, { zone: "field" })).toHaveLength(1);
    });
  }
});
