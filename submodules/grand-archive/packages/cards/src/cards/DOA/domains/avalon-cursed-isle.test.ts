import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { avalonCursedIsle as domain } from "./avalon-cursed-isle.ts";
/** @covers 41WnFOT5YS-a1 */
describe("Domain upkeep responds only to its controller's materialization", () => {
  for (const own of [false, true])
    it(`own materialization=${own}`, () => {
      const champion = createClassBonusTestChampion(domain, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        firstPlayer: own ? "playerOne" : "playerTwo",
        playerOne: { champion, zones: { field: [domain], "material-deck": [trainingSword] } },
        playerTwo: { champion, zones: { "material-deck": [trainingSword] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(domain),
        actor = own ? p : q;
      actor.materialize(trainingSword);
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe(own ? "graveyard" : "field");
      expect(actor.card(trainingSword, { zone: "field" })).toBeDefined();
    });
});

/** @covers 41WnFOT5YS-a2 */
describe("Avalon mills exactly the chosen player's available top cards for own water activations", () => {
  for (const actorOwn of [false, true])
    for (const water of [false, true])
      for (const targetOwn of [false, true])
        for (const deckSize of [1, 3])
          it(`actor=${actorOwn},water=${water},target=${targetOwn},deck=${deckSize}`, () => {
            const champion = createClassBonusTestChampion(domain, false, "activation-discount"),
              activated = water ? giantTortoise : woodlandSquirrels;
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: actorOwn ? "playerOne" : "playerTwo",
              playerOne: {
                champion,
                zones: {
                  field: [domain],
                  hand: [activated, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
                  "main-deck": Array.from({ length: deckSize }, () => woodlandSquirrels),
                },
              },
              playerTwo: {
                champion,
                zones: {
                  hand: [activated, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
                  "main-deck": Array.from({ length: deckSize }, () => woodlandSquirrels),
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              actor = actorOwn ? p : q,
              target = targetOwn ? p : q,
              other = targetOwn ? q : p;
            const source = actor.cards(activated, { zone: "hand" })[0]!,
              top = target
                .zone("main-deck")
                .slice(0, 2)
                .map((c) => c.objectId);
            actor.activate(source, {
              reservePayment: water
                ? actor
                    .cards(woodlandSquirrels, { zone: "hand" })
                    .map((c) => ({ kind: "card" as const, cardId: c.objectId }))
                : [],
            });
            if (actorOwn && water) {
              expect(game.state.decision?.kind).toBe("announce-triggered-ability");
              const before = game.state;
              expect(() =>
                answerDecision(game, "announce-triggered-ability", {
                  targets: { "target-player": [p.card(champion).objectId] },
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
              answerDecision(game, "announce-triggered-ability", {
                targets: { "target-player": [target.id] },
              });
            }
            passEffectsStack(game);
            expect(target.zone("graveyard").map((c) => c.objectId)).toEqual(
              actorOwn && water ? top : [],
            );
            expect(other.zone("graveyard")).toHaveLength(0);
            expect(game.state.objects[source.objectId]!.zone).toBe("field");
          });
});
