import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { ferventBeastmaster } from "../cards/DOA/allies/fervent-beastmaster.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

export function proveTargetedAllyStat({
  card,
  property,
  bonus,
  targets,
  human = false,
  extraCost = 0,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  property: "life" | "power";
  bonus: number;
  targets: "one" | "three" | "any";
  human?: boolean;
  extraCost?: number;
}): void {
  for (const count of targets === "one" ? [1] : targets === "three" ? [0, 1, 2, 3] : [0, 1, 2, 4])
    for (const opposingFirst of [false, true])
      it(`targets=${count}, opposing first=${opposingFirst}: pays exact cost and expires`, () => {
        const cost = 2 + Math.max(0, count - 1) * extraCost;
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, false, "activation-discount"),
        );
        const zones = {
          field: [ferventBeastmaster, ferventBeastmaster, woodlandSquirrels, trainingSword],
          graveyard: [ferventBeastmaster],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        };
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              ...zones,
              hand: [card, ...Array.from({ length: 10 }, () => woodlandSquirrels)],
            },
          },
          playerTwo: { champion, zones },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const own = p.cards(ferventBeastmaster, { zone: "field" }),
          opposing = q.cards(ferventBeastmaster, { zone: "field" });
        const ordered = opposingFirst
          ? [opposing[0]!, own[0]!, opposing[1]!, own[1]!]
          : [own[0]!, opposing[0]!, own[1]!, opposing[1]!];
        const selected = ordered.slice(0, count).map((c) => c.objectId);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const value = (id: (typeof own)[number]["objectId"]) =>
          deriveGrandArchiveNumericProperty(game.state.objects[id]!, property, {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        const invalid = [
          [p.card(champion).objectId],
          [p.card(trainingSword).objectId],
          [p.card(ferventBeastmaster, { zone: "graveyard" }).objectId],
          ...(human ? [[p.card(woodlandSquirrels, { zone: "field" }).objectId]] : []),
          [own[0]!.objectId, own[0]!.objectId],
          ...(targets === "one"
            ? [[], ordered.slice(0, 2).map((c) => c.objectId)]
            : targets === "three"
              ? [ordered.map((c) => c.objectId)]
              : []),
        ];
        for (const ids of invalid) {
          const before = game.state;
          expect(() =>
            p.activate(card, {
              targets: { "target-1": ids },
              reservePayment: pay(2 + Math.max(0, ids.length - 1) * extraCost),
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        const before = game.state;
        expect(() =>
          p.activate(card, { targets: { "target-1": selected }, reservePayment: pay(cost - 1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(card, { targets: { "target-1": selected }, reservePayment: pay(cost) });
        expect(p.zone("memory")).toHaveLength(cost);
        for (const ally of ordered) expect(value(ally.objectId)).toBe(3);
        passEffectsStack(game);
        for (const ally of ordered)
          expect(value(ally.objectId)).toBe(3 + (selected.includes(ally.objectId) ? bonus : 0));
        expect(value(p.card(woodlandSquirrels, { zone: "field" }).objectId)).toBe(1);
        if (property === "power") {
          p.declareAttack(own[0]!, q.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
            3 + (selected.includes(own[0]!.objectId) ? bonus : 0),
          );
        }
        advanceToMain(game, q.id);
        for (const ally of ordered) expect(value(ally.objectId)).toBe(3);
      });
}
