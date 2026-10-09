import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { imperiousHighlander } from "./imperious-highlander.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reclaim } from "../../DOA/actions/reclaim.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack, advanceToMain } from "../../../testing/decisions.ts";
/** @covers 659ytyj2s3-a1 */
describe("Imperious Highlander opponent ally surplus", () => {
  for (const own of [0, 2])
    for (const opposing of [0, 1, 4])
      it(`counts opponent allies minus own including source: ${own}/${opposing}`, () => {
        const champion = createClassBonusTestChampion(
          imperiousHighlander,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [imperiousHighlander, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              field: Array.from({ length: own }, () => woodlandSquirrels),
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: Array.from({ length: opposing }, () => woodlandSquirrels),
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(imperiousHighlander);
        const power = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "power", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        p.activate(source, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        p.pass();
        q.pass();
        expect(game.state.decision?.kind).toBe("announce-triggered-ability");
        const before = game.state;
        for (const ids of [[], [p.id], [q.id, q.id]]) {
          expect(() =>
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-opponent": ids },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-opponent": [q.id] },
        });
        expect(power()).toBe(2);
        passEffectsStack(game);
        const expected = 2 + Math.max(0, opposing - own - 1);
        expect(power()).toBe(expected);
        p.declareAttack(source, q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(expected);
        advanceToMain(game, q.id);
        expect(power()).toBe(2);
      });
});

for (const removeBefore of [false, true])
  it(`measures the ally surplus at resolution and then locks it: removeBefore=${removeBefore}`, () => {
    const champion = enableAllTestElements(
      createClassBonusTestChampion(imperiousHighlander, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [imperiousHighlander, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          hand: [reclaim, reclaim, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      source = p.card(imperiousHighlander);
    const power = () =>
      deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "power", {
        program: game.program,
        state: game.state,
        controllerId: p.id,
        bindings: {},
      });
    p.activate(source, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card", cardId: ref.objectId })),
    });
    p.pass();
    q.pass();
    answerDecision(game, "announce-triggered-ability", { targets: { "target-opponent": [q.id] } });
    const remove = () => {
      p.pass();
      q.activate(q.cards(reclaim, { zone: "hand" })[0]!, {
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        targets: { "target-1": [q.cards(woodlandSquirrels, { zone: "field" })[0]!.objectId] },
      });
      passEffectsStack(game);
    };
    if (removeBefore) remove();
    else passEffectsStack(game);
    expect(power()).toBe(removeBefore ? 3 : 4);
    remove();
    expect(power()).toBe(removeBefore ? 3 : 4);
  });
