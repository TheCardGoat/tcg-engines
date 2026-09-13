import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";
import { haloclineScout } from "./halocline-scout.ts";

/** @covers jntoa4h8re-a1 */
describe("Halocline Scout — Class Bonus On Enter rest", () => {
  for (const classBonus of [false, true]) {
    it(`Class Bonus=${classBonus}`, () => {
      const champion = createClassBonusTestChampion(
        haloclineScout,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [haloclineScout, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            field: [potionOfHealing],
          },
        },
        playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      player.activate(haloclineScout, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      player.pass();
      opponent.pass();
      const unit = opponent.card(woodlandSquirrels, { zone: "field" });
      if (!classBonus) {
        passEffectsStack(game);
        expect(game.state.objects[unit.objectId]!.states.has("rested")).toBe(false);
        return;
      }
      expect(
        game.state.decision?.kind === "announce-triggered-ability" ||
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "jntoa4h8re-a1",
          ),
      ).toBe(true);
      const before = game.state;
      expect(() =>
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": [player.card(potionOfHealing, { zone: "field" }).objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      expect(game.state.objects[unit.objectId]!.states.has("rested")).toBe(false);
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [unit.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[unit.objectId]!.states.has("rested")).toBe(true);
    });
  }
});

/** @covers jntoa4h8re-a2 */
describe("Halocline Scout — other allies attacking rested units", () => {
  for (const rested of [false, true]) {
    it(`other allies deal ${rested ? 2 : 1} while attacking a ${rested ? "rested" : "awake"} unit`, () => {
      const champion = createClassBonusTestChampion(haloclineScout, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [haloclineScout, woodlandSquirrels],
            hand: [glacialGuidance, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [giantTortoise] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const tortoise = opponent.card(giantTortoise, { zone: "field" });
      if (rested) {
        player.activate(glacialGuidance, {
          targets: { "target-1": [tortoise.objectId] },
          reservePayment: [
            { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
          ],
        });
        passEffectsStack(game);
        expect(game.state.objects[tortoise.objectId]!.states.has("rested")).toBe(true);
      }
      player.declareAttack(woodlandSquirrels, tortoise);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[tortoise.objectId]!.damage).toBe(rested ? 2 : 1);
      const wait = game.waitState();
      if (wait.kind === "opportunity" && wait.playerId !== player.id)
        game.player(wait.playerId).pass();
      player.declareAttack(haloclineScout, tortoise);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[tortoise.objectId]!.damage).toBe((rested ? 2 : 1) + 1);
    });
  }
});
