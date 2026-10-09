import { describe, expect, it } from "vitest";
import { pantheonBarrier } from "./pantheon-barrier.ts";
import { greaterBoonOfProxia } from "../../PRD/boons/greater-boon-of-proxia.ts";
import { pantheonStartFixture } from "../../../testing/pantheon-start-fixture.ts";
import { advanceToMain } from "../../../testing/decisions.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "@tcg/grand-archive-engine/runtime";

/** @covers WyNvyDHFdB-a1 */
describe("Pantheon Barrier — one starting token for each player", () => {
  for (const four of [false, true])
    for (const first of ["player-one", "player-two"]) {
      it(`summons all barriers with the Spirits, once: four=${four}, first=${first}`, () => {
        const { game, champion } = pantheonStartFixture(four, first);
        for (const id of game.state.turnOrder) {
          for (const owner of game.state.turnOrder)
            expect(game.player(owner).cards(pantheonBarrier)).toHaveLength(0);
          const player = game.player(id);
          player.execute({
            move: "bestow-boon",
            cardId: player.card(greaterBoonOfProxia).objectId,
          });
          player.execute({ move: "complete-pregame-actions" });
        }
        expect(game.state.status).toBe("playing");
        const restored = restoreGrandArchiveMatchSnapshot(
          game.program,
          JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(game.state))),
        );
        for (const state of [game.state, restored]) {
          const barriers = Object.values(state.objects).filter(
            (object) => object.definitionId === pantheonBarrier.canonicalId,
          );
          expect(barriers).toHaveLength(four ? 4 : 3);
          for (const id of state.turnOrder) {
            const own = barriers.filter((object) => object.controllerId === id);
            expect(own).toHaveLength(1);
            expect(own[0]).toMatchObject({
              ownerId: id,
              zone: "field",
              isToken: true,
              facing: "face-up",
              damage: 0,
            });
            expect(own[0]!.counters.durability).toBe(6);
            expect(own[0]!.states.has("rested")).toBe(false);
            expect(game.player(id).cards(champion, { zone: "field" })).toHaveLength(1);
          }
        }
        const ids = game.state.turnOrder.map(
          (id) => game.player(id).card(pantheonBarrier).objectId,
        );
        advanceToMain(game, game.state.turnOrder[0]!, game.state.turn.number);
        expect(
          game.state.turnOrder.map((id) => game.player(id).card(pantheonBarrier).objectId),
        ).toEqual(ids);
      });
    }
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { soothingDisillusion } from "../../AMB/actions/soothing-disillusion.ts";
import { cardiacVessel } from "../../PRD/phantasias/cardiac-vessel.ts";

/** @covers WyNvyDHFdB-a3 */
describe("Pantheon Barrier — isolated field damage protection", () => {
  for (const damage of [1, 3, 6, 8])
    for (const own of [false, true])
      for (const ally of [false, true]) {
        it(`redirects all damage without overflow until destroyed: damage=${damage}, own=${own}, ally=${ally}`, () => {
          const champion = enableAllTestElements(
            grantTestChampionLevel(
              createClassBonusTestChampion(fireball, false, "activation-discount"),
              damage - 1,
            ),
          );
          const hits = Math.ceil(6 / damage);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [pantheonBarrier, giantTortoise],
                hand: [
                  ...Array.from({ length: hits + 1 }, () => fireball),
                  ...Array.from({ length: 4 * (hits + 1) }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [pantheonBarrier, giantTortoise],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            controller = own ? p : q;
          const barrier = controller.card(pantheonBarrier),
            otherBarrier = (own ? q : p).card(pantheonBarrier);
          const target = ally ? controller.card(giantTortoise) : controller.card(champion);
          expect(game.state.objects[barrier.objectId]!.counters.durability).toBe(6);
          for (let n = 0; n <= hits; n++) {
            const source = p.cards(fireball, { zone: "hand" })[0]!;
            p.activate(source, {
              targets: { "target-1": [target.objectId] },
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 4)
                .map((c) => ({ kind: "card", cardId: c.objectId })),
            });
            passEffectsStack(game);
            const events = game.state.eventHistory.filter(
              (event) => event.type === "damage-marked" && event.sourceId === source.objectId,
            );
            expect(events).toHaveLength(1);
            expect(events[0]).toMatchObject({
              objectId: n < hits ? barrier.objectId : target.objectId,
              amount: damage,
            });
            if (n < hits) expect(game.state.objects[target.objectId]!.damage).toBe(0);
            if (n + 1 < hits)
              expect(game.state.objects[barrier.objectId]!.counters.durability).toBe(
                6 - damage * (n + 1),
              );
            else expect(game.state.objects[barrier.objectId]).toBeUndefined();
            expect(game.state.objects[otherBarrier.objectId]!.counters.durability).toBe(6);
            if (n === 0 && hits > 1) {
              advanceToMain(game, p.id, game.state.turn.number);
              expect(game.state.objects[barrier.objectId]!.counters.durability).toBe(6 - damage);
            }
          }
          expect(game.state.winnerIds).toEqual([]);
        });
      }
});

/** @covers WyNvyDHFdB-a2 */
describe("Pantheon Barrier — Omnishroud", () => {
  for (const own of [false, true]) {
    it(`rejects a legal Phantasia destruction spell from ${own ? "its controller" : "an opponent"}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(soothingDisillusion, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [pantheonBarrier, cardiacVessel],
            hand: [soothingDisillusion, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [pantheonBarrier, cardiacVessel] } },
      });
      const p = game.player("player-one"),
        controller = own ? p : game.player("player-two");
      const barrier = controller.card(pantheonBarrier),
        unprotected = controller.card(cardiacVessel);
      const payment = p
        .cards(woodlandSquirrels)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() =>
        p.activate(soothingDisillusion, {
          modeIds: ["mode-1"],
          targets: { "target-1": [barrier.objectId] },
          reservePayment: payment,
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(soothingDisillusion, {
        modeIds: ["mode-1"],
        targets: { "target-1": [unprotected.objectId] },
        reservePayment: payment,
      });
      passEffectsStack(game);
      expect(game.state.objects[unprotected.objectId]!.zone).toBe("graveyard");
      expect(game.state.objects[barrier.objectId]!.zone).toBe("field");
      expect(game.state.objects[barrier.objectId]!.counters.durability).toBe(6);
    });
  }
});
