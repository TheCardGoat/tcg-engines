import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { cramSession } from "../cards/DOA/actions/cram-session.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveClassLevelAllyStats(card: Card, powerBonus: number, lifeBonus: number) {
  const stats = grandArchiveTestFace(card).stats;
  if (typeof stats.power !== "number" || typeof stats.life !== "number")
    throw new Error("Expected printed ally stats");
  const basePower = stats.power,
    baseLife = stats.life;
  for (const matching of [false, true])
    for (const level of [0, 1, 2, 3])
      it(`Class Bonus and Level 2 both required: class=${matching}, level=${level}`, () => {
        const champion = grantTestChampionLevel(
          enableAllTestElements(
            createClassBonusTestChampion(card, matching, "activation-discount"),
          ),
          level,
        );
        const active = matching && level >= 2;
        const power = basePower + (active ? powerBonus : 0),
          life = baseLife + (active ? lifeBonus : 0);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: { champion, zones: { field: [card], "main-deck": [woodlandSquirrels] } },
          playerTwo: {
            champion,
            zones: {
              field: Array.from({ length: life + 1 }, () => woodlandSquirrels),
              hand: Array.from({ length: life }, () => woodlandSquirrels),
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          ally = p.card(card);
        const numeric = (property: "power" | "life") =>
          deriveGrandArchiveNumericProperty(game.state.objects[ally.objectId]!, property, {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        expect(numeric("power")).toBe(power);
        expect(numeric("life")).toBe(life);
        advanceToMain(game, q.id);
        const attackers = q.cards(woodlandSquirrels, { zone: "field" });
        const memoryBeforeOtherAttack = q.zone("memory").length;
        q.declareAttack(attackers[0]!, p.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(q.zone("memory")).toHaveLength(memoryBeforeOtherAttack);
        expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(1);
        for (const [i, attacker] of attackers.slice(1).entries()) {
          const payment =
            card.slug === "beguiling-bandit"
              ? [
                  {
                    kind: "card" as const,
                    cardId: q.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
                  },
                ]
              : [];
          const memory = q.zone("memory").length;
          if (payment.length) {
            const before = game.state;
            expect(() => q.declareAttack(attacker, ally)).toThrow();
            expect(game.state).toEqual(before);
          }
          q.declareAttack(attacker, ally, { reservePayment: payment });
          expect(q.zone("memory")).toHaveLength(memory + payment.length);
          game.resolveCombatWithoutRetaliation();
          expect(p.cards(card, { zone: "field" })).toHaveLength(i + 1 < life ? 1 : 0);
          if (i + 1 < life) {
            expect(game.state.objects[ally.objectId]!.damage).toBe(i + 1);
            expect(numeric("power")).toBe(power);
            expect(numeric("life")).toBe(life);
          }
        }
        expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
      });
  for (const matching of [false, true])
    for (const initial of [0, 1])
      it(`rechecks temporary champion level: class=${matching}, initial=${initial}`, () => {
        const champion = grantTestChampionLevel(
          enableAllTestElements(
            createClassBonusTestChampion(card, matching, "activation-discount"),
          ),
          initial,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [card],
              hand: [cramSession, woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [card], "main-deck": [woodlandSquirrels] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const check = (player: typeof p, bonus: boolean, level: number) => {
          const context = {
            program: game.program,
            state: game.state,
            controllerId: player.id,
            bindings: {},
          };
          const ally = game.state.objects[player.card(card).objectId]!;
          expect(deriveGrandArchiveNumericProperty(ally, "power", context)).toBe(
            basePower + (bonus ? powerBonus : 0),
          );
          expect(deriveGrandArchiveNumericProperty(ally, "life", context)).toBe(
            baseLife + (bonus ? lifeBonus : 0),
          );
          expect(
            deriveGrandArchiveNumericProperty(
              game.state.objects[player.card(champion).objectId]!,
              "level",
              context,
            ),
          ).toBe(level);
        };
        check(p, false, initial);
        check(q, false, initial);
        p.activate(cramSession, {
          reservePayment: [
            { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
          ],
        });
        check(p, false, initial);
        passEffectsStack(game);
        check(p, matching && initial === 1, initial + 1);
        check(q, false, initial);
        advanceToMain(game, q.id);
        check(p, false, initial);
        check(q, false, initial);
      });
}
