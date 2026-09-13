import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { airshipEngineer } from "./airship-engineer.ts";

import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { fieryDuelist } from "./fiery-duelist.ts";

/** @covers wc8tuhuy4x-a1 */
describe("fiery-duelist — Ranged", () => {
  proveRangedAlly({ card: fieryDuelist, power: 1, ranged: 2, classBonus: true });
});

/** @covers wc8tuhuy4x-a2 */
describe("Fiery Duelist — optional Fire discard", () => {
  for (const fireAvailable of [false, true]) {
    for (const accept of [false, true]) {
      it(`requires a Fire discard (${fireAvailable}) before drawing and becoming distant (${accept})`, () => {
        const champion = createClassBonusTestChampion(fieryDuelist, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                fieryDuelist,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
                ...(fireAvailable ? [airshipEngineer, airshipEngineer] : []),
              ],
              memory: [airshipEngineer],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { hand: [airshipEngineer], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
          },
        });
        const player = game.player("player-one");
        player.activate(fieryDuelist, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        const hand = player.zone("hand");
        const deck = player.zone("main-deck");
        player.pass();
        game.player("player-two").pass();
        const ally = player.card(fieryDuelist, { zone: "field" });
        expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(false);
        expect(player.zone("hand")).toEqual(hand);
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-optional-effect")
          answerDecision(game, "resolve-optional-effect", accept);
        if (fireAvailable && accept) {
          for (const invalid of [
            player.card(woodlandSquirrels, { zone: "hand" }),
            player.card(airshipEngineer, { zone: "memory" }),
            game.player("player-two").card(airshipEngineer),
          ]) {
            const before = game.state;
            expect(() =>
              answerDecision(game, "resolve-effect-choice", [invalid.objectId]),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const selected = player.cards(airshipEngineer, { zone: "hand" })[1]!;
          answerDecision(game, "resolve-effect-choice", [selected.objectId]);
          passEffectsStack(game);
          expect(player.zone("graveyard")).toEqual([selected]);
          expect(player.zone("hand")).toEqual([
            ...hand.filter((ref) => ref.objectId !== selected.objectId),
            deck[0],
          ]);
          expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(true);
          advanceToRecollection(game, "player-two");
          expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(false);
        } else {
          passEffectsStack(game);
          expect(player.zone("hand")).toEqual(hand);
          expect(player.zone("main-deck")).toEqual(deck);
          expect(game.state.objects[ally.objectId]!.states.has("distant")).toBe(false);
          expect(player.zone("graveyard")).toHaveLength(0);
        }
        expect(game.state.decision).toBeNull();
      });
    }
  }
});
