import type { DeckStrategyProfile, TacticalStrategyOptions } from "@tcg/cyberpunk-engine";

export type HeuristicsAbConfig = Pick<
  TacticalStrategyOptions,
  "maxDepth" | "maxNodes" | "branchLimit" | "abilityAware"
>;

export interface HeuristicsAbProfileOverride {
  blockDirectStealsAtLeast?: DeckStrategyProfile["blockDirectStealsAtLeast"];
  pacing?: DeckStrategyProfile["pacing"];
}

export function parseHeuristicsAbConfig(value: string): HeuristicsAbConfig {
  const config: HeuristicsAbConfig = {};
  for (const [key, raw] of parseAssignments(value)) {
    switch (key) {
      case "maxDepth":
        config.maxDepth = positiveInteger(key, raw);
        break;
      case "maxNodes":
        config.maxNodes = positiveInteger(key, raw);
        break;
      case "branchLimit":
        config.branchLimit = positiveInteger(key, raw);
        break;
      case "abilityAware":
        config.abilityAware = booleanValue(key, raw);
        break;
      default:
        throw new Error(`Unknown tactical config key: ${key}`);
    }
  }
  return config;
}

export function parseHeuristicsAbProfileOverride(value: string): HeuristicsAbProfileOverride {
  const override: HeuristicsAbProfileOverride = {};
  for (const [key, raw] of parseAssignments(value)) {
    switch (key) {
      case "blockDirectStealsAtLeast": {
        const threshold = finiteNumber(key, raw);
        if (threshold < 0) throw new Error(`${key} must be at least 0`);
        override.blockDirectStealsAtLeast = threshold;
        break;
      }
      case "pacing":
        if (raw !== "develop-first" && raw !== "attack-first") {
          throw new Error(`${key} must be develop-first or attack-first`);
        }
        override.pacing = raw;
        break;
      default:
        throw new Error(`Unknown deck profile override key: ${key}`);
    }
  }
  return override;
}

function parseAssignments(value: string): Array<readonly [string, string]> {
  return value
    .split(",")
    .filter(Boolean)
    .map((part) => {
      const separator = part.indexOf("=");
      if (separator <= 0 || separator === part.length - 1) {
        throw new Error(`Expected key=value, received: ${part}`);
      }
      return [part.slice(0, separator), part.slice(separator + 1)] as const;
    });
}

function finiteNumber(key: string, raw: string): number {
  const value = Number(raw);
  if (!Number.isFinite(value)) throw new Error(`${key} must be a finite number`);
  return value;
}

function positiveInteger(key: string, raw: string): number {
  const value = finiteNumber(key, raw);
  if (!Number.isInteger(value) || value < 1) throw new Error(`${key} must be a positive integer`);
  return value;
}

function booleanValue(key: string, raw: string): boolean {
  if (raw === "true") return true;
  if (raw === "false") return false;
  throw new Error(`${key} must be true or false`);
}
