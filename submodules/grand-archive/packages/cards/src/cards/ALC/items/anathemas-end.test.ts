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
import { seekersRifle } from "../weapons/seekers-rifle.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { proveLoadBullet } from "../../../testing/load-bullet.ts";
import { anathemasEnd } from "./anathemas-end.ts";

/** @covers ii17fzcyfr-a1 */
describe("anathemas-end — load", () => {
  proveLoadBullet({ card: anathemasEnd, abilityId: "ii17fzcyfr-a1", reserveCost: 0 });
});

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

/** @covers ii17fzcyfr-a2 */
describe("Anathema's End — banish Curses and deal unpreventable damage", () => {
  for (const classBonus of [false, true]) {
    for (const curseCount of [0, 1, 2]) {
      for (const hitsChampion of [false, true]) {
        it(`hits ${hitsChampion ? "champion" : "ally"} with ${curseCount} Curses and Class Bonus ${classBonus}`, () => {
          const enabled = classBonus && hitsChampion;
          const champion = createClassBonusTestChampion(
            anathemasEnd,
            classBonus,
            "activation-discount",
          );
          const defender = defenderChampion(0);
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [anathemasEnd, seekersRifle],
                hand: [umbraSight],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion: defender,
              lineage: [defenderChampion(1)],
              zones: {
                field: [supplyDrone],
                hand: [
                  ...Array.from({ length: curseCount }, () => umbraSight),
                  spellshieldAstra,
                  ...Array.from({ length: 4 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
          });
          const player = game.player("player-one");
          const opponent = game.player("player-two");
          const attachCurse = (actor: typeof player) => {
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error("Expected Opportunity to cast Curse");
            if (wait.playerId !== actor.id) game.player(wait.playerId).pass();
            actor.activate(actor.cards(umbraSight, { zone: "hand" })[0]!);
            passEffectsStack(game);
            answerDecision(game, "resolve-optional-effect", true);
            passEffectsStack(game);
          };
          attachCurse(player);
          for (let index = 0; index < curseCount; index++) attachCurse(opponent);
          const curses = opponent.cards(umbraSight, { zone: "inner-lineage" });
          expect(curses).toHaveLength(curseCount);
          const ownCurse = player.cards(umbraSight, { zone: "inner-lineage" });
          const originalLineage = opponent.zone("inner-lineage");
          const nonCurses = originalLineage.filter(
            (ref) => ref.definitionId !== umbraSight.canonicalId,
          );
          const gun = player.card(seekersRifle, { zone: "field" });
          player.activateAbility(anathemasEnd, "ii17fzcyfr-a1", {
            targets: { "target-weapon": [gun.objectId] },
          });
          passEffectsStack(game);
          const target = opponent.card(hitsChampion ? defender : supplyDrone, { zone: "field" });
          player.declareAttack(player.card(champion, { zone: "field" }), target, {
            weaponIds: [gun.objectId],
          });
          advanceCombatToTrigger(game, "ii17fzcyfr-a2");
          expect(
            game.state.stack.some(
              (item) => item.kind === "triggered-ability" && item.ability.id === "ii17fzcyfr-a2",
            ),
          ).toBe(enabled);
          expect(opponent.cards(umbraSight, { zone: "inner-lineage" })).toEqual(curses);
          const damageAfterHit = game.state.objects[target.objectId]!.damage;
          if (enabled && curseCount > 0) {
            player.pass();
            opponent.activate(spellshieldAstra, {
              reservePayment: opponent
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 4)
                .map((ref) => ({ kind: "card", cardId: ref.objectId })),
            });
            // Resolve only the prevention spell; the hit trigger is still pending beneath it.
            for (let step = 0; step < 8 && game.state.stack.length > 1; step++) {
              const wait = game.waitState();
              if (wait.kind !== "opportunity")
                throw new Error(`Unexpected shield response ${wait.kind}`);
              game.player(wait.playerId).pass();
            }
            expect(game.state.stack).toHaveLength(1);
            expect(game.state.objects[target.objectId]!.damage).toBe(damageAfterHit);
          }
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(
            damageAfterHit + (enabled ? curseCount * 2 : 0),
          );
          expect(opponent.cards(umbraSight, { zone: "banishment" })).toEqual(enabled ? curses : []);
          expect(opponent.zone("inner-lineage")).toEqual(enabled ? nonCurses : originalLineage);
          expect(player.cards(umbraSight, { zone: "inner-lineage" })).toEqual(ownCurse);
        });
      }
    }
  }
});
