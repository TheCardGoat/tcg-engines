import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { dawnsReversal } from "./dawns-reversal.ts";
import { flashFreeze } from "./flash-freeze.ts";

function clericChampion(level: 0 | 1 | 2) {
  const base = lineageTestChampion("Dawn's Reversal", level);
  if (base.layout.kind !== "single-faced") throw new Error("Expected single-faced champion");
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...base.layout.face,
        stats: { ...base.layout.face.stats, level: 0 },
        typeLine: { ...base.layout.face.typeLine, classes: ["CLERIC"], subtypes: ["CLERIC"] },
        elements: ["NORM", "ASTRA", "WATER"] as const,
        abilities:
          level === 0
            ? []
            : [
                {
                  id: `dawns-reversal-test-level-${level}-a1`,
                  kind: "static" as const,
                  staticKind: "effects" as const,
                  text: `This champion gets +${level} level.`,
                  effects: [
                    {
                      kind: "continuous" as const,
                      subjects: { kind: "source" as const },
                      affectedSet: "dynamic" as const,
                      duration: { kind: "while-source-in-functional-zone" as const },
                      layer: {
                        layer: "E" as const,
                        modifies: "stat" as const,
                        sublayer: "modifier" as const,
                      },
                      change: {
                        kind: "numeric" as const,
                        property: "level" as const,
                        operation: "add" as const,
                        amount: level,
                      },
                    },
                  ],
                },
              ],
      },
    },
  } satisfies GrandArchiveCard<GrandArchiveAbilityDefinition, "card">;
}

/** @covers x53jgq8aad-a1 */
describe("Dawn's Reversal — negation discount", () => {
  it("costs zero after a card activation was negated this turn", () => {
    const champion = clericChampion(0);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: { hand: [flashFreeze, dawnsReversal, woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: { champion, zones: { hand: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    opponent.activate(woodlandSquirrels);
    const activation = game.state.stack.at(-1);
    if (activation?.kind !== "card-activation") throw new Error("Expected activation");
    opponent.pass();
    player.activate(flashFreeze, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
      targets: { "target-stack-item": [activation.id] },
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-payment", false);
    passEffectsStack(game);
    opponent.pass();

    player.activate(dawnsReversal, {
      targets: { "target-1": [opponent.card(champion).objectId] },
    });
    expect(player.cards(dawnsReversal, { zone: "effects-stack" })).toHaveLength(1);
  });
});

/** @covers x53jgq8aad-a2 */
describe("Dawn's Reversal — level-scaled Glimpse and damage", () => {
  it("glimpses and deals damage equal to the champion's current level", () => {
    const champion = clericChampion(2);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [dawnsReversal, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const target = game.player("player-two").card(champion);
    player.activate(dawnsReversal, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    const decision = game.state.decision;
    if (decision?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse");
    answerDecision(game, "resolve-glimpse", {
      kind: "reorder",
      top: decision.cardIds,
      bottom: [],
    });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
  });
});
