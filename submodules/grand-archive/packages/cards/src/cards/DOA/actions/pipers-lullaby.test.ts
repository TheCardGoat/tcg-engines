import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { describe } from "vitest";
import { pipersLullaby } from "./pipers-lullaby.ts";
import { proveConditionalPetLevel } from "../../../testing/conditional-pet-level.ts";
/** @covers raG5r85ieO-a1 */
describe("pipers-lullaby conditional level", () => {
  proveConditionalPetLevel(pipersLullaby);
});

/** @covers raG5r85ieO-a2 */
describe("Piper's Lullaby's optional ally rest", () => {
  for (const classBonus of [false, true])
    for (const targetMode of ["none", "own", "opposing"])
      it(`class=${classBonus}, target=${targetMode}`, () => {
        const champion = createClassBonusTestChampion(
            pipersLullaby,
            classBonus,
            "activation-discount",
          ),
          game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [giantTortoise],
                hand: [pipersLullaby, woodlandSquirrels],
                "main-deck": [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { field: [giantTortoise], "main-deck": [woodlandSquirrels] },
            },
          });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = (targetMode === "own" ? p : q).card(giantTortoise),
          reservePayment = [
            { kind: "card" as const, cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
          ];
        if (classBonus) {
          for (const targets of [
            [p.card(champion).objectId],
            [p.card(giantTortoise).objectId, q.card(giantTortoise).objectId],
          ]) {
            const before = game.state;
            expect(() =>
              p.activate(pipersLullaby, { reservePayment, targets: { "target-1": targets } }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
        }
        p.activate(pipersLullaby, {
          reservePayment,
          ...(classBonus
            ? { targets: { "target-1": targetMode === "none" ? [] : [target.objectId] } }
            : {}),
        });
        passEffectsStack(game);
        for (const player of [p, q])
          expect(
            game.state.objects[player.card(giantTortoise).objectId]!.states.has("rested"),
          ).toBe(
            classBonus &&
              targetMode !== "none" &&
              player.card(giantTortoise).objectId === target.objectId,
          );
        advanceToMain(game, q.id);
        expect(game.state.objects[q.card(giantTortoise).objectId]!.states.has("rested")).toBe(
          false,
        );
        advanceToMain(game, p.id);
        expect(game.state.objects[p.card(giantTortoise).objectId]!.states.has("rested")).toBe(
          false,
        );
      });
});
