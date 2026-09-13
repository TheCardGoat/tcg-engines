import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { focalIntensity } from "../../RDO/actions/focal-intensity.ts";
import { gustguardBastion } from "./gustguard-bastion.ts";

/** @covers uPn9SZdqrr-a1 */
describe("Gustguard Bastion — Class Bonus Fast Activation", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "permits" : "rejects"} activation onto a non-empty Effects Stack`, () => {
      const champion = createClassBonusTestChampion(
        gustguardBastion,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              woodlandSquirrels,
              gustguardBastion,
              ...Array.from({ length: 3 }, () => woodlandSquirrels),
            ],
            field: [woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      player.activate(player.cards(woodlandSquirrels, { zone: "hand" })[0]!);
      expect(game.state.stack).toHaveLength(1);
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 3)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      if (classBonus) {
        player.activate(gustguardBastion, {
          reservePayment: payment,
        });
        expect(game.state.stack).toHaveLength(2);
      } else {
        const before = game.state;
        expect(() => player.activate(gustguardBastion, { reservePayment: payment })).toThrow(
          /Slow cards require the turn player's empty-stack Main phase/,
        );
        expect(game.state).toEqual(before);
      }
    });
  }
});

/** @covers uPn9SZdqrr-a2 */
describe("Gustguard Bastion — Class Bonus On Enter prevention", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "prevents" : "does not prevent"} the next 2 damage to another unit`, () => {
      const base = createClassBonusTestChampion(
        gustguardBastion,
        classBonus,
        "activation-discount",
      );
      if (base.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
      const champion = {
        ...base,
        layout: {
          kind: "single-faced" as const,
          face: {
            ...base.layout.face,
            elements: ["NORM", "FIRE", "WATER", "WIND"] as const,
          },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              gustguardBastion,
              focalIntensity,
              ...Array.from({ length: 4 }, () => woodlandSquirrels),
            ],
            field: [woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [automatedGardener] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const protectedAlly = player.card(woodlandSquirrels, { zone: "field" });
      player.activate(gustguardBastion, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 3)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      player.pass();
      opponent.pass();
      passEffectsStack(game);
      if (classBonus) {
        expect(game.state.decision?.kind).toBe("announce-triggered-ability");
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": [protectedAlly.objectId] },
        });
      } else {
        expect(game.state.decision).toBeNull();
      }
      passEffectsStack(game);
      player.activate(focalIntensity, {
        reservePayment: [
          { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
        targets: { "target-1": [protectedAlly.objectId] },
      });
      passEffectsStack(game);
      if (classBonus) {
        expect(game.state.objects[protectedAlly.objectId]!.zone).toBe("field");
        expect(game.state.objects[protectedAlly.objectId]!.damage).toBe(0);
      } else {
        expect(game.state.objects[protectedAlly.objectId]!.zone).toBe("graveyard");
      }
    });
  }
});
