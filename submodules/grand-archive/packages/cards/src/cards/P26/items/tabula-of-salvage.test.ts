import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { tabulaOfSalvage } from "./tabula-of-salvage.ts";

/** @covers 9cy4wipw4k-a1 */
describe("Tabula of Salvage — ordered graveyard return", () => {
  for (const ownTurn of [false, true])
    for (const count of [0, 1, 3, 5]) {
      it(`returns ${count} chosen cards in order, own turn=${ownTurn}`, () => {
        const champion = createClassBonusTestChampion(
          tabulaOfSalvage,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: ownTurn ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [tabulaOfSalvage],
              graveyard: Array(6).fill(woodlandSquirrels),
              hand: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { graveyard: [woodlandSquirrels], "main-deck": [woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(tabulaOfSalvage),
          grave = p.zone("graveyard"),
          deck = p.zone("main-deck"),
          other = q.zone("graveyard");
        if (!ownTurn) q.pass();
        p.activateAbility(source, "9cy4wipw4k-a1");
        expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
        expect(p.zone("graveyard")).toEqual(grave);
        expect(p.zone("main-deck")).toEqual(deck);
        passEffectsStack(game);
        expect(game.state.decision).toMatchObject({
          kind: "resolve-effect-choice",
          playerId: p.id,
        });
        for (const invalid of [
          grave.map((c) => c.objectId),
          [grave[0]!.objectId, grave[0]!.objectId],
          [other[0]!.objectId],
          [p.zone("hand")[0]!.objectId],
          [source.objectId],
        ]) {
          const before = game.state;
          expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
          expect(game.state).toEqual(before);
        }
        const chosen = grave.slice(0, count).reverse();
        answerDecision(
          game,
          "resolve-effect-choice",
          chosen.map((c) => c.objectId),
        );
        passEffectsStack(game);
        expect(p.zone("main-deck")).toEqual([...deck, ...chosen]);
        expect(p.zone("graveyard")).toEqual(grave.slice(count));
        expect(q.zone("graveyard")).toEqual(other);
        expect(() => p.activateAbility(source, "9cy4wipw4k-a1")).toThrow();
      });
    }
});

/** @covers 9cy4wipw4k-a1 */
it("can be banished with an empty graveyard without changing either deck", () => {
  const champion = createClassBonusTestChampion(tabulaOfSalvage, true, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: { champion, zones: { field: [tabulaOfSalvage], "main-deck": [woodlandSquirrels] } },
    playerTwo: {
      champion,
      zones: { graveyard: [woodlandSquirrels], "main-deck": [woodlandSquirrels] },
    },
  });
  const p = game.player("player-one"),
    q = game.player("player-two");
  const deck = p.zone("main-deck"),
    other = q.zone("main-deck"),
    source = p.card(tabulaOfSalvage);
  p.activateAbility(source, "9cy4wipw4k-a1");
  passEffectsStack(game);
  expect(game.state.decision).toBeNull();
  expect(game.state.stack).toHaveLength(0);
  expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
  expect(p.zone("main-deck")).toEqual(deck);
  expect(q.zone("main-deck")).toEqual(other);
  expect(q.zone("graveyard")).toHaveLength(1);
});
