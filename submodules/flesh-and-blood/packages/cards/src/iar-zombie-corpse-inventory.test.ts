import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import type {
  SparseFleshAndBloodCardDataCatalog,
  SparseFleshAndBloodPrintingsCatalog,
} from "@tcg/flesh-and-blood-types/catalog";

import officialJson from "../../../docs/releases/usurp-the-shadow-throne/cardvault-iar-official.json" with { type: "json" };
import cardDataJson from "./generated/flesh-and-blood-card-data.json" with { type: "json" };
import printingDataJson from "./generated/flesh-and-blood-printings.json" with { type: "json" };
import { enumerateIarCatalogIdentities } from "./iar-cardvault-completeness.ts";
import {
  enumerateIarZombieCorpseInventory,
  IAR_ZOMBIE_CORPSE_LOOP_IDS,
  isIarZombieOrCorpseCard,
  type IarOfficialPrintedCard,
} from "./iar-zombie-corpse-inventory.ts";

const cardData = cardDataJson as SparseFleshAndBloodCardDataCatalog;
const printingData = printingDataJson as SparseFleshAndBloodPrintingsCatalog;
const officialPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../docs/releases/usurp-the-shadow-throne/cardvault-iar-official.json",
);

function officialCards(): IarOfficialPrintedCard[] {
  return officialJson.cards.map((card) => ({
    name: card.name,
    collectorNumber: card.collectorNumber,
    pitch: card.pitch,
    typeText: card.typeText,
    functionalText: card.functionalText,
    rarity: card.rarity,
    setCode: card.setCode,
  }));
}

describe("IAR zombie/corpse inventory from Card Vault oracle", () => {
  it("enumerates unique name+pitch rows from the committed oracle and generated IAR printings", () => {
    const onDisk = JSON.parse(readFileSync(officialPath, "utf8")) as typeof officialJson;
    expect(onDisk.cards).toHaveLength(officialJson.cards.length);

    const catalog = enumerateIarCatalogIdentities(cardData, printingData);
    const inventory = enumerateIarZombieCorpseInventory(officialCards(), catalog);

    expect(inventory.length).toBeGreaterThan(0);
    expect(new Set(inventory.map((row) => `${row.name}\0${row.pitch}`)).size).toBe(
      inventory.length,
    );
    expect(inventory.every((row) => isIarZombieOrCorpseCard(row))).toBe(true);
    expect(inventory.some((row) => row.name === "Corpse Cover")).toBe(false);

    const names = new Set(inventory.map((row) => row.name));
    expect(names.has("Malice")).toBe(true);
    expect(names.has("Malice, Domina of the Dead")).toBe(true);
    expect(names.has("Corrupted Corpse")).toBe(true);
    expect(
      inventory.some((row) => /Zombie Ally/iu.test(row.typeText) && /Restless/u.test(row.name)),
    ).toBe(true);
    expect(
      inventory.some(
        (row) =>
          row.name === "Commit to Corruption" ||
          row.name === "Acrid Stench" ||
          row.name === "Mark of Neverest",
      ),
    ).toBe(true);

    for (const loopId of IAR_ZOMBIE_CORPSE_LOOP_IDS) {
      expect(
        inventory.some((row) => row.loops.includes(loopId)),
        loopId,
      ).toBe(true);
    }

    const missingFromCatalog = inventory.filter((row) => !row.inGeneratedCatalog);
    expect(missingFromCatalog).toEqual([]);
    expect(cardData.provenance?.sourceRef).toBe("usurp-the-shadow-throne");
    expect(cardData.sets.some((set) => set.id === "IAR")).toBe(true);
  });
});
