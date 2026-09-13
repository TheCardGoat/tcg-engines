import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "./automated-gardener.ts";
import { veteranBlazebearer } from "./veteran-blazebearer.ts";

function mainPhase(game: GrandArchiveTestEngine) {
  for (let step = 0; game.state.turn.phase !== "main" && step < 16; step++) {
    const wait = game.waitState();
    if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
    game.player(wait.playerId).pass();
  }
}

/** @covers 23yfzk96yd-a1 */
describe("Veteran Blazebearer — entry Taunt duration", () => {
  for (const expired of [false, true]) {
    it(`protects during the opponent's next turn but not after its controller's next turn (${expired})`, () => {
      const champion = createClassBonusTestChampion(
        veteranBlazebearer,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [veteranBlazebearer, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [automatedGardener],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      player.activate(veteranBlazebearer, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      });
      player.pass();
      opponent.pass();
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "23yfzk96yd-a1",
        ),
      ).toBe(true);
      const sourceId = player.card(veteranBlazebearer).objectId;
      expect(game.state.continuousEffects.some((effect) => effect.sourceId === sourceId)).toBe(
        false,
      );
      passEffectsStack(game);
      const grant = game.state.continuousEffects.find((effect) => effect.sourceId === sourceId);
      expect(grant).toBeDefined();
      advanceToRecollection(game, opponent.id);
      expect(game.state.continuousEffects).toContainEqual(grant);
      if (expired) {
        for (let step = 0; game.state.turn.playerId !== player.id && step < 64; step++) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        expect(game.state.turn.playerId).toBe(player.id);
        expect(game.state.continuousEffects).not.toContainEqual(grant);
        advanceToRecollection(game, opponent.id);
      }
      mainPhase(game);
      const ally = player.card(veteranBlazebearer);
      expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(false);
      const championRef = player.card(champion);
      if (!expired) {
        const before = game.state;
        expect(() => opponent.declareAttack(automatedGardener, championRef)).toThrow();
        expect(game.state).toEqual(before);
      }
      opponent.declareAttack(automatedGardener, expired ? championRef : ally);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[championRef.objectId]!.damage).toBe(expired ? 2 : 0);
      expect(game.state.objects[ally.objectId]!.damage).toBe(expired ? 0 : 2);
    });
  }
});

/** @covers 23yfzk96yd-a2 */
describe("Veteran Blazebearer — conditional Steadfast", () => {
  for (const classBonus of [false, true]) {
    for (const rested of [false, true]) {
      it(`Class Bonus=${classBonus}, initially rested=${rested}`, () => {
        const champion = createClassBonusTestChampion(
          veteranBlazebearer,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: { field: [veteranBlazebearer], "main-deck": [woodlandSquirrels] },
          },
          playerTwo: {
            champion,
            zones: { field: [automatedGardener], "main-deck": [woodlandSquirrels] },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const ally = player.card(veteranBlazebearer);
        if (rested) {
          player.declareAttack(ally, opponent.card(champion));
          game.resolveCombatWithoutRetaliation();
        }
        advanceToRecollection(game, opponent.id);
        mainPhase(game);
        expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(rested);
        const attacker = opponent.card(automatedGardener);
        opponent.declareAttack(attacker, ally);
        for (
          let step = 0;
          game.state.decision?.kind !== "choose-retaliators" && game.state.combat && step < 16;
          step++
        ) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        const canRetaliate = classBonus || !rested;
        if (canRetaliate) {
          expect(game.state.objects[attacker.objectId]!.damage).toBe(0);
          answerDecision(game, "choose-retaliators", [ally.objectId]);
          expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(
            rested || !classBonus,
          );
        } else if (game.state.decision?.kind === "choose-retaliators") {
          expect(() => answerDecision(game, "choose-retaliators", [ally.objectId])).toThrow();
          answerDecision(game, "choose-retaliators", []);
        }
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[attacker.objectId]!.damage).toBe(canRetaliate ? 2 : 0);
        expect(game.state.objects[ally.objectId]!.damage).toBe(2);
      });
    }
  }
});
