import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  deriveGrandArchiveCharacteristics,
  deriveGrandArchiveNumericProperty,
} from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { strategicPlanning } from "../cards/DOA/actions/strategic-planning.ts";
import { ominousShadow } from "../cards/EVP/tokens/ominous-shadow.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";
export function proveTristanShadowSummon(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  cost: number,
  variable = false,
) {
  for (const matching of [false, true])
    for (const count of variable ? [0, 1, 3] : [1])
      it(`summons only for Tristan: matches=${matching}, preparation=${count}`, () => {
        const champion = enableAllTestElements(
          lineageTestChampion(matching ? "Tristan" : "Other", 0),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [ominousShadow, ...(variable ? [trainingSword] : [])],
              hand: [
                card,
                ...Array.from({ length: count }, () => strategicPlanning),
                ...Array.from({ length: cost + 2 * count }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [ominousShadow] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (const planning of p.cards(strategicPlanning, { zone: "hand" })) {
          p.activate(planning, { reservePayment: pay(2) });
          passEffectsStack(game);
          const glimpse = game.state.decision;
          if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected planning Glimpse");
          answerDecision(game, "resolve-glimpse", {
            kind: "reorder",
            top: glimpse.cardIds,
            bottom: [],
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(count);
        const before = p.cards(ominousShadow, { zone: "field" }),
          opposing = q.cards(ominousShadow, { zone: "field" });
        p.activate(card, { reservePayment: pay(cost) });
        expect(p.cards(ominousShadow, { zone: "field" })).toEqual(before);
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-effect-payment") {
          answerDecision(game, "resolve-effect-payment", false);
          passEffectsStack(game);
        }
        const after = p.cards(ominousShadow, { zone: "field" });
        expect(after).toHaveLength(1 + (matching ? (variable ? count : 1) : 0));
        expect(q.cards(ominousShadow, { zone: "field" })).toEqual(opposing);
        expect(after).toEqual(expect.arrayContaining([...before]));
        for (const token of after.filter(
          (ref) => !before.some((old) => old.objectId === ref.objectId),
        )) {
          const object = game.state.objects[token.objectId]!;
          expect(object.controllerId).toBe(p.id);
          const characteristics = deriveGrandArchiveCharacteristics(object, {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
          expect(characteristics.names).toContain("Ominous Shadow");
          expect(characteristics.types).toEqual(expect.arrayContaining(["ALLY", "PHANTASIA"]));
        }
        expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(count);
        expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
        expect(game.state.decision).toBeNull();
        if (variable) {
          const power = (id: keyof typeof game.state.objects) =>
            deriveGrandArchiveNumericProperty(game.state.objects[id]!, "power", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
          for (const token of after) expect(power(token.objectId)).toBe(2);
          for (const token of opposing) expect(power(token.objectId)).toBe(1);
          p.declareAttack(hero, q.card(champion), { weaponIds: [p.card(trainingSword).objectId] });
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(count);
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(1);
          p.declareAttack(before[0]!, q.card(champion));
          game.resolveCombatWithoutRetaliation();
          passEffectsStack(game);
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(3);
          expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(count + 1);
        }
      });
}
