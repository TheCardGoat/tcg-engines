import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { diffusiveBlock } from "../actions/diffusive-block.ts";
import { accompanyingGuard } from "./accompanying-guard.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { crimsonTear } from "./crimson-tear.ts";

function levelTwoChampion() {
  const base = createClassBonusTestChampion(crimsonTear, true, "activation-discount");
  if (base.layout.kind !== "single-faced") throw new Error("Expected champion");
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...base.layout.face,
        elements: ["FIRE", "WATER"] as const,
        abilities: [
          {
            id: "crimson-tear-test-level-two-a1",
            kind: "static" as const,
            staticKind: "effects" as const,
            text: "This champion gets +2 level.",
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
                  amount: 2,
                },
              },
            ],
          },
        ],
      },
    },
  } satisfies GrandArchiveCard<GrandArchiveAbilityDefinition, "card">;
}

/** @covers 9q1wl8ao8b-a1 */
describe("Crimson Tear — Human combat bonus", () => {
  it("gets one power while attacking a Human at level one or higher", () => {
    const champion = levelTwoChampion();
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [crimsonTear] } },
      playerTwo: { champion, zones: { field: [accompanyingGuard] } },
    });
    game.player("player-one").declareAttack(crimsonTear, accompanyingGuard);
    game.resolveCombatWithoutRetaliation();
    expect(game.player("player-two").cards(accompanyingGuard, { zone: "graveyard" })).toHaveLength(
      1,
    );
  });
});

/** @covers 9q1wl8ao8b-a2 */
describe("Crimson Tear — targeted Reaction trigger", () => {
  it("draws to memory and wakes only when its controller's Reaction targets Crimson Tear", () => {
    const champion = levelTwoChampion();
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [crimsonTear, automatedGardener],
          hand: [
            diffusiveBlock,
            diffusiveBlock,
            ...Array.from({ length: 4 }, () => woodlandSquirrels),
          ],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { hand: [glacialGuidance, woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const tear = player.card(crimsonTear);
    opponent.activate(glacialGuidance, {
      targets: { "target-1": [tear.objectId] },
      reservePayment: [
        { kind: "card", cardId: opponent.card(woodlandSquirrels, { zone: "hand" }).objectId },
      ],
    });
    passEffectsStack(game);
    expect(game.state.objects[tear.objectId]!.states.has("rested")).toBe(true);
    const payments = player.cards(woodlandSquirrels, { zone: "hand" });
    const top = player.zone("main-deck")[0]!;
    const wait = game.waitState();
    if (wait.kind === "opportunity" && wait.playerId !== player.id)
      game.player(wait.playerId).pass();
    player.activate(player.cards(diffusiveBlock, { zone: "hand" })[0]!, {
      targets: { "target-1": [tear.objectId] },
      reservePayment: payments.slice(0, 2).map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(player.zone("memory")).toContainEqual(top);
    expect(game.state.objects[tear.objectId]!.states.has("rested")).toBe(false);

    const nextTop = player.zone("main-deck")[0]!;
    const nextWait = game.waitState();
    if (nextWait.kind === "opportunity" && nextWait.playerId !== player.id)
      game.player(nextWait.playerId).pass();
    player.activate(diffusiveBlock, {
      targets: { "target-1": [player.card(automatedGardener).objectId] },
      reservePayment: payments.slice(2).map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(player.zone("main-deck")[0]).toEqual(nextTop);
  });
});
