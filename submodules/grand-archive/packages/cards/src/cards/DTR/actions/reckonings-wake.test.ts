import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { reckoningsWake } from "./reckonings-wake.ts";
import { theLookingGlass } from "../items/the-looking-glass.ts";
import { tomeOfIgnorance } from "../items/tome-of-ignorance.ts";
import { baubleOfScarcity } from "../items/bauble-of-scarcity.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers m3nlelc53u-a1 */
describe("Reckoning's Wake — privately order 3 plus controlled field Distortions", () => {
  for (const distortions of [0, 1, 3])
    for (const deckSize of [0, 2, 8])
      it(`orders up to ${3 + distortions} cards from a deck of ${deckSize}`, () => {
        const champion = createClassBonusTestChampion(reckoningsWake, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [
                trainingSword,
                ...[theLookingGlass, tomeOfIgnorance, baubleOfScarcity].slice(0, distortions),
              ],
              graveyard: [tomeOfIgnorance],
              hand: [reckoningsWake, woodlandSquirrels, woodlandSquirrels],
              "main-deck": Array.from({ length: deckSize }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: { field: [theLookingGlass], "main-deck": [woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const deck = p.zone("main-deck"),
          otherDeck = q.zone("main-deck");
        const looked = deck.slice(0, 3 + distortions),
          reordered = [...looked].reverse();
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() => p.activate(reckoningsWake, { reservePayment: payment.slice(0, 1) })).toThrow();
        expect(game.state).toEqual(before);
        p.activate(reckoningsWake, { reservePayment: payment });
        expect(p.zone("memory")).toHaveLength(2);
        expect(game.state.eventHistory.filter((e) => e.type === "cards-looked-at")).toHaveLength(0);
        passEffectsStack(game);
        if (looked.length > 1) {
          expect(game.state.decision).toMatchObject({
            kind: "resolve-effect-choice",
            playerId: p.id,
          });
          const pending = game.state;
          for (const invalid of [
            looked.slice(1).map((c) => c.objectId),
            [otherDeck[0]!.objectId, ...looked.slice(1).map((c) => c.objectId)],
          ]) {
            expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
            expect(game.state).toEqual(pending);
          }
          answerDecision(
            game,
            "resolve-effect-choice",
            reordered.map((c) => c.objectId),
          );
          passEffectsStack(game);
        }
        expect(game.state.decision).toBeNull();
        expect(p.zone("main-deck")).toEqual([...reordered, ...deck.slice(looked.length)]);
        expect(q.zone("main-deck")).toEqual(otherDeck);
        expect(p.zone("hand")).toHaveLength(0);
        expect(p.cards(reckoningsWake, { zone: "graveyard" })).toHaveLength(1);
        const looks = game.state.eventHistory.filter((e) => e.type === "cards-looked-at");
        expect(looks).toHaveLength(looked.length ? 1 : 0);
        if (looked.length)
          expect(looks[0]).toMatchObject({
            playerId: p.id,
            actorId: p.id,
            objectIds: looked.map((c) => c.objectId),
          });
        expect(game.state.eventHistory.filter((e) => e.type === "card-revealed")).toHaveLength(0);
      });
});
