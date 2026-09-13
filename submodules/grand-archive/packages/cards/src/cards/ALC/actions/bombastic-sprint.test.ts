import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { bombasticSprint } from "./bombastic-sprint.ts";
import { strategicWarfare } from "./strategic-warfare.ts";
import { streamOfConsciousness } from "./stream-of-consciousness.ts";

function champion(polkhawk: boolean) {
  const base = lineageTestChampion(polkhawk ? "Polkhawk" : "Other", 0);
  if (base.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
  return {
    ...base,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...base.layout.face,
        elements: ["NORM", "FIRE", "WATER"] as const,
      },
    },
  };
}

/** @covers t4owmcva0f-a1 */
/** @covers t4owmcva0f-a2 */
describe("Bombastic Sprint — distant champion and next Ranger fast activation", () => {
  for (const polkhawkBonus of [false, true]) {
    it(`Polkhawk Bonus=${polkhawkBonus}`, () => {
      const testChampion = champion(polkhawkBonus);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: testChampion,
          zones: {
            hand: [
              bombasticSprint,
              streamOfConsciousness,
              strategicWarfare,
              strategicWarfare,
              ...Array.from({ length: 8 }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: { champion: champion(false) },
      });
      const player = game.player("player-one");
      const sourceChampion = player.card(testChampion, { zone: "field" });
      const payments = player.cards(woodlandSquirrels, { zone: "hand" });
      const [firstRanger, secondRanger] = player.cards(strategicWarfare, { zone: "hand" });
      player.activate(bombasticSprint, {
        reservePayment: payments
          .slice(0, 2)
          .map((card) => ({ kind: "card", cardId: card.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.objects[sourceChampion.objectId]!.states.has("distant")).toBe(true);

      // An unrelated fast non-Ranger action must not consume the permission.
      player.activate(streamOfConsciousness, {
        reservePayment: payments
          .slice(2, 4)
          .map((card) => ({ kind: "card", cardId: card.objectId })),
      });
      const firstRangerOptions = {
        reservePayment: payments
          .slice(4, 6)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      };
      if (!polkhawkBonus) {
        const before = game.state;
        expect(() => player.activate(firstRanger!, firstRangerOptions)).toThrow();
        expect(game.state).toEqual(before);
        return;
      }

      player.activate(firstRanger!, firstRangerOptions);
      const beforeSecond = game.state;
      expect(() =>
        player.activate(secondRanger!, {
          reservePayment: payments
            .slice(6, 8)
            .map((card) => ({ kind: "card", cardId: card.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(beforeSecond);
      passEffectsStack(game);
    });
  }
});
