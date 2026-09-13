import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const srcRoot = import.meta.dirname;

function source(path: string): string {
  return readFileSync(join(srcRoot, path), "utf8");
}

describe("FAB state-domain decomposition structure", () => {
  it("gives zones and objects one authoritative definition", () => {
    const aggregateState = source("state.ts");
    const zones = source("game/zones.ts");
    const objects = source("game/objects.ts");

    expect(zones).toMatch(/export type FabZoneKind/);
    expect(zones).toMatch(/export function createEmptyFabZones/);
    expect(objects).toMatch(/export interface FabObjectRecord/);
    expect(objects).toMatch(/export type FabLkiId/);

    expect(aggregateState).not.toMatch(/export type FabZoneKind\s*=/);
    expect(aggregateState).not.toMatch(/export interface FabObjectRecord\s*{/);
    expect(aggregateState).not.toMatch(/export type FabLkiId\s*=/);
    expect(aggregateState).not.toMatch(/function createEmptyFabZones/);
  });

  it("gives identity, assets, turn, and combat one authoritative definition", () => {
    const aggregateState = source("state.ts");

    expect(source("game/identity.ts")).toMatch(/export type FabPlayerId/);
    expect(source("game/assets.ts")).toMatch(/export interface FabRulesAssets/);
    expect(source("game/turn.ts")).toMatch(/export type FabPhase/);
    expect(source("game/combat.ts")).toMatch(/export interface FabCombatState/);
    expect(aggregateState).not.toMatch(/export type FabPhase\s*=/);
    expect(aggregateState).not.toMatch(/export interface FabCombatState\s*{/);
    expect(aggregateState).toMatch(/FabPlayerState extends FabRulesAssets/);
  });

  it("keeps domain modules independent of the aggregate match state", () => {
    for (const path of [
      "game/identity.ts",
      "game/assets.ts",
      "game/zones.ts",
      "game/objects.ts",
      "game/lki.ts",
      "game/turn.ts",
      "game/combat.ts",
    ]) {
      expect(source(path), path).not.toMatch(/from ["']\.\.\/state\.ts["']/);
    }
    expect(source("game/objects.ts")).toMatch(/from ["']\.\/zones\.ts["']/);
    expect(source("game/lki.ts")).toMatch(/interface FabLkiStore/);
  });

  it("routes core runtime consumers to the owning domain", () => {
    expect(source("runtime-helpers.ts")).toMatch(/from ["']\.\/game\/lki\.ts["']/);
    expect(source("runtime-derived.ts")).toMatch(/from ["']\.\/game\/zones\.ts["']/);
    expect(source("snapshot/match-context.ts")).toMatch(/from ["']\.\.\/game\/objects\.ts["']/);
    expect(source("index.ts")).toMatch(/from ["']\.\/game\/zones\.ts["']/);
    expect(source("index.ts")).toMatch(/from ["']\.\/game\/objects\.ts["']/);
    expect(source("index.ts")).toMatch(/from ["']\.\/game\/combat\.ts["']/);
    expect(source("index.ts")).toMatch(/from ["']\.\/game\/assets\.ts["']/);
  });

  it("keeps priority, rules stack, and decisions in their existing explicit modules", () => {
    const aggregateState = source("state.ts");
    expect(aggregateState).toMatch(/import\("\.\/priority\.ts"\)\.FabPriorityWindow/);
    expect(aggregateState).toMatch(/rulesStack: FabRulesStackLayer\[\]/);
    expect(aggregateState).toMatch(/decision: FabDecision \| null/);
    expect(source("priority.ts")).toMatch(/export interface FabPriorityWindow/);
    expect(source("rules/layers.ts")).toMatch(/export type FabRulesStackLayer/);
    expect(source("rules/process.ts")).toMatch(/export type FabDecision\s*=/);
  });
});
