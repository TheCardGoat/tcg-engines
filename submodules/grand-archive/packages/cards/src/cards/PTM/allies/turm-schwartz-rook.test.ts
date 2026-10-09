import { describe } from "vitest";
import { turmSchwartzRook } from "./turm-schwartz-rook.ts";
import { proveDepartedBuffCounters } from "../../../testing/departed-buff-counters.ts";
/** @covers rYyOEGB3tD-a2 */
describe("Turm, Schwartz Rook — departed buff counters", () =>
  proveDepartedBuffCounters(turmSchwartzRook, false));

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { goldenPawn } from "./golden-pawn.ts";
import { enPassant } from "../attacks/en-passant.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";
/** @covers rYyOEGB3tD-a1 */
describe("Turm, Schwartz Rook — Command attack counters", () => {
  for (const alice of [false, true])
    for (const mode of ["source-command", "other-command", "source-basic", "other-basic"]) {
      it(`Alice=${alice}, attack=${mode}`, () => {
        const champion = enableAllTestElements(
          createLineageTestChampion(turmSchwartzRook, alice ? "Alice" : "Other"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [turmSchwartzRook, goldenPawn, woodlandSquirrels],
              hand: [enPassant, enPassant, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
              "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: { "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels) },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(turmSchwartzRook),
          attacker = mode.startsWith("source")
            ? source
            : mode === "other-basic"
              ? p.card(woodlandSquirrels, { zone: "field" })
              : p.card(goldenPawn),
          target = q.card(champion);
        const counters = () => game.state.objects[source.objectId]!.counters.buff ?? 0;
        const repetitions = mode === "source-command" ? 2 : 1;
        let damage = 0;
        for (let i = 0; i < repetitions; i++) {
          if (i) advanceToMain(game, p.id, game.state.turn.number);
          if (mode.endsWith("command")) {
            p.activate(p.cards(enPassant, { zone: "hand" })[0]!, {
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 2)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              attackAttackerId: attacker.objectId,
            });
            expect(counters()).toBe(i);
            passEffectsStack(game);
            expect(counters()).toBe(i);
            declareResolvedAttack(
              game,
              attacker.objectId,
              target.objectId,
              "Turm Command declaration",
            );
          } else p.declareAttack(attacker, target);
          expect(counters()).toBe(i);
          expect(
            game.state.stack.filter(
              (item) => item.kind === "triggered-ability" && item.ability.id === "rYyOEGB3tD-a1",
            ),
          ).toHaveLength(mode === "source-command" ? 1 : 0);
          passEffectsStack(game);
          expect(counters()).toBe(mode === "source-command" ? i + 1 : 0);
          game.resolveCombatWithoutRetaliation();
          if (mode === "source-command") {
            damage += 1 + (i + 1) + 2;
            expect(game.state.objects[target.objectId]!.damage).toBe(damage);
          }
          expect(counters()).toBe(mode === "source-command" ? i + 1 : 0);
        }
      });
    }
});
