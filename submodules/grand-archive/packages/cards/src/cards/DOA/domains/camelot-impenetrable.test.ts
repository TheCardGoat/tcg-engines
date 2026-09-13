import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { camelotImpenetrable as domain } from "./camelot-impenetrable.ts";
/** @covers R9UFbI4Fsh-a1 */
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

import { windriderMage } from "../allies/windrider-mage.ts";
/** @covers R9UFbI4Fsh-a2 */
describe("Camelot optionally trades only its controller's wind activation for temporary ally suppression", () => {
  for (const actorOwn of [false, true])
    for (const wind of [false, true])
      for (const accept of [false, true])
        for (const ownAlly of [false, true])
          it(`actor=${actorOwn},wind=${wind},accept=${accept},ally=${ownAlly}`, () => {
            const champion = createClassBonusTestChampion(domain, false, "activation-discount"),
              activated = wind ? windriderMage : woodlandSquirrels;
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: actorOwn ? "playerOne" : "playerTwo",
              playerOne: {
                champion,
                zones: {
                  field: [domain, giantTortoise],
                  hand: [activated, woodlandSquirrels, woodlandSquirrels],
                  "main-deck": [woodlandSquirrels],
                },
              },
              playerTwo: {
                champion,
                zones: {
                  field: [giantTortoise],
                  hand: [activated, woodlandSquirrels, woodlandSquirrels],
                  "main-deck": [woodlandSquirrels],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              actor = actorOwn ? p : q,
              owner = ownAlly ? p : q,
              ally = owner.card(giantTortoise),
              source = actor.cards(activated, { zone: "hand" })[0]!;
            actor.activate(source, {
              reservePayment: wind
                ? actor
                    .cards(woodlandSquirrels, { zone: "hand" })
                    .map((c) => ({ kind: "card" as const, cardId: c.objectId }))
                : [],
            });
            passEffectsStack(game);
            if (actorOwn && wind) {
              expect(game.state.decision?.kind).toBe("resolve-optional-effect");
              answerDecision(game, "resolve-optional-effect", accept);
              if (accept) {
                const before = game.state;
                expect(() =>
                  answerDecision(game, "resolve-effect-choice", [p.card(champion).objectId]),
                ).toThrow();
                expect(game.state).toEqual(before);
                answerDecision(game, "resolve-effect-choice", [ally.objectId]);
              }
              passEffectsStack(game);
            }
            const suppressed = actorOwn && wind && accept;
            expect(game.state.objects[source.objectId]!.zone).toBe(
              suppressed ? "graveyard" : "field",
            );
            expect(game.state.objects[ally.objectId]!.zone).toBe(
              suppressed ? "banishment" : "field",
            );
            expect(actor.zone("memory")).toHaveLength(wind ? 2 : 0);
            if (suppressed) {
              advanceToMain(game, q.id, -1, true);
              expect(game.state.objects[ally.objectId]!.zone).toBe("field");
              expect(game.state.objects[ally.objectId]!.controllerId).toBe(owner.id);
            }
          });
});
