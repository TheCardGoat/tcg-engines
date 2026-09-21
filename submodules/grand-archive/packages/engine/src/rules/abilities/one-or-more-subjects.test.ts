import { trainingSword, woodlandSquirrels } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveCard,
  GrandArchiveEffectTriggeredAbility,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";
function settle(game: GrandArchiveTestEngine) {
  for (let n = 0; n < 64 && game.state.stack.length && !game.state.decision; n++) {
    const w = game.waitState();
    if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
    game.player(w.playerId).pass();
  }
}
function opportunity(game: GrandArchiveTestEngine, id: string) {
  const w = game.waitState();
  if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
  if (w.playerId !== id) game.player(w.playerId).pass();
}
describe("One-or-more entry subject groups", () => {
  for (const delayed of [false, true])
    for (const borrowed of [false, true])
      it(`delayed=${delayed}, opposing entrants owned by observer=${borrowed}`, () => {
        const watch: GrandArchiveEffectTriggeredAbility = {
          id: "batchSubjects-a1",
          kind: "triggered",
          text: "Whenever one or more allies enter under an opponent's control, draw that many cards.",
          trigger: {
            kind: "event",
            cardinality: "one-or-more",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                controller: "opponent",
                filter: { kind: "type", oneOf: ["ALLY"] },
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: { kind: "count", collection: { binding: "eventSubject" } },
          },
        };
        const champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
          canonicalId: "batch-subjects-champion",
          slug: "batch-subjects-champion",
          definitionKind: "card",
          layout: {
            kind: "single-faced",
            face: {
              id: "batch-subjects-champion:face:default",
              catalogId: "batch-subjects-champion",
              name: "Batch Subjects",
              cost: { kind: "memory", amount: 0 },
              elements: ["NORM"],
              stats: { level: 0, life: 20 },
              typeLine: { supertypes: [], types: ["CHAMPION"], classes: ["SPIRIT"], subtypes: [] },
              rulesText: "",
              abilities: [
                delayed
                  ? {
                      id: "batchSubjects-a1",
                      kind: "activated",
                      activation: "ability",
                      text: "Watch the next group this turn.",
                      cost: { kind: "pay-reserve", amount: 0 },
                      effect: {
                        kind: "create-delayed-trigger",
                        trigger: watch.trigger,
                        limit: 1,
                        expires: { kind: "this-turn" },
                        effect: watch.effect,
                      },
                    }
                  : watch,
                {
                  id: "batchSubjects-a2",
                  kind: "activated",
                  activation: "ability",
                  text: "Put selected cards on the field under your control.",
                  cost: { kind: "pay-reserve", amount: 0 },
                  effect: {
                    kind: "choose",
                    selection: {
                      id: "entries",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: { kind: "up-to", amount: 3 },
                      unique: true,
                      candidates: {
                        kind: "card",
                        zones: ["hand", "material-deck"],
                        player: "each-player",
                        relationship: "zone-of",
                      },
                    },
                    effect: {
                      kind: "move",
                      subject: { kind: "bound", binding: "entries" },
                      destination: { zone: "field", controller: "controller" },
                    },
                  },
                },
              ],
            },
          },
        };
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: borrowed ? Array.from({ length: 4 }, () => woodlandSquirrels) : [],
              "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              hand: borrowed ? [] : Array.from({ length: 4 }, () => woodlandSquirrels),
              "material-deck": [trainingSword],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          owner = borrowed ? p : q;
        const allies = owner.cards(woodlandSquirrels, { zone: "hand" });
        if (delayed) {
          p.activateAbility(p.card(champion), "batchSubjects-a1");
          settle(game);
        }
        for (let batch = 0; batch < 2; batch++) {
          opportunity(game, q.id);
          q.activateAbility(q.card(champion), "batchSubjects-a2");
          settle(game);
          const decision = game.state.decision;
          if (decision?.kind !== "resolve-effect-choice") throw new Error("Expected entry choice");
          const ids = allies.slice(batch * 2, batch * 2 + 2).map((c) => c.objectId);
          if (batch === 0) ids.push(q.card(trainingSword, { zone: "material-deck" }).objectId);
          q.execute({
            move: "answer-decision",
            decisionId: decision.id,
            stateVersion: decision.stateVersion,
            answer: ids,
          });
          settle(game);
          expect(p.zone("main-deck")).toHaveLength(6 - (delayed ? 2 : 2 * (batch + 1)));
          for (const ally of allies.slice(batch * 2, batch * 2 + 2))
            expect(game.state.objects[ally.objectId]).toMatchObject({
              zone: "field",
              controllerId: q.id,
              ownerId: owner.id,
            });
          expect(q.zone("main-deck")).toHaveLength(0);
        }
      });
});
