import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { intensifiedPyre } from "./intensified-pyre.ts";
import { backdash } from "./backdash.ts";
import { condemnedTrinket } from "../items/condemned-trinket.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/**
 * @covers hd0sxpu7cp-a1
 * @covers hd0sxpu7cp-a2
 */
describe("Intensified Pyre — Kindle and the target controller's graveyard", () => {
  for (const count of [0, 1, 2, 3])
    for (const self of [false, true])
      for (const graveCount of [7, 8, 9])
        it(`Kindle=${count}, self=${self}, target graveyard=${graveCount}`, () => {
          const champion = createClassBonusTestChampion(
            intensifiedPyre,
            false,
            "activation-discount",
          );
          const ownCount = self ? graveCount : 12;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  intensifiedPyre,
                  sparkAlight,
                  woodlandSquirrels,
                  woodlandSquirrels,
                  woodlandSquirrels,
                ],
                graveyard: [
                  ...Array.from({ length: 4 }, () => sparkAlight),
                  ...Array.from({ length: ownCount - 4 }, () => woodlandSquirrels),
                ],
                banishment: [sparkAlight],
                field: [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                graveyard: Array.from({ length: self ? 12 : graveCount }, () => sparkAlight),
                field: [woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            target = (self ? p : q).card(champion),
            source = p.card(intensifiedPyre);
          const fire = p.cards(sparkAlight, { zone: "graveyard" }).map((c) => c.objectId);
          const payment = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          for (const invalid of [
            [fire[0]!, fire[0]!],
            fire,
            [q.cards(sparkAlight, { zone: "graveyard" })[0]!.objectId],
            [p.card(sparkAlight, { zone: "hand" }).objectId],
            [p.card(sparkAlight, { zone: "banishment" }).objectId],
            [p.cards(woodlandSquirrels, { zone: "graveyard" })[0]!.objectId],
          ]) {
            expect(() =>
              p.activate(source, {
                targets: { "target-1": [target.objectId] },
                kindleCardIds: invalid,
                reservePayment: payment(Math.max(0, 3 - invalid.length)),
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          for (const ids of [
            [q.card(woodlandSquirrels, { zone: "field" }).objectId],
            [p.id],
            [p.card(champion).objectId, q.card(champion).objectId],
          ]) {
            expect(() =>
              p.activate(source, { targets: { "target-1": ids }, reservePayment: payment(3) }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          if (count < 3) {
            expect(() =>
              p.activate(source, {
                targets: { "target-1": [target.objectId] },
                kindleCardIds: fire.slice(0, count),
                reservePayment: payment(2 - count),
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(source, {
            targets: { "target-1": [target.objectId] },
            kindleCardIds: fire.slice(0, count),
            reservePayment: payment(3 - count),
          });
          expect(p.zone("memory")).toHaveLength(3 - count);
          for (const [index, id] of fire.entries())
            expect(game.state.objects[id]!.zone).toBe(index < count ? "banishment" : "graveyard");
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(
            graveCount - (self ? count : 0) >= 8 ? 6 : 2,
          );
          expect(game.state.objects[(self ? q : p).card(champion).objectId]!.damage).toBe(0);
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        });

  for (const increases of [false, true])
    it(`checks the graveyard on resolution after it ${increases ? "rises to eight" : "falls to seven"}`, () => {
      const champion = createClassBonusTestChampion(intensifiedPyre, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [intensifiedPyre, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [condemnedTrinket],
            hand: [backdash, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            graveyard: Array.from({ length: increases ? 7 : 8 }, () => sparkAlight),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        target = q.card(champion);
      const payment = (player: typeof p, count: number) =>
        player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, count)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      p.activate(intensifiedPyre, {
        targets: { "target-1": [target.objectId] },
        reservePayment: payment(p, 3),
      });
      p.pass();
      if (increases)
        q.activate(backdash, {
          targets: { "target-1": [target.objectId] },
          reservePayment: payment(q, 1),
        });
      else q.activateAbility(condemnedTrinket, "21oy1nd4nw-a1", { reservePayment: payment(q, 3) });
      passEffectsStack(game);
      if (!increases) {
        answerDecision(game, "resolve-effect-choice", [
          q.cards(sparkAlight, { zone: "graveyard" })[0]!.objectId,
        ]);
        passEffectsStack(game);
      }
      expect(q.zone("graveyard")).toHaveLength(increases ? 8 : 7);
      expect(game.state.objects[target.objectId]!.damage).toBe(increases ? 6 : 2);
    });
});
