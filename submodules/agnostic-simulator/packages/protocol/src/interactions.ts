import { z } from "zod";
import { PLAYABLE_GAME_SLUGS } from "./games.js";

export const INTERACTION_PROTOCOL_VERSION = 2;
export type InteractionProtocolVersion = typeof INTERACTION_PROTOCOL_VERSION;

export const InteractionText = z
  .object({
    key: z.string().min(1),
    params: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  })
  .strict();

export type InteractionText = z.infer<typeof InteractionText>;

export const EntityKind = z.enum(["card", "player", "zone", "resource", "die", "effect"]);
export type EntityKind = z.infer<typeof EntityKind>;

export const EntitySelectionRole = z.enum([
  "source",
  "target",
  "from",
  "to",
  "attacker",
  "defender",
  "player",
  "location",
  "cost",
  "destination",
]);
export type EntitySelectionRole = z.infer<typeof EntitySelectionRole>;

export const InteractionIntent = z.enum([
  "play-card",
  "resource-card",
  "attack",
  "activate",
  "move-card",
  "pass",
  "undo",
  "concede",
  "mulligan",
  "choose-option",
  "choose-targets",
  "order-cards",
  "custom",
]);
export type InteractionIntent = z.infer<typeof InteractionIntent>;

export const InteractionViewStatus = z.enum(["idle", "ready", "choosing", "waiting", "game-over"]);
export type InteractionViewStatus = z.infer<typeof InteractionViewStatus>;

export const InteractionGameSlug = z.enum(PLAYABLE_GAME_SLUGS);
export type InteractionGameSlug = z.infer<typeof InteractionGameSlug>;

export const EntityRef = z
  .object({
    kind: EntityKind,
    instanceId: z.string().min(1),
    /** Stable definition identity used to render an otherwise private candidate. */
    definitionId: z.string().min(1).optional(),
    ownerId: z.string().min(1).optional(),
    zoneId: z.string().min(1).optional(),
  })
  .strict();

export type EntityRef = z.infer<typeof EntityRef>;

export const InteractionResolutionRequirement = z
  .object({
    kind: z.enum([
      "entity-selection",
      "option-selection",
      "boolean",
      "number",
      "ordering",
      "entity-partition",
      "entity-allocation",
    ]),
    text: InteractionText,
    required: z.boolean(),
    min: z.number().int().min(0).optional(),
    max: z.number().int().min(0).optional(),
  })
  .strict()
  .refine(
    (requirement) =>
      requirement.min === undefined ||
      requirement.max === undefined ||
      requirement.max >= requirement.min,
    {
      message: "max must be greater than or equal to min",
      path: ["max"],
    },
  );

export type InteractionResolutionRequirement = z.infer<typeof InteractionResolutionRequirement>;

/**
 * Viewer-safe progress for an effect-resolution queue.
 *
 * This deliberately contains no candidates or submitted values. It can be
 * projected to the acting player and observers without exposing private card
 * identities or tentative selections.
 */
export const InteractionResolutionContext = z
  .object({
    actingPlayerId: z.string().min(1),
    pendingCount: z.number().int().min(1),
    currentEffect: z
      .object({
        id: z.string().min(1),
        text: InteractionText,
        source: EntityRef.optional(),
      })
      .strict(),
    currentStep: z
      .object({
        index: z.number().int().min(1),
        count: z.number().int().min(1),
        text: InteractionText,
        requirement: InteractionResolutionRequirement.optional(),
      })
      .strict()
      .refine((step) => step.index <= step.count, {
        message: "index must not exceed count",
        path: ["index"],
      }),
  })
  .strict();

export type InteractionResolutionContext = z.infer<typeof InteractionResolutionContext>;

export const EntityCandidate = z
  .object({
    entity: EntityRef,
    text: InteractionText.optional(),
    enabled: z.boolean().default(true),
    disabledText: InteractionText.optional(),
  })
  .strict();

export type EntityCandidate = z.infer<typeof EntityCandidate>;

type SelectionBounds = {
  min: number;
  max: number;
};

type AvailabilityCandidate = {
  enabled?: boolean;
};

function hasOrderedBounds({ min, max }: SelectionBounds): boolean {
  return max >= min;
}

function countEnabled(candidates: readonly AvailabilityCandidate[]): number {
  return candidates.filter((candidate) => candidate.enabled !== false).length;
}

