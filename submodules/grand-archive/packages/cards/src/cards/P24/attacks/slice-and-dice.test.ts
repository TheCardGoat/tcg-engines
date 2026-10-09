import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { sliceAndDice } from "./slice-and-dice.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
/** @covers 3jg01o26b4-a1
 * @covers 3jg01o26b4-a2
 */
describe("Slice and Dice", () => {
  for (const prepared of [false, true])
    for (const accept of [false, true])
      for (const changeTarget of [false, true])
        it(`copies only after accepting a prepared hit, prepared=${prepared}, accept=${accept}, change=${changeTarget}`, () => {
          const champion = createClassBonusTestChampion(sliceAndDice, false, "activation-discount");
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  sliceAndDice,
                  acceptedContract,
                  ...Array.from({ length: 7 }, () => woodlandSquirrels),
                ],
              },
            },
            playerTwo: { champion, zones: { field: [giantTortoise] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            foe = q.card(champion),
            ally = q.card(giantTortoise);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          const before = game.state;
          expect(() =>
            p.activate(sliceAndDice, {
              reservePayment: pay(2),
              attackAttackerId: hero.objectId,
              prepareAbilityIndexes: [0],
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(acceptedContract, { reservePayment: pay(5) });
          passEffectsStack(game);
          p.activate(sliceAndDice, {
            reservePayment: pay(2),
            attackAttackerId: hero.objectId,
            ...(prepared ? { prepareAbilityIndexes: [0] as const } : {}),
          });
          expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(
            prepared ? 0 : 3,
          );
          passEffectsStack(game);
          declareResolvedAttack(game, hero.objectId, foe.objectId, "Resolve first Slice and Dice");
          let offers = 0,
            extraAttacks = 0;
          for (
            let step = 0;
            step < 96 && (game.state.combat || game.state.stack.length || game.state.decision);
            step++
          ) {
            const decision = game.state.decision;
            if (decision?.kind === "resolve-optional-effect") {
              offers++;
              answerDecision(game, decision.kind, accept);
            } else if (decision?.kind === "announce-effect-attack") {
              extraAttacks++;
              expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(true);
              answerDecision(game, decision.kind, {
                targetIds: [changeTarget ? ally.objectId : foe.objectId],
              });
            } else if (decision?.kind === "choose-retaliators")
              answerDecision(game, decision.kind, []);
            else {
              const wait = game.waitState();
              if (wait.kind !== "opportunity")
                throw new Error(`Unexpected ${JSON.stringify(decision)}`);
              game.player(wait.playerId).pass();
            }
          }
          expect(game.state.combat).toBeNull();
          expect(offers).toBe(prepared ? 1 : 0);
          expect(extraAttacks).toBe(prepared && accept ? 1 : 0);
          expect(game.state.objects[foe.objectId]!.damage).toBe(
            prepared && accept && !changeTarget ? 9 : 3,
          );
          expect(q.cards(giantTortoise, { zone: "graveyard" })).toHaveLength(
            prepared && accept && changeTarget ? 1 : 0,
          );
        });
});
