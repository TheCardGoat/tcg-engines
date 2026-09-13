import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { focalIntensity } from "../../RDO/actions/focal-intensity.ts";
import { ordinaryHorse } from "./ordinary-horse.ts";
import { ripplebackTerrapin } from "./rippleback-terrapin.ts";

/** @covers srkomr8ght-a1 */
describe("Rippleback Terrapin — Class Bonus Spellshroud", () => {
  for (const classBonus of [false, true]) {
    it(`${classBonus ? "blocks" : "allows"} a Spell targeting the terrapin`, () => {
      const champion = createClassBonusTestChampion(
        ripplebackTerrapin,
        classBonus,
        "activation-discount",
      );
      const casterBase = createClassBonusTestChampion(focalIntensity, true, "activation-discount");
      if (casterBase.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
      const casterChampion = {
        ...casterBase,
        layout: {
          kind: "single-faced" as const,
          face: {
            ...casterBase.layout.face,
            elements: ["NORM", "FIRE", "WATER", "WIND"] as const,
          },
        },
      };
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: { field: [ripplebackTerrapin] },
        },
        playerTwo: {
          champion: casterChampion,
          zones: { hand: [focalIntensity, woodlandSquirrels] },
        },
      });
      const caster = game.player("player-two");
      const target = game.player("player-one").card(ripplebackTerrapin, { zone: "field" });
      const payment = {
        reservePayment: [
          {
            kind: "card" as const,
            cardId: caster.card(woodlandSquirrels, { zone: "hand" }).objectId,
          },
        ],
        targets: { "target-1": [target.objectId] },
      };
      if (classBonus) {
        const before = game.state;
        expect(() => caster.activate(focalIntensity, payment)).toThrow(/target/i);
        expect(game.state).toEqual(before);
      } else {
        caster.activate(focalIntensity, payment);
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(1);
      }
    });
  }
});

/** @covers srkomr8ght-a2 */
describe("Rippleback Terrapin — On Enter banish floating memory", () => {
  for (const accept of [false, true]) {
    it(`${accept ? "buffs and draws" : "does nothing"} when the optional banish is ${accept ? "accepted" : "declined"}`, () => {
      const champion = createClassBonusTestChampion(
        ripplebackTerrapin,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [ripplebackTerrapin, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
            graveyard: [ordinaryHorse],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const deck = player.zone("main-deck");
      const floating = player.card(ordinaryHorse, { zone: "graveyard" });
      player.activate(ripplebackTerrapin, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      player.pass();
      opponent.pass();
      passEffectsStack(game);
      answerDecision(game, "resolve-optional-effect", accept);
      if (accept) {
        if (game.state.decision?.kind === "resolve-effect-choice") {
          answerDecision(game, "resolve-effect-choice", [floating.objectId]);
        }
        passEffectsStack(game);
        expect(game.state.objects[floating.objectId]!.zone).toBe("banishment");
      } else passEffectsStack(game);
      const ally = player.card(ripplebackTerrapin, { zone: "field" });
      expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(accept ? 1 : 0);
      expect(player.zone("hand")).toEqual(accept ? deck.slice(0, 1) : []);
      expect(player.zone("main-deck")).toEqual(accept ? deck.slice(1) : deck);
    });
  }
});
