import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { acceptedContract } from "../cards/DOA/actions/accepted-contract.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function provePreparedTargetAction({
  card,
  targetId,
  effect,
  banished = 0,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  targetId: string;
  effect: "damage" | "sheen";
  banished?: number;
}): void {
  for (const mode of ["missing", "declined", "prepared"])
    for (const owner of ["player-one", "player-two"])
      for (const kind of ["ally", "champion"])
        it(`${mode}, ${owner}'s ${kind}, banishment=${banished}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [giantTortoise, trainingSword],
                hand: [
                  card,
                  acceptedContract,
                  ...Array.from({ length: 7 }, () => woodlandSquirrels),
                ],
                banishment: Array.from({ length: banished }, () => woodlandSquirrels),
                graveyard: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [giantTortoise],
                banishment: Array.from({ length: 6 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            target = game.player(owner).card(kind === "ally" ? giantTortoise : champion);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          const targets = { [targetId]: [target.objectId] };
          const before = game.state;
          expect(() =>
            p.activate(card, { reservePayment: pay(2), targets, prepareAbilityIndexes: [0] }),
          ).toThrow();
          expect(game.state).toEqual(before);
          if (mode !== "missing") {
            p.activate(acceptedContract, { reservePayment: pay(5) });
            passEffectsStack(game);
          }
          const prepared = mode === "prepared" ? { prepareAbilityIndexes: [0] as const } : {};
          const current = game.state;
          expect(() =>
            p.activate(card, { reservePayment: pay(1), targets, ...prepared }),
          ).toThrow();
          expect(game.state).toEqual(current);
          expect(() =>
            p.activate(card, {
              reservePayment: pay(2),
              targets: { [targetId]: [p.card(trainingSword).objectId] },
              ...prepared,
            }),
          ).toThrow();
          expect(game.state).toEqual(current);
          p.activate(card, { reservePayment: pay(2), targets, ...prepared });
          expect(game.state.objects[p.card(champion).objectId]!.counters.preparation ?? 0).toBe(
            mode === "missing" ? 0 : mode === "prepared" ? 2 : 3,
          );
          passEffectsStack(game);
          if (effect === "damage")
            expect(game.state.objects[target.objectId]!.damage).toBe(mode === "prepared" ? 4 : 2);
          else
            expect(game.state.objects[target.objectId]!.counters["named:sheen"]).toBe(
              3 + (mode === "prepared" ? Math.floor(banished / 3) : 0),
            );
          expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
        });
}
