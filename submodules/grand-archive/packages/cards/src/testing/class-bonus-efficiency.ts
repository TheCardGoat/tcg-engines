import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
  enableAllTestElements,
  grandArchiveTestFace,
  requireSingleFace,
} from "./class-bonus-test-champion.ts";
export function proveClassBonusEfficiency({
  card,
  printedCost,
  attack = false,
  targetAlly = false,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  printedCost: number;
  attack?: boolean;
  targetAlly?: boolean;
}): void {
  for (const championClass of ["SPIRIT" as const, ...grandArchiveTestFace(card).typeLine.classes])
    for (const level of [0, 2, printedCost, printedCost + 1])
      it(`pays the exact reserve amount at level ${level}, class=${championClass}`, () => {
        const matching = championClass !== "SPIRIT";
        const base = createClassBonusTestChampion(card, matching, "activation-discount");
        const face = requireSingleFace(base);
        const champion = enableAllTestElements(
          grantTestChampionLevel(
            {
              ...base,
              layout: {
                kind: "single-faced",
                face: {
                  ...face,
                  typeLine: {
                    ...face.typeLine,
                    classes: [championClass],
                    subtypes: [championClass],
                  },
                },
              },
            },
            level,
          ),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [card, ...Array.from({ length: printedCost + 1 }, () => woodlandSquirrels)],
            },
          },
          playerTwo: {
            champion: enableAllTestElements(
              grantTestChampionLevel(
                createClassBonusTestChampion(card, true, "floating-memory"),
                3,
              ),
            ),
            zones: { field: targetAlly ? [woodlandSquirrels] : [] },
          },
        });
        const p = game.player("player-one");
        const expected = matching ? Math.max(0, printedCost - level) : printedCost;
        const pay = (amount: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, amount)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const options = {
          ...(attack ? { attackAttackerId: p.card(champion).objectId } : {}),
          ...(targetAlly
            ? {
                targets: {
                  "target-1": [game.player("player-two").card(woodlandSquirrels).objectId],
                },
              }
            : {}),
        };
        const before = game.state;
        if (expected > 0) {
          expect(() =>
            p.activate(card, { ...options, reservePayment: pay(expected - 1) }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activate(card, { ...options, reservePayment: pay(expected) });
        expect(p.zone("memory")).toHaveLength(expected);
        expect(p.cards(card, { zone: "effects-stack" })).toHaveLength(1);
        expect(p.cards(woodlandSquirrels, { zone: "hand" })).toHaveLength(
          printedCost + 1 - expected,
        );
      });
}
