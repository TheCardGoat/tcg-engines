import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { cunningBroker } from "./cunning-broker.ts";
import { windwalkerBoots } from "../items/windwalker-boots.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers oy34bro89w-a2 */
describe("Cunning Broker's preparation payment", () => {
  for (const prepared of [0, 1, 2, 4])
    for (const opponentTurn of [false, true])
      it(`rests and spends exactly two own champion counters: prepared=${prepared}, opponent=${opponentTurn}`, () => {
        const champion = createClassBonusTestChampion(cunningBroker, true, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [cunningBroker, windwalkerBoots],
              "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [cunningBroker, windwalkerBoots],
              "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(cunningBroker),
          hero = p.card(champion),
          opposingHero = q.card(champion);
        for (let n = 0; n < prepared; n++) advanceToMain(game, p.id, game.state.turn.number);
        if (opponentTurn) {
          advanceToMain(game, q.id);
          q.pass();
        }
        const count = prepared + Number(opponentTurn);
        expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(count);
        const before = game.state;
        if (count < 2) {
          expect(() => p.activateAbility(source, "oy34bro89w-a2")).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        const hand = p.zone("hand").map((c) => c.objectId),
          deck = p.zone("main-deck").map((c) => c.objectId),
          opposing = game.state.objects[opposingHero.objectId]!.counters.preparation;
        p.activateAbility(source, "oy34bro89w-a2");
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
        expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(count - 2);
        expect(p.zone("hand").map((c) => c.objectId)).toEqual(hand);
        expect(game.state.objects[opposingHero.objectId]!.counters.preparation).toBe(opposing);
        const after = game.state;
        expect(() => p.activateAbility(source, "oy34bro89w-a2")).toThrow();
        expect(game.state).toEqual(after);
        passEffectsStack(game);
        expect(p.zone("hand").map((c) => c.objectId)).toEqual([...hand, deck[0]!]);
        expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(deck.slice(1));
        if (count >= 4) {
          advanceToMain(game, p.id, game.state.turn.number);
          expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
          const nextCount = game.state.objects[hero.objectId]!.counters.preparation!;
          const nextHand = p.zone("hand").length;
          p.activateAbility(source, "oy34bro89w-a2");
          expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(nextCount - 2);
          passEffectsStack(game);
          expect(p.zone("hand")).toHaveLength(nextHand + 1);
        }
      });

  it("cannot spend preparation counters on the opposing champion", () => {
    const champion = createClassBonusTestChampion(cunningBroker, false, "activation-discount"),
      opponent = createClassBonusTestChampion(cunningBroker, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [cunningBroker],
          "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: opponent,
        zones: {
          field: [windwalkerBoots],
          "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    for (let n = 0; n < 2; n++) advanceToMain(game, p.id, game.state.turn.number);
    expect(game.state.objects[q.card(opponent).objectId]!.counters.preparation).toBe(2);
    const before = game.state;
    expect(() => p.activateAbility(cunningBroker, "oy34bro89w-a2")).toThrow();
    expect(game.state).toEqual(before);
  });
});
