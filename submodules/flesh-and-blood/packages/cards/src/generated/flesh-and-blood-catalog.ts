import type {
  SparseFleshAndBloodCardDataCatalog,
  SparseFleshAndBloodPrintingsCatalog,
} from "@tcg/flesh-and-blood-types/catalog";
import { hydrateFleshAndBloodCatalogParts } from "../../../types/src/catalog-defaults.ts";
import cardDataJson from "./flesh-and-blood-card-data.json" with { type: "json" };
import printingsJson from "./flesh-and-blood-printings.json" with { type: "json" };

export const fleshAndBloodCatalog = hydrateFleshAndBloodCatalogParts(
  cardDataJson as SparseFleshAndBloodCardDataCatalog,
  printingsJson as SparseFleshAndBloodPrintingsCatalog,
);
