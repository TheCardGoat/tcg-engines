import { sparkAlight } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";
function settle(game: GrandArchiveTestEngine) {
  for (let step = 0; step < 32 && game.state.stack.length && !game.state.decision; step++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
}
function answer(game: GrandArchiveTestEngine, value: unknown) {
  const decision = game.state.decision;
  if (!decision) throw new Error("Expected a decision");
  game
    .player(decision.playerId)
    .execute({
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: value,
    });
}
describe("Optional activation elemental preflight", () => {
  for (const mode of ["missing", "enabled", "explicitly-ignored"] as const)
    it(`${mode} elements preserve a completable optional decision`, () => {
      const champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
        canonicalId: "optional-element-champion",
        slug: "optional-element-champion",
        definitionKind: "card",
        layout: {
          kind: "single-faced",
          face: {
            id: "optional-element-champion:face:default",
            catalogId: "optional-element-champion",
            name: "Element Fixture",
            cost: { kind: "memory", amount: 0 },
            elements: mode === "enabled" ? ["NORM", "FIRE"] : ["NORM"],
            stats: { level: 0, life: 20 },
            typeLine: { supertypes: [], types: ["CHAMPION"], classes: ["SPIRIT"], subtypes: [] },
            rulesText: "",
            abilities: [
              {
                id: "optionalElement-a1",
                kind: "activated",
                activation: "ability",
                text: "Optional card activation fixture",
                cost: { kind: "pay-reserve", amount: 0 },
                effect: {
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "activate-card",
                    subject: {
                      kind: "each",
                      collection: { zones: ["hand"], player: "controller" },
                    },
                    payCosts: false,
                    ignoreElementRequirements: mode === "explicitly-ignored",
                  },
                },
              },
            ],
          },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: { champion, zones: { hand: [sparkAlight] } },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        target = q.card(champion);
      p.activateAbility(p.card(champion), "optionalElement-a1");
      settle(game);
      expect(game.state.decision?.kind).toBe("resolve-optional-effect");
      if (mode === "missing") {
        const before = game.state;
        expect(() => answer(game, true)).toThrow("cannot be fully performed");
        expect(game.state).toEqual(before);
        answer(game, false);
        settle(game);
        expect(p.cards(sparkAlight, { zone: "hand" })).toHaveLength(1);
      } else {
        answer(game, true);
        settle(game);
        expect(game.state.decision?.kind).toBe("announce-effect-activation");
        answer(game, { targets: { "target-1": [target.objectId] } });
        settle(game);
        expect(p.cards(sparkAlight, { zone: "graveyard" })).toHaveLength(1);
      }
      expect(game.state.objects[target.objectId]!.damage).toBe(mode === "missing" ? 0 : 2);
      expect(p.zone("memory")).toHaveLength(0);
      expect(game.state.stack).toHaveLength(0);
      expect(game.state.decision).toBeFalsy();
    });
});
