import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { healingAura } from "../phantasias/healing-aura.ts";
import { organizeTheAlliance } from "./organize-the-alliance.ts";

/** @covers ch2bbmoqk2-a2 */
describe("Organize the Alliance — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: organizeTheAlliance });
});

/** @covers ch2bbmoqk2-a1 */
describe("Organize the Alliance — foster target ally", () => {
  for (const owner of ["player-one", "player-two"] as const) {
    it(`fosters the selected ${owner} ally only on resolution`, () => {
      const champion = createClassBonusTestChampion(
        organizeTheAlliance,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [woodlandSquirrels, healingAura],
            hand: [organizeTheAlliance, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { field: [woodlandSquirrels], "main-deck": [woodlandSquirrels] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const action = player.card(organizeTheAlliance, { zone: "hand" });
      const ownAlly = player.card(woodlandSquirrels, { zone: "field" });
      const opposingAlly = opponent.card(woodlandSquirrels, { zone: "field" });
      const target = owner === "player-one" ? ownAlly : opposingAlly;
      const other = owner === "player-one" ? opposingAlly : ownAlly;
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 3)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));

      for (const invalidTargets of [
        [],
        [player.card(champion).objectId],
        [player.card(healingAura).objectId],
        [player.cards(woodlandSquirrels, { zone: "hand" })[3]!.objectId],
        [ownAlly.objectId, opposingAlly.objectId],
      ]) {
        const before = game.state;
        expect(() =>
          player.activate(action, {
            reservePayment: payment,
            targets: { "target-1": invalidTargets },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      const before = game.state;
      expect(() =>
        player.activate(action, {
          reservePayment: payment.slice(0, 2),
          targets: { "target-1": [target.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);

      player.activate(action, {
        reservePayment: payment,
        targets: { "target-1": [target.objectId] },
      });
      expect(player.zone("memory")).toHaveLength(3);
      expect(game.state.objects[target.objectId]!.states.has("fostered")).toBe(false);
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.states.has("fostered")).toBe(true);
      expect(game.state.objects[other.objectId]!.states.has("fostered")).toBe(false);
    });
  }
});
