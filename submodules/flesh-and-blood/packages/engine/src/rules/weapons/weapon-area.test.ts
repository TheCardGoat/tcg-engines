import { deathDealer } from "../../../../cards/src/cards/weapons/death-dealer.ts";
import { jubeelSpellbane } from "../../../../cards/src/cards/weapons/jubeel-spellbane.ts";
import { cintariSaber } from "../../../../cards/src/cards/weapons/cintari-saber.ts";
import { driftwoodQuiver } from "../../../../cards/src/cards/equipment/driftwood-quiver.ts";
import { steelbraidBuckler } from "../../../../cards/src/cards/equipment/steelbraid-buckler.ts";
import { ironrotHelm } from "../../../../cards/src/cards/equipment/ironrot-helm.ts";
import { pollyCranka } from "../../../../cards/src/cards/companions/polly-cranka.ts";
import { describe, expect, it } from "vitest";
import type { FabCardDefinitionInput } from "../../cards.ts";
import {
  hasTypeToken,
  isBowDefinition,
  resolveEquipSlot,
  weaponOccupantForDefinition,
  validateWeaponArea,
  weaponSeatKind,
  type FabWeaponAreaEntry,
} from "./weapon-area.ts";

function def(types: string[]): FabCardDefinitionInput {
  return { canonicalId: types.join("-"), types } as unknown as FabCardDefinitionInput;
}

const entry = (id: string, types: string[]): FabWeaponAreaEntry => ({
  canonicalId: id,
  seat: weaponSeatKind(def(types)),
  isBow: isBowDefinition(def(types)),
});

describe("weapon-area classification (CR 8.2)", () => {
  it("classifies 1H / 2H / off-hand / quiver / non-weapon", () => {
    expect(weaponSeatKind(def(["Warrior", "Weapon", "Axe", "1H"]))).toBe("1h-weapon");
    expect(weaponSeatKind(def(["Ranger", "Weapon", "Bow", "2H"]))).toBe("2h-weapon");
    expect(weaponSeatKind(def(["Generic", "Equipment", "Off-Hand"]))).toBe("off-hand");
    expect(weaponSeatKind(def(["Ranger", "Equipment", "Quiver"]))).toBe("quiver");
    expect(weaponSeatKind(def(["Runeblade", "Action"]))).toBe("non-weapon");
  });

  it("isBowDefinition requires both Weapon and Bow", () => {
    expect(isBowDefinition(def(["Ranger", "Weapon", "Bow", "2H"]))).toBe(true);
    expect(isBowDefinition(def(["Warrior", "Weapon", "Axe", "2H"]))).toBe(false);
    expect(isBowDefinition(def(["Ranger", "Equipment", "Quiver"]))).toBe(false);
  });

  it("hasTypeToken is case-insensitive", () => {
    expect(hasTypeToken(def(["Off-Hand"]), "off-hand")).toBe(true);
    expect(hasTypeToken(def(["Off-Hand"]), "OFF-HAND")).toBe(true);
    expect(hasTypeToken(undefined, "Weapon")).toBe(false);
  });
});

describe("weapon-area validation (CR 8.2.1b/2b/2c/10b/15a/15b)", () => {
  it("8.2.15a: a 2H bow + a quiver is legal", () => {
    expect(
      validateWeaponArea([
        entry("bow", ["Weapon", "Bow", "2H"]),
        entry("q", ["Equipment", "Quiver"]),
      ]),
    ).toEqual([]);
  });

  it("8.2.2b: a 2H non-bow must be alone (2H sword + quiver is illegal)", () => {
    expect(
      validateWeaponArea([
        entry("sword", ["Weapon", "Sword", "2H"]),
        entry("q", ["Equipment", "Quiver"]),
      ]),
    ).toContain("two-hander-must-be-alone");
  });

  it("8.2.2b: two 2H weapons is illegal", () => {
    expect(
      validateWeaponArea([entry("a", ["Weapon", "2H"]), entry("b", ["Weapon", "2H"])]),
    ).toContain("two-hander-must-be-alone");
  });

  it("8.2.2b: a 2H bow + a 1H weapon is illegal (2H reserves both zones)", () => {
    expect(
      validateWeaponArea([entry("bow", ["Weapon", "Bow", "2H"]), entry("w", ["Weapon", "1H"])]),
    ).toContain("two-hander-must-be-alone");
  });

  it("8.2.2b: a single 2H alone is legal", () => {
    expect(validateWeaponArea([entry("bow", ["Weapon", "Bow", "2H"])])).toEqual([]);
    expect(validateWeaponArea([entry("sword", ["Weapon", "Sword", "2H"])])).toEqual([]);
  });

  it("8.2.10b: two off-hands is illegal", () => {
    expect(
      validateWeaponArea([
        entry("a", ["Equipment", "Off-Hand"]),
        entry("b", ["Equipment", "Off-Hand"]),
      ]),
    ).toContain("too-many-off-hand");
  });

  it("8.2.15b: two quivers is illegal", () => {
    expect(
      validateWeaponArea([
        entry("a", ["Equipment", "Quiver"]),
        entry("b", ["Equipment", "Quiver"]),
      ]),
    ).toContain("too-many-quiver");
  });

  it("8.2.1b: two 1H weapons is legal", () => {
    expect(
      validateWeaponArea([entry("a", ["Weapon", "1H"]), entry("b", ["Weapon", "1H"])]),
    ).toEqual([]);
  });

  it("8.2.1b/10a: a 1H weapon + an off-hand is legal", () => {
    expect(
      validateWeaponArea([entry("a", ["Weapon", "1H"]), entry("b", ["Equipment", "Off-Hand"])]),
    ).toEqual([]);
  });
});

