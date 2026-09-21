import { madHatterMoroseHeritor } from "./mad-hatter-morose-heritor.ts";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { trivariateDream } from "../weapons/trivariate-dream.ts";
import { radiantVega } from "../weapons/radiant-vega.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { describe, expect, it } from "vitest";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers 2nc48s3oqh-a1 */
describe("mad-hatter-morose-heritor — Ranged combat", () => {
  proveRangedAlly({ card: madHatterMoroseHeritor, power: 1, ranged: 3, classBonus: false });
});

/** @covers 2nc48s3oqh-a2 */
describe("Mad Hatter — optional random material-deck banish then paid Ranger materialization", () => {
  for (const card of [trivariateDream, radiantVega])
    for (const accept of [false, true])
      for (const seed of [1, 2, 3, 4])
        it(`${card.slug}, accept=${accept}, seed=${seed}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(madHatterMoroseHeritor, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            randomSeed: seed,
            playerOne: {
              champion,
              zones: {
                hand: [
                  madHatterMoroseHeritor,
                  woodlandSquirrels,
                  woodlandSquirrels,
                  woodlandSquirrels,
                ],
                "material-deck": [card, card, trainingSword, trainingSword],
                banishment: [card],
              },
            },
            playerTwo: { champion, zones: { "material-deck": [card] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(madHatterMoroseHeritor),
            material = p.zone("material-deck");
          const payment = p
            .cards(woodlandSquirrels)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          expect(() => p.activate(source, { reservePayment: payment.slice(0, 2) })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(source, { reservePayment: payment });
          expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
          expect(p.zone("material-deck")).toEqual(material);
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          expect(p.zone("material-deck")).toEqual(material);
          expect(game.state.decision?.kind).toBe("resolve-optional-effect");
          answerDecision(game, "resolve-optional-effect", accept);
          passEffectsStack(game);
          if (accept) {
            const banished = material.filter(
              (c) => game.state.objects[c.objectId]!.zone === "banishment",
            );
            expect(banished).toHaveLength(1);
            expect(p.zone("material-deck")).toHaveLength(3);
            const selected = p.cards(card, { zone: "material-deck" })[0]!;
            if (game.state.decision?.kind === "resolve-effect-choice") {
              const pending = game.state;
              for (const invalid of [
                [p.cards(trainingSword, { zone: "material-deck" })[0]!.objectId],
                [q.card(card, { zone: "material-deck" }).objectId],
                [p.cards(card, { zone: "banishment" })[0]!.objectId],
                [selected.objectId, selected.objectId],
              ]) {
                expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
                expect(game.state).toEqual(pending);
              }
              answerDecision(game, "resolve-effect-choice", [selected.objectId]);
            }
            expect(game.state.decision).toMatchObject({
              kind: "announce-effect-materialization",
              payCosts: true,
              playerId: p.id,
            });
            expect(p.zone("memory")).toHaveLength(3);
            answerDecision(game, "announce-effect-materialization", {});
            expect(p.zone("memory")).toHaveLength(card === radiantVega ? 2 : 3);
            expect(game.state.objects[selected.objectId]!.zone).toBe("effects-stack");
            expect(p.cards(card, { zone: "field" })).toHaveLength(0);
            passEffectsStack(game);
            expect(game.state.objects[selected.objectId]!.zone).toBe("field");
            expect(p.zone("material-deck")).toHaveLength(2);
          } else {
            expect(p.zone("material-deck")).toEqual(material);
            expect(p.zone("memory")).toHaveLength(3);
            expect(p.cards(card, { zone: "field" })).toHaveLength(0);
          }
          expect(q.cards(card, { zone: "material-deck" })).toHaveLength(1);
          expect(game.state.decision).toBeFalsy();
          expect(game.state.stack).toHaveLength(0);
        });

  for (const scenario of ["empty", "no Ranger", "only Ranger"] as const)
    it(`finishes when the material deck is ${scenario}`, () => {
      const champion = createClassBonusTestChampion(
        madHatterMoroseHeritor,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [madHatterMoroseHeritor, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "material-deck":
              scenario === "empty"
                ? []
                : scenario === "no Ranger"
                  ? [trainingSword]
                  : [trivariateDream],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one");
      p.activate(madHatterMoroseHeritor, {
        reservePayment: p
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
      passEffectsStack(game);
      if (scenario !== "empty") {
        expect(game.state.decision?.kind).toBe("resolve-optional-effect");
        answerDecision(game, "resolve-optional-effect", true);
        passEffectsStack(game);
      }
      expect(game.state.decision).toBeFalsy();
      expect(game.state.stack).toHaveLength(0);
      expect(p.zone("material-deck")).toHaveLength(0);
      expect(p.zone("banishment")).toHaveLength(scenario === "empty" ? 0 : 1);
      expect(p.zone("field")).toHaveLength(2);
      expect(p.zone("memory")).toHaveLength(3);
    });
});
