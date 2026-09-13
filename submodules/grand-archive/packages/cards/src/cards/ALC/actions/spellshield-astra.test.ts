import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveGlimpseAnswer } from "@tcg/grand-archive-engine/runtime";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { supplyDrone } from "../allies/supply-drone.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "./reposition.ts";
import { harvestHerbs } from "./harvest-herbs.ts";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { spellshieldAstra } from "./spellshield-astra.ts";

/** @covers nmp5af098k-a1 */
describe("spellshield-astra — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: spellshieldAstra, discount: 2 });
});

/** @covers nmp5af098k-a2 */
describe("Spellshield: Astra — prevent next damage and Glimpse the actual amount", () => {
  for (const deckSize of [1, 3]) {
    it(`prevents two damage once and glimpses up to two of ${deckSize} cards`, () => {
      const champion = createClassBonusTestChampion(spellshieldAstra, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [supplyDrone],
            hand: [spellshieldAstra, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
            "main-deck": [woodlandSquirrels, reposition, harvestHerbs].slice(0, deckSize),
          },
        },
        playerTwo: {
          champion,
          zones: { field: [automatedGardener, automatedGardener, automatedGardener] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const target = player.card(champion, { zone: "field" });
      const deck = player.zone("main-deck");
      opponent.pass();
      player.activate(spellshieldAstra, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      });
      passEffectsStack(game);
      expect(player.zone("main-deck")).toEqual(deck);
      const attackers = opponent.cards(automatedGardener, { zone: "field" });
      const ally = player.card(supplyDrone, { zone: "field" });
      opponent.declareAttack(attackers[0]!, ally);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[ally.objectId]!.damage).toBe(2);
      expect(player.zone("main-deck")).toEqual(deck);
      opponent.declareAttack(attackers[1]!, target);
      for (let step = 0; step < 64 && game.state.decision?.kind !== "resolve-glimpse"; step++) {
        const wait = game.waitState();
        if (game.state.decision?.kind === "choose-retaliators")
          answerDecision(game, "choose-retaliators", []);
        else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
        else throw new Error(`Unexpected combat state ${wait.kind}`);
      }
      expect(game.state.objects[target.objectId]!.damage).toBe(0);
      const glimpse = game.state.decision;
      if (glimpse?.kind !== "resolve-glimpse")
        throw new Error("Expected Glimpse after preventing damage");
      expect(glimpse.playerId).toBe(player.id);
      expect(glimpse.cardIds).toEqual(deck.slice(0, 2).map((ref) => ref.objectId));
      const bottom = deck.slice(0, 2).reverse();
      answerDecision(game, "resolve-glimpse", {
        kind: "reorder",
        top: [],
        bottom: bottom.map((ref) => ref.objectId),
      } satisfies GrandArchiveGlimpseAnswer);
      game.resolveCombatWithoutRetaliation();
      expect(player.zone("main-deck")).toEqual([...deck.slice(2), ...bottom]);
      opponent.declareAttack(attackers[2]!, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(2);
      expect(player.zone("main-deck")).toEqual([...deck.slice(2), ...bottom]);
    });
  }
  it("expires unused prevention at the end of the casting turn", () => {
    const champion = createClassBonusTestChampion(spellshieldAstra, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [spellshieldAstra, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          "main-deck": [reposition],
        },
      },
      playerTwo: { champion, zones: { field: [automatedGardener], "main-deck": [reposition] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    player.activate(spellshieldAstra, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card", cardId: ref.objectId })),
    });
    passEffectsStack(game);
    advanceToRecollection(game, "player-two");
    for (let step = 0; step < 16 && game.state.turn.phase !== "main"; step++) {
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected phase ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    const target = player.card(champion, { zone: "field" });
    opponent.declareAttack(automatedGardener, target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
  });
});
