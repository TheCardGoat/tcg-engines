import type { EmbracingPowerRetailStarterDeckCardDefinition } from "@tcg/cyberpunk-types";
import { embracingPowerRetailStarterDeckMinotaur } from "./minotaur.ts";

export { embracingPowerRetailStarterDeckMinotaur } from "./minotaur.ts";

export const embracingPowerRetailStarterDeckUnits = [
  embracingPowerRetailStarterDeckMinotaur,
] satisfies EmbracingPowerRetailStarterDeckCardDefinition[];
