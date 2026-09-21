import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import {
  quoteFabActivation,
  beginFabActivationProcedure,
} from "../procedures/activate-ability/index.ts";
import { dispatchLayerDecision } from "./decision-dispatch/dispatch-decision.ts";
import {
  engineZoneToCatalog,
  catalogZoneToEngine,
  isArenaZone,
  normalizeToCatalogZone,
} from "./zones.ts";
import { compileFabContinuousEffect } from "./continuous/compiler.ts";
import { reduceFabGameEvent } from "../kernel/event-reducer.ts";
import { proposeLayerResolutionEvents } from "./effect-event-proposals.ts";
import { continuousSubjectKey } from "./continuous/subject-key.ts";
import { comparePrimitive, matchesNumericComparison } from "./evaluation/compare.ts";
import {
  beginFabPlayProcedure,
  executeFabPlayQuote,
  resumeFabPlayDeclaration,
  resumeFabPlayPayment,
} from "../procedures/play-card/index.ts";
import {
  beginFabEndTurnProcedure,
  advanceFabEndTurnProcedure,
  resumeFabTurnPitchOrder,
} from "../procedures/turn/index.ts";
import { submitFabDecision, parseFabDecisionAnswer } from "../procedures/decisions/index.ts";
import { executeFabEventTransaction } from "../kernel/transaction/index.ts";
import {
  advanceFabRulesProcessToBoundary,
  stabilizeFabRulesStateAtBoundary,
  finishDeferredFabRulesProcess,
  reconcileFabContinuousEffectsForPreview,
} from "../kernel/process-runner/index.ts";

const srcRoot = join(import.meta.dirname, "..");
const rulesRoot = join(srcRoot, "rules");
const proceduresRoot = join(srcRoot, "procedures");
const kernelRoot = join(srcRoot, "kernel");

function nonEmptyLines(src: string): number {
  return src.split("\n").filter((l) => l.trim().length > 0).length;
}

