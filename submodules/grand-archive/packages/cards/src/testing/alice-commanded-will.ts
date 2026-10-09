import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements, grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { answerDecision, declareResolvedAttack, passEffectsStack } from "./decisions.ts";
import { enPassant } from "../cards/PTM/attacks/en-passant.ts";
import { trainingSession } from "../cards/DOA/actions/training-session.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { snowWhiteWeissQueen } from "../cards/DTR/allies/snow-white-weiss-queen.ts";
export function proveAliceCommandedWill(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  bonus: number,
) {
  for (const named of [false, true])
    for (const buffed of [false, true])
      for (const mode of ["normal", "command", "other-command", "retaliation"] as const)
        it(`Alice=${named}, buffed=${buffed}, mode=${mode}`, () => {
          const champion = enableAllTestElements(lineageTestChampion(named ? "Alice" : "Other", 0));
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [card, snowWhiteWeissQueen],
                hand: [
                  enPassant,
                  trainingSession,
                  ...Array.from({ length: 4 }, () => woodlandSquirrels),
                ],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [card, giantTortoise],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(card),
            other = q.card(card),
            foe = q.card(champion),
            hero = p.card(champion),
            base = grandArchiveTestFace(card).stats.power! + (buffed ? 1 : 0);
          const power = (id: typeof source.objectId) =>
            deriveGrandArchiveNumericProperty(game.state.objects[id]!, "power", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (buffed) {
            p.activate(trainingSession, {
              reservePayment: pay(2),
              targets: { "target-1": [source.objectId] },
            });
            passEffectsStack(game);
          }
          expect(power(source.objectId)).toBe(base);
          if (mode === "retaliation") {
            // Advance by public passes; the defender remains awake.
            for (
              let i = 0;
              i < 64 && !(game.state.turn.playerId === q.id && game.state.turn.phase === "main");
              i++
            ) {
              const w = game.waitState();
              if (w.kind === "opportunity") game.player(w.playerId).pass();
              else if (w.kind === "materialization-choice")
                game.player(w.playerId).execute({ move: "skip-materialization" });
              else throw new Error(`Unexpected ${w.kind}`);
            }
            const attacker = q.card(giantTortoise);
            q.declareAttack(attacker, source);
            let offered = false;
            for (let i = 0; i < 64 && game.state.combat; i++) {
              const d = game.state.decision;
              if (d?.kind === "choose-retaliators") {
                expect(d.candidates).toContain(source.objectId);
                offered = true;
                answerDecision(game, d.kind, [source.objectId]);
              } else {
                const w = game.waitState();
                if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
                game.player(w.playerId).pass();
              }
            }
            expect(offered).toBe(base > 0);
            expect(game.state.objects[attacker.objectId]!.damage).toBe(base);
            expect(power(source.objectId)).toBe(base);
            return;
          }
          const attacker = mode === "other-command" ? p.card(snowWhiteWeissQueen) : source;
          if (mode === "normal") {
            if (base === 0) {
              const before = game.state;
              expect(() => p.declareAttack(attacker, foe)).toThrow();
              expect(game.state).toEqual(before);
              return;
            }
            p.declareAttack(attacker, foe);
          } else {
            const before = game.state;
            for (const invalid of [hero, other]) {
              expect(() =>
                p.activate(enPassant, {
                  attackAttackerId: invalid.objectId,
                  reservePayment: pay(2),
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            p.activate(enPassant, { attackAttackerId: attacker.objectId, reservePayment: pay(2) });
            expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(false);
            expect(power(source.objectId)).toBe(base);
            passEffectsStack(game);
            declareResolvedAttack(game, attacker.objectId, foe.objectId, "Alice Commanded Will");
          }
          const extra = named && mode === "command" ? bonus : 0;
          expect(power(source.objectId)).toBe(base + extra);
          expect(power(other.objectId)).toBe(grandArchiveTestFace(card).stats.power);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[foe.objectId]!.damage).toBe(
            mode === "other-command" ? 3 : base + extra + (mode === "command" ? 2 : 0),
          );
          expect(power(source.objectId)).toBe(base);
        });
}
