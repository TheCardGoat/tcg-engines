import { describe } from "vitest";
import { frostnipPirouette } from "./frostnip-pirouette.ts";

import { proveChampionActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers x79cuuw5vo-a1 */
describe("frostnipPirouette — named champion discount", () => {
  proveChampionActivationDiscount({
    card: frostnipPirouette,
    discount: 2,
    lineageName: "Diao Chan",
  });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers x79cuuw5vo-a2 */
describe("Frostnip Pirouette — chosen objects", () => {
  for (const count of [0, 1, 4])
    it(`chooses ${count} non-champion objects across both fields`, () => {
      const champion = enableAllTestElements(
        createLineageTestChampion(frostnipPirouette, "Diao Chan"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [giantTortoise, trainingSword],
            hand: [frostnipPirouette, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [giantTortoise, trainingSword] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        objects = [
          p.card(giantTortoise),
          q.card(trainingSword),
          q.card(giantTortoise),
          p.card(trainingSword),
        ];
      p.activate(frostnipPirouette, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      passEffectsStack(game);
      const before = game.state;
      for (const ids of [
        [p.card(champion).objectId],
        [q.card(champion).objectId],
        [objects[0]!.objectId, objects[0]!.objectId],
      ]) {
        expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
        expect(game.state).toEqual(before);
      }
      answerDecision(
        game,
        "resolve-effect-choice",
        objects.slice(0, count).map((ref) => ref.objectId),
      );
      passEffectsStack(game);
      for (let i = 0; i < objects.length; i++)
        expect(game.state.objects[objects[i]!.objectId]!.counters.wither ?? 0).toBe(
          i < count ? 1 : 0,
        );
    });
});
