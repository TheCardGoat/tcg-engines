import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { orbOfChokingFumes } from "./orb-of-choking-fumes.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { favorableWinds } from "../actions/favorable-winds.ts";
import {
  createClassBonusTestChampion,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers llQe0cg4xJ-a1 */
describe("Orb of Choking Fumes' opponent-only turn tax", () => {
  for (const classBonus of [false, true])
    it(`taxes every opposing activation this turn, class=${classBonus}`, () => {
      const base = createClassBonusTestChampion(
          orbOfChokingFumes,
          classBonus,
          "activation-discount",
        ),
        champion = {
          ...base,
          layout: {
            kind: "single-faced" as const,
            face: { ...requireSingleFace(base), elements: ["WIND" as const] },
          },
        };
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [orbOfChokingFumes],
            hand: [favorableWinds, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: [
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
              favorableWinds,
              favorableWinds,
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      q.pass();
      p.activateAbility(orbOfChokingFumes, "llQe0cg4xJ-a1");
      expect(p.cards(orbOfChokingFumes, { zone: "banishment" })).toHaveLength(1);
      passEffectsStack(game);
      expect(p.cards(woodlandSquirrels, { zone: "hand" })).toHaveLength(classBonus ? 2 : 1);
      for (let index = 0; index < 2; index++) {
        const ally = q.cards(woodlandSquirrels, { zone: "hand" })[0]!,
          before = game.state;
        expect(() => q.activate(ally)).toThrow();
        expect(game.state).toEqual(before);
        q.activate(ally, {
          reservePayment: [
            { kind: "card", cardId: q.cards(favorableWinds, { zone: "hand" })[0]!.objectId },
          ],
        });
        passEffectsStack(game);
        expect(q.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(index + 1);
      }
      q.pass();
      p.activate(favorableWinds, {
        reservePayment: [
          { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
        ],
      });
      passEffectsStack(game);
      expect(p.cards(favorableWinds, { zone: "graveyard" })).toHaveLength(1);
      advanceToMain(game, p.id);
      advanceToMain(game, q.id);
      q.activate(q.cards(woodlandSquirrels, { zone: "hand" })[0]!);
      passEffectsStack(game);
      expect(q.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(3);
    });
});
