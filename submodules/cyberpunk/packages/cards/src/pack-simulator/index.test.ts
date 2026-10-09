import { describe, expect, it } from "vite-plus/test";
import {
  CYBERPUNK_PACK_COMMON_SLOTS,
  CYBERPUNK_PACK_EPIC_RATE,
  CYBERPUNK_PACK_RARE_SLOTS,
  CYBERPUNK_PACK_SECRET_RATE,
  CYBERPUNK_PACK_UNCOMMON_SLOTS,
  CYBERPUNK_RETAIL_PACK_SET,
  CYBERPUNK_SIX_PACK_COUNT,
  createCyberpunkPackSimulator,
} from "./index.ts";

const RARE = new Set(["Rare", "Epic", "Secret"]);
const STAT_PACKS = 5000;

function openPack(packIndex: number) {
  const simulator = createCyberpunkPackSimulator();
  const pack = simulator.generatePack(CYBERPUNK_RETAIL_PACK_SET, `pack-invariant:${packIndex}`);
  return {
    simulator,
    slots: pack.slots.map((slot) => ({
      slotType: slot.slotType,
      card: simulator.resolveCard(slot.cardRef)!,
    })),
  };
}

describe("createCyberpunkPackSimulator", () => {
  const simulator = createCyberpunkPackSimulator();

  it("deals one retail pack and repeats a seed", () => {
    const first = simulator.generatePack(CYBERPUNK_RETAIL_PACK_SET, "pack-seed");
    const second = simulator.generatePack(CYBERPUNK_RETAIL_PACK_SET, "pack-seed");
    const other = simulator.generatePack(CYBERPUNK_RETAIL_PACK_SET, "other-seed");

    expect(first.slots.map((slot) => slot.cardRef)).toEqual(
      second.slots.map((slot) => slot.cardRef),
    );
    expect(first.slots.map((slot) => slot.cardRef)).not.toEqual(
      other.slots.map((slot) => slot.cardRef),
    );
    expect(first.slots.filter((slot) => slot.slotType === "common")).toHaveLength(
      CYBERPUNK_PACK_COMMON_SLOTS,
    );
    expect(first.slots.filter((slot) => slot.slotType === "uncommon")).toHaveLength(
      CYBERPUNK_PACK_UNCOMMON_SLOTS,
    );
    expect(first.slots.filter((slot) => slot.slotType === "rarePlus")).toHaveLength(
      CYBERPUNK_PACK_RARE_SLOTS,
    );

    for (const slot of first.slots) {
      const card = simulator.resolveCard(slot.cardRef);
      expect(card?.set.code).toBe(CYBERPUNK_RETAIL_PACK_SET);
      expect(card?.legality).toBe("legal");
      expect(card?.rarity).not.toBe("Nova Rare");
      if (slot.slotType === "common") expect(card?.rarity).toBe("Common");
      if (slot.slotType === "uncommon") expect(card?.rarity).toBe("Uncommon");
      if (slot.slotType === "rarePlus") expect(RARE.has(card?.rarity ?? "")).toBe(true);
    }
  });

  it("never repeats a card inside one pack", () => {
    for (let packIndex = 0; packIndex < 200; packIndex += 1) {
      const { slots } = openPack(packIndex);
      const refs = slots.map((slot) => slot.card.canonicalId);
      expect(new Set(refs).size).toBe(refs.length);
    }
  });

  it("deals commons with every color once and no color above twice", () => {
    for (let packIndex = 0; packIndex < 200; packIndex += 1) {
      const { slots } = openPack(packIndex);
      const commons = slots.filter((slot) => slot.slotType === "common");
      const counts = new Map<string, number>();
      for (const slot of commons) {
        counts.set(slot.card.color, (counts.get(slot.card.color) ?? 0) + 1);
      }
      // 7 commons across the four retail colors: every color must appear.
      expect(counts.size).toBe(4);
      for (const count of counts.values()) expect(count).toBeLessThanOrEqual(2);
    }
  });

  it("deals uncommons with no color repeated", () => {
    for (let packIndex = 0; packIndex < 200; packIndex += 1) {
      const { slots } = openPack(packIndex);
      const uncommons = slots.filter((slot) => slot.slotType === "uncommon");
      const colors = uncommons.map((slot) => slot.card.color);
      expect(new Set(colors).size).toBe(uncommons.length);
    }
  });

  it("keeps at least one plain Rare and upgrades at most one rarePlus slot", () => {
    for (let packIndex = 0; packIndex < 200; packIndex += 1) {
      const { slots } = openPack(packIndex);
      const rarePlus = slots.filter((slot) => slot.slotType === "rarePlus");
      const plainRares = rarePlus.filter((slot) => slot.card.rarity === "Rare");
      expect(plainRares.length).toBeGreaterThanOrEqual(1);
      expect(rarePlus.length - plainRares.length).toBeLessThanOrEqual(1);
    }
  });

  it("matches the published Epic and Secret pull rates", () => {
    let epicPacks = 0;
    let secretPacks = 0;
    for (let packIndex = 0; packIndex < STAT_PACKS; packIndex += 1) {
      const { slots } = openPack(packIndex);
      const rarities = slots
        .filter((slot) => slot.slotType === "rarePlus")
        .map((slot) => slot.card.rarity);
      if (rarities.includes("Epic")) epicPacks += 1;
      if (rarities.includes("Secret")) secretPacks += 1;
    }
    // Effective rates: Secret = SECRET_RATE, Epic = (1 - SECRET_RATE) * EPIC_RATE.
    const epicRate = epicPacks / STAT_PACKS;
    const secretRate = secretPacks / STAT_PACKS;
    const expectedEpic = (1 - CYBERPUNK_PACK_SECRET_RATE) * CYBERPUNK_PACK_EPIC_RATE;
    expect(Math.abs(epicRate - expectedEpic)).toBeLessThan(0.05);
    expect(Math.abs(secretRate - CYBERPUNK_PACK_SECRET_RATE)).toBeLessThan(0.02);
  });

  it("opens six packs from derived seeds without a second dealer", () => {
    const seed = "daily-hmac";
    const cards: Record<string, number> = {};
    for (let index = 0; index < CYBERPUNK_SIX_PACK_COUNT; index += 1) {
      const pack = simulator.generatePack(CYBERPUNK_RETAIL_PACK_SET, `${seed}:${index}`);
      for (const slot of pack.slots) {
        cards[slot.cardRef] = (cards[slot.cardRef] ?? 0) + 1;
      }
    }
    const again = createCyberpunkPackSimulator().generatePack(
      CYBERPUNK_RETAIL_PACK_SET,
      `${seed}:0`,
    );
    expect(again.slots.map((slot) => slot.cardRef)).toEqual(
      simulator
        .generatePack(CYBERPUNK_RETAIL_PACK_SET, `${seed}:0`)
        .slots.map((slot) => slot.cardRef),
    );
    expect(Object.values(cards).reduce((sum, quantity) => sum + quantity, 0)).toBe(
      CYBERPUNK_SIX_PACK_COUNT * 12,
    );
  });
});
