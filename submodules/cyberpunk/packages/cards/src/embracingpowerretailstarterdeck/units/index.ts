import type { UnitCardDefinition } from "@tcg/cyberpunk-types";
import { embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay } from "./goro-takemura-losing-his-way.ts";
import { embracingPowerRetailStarterDeckMinotaur } from "./minotaur.ts";

export { embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay } from "./goro-takemura-losing-his-way.ts";
export { embracingPowerRetailStarterDeckMinotaur } from "./minotaur.ts";

export const embracingPowerRetailStarterDeckUnits = [
  embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
  embracingPowerRetailStarterDeckMinotaur,
] satisfies UnitCardDefinition[];
