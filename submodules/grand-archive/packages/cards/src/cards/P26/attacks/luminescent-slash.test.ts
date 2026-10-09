import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { luminescentSlash } from "./luminescent-slash.ts";
import { comboStrike } from "../../DOA/attacks/combo-strike.ts";
import { rivetingWinds } from "../../PRD/actions/riveting-winds.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceToMain,
  declareResolvedAttack,
  passEffectsStack,
} from "../../../testing/decisions.ts";

/** @covers y8BNOi4rwD-a1 */
/** @covers y8BNOi4rwD-a2 */
describe("Luminescent Slash — other attacks activated this turn", () => {
  for (const matching of [false, true])
    for (const prior of [0, 1, 2, 3])
      for (const expired of [false, true]) {
        it(`Mordred=${matching}, previous attacks=${prior}, expired=${expired}`, () => {
          const base = enableAllTestElements(
            createLineageTestChampion(luminescentSlash, matching ? "Mordred" : "Other"),
          );
          const champion = {
            ...base,
            layout: {
              kind: "single-faced" as const,
              face: { ...requireSingleFace(base), stats: { level: 0, life: 100 } },
            },
          };
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  luminescentSlash,
                  ...Array.from({ length: prior }, () => comboStrike),
                  ...Array.from({ length: prior }, () => rivetingWinds),
                  ...Array.from({ length: 5 + 4 * prior }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: { "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels) },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            foe = q.card(champion);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          for (let i = 0; i < prior; i++) {
            p.activate(p.cards(comboStrike, { zone: "hand" })[0]!, {
              attackAttackerId: hero.objectId,
              reservePayment: pay(2),
            });
            passEffectsStack(game);
            declareResolvedAttack(
              game,
              hero.objectId,
              foe.objectId,
              "Combo Strike before Luminescent Slash",
            );
            game.resolveCombatWithoutRetaliation();
            p.activate(p.cards(rivetingWinds, { zone: "hand" })[0]!, { reservePayment: pay(2) });
            passEffectsStack(game);
            expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(false);
          }
          if (expired) advanceToMain(game, p.id, game.state.turn.number);
          const count = matching && !expired ? prior : 0,
            cost = Math.max(0, 5 - 2 * count),
            beforeDamage = game.state.objects[foe.objectId]!.damage;
          if (cost > 0) {
            const before = game.state;
            expect(() =>
              p.activate(luminescentSlash, {
                attackAttackerId: hero.objectId,
                reservePayment: pay(cost - 1),
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const handCount = p.zone("hand").length;
          p.activate(luminescentSlash, {
            attackAttackerId: hero.objectId,
            reservePayment: pay(cost),
          });
          expect(p.zone("hand")).toHaveLength(handCount - 1 - cost);
          passEffectsStack(game);
          declareResolvedAttack(game, hero.objectId, foe.objectId, "Resolve Luminescent Slash");
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[foe.objectId]!.damage - beforeDamage).toBe(6 + 2 * count);
          expect(p.cards(luminescentSlash, { zone: "graveyard" })).toHaveLength(1);
        });
      }
});

for (const matching of [false, true])
  it(`counts an earlier separate copy of Luminescent Slash: Mordred=${matching}`, () => {
    const base = enableAllTestElements(
      createLineageTestChampion(luminescentSlash, matching ? "Mordred" : "Other"),
    );
    const champion = {
      ...base,
      layout: {
        kind: "single-faced" as const,
        face: { ...requireSingleFace(base), stats: { level: 0, life: 100 } },
      },
    };
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [
            luminescentSlash,
            luminescentSlash,
            rivetingWinds,
            ...Array.from({ length: 12 }, () => woodlandSquirrels),
          ],
        },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      hero = p.card(champion),
      foe = q.card(champion);
    const pay = (n: number) =>
      p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, n)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    for (let index = 0; index < 2; index++) {
      const before = game.state.objects[foe.objectId]!.damage;
      p.activate(p.cards(luminescentSlash, { zone: "hand" })[0]!, {
        attackAttackerId: hero.objectId,
        reservePayment: pay(index === 1 && matching ? 3 : 5),
      });
      passEffectsStack(game);
      declareResolvedAttack(
        game,
        hero.objectId,
        foe.objectId,
        "Attack with a separate Luminescent Slash",
      );
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[foe.objectId]!.damage - before).toBe(
        index === 1 && matching ? 8 : 6,
      );
      if (index === 0) {
        p.activate(rivetingWinds, { reservePayment: pay(2) });
        passEffectsStack(game);
      }
    }
  });
