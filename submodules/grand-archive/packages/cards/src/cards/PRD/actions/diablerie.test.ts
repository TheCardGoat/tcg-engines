import { describe } from "vitest";
import { diablerie } from "./diablerie.ts";

import { proveLineageFloatingMemory } from "../../../testing/lineage-floating-memory.ts";
/** @covers 0plqbtjuxz-a2 */
describe("Vanitas Bonus Floating Memory", () => proveLineageFloatingMemory(diablerie, "Vanitas"));

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { grandCrusadersRing } from "../../DOA/items/grand-crusaders-ring.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 0plqbtjuxz-a1 */
describe("Diablerie — Divine Relic entry replacement", () => {
  for (const bonus of [false, true])
    for (const own of [false, true])
      for (const relic of [false, true])
        it(`replaces only Divine Relic entry: bonus=${bonus}, own=${own}, relic=${relic}`, () => {
          const material = relic ? grandCrusadersRing : trainingSword;
          const champion = createLineageTestChampion(diablerie, bonus ? "Vanitas" : "Other");
          const game = GrandArchiveTestEngine.startFixture({
            phase: "materialize",
            firstPlayer: own ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                hand: [diablerie, woodlandSquirrels, woodlandSquirrels],
                "material-deck": own ? [material] : [],
                "main-deck": [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { "material-deck": own ? [] : [material], "main-deck": [woodlandSquirrels] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            owner = own ? p : q;
          const entering = owner.card(material);
          owner.materialize(entering);
          if (!own) q.pass();
          p.activate(diablerie, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
          });
          passEffectsStack(game);
          expect(game.state.objects[entering.objectId]).toMatchObject({
            zone: "field",
            ownerId: owner.id,
            controllerId: relic ? p.id : owner.id,
          });
          expect(
            game.state.eventHistory.filter((event) => event.type === "replacement-effect-consumed"),
          ).toHaveLength(relic ? 1 : 0);
          expect(p.cards(diablerie, { zone: "graveyard" })).toHaveLength(1);
          expect(p.zone("memory")).toHaveLength(2);
          if (relic) {
            // The new controller, rather than its owner, can use the stolen relic.
            const before = game.state;
            if (!own) {
              expect(() =>
                q.execute({
                  move: "activate-ability",
                  sourceId: entering.objectId,
                  abilityId: "2gv7DC0KID-a2",
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            const wait = game.waitState();
            if (wait.kind === "opportunity" && wait.playerId !== p.id)
              game.player(wait.playerId).pass();
            p.execute({
              move: "activate-ability",
              sourceId: entering.objectId,
              abilityId: "2gv7DC0KID-a2",
            });
            passEffectsStack(game);
            expect(p.zone("hand")).toHaveLength(1);
            expect(owner.zone("banishment")).toContainEqual(entering);
          }
        });
});

import { beseechTheWinds } from "../../DOA/actions/beseech-the-winds.ts";
import { answerDecision } from "../../../testing/decisions.ts";

/** @covers 0plqbtjuxz-a1 */
describe("Diablerie — replacement lifetime", () => {
  for (const expired of [false, true])
    it(`ignores ordinary entry and ${expired ? "expires before the next turn" : "remains ready for a Divine Relic"}`, () => {
      const champion = createLineageTestChampion(diablerie, "Other");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            hand: [diablerie, woodlandSquirrels, woodlandSquirrels],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: [
              beseechTheWinds,
              beseechTheWinds,
              ...Array.from({ length: 6 }, () => woodlandSquirrels),
            ],
            "material-deck": [trainingSword, grandCrusadersRing],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const sword = q.card(trainingSword),
        ring = q.card(grandCrusadersRing);
      q.pass();
      p.activate(diablerie, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      passEffectsStack(game);
      function summon(ref: typeof sword) {
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId !== q.id)
          game.player(wait.playerId).pass();
        q.activate(q.cards(beseechTheWinds, { zone: "hand" })[0]!, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        });
        passEffectsStack(game);
        answerDecision(game, "resolve-effect-choice", [ref.objectId]);
        answerDecision(game, "announce-effect-materialization", {});
        passEffectsStack(game);
      }
      summon(sword);
      expect(game.state.objects[sword.objectId]).toMatchObject({
        zone: "field",
        controllerId: q.id,
      });
      if (expired) {
        const turn = game.state.turn.number;
        let reached = false;
        for (let i = 0; i < 128; i++) {
          const wait = game.waitState();
          if (
            wait.kind === "materialization-choice" &&
            wait.playerId === q.id &&
            game.state.turn.number > turn
          ) {
            reached = true;
            break;
          }
          if (wait.kind === "materialization-choice")
            game.player(wait.playerId).execute({ move: "skip-materialization" });
          else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
          else throw new Error(`Unexpected ${wait.kind}`);
        }
        expect(reached).toBe(true);
        q.materialize(ring);
        passEffectsStack(game);
      } else summon(ring);
      expect(game.state.objects[ring.objectId]).toMatchObject({
        zone: "field",
        ownerId: q.id,
        controllerId: expired ? q.id : p.id,
      });
    });
});
