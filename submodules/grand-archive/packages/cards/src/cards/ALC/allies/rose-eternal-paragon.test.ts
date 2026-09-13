import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { roseEternalParagon } from "./rose-eternal-paragon.ts";
import { shimmercloakAssassin } from "./shimmercloak-assassin.ts";

function levelTwoGuardianChampion() {
  const base = createClassBonusTestChampion(roseEternalParagon, true, "activation-discount");
  if (base.layout.kind !== "single-faced") throw new Error("Expected single-faced champion");
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...base.layout.face,
        abilities: [
          {
            id: "rose-test-level-two-a1",
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

/** @covers 2bbmoqk2c7-a1 */
describe("Rose, Eternal Paragon — Intercept and True Sight", () => {
  it("can attack a Stealth unit and can intercept an attack on its champion", () => {
    const champion = levelTwoGuardianChampion();
    const attackGame = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { field: [roseEternalParagon] } },
      playerTwo: { champion, zones: { field: [shimmercloakAssassin] } },
    });
    attackGame.player("player-one").declareAttack(roseEternalParagon, shimmercloakAssassin);
    expect(attackGame.state.combat?.targetIds).toEqual([
      attackGame.player("player-two").card(shimmercloakAssassin).objectId,
    ]);

    const interceptGame = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion, zones: { field: [roseEternalParagon] } },
      playerTwo: { champion, zones: { field: [automatedGardener] } },
    });
    const defender = interceptGame.player("player-one");
    interceptGame.player("player-two").declareAttack(automatedGardener, defender.card(champion));
    passEffectsStack(interceptGame);
    answerDecision(interceptGame, "resolve-optional-effect", true);
    passEffectsStack(interceptGame);
    expect(interceptGame.state.combat?.targetIds).toEqual([
      defender.card(roseEternalParagon).objectId,
    ]);
  });
});

/** @covers 2bbmoqk2c7-a2 @covers 2bbmoqk2c7-a3 */
describe("Rose, Eternal Paragon — fast entry defense", () => {
  it("uses Class Bonus Fast Activation during combat, retargets at level two, and gains life", () => {
    const champion = levelTwoGuardianChampion();
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          hand: [roseEternalParagon, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
        },
      },
      playerTwo: { champion, zones: { field: [automatedGardener] } },
    });
    const defender = game.player("player-one");
    const attacker = game.player("player-two");
    attacker.declareAttack(automatedGardener, defender.card(champion));
    attacker.pass();
    defender.activate(roseEternalParagon, {
      reservePayment: defender
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    const rose = defender.card(roseEternalParagon, { zone: "field" });
    expect(game.state.combat?.targetIds).toEqual([rose.objectId]);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[rose.objectId]!.zone).toBe("field");
    expect(game.state.objects[rose.objectId]!.damage).toBe(2);
  });
});
