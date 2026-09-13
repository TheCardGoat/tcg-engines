/** FAB-owned validation exposed through the platform adapter boundary. */
export * from "@tcg/flesh-and-blood-engine/deck-validation";
import type { FabDeckbuildingRules } from "@tcg/flesh-and-blood-engine/deck-validation";
import { z } from "zod";

export const fabDeckbuildingRulesSchema = z.object({
  names: z.array(z.string()),
  heroMetatypes: z.array(z.string()),
  specializationHeroes: z.array(z.string()),
  essence: z.array(z.string()),
  legendary: z.boolean(),
  unlimited: z.boolean(),
  ephemeral: z.boolean(),
  modular: z.boolean(),
  perched: z.boolean(),
  pairsWith: z.array(z.string()),
  anySpecialization: z.boolean(),
  swordsAsOneHanded: z.boolean(),
  equipRestrictions: z.array(z.object({ types: z.array(z.string()) })),
}) satisfies z.ZodType<FabDeckbuildingRules>;
