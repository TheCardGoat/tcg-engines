import { describe } from "vitest";
import type { GrandArchiveObjectId } from "@tcg/grand-archive-engine/runtime";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { nimbleLongbowman } from "./nimble-longbowman.ts";

/** @covers tMy4zMpqcH-a1 */
describe("Nimble Longbowman — printed keywords", () => {
  proveKeywordGroup({
    card: nimbleLongbowman,
    keywords: [
      {
        name: "fast-activation",
      },
      {
        name: "ranged",
        value: 1,
      },
    ],
  });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers tMy4zMpqcH-a2 */
/** @covers tMy4zMpqcH-a3 */
describe("Nimble Longbowman — entry and champion distance", () => {
  for (const matching of [false, true])
    for (const opposing of [false, true]) {
      it(`class=${matching}, activate on opposing turn=${opposing}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(nimbleLongbowman, matching, "activation-discount"),
        );
        const deck = Array.from({ length: 8 }, () => woodlandSquirrels);
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: opposing ? "playerTwo" : "playerOne",
          playerOne: {
            champion,
            zones: {
              hand: [nimbleLongbowman, woodlandSquirrels, woodlandSquirrels],
              "main-deck": deck,
            },
          },
          playerTwo: { champion, zones: { field: [woodlandSquirrels], "main-deck": deck } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(nimbleLongbowman),
          hero = p.card(champion),
          foe = q.card(champion);
        const distant = (id: GrandArchiveObjectId) => game.state.objects[id]!.states.has("distant");
        if (opposing) q.pass();
        p.activate(source, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        });
        p.pass();
        q.pass();
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(distant(source.objectId)).toBe(matching);
        expect(distant(hero.objectId)).toBe(false);
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "tMy4zMpqcH-a3",
          ),
        ).toBe(true);
        passEffectsStack(game);
        expect(distant(hero.objectId)).toBe(true);
        expect(distant(foe.objectId)).toBe(false);
        if (opposing) {
          advanceToMain(game, p.id, game.state.turn.number);
          expect(distant(hero.objectId)).toBe(true);
          expect(distant(source.objectId)).toBe(matching);
        }
        advanceToMain(game, q.id, game.state.turn.number);
        expect(distant(source.objectId)).toBe(false);
        expect(distant(hero.objectId)).toBe(false);
        expect(game.state.stack).toHaveLength(0);
      });
    }
});
