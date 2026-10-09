import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { loneGunslinger } from "../cards/ALC/allies/lone-gunslinger.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { declareResolvedAttack, passEffectsStack } from "./decisions.ts";

export function proveKindle(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  kindle: number,
  targetRanger = false,
  { classBonus = false, championDamage }: { classBonus?: boolean; championDamage?: number } = {},
): void {
  const face = grandArchiveTestFace(card);
  if (face.cost.kind !== "reserve" || typeof face.cost.amount !== "number")
    throw new Error("Expected fixed reserve cost");
  const cost = face.cost.amount,
    attack = face.typeLine.types.includes("ATTACK");
  for (const matching of classBonus ? [false, true] : [false]) {
    const enabled = !classBonus || matching;
    for (let count = 0; count <= (enabled ? kindle : 0); count++)
      it(`class=${classBonus ? matching : "unrestricted"}, Kindle ${kindle}, pays ${count} fire cards and ${cost - count} reserve`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [loneGunslinger],
              hand: [
                card,
                sparkAlight,
                ...Array.from({ length: cost + 1 }, () => woodlandSquirrels),
              ],
              graveyard: [
                woodlandSquirrels,
                ...Array.from({ length: kindle + 1 }, () => sparkAlight),
              ],
              banishment: [sparkAlight],
            },
          },
          playerTwo: { champion, zones: { graveyard: [sparkAlight] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card);
        const fire = p.cards(sparkAlight, { zone: "graveyard" }).map((c) => c.objectId);
        const declarations = {
          ...(attack ? { attackAttackerId: p.card(champion).objectId } : {}),
          ...(championDamage !== undefined
            ? { targets: { "target-1": [q.card(champion).objectId] } }
            : {}),
          ...(targetRanger ? { targets: { "target-1": [p.card(loneGunslinger).objectId] } } : {}),
        };
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (const ids of [
          fire,
          ...(!enabled ? Array.from({ length: kindle + 1 }, (_, n) => fire.slice(0, n)) : []),
          [fire[0]!, fire[0]!],
          [q.card(sparkAlight).objectId],
          [p.card(sparkAlight, { zone: "hand" }).objectId],
          [p.card(sparkAlight, { zone: "banishment" }).objectId],
          [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
        ]) {
          const before = game.state;
          expect(() =>
            p.activate(source, {
              ...declarations,
              kindleCardIds: ids,
              reservePayment: pay(Math.max(0, cost - ids.length)),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const selected = fire.slice(0, count),
          remaining = cost - count;
        for (const wrong of [remaining - 1, remaining + 1].filter((n) => n >= 0)) {
          const before = game.state;
          expect(() =>
            p.activate(source, {
              ...declarations,
              ...(enabled ? { kindleCardIds: selected } : {}),
              reservePayment: pay(wrong),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(source, {
          ...declarations,
          ...(enabled ? { kindleCardIds: selected } : {}),
          reservePayment: pay(remaining),
        });
        expect(p.zone("memory")).toHaveLength(remaining);
        for (const id of fire)
          expect(game.state.objects[id]!.zone).toBe(
            selected.includes(id) ? "banishment" : "graveyard",
          );
        expect(game.state.objects[q.card(sparkAlight).objectId]!.zone).toBe("graveyard");
        expect(
          deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "reserve-cost", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          }),
        ).toBe(cost);
        expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
        if (championDamage !== undefined)
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(0);
        passEffectsStack(game);
        if (championDamage !== undefined)
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(championDamage);
        if (attack) {
          declareResolvedAttack(
            game,
            p.card(champion).objectId,
            q.card(champion).objectId,
            "Resolve Kindled attack",
          );
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(face.stats.power);
        }
        expect(game.state.objects[source.objectId]!.zone).toBe(
          attack || face.typeLine.types.includes("ACTION") ? "graveyard" : "field",
        );
      });
  }
}
