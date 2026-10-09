import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { fireball } from "../cards/DOA/actions/fireball.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
export function proveBanishEmpower(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  abilityId: string,
  grows: boolean,
) {
  for (const counters of grows ? [0, 1, 3] : [2])
    for (const expired of [false, true])
      it(`banishes before granting Empower ${counters}, expired=${expired}`, () => {
        const champion = enableAllTestElements(lineageTestChampion("Empower", 0));
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [card],
              hand: [fireball, fireball, ...Array.from({ length: 12 }, () => woodlandSquirrels)],
              "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: { "main-deck": Array.from({ length: 10 }, () => woodlandSquirrels) },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card),
          target = q.card(champion);
        if (grows) {
          for (let n = 0; n < counters; n++) advanceToMain(game, p.id, game.state.turn.number);
          expect(game.state.objects[source.objectId]!.counters["named:refinement"] ?? 0).toBe(
            counters,
          );
        }
        const before = game.state;
        expect(() => q.activateAbility(source, abilityId)).toThrow();
        expect(game.state).toEqual(before);
        p.activateAbility(source, abilityId);
        expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
        expect(game.state.objects[source.objectId]!.counters["named:refinement"] ?? 0).toBe(0);
        const paid = game.state;
        expect(() => p.activateAbility(source, abilityId)).toThrow();
        expect(game.state).toEqual(paid);
        passEffectsStack(game);
        p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
        passEffectsStack(game);
        if (expired) advanceToMain(game, p.id, game.state.turn.number);
        const spells = p.cards(fireball, { zone: "hand" });
        for (const [i, spell] of spells.entries()) {
          p.activate(spell, {
            targets: { "target-1": [target.objectId] },
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 4)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(
            1 + (expired ? 0 : counters) + i,
          );
        }
      });
}
