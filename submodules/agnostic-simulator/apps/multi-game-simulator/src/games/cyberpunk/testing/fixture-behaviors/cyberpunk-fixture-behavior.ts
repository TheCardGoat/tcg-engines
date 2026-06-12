import type { PlayerId } from "@tcg/cyberpunk-engine";

import type { CyberpunkSimulatorPom } from "../cyberpunk-simulator-pom";
import type { ScenarioId } from "../../types/e2e";

export interface CyberpunkFixtureBehavior {
  readonly scenarioId: ScenarioId;
  readonly label: string;
  readonly references: readonly string[];
  readonly run: (pom: CyberpunkSimulatorPom) => Promise<void>;
}

export async function runCyberpunkFixtureBehavior(
  behavior: CyberpunkFixtureBehavior,
  pom: CyberpunkSimulatorPom,
): Promise<void> {
  await pom.waitForReady();
  await pom.expectStructuralState();
  await behavior.run(pom);
  await pom.expectStructuralState();
}

export function expectEqual<T>(label: string, actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`Expected ${label} to be ${String(expected)}, got ${String(actual)}.`);
  }
}

export function expectDefined<T>(label: string, value: T | null | undefined): T {
  if (value === null || value === undefined) {
    throw new Error(`Expected ${label} to be defined.`);
  }
  return value;
}

export function playerLabel(player: PlayerId): string {
  return String(player);
}
