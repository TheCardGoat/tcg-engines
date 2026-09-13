export class FabRulesEvaluationError extends Error {
  readonly code = "unsupported_rules_evaluation" as const;
  readonly mechanic: string;

  constructor(mechanic: string) {
    super(`unsupported rules evaluation: ${mechanic}`);
    this.mechanic = mechanic;
    this.name = "FabRulesEvaluationError";
  }
}

export interface FabRulesOrderingRequirement {
  readonly subject: Extract<
    import("../continuous/ir.ts").FabRulesSubjectRef,
    { readonly kind: "object" }
  >;
  readonly stage: import("../continuous/ir.ts").FabRulesStage;
  readonly substage: import("../continuous/ir.ts").FabContinuousAtom["substage"];
  readonly timestamp: import("../continuous/ir.ts").FabRulesTimestamp;
  readonly atomIds: readonly string[];
  readonly effectIds: readonly string[];
}

export class FabRulesOrderingRequiredError extends Error {
  readonly code = "rules_ordering_required" as const;
  readonly requirement: FabRulesOrderingRequirement;

  constructor(requirement: FabRulesOrderingRequirement) {
    super(`rules ordering required for ${requirement.atomIds.join(", ")}`);
    this.requirement = requirement;
    this.name = "FabRulesOrderingRequiredError";
  }
}