describe("weapon-area seat resolution (mid-game equip)", () => {
  it("8.2.1b: seats a 1H into the first empty slot", () => {
    expect(
      resolveEquipSlot({ weapon1: null, weapon2: null }, weaponOccupantForDefinition(cintariSaber)),
    ).toBe("weapon1");
    expect(
      resolveEquipSlot(
        { weapon1: weaponOccupantForDefinition(cintariSaber), weapon2: null },
        weaponOccupantForDefinition(cintariSaber),
      ),
    ).toBe("weapon2");
    expect(
      resolveEquipSlot(
        {
          weapon1: weaponOccupantForDefinition(cintariSaber),
          weapon2: weaponOccupantForDefinition(cintariSaber),
        },
        weaponOccupantForDefinition(cintariSaber),
      ),
    ).toBeNull();
  });

  it("8.2.2b: a 2H requires BOTH slots empty", () => {
    expect(
      resolveEquipSlot(
        { weapon1: null, weapon2: null },
        weaponOccupantForDefinition(jubeelSpellbane),
      ),
    ).toBe("weapon1");
    expect(
      resolveEquipSlot(
        { weapon1: weaponOccupantForDefinition(cintariSaber), weapon2: null },
        weaponOccupantForDefinition(jubeelSpellbane),
      ),
    ).toBeNull();
    expect(
      resolveEquipSlot(
        { weapon1: null, weapon2: weaponOccupantForDefinition(cintariSaber) },
        weaponOccupantForDefinition(jubeelSpellbane),
      ),
    ).toBeNull();
  });

  it("8.2.15a: a quiver may take the slot reserved by a 2H bow", () => {
    expect(
      resolveEquipSlot(
        { weapon1: weaponOccupantForDefinition(deathDealer), weapon2: null },
        weaponOccupantForDefinition(driftwoodQuiver),
      ),
    ).toBe("weapon2");
  });

  it("8.2.15a: a quiver may NOT take the slot reserved by a 2H non-bow", () => {
    expect(
      resolveEquipSlot(
        { weapon1: weaponOccupantForDefinition(jubeelSpellbane), weapon2: null },
        weaponOccupantForDefinition(driftwoodQuiver),
      ),
    ).toBeNull();
  });

  it("8.2.10b: an off-hand may not be seated when one is already present", () => {
    expect(
      resolveEquipSlot(
        { weapon1: weaponOccupantForDefinition(steelbraidBuckler), weapon2: null },
        weaponOccupantForDefinition(steelbraidBuckler),
      ),
    ).toBeNull();
  });

  it("8.2.15b: a quiver may not be seated when one is already present", () => {
    expect(
      resolveEquipSlot(
        { weapon1: weaponOccupantForDefinition(driftwoodQuiver), weapon2: null },
        weaponOccupantForDefinition(driftwoodQuiver),
      ),
    ).toBeNull();
  });

  it("non-weapon never resolves to a slot", () => {
    expect(
      resolveEquipSlot({ weapon1: null, weapon2: null }, weaponOccupantForDefinition(ironrotHelm)),
    ).toBeNull();
  });
  it("checks reservations in either occupied zone without relocating runtime objects", () => {
    const state = { weapon1: null, weapon2: weaponOccupantForDefinition(deathDealer) };
    expect(resolveEquipSlot(state, weaponOccupantForDefinition(cintariSaber))).toBeNull();
    expect(resolveEquipSlot(state, weaponOccupantForDefinition(driftwoodQuiver))).toBe("weapon1");
  });

  it("retains the Perched exception when equipping beside a two-hander", () => {
    expect(
      resolveEquipSlot(
        { weapon1: weaponOccupantForDefinition(jubeelSpellbane), weapon2: null },
        weaponOccupantForDefinition(pollyCranka),
      ),
    ).toBe("weapon2");
  });
});
