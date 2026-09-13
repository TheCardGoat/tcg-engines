/// <reference types="node" />

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const srcRoot = join(import.meta.dirname, "..");
const extractedHandlers = [
  "activate-card",
  "activate-ability",
  "materialize",
  "bestow-boon",
  "concede",
  "skip-materialization",
  "return-preserved-card",
  "start-pregame-card",
  "complete-pregame-actions",
  "declare-attack",
  "pass",
  "answer-decision",
] as const;

function source(path: string): string {
  return readFileSync(join(srcRoot, path), "utf8");
}

describe("Grand Archive command handler decomposition", () => {
  it("keeps extracted command behavior in runtime-independent handler modules", () => {
    for (const name of extractedHandlers) {
      const handlerSource = source(`commands/handlers/${name}.ts`);
      expect(handlerSource, name).toMatch(/export function handleGrandArchive/);
      expect(handlerSource, name).not.toMatch(/from ["'](?:\.\.\/)+runtime\.ts["']/);
    }
  });

  it("limits handlers to an explicit match-owner capability context", () => {
    const contextSource = source("commands/handler-context.ts");
    expect(contextSource).toContain("getProgram");
    expect(contextSource).toContain("getState");
    expect(contextSource).toContain("replaceState");
    expect(contextSource).toContain("getKernel");
    expect(contextSource).toContain("commit");
    expect(contextSource).toContain("stabilize");
    expect(contextSource).toContain("failure");
    expect(contextSource).not.toMatch(/GrandArchiveMatchRuntime|runtime\.ts/);
  });

  it("removes extracted public command implementations from the match owner", () => {
    const runtimeSource = source("procedures/game-flow/runtime.ts");
    const handlerRegistrySource = source("commands/handlers/index.ts");
    expect(runtimeSource).not.toMatch(
      /#(?:activateCard|activateAbility|materialize|bestowBoon|concede|skipMaterialization|returnPreservedCard|startPregameCard|completePregameActions|declareAttack|pass|answerDecision)\(/,
    );
    expect(runtimeSource).toContain("createGrandArchiveCommandHandlers(context)");
    for (const handler of [
      "handleGrandArchiveActivateCard",
      "handleGrandArchiveActivateAbility",
      "handleGrandArchiveMaterialize",
      "handleGrandArchiveBestowBoon",
      "handleGrandArchiveConcede",
      "handleGrandArchiveSkipMaterialization",
      "handleGrandArchiveReturnPreservedCard",
      "handleGrandArchiveStartPregameCard",
      "handleGrandArchiveCompletePregameActions",
      "handleGrandArchiveDeclareAttack",
      "handleGrandArchivePass",
      "handleGrandArchiveAnswerDecision",
    ]) {
      expect(handlerRegistrySource).toContain(handler);
      expect(runtimeSource).not.toContain(handler);
    }
  });

  it("keeps pass-driven turn progression outside the match owner", () => {
    const runtimeSource = source("procedures/game-flow/runtime.ts");
    const procedureSource = source("procedures/turn-progression.ts");
    expect(runtimeSource).not.toMatch(
      /#(?:completeEmptyStackPassCycle|commitCombatDamage|drawPhaseEvents|recollectionEvents|endCleanupEvents|nextTurnEvents|automaticPhaseCompletionEvents|continueEndCleanup)\(/,
    );
    expect(procedureSource).toContain("completeGrandArchiveEmptyStackPassCycle");
    expect(procedureSource).toContain("completeGrandArchiveCombatDamageTransition");
    expect(procedureSource).toContain("continueGrandArchiveEndCleanup");
    expect(procedureSource).not.toMatch(/from ["']\.\.\/runtime\.ts["']/);
  });

  it("types decision continuations by their serialized decision kind", () => {
    const codecSource = source("procedures/decisions/answer-codec.ts");
    const allocationsSource = source("procedures/decisions/continuations/allocations.ts");
    const combatDeclarationsSource = source(
      "procedures/decisions/continuations/combat-declarations.ts",
    );
    const typesSource = source("procedures/decisions/types.ts");
    const combatSource = source("procedures/decisions/continuations/combat.ts");
    const effectDeclarationsSource = source(
      "procedures/decisions/continuations/effect-declarations.ts",
    );
    const glimpseSource = source("procedures/decisions/continuations/glimpse.ts");
    const systemSource = source("procedures/decisions/continuations/system.ts");
    const triggerSource = source("procedures/decisions/continuations/triggers.ts");
    const turnSource = source("procedures/decisions/continuations/turn.ts");
    const registrySource = source("procedures/decisions/continuation-registry.ts");
    const handlerSource = source("commands/handlers/answer-decision.ts");
    expect(typesSource).toContain("GrandArchiveDecisionFor");
    expect(typesSource).toContain("GrandArchiveDecisionResolver");
    expect(systemSource).toContain("grandArchiveSystemDecisionResolvers");
    expect(systemSource).toContain("satisfies");
    expect(systemSource).not.toMatch(/from ["'](?:\.\.\/)+runtime\.ts["']/);
    expect(combatSource).not.toMatch(/from ["'](?:\.\.\/)+runtime\.ts["']/);
    expect(combatDeclarationsSource).toContain("grandArchiveCombatDeclarationDecisionResolvers");
    expect(combatDeclarationsSource).not.toMatch(/from ["'](?:\.\.\/)+runtime\.ts["']/);
    expect(effectDeclarationsSource).toContain("grandArchiveEffectDeclarationDecisionResolvers");
    expect(effectDeclarationsSource).not.toMatch(/from ["'](?:\.\.\/)+runtime\.ts["']/);
    expect(glimpseSource).toContain("grandArchiveGlimpseDecisionResolvers");
    expect(glimpseSource).not.toMatch(/from ["'](?:\.\.\/)+runtime\.ts["']/);
    expect(triggerSource).toContain("resolveGrandArchiveTriggeredAbilityAnnouncementDecision");
    expect(turnSource).not.toMatch(/from ["'](?:\.\.\/)+runtime\.ts["']/);
    expect(registrySource).toContain("grandArchiveDecisionContinuationRegistry");
    expect(registrySource).toContain("[Kind in GrandArchiveDecisionKind]");
    expect(handlerSource).not.toMatch(
      /proposeGrandArchive|resumeGrandArchiveEffectResolution|GrandArchiveDecisionAnswerCodec/,
    );
    expect(codecSource).toContain("GrandArchiveDecisionAnswerCodec");
    expect(codecSource).toContain("parseTargetAnswer");
    expect(codecSource).toContain("parseCostPaymentAnswer");
    expect(codecSource).not.toMatch(/from ["'](?:\.\.\/)+runtime\.ts["']/);
    expect(allocationsSource).toContain("grandArchiveAllocationDecisionResolvers");
    expect(allocationsSource).not.toMatch(/from ["'](?:\.\.\/)+runtime\.ts["']/);
  });
});
