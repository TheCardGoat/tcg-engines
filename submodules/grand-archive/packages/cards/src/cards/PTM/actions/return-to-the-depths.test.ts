import { describe, expect, it } from "vitest";
import { returnToTheDepths } from "./return-to-the-depths.ts";
import { proveChampionNextPrevention } from "../../../testing/champion-next-prevention.ts";
/** @covers fNlJ0MaxiI-a1 */
describe("return-to-the-depths — next champion damage", () => {
  proveChampionNextPrevention({ card: returnToTheDepths, enlighten: false, reserveCost: 3 });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  createClassBonusTestChampion,
  grantTestChampionLevel,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
/** @covers fNlJ0MaxiI-a1 */
describe("Return to the Depths — Ciel prevention follow-up", () => {
  for (const matching of [false, true])
    for (const amount of [3, 4, 5])
      for (const accept of [false, true])
        for (const combat of [false, true])
          it(`offers an omen after at least three damage is prevented: ${matching}/${amount}/${accept}/combat=${combat}`, () => {
            const champion = enableAllTestElements(
              lineageTestChampion(matching ? "Ciel" : "Other", 0),
            );
            const casterBase = enableAllTestElements(
              grantTestChampionLevel(
                createClassBonusTestChampion(fireball, true, "activation-discount"),
                amount - 1,
              ),
            );
            const casterFace = requireSingleFace(casterBase);
            const caster = {
              ...casterBase,
              layout: {
                kind: "single-faced" as const,
                face: { ...casterFace, stats: { ...casterFace.stats, power: amount } },
              },
            };
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: "playerTwo",
              playerOne: {
                champion,
                zones: {
                  hand: [
                    returnToTheDepths,
                    woodlandSquirrels,
                    woodlandSquirrels,
                    woodlandSquirrels,
                  ],
                  graveyard: [woodlandSquirrels],
                },
              },
              playerTwo: {
                champion: caster,
                zones: {
                  hand: [fireball, woodlandSquirrels, woodlandSquirrels],
                  graveyard: [woodlandSquirrels],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              hero = p.card(champion),
              omen = p.card(woodlandSquirrels, { zone: "graveyard" });
            q.pass();
            p.activate(returnToTheDepths, {
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
            });
            passEffectsStack(game);
            expect(game.state.decision).toBeNull();
            const wait = game.waitState();
            if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
            if (combat) q.declareAttack(caster, hero);
            else
              q.activate(fireball, {
                reservePayment: q
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
                targets: { "target-1": [hero.objectId] },
              });
            if (matching && amount >= 4) {
              for (
                let step = 0;
                step < 16 && !game.state.stack.some((item) => item.kind === "triggered-ability");
                step++
              ) {
                const opportunity = game.waitState();
                if (game.state.decision?.kind === "choose-retaliators") {
                  answerDecision(game, "choose-retaliators", []);
                  continue;
                }
                if (opportunity.kind !== "opportunity")
                  throw new Error(`Unexpected ${opportunity.kind} before prevention trigger`);
                game.player(opportunity.playerId).pass();
              }
              const trigger = game.state.stack.find((item) => item.kind === "triggered-ability");
              expect(trigger?.sourceId).toBe(
                p.card(returnToTheDepths, { zone: "graveyard" }).objectId,
              );
              if (!combat) expect(q.cards(fireball, { zone: "graveyard" })).toHaveLength(1);
              expect(game.state.objects[hero.objectId]!.damage).toBe(1);
              expect(game.state.decision).toBeNull();
              expect(game.waitState().kind).toBe("opportunity");
            }
            if (combat && !(matching && amount >= 4)) game.resolveCombatWithoutRetaliation();
            passEffectsStack(game);
            expect(game.state.objects[hero.objectId]!.damage).toBe(1);
            if (matching && amount >= 4) {
              expect(game.state.decision?.kind).toBe("resolve-optional-effect");
              answerDecision(game, "resolve-optional-effect", accept);
              if (accept) {
                const before = game.state;
                expect(() =>
                  answerDecision(game, "resolve-effect-choice", [
                    q.card(woodlandSquirrels, { zone: "graveyard" }).objectId,
                  ]),
                ).toThrow();
                expect(game.state).toEqual(before);
                answerDecision(game, "resolve-effect-choice", [omen.objectId]);
              }
              passEffectsStack(game);
            } else expect(game.state.decision).toBeNull();
            const banished = matching && amount >= 4 && accept;
            expect(game.state.objects[omen.objectId]!.zone).toBe(
              banished ? "banishment" : "graveyard",
            );
            expect(game.state.objects[omen.objectId]!.counters.omen ?? 0).toBe(banished ? 1 : 0);
          });
});