function hasAvailableBounds(
  bounds: SelectionBounds,
  candidates: readonly AvailabilityCandidate[],
): boolean {
  const enabledCount = countEnabled(candidates);

  return bounds.min <= enabledCount && bounds.max <= enabledCount;
}

const InteractionInputBase = z
  .object({
    id: z.string().min(1),
    text: InteractionText,
    required: z.boolean().optional(),
    requiredWhen: z
      .array(
        z
          .object({
            all: z
              .array(
                z
                  .object({
                    inputId: z.string().min(1),
                    value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
                  })
                  .strict(),
              )
              .min(1),
          })
          .strict(),
      )
      .min(1)
      .optional(),
    validationText: InteractionText.optional(),
  })
  .strict();

export const EntitySelectionInput = InteractionInputBase.extend({
  kind: z.literal("entity-selection"),
  role: EntitySelectionRole,
  entityKinds: z.array(EntityKind).min(1),
  min: z.number().int().min(0),
  max: z.number().int().min(0),
  ordered: z.boolean(),
  candidates: z.array(EntityCandidate),
})
  .strict()
  .refine(hasOrderedBounds, {
    message: "max must be greater than or equal to min",
    path: ["max"],
  })
  .refine((input) => hasAvailableBounds(input, input.candidates), {
    message: "min and max must fit enabled candidates",
    path: ["candidates"],
  });

export type EntitySelectionInput = z.infer<typeof EntitySelectionInput>;

export const InteractionOption = z
  .object({
    id: z.string().min(1),
    text: InteractionText,
    enabled: z.boolean().default(true),
    disabledText: InteractionText.optional(),
  })
  .strict();

export type InteractionOption = z.infer<typeof InteractionOption>;

export const OptionSuggestionGroup = z
  .object({
    id: z.string().min(1),
    text: InteractionText,
    optionIds: z.array(z.string().min(1)).min(1),
  })
  .strict();

export type OptionSuggestionGroup = z.infer<typeof OptionSuggestionGroup>;

export const OptionSearchPresentation = z
  .object({
    kind: z.literal("search"),
    label: InteractionText,
    placeholder: InteractionText,
    confirmLabel: InteractionText,
    description: InteractionText.optional(),
    resultLimit: z.number().int().min(1).max(100).optional(),
    suggestionGroups: z.array(OptionSuggestionGroup).optional(),
  })
  .strict();

export type OptionSearchPresentation = z.infer<typeof OptionSearchPresentation>;

export const OptionDirectPresentation = z
  .object({
    kind: z.literal("direct"),
    emptyText: InteractionText,
  })
  .strict();

export type OptionDirectPresentation = z.infer<typeof OptionDirectPresentation>;

export const OptionSelectionPresentation = z.discriminatedUnion("kind", [
  OptionSearchPresentation,
  OptionDirectPresentation,
]);

export const OptionSelectionInput = InteractionInputBase.extend({
  kind: z.literal("option-selection"),
  implicit: z.boolean().optional(),
  min: z.number().int().min(0),
  max: z.number().int().min(0),
  options: z.array(InteractionOption).min(1),
  presentation: OptionSelectionPresentation.optional(),
})
  .strict()
  .refine(hasOrderedBounds, {
    message: "max must be greater than or equal to min",
    path: ["max"],
  })
  .refine((input) => hasAvailableBounds(input, input.options), {
    message: "min and max must fit enabled options",
    path: ["options"],
  });

export type OptionSelectionInput = z.infer<typeof OptionSelectionInput>;

export const BooleanInput = InteractionInputBase.extend({
  kind: z.literal("boolean"),
  trueText: InteractionText,
  falseText: InteractionText,
}).strict();

export type BooleanInput = z.infer<typeof BooleanInput>;

export const NumberInput = InteractionInputBase.extend({
  kind: z.literal("number"),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().positive().optional(),
})
  .strict()
  .refine((input) => input.min === undefined || input.max === undefined || input.max >= input.min, {
    message: "max must be greater than or equal to min",
    path: ["max"],
  });

export type NumberInput = z.infer<typeof NumberInput>;

export const OrderingInput = InteractionInputBase.extend({
  kind: z.literal("ordering"),
  entityKind: EntityKind,
  min: z.number().int().min(0),
  max: z.number().int().min(0),
  candidates: z.array(EntityCandidate).min(1),
})
  .strict()
  .refine(hasOrderedBounds, {
    message: "max must be greater than or equal to min",
    path: ["max"],
  })
  .refine((input) => hasAvailableBounds(input, input.candidates), {
    message: "min and max must fit enabled candidates",
    path: ["candidates"],
  });

