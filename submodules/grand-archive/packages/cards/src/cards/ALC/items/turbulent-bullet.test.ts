import { describe, expect, it } from "vitest";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { seekersRifle } from "../weapons/seekers-rifle.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { proveRenewableBullet } from "../../../testing/renewable-bullet.ts";
import { proveLoadBullet } from "../../../testing/load-bullet.ts";
import { turbulentBullet } from "./turbulent-bullet.ts";

/** @covers f8urrqtjot-a1 */
describe("Turbulent Bullet — Renewable", () => {
  proveRenewableBullet({ card: turbulentBullet, loadAbilityId: "f8urrqtjot-a2" });
});

/** @covers f8urrqtjot-a3 */
describe("Turbulent Bullet — targeted power on hit", () => {
  for (const classBonus of [false, true]) {
    for (const count of [0, 1, 2]) {
      it(`buffs ${count} chosen allies only until end of turn (class=${classBonus})`, () => {
        const champion = createClassBonusTestChampion(
          turbulentBullet,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [
                turbulentBullet,
                seekersRifle,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { field: [woodlandSquirrels], "main-deck": [woodlandSquirrels] },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const allies = player.cards(woodlandSquirrels, { zone: "field" });
        const powers = () =>
          allies.map((ref) =>
            deriveGrandArchiveNumericProperty(game.state.objects[ref.objectId]!, "power", {
              program: game.program,
              state: game.state,
              controllerId: player.id,
              bindings: {},
            }),
          );
        const gun = player.card(seekersRifle, { zone: "field" });
        player.activateAbility(turbulentBullet, "f8urrqtjot-a2", {
          targets: { "target-weapon": [gun.objectId] },
        });
        passEffectsStack(game);
        player.declareAttack(
          player.card(champion, { zone: "field" }),
          opponent.card(champion, { zone: "field" }),
          { weaponIds: [gun.objectId] },
        );
        advanceCombatToTrigger(game, "f8urrqtjot-a3");
        expect(powers()).toEqual([1, 1, 1]);
        if (classBonus) {
          expect(game.state.decision?.kind).toBe("announce-triggered-ability");
          const before = game.state;
          expect(() =>
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-1": allies.map((ref) => ref.objectId) },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          expect(() =>
            answerDecision(game, "announce-triggered-ability", {
              targets: {
                "target-1": [opponent.card(woodlandSquirrels, { zone: "field" }).objectId],
              },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-1": allies.slice(0, count).map((ref) => ref.objectId) },
          });
          expect(powers()).toEqual([1, 1, 1]);
          passEffectsStack(game);
        }
        expect(powers()).toEqual(allies.map((_, index) => (classBonus && index < count ? 2 : 1)));
        advanceToRecollection(game, "player-two");
        expect(powers()).toEqual([1, 1, 1]);
      });
    }
  }
});

/** @covers f8urrqtjot-a2 */
describe("turbulent-bullet — load", () => {
  proveLoadBullet({ card: turbulentBullet, abilityId: "f8urrqtjot-a2", reserveCost: 0 });
});
