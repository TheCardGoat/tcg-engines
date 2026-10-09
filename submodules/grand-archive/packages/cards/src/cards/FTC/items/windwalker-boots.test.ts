import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { windwalkerBoots } from "./windwalker-boots.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 73fdt8ptrz-a1 @covers 73fdt8ptrz-a2 */
describe("Windwalker Boots preparation and draw", () => {
  for (const counters of [4, 5, 6])
    for (const opponentTurn of [false, true])
      it(`requires five own preparation counters and allows fast timing: ${counters}, opponent=${opponentTurn}`, () => {
        const champion = createClassBonusTestChampion(windwalkerBoots, true, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [windwalkerBoots],
              "main-deck": Array.from({ length: 20 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: { "main-deck": Array.from({ length: 20 }, () => woodlandSquirrels) },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(windwalkerBoots),
          hero = p.card(champion);
        for (let n = 0; n < counters; n++) {
          const before = game.state;
          if (n < 5) {
            expect(() => p.activateAbility(source, "73fdt8ptrz-a2")).toThrow();
            expect(game.state).toEqual(before);
          }
          advanceToMain(game, p.id, game.state.turn.number);
          expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(n + 1);
        }
        expect(game.state.objects[q.card(champion).objectId]!.counters.preparation ?? 0).toBe(0);
        if (opponentTurn) {
          advanceToMain(game, q.id);
          q.pass();
        }
        // Advancing through our end phase adds one further preparation counter.
        const expectedCounters = counters + (opponentTurn ? 1 : 0);
        const hand = p.zone("hand").map((c) => c.objectId),
          deck = p.zone("main-deck").map((c) => c.objectId),
          opponentHand = q.zone("hand");
        if (expectedCounters < 5) {
          const before = game.state;
          expect(() => p.activateAbility(source, "73fdt8ptrz-a2")).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        p.activateAbility(source, "73fdt8ptrz-a2");
        expect(p.cards(windwalkerBoots, { zone: "banishment" })).toEqual([source]);
        expect(p.zone("hand").map((c) => c.objectId)).toEqual(hand);
        expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(expectedCounters);
        passEffectsStack(game);
        expect(p.zone("hand").map((c) => c.objectId)).toEqual([...hand, deck[0]!]);
        expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(deck.slice(1));
        expect(q.zone("hand")).toEqual(opponentHand);
        advanceToMain(game, p.id);
        advanceToMain(game, p.id, game.state.turn.number);
        expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(expectedCounters);
      });

  it("cannot use preparation counters on the opposing champion", () => {
    const champion = createClassBonusTestChampion(windwalkerBoots, false, "activation-discount");
    const opponent = createClassBonusTestChampion(windwalkerBoots, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [windwalkerBoots],
          "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: opponent,
        zones: {
          field: [windwalkerBoots],
          "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    for (let n = 0; n < 5; n++) advanceToMain(game, p.id, game.state.turn.number);
    expect(game.state.objects[p.card(champion).objectId]!.counters.preparation ?? 0).toBe(0);
    expect(game.state.objects[q.card(opponent).objectId]!.counters.preparation).toBe(5);
    const before = game.state;
    expect(() => p.activateAbility(windwalkerBoots, "73fdt8ptrz-a2")).toThrow();
    expect(game.state).toEqual(before);
  });

  for (const matching of [false, true])
    for (const rested of [false, true])
      it(`adds a counter only for an awake matching champion: class=${matching}, rested=${rested}`, () => {
        const base = createClassBonusTestChampion(windwalkerBoots, matching, "activation-discount");
        const champion = {
          ...base,
          layout: {
            kind: "single-faced" as const,
            face: { ...requireSingleFace(base), stats: { level: 0, life: 15, power: 1 } },
          },
        };
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [windwalkerBoots],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion);
        if (rested) {
          p.declareAttack(hero, q.card(champion));
          game.resolveCombatWithoutRetaliation();
          passEffectsStack(game);
        }
        advanceToMain(game, q.id);
        expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(
          matching && !rested ? 1 : 0,
        );
        expect(game.state.objects[q.card(champion).objectId]!.counters.preparation ?? 0).toBe(0);
      });
});