export type OrderingInput = z.infer<typeof OrderingInput>;

export const EntityPartitionRoute = z
  .object({
    id: z.string().min(1),
    text: InteractionText,
    kind: z.enum(["extract", "destination"]),
    ordered: z.boolean(),
    orderDirection: z.enum(["top-first", "bottom-first"]).optional(),
    min: z.number().int().min(0),
    max: z.number().int().min(0),
    candidateIds: z.array(z.string().min(1)).optional(),
    minWhenRemainingAtLeast: z
      .object({
        count: z.number().int().min(1),
        min: z.number().int().min(1),
      })
      .strict()
      .optional(),
  })
  .strict()
  .refine(hasOrderedBounds, {
    message: "max must be greater than or equal to min",
    path: ["max"],
  });

export type EntityPartitionRoute = z.infer<typeof EntityPartitionRoute>;

export const EntityPartitionInput = InteractionInputBase.extend({
  kind: z.literal("entity-partition"),
  entityKind: EntityKind,
  candidateSetText: InteractionText.optional(),
  candidates: z.array(EntityCandidate).min(1),
  routes: z.array(EntityPartitionRoute),
  assignment: z.enum(["exhaustive", "remainder-automatic"]),
  remainderText: InteractionText.optional(),
})
  .strict()
  .superRefine((input, ctx) => {
    const candidateIds = new Set(input.candidates.map((candidate) => candidate.entity.instanceId));
    if (candidateIds.size !== input.candidates.length) {
      ctx.addIssue({
        code: "custom",
        path: ["candidates"],
        message: "Partition candidates must have unique instance ids.",
      });
    }
    const routeIds = new Set<string>();
    for (const [routeIndex, route] of input.routes.entries()) {
      if (routeIds.has(route.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["routes", routeIndex, "id"],
          message: `Duplicate partition route id "${route.id}".`,
        });
      }
      routeIds.add(route.id);
      for (const candidateId of route.candidateIds ?? []) {
        if (!candidateIds.has(candidateId)) {
          ctx.addIssue({
            code: "custom",
            path: ["routes", routeIndex, "candidateIds"],
            message: `Partition route candidate "${candidateId}" is not an input candidate.`,
          });
        }
      }
    }
    if (input.assignment === "remainder-automatic" && !input.remainderText) {
      ctx.addIssue({
        code: "custom",
        path: ["remainderText"],
        message: "Automatic partition remainders require explanatory text.",
      });
    }
    if (input.assignment === "exhaustive" && input.routes.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["routes"],
        message: "Exhaustive partitions require at least one route.",
      });
    }
  });

export type EntityPartitionInput = z.infer<typeof EntityPartitionInput>;

export const EntityAllocationCandidate = EntityCandidate.extend({
  min: z.number().int().min(0).default(0),
  max: z.number().int().min(0),
})
  .strict()
  .refine((candidate) => candidate.max >= candidate.min, {
    message: "max must be greater than or equal to min",
    path: ["max"],
  });

export type EntityAllocationCandidate = z.infer<typeof EntityAllocationCandidate>;

/** Distributes an integer amount across viewer-safe entity candidates. */
export const EntityAllocationInput = InteractionInputBase.extend({
  kind: z.literal("entity-allocation"),
  role: EntitySelectionRole,
  entityKinds: z.array(EntityKind).min(1),
  totalMin: z.number().int().min(0),
  totalMax: z.number().int().min(0),
  candidates: z.array(EntityAllocationCandidate).min(1),
})
  .strict()
  .superRefine((input, ctx) => {
    if (input.totalMax < input.totalMin) {
      ctx.addIssue({
        code: "custom",
        path: ["totalMax"],
        message: "totalMax must be greater than or equal to totalMin",
      });
    }
    const candidateMin = input.candidates.reduce((total, candidate) => total + candidate.min, 0);
    const candidateMax = input.candidates
      .filter((candidate) => candidate.enabled !== false)
      .reduce((total, candidate) => total + candidate.max, 0);
    if (input.totalMin < candidateMin || input.totalMax > candidateMax) {
      ctx.addIssue({
        code: "custom",
        path: ["candidates"],
        message: "Allocation totals must fit the enabled candidate bounds.",
      });
    }
  });

export type EntityAllocationInput = z.infer<typeof EntityAllocationInput>;

export const InteractionInput = z.discriminatedUnion("kind", [
  EntitySelectionInput,
  OptionSelectionInput,
  BooleanInput,
  NumberInput,
  OrderingInput,
  EntityPartitionInput,
  EntityAllocationInput,
]);

