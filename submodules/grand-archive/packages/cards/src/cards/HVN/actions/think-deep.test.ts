import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { favorableWinds } from "../../DOA/actions/favorable-winds.ts";
import { fatestoneOfRevelations } from "../../P25/items/fatestone-of-revelations.ts";
import { thinkDeep } from "./think-deep.ts";

/** @covers xw9w6y7vtz-a1 */
describe("Think Deep — Fatestone or Fatebound cost", () => {
  for (const support of [
    "none",
    "own-fatestone",
    "own-fatebound",
    "both",
    "opponent-fatestone",
    "opponent-fatebound",
    "hand",
    "graveyard",
  ] as const)
    it(`discount requires own field support: ${support}`, () => {
      const champion = enableAllTestElements(lineageTestChampion("Guo Jia", 0));
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              thinkDeep,
              ...(support === "hand" ? [fatestoneOfRevelations] : []),
              ...Array.from({ length: 12 }, () => woodlandSquirrels),
            ],
            field:
              support === "both"
                ? [fatestoneOfRevelations, fatestoneOfRevelations]
                : support.startsWith("own-")
                  ? [fatestoneOfRevelations]
                  : [],
            graveyard: support === "graveyard" ? [fatestoneOfRevelations] : [],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: support.startsWith("opponent-") ? [fatestoneOfRevelations] : [],
            hand: Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const ownTransformed = support === "own-fatebound" || support === "both";
      if (ownTransformed) {
        p.activateAbility(p.cards(fatestoneOfRevelations, { zone: "field" })[0]!, "xd4kv0akqr-a2", {
          reservePayment: pay(6),
        });
        passEffectsStack(game);
      }
      if (support === "opponent-fatebound") {
        p.pass();
        q.activateAbility(q.card(fatestoneOfRevelations), "xd4kv0akqr-a2", {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
      }
      const cost = support.startsWith("own-") || support === "both" ? 2 : 4;
      for (const invalid of [cost - 1, cost + 1]) {
        const before = game.state;
        expect(() => p.activate(thinkDeep, { reservePayment: pay(invalid) })).toThrow();
        expect(game.state).toEqual(before);
      }
      p.activate(thinkDeep, { reservePayment: pay(cost) });
      passEffectsStack(game);
      expect(game.state.decision).toBeNull();
      expect(p.zone("memory")).toHaveLength(cost + (ownTransformed ? 6 : 0));
      expect(game.state.winnerIds).toEqual([]);
    });
});

/** @covers xw9w6y7vtz-a2 */
describe("Think Deep — Glimpse then optionally mill the new top", () => {
  for (const matching of [false, true])
    for (const deckSize of [0, 1, 2, 5])
      for (const placement of ["top", "bottom", "split"] as const)
        for (const count of [0, 1, 2].filter((n) => n <= deckSize))
          it(`class=${matching}, deck=${deckSize}, glimpse=${placement}, mill=${count}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(thinkDeep, matching, "activation-discount"),
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  hand: [thinkDeep, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
                  "main-deck": [
                    fireball,
                    favorableWinds,
                    woodlandSquirrels,
                    fireball,
                    favorableWinds,
                  ].slice(0, deckSize),
                },
              },
              playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              source = p.card(thinkDeep);
            const original = p.zone("main-deck").map((c) => c.objectId),
              enemyDeck = q.zone("main-deck");
            p.activate(source, {
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .map((c) => ({ kind: "card", cardId: c.objectId })),
            });
            expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(original);
            passEffectsStack(game);
            let ordered = original;
            if (deckSize) {
              const viewed = original.slice(0, 2),
                top =
                  placement === "top"
                    ? [...viewed].reverse()
                    : placement === "split"
                      ? viewed.slice(-1)
                      : [],
                bottom =
                  placement === "bottom"
                    ? [...viewed].reverse()
                    : placement === "split"
                      ? viewed.slice(0, -1)
                      : [];
              expect(game.state.decision).toMatchObject({
                kind: "resolve-glimpse",
                playerId: p.id,
                cardIds: viewed,
              });
              answerDecision(game, "resolve-glimpse", { kind: "reorder", top, bottom });
              passEffectsStack(game);
              ordered = [...top, ...original.slice(viewed.length), ...bottom];
              expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(ordered);
              expect(game.state.decision).toMatchObject({
                kind: "resolve-effect-choice",
                playerId: p.id,
              });
              for (const ids of [
                [q.zone("main-deck")[0]!.objectId],
                [source.objectId],
                [ordered[0]!, ordered[0]!],
                ...(ordered.length > 1 ? [[ordered[1]!]] : []),
                ...(ordered.length > 2 ? [[ordered[2]!], ordered.slice(0, 3)] : []),
              ]) {
                const before = game.state;
                expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-effect-choice", ordered.slice(0, count));
              passEffectsStack(game);
            }
            expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(ordered.slice(count));
            expect(p.zone("graveyard").map((c) => c.objectId)).toEqual([
              ...ordered.slice(0, count),
              source.objectId,
            ]);
            expect(p.zone("hand")).toHaveLength(0);
            expect(p.zone("memory")).toHaveLength(4);
            expect(q.zone("main-deck")).toEqual(enemyDeck);
            expect(game.state.decision).toBeNull();
            expect(game.state.winnerIds).toEqual([]);
          });
});
