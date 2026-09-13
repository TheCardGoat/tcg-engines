import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import type {
  SparseFleshAndBloodCardDataCatalog,
  SparseFleshAndBloodPrintingsCatalog,
} from "@tcg/flesh-and-blood-types/catalog";

import cardDataJson from "./generated/flesh-and-blood-card-data.json" with { type: "json" };
import printingDataJson from "./generated/flesh-and-blood-printings.json" with { type: "json" };
import officialJson from "../../../docs/releases/usurp-the-shadow-throne/cardvault-iar-official.json" with { type: "json" };
import {
  diffIarOfficialAgainstCatalog,
  enumerateIarCatalogIdentities,
  normalizeIarCollectorNumber,
  normalizeIarFunctionalText,
  type IarPrintedIdentity,
} from "./iar-cardvault-completeness.ts";

const cardData = cardDataJson as SparseFleshAndBloodCardDataCatalog;
const printingData = printingDataJson as SparseFleshAndBloodPrintingsCatalog;
const generatedDir = join(dirname(fileURLToPath(import.meta.url)), "generated");

function officialIdentities(): IarPrintedIdentity[] {
  return officialJson.cards.map((card) => ({
    name: card.name,
    setCode: card.setCode,
    collectorNumber: card.collectorNumber,
    pitch: card.pitch,
    color: card.color,
    typeText: card.typeText,
    types: [],
    cost: card.cost,
    power: card.power,
    defense: card.defense,
    health: card.health,
    functionalText: card.functionalText,
    rarity: card.rarity,
    printId: card.printId,
  }));
}

describe("IAR Card Vault catalog completeness", () => {
  it("enumerates IAR printings from the generated catalog JSON files", () => {
    const cardDataOnDisk = JSON.parse(
      readFileSync(join(generatedDir, "flesh-and-blood-card-data.json"), "utf8"),
    ) as SparseFleshAndBloodCardDataCatalog;
    const printingDataOnDisk = JSON.parse(
      readFileSync(join(generatedDir, "flesh-and-blood-printings.json"), "utf8"),
    ) as SparseFleshAndBloodPrintingsCatalog;

    expect(cardData.provenance?.sha256).toBe(cardDataOnDisk.provenance?.sha256);
    expect(printingData.catalogSha256).toBe(cardData.provenance?.sha256);
    expect(printingDataOnDisk.catalogSha256).toBe(cardDataOnDisk.provenance?.sha256);

    const catalog = enumerateIarCatalogIdentities(cardData, printingData);
    const iarSet = cardData.sets.find((set) => set.id === "IAR");

    expect(iarSet?.id).toBe("IAR");
    expect(iarSet?.name).toBe("??? Set 20 ???");
    expect(cardData.provenance?.sourceRef).toBe("usurp-the-shadow-throne");
    expect(cardData.provenance?.productionEligible).toBe(false);
    expect(catalog.length).toBeGreaterThan(0);
    expect(catalog.every((row) => row.setCode === "IAR")).toBe(true);
    expect(
      catalog.some((row) => row.collectorNumber === "IAR000" && row.name === "Soul of Existence"),
    ).toBe(true);
  });

  it("diffs every official Card Vault product identity against the generated catalog", () => {
    expect(officialJson.productInventoryCount).toBe(260);
    expect(officialJson.cards).toHaveLength(260);
    expect(new Set(officialJson.cards.map((card) => `${card.name}\0${card.pitch}`)).size).toBe(260);
    expect(new Set(officialJson.cards.map((card) => card.collectorNumber)).size).toBe(260);
    expect(officialJson.cards.every((card) => card.setCode === "IAR")).toBe(true);
    expect(
      officialJson.cards.map((card) =>
        normalizeIarCollectorNumber(card.printId ?? card.collectorNumber),
      ),
    ).toEqual(officialJson.cards.map((card) => card.collectorNumber));

    const catalog = enumerateIarCatalogIdentities(cardData, printingData);
    const report = diffIarOfficialAgainstCatalog(officialIdentities(), catalog);

    expect(report.officialUniqueNamePitch).toBe(260);
    expect(report.officialUniqueCollectorNumbers).toBe(260);
    expect(report.catalogUniqueCollectorNumbers).toBe(258);
    expect(report.complete).toBe(
      report.missingInCatalog.length === 0 && report.mismatchedFields.length === 0,
    );
    expect(report.complete).toBe(false);
    expect(report.missingInCatalog.map((row) => row.collectorNumber).sort()).toEqual([
      "IAR050",
      "IAR051",
      "IAR052",
      "IAR224",
      "IAR225",
      "IAR226",
    ]);
    expect(
      report.missingInCatalog.map((row) => `${row.name} (${row.pitch || "—"})`).sort(),
    ).toEqual([
      "Dark Arcanite Gloves (—)",
      "Dark Arcanite Helm (—)",
      "Dark Arcanite Plating (—)",
      "Rise to the Challenge (1)",
      "Rise to the Challenge (2)",
      "Rise to the Challenge (3)",
    ]);
    expect([...new Set(report.extraInCatalog.map((row) => row.collectorNumber))].sort()).toEqual([
      "IAR158",
      "IAR159",
      "IAR222",
      "IAR666",
    ]);

    const defenseMismatches = report.mismatchedFields.filter(
      (row) => row.field === "defense" && row.collectorNumber === "IAR020",
    );
    expect(defenseMismatches).toEqual([
      {
        collectorNumber: "IAR020",
        name: "Cleave the Heavens",
        pitch: "1",
        field: "defense",
        official: "2",
        catalog: "3",
      },
    ]);

    const soulText = report.mismatchedFields.find(
      (row) => row.collectorNumber === "IAR000" && row.field === "functionalText",
    );
    expect(soulText?.official).toBe(
      normalizeIarFunctionalText(
        "**Legendary** _(You may only have 1 Soul of Existence in your deck.)_{br}When this is pitched, lose 1{h}.",
      ),
    );
    expect(soulText?.catalog).toBe("Legendary\nWhen this is pitched, lose 1{h}.");
    expect(report.mismatchedFields.length).toBeGreaterThan(0);
  });
});
