import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { enfeeblingOrb } from "./enfeebling-orb.ts";

/** @covers T3cx65VM3D-a1 */
describe("Enfeebling Orb — opponent chooses hand cards", () => {
  for (const ownTurn of [false, true])
    for (const size of [0, 1, 2, 4]) {
      it(`moves up to two available cards, hand=${size}, own turn=${ownTurn}`, () => {
        const champion = createClassBonusTestChampion(enfeeblingOrb, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: ownTurn ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [enfeeblingOrb],
              hand: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: Array(size).fill(woodlandSquirrels),
              memory: [woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(enfeeblingOrb),
          hand = q.zone("hand"),
          memory = q.zone("memory"),
          ownHand = p.zone("hand");
        if (!ownTurn) q.pass();
        for (const ids of [[], [p.id], [p.id, q.id]]) {
          const before = game.state;
          expect(() =>
            p.activateAbility(source, "T3cx65VM3D-a1", { targets: { "target-opponent": ids } }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        p.activateAbility(source, "T3cx65VM3D-a1", { targets: { "target-opponent": [q.id] } });
        expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
        expect(q.zone("hand")).toEqual(hand);
        expect(q.zone("memory")).toEqual(memory);
        passEffectsStack(game);
        const chosen = hand.slice(-2);
        if (size) {
          expect(game.state.decision).toMatchObject({
            kind: "resolve-effect-choice",
            playerId: q.id,
          });
          for (const invalid of [
            [],
            [ownHand[0]!.objectId],
            [memory[0]!.objectId],
            [hand[0]!.objectId, hand[0]!.objectId],
            ...(size > 2 ? [hand.map((c) => c.objectId), [hand[0]!.objectId]] : []),
          ]) {
            const before = game.state;
            expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
            expect(game.state).toEqual(before);
          }
          const decision = game.state.decision!;
          const beforeWrongPlayer = game.state;
          expect(() =>
            p.execute({
              move: "answer-decision",
              decisionId: decision.id,
              stateVersion: decision.stateVersion,
              answer: chosen.map((c) => c.objectId),
            }),
          ).toThrow();
          expect(game.state).toEqual(beforeWrongPlayer);
          answerDecision(
            game,
            "resolve-effect-choice",
            chosen.map((c) => c.objectId),
          );
          passEffectsStack(game);
        }
        expect(q.zone("memory")).toEqual([...memory, ...chosen]);
        expect(q.zone("hand")).toEqual(hand.slice(0, Math.max(0, size - 2)));
        expect(p.zone("hand")).toEqual(ownHand);
        expect(game.state.stack).toHaveLength(0);
        expect(game.state.decision).toBeNull();
      });
    }
});