describe("modular-dispatch structure", () => {
  it("activation stages own real handler bodies (not 1-line re-exports)", () => {
    expect(typeof quoteFabActivation).toBe("function");
    expect(typeof beginFabActivationProcedure).toBe("function");
    for (const stage of ["quote", "begin", "declarations", "payment"]) {
      const path = join(proceduresRoot, "activate-ability/stages", `${stage}.ts`);
      expect(existsSync(path)).toBe(true);
      const src = readFileSync(path, "utf8");
      const lines = src.split("\n").filter((l) => l.trim().length > 0);
      expect(lines.length).toBeGreaterThan(20);
      expect(src).toMatch(/export function /);
      expect(src).not.toMatch(/^export \{[^}]+\} from ["']\.\.\/impl/);
    }
  });

  it("activation effect costs use exhaustive switch not open if-ladder", () => {
    const costs = readFileSync(join(proceduresRoot, "activate-ability/costs/parse.ts"), "utf8");
    expect(costs).toMatch(/if \(cost\.class === "effect"\)/);
    expect(costs).toMatch(/switch \(cost\.type\)/);
    expect(costs).toMatch(/_exhaustiveEffect:\s*never|_exhaustive:\s*never/);
    // Must not end the effect branch with a bare return null after if-ladder only
    const effectBlock = costs.slice(costs.indexOf('cost.class === "effect"'));
    const switchIdx = effectBlock.indexOf("switch (cost.type)");
    expect(switchIdx).toBeGreaterThan(0);
  });

  it("centralizes zone vocabulary including trigger-matcher", () => {
    expect(engineZoneToCatalog("combatChain")).toBe("combat-chain");
    expect(catalogZoneToEngine("equipment-head")).toBe("head");
    expect(normalizeToCatalogZone("arena")).toBe("permanent");
    expect(normalizeToCatalogZone("combat-chain")).toBe("combat-chain");
    expect(isArenaZone("equipment-head")).toBe(true);
    expect(isArenaZone("head")).toBe(true);
    expect(isArenaZone("graveyard")).toBe(false);
    const tm = readFileSync(join(rulesRoot, "trigger-matcher.ts"), "utf8");
    expect(tm).toMatch(/normalizeToCatalogZone/);
    expect(tm).not.toMatch(/case "equipment-head":\s*\n\s*case "equipment-chest"/);
  });

  it("exports exhaustive layer decision dispatch with per-kind modules", () => {
    expect(typeof dispatchLayerDecision).toBe("function");
    const dispatch = readFileSync(
      join(rulesRoot, "decision-dispatch/dispatch-decision.ts"),
      "utf8",
    );
    expect(dispatch).toContain("assertNever");
    for (const kind of ["optional", "opt", "choice", "search", "target"]) {
      const path = join(rulesRoot, "decision-dispatch/decisions", `${kind}.ts`);
      expect(existsSync(path)).toBe(true);
      expect(readFileSync(path, "utf8").split("\n").length).toBeGreaterThan(15);
    }
  });

  it("routes every production event commit through the FAB kernel facade", () => {
    const facade = readFileSync(join(kernelRoot, "commit.ts"), "utf8");
    expect(facade).toContain("export function commitFabKernelBatch");
    expect(facade).toContain("reduceFabGameEvent");

    const commitSites = [
      join(srcRoot, "runtime-transaction-options.ts"),
      join(kernelRoot, "trigger-declaration.ts"),
      join(kernelRoot, "event-journal.ts"),
      join(kernelRoot, "transaction", "work-group.ts"),
      join(kernelRoot, "continuous-reconcile.ts"),
    ];
    for (const path of commitSites) {
      const source = readFileSync(path, "utf8");
      expect(source).toContain("commitFabKernelBatch");
      expect(source).not.toContain("commitProposedEventBatch(");
      expect(source).not.toContain("reduceFabGameEvent");
    }
  });

  it("keeps durable target and optional decision publication under kernel ownership", () => {
    expect(existsSync(join(rulesRoot, "decision-builders.ts"))).toBe(false);
    for (const module of ["decision-builders.ts", "decision-state.ts"]) {
      expect(existsSync(join(kernelRoot, module))).toBe(true);
    }
    const triggerDeclaration = readFileSync(join(kernelRoot, "trigger-declaration.ts"), "utf8");
    expect(triggerDeclaration).toMatch(
      /publishFabDecision\(\s*state,\s*createFabEntityTargetDecision/,
    );
    for (const path of [
      join(proceduresRoot, "turn/stages/cleanup.ts"),
      join(rulesRoot, "decision-dispatch/decisions/optional.ts"),
      join(rulesRoot, "decision-dispatch/decisions/target.ts"),
    ]) {
      const source = readFileSync(path, "utf8");
      expect(source).toContain("publishFabDecision");
      expect(source).not.toMatch(/state\.decision\s*=/);
    }
  });

  it("splits zone-moves into per-event-family modules and deletes the orphan twin", () => {
    expect(existsSync(join(rulesRoot, "reducers/zone-moves/impl.ts"))).toBe(false);
    for (const fam of ["play-equip", "move", "draw-discard", "create-search", "index", "helpers"]) {
      expect(existsSync(join(rulesRoot, "reducers/zone-moves", `${fam}.ts`))).toBe(true);
    }
    const index = readFileSync(join(rulesRoot, "reducers/zone-moves/index.ts"), "utf8");
    expect(index).toMatch(/reducePlayEquip|reduceMove|reduceDrawDiscard|reduceCreateSearch/);
    expect(index).toMatch(/assertNeverZoneMove/);
    // Family modules must contain real switch bodies
    for (const fam of ["play-equip", "move", "draw-discard", "create-search"]) {
      const src = readFileSync(join(rulesRoot, "reducers/zone-moves", `${fam}.ts`), "utf8");
      expect(src.split("\n").length).toBeGreaterThan(40);
      expect(src).toMatch(/switch \(event\.name\)/);
    }
  });

  it("canonical continuous subject keys are string-equal across subject kinds", () => {
    expect(typeof continuousSubjectKey).toBe("function");
    expect(continuousSubjectKey({ kind: "game" })).toBe("game");
    expect(continuousSubjectKey({ kind: "player", playerId: "p1" })).toBe("player:p1");
    expect(
      continuousSubjectKey({
        kind: "object",
        ref: { instanceId: "obj-1", incarnation: 2 },
      }),
    ).toBe("object:obj-1#2");
    // Same subject → same key (identity contract used by ordering / reconciliation)
    const subject = {
      kind: "object" as const,
      ref: { instanceId: "x", incarnation: 0 },
    };
    expect(continuousSubjectKey(subject)).toBe(continuousSubjectKey(subject));
  });

  it("former continuousSubjectKey forks import the canonical helper", () => {
    const sites = [
      "../kernel/continuous-reconcile.ts",
      "rules-evaluator.ts",
      "reducers/continuous-effects.ts",
      "continuous/reconciler.ts",
    ];
    for (const rel of sites) {
      const path = join(rulesRoot, rel);
      expect(existsSync(path)).toBe(true);
      const src = readFileSync(path, "utf8");
      expect(src).toMatch(/continuousSubjectKey/);
      expect(src).not.toMatch(/function continuousSubjectKey\s*\(/);
    }
    // Kernel reconciliation uses the canonical subject-key helper.
    const continuousReconcile = readFileSync(join(kernelRoot, "continuous-reconcile.ts"), "utf8");
    expect(continuousReconcile).toMatch(/from ["'].*subject-key/);
  });

  it("comparison operators use evaluation comparePrimitive / matchesNumericComparison", () => {
    expect(comparePrimitive(3, "gt", 2)).toBe(true);
    expect(matchesNumericComparison(5, { op: "eq", value: 5 })).toBe(true);
    expect(matchesNumericComparison(5, { op: "eq", value: "x" })).toBe(false);
    const replacement = readFileSync(join(kernelRoot, "replacements/collect.ts"), "utf8");
    expect(replacement).toMatch(/matchesNumericComparison/);
    expect(replacement).not.toMatch(/function comparisonMatches\s*\(/);
    const trigger = readFileSync(join(rulesRoot, "trigger-matcher.ts"), "utf8");
    expect(trigger).toMatch(/comparePrimitive/);
    expect(trigger).not.toMatch(/function matchesComparison\s*\(/);
  });

  it("continuous compiler is a modular package sharing evaluation assertNever", () => {
    expect(existsSync(join(rulesRoot, "continuous/compiler.ts"))).toBe(true);
    expect(existsSync(join(rulesRoot, "continuous/compiler/index.ts"))).toBe(true);
    expect(existsSync(join(rulesRoot, "continuous/compiler/dependencies.ts"))).toBe(true);
    expect(existsSync(join(rulesRoot, "continuous/compiler/compile-node.ts"))).toBe(true);
    const deps = readFileSync(join(rulesRoot, "continuous/compiler/dependencies.ts"), "utf8");
    expect(deps).toMatch(/from ["'].*evaluation\/assert-never/);
    expect(deps).toMatch(/assertNever/);
    expect(typeof compileFabContinuousEffect).toBe("function");
    expect(typeof proposeLayerResolutionEvents).toBe("function");
    expect(typeof reduceFabGameEvent).toBe("function");
    const result = compileFabContinuousEffect({
      effectId: "test-effect",
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: { selector: "self" },
        duration: "this-turn",
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.atoms.length).toBeGreaterThan(0);
  });

  it("play procedure stage modules own real bodies with stable façade exports", () => {
    expect(typeof beginFabPlayProcedure).toBe("function");
    expect(typeof executeFabPlayQuote).toBe("function");
    expect(typeof resumeFabPlayDeclaration).toBe("function");
    expect(typeof resumeFabPlayPayment).toBe("function");
    for (const stage of ["quote", "declarations", "payment", "finalize"]) {
      const path = join(proceduresRoot, "play-card", `${stage}.ts`);
      expect(existsSync(path)).toBe(true);
      const src = readFileSync(path, "utf8");
      expect(nonEmptyLines(src)).toBeGreaterThan(20);
      expect(src).toMatch(/export function /);
    }
  });

  it("end-turn stage modules own real bodies with exhaustive advance dispatch", () => {
    expect(typeof beginFabEndTurnProcedure).toBe("function");
    expect(typeof advanceFabEndTurnProcedure).toBe("function");
    expect(typeof resumeFabTurnPitchOrder).toBe("function");
    for (const stage of ["cleanup", "board", "pitch", "turn"]) {
      const path = join(proceduresRoot, "turn/stages", `${stage}.ts`);
      expect(existsSync(path)).toBe(true);
      const src = readFileSync(path, "utf8");
      expect(nonEmptyLines(src)).toBeGreaterThan(20);
      expect(src).toMatch(/export function /);
    }
    const advance = readFileSync(join(proceduresRoot, "turn/advance.ts"), "utf8");
    // Exhaustive switch on captured stage const — new FabEndTurnProcedure stage → tsc force-update
    expect(advance).toMatch(/const stage = endTurn\.stage|const stage = procedure\.stage/);
    expect(advance).toMatch(/switch \(stage\)/);
    expect(advance).toMatch(/_exhaustive:\s*never\s*=\s*stage/);
    expect(advance).not.toMatch(/as\s*\{\s*stage:\s*string\s*\}/);
  });

  it("decision-resumer continuation modules own real bodies", () => {
    expect(typeof submitFabDecision).toBe("function");
    expect(typeof parseFabDecisionAnswer).toBe("function");
    for (const cont of ["triggers", "layer", "procedures", "replacement"]) {
      const path = join(proceduresRoot, "decisions/continuations", `${cont}.ts`);
      expect(existsSync(path)).toBe(true);
      const src = readFileSync(path, "utf8");
      expect(nonEmptyLines(src)).toBeGreaterThan(20);
      expect(src).toMatch(/export function /);
    }
    const registry = readFileSync(
      join(proceduresRoot, "decisions/continuation-registry.ts"),
      "utf8",
    );
    expect(registry).toMatch(/satisfies Record<ContinuationKind, ContinuationHandler>/);
    expect(registry).toMatch(/resumeFabDecisionContinuation/);
  });

  it("keeps event transactions, trigger declaration, and reconciliation under kernel ownership", () => {
    expect(typeof executeFabEventTransaction).toBe("function");
    expect(typeof advanceFabRulesProcessToBoundary).toBe("function");
    expect(typeof stabilizeFabRulesStateAtBoundary).toBe("function");
    expect(typeof finishDeferredFabRulesProcess).toBe("function");
    expect(typeof reconcileFabContinuousEffectsForPreview).toBe("function");
    for (const mod of [
      "types.ts",
      "equip-bootstrap.ts",
      "replacement-resume.ts",
      "boundary.ts",
      "index.ts",
    ]) {
      expect(existsSync(join(kernelRoot, "process-runner", mod))).toBe(true);
    }
    for (const mod of [
      "commit.ts",
      "transaction/index.ts",
      "continuous-reconcile.ts",
      "trigger-declaration.ts",
      "transaction-kernel.ts",
    ]) {
      expect(existsSync(join(kernelRoot, mod))).toBe(true);
    }
    expect(existsSync(join(kernelRoot, "process-runner", "transaction-core.ts"))).toBe(false);
    expect(existsSync(join(kernelRoot, "process-runner", "continuous-reconcile.ts"))).toBe(false);
    expect(existsSync(join(rulesRoot, "process-runner.ts"))).toBe(false);
    expect(existsSync(join(rulesRoot, "kernel"))).toBe(false);
  });

  it("routes every rules-process stage change through the transition door", () => {
    const walk = (root: string): string[] =>
      readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
        const path = join(root, entry.name);
        if (entry.isDirectory()) return walk(path);
        return entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts") ? [path] : [];
      });
    // Receiver-agnostic: any `.stage =` write in production src is an offender
    // unless it is the nested procedure machine or the door itself. The field
    // is readonly on FabRulesProcess, so direct writes only compile inside
    // copy-on-write drafts — this walk is what catches those and stray casts.
    const stageWrite = /\.stage\s*=(?!=)/;
    const procedureStageWrite =
      /(?:\w+\.)+procedure(?:\?\.|!)\.stage\s*=(?!=)|\bprocedure\.stage\s*=(?!=)/;
    const offenders: string[] = [];
    for (const path of walk(srcRoot)) {
      if (path.endsWith(join("kernel", "process-state.ts"))) continue;
      const source = readFileSync(path, "utf8");
      const offendingLine = source
        .split("\n")
        .find(
          (line) =>
            stageWrite.test(line) &&
            !procedureStageWrite.test(line) &&
            !/\.procedure!\.stage/.test(line),
        );
      if (offendingLine) offenders.push(`${relative(srcRoot, path)}: ${offendingLine.trim()}`);
    }
    expect(offenders).toEqual([]);
  });

  it("keeps completed event and player-log history out of production state paths", () => {
    const state = readFileSync(join(srcRoot, "state.ts"), "utf8");
    const rulesView = readFileSync(join(rulesRoot, "state-rules-view.ts"), "utf8");
    const runtime = readFileSync(join(srcRoot, "runtime.ts"), "utf8");
    const transaction = readFileSync(join(kernelRoot, "transaction", "index.ts"), "utf8");
    const workGroup = readFileSync(join(kernelRoot, "transaction", "work-group.ts"), "utf8");

    // `committedEvents` is legal only as a bounded continuation field on an
    // active rules process; match state and rules facts must never fall back to
    // completed match history. Player-visible logs are dispatch receipts.
    expect(state).not.toMatch(/interface FabMatchState[\s\S]*?committedEvents/);
    expect(state).not.toMatch(/interface FabMatchState[\s\S]*?\blog:\s*/);
    expect(rulesView).not.toMatch(/committedEvents/);
    expect(runtime).not.toMatch(/state\.log|state\.committedEvents/);
    expect(workGroup).toMatch(/function executeTransactionWorkGroup/);
    expect(transaction).toMatch(
      /function executeFabEventTransaction[\s\S]*executeTransactionWorkGroup/,
    );
    expect(transaction).toMatch(
      /function executeFabEventJournalTransaction[\s\S]*executeTransactionWorkGroup/,
    );
  });
  it("layer-resolution decision discovery is exhaustive switch not fallthrough if-ladder", () => {
    const source = readFileSync(join(proceduresRoot, "layer-resolution/find-decision.ts"), "utf8");
    const ownership = readFileSync(
      join(srcRoot, "../../types/src/abilities/discriminant-ownership.ts"),
      "utf8",
    );
    const types = [
      ...ownership.slice(ownership.indexOf("export const FAB_EFFECT_TYPES")).matchAll(/"([^"]+)"/g),
    ].map((match) => match[1]);
    const fn = source.slice(source.indexOf("export function findDecision"));
    expect(fn).toMatch(/switch \(effect\.type\)/);
    expect(fn).toMatch(/assertNever\(effect/);
    expect(types.length).toBeGreaterThan(50);
    for (const type of types) {
      expect(fn, type).toContain(`case "${type}":`);
    }
  });

  it("countable-amount evaluation is exhaustive never not a default throw", () => {
    const source = readFileSync(join(rulesRoot, "evaluation/amounts/count.ts"), "utf8");
    expect(source).toMatch(/assertNever\(amount, "FabCountable"\)/);
    expect(source).not.toMatch(/throw new FabRulesEvaluationError\(`count \$\{amount\.what\}`\)/);
  });

  it("admitted replacement apply cannot identity-passthrough", () => {
    const source = readFileSync(join(kernelRoot, "replacements/apply.ts"), "utf8");
    const applyFn = source.slice(
      source.indexOf("function applyReplacement"),
      source.indexOf("function applyNumericReplacement"),
    );
    expect(applyFn).toMatch(/throw unhandledAdmittedReplacement\(candidate, event\)/);
    expect(applyFn).toMatch(/supportedCanonicalReplacement\(effect\)/);
  });
});
