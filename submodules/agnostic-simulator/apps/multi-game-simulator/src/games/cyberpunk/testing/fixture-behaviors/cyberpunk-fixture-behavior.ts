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

interface AttackStateView {
  readonly step?: string;
}

interface AttackResolutionPom {
  getAttackState(): Promise<AttackStateView | null>;
  resolveAttack(
    as: string,
    options?: { pass?: boolean; gigIdsToSteal?: readonly string[] },
  ): Promise<void>;
}

/**
 * Drive a declared attack to completion under the current engine contract:
 * declaring an attack opens the rival-owned react window, the rival's pass
 * hands priority back, and the mechanical fight/steal steps resolve from there
 * (auto-advancing when no decision is pending). Re-checks the attack state
 * before every call, so it is safe to use when the engine already resolved the
 * attack on the pass.
 */
export async function resolveAttackSteps(
  pom: AttackResolutionPom,
  rivalId: string,
  attackerId: string,
): Promise<void> {
  let lastStep: string | undefined;
  for (let i = 0; i < 6; i += 1) {
    const attack = await pom.getAttackState();
    if (!attack) return;
    // A repeated step means the engine is suspended at a decision point (for
    // example fight-result triggers waiting on a pending choice) — hand
    // control back to the test, which knows how to resolve it.
    if (attack.step === lastStep) return;
    lastStep = attack.step;
    if (attack.step === "react") {
      await pom.resolveAttack(rivalId, { pass: true });
    } else {
      await pom.resolveAttack(attackerId);
    }
  }
  throw new Error("Attack did not resolve within the expected number of steps");
}

export function playerLabel(player: PlayerId): string {
  return String(player);
}
