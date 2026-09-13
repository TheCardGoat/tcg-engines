import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { blindingOrb } from "./blinding-orb.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers qYH9PJP7uM-a1 */
describe("Blinding Orb's opponent hand choice", () => {
  for (const classBonus of [false, true])
    for (const count of [0, 1, 2, 4])
      it(`class=${classBonus}, opponent has ${count} cards`, () => {
        const champion = createClassBonusTestChampion(
          blindingOrb,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [blindingOrb],
              hand: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { hand: Array.from({ length: count }, () => woodlandSquirrels) },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hand = q.zone("hand"),
          selected = hand.slice(-2).map((c) => c.objectId);
        p.activateAbility(blindingOrb, "qYH9PJP7uM-a1");
        expect(p.cards(blindingOrb, { zone: "banishment" })).toHaveLength(1);
        passEffectsStack(game);
        if (count > 2) {
          expect(game.state.decision?.kind).toBe("resolve-effect-choice");
          expect(game.state.decision?.playerId).toBe(q.id);
          const before = game.state;
          expect(() => answerDecision(game, "resolve-effect-choice", [selected[0]!])).toThrow();
          expect(game.state).toEqual(before);
          expect(() =>
            answerDecision(game, "resolve-effect-choice", [
              selected[0]!,
              p.card(woodlandSquirrels, { zone: "hand" }).objectId,
            ]),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-effect-choice", selected);
          passEffectsStack(game);
        }
        expect(
          q
            .zone("memory")
            .map((c) => c.objectId)
            .sort(),
        ).toEqual(selected.sort());
        expect(q.zone("hand")).toHaveLength(Math.max(0, count - 2));
        expect(p.zone("memory")).toHaveLength(0);
        expect(p.zone("hand")).toHaveLength(classBonus ? 2 : 1);
        expect(p.zone("main-deck")).toHaveLength(classBonus ? 0 : 1);
      });
});
