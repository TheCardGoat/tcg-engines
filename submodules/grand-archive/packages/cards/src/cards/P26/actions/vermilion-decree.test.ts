import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { vermilionDecree } from "./vermilion-decree.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers tjej4mcnqs-a1 */
describe("Vermilion Decree — Imbue", () => {
  proveImbueKeyword({
    card: vermilionDecree,
    cost: { kind: "reserve", amount: 3 },
    threshold: 3,
    requirement: "source-elements",
  });
});

/** @covers tjej4mcnqs-a2 */
describe("Vermilion Decree — independent mode targets", () => {
  for (const modeIds of [
    ["mode-1"],
    ["mode-2"],
    ["mode-3"],
    ["mode-1", "mode-3"],
    ["mode-2", "mode-3"],
    ["mode-1", "mode-2"],
    ["mode-2", "mode-1"],
  ]) {
    for (const omitChampion of [false, true]) {
      it(`resolves ${modeIds.join(", ")} with optional champion target omitted=${omitChampion}`, () => {
        const champion = createClassBonusTestChampion(
          vermilionDecree,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: Array.from({ length: 4 }, () => vermilionDecree),
              "main-deck": [giantTortoise],
            },
          },
          playerTwo: { champion, zones: { field: [giantTortoise], "main-deck": [giantTortoise] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const [source, ...payments] = p.cards(vermilionDecree, { zone: "hand" });
        const championRef = q.card(champion),
          allyRef = q.card(giantTortoise);
        const options = {
          modeIds,
          revealForImbue: modeIds.length === 2,
          reservePayment: payments.map((card) => ({
            kind: "card" as const,
            cardId: card.objectId,
          })),
          targets: {
            ...(modeIds.includes("mode-1")
              ? { "target-1": omitChampion ? [] : [championRef.objectId] }
              : {}),
            ...(modeIds.includes("mode-2") ? { "mode-2:target-1": [allyRef.objectId] } : {}),
          },
        };
        const before = game.state;
        if (modeIds.length === 2)
          expect(() => p.activate(source!, { ...options, revealForImbue: false })).toThrow();
        expect(game.state).toEqual(before);
        if (modeIds.includes("mode-2"))
          expect(() =>
            p.activate(source!, {
              ...options,
              targets: { ...options.targets, "mode-2:target-1": [championRef.objectId] },
            }),
          ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(source!, options);
        passEffectsStack(game);
        expect(game.state.objects[championRef.objectId]!.damage).toBe(
          omitChampion || !modeIds.includes("mode-1") ? 0 : 3,
        );
        expect(game.state.objects[allyRef.objectId]!.damage).toBe(
          modeIds.includes("mode-2") ? 2 : 0,
        );
        expect(p.cards(giantTortoise, { zone: "hand" })).toHaveLength(
          modeIds.includes("mode-3") ? 1 : 0,
        );
        expect(q.cards(giantTortoise, { zone: "hand" })).toHaveLength(
          modeIds.includes("mode-3") ? 1 : 0,
        );
        expect(p.cards(vermilionDecree, { zone: "graveyard" })).toHaveLength(1);
      });
    }
  }
});
