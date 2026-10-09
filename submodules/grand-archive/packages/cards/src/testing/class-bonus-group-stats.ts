import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { grayWolf } from "../cards/DOA/allies/gray-wolf.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { curvedDagger } from "../cards/DOA/weapons/curved-dagger.ts";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { disenchant } from "../cards/P25/actions/disenchant.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveClassBonusGroupStats(card: Card, group: "animal" | "beast" | "weapon") {
  const qualifies =
    group === "animal" ? woodlandSquirrels : group === "beast" ? grayWolf : trainingSword;
  const excludes =
    group === "animal" ? grayWolf : group === "beast" ? woodlandSquirrels : curvedDagger;
  const base = grandArchiveTestFace(qualifies).stats;
  const otherBase = grandArchiveTestFace(excludes).stats;
  for (const matching of [false, true])
    for (const count of group === "weapon" ? [1] : [1, 2])
      it(`applies to own matching field objects and ends with the source: class=${matching}, sources=${count}`, () => {
        const champion = grantTestChampionLevel(
          enableAllTestElements(
            createClassBonusTestChampion(card, matching, "activation-discount"),
          ),
          2,
        );
        const opponentChampion = grantTestChampionLevel(
          enableAllTestElements(createClassBonusTestChampion(card, false, "floating-memory")),
          2,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [...Array.from({ length: count }, () => card), qualifies, excludes],
              graveyard: [qualifies],
              hand: [
                ...(group === "weapon" ? [] : [qualifies]),
                ...Array.from({ length: 4 }, () => sparkAlight),
                ...Array.from({ length: 2 }, () => disenchant),
                ...Array.from({ length: 14 }, () => woodlandSquirrels),
              ],
            },
          },
          playerTwo: { champion: opponentChampion, zones: { field: [card, qualifies, excludes] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(-n)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const stat = (id: keyof typeof game.state.objects, property: "power" | "life") =>
          deriveGrandArchiveNumericProperty(game.state.objects[id]!, property, {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        const check = (remaining: number) => {
          const bonus = matching ? remaining : 0;
          for (const target of p.cards(qualifies, { zone: "field" })) {
            expect(stat(target.objectId, "power")).toBe(Number(base.power) + bonus);
            if (group !== "weapon")
              expect(stat(target.objectId, "life")).toBe(
                Number(base.life) + (group === "animal" ? bonus : 0),
              );
          }
          expect(stat(p.card(excludes, { zone: "field" }).objectId, "power")).toBe(otherBase.power);
          expect(stat(q.card(qualifies, { zone: "field" }).objectId, "power")).toBe(base.power);
          expect(stat(p.card(qualifies, { zone: "graveyard" }).objectId, "power")).toBe(base.power);
          expect(stat(p.card(champion).objectId, "power")).toBeUndefined();
        };
        check(count);
        if (group !== "weapon") {
          const newcomer = p.cards(qualifies, { zone: "hand" })[0]!;
          p.activate(newcomer, { reservePayment: group === "animal" ? [] : pay(2) });
          passEffectsStack(game);
          expect(p.cards(qualifies, { zone: "field" })).toHaveLength(2);
          check(count);
        }
        const attacker =
          group === "weapon" ? p.card(champion) : p.cards(qualifies, { zone: "field" })[0]!;
        const target = q.card(opponentChampion);
        p.declareAttack(
          attacker,
          target,
          group === "weapon" ? { weaponIds: [p.card(qualifies, { zone: "field" }).objectId] } : {},
        );
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(
          Number(base.power) + (matching ? count : 0),
        );
        const sources = p.cards(card, { zone: "field" });
        for (const [index, source] of sources.entries()) {
          if (group === "animal") {
            p.activate(p.cards(disenchant, { zone: "hand" })[0]!, {
              reservePayment: pay(2),
              targets: { "target-1": [source.objectId] },
            });
            check(count - index);
            passEffectsStack(game);
          } else {
            for (let hit = 0; hit < 2; hit++) {
              p.activate(p.cards(sparkAlight, { zone: "hand" })[0]!, {
                reservePayment: pay(2),
                targets: { "target-1": [source.objectId] },
              });
              check(count - index);
              passEffectsStack(game);
            }
          }
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          check(count - index - 1);
        }
        expect(q.cards(card, { zone: "field" })).toHaveLength(1);
      });
}
