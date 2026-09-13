import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { umbraSight } from "../actions/umbra-sight.ts";
import { spellshieldAstra } from "../actions/spellshield-astra.ts";
import { supplyDrone } from "../allies/supply-drone.ts";
import { focusingRound } from "../items/focusing-round.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { gloamspireLance } from "./gloamspire-lance.ts";

function defenderChampion(level: number) {
  const champion = lineageTestChampion("Defender", level);
  if (champion.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
  return {
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: { ...champion.layout.face, elements: ["UMBRA", "ASTRA"] as const },
    },
  };
}

/** @covers 8vn1voy5tt-a1 */
describe("Gloamspire Lance — Curse-scaled hit damage and recovery", () => {
  for (const classBonus of [false, true]) {
    for (const curseCount of [0, 1, 2]) {
      for (const hitsChampion of [false, true]) {
        it(`hits ${hitsChampion ? "champion" : "ally"} with ${curseCount} attacker Curses and Class Bonus ${classBonus}`, () => {
          const champion = createClassBonusTestChampion(
            gloamspireLance,
            classBonus,
            "activation-discount",
          );
          const defender = defenderChampion(0);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [gloamspireLance, focusingRound],
                hand: [
                  ...Array.from({ length: curseCount }, () => umbraSight),
                  woodlandSquirrels,
                  woodlandSquirrels,
                ],
                "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion: defender,
              lineage: [defenderChampion(1)],
              zones: {
                field: [supplyDrone],
                hand: [
                  umbraSight,
                  spellshieldAstra,
                  ...Array.from({ length: 4 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
              },
            },
          });
          const player = game.player("player-one");
          const opponent = game.player("player-two");
          const attachCurse = (actor: typeof player) => {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error("Expected Curse Opportunity");
            if (wait.playerId !== actor.id) game.player(wait.playerId).pass();
            actor.activate(actor.cards(umbraSight, { zone: "hand" })[0]!);
            passEffectsStack(game);
            answerDecision(game, "resolve-optional-effect", true);
            passEffectsStack(game);
          };
          attachCurse(opponent);
          for (let index = 0; index < curseCount; index++) attachCurse(player);
          const curses = player.cards(umbraSight, { zone: "inner-lineage" });
          expect(curses).toHaveLength(curseCount);
          const opposingLineage = opponent.zone("inner-lineage");
          const attacker = player.card(champion, { zone: "field" });
          const target = opponent.card(hitsChampion ? defender : supplyDrone, { zone: "field" });
          const gun = player.card(gloamspireLance, { zone: "field" });
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error("Expected loading Opportunity");
          if (wait.playerId !== player.id) game.player(wait.playerId).pass();
          player.activateAbility(focusingRound, "7yacwhzzfb-a2", {
            targets: { "target-weapon": [gun.objectId] },
            reservePayment: player
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 2)
              .map((ref) => ({ kind: "card", cardId: ref.objectId })),
          });
          passEffectsStack(game);
          const ownDamage = game.state.objects[attacker.objectId]!.damage;
          const previousDamage = game.state.objects[target.objectId]!.damage;
          player.declareAttack(attacker, target, { weaponIds: [gun.objectId] });
          advanceCombatToTrigger(game, "8vn1voy5tt-a1");
          expect(
            game.state.stack.some(
              (item) => item.kind === "triggered-ability" && item.ability.id === "8vn1voy5tt-a1",
            ),
          ).toBe(classBonus);
          expect(game.state.objects[target.objectId]!.damage).toBe(previousDamage + 3);
          expect(game.state.objects[attacker.objectId]!.damage).toBe(ownDamage);
          if (classBonus && hitsChampion) {
            player.pass();
            opponent.activate(spellshieldAstra, {
              reservePayment: opponent
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 4)
                .map((ref) => ({ kind: "card", cardId: ref.objectId })),
            });
            for (let step = 0; step < 8 && game.state.stack.length > 1; step++) {
              const response = game.waitState();
              if (response.kind !== "opportunity")
                throw new Error(`Unexpected shield response ${response.kind}`);
              game.player(response.playerId).pass();
            }
            expect(game.state.stack).toHaveLength(1);
          }
          passEffectsStack(game);
          const amount = classBonus ? curseCount + 1 : 0;
          if (!hitsChampion && classBonus) {
            expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
          } else {
            expect(game.state.objects[target.objectId]!.damage).toBe(previousDamage + 3 + amount);
          }
          expect(game.state.objects[attacker.objectId]!.damage).toBe(
            Math.max(0, ownDamage - amount),
          );
          expect(player.cards(umbraSight, { zone: "inner-lineage" })).toEqual(curses);
          expect(opponent.zone("inner-lineage")).toEqual(opposingLineage);
          expect(game.state.decision).toBeNull();
        });
      }
    }
  }
});