export type InteractionInput = z.infer<typeof InteractionInput>;

export const InteractionAction = z
  .object({
    id: z.string().min(1),
    requestId: z.string().min(1),
    intent: InteractionIntent,
    text: InteractionText,
    enabled: z.boolean(),
    disabledText: InteractionText.optional(),
    source: EntityRef.optional(),
    inputs: z.array(InteractionInput),
  })
  .strict();

export type InteractionAction = z.infer<typeof InteractionAction>;

export const EngineInteractionView = z
  .object({
    protocolVersion: z.literal(INTERACTION_PROTOCOL_VERSION),
    gameSlug: InteractionGameSlug,
    actorId: z.string().min(1),
    stateVersion: z.number().int().min(0),
    status: InteractionViewStatus,
    resolution: InteractionResolutionContext.optional(),
    actions: z.array(InteractionAction),
  })
  .strict();

export type EngineInteractionView = z.infer<typeof EngineInteractionView>;

export const EntityPartitionValue = z.record(z.string(), z.array(z.string()));
export type EntityPartitionValue = z.infer<typeof EntityPartitionValue>;

export const EntityAllocationValue = z.record(z.string(), z.number().int().min(0));
export type EntityAllocationValue = z.infer<typeof EntityAllocationValue>;

export const InteractionSubmissionValue = z.union([
  z.string(),
  z.array(z.string()),
  z.number(),
  z.boolean(),
  z.null(),
  EntityPartitionValue,
  EntityAllocationValue,
]);

export type InteractionSubmissionValue = z.infer<typeof InteractionSubmissionValue>;

export const InteractionAutomation = z
  .object({
    kind: z.literal("no-valid-action"),
  })
  .strict();

export type InteractionAutomation = z.infer<typeof InteractionAutomation>;

export const InteractionSubmission = z
  .object({
    protocolVersion: z.literal(INTERACTION_PROTOCOL_VERSION),
    stateVersion: z.number().int().min(0),
    requestId: z.string().min(1),
    actionId: z.string().min(1),
    values: z.record(z.string(), InteractionSubmissionValue),
    automation: InteractionAutomation.optional(),
    correlationId: z.string().min(1).optional(),
  })
  .strict();

export type InteractionSubmission = z.infer<typeof InteractionSubmission>;

export type ActionEntityCandidateFilter = {
  inputId?: string;
  role?: EntitySelectionRole;
  entityKind?: EntityKind;
  includeDisabled?: boolean;
};

export type BuildInteractionSubmissionInput = {
  view: EngineInteractionView;
  action: InteractionAction;
  values?: Record<string, InteractionSubmissionValue>;
  automation?: InteractionAutomation;
  correlationId?: string;
};

export type BuildInteractionSubmissionForActionIdInput = {
  view: EngineInteractionView;
  actionId: string;
  values?: Record<string, InteractionSubmissionValue>;
  automation?: InteractionAutomation;
  correlationId?: string;
};

export type InteractionSubmissionValidationIssueCode =
  | "invalid_view"
  | "invalid_submission"
  | "stale_state"
  | "stale_request"
  | "action_unavailable"
  | "action_disabled"
  | "unknown_value"
  | "missing_value"
  | "invalid_value_type"
  | "selection_count_out_of_bounds"
  | "duplicate_selection"
  | "partition_incomplete"
  | "candidate_unavailable"
  | "option_unavailable"
  | "number_out_of_bounds"
  | "number_step_mismatch";

export type InteractionSubmissionValidationIssue = {
  code: InteractionSubmissionValidationIssueCode;
  path: ReadonlyArray<string | number>;
  message: string;
};

export type InteractionSubmissionValidationResult =
  | { ok: true; action: InteractionAction }
  | {
      ok: false;
      issues: readonly InteractionSubmissionValidationIssue[];
      error: string;
    };

