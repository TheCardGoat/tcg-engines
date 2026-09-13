#!/usr/bin/env node
/**
 * Diagnose a rejected FAB snapshot dump from reports/snapshot-fuzz/*.json.
 * Bisects hasValidRuntimeGraphs by nulling one component at a time, then
 * drills into the failing pieces with targeted predicate replays.
 *
 *   node --experimental-transform-types --no-warnings scripts/diagnose-snapshot-dump.ts <dump.json>
 */
import { readFileSync } from "node:fs";
import { hasValidRuntimeGraphs } from "../src/snapshot/validators.ts";

const dumpPath = process.argv[2];
if (!dumpPath) {
  console.error("usage: diagnose-snapshot-dump.ts <dump.json>");
  process.exit(1);
}
const dump = JSON.parse(readFileSync(dumpPath, "utf8")) as {
  seed: string;
  rejectedSnapshot: Record<string, unknown>;
};
const record = dump.rejectedSnapshot;
const context = {
  playerIds: new Set(record.playerIds as string[]),
  objects: record.objects as Record<string, unknown>,
  attackProxies: record.attackProxies as Record<string, unknown>,
  lkiArena: record.lkiArena as Record<string, unknown>,
  stateID: record.stateID as number,
  rulesStack: record.rulesStack as unknown[],
  rulesProcess: record.rulesProcess,
};
const decision = record.decision;
const rulesProcess = record.rulesProcess;
const rulesStack = record.rulesStack as unknown[];
const continuousEffectInstances = record.continuousEffectInstances as unknown[];
const continuousOrderingDecisions = record.continuousOrderingDecisions as unknown[];

console.log("seed:", dump.seed);
console.log(
  "full hasValidRuntimeGraphs:",
  hasValidRuntimeGraphs(
    decision,
    rulesProcess,
    rulesStack,
    continuousEffectInstances,
    continuousOrderingDecisions,
    context,
  ),
);
console.log(
  "  decision null      :",
  hasValidRuntimeGraphs(
    null,
    rulesProcess,
    rulesStack,
    continuousEffectInstances,
    continuousOrderingDecisions,
    context,
  ),
);
console.log(
  "  process null       :",
  hasValidRuntimeGraphs(
    decision,
    null,
    rulesStack,
    continuousEffectInstances,
    continuousOrderingDecisions,
    context,
  ),
);
console.log(
  "  stack []           :",
  hasValidRuntimeGraphs(
    decision,
    rulesProcess,
    [],
    continuousEffectInstances,
    continuousOrderingDecisions,
    context,
  ),
);
console.log(
  "  continuous []      :",
  hasValidRuntimeGraphs(
    decision,
    rulesProcess,
    rulesStack,
    [],
    continuousOrderingDecisions,
    context,
  ),
);
console.log(
  "  continuousOrd []   :",
  hasValidRuntimeGraphs(decision, rulesProcess, rulesStack, continuousEffectInstances, [], context),
);

// Drill into the rules process effectChoices / effectOptions — prime suspects
// when the process is mid-procedure with a layer on the stack.
if (rulesProcess && typeof rulesProcess === "object") {
  const process = rulesProcess as Record<string, unknown>;
  console.log("\nprocess stage:", process.stage, "resolvingLayerId:", process.resolvingLayerId);
  console.log("effectChoices keys:", Object.keys(process.effectChoices ?? {}));
  console.log("effectOptions:", JSON.stringify(process.effectOptions));
  console.log("procedure kind:", (process.procedure as Record<string, unknown> | null)?.kind);
  for (const group of (process.resolutionEventGroups ?? []) as Record<string, unknown>[]) {
    console.log(
      "resolution group:",
      group.eventGroupId,
      "events:",
      (group.events as unknown[]).length,
    );
  }
}

// Check each stack layer's bindings against live/LKI object ids.
for (const layer of rulesStack as Record<string, unknown>[]) {
  const source = layer.source as Record<string, unknown> | undefined;
  const sourceId = source?.instanceId as string | undefined;
  const sourceLive = sourceId ? context.objects[sourceId] : undefined;
  const sourceLki = Object.values(context.lkiArena).some(
    (lki) =>
      lki &&
      typeof lki === "object" &&
      (lki as Record<string, unknown>).ref &&
      (lki as { ref: { instanceId: string } }).ref.instanceId === sourceId,
  );
  console.log(
    `\nlayer ${String(layer.layerId)} kind=${String(layer.kind)} controller=${String(layer.controllerId)}`,
    `source=${sourceId} live=${Boolean(sourceLive)} lki=${sourceLki}`,
  );
  console.log("  bindings:", JSON.stringify(layer.bindings));
  console.log("  targets:", JSON.stringify(layer.targets));
  for (const [key, value] of Object.entries((layer.bindings ?? {}) as Record<string, unknown>)) {
    const entries = Array.isArray(value) ? value : [value];
    for (const entry of entries) {
      if (entry && typeof entry === "object" && "ref" in (entry as Record<string, unknown>)) {
        const ref = (entry as { ref: { instanceId: string; incarnation: number } }).ref;
        const live = context.objects[ref.instanceId] as Record<string, unknown> | undefined;
        const liveOk = live && live.incarnation === ref.incarnation;
        const lkiOk = Object.values(context.lkiArena).some(
          (lki) =>
            lki &&
            typeof lki === "object" &&
            (lki as { ref?: { instanceId: string; incarnation: number } }).ref?.instanceId ===
              ref.instanceId &&
            (lki as { ref: { incarnation: number } }).ref.incarnation === ref.incarnation,
        );
        console.log(
          `  binding ${key}: ref ${ref.instanceId}:${ref.incarnation} live=${Boolean(liveOk)} lki=${lkiOk}`,
        );
      }
    }
  }
}

// Mutation bisect inside hasValidRulesProcess.
const mutations: Array<[string, (p: Record<string, unknown>) => void]> = [
  [
    "drop effectChoices",
    (p) => {
      delete p.effectChoices;
    },
  ],
  [
    "drop effectOptions",
    (p) => {
      delete p.effectOptions;
    },
  ],
  [
    "empty resolutionEventGroups",
    (p) => {
      p.resolutionEventGroups = [];
    },
  ],
  [
    "null procedure",
    (p) => {
      p.procedure = null;
    },
  ],
  [
    "drop pitchOrders",
    (p) => {
      const proc = p.procedure as Record<string, unknown> | null;
      if (proc) delete proc.pitchOrders;
    },
  ],
];
for (const [label, mutate] of mutations) {
  const process = structuredClone(rulesProcess) as Record<string, unknown>;
  mutate(process);
  const ok = hasValidRuntimeGraphs(
    decision,
    process,
    rulesStack,
    continuousEffectInstances,
    continuousOrderingDecisions,
    context,
  );
  console.log(`mutate ${label}: hasValidRuntimeGraphs=${ok}`);
}
