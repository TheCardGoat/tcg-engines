import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { lineageTestChampion } from "./champion-lineage.ts";
import {
  enableAllTestElements,
  grantTestChampionLevel,
  requireSingleFace,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../cards/ALC/items/potion-of-healing.ts";
export function proveNamedEfficiency(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  name: string,
  cost: number,
  potion = false,
) {
  for (const named of [false, true])
    for (const matchingClass of [false, true])
      for (const level of [-2, 0, 2, cost, cost + 1])
        it(`lineage=${named}, class=${matchingClass}, level=${level}`, () => {
          const base = lineageTestChampion(named ? name : "Other", 0),
            face = requireSingleFace(base),
            classes = matchingClass
              ? grandArchiveTestFace(card).typeLine.classes
              : face.typeLine.classes;
          const champion = enableAllTestElements(
            grantTestChampionLevel(
              {
                ...base,
                layout: {
                  kind: "single-faced",
                  face: { ...face, typeLine: { ...face.typeLine, classes, subtypes: classes } },
                },
              },
              level,
            ),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [potionOfHealing],
                hand: [card, ...Array.from({ length: cost + 3 }, () => woodlandSquirrels)],
                "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
              },
            },
            playerTwo: { champion },
          });
          const p = game.player("player-one"),
            expected = named ? Math.max(0, cost - level) : cost,
            source = p.card(card),
            target = p.card(potionOfHealing);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const options = potion ? { targets: { "target-1": [target.objectId] } } : {};
          const before = game.state;
          for (const n of [expected - 1, expected + 1].filter((n) => n >= 0)) {
            expect(() => p.activate(source, { ...options, reservePayment: pay(n) })).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(source, { ...options, reservePayment: pay(expected) });
          expect(p.zone("memory")).toHaveLength(expected);
          expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          if (potion) expect(game.state.objects[target.objectId]!.states.has("rested")).toBe(true);
          else {
            expect(p.zone("hand")).toHaveLength(7);
            expect(p.zone("memory")).toHaveLength(0);
            expect(p.zone("banishment")).toHaveLength(cost + 3);
          }
        });
}
