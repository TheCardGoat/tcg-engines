import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { theConstellatorySpire } from "../domains/the-constellatory-spire.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { seekersRifle } from "../weapons/seekers-rifle.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { meltdown } from "./meltdown.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";

/** @covers ht2tsn0ye3-a1 */
describe("Meltdown — Level 2+ activation discount", () => {
  for (const level of [1, 2, 3]) {
    it(`requires exactly ${level >= 2 ? 3 : 4} reserve at level ${level}`, () => {
      const champion = createClassBonusTestChampion(meltdown, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          lineage: Array.from({ length: level }, (_, index) => {
            const raised = lineageTestChampion("Test Champion", index + 1);
            if (raised.layout.kind !== "single-faced")
              throw new Error("Expected single-faced fixture champion");
            return {
              ...raised,
              layout: {
                kind: "single-faced" as const,
                face: { ...raised.layout.face, elements: ["FIRE"] as const },
              },
            };
          }),
          zones: { hand: [meltdown, ...Array.from({ length: 4 }, () => woodlandSquirrels)] },
        },
        playerTwo: { champion, zones: { field: [potionOfHealing] } },
      });
      const player = game.player("player-one");
      const target = game.player("player-two").card(potionOfHealing, { zone: "field" });
      const amount = level >= 2 ? 3 : 4;
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      const before = game.state;
      expect(() =>
        player.activate(meltdown, {
          targets: { "target-1": [target.objectId] },
          reservePayment: payment.slice(0, amount - 1),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(meltdown, {
        targets: { "target-1": [target.objectId] },
        reservePayment: payment.slice(0, amount),
      });
      expect(player.zone("memory")).toHaveLength(amount);
      expect(player.zone("hand")).toHaveLength(4 - amount);
      expect(game.state.objects[target.objectId]?.zone).toBe("field");
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]?.zone).toBe("graveyard");
    });
  }
});

/** @covers ht2tsn0ye3-a2 */
describe("Meltdown — destroy a Domain, Item, or Weapon", () => {
  for (const targetCard of [
    theConstellatorySpire,
    potionOfHealing,
    seekersRifle,
    woodlandSquirrels,
  ]) {
    it(`handles ${targetCard.slug} with targets checked before payment and destruction on resolution`, () => {
      const champion = createClassBonusTestChampion(meltdown, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { hand: [meltdown, ...Array.from({ length: 4 }, () => woodlandSquirrels)] },
        },
        playerTwo: { champion, zones: { field: [targetCard] } },
      });
      const player = game.player("player-one");
      const target = game.player("player-two").card(targetCard, { zone: "field" });
      const activate = () =>
        player.activate(meltdown, {
          targets: { "target-1": [target.objectId] },
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
      if (targetCard === woodlandSquirrels) {
        const before = game.state;
        expect(activate).toThrow();
        expect(game.state).toEqual(before);
      } else {
        activate();
        expect(game.state.objects[target.objectId]?.zone).toBe("field");
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]?.zone).toBe(
          targetCard === seekersRifle ? "banishment" : "graveyard",
        );
      }
    });
  }
});
