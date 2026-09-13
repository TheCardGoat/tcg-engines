import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";

import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { relentlessHexchaser } from "./relentless-hexchaser.ts";
import { proveDistantEntry } from "../../../testing/distant-entry.ts";

/** @covers por7ch2bbm-a2 */
describe("Relentless Hexchaser — distant entry condition", () => {
  proveDistantEntry(relentlessHexchaser, "become-distant");
});

/** @covers por7ch2bbm-a1 */
describe("relentless-hexchaser — Ranged", () => {
  proveRangedAlly({ card: relentlessHexchaser, power: 2, ranged: 2, classBonus: false });
});

/** @covers por7ch2bbm-a3 */
describe("Relentless Hexchaser — Element Bonus graveyard return", () => {
  for (const zone of ["hand", "field", "banishment"] as const) {
    it(`rejects a return activation from ${zone} without spending reserve`, () => {
      const champion = createClassBonusTestChampion(
        relentlessHexchaser,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              woodlandSquirrels,
              woodlandSquirrels,
              ...(zone === "hand" ? [relentlessHexchaser] : []),
            ],
            ...(zone !== "hand" ? { [zone]: [relentlessHexchaser] } : {}),
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const before = game.state;
      expect(() =>
        player.activateAbility(relentlessHexchaser, "por7ch2bbm-a3", {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    });
  }
  for (const elementBonus of [false, true]) {
    it(`returns from the graveyard rested only with Element Bonus ${elementBonus}`, () => {
      const base = createClassBonusTestChampion(relentlessHexchaser, false, "activation-discount");
      if (base.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
      const champion = {
        ...base,
        layout: {
          kind: "single-faced" as const,
          face: {
            ...base.layout.face,
            elements: elementBonus ? (["UMBRA"] as const) : (["NORM"] as const),
          },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { graveyard: [relentlessHexchaser], hand: [woodlandSquirrels, woodlandSquirrels] },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const card = player.card(relentlessHexchaser, { zone: "graveyard" });
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      const before = game.state;
      expect(() =>
        player.activateAbility(card, "por7ch2bbm-a3", { reservePayment: payment.slice(0, 1) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      if (!elementBonus) {
        expect(() =>
          player.activateAbility(card, "por7ch2bbm-a3", { reservePayment: payment }),
        ).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      player.activateAbility(card, "por7ch2bbm-a3", { reservePayment: payment });
      expect(player.zone("hand")).toHaveLength(0);
      expect(player.zone("memory")).toHaveLength(2);
      expect(game.state.objects[card.objectId]!.zone).toBe("graveyard");
      player.pass();
      game.player("player-two").pass();
      expect(game.state.objects[card.objectId]!.zone).toBe("field");
      expect(game.state.objects[card.objectId]!.states.has("rested")).toBe(true);
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "por7ch2bbm-a2",
        ),
      ).toBe(true);
      passEffectsStack(game);
      expect(() => player.declareAttack(card, game.player("player-two").card(champion))).toThrow();
    });
  }
});
