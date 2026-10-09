import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { crystallineReality } from "./crystalline-reality.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { shimmercloakAssassin } from "../../ALC/allies/shimmercloak-assassin.ts";
import { memoriteBlade } from "../../PTM/tokens/memorite-blade.ts";
/** @covers iPpwkMxDt5-a1
 * @covers iPpwkMxDt5-a2
 */
describe("Crystalline Reality — Merlin Prepare changes exactly one mode to exactly two", () => {
  for (const named of [false, true])
    for (const counters of [false, true])
      for (const prepare of [false, true])
        for (const modes of [
          ["mode-1"],
          ["mode-2"],
          ["mode-3"],
          ["mode-1", "mode-2"],
          ["mode-1", "mode-3"],
          ["mode-2", "mode-3"],
        ])
          it(`Merlin=${named}, counters=${counters}, prepare=${prepare}, modes=${modes}`, () => {
            const base = enableAllTestElements(lineageTestChampion(named ? "Merlin" : "Other", 0));
            const champion = {
              ...base,
              layout: {
                kind: "single-faced" as const,
                face: { ...requireSingleFace(base), stats: { level: 0, life: 30, power: 1 } },
              },
            };
            const game = GrandArchiveTestEngine.startFixture({
              definitions: [memoriteBlade],
              playerOne: {
                champion,
                preserveMainDeckOrder: true,
                zones: {
                  hand: [
                    crystallineReality,
                    acceptedContract,
                    ...Array.from({ length: 8 }, () => woodlandSquirrels),
                  ],
                  field: [giantTortoise],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion,
                zones: {
                  field: [shimmercloakAssassin, shimmercloakAssassin],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              hero = p.card(champion),
              source = p.card(crystallineReality),
              hidden = q.cards(shimmercloakAssassin);
            const pay = (n: number) =>
              p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, n)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            if (counters) {
              p.activate(acceptedContract, { reservePayment: pay(5) });
              passEffectsStack(game);
            }
            const deck = p.zone("main-deck"),
              expected = prepare ? 2 : 1,
              options = {
                reservePayment: pay(2),
                modeIds: modes,
                ...(prepare ? { prepareAbilityIndexes: [0] as const } : {}),
              },
              before = game.state;
            if ((prepare && (!named || !counters)) || modes.length !== expected) {
              expect(() => p.activate(source, options)).toThrow();
              expect(game.state).toEqual(before);
              return;
            }
            for (const invalid of [[], ["mode-1", "mode-1"], ["mode-1", "mode-2", "mode-3"]]) {
              expect(() => p.activate(source, { ...options, modeIds: invalid })).toThrow();
              expect(game.state).toEqual(before);
            }
            expect(
              p
                .legalCommands()
                .some(
                  ({ command }) =>
                    command.move === "activate-card" &&
                    command.cardId === source.objectId &&
                    Boolean(command.prepareAbilityIndexes?.length) === prepare &&
                    command.modeIds?.length === modes.length &&
                    modes.every((mode) => command.modeIds?.includes(mode)),
                ),
            ).toBe(true);
            p.activate(source, options);
            expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(
              (counters ? 3 : 0) - (prepare ? 1 : 0),
            );
            expect(game.state.stack.at(-1)?.activationStates.includes("prepared")).toBe(prepare);
            expect(p.zone("main-deck")).toEqual(deck);
            passEffectsStack(game);
            expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
            const blade = modes.includes("mode-1"),
              sight = modes.includes("mode-2"),
              draw = modes.includes("mode-3");
            expect(p.cards(memoriteBlade, { zone: "field" })).toHaveLength(blade ? 1 : 0);
            expect(q.cards(memoriteBlade, { zone: "field" })).toHaveLength(0);
            if (blade)
              expect(game.state.objects[p.card(memoriteBlade).objectId]).toMatchObject({
                isToken: true,
                ownerId: p.id,
                controllerId: p.id,
              });
            expect(p.zone("main-deck")).toEqual(draw ? deck.slice(1) : deck);
            expect(p.zone("memory")).toHaveLength((counters ? 5 : 0) + 2 + (draw ? 1 : 0));
            if (draw) expect(game.state.objects[deck[0]!.objectId]!.zone).toBe("memory");
            const ready = game.state;
            expect(() => p.declareAttack(p.card(giantTortoise), hidden[0]!)).toThrow();
            expect(game.state).toEqual(ready);
            if (!sight) {
              expect(() => p.declareAttack(hero, hidden[0]!, { weaponIds: [] })).toThrow();
              expect(game.state).toEqual(ready);
            }
            p.declareAttack(hero, sight ? hidden[0]! : q.card(champion), { weaponIds: [] });
            game.resolveCombatWithoutRetaliation();
            expect(
              game.state.objects[(sight ? hidden[0]! : q.card(champion)).objectId]!.damage,
            ).toBe(1);
            advanceToMain(game, p.id, game.state.turn.number);
            const expired = game.state;
            expect(() => p.declareAttack(hero, hidden[1]!, { weaponIds: [] })).toThrow();
            expect(game.state).toEqual(expired);
            p.declareAttack(hero, q.card(champion), { weaponIds: [] });
            game.resolveCombatWithoutRetaliation();
          });
});
