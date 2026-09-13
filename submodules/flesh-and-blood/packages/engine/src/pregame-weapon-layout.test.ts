import { describe, expect, it } from "vitest";
import { browbeatBlue } from "../../cards/src/cards/actions/browbeat.ts";
import { deathDealer } from "../../cards/src/cards/weapons/death-dealer.ts";
import { driftwoodQuiver } from "../../cards/src/cards/equipment/driftwood-quiver.ts";
import { riptideLurkerOfTheDeep } from "../../cards/src/cards/heroes/riptide-lurker-of-the-deep.ts";
import { zaneBroadlyBeloved } from "../../cards/src/cards/heroes/zane-broadly-beloved.ts";
import { jubeelSpellbane } from "../../cards/src/cards/weapons/jubeel-spellbane.ts";
import { cintariSaber } from "../../cards/src/cards/weapons/cintari-saber.ts";
import { registerFabCardDefinition, type FabCardDefinitionInput } from "./cards.ts";
import {
  createDefaultFabPregameSelection,
  proposeFabEquipmentSelection,
  reconcileFabPregameSelection,
  resolveFabEquipmentSelection,
  type FabPregameCardPool,
} from "./pregame.ts";
import { resolveEquipSlot, weaponOccupantForDefinition } from "./rules/weapons/weapon-area.ts";

function pool(
  hero: FabCardDefinitionInput,
  equipment: readonly FabCardDefinitionInput[],
): FabPregameCardPool {
  const cards = [hero, ...equipment].map(registerFabCardDefinition);
  return {
    format: "shapeshifter",
    heroId: cards[0]!.canonicalId,
    entries: cards
      .slice(1)
      .map((card) => ({ canonicalId: card.canonicalId, quantity: 1, source: "equipment" })),
    cardDefinitions: Object.fromEntries(cards.map((card) => [card.canonicalId, card])),
  };
}
const bowId = deathDealer.canonicalId;
const quiverId = driftwoodQuiver.canonicalId;
const rangerPool = pool(riptideLurkerOfTheDeep, [deathDealer, driftwoodQuiver]);

// Owns the public pregame selection contract and its runtime weapon-seat handoff.
describe("canonical weapon loadouts", () => {
  it("manual selection preserves bow and quiver in either selection order", () => {
    const bowFirst = proposeFabEquipmentSelection(
      rangerPool,
      { weapon1: bowId },
      "weapon2",
      quiverId,
    );
    const quiverFirst = proposeFabEquipmentSelection(
      rangerPool,
      { weapon1: quiverId },
      "weapon2",
      bowId,
    );
    expect(bowFirst).toEqual({ weapon1: bowId, weapon2: quiverId });
    expect(quiverFirst).toEqual(bowFirst);
  });

  it("automatic selection and a reopened serialized loadout use the same layout", () => {
    const arenaPool = pool(riptideLurkerOfTheDeep, [driftwoodQuiver, deathDealer]);
    const reversedPool: FabPregameCardPool = {
      ...arenaPool,
      entries: [
        ...arenaPool.entries,
        { canonicalId: browbeatBlue.canonicalId, quantity: 30, source: "main" },
      ],
      cardDefinitions: { ...arenaPool.cardDefinitions, [browbeatBlue.canonicalId]: browbeatBlue },
    };
    const saved = {
      equipment: { weapon1: quiverId, weapon2: bowId },
      deck: [{ canonicalId: browbeatBlue.canonicalId, quantity: 30 }],
    };
    const result = reconcileFabPregameSelection(reversedPool, saved);
    expect(result.validation.valid).toBe(true);
    expect(result.selection.equipment).toEqual({ weapon1: bowId, weapon2: quiverId });
    expect(createDefaultFabPregameSelection(reversedPool).equipment).toEqual(
      result.selection.equipment,
    );
    expect(saved.equipment).toEqual({ weapon1: quiverId, weapon2: bowId });
  });

  it("removing the quiver keeps both weapon zones reserved; only a legal companion can return", () => {
    const resolved = resolveFabEquipmentSelection(rangerPool, { weapon2: bowId });
    expect(resolved.status).toBe("accepted");
    if (resolved.status !== "accepted") throw new Error("Expected legal lone bow");
    expect(resolved.equipment).toEqual({ weapon1: bowId });
    const seats = { weapon1: weaponOccupantForDefinition(deathDealer), weapon2: null };
    expect(resolveEquipSlot(seats, weaponOccupantForDefinition(cintariSaber))).toBeNull();
    expect(resolveEquipSlot(seats, weaponOccupantForDefinition(driftwoodQuiver))).toBe("weapon2");
  });

  it("effective one-handed swords retain their chosen slots under Zane's grant", () => {
    const warriorPool = pool(zaneBroadlyBeloved, [cintariSaber, jubeelSpellbane]);
    const equipment = { weapon1: cintariSaber.canonicalId, weapon2: jubeelSpellbane.canonicalId };
    expect(resolveFabEquipmentSelection(warriorPool, equipment)).toEqual({
      status: "accepted",
      equipment,
    });
    expect(createDefaultFabPregameSelection(warriorPool).equipment).toEqual(equipment);
    expect(
      resolveEquipSlot(
        { weapon1: weaponOccupantForDefinition(jubeelSpellbane, true), weapon2: null },
        weaponOccupantForDefinition(cintariSaber),
      ),
    ).toBe("weapon2");
  });

  it("normalization rejects illegal combinations rather than discarding a selected card", () => {
    const result = resolveFabEquipmentSelection(
      pool(riptideLurkerOfTheDeep, [deathDealer, cintariSaber]),
      { weapon1: cintariSaber.canonicalId, weapon2: bowId },
    );
    expect(result.status).toBe("rejected");
    if (result.status === "rejected")
      expect(result.issues.map((issue) => issue.code)).toContain("weapon-combination");
  });
});
