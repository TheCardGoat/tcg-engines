import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { seekersRifle } from "../weapons/seekers-rifle.ts";
import { studyTheFables } from "./study-the-fables.ts";

/** @covers 0ye3aebjvw-a1 */
describe("Study the Fables — reveal a player's material cards", () => {
  for (const targetPlayer of ["player-one", "player-two"] as const) {
    it(`has ${targetPlayer} choose six of their material cards, then draws into the controller's memory`, () => {
      const champion = createClassBonusTestChampion(studyTheFables, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [studyTheFables, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [potionOfHealing, woodlandSquirrels],
            "material-deck": Array.from({ length: 7 }, () => seekersRifle),
          },
        },
        playerTwo: {
          champion,
          zones: {
            "main-deck": [woodlandSquirrels],
            "material-deck": Array.from({ length: 7 }, () => seekersRifle),
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const targeted = game.player(targetPlayer);
      const untargeted = targetPlayer === "player-one" ? opponent : player;
      const paymentCards = player.cards(woodlandSquirrels, { zone: "hand" });
      const payment = paymentCards.map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      }));
      const material = targeted.zone("material-deck");
      const otherMaterial = untargeted.zone("material-deck");
      const deck = player.zone("main-deck");
      const memory = player.zone("memory");
      const historyIndex = game.state.eventHistory.length;
      player.activate(studyTheFables, {
        reservePayment: payment,
        targets: { "target-player": [targeted.id] },
      });
      passEffectsStack(game);
      expect(game.state.decision).toMatchObject({
        kind: "resolve-effect-choice",
        playerId: targeted.id,
      });
      const selected = material.slice(1);
      for (const invalid of [
        selected.slice(0, 5).map((card) => card.objectId),
        [...selected.slice(0, 5).map((card) => card.objectId), selected[0]!.objectId],
        [...selected.slice(0, 5).map((card) => card.objectId), otherMaterial[0]!.objectId],
      ]) {
        const before = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
        expect(game.state).toEqual(before);
      }
      answerDecision(
        game,
        "resolve-effect-choice",
        selected.map((card) => card.objectId),
      );
      passEffectsStack(game);
      const reveals = game.state.eventHistory
        .slice(historyIndex)
        .filter((event) => event.type === "card-revealed");
      expect(reveals.map((event) => event.objectId)).toEqual(selected.map((card) => card.objectId));
      expect(reveals.every((event) => event.playerId === targeted.id)).toBe(true);
      expect(targeted.zone("material-deck")).toEqual(material);
      expect(untargeted.zone("material-deck")).toEqual(otherMaterial);
      expect(player.zone("memory")).toEqual([...memory, ...paymentCards, deck[0]!]);
      expect(player.zone("main-deck")).toEqual(deck.slice(1));
      expect(opponent.zone("memory")).toHaveLength(0);
    });
  }
});
