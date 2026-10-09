import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { findTheLost } from "./find-the-lost.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { aesanProtector } from "../../DOA/allies/aesan-protector.ts";
import { titanMkIi } from "../../RDO/tokens/titan-mk-ii.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  answerDecision,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
/** @covers jTBNAEedbg-a1
 * @covers jTBNAEedbg-a2
 */
describe("Find the Lost", () => {
  for (const mode of ["missing", "declined", "prepared"])
    for (const defense of ["taunt", "intercept"])
      it(`${mode} against ${defense}`, () => {
        const champion = createClassBonusTestChampion(findTheLost, false, "activation-discount");
        const defender = defense === "taunt" ? titanMkIi : aesanProtector;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                findTheLost,
                ...(mode === "missing" ? [] : [acceptedContract]),
                ...Array.from({ length: mode === "missing" ? 2 : 7 }, () => woodlandSquirrels),
              ],
            },
          },
          playerTwo: { champion, zones: { field: [defender] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          foe = q.card(champion),
          guard = q.card(defender);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(findTheLost, {
            reservePayment: pay(2),
            attackAttackerId: hero.objectId,
            prepareAbilityIndexes: [0],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        if (mode !== "missing") {
          p.activate(acceptedContract, { reservePayment: pay(5) });
          passEffectsStack(game);
        }
        p.activate(findTheLost, {
          reservePayment: pay(2),
          attackAttackerId: hero.objectId,
          ...(mode === "prepared" ? { prepareAbilityIndexes: [0] as const } : {}),
        });
        expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(
          mode === "missing" ? 0 : mode === "prepared" ? 2 : 3,
        );
        passEffectsStack(game);
        if (defense === "taunt" && mode !== "prepared") {
          const current = game.state;
          expect(() =>
            declareResolvedAttack(game, hero.objectId, foe.objectId, "Cannot ignore Taunt"),
          ).toThrow();
          expect(game.state).toEqual(current);
          declareResolvedAttack(game, hero.objectId, guard.objectId, "Attack Taunt");
        } else declareResolvedAttack(game, hero.objectId, foe.objectId, "Attack champion");
        let intercepted = false;
        for (let step = 0; step < 64 && (game.state.combat || game.state.stack.length); step++) {
          const decision = game.state.decision;
          if (decision?.kind === "resolve-optional-effect") {
            intercepted = true;
            answerDecision(game, decision.kind, true);
          } else if (decision?.kind === "choose-retaliators")
            answerDecision(game, decision.kind, []);
          else {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
        }
        expect(game.state.combat).toBeNull();
        expect(intercepted).toBe(defense === "intercept");
        expect(game.state.objects[foe.objectId]!.damage).toBe(mode === "prepared" ? 3 : 0);
        if (defense === "intercept")
          expect(game.state.objects[guard.objectId]!.damage).toBe(mode === "prepared" ? 0 : 3);
      });
});
