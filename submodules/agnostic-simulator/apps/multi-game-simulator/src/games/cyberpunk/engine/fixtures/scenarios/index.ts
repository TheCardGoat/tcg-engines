import type { Scenario, ScenarioGroup, ScenarioId } from "./types";
import { coreScenarios } from "./core";
import { gearScenarios } from "./gears";
import { legendScenarios } from "./legends";
import { programScenarios } from "./programs";
import { unitScenarios } from "./units";

export type { Scenario, ScenarioGroup, ScenarioId } from "./types";
export { P1, P2 } from "./shared";

const SCENARIOS: Scenario[] = [
  ...coreScenarios,
  ...programScenarios,
  ...gearScenarios,
  ...legendScenarios,
  ...unitScenarios,
];

export function getScenario(id: ScenarioId): Scenario {
  const found = SCENARIOS.find((s) => s.id === id);
  if (!found) {
    throw new Error(`Unknown scenario: ${id}`);
  }
  return found;
}

export function listScenarios(): readonly Scenario[] {
  return SCENARIOS;
}

export const SCENARIO_GROUPS: readonly { id: ScenarioGroup; label: string }[] = [
  { id: "core", label: "Core" },
  { id: "program-spend", label: "Program · Spend" },
  { id: "program-bounce", label: "Program · Bounce" },
  { id: "program-gig", label: "Program · Gig" },
  { id: "program-power", label: "Program · Power Buff" },
  { id: "program-gig-manipulation", label: "Program · Gig Manipulation" },
  { id: "program-cost-modifier", label: "Program · Cost Modifier" },
  { id: "program-legend-call", label: "Program · Legend Call" },
  { id: "gear-attack-trigger", label: "Gear · Attack Trigger" },
  { id: "gear-blocker", label: "Gear · Blocker" },
  { id: "gear-stat-boost", label: "Gear · Stat Boost" },
  { id: "gear-rush", label: "Gear · Rush" },
  { id: "gear-fight-reward", label: "Gear · Fight Reward" },
  { id: "gear-gig-steal", label: "Gear · Gig Steal" },
  { id: "gear-spent-trigger", label: "Gear · Spent Trigger" },
  { id: "legend-go-solo", label: "Legend · Go Solo" },
  { id: "legend-passive", label: "Legend · Passive" },
  { id: "legend-attack-trigger", label: "Legend · Attack Trigger" },
  { id: "legend-call-trigger", label: "Legend · Call Trigger" },
  { id: "legend-defeated", label: "Legend · Defeated" },
  { id: "unit-blocker", label: "Unit · Blocker" },
  { id: "unit-gig-stolen", label: "Unit · Gig Stolen" },
  { id: "unit-power-scaling", label: "Unit · Power Scaling" },
  { id: "unit-street-cred", label: "Unit · Street Cred" },
  { id: "unit-play-trigger", label: "Unit · Play Trigger" },
  { id: "unit-attack-trigger", label: "Unit · Attack Trigger" },
  { id: "unit-defeated", label: "Unit · Defeated" },
  { id: "unit-gig-condition", label: "Unit · Gig Condition" },
  { id: "unit-rush", label: "Unit · Rush" },
];

export const DEFAULT_SCENARIO: ScenarioId = "openingMain";