export function entityCandidatesForAction(
  action: InteractionAction,
  filter: ActionEntityCandidateFilter = {},
): EntityCandidate[] {
  return action.inputs.flatMap((input) => {
    switch (input.kind) {
      case "entity-selection":
        if (filter.inputId !== undefined && input.id !== filter.inputId) return [];
        if (filter.role !== undefined && input.role !== filter.role) return [];
        return input.candidates.filter((candidate) => entityCandidateMatches(candidate, filter));
      case "ordering":
        if (filter.inputId !== undefined && input.id !== filter.inputId) return [];
        if (filter.role !== undefined) return [];
        return input.candidates.filter((candidate) => entityCandidateMatches(candidate, filter));
      case "entity-partition":
        if (filter.inputId !== undefined && input.id !== filter.inputId) return [];
        if (filter.role !== undefined) return [];
        return input.candidates.filter((candidate) => entityCandidateMatches(candidate, filter));
      case "entity-allocation":
        if (filter.inputId !== undefined && input.id !== filter.inputId) return [];
        if (filter.role !== undefined && input.role !== filter.role) return [];
        return input.candidates.filter((candidate) => entityCandidateMatches(candidate, filter));
      case "boolean":
      case "number":
      case "option-selection":
        return [];
      default:
        return assertNeverInteractionInput(input);
    }
  });
}

export function actionsForEntity(
  view: EngineInteractionView,
  entity: Pick<EntityRef, "kind" | "instanceId">,
): InteractionAction[] {
  return view.actions.filter((action) =>
    entityCandidatesForAction(action).some(
      (candidate) =>
        candidate.entity.kind === entity.kind && candidate.entity.instanceId === entity.instanceId,
    ),
  );
}

export function buildInteractionSubmission(
  input: BuildInteractionSubmissionInput,
): InteractionSubmission {
  return InteractionSubmission.parse({
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    stateVersion: input.view.stateVersion,
    requestId: input.action.requestId,
    actionId: input.action.id,
    values: input.values ?? {},
    ...(input.automation === undefined ? {} : { automation: input.automation }),
    ...(input.correlationId === undefined ? {} : { correlationId: input.correlationId }),
  });
}

export function buildInteractionSubmissionForActionId(
  input: BuildInteractionSubmissionForActionIdInput,
): InteractionSubmission | null {
  const action = input.view.actions.find((candidate) => candidate.id === input.actionId);
  if (!action || !action.enabled) {
    return null;
  }

  return buildInteractionSubmission({
    view: input.view,
    action,
    values: input.values,
    automation: input.automation,
    correlationId: input.correlationId,
  });
}

export function validateInteractionSubmission(
  view: EngineInteractionView,
  submission: InteractionSubmission,
): InteractionSubmissionValidationResult {
  const issues: InteractionSubmissionValidationIssue[] = [];
  const parsedView = EngineInteractionView.safeParse(view);
  if (!parsedView.success) {
    issues.push({
      code: "invalid_view",
      path: [],
      message: "Interaction view does not match the protocol schema.",
    });
  }
  const parsedSubmission = InteractionSubmission.safeParse(submission);
  if (!parsedSubmission.success) {
    issues.push({
      code: "invalid_submission",
      path: [],
      message: "Interaction submission does not match the protocol schema.",
    });
  }
  if (issues.length > 0) {
    return invalidSubmission(issues);
  }

  if (submission.stateVersion !== view.stateVersion) {
    issues.push({
      code: "stale_state",
      path: ["stateVersion"],
      message: `Submission state version ${submission.stateVersion} does not match current state version ${view.stateVersion}.`,
    });
  }

  const action = view.actions.find((candidate) => candidate.id === submission.actionId);
  if (!action) {
    issues.push({
      code: "action_unavailable",
      path: ["actionId"],
      message: `Action "${submission.actionId}" is not available.`,
    });
    return invalidSubmission(issues);
  }
  if (action.requestId !== submission.requestId) {
    issues.push({
      code: "stale_request",
      path: ["requestId"],
      message: `Submission request "${submission.requestId}" does not match action request "${action.requestId}".`,
    });
  }
  if (!action.enabled) {
    issues.push({
      code: "action_disabled",
      path: ["actionId"],
      message: `Action "${submission.actionId}" is disabled.`,
    });
  }

  validateSubmissionValues(action, submission, issues);

  if (issues.length > 0) {
    return invalidSubmission(issues);
  }
  return { ok: true, action };
}

function entityCandidateMatches(
  candidate: EntityCandidate,
  filter: ActionEntityCandidateFilter,
): boolean {
  if (filter.includeDisabled !== true && candidate.enabled === false) return false;
  if (filter.entityKind !== undefined && candidate.entity.kind !== filter.entityKind) return false;
  return true;
}

export function assertNever(value: never): never {
  throw new Error(`Unhandled interaction protocol variant: ${JSON.stringify(value)}`);
}

export function assertNeverInteractionInput(input: never): never {
  return assertNever(input);
}

export function assertNeverInteractionIntent(intent: never): never {
  return assertNever(intent);
}

