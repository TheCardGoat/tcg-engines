import type { SparseFleshAndBloodCardDataCatalog } from "@tcg/flesh-and-blood-types/catalog";
import { hydrateFleshAndBloodCardDataCatalog } from "../../../types/src/catalog-defaults.ts";
import cardDataJson from "./flesh-and-blood-card-data.json" with { type: "json" };

export const fleshAndBloodCardData = hydrateFleshAndBloodCardDataCatalog(
  cardDataJson as SparseFleshAndBloodCardDataCatalog,
);
