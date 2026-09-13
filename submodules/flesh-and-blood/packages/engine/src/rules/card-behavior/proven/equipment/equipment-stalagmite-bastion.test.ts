/**
 * EVR018 Stalagmite, Bastion of Isenloft — Ice Guardian Off-Hand d2.
 *
 * Printed a1: "Whenever you defend with Stalagmite, create a Frostbite token
 * under the attacking hero's control. Temper."
 *
 * CR 5.4.6: a functional triggered-static creates its triggered effect.
 * CR 8.6.10: Frostbite is created under the specified hero's control.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { stalagmiteBastionOfIsenloft } from "../../../../../../cards/src/cards/equipment/stalagmite-bastion-of-isenloft.ts";

describe("stalagmite-bastion-of-isenloft (EVR018)", () => {
  it("a1: defending creates a Frostbite under the sole attacking hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        weapon2: [stalagmiteBastionOfIsenloft],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(stalagmiteBastionOfIsenloft);
    game.helpers.resolveRestOfCombat();

    expect(Attacker.zone("arena").filter((id) => /frostbite/i.test(id))).toHaveLength(1);
    expect(Defender.zone("arena").some((id) => /frostbite/i.test(id))).toBe(false);
  });

  it("boundary: no Stalagmite defender means no Frostbite is created", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        weapon2: [stalagmiteBastionOfIsenloft],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);

    Attacker.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(Attacker.zone("arena").some((id) => /frostbite/i.test(id))).toBe(false);
  });
});
