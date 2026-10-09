import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  deriveGrandArchiveCharacteristics,
  deriveGrandArchiveNumericProperty,
} from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements, grantTestChampionLevel } from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveReserveFatestoneTransform(
  card: Card,
  abilityId: string,
  baseCost: number,
  levelDiscount = false,
) {
  if (card.layout.kind !== "double-faced") throw new Error("Expected a double-faced card");
  const flip = card.layout.flipFace;
  for (const matching of [false, true])
    for (const level of levelDiscount ? [0, 3, 6, 8] : [0])
      it(`requires Guo Jia and exact reserve cost: matching=${matching}, level=${level}`, () => {
        const champion = grantTestChampionLevel(
          enableAllTestElements(lineageTestChampion(matching ? "Guo Jia" : "Other", 0)),
          level,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: { field: [card], hand: Array.from({ length: 7 }, () => woodlandSquirrels) },
          },
          playerTwo: { champion, zones: { field: [card] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card),
          opponentCopy = q.card(card);
        const original = game.state.objects[source.objectId]!;
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const cost = Math.max(0, baseCost - (levelDiscount ? level : 0));
        const before = game.state;
        expect(() => q.activateAbility(source, abilityId)).toThrow();
        expect(game.state).toEqual(before);
        if (!matching) {
          expect(() =>
            p.activateAbility(source, abilityId, { reservePayment: pay(cost) }),
          ).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        if (cost > 0) {
          expect(() =>
            p.activateAbility(source, abilityId, { reservePayment: pay(cost - 1) }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() =>
          p.activateAbility(source, abilityId, { reservePayment: pay(cost + 1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(source, abilityId, { reservePayment: pay(cost) });
        expect(p.zone("hand")).toHaveLength(7 - cost);
        expect(p.zone("memory")).toHaveLength(cost);
        expect(game.state.objects[source.objectId]!.face).toBe("default");
        passEffectsStack(game);
        const transformed = game.state.objects[source.objectId]!;
        expect(transformed.face).toBe("transformed");
        expect(transformed.zone).toBe("field");
        expect(transformed.incarnation).toBe(original.incarnation);
        expect(transformed.states.has("rested")).toBe(false);
        const context = {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        };
        expect(deriveGrandArchiveCharacteristics(transformed, context).types).toContain("ALLY");
        expect(deriveGrandArchiveNumericProperty(transformed, "power", context)).toBe(
          flip.stats.power,
        );
        expect(deriveGrandArchiveNumericProperty(transformed, "life", context)).toBe(
          flip.stats.life,
        );
        expect(game.state.objects[opponentCopy.objectId]!.face).toBe("default");
        const resolved = game.state;
        expect(() => p.activateAbility(source, abilityId, { reservePayment: pay(cost) })).toThrow();
        expect(game.state).toEqual(resolved);
        p.declareAttack(source, q.card(champion));
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          answerDecision(game, "resolve-optional-effect", false);
          passEffectsStack(game);
        }
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(flip.stats.power);
      });
}
