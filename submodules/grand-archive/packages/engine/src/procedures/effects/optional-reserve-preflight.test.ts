import { torpidFractal, woodlandSquirrels } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";

function settle(game: GrandArchiveTestEngine): void {
  for (let step = 0; step < 32 && game.state.stack.length && !game.state.decision; step++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
}
function answer(game: GrandArchiveTestEngine, value: unknown): void {
  const decision = game.state.decision;
  if (!decision) throw new Error("Expected a decision");
  game.player(decision.playerId).execute({
    move: "answer-decision",
    decisionId: decision.id,
    stateVersion: decision.stateVersion,
    answer: value,
  });
}

describe("Optional reserve payment preflight", () => {
  for (const funding of ["none", "hand", "reservable", "rested", "draw"] as const)
    it(`handles ${funding} without entering an impossible mandatory payment`, () => {
      const champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
        canonicalId: "optional-reserve-champion",
        slug: "optional-reserve-champion",
        definitionKind: "card",
        layout: {
          kind: "single-faced",
          face: {
            id: "optional-reserve-champion:face:default",
            catalogId: "optional-reserve-champion",
            name: "Reserve Fixture",
            cost: { kind: "memory", amount: 0 },
            elements: ["NORM"],
            stats: { level: 0, life: 20 },
            typeLine: { supertypes: [], types: ["CHAMPION"], classes: ["SPIRIT"], subtypes: [] },
            rulesText: "",
            abilities: [
              {
                id: "optionalReserve-a1",
                kind: "activated",
                activation: "ability",
                text: "Optional reserve payment fixture",
                cost: { kind: "pay-reserve", amount: 0 },
                effect: {
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "sequence",
                    effects: [
                      funding === "draw"
                        ? {
                            kind: "sequence",
                            effects: [
                              { kind: "draw", player: "controller", amount: 1 },
                              {
                                kind: "pay",
                                player: "controller",
                                cost: { kind: "pay-reserve", amount: 1 },
                              },
                            ],
                          }
                        : {
                            kind: "pay",
                            player: "controller",
                            cost: { kind: "pay-reserve", amount: 1 },
                          },
                      {
                        kind: "add-counter",
                        subject: { kind: "source" },
                        counter: "buff",
                        amount: 1,
                      },
                    ],
                  },
                },
              },
              {
                id: "optionalReserve-a2",
                kind: "activated",
                activation: "ability",
                text: "Pay one reserve",
                cost: { kind: "pay-reserve", amount: 1 },
                effect: { kind: "no-op" },
              },
            ],
          },
        },
      };
      const hasFractal = funding === "reservable" || funding === "rested";
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [woodlandSquirrels, ...(hasFractal ? [torpidFractal] : [])],
            hand: funding === "hand" ? [woodlandSquirrels] : [],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [torpidFractal], hand: [woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion);
      if (funding === "rested") {
        p.activateAbility(hero, "optionalReserve-a2", {
          reservePayment: [{ kind: "reservable", objectId: p.card(torpidFractal).objectId }],
        });
        settle(game);
      }
      p.activateAbility(hero, "optionalReserve-a1");
      settle(game);
      const payable = funding === "hand" || funding === "reservable" || funding === "draw";
      if (payable) {
        expect(game.state.decision?.kind).toBe("resolve-optional-effect");
        answer(game, true);
        settle(game);
        expect(game.state.decision?.kind).toBe("resolve-effect-payment");
        expect(game.state.objects[hero.objectId]!.counters.buff ?? 0).toBe(0);
        answer(game, {
          reservePayment:
            funding === "reservable"
              ? [{ kind: "reservable", objectId: p.card(torpidFractal).objectId }]
              : [{ kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId }],
        });
        settle(game);
      }
      if (!payable) {
        expect(game.state.decision?.kind).toBe("resolve-optional-effect");
        const before = game.state;
        expect(() => answer(game, true)).toThrow();
        expect(game.state).toEqual(before);
        answer(game, false);
        settle(game);
      }
      expect(game.state.decision).toBeNull();
      expect(game.state.objects[hero.objectId]!.counters.buff ?? 0).toBe(Number(payable));
      expect(p.zone("memory")).toHaveLength(funding === "hand" || funding === "draw" ? 1 : 0);
      if (hasFractal)
        expect(game.state.objects[p.card(torpidFractal).objectId]!.states.has("rested")).toBe(true);
      expect(game.state.objects[q.card(torpidFractal).objectId]!.states.has("rested")).toBe(false);
      expect(q.zone("hand")).toHaveLength(1);
    });
});
