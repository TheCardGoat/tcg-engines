import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { swordSaintsVow } from "./sword-saints-vow.ts";
import { temperedSteel } from "../../DOA/actions/tempered-steel.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers r44lyrzo6o-a1
 * @covers r44lyrzo6o-a2
 * @covers r44lyrzo6o-a3
 */
describe("Sword Saint's Vow", () => {
  for (const classBonus of [false, true])
    for (const crafts of [0, 1, 2])
      it(`tracks gained and spent durability, Class Bonus=${classBonus}, crafts=${crafts}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(swordSaintsVow, classBonus, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [swordSaintsVow],
              hand: [
                ...Array.from({ length: crafts }, () => temperedSteel),
                ...Array.from({ length: crafts }, () => woodlandSquirrels),
              ],
            },
          },
          playerTwo: { champion },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          weapon = p.card(swordSaintsVow),
          target = q.card(champion);
        for (const craft of p.cards(temperedSteel)) {
          p.activate(craft, {
            reservePayment: [
              { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
            ],
            targets: { "target-1": [weapon.objectId] },
          });
          passEffectsStack(game);
        }
        const durability = 1 + crafts * (classBonus ? 3 : 1);
        const power = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[weapon.objectId]!, "power", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        expect(game.state.objects[weapon.objectId]!.counters.durability).toBe(durability);
        expect(power()).toBe(classBonus ? durability : 0);
        const attack = () =>
          p.declareAttack(p.card(champion), target, { weaponIds: [weapon.objectId] });
        attack();
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(classBonus ? durability : 0);
        expect(game.state.objects[weapon.objectId]!.counters.durability ?? 0).toBe(
          Math.max(0, durability - (classBonus ? 2 : 1)),
        );
        expect(power()).toBe(classBonus ? Math.max(0, durability - 2) : 0);
      });
});
import { favorableWinds } from "../../DOA/actions/favorable-winds.ts";
it("does not gain Craft-trigger durability from a non-Craft action", () => {
  const champion = enableAllTestElements(
    createClassBonusTestChampion(swordSaintsVow, true, "activation-discount"),
  );
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: { field: [swordSaintsVow], hand: [favorableWinds, woodlandSquirrels] },
    },
    playerTwo: { champion },
  });
  const p = game.player("player-one"),
    weapon = p.card(swordSaintsVow);
  const durability = game.state.objects[weapon.objectId]!.counters.durability;
  p.activate(favorableWinds, {
    reservePayment: [{ kind: "card", cardId: p.card(woodlandSquirrels).objectId }],
  });
  passEffectsStack(game);
  expect(game.state.objects[weapon.objectId]?.counters.durability).toBe(durability);
});
