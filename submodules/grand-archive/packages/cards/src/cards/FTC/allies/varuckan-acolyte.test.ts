import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { varuckanAcolyte } from "./varuckan-acolyte.ts";
import { proveLevelAllyStats } from "../../../testing/level-ally-stats.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { crystalOfEmpowerment } from "../../DOA/items/crystal-of-empowerment.ts";
import { fluteOfTaming } from "../../DOA/items/flute-of-taming.ts";

/** @covers a4dk88zq9o-a2 */
describe("Varuckan Acolyte — Level 3 power", () => proveLevelAllyStats(varuckanAcolyte, 3, 3, 0));
/** @covers a4dk88zq9o-a1 */
describe("Varuckan Acolyte — zero-memory Regalia destruction", () => {
  for (const matching of [false, true])
    for (const own of [false, true])
      for (const targetCard of [trainingSword, crystalOfEmpowerment])
        for (const removed of targetCard === crystalOfEmpowerment ? [false, true] : [false])
          it(`class=${matching}, own=${own}, target=${targetCard.slug}, removed=${removed}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(varuckanAcolyte, matching, "activation-discount"),
            );
            const field = [trainingSword, crystalOfEmpowerment, fluteOfTaming, woodlandSquirrels];
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field,
                  hand: [varuckanAcolyte, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                  graveyard: [trainingSword],
                },
              },
              playerTwo: { champion, zones: { field } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              owner = own ? p : q,
              target = owner.card(targetCard, { zone: "field" });
            const others = [...p.zone("field"), ...q.zone("field")].filter(
              (ref) => ref.objectId !== target.objectId,
            );
            const payment = p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            const before = game.state;
            expect(() =>
              p.activate(varuckanAcolyte, { reservePayment: payment.slice(1) }),
            ).toThrow();
            expect(game.state).toEqual(before);
            p.activate(varuckanAcolyte, { reservePayment: payment });
            passEffectsStack(game);
            expect(p.card(varuckanAcolyte, { zone: "field" })).toBeDefined();
            expect(game.state.decision?.kind).toBe("announce-triggered-ability");
            for (const invalid of [
              p.card(champion),
              q.card(fluteOfTaming),
              q.card(woodlandSquirrels, { zone: "field" }),
              p.card(trainingSword, { zone: "graveyard" }),
            ]) {
              const prior = game.state;
              expect(() =>
                answerDecision(game, "announce-triggered-ability", {
                  targets: { "target-1": [invalid.objectId] },
                }),
              ).toThrow();
              expect(game.state).toEqual(prior);
            }
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-1": [target.objectId] },
            });
            expect(game.state.objects[target.objectId]!.zone).toBe("field");
            if (removed) {
              const wait = game.waitState();
              if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
              if (wait.playerId !== owner.id) game.player(wait.playerId).pass();
              owner.activateAbility(target, "dmfoA7jOjy-a1");
            }
            passEffectsStack(game);
            expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
            for (const ref of others) expect(game.state.objects[ref.objectId]!.zone).toBe("field");
            expect(game.state.decision).toBeNull();
            expect(game.state.stack).toHaveLength(0);
          });
  for (const matching of [false, true])
    it(`enters without a legal Regalia target, class=${matching}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(varuckanAcolyte, matching, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [varuckanAcolyte, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { field: [fluteOfTaming, woodlandSquirrels], graveyard: [trainingSword] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      p.activate(varuckanAcolyte, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(p.card(varuckanAcolyte, { zone: "field" })).toBeDefined();
      expect(q.card(fluteOfTaming, { zone: "field" })).toBeDefined();
      expect(game.state.decision).toBeNull();
      expect(game.state.stack).toHaveLength(0);
    });
});