function validateSubmissionValues(
  action: InteractionAction,
  submission: InteractionSubmission,
  issues: InteractionSubmissionValidationIssue[],
): void {
  const inputIds = new Set(action.inputs.map((input) => input.id));
  for (const valueKey of Object.keys(submission.values)) {
    if (!inputIds.has(valueKey)) {
      issues.push({
        code: "unknown_value",
        path: ["values", valueKey],
        message: `Value "${valueKey}" does not match an input on action "${action.id}".`,
      });
    }
  }

  for (const input of action.inputs) {
    const value = submission.values[input.id];
    if (value === undefined || value === null) {
      if (!inputAllowsOmission(input, submission.values)) {
        issues.push({
          code: "missing_value",
          path: ["values", input.id],
          message: `Input "${input.id}" is required.`,
        });
      }
      continue;
    }

    switch (input.kind) {
      case "entity-selection":
        validateEntitySelectionInput(input, value, issues);
        break;
      case "option-selection":
        validateOptionSelectionInput(input, value, issues);
        break;
      case "boolean":
        validateBooleanInput(input, value, issues);
        break;
      case "number":
        validateNumberInput(input, value, issues);
        break;
      case "ordering":
        validateOrderingInput(input, value, issues);
        break;
      case "entity-partition":
        validateEntityPartitionInput(input, value, issues);
        break;
      case "entity-allocation":
        validateEntityAllocationInput(input, value, issues);
        break;
      default:
        assertNeverInteractionInput(input);
    }
  }
}

function inputAllowsOmission(
  input: InteractionInput,
  values: Readonly<Record<string, InteractionSubmissionValue>>,
): boolean {
  if (input.requiredWhen?.some((requirement) => requirementMatches(requirement, values))) {
    return false;
  }
  if (input.required === false) return true;
  switch (input.kind) {
    case "entity-selection":
    case "option-selection":
    case "ordering":
      return input.min === 0;
    case "entity-partition":
      return false;
    case "entity-allocation":
      return input.totalMin === 0;
    case "boolean":
    case "number":
      return false;
    default:
      return assertNeverInteractionInput(input);
  }
}

function requirementMatches(
  requirement: NonNullable<InteractionInput["requiredWhen"]>[number],
  values: Readonly<Record<string, InteractionSubmissionValue>>,
): boolean {
  return requirement.all.every((condition) => {
    const value = values[condition.inputId];
    const expected = condition.value;
    if (Array.isArray(expected)) {
      return (
        Array.isArray(value) &&
        value.length === expected.length &&
        value.every((entry, index) => entry === expected[index])
      );
    }
    return Array.isArray(value) ? value.includes(String(expected)) : value === expected;
  });
}

function validateEntitySelectionInput(
  input: EntitySelectionInput,
  value: InteractionSubmissionValue,
  issues: InteractionSubmissionValidationIssue[],
): void {
  const ids = readStringSelectionValue(value, ["values", input.id], issues);
  if (!ids) return;
  validateSelectionCount(input.id, ids, input, issues);
  validateNoDuplicateSelections(input.id, ids, issues);
  const candidates = new Map(
    input.candidates.map((candidate) => [candidate.entity.instanceId, candidate]),
  );
  for (const id of ids) {
    const candidate = candidates.get(id);
    if (!candidate || candidate.enabled === false) {
      issues.push({
        code: "candidate_unavailable",
        path: ["values", input.id],
        message: `Entity "${id}" is not an enabled candidate for input "${input.id}".`,
      });
    }
  }
}

function validateOptionSelectionInput(
  input: OptionSelectionInput,
  value: InteractionSubmissionValue,
  issues: InteractionSubmissionValidationIssue[],
): void {
  const ids = readStringSelectionValue(value, ["values", input.id], issues);
  if (!ids) return;
  validateSelectionCount(input.id, ids, input, issues);
  validateNoDuplicateSelections(input.id, ids, issues);
  const options = new Map(input.options.map((option) => [option.id, option]));
  for (const id of ids) {
    const option = options.get(id);
    if (!option || option.enabled === false) {
      issues.push({
        code: "option_unavailable",
        path: ["values", input.id],
        message: `Option "${id}" is not an enabled option for input "${input.id}".`,
      });
    }
  }
}

function validateBooleanInput(
  input: BooleanInput,
  value: InteractionSubmissionValue,
  issues: InteractionSubmissionValidationIssue[],
): void {
  if (typeof value !== "boolean") {
    issues.push({
      code: "invalid_value_type",
      path: ["values", input.id],
      message: `Input "${input.id}" requires a boolean value.`,
    });
  }
}

