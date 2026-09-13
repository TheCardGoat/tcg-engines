import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { umbralTithe } from "./umbral-tithe.ts";

const baseCurseChampion = lineageTestChampion("Test Champion", 1);
if (baseCurseChampion.layout.kind !== "single-faced") {
  throw new Error("The test Curse champion must be single-faced");
}
const baseCurseFace = baseCurseChampion.layout.face;
const curseChampion = {
  ...baseCurseChampion,
  canonicalId: "umbral-tithe-test-curse-champion",
  slug: "umbral-tithe-test-curse-champion",
  layout: {
    kind: "single-faced",
    face: {
      ...baseCurseFace,
      id: "umbral-tithe-test-curse-champion:face:default",
      catalogId: "umbral-tithe-test-curse-champion",
      elements: ["UMBRA"],
      typeLine: {
        ...baseCurseFace.typeLine,
        subtypes: [...baseCurseFace.typeLine.subtypes, "CURSE"],
      },
    },
  },
} as const;

/** @covers 2snsdwmxz1-a1 */
describe("Umbral Tithe — global Curse discount and memory threshold", () => {
  for (const curseCount of [0, 2]) {
    for (const opponentMemory of [3, 4]) {
      it(`${curseCount} Curses and ${opponentMemory} opposing memory`, () => {
        const champion = createClassBonusTestChampion(umbralTithe, false, "activation-discount");
        const cost = 5 - curseCount;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            lineage: curseCount > 0 ? [curseChampion] : undefined,
            zones: {
              hand: [umbralTithe, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            lineage: curseCount > 0 ? [curseChampion] : undefined,
            zones: {
              memory: Array.from({ length: opponentMemory }, () => woodlandSquirrels),
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const reservePayment = player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, cost)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
        const before = game.state;
        expect(() =>
          player.activate(umbralTithe, { reservePayment: reservePayment.slice(0, -1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        player.activate(umbralTithe, { reservePayment });
        expect(player.zone("memory")).toHaveLength(cost);
        expect(opponent.zone("memory")).toHaveLength(opponentMemory);
        passEffectsStack(game);
        expect(player.zone("memory")).toHaveLength(cost + 2);
        expect(opponent.zone("memory")).toHaveLength(opponentMemory + 2);
        expect(game.state.objects[player.card(champion).objectId]!.damage).toBe(
          cost + 2 >= 6 ? 4 : 0,
        );
        expect(game.state.objects[opponent.card(champion).objectId]!.damage).toBe(
          opponentMemory + 2 >= 6 ? 4 : 0,
        );
      });
    }
  }
});
