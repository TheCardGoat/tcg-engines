import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function proveRecoveryActionBoundaries(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  mode: "tides" | "bandage" | "feast" | "petalfall",
) {
  const printed = grandArchiveTestFace(card).cost;
  if (printed.kind !== "reserve" || typeof printed.amount !== "number")
    throw new Error("Expected fixed reserve cost");
  const cost = printed.amount;
  for (const matching of [false, true])
    for (const level of mode === "tides" ? [4, 5, 6] : mode === "petalfall" ? [0, 3] : [0])
      for (const damage of mode === "petalfall" ? [0, 2, 13] : [0, 2, 7]) {
        it(`recovers at level ${level}, class ${matching}, damage ${damage}`, () => {
          const champion = enableAllTestElements(
            grantTestChampionLevel(
              createClassBonusTestChampion(card, matching, "activation-discount"),
              level,
            ),
          );
          const opponent = grantTestChampionLevel(lineageTestChampion("Other", 0), 9);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  card,
                  sparkAlight,
                  ...Array.from({ length: cost + 2 }, () => woodlandSquirrels),
                ],
                field: [giantTortoise, ...Array.from({ length: 13 }, () => woodlandSquirrels)],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion: opponent,
              zones: {
                field: Array.from({ length: damage }, () => woodlandSquirrels),
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            foe = q.card(opponent),
            ally = p.card(giantTortoise);
          for (const squirrel of p.cards(woodlandSquirrels, { zone: "field" })) {
            p.declareAttack(squirrel, foe);
            game.resolveCombatWithoutRetaliation();
          }
          advanceToMain(game, q.id);
          const attackers = q.cards(woodlandSquirrels, { zone: "field" });
          for (const squirrel of attackers.slice(0, damage)) {
            q.declareAttack(squirrel, hero);
            game.resolveCombatWithoutRetaliation();
          }
          advanceToMain(game, p.id);
          p.activate(sparkAlight, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            targets: { "target-1": [ally.objectId] },
          });
          passEffectsStack(game);
          const allyDamage =
            matching && grandArchiveTestFace(card).typeLine.classes.includes("MAGE") ? 3 : 2;
          expect(game.state.objects[ally.objectId]!.damage).toBe(allyDamage);
          expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
          expect(game.state.objects[foe.objectId]!.damage).toBe(13);
          const payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, cost)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          expect(() => p.activate(card, { reservePayment: payment.slice(1) })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(card, { reservePayment: payment });
          expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
          expect(game.state.objects[foe.objectId]!.damage).toBe(13);
          passEffectsStack(game);
          const amount =
            mode === "tides"
              ? 3 + (matching && level >= 5 ? 3 : 0)
              : mode === "petalfall"
                ? 8 + level
                : 4;
          expect(game.state.objects[hero.objectId]!.damage).toBe(Math.max(0, damage - amount));
          expect(game.state.objects[foe.objectId]!.damage).toBe(
            mode === "feast" || mode === "petalfall" ? Math.max(0, 13 - amount) : 13,
          );
          expect(game.state.objects[ally.objectId]!.damage).toBe(allyDamage);
          expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
        });
      }
}
