import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain } from "../../../testing/decisions.ts";
import { blitzMage } from "./blitz-mage.ts";
import { proveCountedActivationDiscount } from "../../../testing/counted-activation-discount.ts";
import { describe } from "vitest";
import { phalanxCaptain } from "./phalanx-captain.ts";

/** @covers rPpLwLPGaL-a1 */
describe("Phalanx Captain \u2014 resolution", () => {
  proveCountedActivationDiscount({
    card: phalanxCaptain,
    cost: 5,
    qualifying: blitzMage,
    zone: "field",
  });
});

/** @covers rPpLwLPGaL-a2 */
it("boosts only other controlled Human allies and only during their attacks", () => {
  const champion = createClassBonusTestChampion(phalanxCaptain, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        field: [phalanxCaptain, blitzMage, woodlandSquirrels],
        "main-deck": [woodlandSquirrels],
      },
    },
    playerTwo: { champion, zones: { field: [blitzMage], "main-deck": [woodlandSquirrels] } },
  });
  const p = game.player("player-one"),
    q = game.player("player-two"),
    human = p.card(blitzMage);
  const power = () =>
    deriveGrandArchiveNumericProperty(game.state.objects[human.objectId]!, "power", {
      program: game.program,
      state: game.state,
      controllerId: p.id,
      bindings: {},
    });
  expect(power()).toBe(3);
  let total = 0;
  for (const [card, expected] of [
    [blitzMage, 4],
    [woodlandSquirrels, 1],
    [phalanxCaptain, 1],
  ] as const) {
    p.declareAttack(card, q.card(champion));
    game.resolveCombatWithoutRetaliation();
    total += expected;
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(total);
    expect(power()).toBe(3);
  }
  advanceToMain(game, q.id);
  q.declareAttack(blitzMage, p.card(champion));
  game.resolveCombatWithoutRetaliation();
  expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(3);
});