function validateNumberInput(
  input: NumberInput,
  value: InteractionSubmissionValue,
  issues: InteractionSubmissionValidationIssue[],
): void {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    issues.push({
      code: "invalid_value_type",
      path: ["values", input.id],
      message: `Input "${input.id}" requires a finite number value.`,
    });
    return;
  }
  if (input.min !== undefined && value < input.min) {
    issues.push({
      code: "number_out_of_bounds",
      path: ["values", input.id],
      message: `Input "${input.id}" must be greater than or equal to ${input.min}.`,
    });
  }
  if (input.max !== undefined && value > input.max) {
    issues.push({
      code: "number_out_of_bounds",
      path: ["values", input.id],
      message: `Input "${input.id}" must be less than or equal to ${input.max}.`,
    });
  }
  if (input.step !== undefined && !numberMatchesStep(value, input.min ?? 0, input.step)) {
    issues.push({
      code: "number_step_mismatch",
      path: ["values", input.id],
      message: `Input "${input.id}" must align to step ${input.step}.`,
    });
  }
}

function validateOrderingInput(
  input: OrderingInput,
  value: InteractionSubmissionValue,
  issues: InteractionSubmissionValidationIssue[],
): void {
  const ids = readOrderingValue(value, ["values", input.id], issues);
  if (!ids) return;
  validateSelectionCount(input.id, ids, input, issues);
  validateNoDuplicateSelections(input.id, ids, issues);
  const candidates = new Map(
    input.candidates.map((candidate) => [candidate.entity.instanceId, candidate]),
  );
  for (const id of ids) {
    const candidate = candidates.get(id);
    if (!candidate || candidate.enabled === false) {
      issues.push({
        code: "candidate_unavailable",
        path: ["values", input.id],
        message: `Entity "${id}" is not an enabled ordering candidate for input "${input.id}".`,
      });
    }
  }
}

function validateEntityPartitionInput(
  input: EntityPartitionInput,
  value: InteractionSubmissionValue,
  issues: InteractionSubmissionValidationIssue[],
): void {
  const parsed = EntityPartitionValue.safeParse(value);
  if (!parsed.success) {
    issues.push({
      code: "invalid_value_type",
      path: ["values", input.id],
      message: `Input "${input.id}" requires a route-to-card-array record.`,
    });
    return;
  }

  const candidates = new Map(
    input.candidates.map((candidate) => [candidate.entity.instanceId, candidate]),
  );
  const enabledCandidateIds = new Set(
    input.candidates
      .filter((candidate) => candidate.enabled !== false)
      .map((candidate) => candidate.entity.instanceId),
  );
  const routes = new Map(input.routes.map((route) => [route.id, route]));
  const assigned = new Set<string>();
  const extracted = new Set<string>();

  for (const [routeId, ids] of Object.entries(parsed.data)) {
    const route = routes.get(routeId);
    if (!route) {
      issues.push({
        code: "unknown_value",
        path: ["values", input.id, routeId],
        message: `Partition route "${routeId}" is not available on input "${input.id}".`,
      });
      continue;
    }
    const eligible = route.candidateIds ? new Set(route.candidateIds) : enabledCandidateIds;
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length) {
      issues.push({
        code: "duplicate_selection",
        path: ["values", input.id, routeId],
        message: `Partition route "${routeId}" contains a duplicate entity.`,
      });
    }
    for (const id of ids) {
      const candidate = candidates.get(id);
      if (!candidate || candidate.enabled === false || !eligible.has(id)) {
        issues.push({
          code: "candidate_unavailable",
          path: ["values", input.id, routeId],
          message: `Entity "${id}" is not enabled for partition route "${routeId}".`,
        });
      }
      if (assigned.has(id)) {
        issues.push({
          code: "duplicate_selection",
          path: ["values", input.id, routeId],
          message: `Entity "${id}" is assigned to more than one partition route.`,
        });
      }
      assigned.add(id);
      if (route.kind === "extract") extracted.add(id);
    }
  }

  const remainingCount = Math.max(0, enabledCandidateIds.size - extracted.size);
  for (const route of input.routes) {
    const ids = parsed.data[route.id] ?? [];
    const conditionalMin =
      route.minWhenRemainingAtLeast && remainingCount >= route.minWhenRemainingAtLeast.count
        ? route.minWhenRemainingAtLeast.min
        : 0;
    const min = Math.max(route.min, conditionalMin);
    if (ids.length < min || ids.length > route.max) {
      issues.push({
        code: "selection_count_out_of_bounds",
        path: ["values", input.id, route.id],
        message: `Partition route "${route.id}" requires ${min}–${route.max} entities.`,
      });
    }
  }

  if (
    input.assignment === "exhaustive" &&
    [...enabledCandidateIds].some((candidateId) => !assigned.has(candidateId))
  ) {
    issues.push({
      code: "partition_incomplete",
      path: ["values", input.id],
      message: `Input "${input.id}" must assign every enabled candidate exactly once.`,
    });
  }
}

