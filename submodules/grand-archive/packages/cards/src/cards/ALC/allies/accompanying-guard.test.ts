import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { accompanyingGuard } from "./accompanying-guard.ts";

/** @covers ufvq8tuge1-a1 */
describe("Accompanying Guard — direct fostering on entry", () => {
  for (const classBonus of [false, true]) {
    for (const available of [false, true]) {
      it(`requires Class Bonus (${classBonus}) and another controlled ally (${available})`, () => {
        const champion = createClassBonusTestChampion(
          accompanyingGuard,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [accompanyingGuard, woodlandSquirrels, woodlandSquirrels],
              field: available ? [woodlandSquirrels, woodlandSquirrels] : [],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        player.activate(accompanyingGuard, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        player.pass();
        opponent.pass();
        const guard = player.card(accompanyingGuard, { zone: "field" });
        const allies = player.cards(woodlandSquirrels, { zone: "field" });
        for (const ref of [guard, ...allies])
          expect(game.state.objects[ref.objectId]!.states.has("fostered")).toBe(false);
        if (classBonus && available) {
          for (const invalid of [
            guard,
            player.card(champion),
            opponent.card(woodlandSquirrels),
            player.cards(woodlandSquirrels, { zone: "memory" })[0]!,
          ]) {
            const before = game.state;
            expect(() =>
              answerDecision(game, "announce-triggered-ability", {
                targets: { "target-1": [invalid.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-1": [allies[1]!.objectId] },
          });
          expect(game.state.objects[allies[1]!.objectId]!.states.has("fostered")).toBe(false);
          passEffectsStack(game);
          expect(game.state.objects[allies[1]!.objectId]!.states.has("fostered")).toBe(true);
          expect(game.state.objects[allies[0]!.objectId]!.states.has("fostered")).toBe(false);
          advanceToRecollection(game, "player-two");
          expect(game.state.objects[allies[1]!.objectId]!.states.has("fostered")).toBe(true);
          advanceToRecollection(game, "player-one");
          expect(game.state.objects[allies[1]!.objectId]!.states.has("fostered")).toBe(true);
          expect(game.state.objects[allies[0]!.objectId]!.states.has("fostered")).toBe(false);
        } else {
          passEffectsStack(game);
          expect(game.state.decision).toBeNull();
          for (const ally of allies)
            expect(game.state.objects[ally.objectId]!.states.has("fostered")).toBe(false);
        }
        for (const ref of [
          guard,
          player.card(champion),
          opponent.card(woodlandSquirrels, { zone: "field" }),
        ])
          expect(game.state.objects[ref.objectId]!.states.has("fostered")).toBe(false);
      });
    }
  }
});
