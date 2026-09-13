import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { ravagingTempest } from "./ravaging-tempest.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers WsunZX4IlW-a2 */
describe("Ravaging Tempest's global banishment and controller draws", () => {
  for (const ownCount of [0, 2])
    for (const opposingCount of [0, 3])
      it(`${ownCount} own and ${opposingCount} opposing allies`, () => {
        const champion = createClassBonusTestChampion(
          ravagingTempest,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [ravagingTempest, ...Array.from({ length: 8 }, () => woodlandSquirrels)],
              field: [trainingSword, ...Array.from({ length: ownCount }, () => giantTortoise)],
              graveyard: [giantTortoise],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [trainingSword, ...Array.from({ length: opposingCount }, () => giantTortoise)],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          own = p.cards(giantTortoise, { zone: "field" }),
          foes = q.cards(giantTortoise, { zone: "field" });
        p.activate(ravagingTempest, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        expect(p.zone("hand")).toHaveLength(ownCount);
        expect(q.zone("hand")).toHaveLength(opposingCount);
        expect(
          p
            .zone("banishment")
            .map((c) => c.objectId)
            .sort(),
        ).toEqual(own.map((c) => c.objectId).sort());
        expect(
          q
            .zone("banishment")
            .map((c) => c.objectId)
            .sort(),
        ).toEqual(foes.map((c) => c.objectId).sort());
        expect(p.cards(giantTortoise, { zone: "graveyard" })).toHaveLength(1);
        for (const player of [p, q]) {
          expect(player.cards(trainingSword, { zone: "field" })).toHaveLength(1);
          expect(player.cards(champion, { zone: "field" })).toHaveLength(1);
        }
      });
});