function validateEntityAllocationInput(
  input: EntityAllocationInput,
  value: InteractionSubmissionValue,
  issues: InteractionSubmissionValidationIssue[],
): void {
  const parsed = EntityAllocationValue.safeParse(value);
  if (!parsed.success) {
    issues.push({
      code: "invalid_value_type",
      path: ["values", input.id],
      message: `Input "${input.id}" requires an entity-to-amount record.`,
    });
    return;
  }
  const candidates = new Map(
    input.candidates.map((candidate) => [candidate.entity.instanceId, candidate]),
  );
  let total = 0;
  for (const [id, amount] of Object.entries(parsed.data)) {
    const candidate = candidates.get(id);
    if (!candidate || candidate.enabled === false) {
      issues.push({
        code: "candidate_unavailable",
        path: ["values", input.id, id],
        message: `Entity "${id}" is not enabled for allocation input "${input.id}".`,
      });
      continue;
    }
    if (amount < candidate.min || amount > candidate.max) {
      issues.push({
        code: "number_out_of_bounds",
        path: ["values", input.id, id],
        message: `Allocation for "${id}" must be between ${candidate.min} and ${candidate.max}.`,
      });
    }
    total += amount;
  }
  for (const candidate of input.candidates) {
    if ((parsed.data[candidate.entity.instanceId] ?? 0) < candidate.min) {
      issues.push({
        code: "number_out_of_bounds",
        path: ["values", input.id, candidate.entity.instanceId],
        message: `Allocation for "${candidate.entity.instanceId}" must be at least ${candidate.min}.`,
      });
    }
  }
  if (total < input.totalMin || total > input.totalMax) {
    issues.push({
      code: "selection_count_out_of_bounds",
      path: ["values", input.id],
      message: `Input "${input.id}" requires a total allocation between ${input.totalMin} and ${input.totalMax}.`,
    });
  }
}

function readStringSelectionValue(
  value: InteractionSubmissionValue,
  path: ReadonlyArray<string | number>,
  issues: InteractionSubmissionValidationIssue[],
): string[] | null {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value;
  }
  issues.push({
    code: "invalid_value_type",
    path,
    message: "Selection input requires a string or string array value.",
  });
  return null;
}

function readOrderingValue(
  value: InteractionSubmissionValue,
  path: ReadonlyArray<string | number>,
  issues: InteractionSubmissionValidationIssue[],
): string[] | null {
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value;
  }
  issues.push({
    code: "invalid_value_type",
    path,
    message: "Ordering input requires a string array value.",
  });
  return null;
}

function validateSelectionCount(
  inputId: string,
  ids: readonly string[],
  bounds: SelectionBounds,
  issues: InteractionSubmissionValidationIssue[],
): void {
  if (ids.length < bounds.min || ids.length > bounds.max) {
    issues.push({
      code: "selection_count_out_of_bounds",
      path: ["values", inputId],
      message: `Input "${inputId}" requires between ${bounds.min} and ${bounds.max} selections.`,
    });
  }
}

function validateNoDuplicateSelections(
  inputId: string,
  ids: readonly string[],
  issues: InteractionSubmissionValidationIssue[],
): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      issues.push({
        code: "duplicate_selection",
        path: ["values", inputId],
        message: `Input "${inputId}" cannot select "${id}" more than once.`,
      });
      return;
    }
    seen.add(id);
  }
}

function numberMatchesStep(value: number, min: number, step: number): boolean {
  const quotient = (value - min) / step;
  return Math.abs(quotient - Math.round(quotient)) <= 1e-9;
}

function invalidSubmission(
  issues: readonly InteractionSubmissionValidationIssue[],
): InteractionSubmissionValidationResult {
  return {
    ok: false,
    issues,
    error: issues.map((issue) => issue.message).join(" "),
  };
}
