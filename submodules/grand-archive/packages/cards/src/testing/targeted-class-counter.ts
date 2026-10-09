import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { curvedDagger } from "../cards/DOA/weapons/curved-dagger.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

export function proveTargetedClassCounter(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  counter: "enlighten" | "preparation",
  target: "ally" | "dagger" | "optional-ally",
) {
  for (const matching of [false, true])
    for (const owner of target === "optional-ally"
      ? ["own", "opponent", "none"]
      : ["own", "opponent"])
      it(`adds a counter only on resolution for matching class: class=${matching}, target=${owner}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [giantTortoise, curvedDagger],
              hand: [card, card, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
            },
          },
          playerTwo: { champion, zones: { field: [giantTortoise, curvedDagger] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const hero = p.card(champion),
          foe = q.card(champion);
        const selected = (owner === "opponent" ? q : p).card(
          target === "dagger" ? curvedDagger : giantTortoise,
        );
        const targets = { "target-1": owner === "none" ? [] : [selected.objectId] };
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (let cast = 1; cast <= 2; cast++) {
          const source = p.cards(card, { zone: "hand" })[0]!;
          const before = game.state;
          expect(() => p.activate(source, { reservePayment: pay(1), targets })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(source, { reservePayment: pay(2), targets });
          expect(game.state.objects[hero.objectId]!.counters[counter] ?? 0).toBe(
            matching ? cast - 1 : 0,
          );
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.counters[counter] ?? 0).toBe(
            matching ? cast : 0,
          );
          expect(game.state.objects[foe.objectId]!.counters[counter] ?? 0).toBe(0);
          expect(game.state.objects[selected.objectId]!.counters[counter] ?? 0).toBe(0);
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(p.zone("memory")).toHaveLength(2 * cast);
          expect(game.state.decision).toBeNull();
        }
      });
}
