import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { favorableWinds } from "../actions/favorable-winds.ts";
import { proveConditionalWeaponPower } from "../../../testing/conditional-weapon-power.ts";
import { describe, expect, it } from "vitest";
import { sealedBladeDoa } from "./sealed-blade-doa.ts";

/** @covers mDN1CI9IEe-a2 */
describe("Sealed Blade \u2014 resolution", () => {
  proveConditionalWeaponPower({
    card: sealedBladeDoa,
    classBonus: true,
    withAlly: true,
    targetAlly: true,
    expectedDamage: 3,
  });
});

describe("restriction boundaries", () => {
  proveConditionalWeaponPower({
    card: sealedBladeDoa,
    classBonus: true,
    withAlly: true,
    targetAlly: false,
    expectedDamage: 3,
  });
  proveConditionalWeaponPower({
    card: sealedBladeDoa,
    classBonus: true,
    withAlly: false,
    targetAlly: true,
    expectedDamage: 3,
  });
  proveConditionalWeaponPower({
    card: sealedBladeDoa,
    classBonus: true,
    withAlly: false,
    targetAlly: false,
    expectedDamage: 3,
  });
  proveConditionalWeaponPower({
    card: sealedBladeDoa,
    classBonus: false,
    withAlly: true,
    targetAlly: true,
    expectedDamage: 2,
  });
  proveConditionalWeaponPower({
    card: sealedBladeDoa,
    classBonus: false,
    withAlly: true,
    targetAlly: false,
    expectedDamage: 2,
  });
  proveConditionalWeaponPower({
    card: sealedBladeDoa,
    classBonus: false,
    withAlly: false,
    targetAlly: true,
    expectedDamage: 2,
  });
  proveConditionalWeaponPower({
    card: sealedBladeDoa,
    classBonus: false,
    withAlly: false,
    targetAlly: false,
    expectedDamage: 2,
  });
});

/** @covers mDN1CI9IEe-a1 */
describe("Sealed Blade's exclusive Floating Memory payment", () => {
  for (const floatingCount of [0, 2, 3])
    it(`requires all three payments to use Floating Memory (${floatingCount})`, () => {
      const champion = createClassBonusTestChampion(sealedBladeDoa, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            "material-deck": [sealedBladeDoa],
            memory: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            graveyard: [favorableWinds, favorableWinds, favorableWinds, woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        before = game.state;
      const ids = p
        .cards(favorableWinds, { zone: "graveyard" })
        .slice(0, floatingCount)
        .map((c) => c.objectId);
      if (floatingCount < 3) {
        expect(() => p.materialize(sealedBladeDoa, { floatingMemoryCardIds: ids })).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      expect(() =>
        p.materialize(sealedBladeDoa, {
          floatingMemoryCardIds: [
            ...ids.slice(0, 2),
            p.card(woodlandSquirrels, { zone: "graveyard" }).objectId,
          ],
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.materialize(sealedBladeDoa, { floatingMemoryCardIds: ids });
      expect(p.cards(favorableWinds, { zone: "banishment" })).toHaveLength(3);
      expect(p.zone("memory")).toHaveLength(3);
      expect(p.cards(sealedBladeDoa, { zone: "field" })).toHaveLength(0);
      passEffectsStack(game);
      expect(p.cards(sealedBladeDoa, { zone: "field" })).toHaveLength(1);
    });
});
