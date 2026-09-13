import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { warMarshal } from "./war-marshal.ts";

/** @covers dlvr8wunhg-a1 */
describe("War Marshal — Class Bonus Steadfast", () => {
  for (const classBonus of [false, true]) {
    it(`Class Bonus=${classBonus} retaliates while rested=${classBonus}`, () => {
      const champion = createClassBonusTestChampion(warMarshal, classBonus, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: { champion, zones: { field: [warMarshal] } },
        playerTwo: {
          champion: createClassBonusTestChampion(glacialGuidance, false, "activation-discount"),
          zones: {
            field: [automatedGardener],
            hand: [glacialGuidance, woodlandSquirrels],
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const marshal = player.card(warMarshal, { zone: "field" });
      opponent.activate(glacialGuidance, {
        targets: { "target-1": [marshal.objectId] },
        reservePayment: [
          { kind: "card", cardId: opponent.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
      });
      passEffectsStack(game);
      expect(game.state.objects[marshal.objectId]!.states.has("rested")).toBe(true);
      const wait = game.waitState();
      if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
        game.player(wait.playerId).pass();
      const attacker = opponent.card(automatedGardener, { zone: "field" });
      opponent.declareAttack(attacker, marshal);
      let retaliated = false;
      for (let step = 0; game.state.combat && step < 40; step++) {
        const waitState = game.waitState();
        if (game.state.decision?.kind === "choose-retaliators") {
          if (classBonus) {
            answerDecision(game, "choose-retaliators", [marshal.objectId]);
            retaliated = true;
          } else {
            const before = game.state;
            expect(() => answerDecision(game, "choose-retaliators", [marshal.objectId])).toThrow();
            expect(game.state).toEqual(before);
            answerDecision(game, "choose-retaliators", []);
          }
        } else if (waitState.kind === "opportunity") game.player(waitState.playerId).pass();
        else throw new Error(`Unexpected ${waitState.kind}`);
      }
      expect(retaliated).toBe(classBonus);
      expect(game.state.objects[marshal.objectId]!.states.has("rested")).toBe(true);
      if (classBonus) expect(game.state.objects[attacker.objectId]!.damage).toBe(2);
    });
  }
});

/** @covers dlvr8wunhg-a2 */
describe("War Marshal — Class Bonus Equestrian stats", () => {
  for (const classBonus of [false, true]) {
    for (const horse of [false, true]) {
      it(`Class Bonus=${classBonus}, Horse=${horse}`, () => {
        const champion = createClassBonusTestChampion(
          warMarshal,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: { field: horse ? [warMarshal, galesMare] : [warMarshal] },
          },
          playerTwo: {
            champion,
            zones: { field: [galesMare, automatedGardener] },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const target = opponent.card(champion, { zone: "field" });
        player.declareAttack(warMarshal, target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(classBonus && horse ? 3 : 2);
      });
    }
  }
});
