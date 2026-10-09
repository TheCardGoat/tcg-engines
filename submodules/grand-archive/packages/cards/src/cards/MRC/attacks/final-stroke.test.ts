import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { finalStroke } from "./final-stroke.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { cosmicBolt } from "../../SP4/actions/cosmic-bolt.ts";
import { plantedExplosive } from "../../P26/actions/planted-explosive.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
/** @covers ekkjn37cx6-a1
 * @covers ekkjn37cx6-a2
 */
describe("Final Stroke", () => {
  for (const matching of [false, true])
    for (const prepared of [false, true])
      for (const initialDamage of [14, 15, 16])
        it(`checks the post-hit threshold, class=${matching}, prepared=${prepared}, damage=${initialDamage}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(finalStroke, matching, "activation-discount"),
          );
          const base = createClassBonusTestChampion(fireball, false, "activation-discount");
          const opponent = {
            ...base,
            layout: {
              kind: "single-faced" as const,
              face: { ...requireSingleFace(base), stats: { level: 0, life: 30 } },
            },
          };
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  finalStroke,
                  acceptedContract,
                  cosmicBolt,
                  cosmicBolt,
                  plantedExplosive,
                  plantedExplosive,
                  ...Array.from({ length: initialDamage - 14 }, () => fireball),
                  ...Array.from({ length: 27 }, () => woodlandSquirrels),
                ],
              },
            },
            playerTwo: { champion: opponent },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            target = q.card(opponent);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          for (const [card, cost] of [
            [cosmicBolt, 3],
            [plantedExplosive, 2],
            [fireball, 4],
          ] as const)
            for (const source of p.cards(card, { zone: "hand" })) {
              p.activate(source, {
                reservePayment: pay(cost),
                targets: { "target-1": [target.objectId] },
              });
              passEffectsStack(game);
            }
          expect(game.state.objects[target.objectId]!.damage).toBe(initialDamage);
          const before = game.state;
          expect(() =>
            p.activate(finalStroke, {
              reservePayment: pay(4),
              attackAttackerId: hero.objectId,
              prepareAbilityIndexes: [0],
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(acceptedContract, { reservePayment: pay(5) });
          passEffectsStack(game);
          p.activate(finalStroke, {
            reservePayment: pay(4),
            attackAttackerId: hero.objectId,
            ...(prepared ? { prepareAbilityIndexes: [0] as const } : {}),
          });
          expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(
            prepared ? 0 : 3,
          );
          passEffectsStack(game);
          declareResolvedAttack(game, hero.objectId, target.objectId, "Resolve Final Stroke");
          for (let step = 0; step < 64 && game.state.combat; step++) {
            const wait = game.waitState();
            if (wait.kind === "game-over") break;
            if (game.state.decision?.kind === "choose-retaliators")
              answerDecision(game, "choose-retaliators", []);
            else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
            else throw new Error(`Unexpected combat wait ${wait.kind}`);
          }
          const destroyed = matching && prepared && initialDamage + 5 >= 20;
          expect(game.state.objects[target.objectId]!.zone).toBe(
            destroyed ? "banishment" : "field",
          );
          expect(game.waitState().kind === "game-over").toBe(destroyed);
          if (!destroyed)
            expect(game.state.objects[target.objectId]!.damage).toBe(initialDamage + 5);
        });
});
