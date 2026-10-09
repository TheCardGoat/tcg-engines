import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { cramSession } from "../cards/DOA/actions/cram-session.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveLevelAllyStats(
  card: Card,
  threshold: number,
  powerBonus: number,
  lifeBonus: number,
) {
  const stats = grandArchiveTestFace(card).stats;
  if (typeof stats.power !== "number" || typeof stats.life !== "number")
    throw new Error("Expected printed ally stats");
  const basePower = stats.power,
    baseLife = stats.life;
  for (const matching of [false, true])
    for (const level of [0, threshold - 1, threshold, threshold + 1])
      for (const opposingLevel of [0, threshold + 1])
        it(`class=${matching}, level=${level}, opposing level=${opposingLevel}`, () => {
          const champion = grantTestChampionLevel(
            createClassBonusTestChampion(card, matching, "activation-discount"),
            level,
          );
          const opponent = grantTestChampionLevel(
            createClassBonusTestChampion(card, matching, "activation-discount"),
            opposingLevel,
          );
          const power = basePower + (level >= threshold ? powerBonus : 0),
            life = baseLife + (level >= threshold ? lifeBonus : 0);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: { field: [card], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
            },
            playerTwo: {
              champion: opponent,
              zones: {
                field: Array.from({ length: life }, () => woodlandSquirrels),
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(card),
            enemy = q.card(opponent);
          const numeric = (property: "power" | "life") =>
            deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, property, {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
          expect(numeric("power")).toBe(power);
          expect(numeric("life")).toBe(life);
          if (power === 0) {
            const before = game.state;
            expect(() => p.declareAttack(source, enemy)).toThrow();
            expect(game.state).toEqual(before);
          } else {
            p.declareAttack(source, enemy);
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[enemy.objectId]!.damage).toBe(power);
          }
          advanceToMain(game, q.id);
          for (const [i, attacker] of q.cards(woodlandSquirrels, { zone: "field" }).entries()) {
            q.declareAttack(attacker, source);
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[source.objectId]!.zone).toBe(
              i + 1 < life ? "field" : "graveyard",
            );
            if (i + 1 < life) {
              expect(game.state.objects[source.objectId]!.damage).toBe(i + 1);
              expect(numeric("life")).toBe(life);
            }
          }
        });
  for (const matching of [false, true])
    for (const initial of [threshold - 2, threshold - 1])
      it(`temporary level rechecks threshold and expires: class=${matching}, initial=${initial}`, () => {
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
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [card], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card);
        const check = (player: typeof p, enabled: boolean) => {
          const object = game.state.objects[player.card(card).objectId]!,
            ctx = {
              program: game.program,
              state: game.state,
              controllerId: player.id,
              bindings: {},
            };
          expect(deriveGrandArchiveNumericProperty(object, "power", ctx)).toBe(
            basePower + (enabled ? powerBonus : 0),
          );
          expect(deriveGrandArchiveNumericProperty(object, "life", ctx)).toBe(
            baseLife + (enabled ? lifeBonus : 0),
          );
        };
        check(p, false);
        check(q, false);
        p.activate(cramSession, {
          reservePayment: [
            { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
          ],
        });
        check(p, false);
        passEffectsStack(game);
        const enabled = initial + 1 >= threshold;
        check(p, enabled);
        check(q, false);
        const power = basePower + (enabled ? powerBonus : 0);
        if (power > 0) {
          const target = lifeBonus > 0 ? q.card(card) : q.card(champion);
          p.declareAttack(source, target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(power);
        } else {
          const before = game.state;
          expect(() => p.declareAttack(source, q.card(champion))).toThrow();
          expect(game.state).toEqual(before);
        }
        advanceToMain(game, q.id);
        check(p, false);
        check(q, false);
      });
}
