import type { CyberpunkTestEngine } from "@tcg/cyberpunk-engine";
import type { ScenarioGroup, ScenarioId } from "../../../types/e2e";

export type { ScenarioGroup, ScenarioId };

export interface Scenario {
  id: ScenarioId;
  group: ScenarioGroup;
  label: string;
  description: string;
  build: () => CyberpunkTestEngine;
}
