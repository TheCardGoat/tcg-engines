import type {
  EngineInteractionView,
  EntityAllocationInput,
  EntityAllocationValue,
  EntityPartitionInput,
  EntityPartitionRoute,
  EntityPartitionValue,
  InteractionInput,
  InteractionSubmission,
  InteractionSubmissionValue,
} from "@tcg/protocol";
import type {
  SimulatorEntity,
  SimulatorTable,
  SimulatorTargetFilter,
} from "@tcg/simulator-contract";
import { buildInteractionSubmission, validateInteractionSubmission } from "@tcg/protocol";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  IconAdjustmentsHorizontal,
  IconArrowDown,
  IconArrowUp,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconChecklist,
  IconCircleDashedCheck,
  IconGripVertical,
  IconListDetails,
  IconMinus,
  IconNumbers,
  IconPlus,
  IconProgress,
  IconSearch,
  IconTargetArrow,
  IconX,
} from "@tabler/icons-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  actionableInputs,
  currentActionableInput,
  implicitSubmissionValues,
  interactionBoundsCopy,
  interactionCommitMode,
  interactionTargetPresentation,
  optionalDecisionInteraction,
  requirementFromInput,
  resolveInteractionText,
} from "../interactions/interaction-presentation";
import { useOptionalAnimationRuntime } from "../animation/provider/contexts";
import classes from "./InteractionResolutionPrompt.module.css";
import { useMobilePromptDrag } from "./useMobilePromptDrag";
import {
  TargetFilterModal,
  type TargetFilterDuplicateFilter,
  type TargetFilterModalClassNames,
} from "./TargetFilterModal";

export interface InteractionChoiceModalPresentation {
  readonly title: string;
  readonly description?: string;
  readonly filter: SimulatorTargetFilter;
  readonly table: SimulatorTable;
  readonly entities: readonly SimulatorEntity[];
  readonly classNames?: TargetFilterModalClassNames;
  readonly emptyLabel?: string;
  readonly autoOpen?: boolean;
  readonly duplicateFilter?: TargetFilterDuplicateFilter;
  readonly renderPreview?: (entity: SimulatorEntity) => ReactNode;
}

export interface InteractionResolutionPromptProps {
  readonly view: EngineInteractionView;
  readonly viewerId: string;
  readonly values?: Readonly<Record<string, InteractionSubmissionValue>>;
  readonly visibleEntityIds?: ReadonlySet<string>;
  readonly onChange?: (inputId: string, value: InteractionSubmissionValue) => void;
  readonly onClearInput?: (inputId: string) => void;
  readonly onConfirm?: () => void;
  readonly onSubmit?: (submission: InteractionSubmission) => void;
  readonly onTakeNone?: () => void;
  readonly onClear?: () => void;
  readonly selectionSummary?: {
    readonly selected: number;
    readonly max: number;
    readonly canConfirm: boolean;
  };
  /**
   * Lets a game surface reserve the target area for direct manipulation.
   * The player can still move the prompt for the current effect.
   */
  readonly preferredPlacement?: "top" | "bottom";
  /** Allow touch/keyboard vertical positioning of the compact mobile prompt. */
  readonly mobileDraggable?: boolean;
  /**
   * Lets a game surface reserve room for direct-manipulation targets anchored
   * along the bottom edge, such as cards in the local player's hand.
   */
  readonly reserveBottomTargetArea?: boolean;
  /** Enables direct resolution for a singleton target rendered in the drawer. */
  readonly immediateDrawerSelection?: boolean;
  /**
   * Resolves optional single-card selections on click instead of staging them
   * behind the Confirm button. Requires spatial targets or
   * immediateDrawerSelection, matching required singletons.
   */
  readonly immediateOptionalSingletons?: boolean;
  /** Keeps effect guidance visible while a game-owned surface renders the decision controls. */
  readonly instructionOnly?: boolean;
  /** Game-owned choices rendered in the standard action rail. */
  readonly decisionControls?: ReactNode;
  readonly renderCandidate?: (input: InteractionInput, entityId: string) => ReactNode;
  /** Lets a game surface show its native card inspection while an ordered card is hovered. */
  readonly onOrderedCandidatePreview?: (input: EntityPartitionInput, entityId: string) => void;
  /** Clears the native card inspection when the pointer leaves an ordered card. */
  readonly onOrderedCandidatePreviewEnd?: () => void;
  /** Uses the shared target modal for dense or private-zone candidates. */
  readonly choiceModal?: InteractionChoiceModalPresentation;
  /** Selects a ready action for pre-command drafting when no effect queue is active. */
  readonly actionId?: string;
  /** Optional game-facing copy for a ready, inputless action shown in this shared prompt. */
  readonly actionPresentation?: {
    readonly title?: string;
    readonly body?: string;
    /** Keeps the source identity and primary body in one compact reading flow. */
    readonly inlineTitle?: boolean;
    /** Secondary card or effect text hidden behind the compact rail disclosure. */
    readonly details?: string;
    readonly footerInstruction?: string;
    readonly submitLabel?: string;
  };
  /** Primarily useful for deterministic visual fixtures; production defaults to collapsed. */
  readonly defaultDetailsExpanded?: boolean;
  /** Optional contextual action shown alongside the current decision controls. */
  readonly auxiliaryAction?: {
    readonly label: string;
    readonly title?: string;
    readonly onSelect: () => void;
    readonly disabled?: boolean;
  };
  /** Lets a game turn a known card title into its native inspection affordance. */
  readonly renderEffectTitle?: (title: string) => ReactNode;
  /** Lets a game present the primary instruction separately from the effect source. */
  readonly renderInstruction?: (instruction: string) => ReactNode;
  /** Suppresses the duplicate full-copy tooltip when the primary instruction is already expanded. */
  readonly suppressInstructionTooltip?: boolean;
  /** Lets a game replace native inline text tokens without changing protocol copy. */
  readonly renderText?: (text: string) => ReactNode;
  readonly onCancel?: () => void;
  readonly confirmedInputIds?: ReadonlySet<string>;
}

type DirectOrderedRoute = EntityPartitionRoute & {
  readonly ordered: true;
  readonly orderDirection: "top-first" | "bottom-first";
};

const LARGE_OPTION_BROWSER_THRESHOLD = 24;
const LARGE_OPTION_RESULT_LIMIT = 60;

function normalizeOptionSearchValue(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLocaleLowerCase();
}

function optionSearchRank(label: string, query: string): number | null {
  const normalized = normalizeOptionSearchValue(label);
  if (normalized === query) return 0;
  if (normalized.startsWith(query)) return 1;
  if (normalized.split(/\s+/).some((word) => word.startsWith(query))) return 2;
  return normalized.includes(query) ? 3 : null;
}

function isDirectOrderedRoute(route: EntityPartitionRoute): route is DirectOrderedRoute {
  return route.ordered && route.orderDirection !== undefined;
}

function directOrderedRoutes(
  input: EntityPartitionInput | undefined,
): readonly DirectOrderedRoute[] | undefined {
  if (
    !input ||
    input.assignment !== "exhaustive" ||
    input.routes.length < 1 ||
    input.routes.length > 2 ||
    !input.routes.every(isDirectOrderedRoute)
  )
    return undefined;
  const routes = input.routes as readonly DirectOrderedRoute[];
  return routes.every(
    (route) =>
      route.max >= input.candidates.length &&
      input.candidates.every(
        ({ entity }) => !route.candidateIds || route.candidateIds.includes(entity.instanceId),
      ),
  )
    ? routes
    : undefined;
}

function directOrderedPartitionValue(
  input: EntityPartitionInput,
  routes: readonly DirectOrderedRoute[],
  value: EntityPartitionValue,
): EntityPartitionValue {
  const candidateIds = input.candidates.map(({ entity }) => entity.instanceId);
  const assignedIds = routes.flatMap((route) => value[route.id] ?? []);
  const isComplete =
    assignedIds.length === candidateIds.length &&
    candidateIds.every((entityId) => assignedIds.includes(entityId));
  if (isComplete) return value;

  return Object.fromEntries(
    routes.map((route, index) => {
      const playerOrder = index === 0 ? candidateIds : [];
      return [
        route.id,
        route.orderDirection === "bottom-first" ? [...playerOrder].reverse() : playerOrder,
      ];
    }),
  );
}

export function InteractionResolutionPrompt({
  view,
  viewerId,
  values = {},
  visibleEntityIds = new Set<string>(),
  onChange,
  onClearInput,
  onConfirm,
  onSubmit,
  onTakeNone,
  onClear,
  selectionSummary,
  preferredPlacement = "bottom",
  mobileDraggable = false,
  reserveBottomTargetArea = false,
  immediateDrawerSelection = false,
  immediateOptionalSingletons = false,
  instructionOnly = false,
  decisionControls,
  renderCandidate,
  onOrderedCandidatePreview,
  onOrderedCandidatePreviewEnd,
  choiceModal,
  actionId,
  actionPresentation,
  defaultDetailsExpanded = false,
  auxiliaryAction,
  renderEffectTitle,
  renderInstruction,
  suppressInstructionTooltip = false,
  renderText,
  onCancel,
  confirmedInputIds = new Set(),
}: InteractionResolutionPromptProps) {
  const animationRuntime = useOptionalAnimationRuntime();
  const resolution = view.resolution;
  const [minimized, setMinimized] = useState(false);
  const [placement, setPlacement] = useState<"top" | "bottom">(preferredPlacement);
  const [choicesOpen, setChoicesOpen] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(defaultDetailsExpanded);
  const [utilityMenuOpen, setUtilityMenuOpen] = useState(false);
  const [clearedNumberKey, setClearedNumberKey] = useState<string>();
  const [instructionTooltipOpen, setInstructionTooltipOpen] = useState(false);
  const [optionQuery, setOptionQuery] = useState("");
  const rootRef = useRef<HTMLElement>(null);
  const mobileDrag = useMobilePromptDrag(rootRef, mobileDraggable, placement);
  const choiceDialogRef = useRef<HTMLElement>(null);
  const utilityTriggerRef = useRef<HTMLButtonElement>(null);
  const initializedNumberKeyRef = useRef<string | undefined>(undefined);
  const instructionTooltipTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const headingId = useId();
  const instructionId = useId();
  const detailsId = useId();
  const draftedAction = actionId
    ? view.actions.find((candidate) => candidate.id === actionId && candidate.enabled)
    : undefined;
  const isDraftControlled = draftedAction !== undefined;
  const isActionDraft = view.resolution === undefined && draftedAction !== undefined;
  const actorId = view.resolution?.actingPlayerId ?? view.actorId;
  const promptId = view.resolution?.currentEffect.id ?? draftedAction?.requestId;

  useEffect(() => {
    setMinimized(false);
    setChoicesOpen(choiceModal?.autoOpen === true);
    setDetailsExpanded(defaultDetailsExpanded);
    setUtilityMenuOpen(false);
    setClearedNumberKey(undefined);
    setInstructionTooltipOpen(false);
    setOptionQuery("");
  }, [choiceModal?.autoOpen, defaultDetailsExpanded, promptId]);

  useEffect(() => {
    setPlacement(preferredPlacement);
  }, [preferredPlacement]);

  useEffect(
    () => () => {
      if (instructionTooltipTimerRef.current) clearTimeout(instructionTooltipTimerRef.current);
    },
    [],
  );

  const isActor = actorId === viewerId;
  const action = isActor ? (draftedAction ?? view.actions[0]) : undefined;
  const immediateAction = isActionDraft && action?.inputs.length === 0;
  const secondaryUndoAction =
    isActor && resolution
      ? view.actions.find(
          (candidate) =>
            candidate.enabled && candidate.intent === "undo" && candidate.inputs.length === 0,
        )
      : undefined;
  const draftedInput =
    isDraftControlled && action
      ? currentActionableInput(action, values, confirmedInputIds)
      : undefined;
  const inputs = action
    ? isDraftControlled
      ? draftedInput
        ? [draftedInput]
        : []
      : actionableInputs(action)
    : [];
  const optionalDecision = optionalDecisionInteraction(
    isDraftControlled && action ? action.inputs : inputs,
  );
  const input = optionalDecision?.dependent ?? inputs[0];
  const numberKey = input?.kind === "number" ? `${promptId ?? "prompt"}:${input.id}` : undefined;
  const partitionInput = inputs.find(
    (candidate): candidate is EntityPartitionInput => candidate.kind === "entity-partition",
  );
  const allocationInput = inputs.find(
    (candidate): candidate is EntityAllocationInput => candidate.kind === "entity-allocation",
  );
  const usesFocusedPartitionWorkspace =
    partitionInput !== undefined &&
    interactionTargetPresentation(partitionInput, visibleEntityIds) === "drawer";
  const directOrderRoutes = directOrderedRoutes(partitionInput);
  const directOrderDestination =
    directOrderRoutes?.length === 1
      ? resolveInteractionText(directOrderRoutes[0]!.text).replace(/\s*\([^)]*\)\s*$/, "")
      : undefined;

  useEffect(() => {
    if (!isActor || minimized || inputs.length === 0) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    rootRef.current?.focus();
    return () => previous?.focus();
  }, [inputs.length, isActor, minimized, promptId]);

  useEffect(() => {
    if (!usesFocusedPartitionWorkspace || !isActor || minimized) return;
    const prompt = rootRef.current;
    if (!prompt) return;
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const focusable = [
        ...prompt.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      ];
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (
        event.shiftKey &&
        (document.activeElement === prompt || document.activeElement === first)
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || choicesOpen) return;
      event.preventDefault();
      if (detailsExpanded) {
        setDetailsExpanded(false);
        return;
      }
      setMinimized(true);
    };
    prompt.addEventListener("keydown", trapFocus);
    window.addEventListener("keydown", closeOnEscape, true);
    return () => {
      prompt.removeEventListener("keydown", trapFocus);
      window.removeEventListener("keydown", closeOnEscape, true);
    };
  }, [choicesOpen, detailsExpanded, isActor, minimized, usesFocusedPartitionWorkspace]);

  useEffect(() => {
    if (!choicesOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setChoicesOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape, true);
    return () => window.removeEventListener("keydown", closeOnEscape, true);
  }, [choicesOpen]);

  useEffect(() => {
    if (!choicesOpen || !choiceDialogRef.current) return;
    const dialog = choiceDialogRef.current;
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusableSelector =
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
    const focusable = [...dialog.querySelectorAll<HTMLElement>(focusableSelector)];
    focusable[0]?.focus();

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener("keydown", trapFocus);
    return () => {
      dialog.removeEventListener("keydown", trapFocus);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
      else utilityTriggerRef.current?.focus();
    };
  }, [choicesOpen]);

  useEffect(() => {
    if (!isActor || input?.kind !== "number" || input.max === undefined || !numberKey) return;
    if (initializedNumberKeyRef.current === numberKey) return;
    initializedNumberKeyRef.current = numberKey;
    if (values[input.id] === undefined) onChange?.(input.id, input.max);
  }, [input, isActor, numberKey, onChange, values]);

  if ((!resolution && !isActionDraft) || animationRuntime?.activeTransition) return null;

  const optionalTarget =
    optionalDecision?.dependent.kind === "entity-selection" ||
    optionalDecision?.dependent.kind === "entity-partition"
      ? optionalDecision.dependent
      : undefined;
  const selection = input ? selectedValues(input, values[input.id]) : [];
  const presentation = interactionTargetPresentation(input, visibleEntityIds);
  const requirement =
    optionalDecision && input
      ? requirementFromInput(input)
      : (resolution?.currentStep.requirement ?? (input ? requirementFromInput(input) : undefined));
  const bounds = requirement
    ? requirement.kind === "number" && input?.kind === "number"
      ? `${requirement.required ? "Required" : "Optional"} · Choose ${input.min ?? "any"}–${input.max ?? "any"}`
      : interactionBoundsCopy(
          requirement,
          input?.kind === "entity-selection" && input.role === "cost"
            ? "card"
            : requirement.kind === "option-selection"
              ? "option"
              : requirement.kind === "ordering"
                ? "card"
                : "target",
        )
    : null;
  const instruction = resolveInteractionText(
    requirement?.text ??
      input?.text ??
      resolution?.currentStep.text ??
      draftedAction?.text ?? { key: "interaction.prompt" },
  );
  const effectTitle = isActionDraft
    ? (actionPresentation?.title ?? resolveInteractionText(draftedAction!.text))
    : resolveInteractionText(resolution!.currentEffect.text);
  const displayedEffectTitle = directOrderDestination
    ? `Order ${directOrderDestination.toLocaleLowerCase()}`
    : effectTitle;
  const effectContextSeparator = displayedEffectTitle.lastIndexOf(" — ");
  const defaultEffectTitle =
    effectContextSeparator > 0 ? (
      <>
        <span className={classes.sourceName}>
          {displayedEffectTitle.slice(0, effectContextSeparator)}
        </span>
        <span className={classes.sourceContext}>
          — {displayedEffectTitle.slice(effectContextSeparator + 3)}
        </span>
      </>
    ) : (
      displayedEffectTitle
    );
  const fullStepText = resolution
    ? resolveInteractionText(resolution.currentStep.text)
    : instruction;
  const optionPresentation = input?.kind === "option-selection" ? input.presentation : undefined;
  const optionSearchPresentation =
    optionPresentation?.kind === "search" ? optionPresentation : undefined;
  const optionDirectPresentation =
    optionPresentation?.kind === "direct" ? optionPresentation : undefined;
  const selectionNoun =
    input?.kind === "entity-selection" ||
    input?.kind === "entity-partition" ||
    input?.kind === "entity-allocation"
      ? "card"
      : optionSearchPresentation?.kind === "search"
        ? resolveInteractionText(optionSearchPresentation.label).toLocaleLowerCase()
        : input?.kind === "option-selection"
          ? "option"
          : "target";
  const max = input && "max" in input ? input.max : undefined;
  const min = input && "min" in input ? input.min : undefined;
  const numericSubmission = input?.kind === "number" ? values[input.id] : undefined;
  const numericValue =
    typeof numericSubmission === "number"
      ? numericSubmission
      : input?.kind === "number" && input.max !== undefined && clearedNumberKey !== numberKey
        ? input.max
        : undefined;
  const numericCanConfirm =
    input?.kind !== "number" ||
    (typeof numericValue === "number" &&
      Number.isFinite(numericValue) &&
      (input.min === undefined || numericValue >= input.min) &&
      (input.max === undefined || numericValue <= input.max) &&
      (input.step === undefined ||
        Math.abs(
          (numericValue - (input.min ?? 0)) / input.step -
            Math.round((numericValue - (input.min ?? 0)) / input.step),
        ) <
          Number.EPSILON * 16));
  const allocationValue = allocationInput
    ? readAllocationValue(values[allocationInput.id])
    : undefined;
  const allocationTotal = allocationInput
    ? Object.values(allocationValue ?? {}).reduce((total, amount) => total + amount, 0)
    : 0;
  const allocationCanConfirm =
    !allocationInput ||
    (allocationTotal >= allocationInput.totalMin &&
      allocationTotal <= allocationInput.totalMax &&
      allocationInput.candidates.every((candidate) => {
        const amount = allocationValue?.[candidate.entity.instanceId] ?? 0;
        return amount >= candidate.min && amount <= candidate.max;
      }));
  const selectionCanConfirm =
    input?.kind === "number"
      ? numericCanConfirm
      : input?.kind === "entity-allocation"
        ? allocationCanConfirm
        : (selectionSummary?.canConfirm ??
          (input === undefined ||
            min === undefined ||
            max === undefined ||
            (selection.length >= min && selection.length <= max)));
  const selectedCount =
    input?.kind === "entity-allocation"
      ? allocationTotal
      : (selectionSummary?.selected ?? selection.length);
  const selectionMax =
    input?.kind === "number"
      ? undefined
      : input?.kind === "entity-allocation"
        ? input.totalMax
        : (selectionSummary?.max ?? max);
  const submittedPartitionValue = partitionInput
    ? readPartitionValue(values[partitionInput.id])
    : undefined;
  const partitionValue =
    partitionInput && directOrderRoutes
      ? directOrderedPartitionValue(
          partitionInput,
          directOrderRoutes,
          submittedPartitionValue ?? {},
        )
      : submittedPartitionValue;
  const partitionUsesDefault =
    partitionInput !== undefined &&
    directOrderRoutes !== undefined &&
    partitionValue !== submittedPartitionValue;
  const effectiveValues: Readonly<Record<string, InteractionSubmissionValue>> = partitionInput
    ? { ...values, [partitionInput.id]: partitionValue ?? {} }
    : input?.kind === "number" && numericValue !== undefined
      ? { ...values, [input.id]: numericValue }
      : allocationInput
        ? { ...values, [allocationInput.id]: allocationValue ?? {} }
        : values;
  const acceptedValues = (
    nextValues: Readonly<Record<string, InteractionSubmissionValue>> = effectiveValues,
  ) => (optionalDecision ? { ...nextValues, [optionalDecision.decision.id]: true } : nextValues);
  const hasMultipleTargetGroups =
    inputs.filter((candidate) => candidate.kind === "entity-selection").length > 1;
  const immediateEntitySelection =
    input?.kind === "entity-selection" &&
    interactionCommitMode(input, { immediateOptionalSingletons }) === "immediate" &&
    (presentation === "spatial" || immediateDrawerSelection || choiceModal !== undefined);
  const nextStep =
    optionalDecision && input?.kind === "number"
      ? "Choose an amount to use this optional effect, or skip it."
      : optionalTarget && input?.kind === "entity-partition"
        ? "Select cards to resolve this optional effect, or skip it."
        : optionalTarget && input?.kind === "entity-selection"
          ? input.role === "cost"
            ? instruction
            : presentation === "drawer"
              ? "Choose a card to continue, or skip this effect."
              : "Optional effect: select a highlighted card to continue, or skip it."
          : immediateEntitySelection && presentation === "spatial"
            ? resolution
              ? resolveInteractionText(resolution.currentStep.text)
              : "Select a highlighted card to continue."
            : instruction;
  const requiresConfirm =
    input !== undefined &&
    (input.kind === "ordering" ||
      input.kind === "entity-partition" ||
      input.kind === "entity-allocation" ||
      input.kind === "number" ||
      (input.kind === "option-selection" &&
        !optionDirectPresentation &&
        (input.min !== 1 || input.max !== 1 || optionSearchPresentation !== undefined)) ||
      (input.kind === "entity-selection" &&
        (!immediateEntitySelection || hasMultipleTargetGroups)));
  const canConfirm = (() => {
    if (!action || !requiresConfirm) return selectionCanConfirm;
    const submission = buildInteractionSubmission({
      view,
      action,
      values: {
        ...implicitSubmissionValues(action),
        ...acceptedValues(effectiveValues),
      },
    });
    const validation = validateInteractionSubmission(view, submission);
    if (!isDraftControlled || validation.ok) return selectionCanConfirm && validation.ok;
    const onlyFutureInputsAreMissing = validation.issues.every(
      (issue) =>
        issue.code === "missing_value" && issue.path[0] === "values" && issue.path[1] !== input?.id,
    );
    return selectionCanConfirm && onlyFutureInputsAreMissing;
  })();
  const submit = (
    nextValues: Readonly<Record<string, InteractionSubmissionValue>> = effectiveValues,
  ) => {
    if (!action) return;
    onSubmit?.(
      buildInteractionSubmission({
        view,
        action,
        values: { ...implicitSubmissionValues(action), ...nextValues },
      }),
    );
  };
  const skipOptionalDecision = () => {
    if (!optionalDecision) return;
    if (isDraftControlled) {
      onClearInput?.(optionalDecision.dependent.id);
      onChange?.(optionalDecision.decision.id, false);
      return;
    }
    const nextValues = Object.fromEntries(
      Object.entries(values).filter(([inputId]) => inputId !== optionalDecision.dependent.id),
    );
    submit({ ...nextValues, [optionalDecision.decision.id]: false });
  };
  const confirmSelection = () => {
    if (!isDraftControlled) {
      submit(acceptedValues());
    } else if (partitionInput && partitionValue && partitionUsesDefault) {
      onChange?.(partitionInput.id, partitionValue);
    }
    onConfirm?.();
  };
  const chooseNone = () => {
    if (!input) return;
    const emptyValue = input.kind === "entity-allocation" ? {} : [];
    if (isDraftControlled) onChange?.(input.id, emptyValue);
    else submit({ ...values, [input.id]: emptyValue });
    onTakeNone?.();
    if (isDraftControlled) onConfirm?.();
  };
  const selectedLabels = selectedInputLabels(input, selection);
  const showsSelectedSummary =
    presentation !== "spatial" && selectedLabels.length > 0 && input?.kind !== "option-selection";
  const usesLargeOptionBrowser =
    input?.kind === "option-selection" &&
    (optionSearchPresentation?.kind === "search" ||
      input.options.length > LARGE_OPTION_BROWSER_THRESHOLD);
  const normalizedOptionQuery = normalizeOptionSearchValue(optionQuery);
  const optionResultLimit = optionSearchPresentation?.resultLimit ?? LARGE_OPTION_RESULT_LIMIT;
  const matchingLargeOptions =
    usesLargeOptionBrowser && input?.kind === "option-selection" && normalizedOptionQuery
      ? input.options
          .map((option, index) => ({
            option,
            index,
            rank: optionSearchRank(resolveInteractionText(option.text), normalizedOptionQuery),
          }))
          .filter((match): match is typeof match & { readonly rank: number } => match.rank !== null)
          .sort((left, right) => left.rank - right.rank || left.index - right.index)
          .map((match) => match.option)
      : [];
  const visibleLargeOptions = matchingLargeOptions.slice(0, optionResultLimit);
  const optionById =
    input?.kind === "option-selection"
      ? new Map(input.options.map((option) => [option.id, option] as const))
      : new Map();
  const visibleSuggestionGroups = (optionSearchPresentation?.suggestionGroups ?? []).flatMap(
    (group) => {
      const options = group.optionIds.flatMap((optionId) => {
        const option = optionById.get(optionId);
        return option ? [option] : [];
      });
      return options.length > 0 ? [{ ...group, options }] : [];
    },
  );
  const initialSuggestionGroups =
    visibleSuggestionGroups.length > 0
      ? visibleSuggestionGroups
      : input?.kind === "option-selection" && input.options.length <= optionResultLimit
        ? [
            {
              id: "available",
              text: { key: "Available choices" },
              options: input.options,
            },
          ]
        : [];
  const hasChoiceBrowser = input?.kind === "entity-selection" || input?.kind === "ordering";
  const usesDrawerBrowser = presentation === "drawer" && hasChoiceBrowser;
  const contextLabel =
    !isActionDraft && resolution && (!isActor || resolution.pendingCount > 1)
      ? isActor
        ? `${resolution.pendingCount} decisions remaining`
        : `Effect ${resolution.currentStep.index} of ${resolution.pendingCount}`
      : null;
  const primaryInstruction = actionPresentation?.body ?? nextStep;
  const renderPrimaryInstruction = () =>
    renderInstruction?.(primaryInstruction) ??
    renderText?.(primaryInstruction) ??
    primaryInstruction;
  const detailCopy = [
    actionPresentation?.details,
    actionPresentation?.footerInstruction,
    !optionDirectPresentation && bounds && bounds !== instruction
      ? selectionRequirementCopy(bounds, selectionNoun)
      : undefined,
    resolution && fullStepText !== effectTitle && fullStepText !== primaryInstruction
      ? fullStepText
      : undefined,
  ].filter(
    (copy, index, copies): copy is string => Boolean(copy) && copies.indexOf(copy) === index,
  );
  const hasDetails = detailCopy.length > 0;
  const booleanRequirement =
    resolution?.currentStep.requirement?.kind === "boolean"
      ? resolution.currentStep.requirement
      : undefined;
  const standaloneBooleanIsOptional =
    input?.kind === "boolean" &&
    (booleanRequirement?.required === false || input.required === false);
  const hasSelectionProgress =
    !optionDirectPresentation &&
    selectionMax !== undefined &&
    min !== undefined &&
    (min !== selectionMax || selectionMax > 1);
  const railStatus = optionDirectPresentation
    ? null
    : !isActor
      ? contextLabel
      : optionalDecision
        ? "Optional"
        : input?.kind === "number"
          ? input.min !== undefined && input.max !== undefined
            ? `${input.min}–${input.max}`
            : "Amount"
          : selectionMax !== undefined && min !== undefined
            ? min === selectionMax && min === 1
              ? `${min} required`
              : `${selectedCount} of ${selectionMax} selected`
            : input?.kind === "boolean"
              ? standaloneBooleanIsOptional
                ? "Optional"
                : "Required"
              : contextLabel;
  const isOptionalStatus = railStatus === "Optional";
  const statusSelectionNoun = presentation === "spatial" ? "target" : selectionNoun;
  const railStatusTooltip = isOptionalStatus
    ? "Optional — you can skip this effect."
    : railStatus === "Required" && input?.kind === "boolean"
      ? "Required — choose one response."
      : input?.kind === "number" && input.min !== undefined && input.max !== undefined
        ? `Choose an amount from ${input.min} to ${input.max}.`
        : selectionMax !== undefined && min !== undefined
          ? hasSelectionProgress
            ? `Selection progress — ${selectedCount} of ${selectionMax} selected.`
            : min === selectionMax && min > 0
              ? `Required — choose exactly ${min} ${statusSelectionNoun}${min === 1 ? "" : "s"}.`
              : railStatus
          : railStatus;
  const RailStatusIcon = isOptionalStatus
    ? IconCircleDashedCheck
    : railStatus === "Required" && input?.kind === "boolean"
      ? IconCheck
      : input?.kind === "number"
        ? IconNumbers
        : selectionMax !== undefined && min === selectionMax && min > 0
          ? IconTargetArrow
          : selectionMax !== undefined
            ? IconChecklist
            : IconProgress;
  const setTypedNumericValue = (nextValue: number) => {
    if (input?.kind !== "number") return;
    setClearedNumberKey(undefined);
    onChange?.(input.id, nextValue);
  };
  const setSteppedNumericValue = (nextValue: number) => {
    if (input?.kind !== "number") return;
    const clamped = Math.min(input.max ?? nextValue, Math.max(input.min ?? nextValue, nextValue));
    setClearedNumberKey(undefined);
    onChange?.(input.id, clamped);
  };
  const choiceDialogContents =
    choicesOpen &&
    hasChoiceBrowser &&
    (input?.kind === "entity-selection" || input?.kind === "ordering") ? (
      choiceModal ? (
        <TargetFilterModal
          opened
          mode="select"
          title={choiceModal.title}
          description={choiceModal.description}
          filter={choiceModal.filter}
          table={choiceModal.table}
          entities={choiceModal.entities}
          classNames={choiceModal.classNames}
          emptyLabel={choiceModal.emptyLabel}
          duplicateFilter={choiceModal.duplicateFilter}
          renderPreview={choiceModal.renderPreview}
          selectedIds={selection}
          max={input.max}
          disabledEntityIds={
            new Set(
              input.candidates
                .filter((candidate) => candidate.enabled === false)
                .map((candidate) => candidate.entity.instanceId),
            )
          }
          onSelect={(entity) => {
            const nextSelection = toggleSelection(selection, entity.id, input.max);
            onChange?.(input.id, nextSelection);
            if (!isDraftControlled && immediateEntitySelection && !hasMultipleTargetGroups) {
              submit(
                acceptedValues({
                  ...effectiveValues,
                  [input.id]: nextSelection,
                }),
              );
              setChoicesOpen(false);
            }
          }}
          onChooseNone={
            input.min === 0
              ? () => {
                  chooseNone();
                  setChoicesOpen(false);
                }
              : undefined
          }
          confirmation={
            requiresConfirm
              ? {
                  canConfirm,
                  onConfirm: () => {
                    confirmSelection();
                    setChoicesOpen(false);
                  },
                }
              : undefined
          }
          onMinimize={() => setChoicesOpen(false)}
        />
      ) : (
        <div
          className={classes.choiceBackdrop}
          role="presentation"
          onClick={() => setChoicesOpen(false)}
        >
          <section
            ref={choiceDialogRef}
            className={classes.choiceDialog}
            role="dialog"
            aria-modal="true"
            aria-label="Available choices"
            onClick={(event) => event.stopPropagation()}
          >
            <header className={classes.choiceHeader}>
              <div>
                <strong>Available choices</strong>
                {selectionMax !== undefined ? (
                  <span>
                    {selectedCount}/{selectionMax} selected
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                className={classes.iconButton}
                aria-label="Close available choices"
                onClick={() => setChoicesOpen(false)}
              >
                <IconX size={18} aria-hidden="true" />
              </button>
            </header>
            <div className={classes.drawer}>
              {input.candidates.map((candidate) => {
                const id = candidate.entity.instanceId;
                const selected = selection.includes(id);
                const label = resolveInteractionText(candidate.text ?? { key: id });
                const renderedCandidate = renderCandidate?.(input, id);
                const matchingCandidates = input.candidates.filter(
                  (possibleMatch) =>
                    resolveInteractionText(
                      possibleMatch.text ?? {
                        key: possibleMatch.entity.instanceId,
                      },
                    ) === label,
                );
                const duplicateIndex = matchingCandidates.findIndex(
                  (possibleMatch) => possibleMatch.entity.instanceId === id,
                );
                const duplicateCopy =
                  matchingCandidates.length > 1
                    ? `, copy ${duplicateIndex + 1} of ${matchingCandidates.length}`
                    : "";
                const orderPosition =
                  input.kind === "ordering" && selected
                    ? `Position ${selection.indexOf(id) + 1}, `
                    : "";
                return (
                  <button
                    key={id}
                    type="button"
                    className={classes.candidate}
                    data-selected={selected}
                    data-rendered-candidate={renderedCandidate != null || undefined}
                    aria-label={`${orderPosition}${label}${duplicateCopy}`}
                    disabled={candidate.enabled === false}
                    onClick={() => {
                      const nextSelection = toggleSelection(
                        selection,
                        id,
                        "max" in input ? input.max : selection.length + 1,
                      );
                      onChange?.(input.id, nextSelection);
                      if (
                        !isDraftControlled &&
                        immediateEntitySelection &&
                        !hasMultipleTargetGroups
                      ) {
                        submit(
                          acceptedValues({
                            ...effectiveValues,
                            [input.id]: nextSelection,
                          }),
                        );
                        setChoicesOpen(false);
                      } else if ("max" in input && input.max <= 1) {
                        setChoicesOpen(false);
                      }
                    }}
                  >
                    {input.kind === "ordering" && selected ? (
                      <span
                        className={classes.orderBadge}
                        aria-label={`Position ${selection.indexOf(id) + 1}`}
                      >
                        {selection.indexOf(id) + 1}
                      </span>
                    ) : null}
                    {renderedCandidate ?? renderText?.(label) ?? label}
                  </button>
                );
              })}
            </div>
            {requiresConfirm ? (
              <footer className={classes.choiceActions}>
                <button
                  type="button"
                  className={`${classes.button} ${classes.primary}`}
                  disabled={!canConfirm}
                  onClick={() => {
                    confirmSelection();
                    setChoicesOpen(false);
                  }}
                >
                  {input.kind === "ordering" ? "Confirm order" : "Confirm"}
                </button>
              </footer>
            ) : null}
          </section>
        </div>
      )
    ) : null;
  // The tabletop isolates its stacking context from the persistent sidebar.
  // Portal the modal to the document so a required decision always remains
  // above both surfaces, rather than only above the board area.
  const choiceDialog = choiceModal
    ? choiceDialogContents
    : choiceDialogContents && typeof document !== "undefined"
      ? createPortal(choiceDialogContents, document.body)
      : choiceDialogContents;

  return (
    <>
      <section
        ref={rootRef}
        className={`${classes.root} ${isActor ? "" : classes.observer}`}
        data-testid="interaction-resolution-prompt"
        data-presentation={presentation}
        data-option-presentation={optionPresentation?.kind}
        data-input-kind={input?.kind}
        data-placement={placement}
        data-mobile-draggable={(mobileDraggable && !usesFocusedPartitionWorkspace) || undefined}
        data-dragging={mobileDrag.dragging || undefined}
        style={{ "--prompt-drag-offset": `${mobileDrag.offset}px` } as CSSProperties}
        data-reserve-bottom-target-area={reserveBottomTargetArea || undefined}
        data-minimized={minimized}
        data-details-expanded={detailsExpanded || undefined}
        data-choice-open={choiceDialogContents ? true : undefined}
        data-inline-title={actionPresentation?.inlineTitle || undefined}
        data-layout={usesFocusedPartitionWorkspace ? "focused" : "compact"}
        data-partition-layout={directOrderRoutes ? "direct-order" : undefined}
        role={usesFocusedPartitionWorkspace && isActor ? "dialog" : "region"}
        aria-modal={usesFocusedPartitionWorkspace && isActor ? true : undefined}
        tabIndex={isActor ? -1 : undefined}
        aria-labelledby={usesFocusedPartitionWorkspace ? headingId : undefined}
        aria-describedby={minimized ? undefined : instructionId}
        aria-live={isActor ? undefined : "polite"}
        aria-atomic={isActor ? undefined : true}
        aria-label={
          usesFocusedPartitionWorkspace
            ? undefined
            : isActionDraft
              ? "Current action"
              : isActor
                ? "Current effect"
                : "Opponent effect progress"
        }
        onKeyDown={(event) => {
          if (event.key !== "Escape" || !detailsExpanded || usesFocusedPartitionWorkspace) return;
          event.preventDefault();
          event.stopPropagation();
          setDetailsExpanded(false);
        }}
      >
        <div className={classes.rail} data-slot="interaction-rail">
          <span className={classes.signal} data-slot="interaction-signal" aria-hidden="true" />
          <div className={classes.identity} data-slot="interaction-identity">
            <div className={classes.sourceRow} data-slot="interaction-source-row">
              <div className={classes.source} id={headingId} data-slot="interaction-source">
                {renderEffectTitle?.(displayedEffectTitle) ??
                  renderText?.(displayedEffectTitle) ??
                  defaultEffectTitle}
              </div>
              {!minimized && railStatus && railStatusTooltip ? (
                <span
                  className={classes.statusHint}
                  data-slot="interaction-status"
                  data-selection-progress={hasSelectionProgress || undefined}
                  role={hasSelectionProgress ? "status" : "img"}
                  aria-live={hasSelectionProgress ? "polite" : undefined}
                  aria-label={railStatusTooltip}
                  title={railStatusTooltip}
                  tabIndex={0}
                >
                  {hasSelectionProgress ? (
                    <span className={classes.statusValue} aria-hidden="true">
                      {selectedCount}/{selectionMax}
                    </span>
                  ) : (
                    <RailStatusIcon size={16} stroke={2.2} aria-hidden="true" />
                  )}
                </span>
              ) : null}
            </div>
            {!minimized ? (
              <PopoverPrimitive.Root
                open={suppressInstructionTooltip ? false : instructionTooltipOpen}
                onOpenChange={setInstructionTooltipOpen}
              >
                <PopoverPrimitive.Anchor asChild>
                  <p
                    className={classes.instruction}
                    id={instructionId}
                    data-slot="interaction-instruction"
                    data-testid={actionPresentation?.body ? "interaction-action-body" : undefined}
                    tabIndex={
                      actionPresentation?.body && !suppressInstructionTooltip ? 0 : undefined
                    }
                    onFocus={() => {
                      if (!actionPresentation?.body || suppressInstructionTooltip) return;
                      setInstructionTooltipOpen(true);
                    }}
                    onBlur={() => {
                      if (instructionTooltipTimerRef.current)
                        clearTimeout(instructionTooltipTimerRef.current);
                      setInstructionTooltipOpen(false);
                    }}
                    onMouseEnter={() => {
                      if (!actionPresentation?.body || suppressInstructionTooltip) return;
                      instructionTooltipTimerRef.current = setTimeout(
                        () => setInstructionTooltipOpen(true),
                        250,
                      );
                    }}
                    onMouseLeave={() => {
                      if (instructionTooltipTimerRef.current)
                        clearTimeout(instructionTooltipTimerRef.current);
                      setInstructionTooltipOpen(false);
                    }}
                  >
                    {renderPrimaryInstruction()}
                  </p>
                </PopoverPrimitive.Anchor>
                <PopoverPrimitive.Portal>
                  <PopoverPrimitive.Content
                    className={classes.instructionTooltip}
                    role="tooltip"
                    side={placement === "top" ? "bottom" : "top"}
                    align="start"
                    sideOffset={8}
                    collisionPadding={12}
                    onOpenAutoFocus={(event) => event.preventDefault()}
                    onCloseAutoFocus={(event) => event.preventDefault()}
                  >
                    {renderPrimaryInstruction()}
                  </PopoverPrimitive.Content>
                </PopoverPrimitive.Portal>
              </PopoverPrimitive.Root>
            ) : null}
          </div>

          <div className={classes.controls} data-slot="interaction-controls">
            {mobileDraggable && !usesFocusedPartitionWorkspace ? (
              <button
                type="button"
                className={`${classes.iconButton} ${classes.dragHandle}`}
                aria-label="Move prompt vertically"
                title="Drag to move the prompt. Use Up and Down arrows with a keyboard; Home resets its position."
                {...mobileDrag.handleProps}
              >
                <IconGripVertical size={20} aria-hidden="true" />
              </button>
            ) : null}
            {isActor && isActionDraft && onCancel ? (
              <button
                type="button"
                className={`${classes.iconButton} ${classes.mobileCancel}`}
                aria-label="Cancel current action"
                title="Cancel current action"
                onClick={onCancel}
              >
                <IconX size={19} aria-hidden="true" />
              </button>
            ) : null}
            {minimized ? (
              <button
                type="button"
                className={classes.button}
                aria-label="Expand prompt"
                onClick={() => {
                  setDetailsExpanded(false);
                  setMinimized(false);
                  setUtilityMenuOpen(false);
                }}
              >
                Expand
              </button>
            ) : null}
            <PopoverPrimitive.Root open={utilityMenuOpen} onOpenChange={setUtilityMenuOpen}>
              <PopoverPrimitive.Trigger asChild>
                <button
                  ref={utilityTriggerRef}
                  type="button"
                  className={classes.iconButton}
                  aria-label="Prompt controls"
                  title="Prompt controls"
                >
                  <IconAdjustmentsHorizontal size={19} aria-hidden="true" />
                </button>
              </PopoverPrimitive.Trigger>
              <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                  className={classes.utilityMenu}
                  data-interaction-utility-menu
                  side={placement === "top" ? "bottom" : "top"}
                  align="end"
                  sideOffset={8}
                  collisionPadding={12}
                  aria-label="Prompt controls"
                  onCloseAutoFocus={(event) => {
                    if (choicesOpen) event.preventDefault();
                  }}
                >
                  <div className={classes.utilityMenuHeader}>Prompt controls</div>
                  <div className={classes.utilityMenuItems}>
                    {hasDetails && !minimized ? (
                      <button
                        type="button"
                        className={classes.utilityMenuItem}
                        aria-expanded={detailsExpanded}
                        aria-controls={detailsId}
                        onClick={() => {
                          setDetailsExpanded((current) => !current);
                          setUtilityMenuOpen(false);
                        }}
                      >
                        <span className={classes.utilityMenuIcon} aria-hidden="true">
                          {detailsExpanded ? (
                            <IconChevronUp size={19} />
                          ) : (
                            <IconChevronDown size={19} />
                          )}
                        </span>
                        <span className={classes.utilityMenuCopy}>
                          <strong>{detailsExpanded ? "Hide details" : "Show details"}</strong>
                          <span>
                            Read the card text, effect details, and selection requirements.
                          </span>
                        </span>
                      </button>
                    ) : null}
                    {hasChoiceBrowser && isActor ? (
                      <button
                        type="button"
                        className={classes.utilityMenuItem}
                        onClick={() => {
                          setUtilityMenuOpen(false);
                          setChoicesOpen(true);
                        }}
                      >
                        <span className={classes.utilityMenuIcon} aria-hidden="true">
                          <IconListDetails size={19} />
                        </span>
                        <span className={classes.utilityMenuCopy}>
                          <strong>Browse choices</strong>
                          <span>Inspect available cards and select a target manually.</span>
                        </span>
                      </button>
                    ) : null}
                    {!usesFocusedPartitionWorkspace ? (
                      <button
                        type="button"
                        className={classes.utilityMenuItem}
                        onClick={() => {
                          setPlacement((current) => (current === "top" ? "bottom" : "top"));
                          setUtilityMenuOpen(false);
                        }}
                      >
                        <span className={classes.utilityMenuIcon} aria-hidden="true">
                          {placement === "top" ? (
                            <IconArrowDown size={19} />
                          ) : (
                            <IconArrowUp size={19} />
                          )}
                        </span>
                        <span className={classes.utilityMenuCopy}>
                          <strong>{placement === "top" ? "Move to bottom" : "Move to top"}</strong>
                          <span>Reposition the prompt when it covers cards or targets.</span>
                        </span>
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className={classes.utilityMenuItem}
                      onClick={() => {
                        setDetailsExpanded(false);
                        setMinimized((current) => !current);
                        setUtilityMenuOpen(false);
                      }}
                    >
                      <span className={classes.utilityMenuIcon} aria-hidden="true">
                        {minimized ? <IconPlus size={19} /> : <IconMinus size={19} />}
                      </span>
                      <span className={classes.utilityMenuCopy}>
                        <strong>{minimized ? "Expand prompt" : "Minimize prompt"}</strong>
                        <span>
                          {minimized
                            ? "Restore the current interaction controls."
                            : "Collapse the prompt while keeping the interaction active."}
                        </span>
                      </span>
                    </button>
                  </div>
                  <PopoverPrimitive.Arrow className={classes.utilityMenuArrow} />
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>
          </div>
          {isActor && !minimized && decisionControls ? (
            <footer className={classes.actions} data-slot="interaction-actions">
              {decisionControls}
            </footer>
          ) : isActor && !minimized && !instructionOnly ? (
            <footer className={classes.actions} data-slot="interaction-actions">
              {input?.kind === "number" ? (
                <div className={classes.numberStepper} role="group" aria-label="Amount">
                  <button
                    type="button"
                    aria-label="Decrease amount"
                    disabled={
                      numericValue === undefined || numericValue <= (input.min ?? -Infinity)
                    }
                    onClick={() =>
                      setSteppedNumericValue((numericValue ?? input.min ?? 0) - (input.step ?? 1))
                    }
                  >
                    <IconMinus size={18} aria-hidden="true" />
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    value={numericValue ?? ""}
                    aria-label="Amount"
                    aria-describedby={instructionId}
                    onChange={(event) => {
                      if (event.currentTarget.value === "") {
                        setClearedNumberKey(numberKey);
                        onClearInput?.(input.id);
                        return;
                      }
                      setTypedNumericValue(event.currentTarget.valueAsNumber);
                    }}
                  />
                  <button
                    type="button"
                    aria-label="Increase amount"
                    disabled={numericValue === undefined || numericValue >= (input.max ?? Infinity)}
                    onClick={() =>
                      setSteppedNumericValue((numericValue ?? input.min ?? 0) + (input.step ?? 1))
                    }
                  >
                    <IconPlus size={18} aria-hidden="true" />
                  </button>
                </div>
              ) : null}
              {isActionDraft && onCancel ? (
                <button
                  type="button"
                  className={`${classes.button} ${classes.desktopCancel}`}
                  onClick={onCancel}
                >
                  Cancel
                </button>
              ) : null}
              {auxiliaryAction ? (
                <button
                  type="button"
                  className={classes.button}
                  title={auxiliaryAction.title}
                  disabled={auxiliaryAction.disabled}
                  onClick={auxiliaryAction.onSelect}
                >
                  {auxiliaryAction.label}
                </button>
              ) : null}
              {secondaryUndoAction ? (
                <button
                  type="button"
                  className={classes.button}
                  onClick={() =>
                    onSubmit?.(
                      buildInteractionSubmission({
                        view,
                        action: secondaryUndoAction,
                        values: {},
                      }),
                    )
                  }
                >
                  {renderText?.(resolveInteractionText(secondaryUndoAction.text)) ??
                    resolveInteractionText(secondaryUndoAction.text)}
                </button>
              ) : null}
              {input?.kind === "boolean" && !optionalTarget ? (
                <>
                  <button
                    type="button"
                    className={classes.button}
                    onClick={() => {
                      onChange?.(input.id, false);
                      if (!isDraftControlled) submit({ ...values, [input.id]: false });
                    }}
                  >
                    {renderText?.(resolveInteractionText(input.falseText)) ??
                      resolveInteractionText(input.falseText)}
                  </button>
                  <button
                    type="button"
                    className={`${classes.button} ${classes.primary}`}
                    onClick={() => {
                      onChange?.(input.id, true);
                      if (!isDraftControlled) submit({ ...values, [input.id]: true });
                    }}
                  >
                    {renderText?.(resolveInteractionText(input.trueText)) ??
                      resolveInteractionText(input.trueText)}
                  </button>
                </>
              ) : null}
              {input?.kind === "option-selection" && optionDirectPresentation ? (
                <>
                  <button
                    type="button"
                    className={classes.button}
                    data-choice-emphasis="neutral"
                    onClick={() => {
                      onChange?.(input.id, []);
                      submit({ ...values, [input.id]: [] });
                    }}
                  >
                    {renderText?.(resolveInteractionText(optionDirectPresentation.emptyText)) ??
                      resolveInteractionText(optionDirectPresentation.emptyText)}
                  </button>
                  {input.options
                    .filter((option) => option.enabled)
                    .map((option) => (
                      <button
                        type="button"
                        className={classes.button}
                        data-choice-emphasis="neutral"
                        key={option.id}
                        onClick={() => {
                          onChange?.(input.id, [option.id]);
                          submit({ ...values, [input.id]: [option.id] });
                        }}
                      >
                        {renderText?.(resolveInteractionText(option.text)) ??
                          resolveInteractionText(option.text)}
                      </button>
                    ))}
                </>
              ) : null}
              {input && !optionDirectPresentation ? (
                <>
                  {selectedCount > 0 &&
                  input.kind !== "option-selection" &&
                  presentation !== "spatial" &&
                  input.kind !== "entity-allocation" ? (
                    <button
                      type="button"
                      className={classes.button}
                      onClick={() => {
                        if (hasChoiceBrowser) setChoicesOpen(true);
                        else onClear?.();
                      }}
                    >
                      {input.kind === "ordering"
                        ? hasChoiceBrowser
                          ? "Change order"
                          : "Reset order"
                        : "Change selection"}
                    </button>
                  ) : null}
                  {usesDrawerBrowser && selectedCount === 0 ? (
                    <button
                      type="button"
                      className={`${classes.button} ${classes.primary}`}
                      onClick={() => setChoicesOpen(true)}
                    >
                      {input.kind === "ordering" ? "Choose order" : "Choose card"}
                    </button>
                  ) : null}
                  {optionalDecision ? (
                    <button type="button" className={classes.button} onClick={skipOptionalDecision}>
                      Skip effect
                    </button>
                  ) : null}
                  {min === 0 && input.kind !== "number" ? (
                    <button type="button" className={classes.button} onClick={chooseNone}>
                      Choose none
                    </button>
                  ) : null}
                  {requiresConfirm && (!partitionInput || !usesFocusedPartitionWorkspace) ? (
                    <button
                      type="button"
                      className={`${classes.button} ${classes.primary}`}
                      disabled={!canConfirm}
                      onClick={confirmSelection}
                    >
                      {input.kind === "ordering"
                        ? "Confirm order"
                        : input.kind === "number"
                          ? "Confirm amount"
                          : input.kind === "entity-allocation"
                            ? "Confirm allocation"
                            : optionSearchPresentation?.kind === "search"
                              ? resolveInteractionText(optionSearchPresentation.confirmLabel)
                              : input.kind === "option-selection" && input.max > 1
                                ? "Confirm selections"
                                : "Confirm"}
                    </button>
                  ) : null}
                </>
              ) : null}
              {immediateAction ? (
                <button
                  type="button"
                  className={`${classes.button} ${classes.primary}`}
                  data-testid="interaction-submit-action"
                  onClick={() => submit()}
                >
                  {renderText?.(
                    actionPresentation?.submitLabel ?? resolveInteractionText(action.text),
                  ) ??
                    actionPresentation?.submitLabel ??
                    resolveInteractionText(action.text)}
                </button>
              ) : null}
            </footer>
          ) : null}
        </div>

        {detailsExpanded && hasDetails && !minimized ? (
          <div className={classes.details} id={detailsId}>
            {detailCopy.map((copy) => (
              <p key={copy}>{renderText?.(copy) ?? copy}</p>
            ))}
          </div>
        ) : null}

        {!instructionOnly &&
        !minimized &&
        isActor &&
        optionDirectPresentation === undefined &&
        (showsSelectedSummary ||
          input?.kind === "option-selection" ||
          input?.kind === "entity-allocation") ? (
          <div className={classes.interactionPanel}>
            {showsSelectedSummary && input ? (
              <div className={classes.selections} aria-label="Current selections">
                {selectedLabels.map(({ id, label }, index) => (
                  <span className={classes.selection} key={id}>
                    <small>
                      {input.kind === "ordering" ? `Position ${index + 1}` : "Selected"}
                    </small>
                    <strong>{label}</strong>
                    <button
                      type="button"
                      aria-label={`Remove ${label}`}
                      onClick={() =>
                        onChange?.(
                          input.id,
                          selection.filter((value) => value !== id),
                        )
                      }
                    >
                      <IconMinus size={14} aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
            {input?.kind === "option-selection" ? (
              usesLargeOptionBrowser ? (
                <div className={classes.largeOptionBrowser}>
                  <label className={classes.optionSearchLabel} htmlFor={`${instructionId}-search`}>
                    {optionSearchPresentation
                      ? resolveInteractionText(optionSearchPresentation.label)
                      : "Search choices"}
                  </label>
                  <div className={classes.optionSearchControl}>
                    <IconSearch size={18} aria-hidden="true" />
                    <input
                      id={`${instructionId}-search`}
                      type="search"
                      value={optionQuery}
                      autoComplete="off"
                      spellCheck={false}
                      placeholder={
                        optionSearchPresentation
                          ? resolveInteractionText(optionSearchPresentation.placeholder)
                          : "Type to filter"
                      }
                      onChange={(event) => setOptionQuery(event.currentTarget.value)}
                    />
                  </div>
                  {!normalizedOptionQuery &&
                  optionSearchPresentation?.description &&
                  resolveInteractionText(optionSearchPresentation.description) !==
                    primaryInstruction ? (
                    <p className={classes.optionSearchDescription}>
                      {resolveInteractionText(optionSearchPresentation.description)}
                    </p>
                  ) : null}
                  {normalizedOptionQuery ? (
                    <>
                      <p className={classes.optionSearchStatus} aria-live="polite">
                        {matchingLargeOptions.length === 0
                          ? `No choices match “${optionQuery.trim()}”. Try another spelling.`
                          : matchingLargeOptions.length > optionResultLimit
                            ? `Showing ${optionResultLimit} of ${matchingLargeOptions.length} matches. Keep typing to narrow the list.`
                            : `${matchingLargeOptions.length} ${matchingLargeOptions.length === 1 ? "match" : "matches"}.`}
                      </p>
                      <div
                        className={classes.optionSearchResults}
                        role={input.max === 1 ? "radiogroup" : undefined}
                        aria-labelledby={input.max === 1 ? instructionId : undefined}
                      >
                        {visibleLargeOptions.map((option) => {
                          const selected = selection.includes(option.id);
                          const label = resolveInteractionText(option.text);
                          return (
                            <button
                              key={option.id}
                              type="button"
                              className={`${classes.button} ${classes.optionButton}`}
                              data-selected={selected}
                              data-selection-mode={input.max === 1 ? "single" : "multiple"}
                              role={input.max === 1 ? "radio" : undefined}
                              aria-checked={input.max === 1 ? selected : undefined}
                              aria-pressed={input.max === 1 ? undefined : selected}
                              disabled={option.enabled === false}
                              onClick={() => {
                                const nextSelection = toggleSelection(
                                  selection,
                                  option.id,
                                  input.max,
                                );
                                onChange?.(input.id, nextSelection);
                                if (
                                  !isDraftControlled &&
                                  !requiresConfirm &&
                                  input.min === 1 &&
                                  input.max === 1
                                ) {
                                  submit(
                                    acceptedValues({
                                      ...values,
                                      [input.id]: nextSelection,
                                    }),
                                  );
                                }
                              }}
                            >
                              <span className={classes.optionIndicator} aria-hidden="true">
                                <IconCheck size={14} stroke={2.5} />
                              </span>
                              <span>{renderText?.(label) ?? label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : initialSuggestionGroups.length > 0 ? (
                    <div className={classes.optionSuggestionGroups}>
                      {initialSuggestionGroups.map((group) => (
                        <section className={classes.optionSuggestionGroup} key={group.id}>
                          <h3>{resolveInteractionText(group.text)}</h3>
                          <div
                            className={classes.optionSearchResults}
                            role={input.max === 1 ? "radiogroup" : undefined}
                            aria-labelledby={input.max === 1 ? instructionId : undefined}
                          >
                            {group.options.map((option) => {
                              const selected = selection.includes(option.id);
                              const label = resolveInteractionText(option.text);
                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  className={`${classes.button} ${classes.optionButton}`}
                                  data-selected={selected}
                                  data-selection-mode={input.max === 1 ? "single" : "multiple"}
                                  role={input.max === 1 ? "radio" : undefined}
                                  aria-checked={input.max === 1 ? selected : undefined}
                                  aria-pressed={input.max === 1 ? undefined : selected}
                                  disabled={option.enabled === false}
                                  onClick={() => {
                                    const nextSelection = toggleSelection(
                                      selection,
                                      option.id,
                                      input.max,
                                    );
                                    onChange?.(input.id, nextSelection);
                                    if (
                                      !isDraftControlled &&
                                      !requiresConfirm &&
                                      input.min === 1 &&
                                      input.max === 1
                                    ) {
                                      submit(
                                        acceptedValues({
                                          ...values,
                                          [input.id]: nextSelection,
                                        }),
                                      );
                                    }
                                  }}
                                >
                                  <span className={classes.optionIndicator} aria-hidden="true">
                                    <IconCheck size={14} stroke={2.5} />
                                  </span>
                                  <span>{renderText?.(label) ?? label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </section>
                      ))}
                    </div>
                  ) : (
                    <p className={classes.optionSearchStatus} aria-live="polite">
                      {input.options.length} {input.options.length === 1 ? "choice" : "choices"}{" "}
                      available. Start typing to search.
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className={classes.options}
                  role={input.max === 1 ? "radiogroup" : undefined}
                  aria-labelledby={input.max === 1 ? instructionId : undefined}
                >
                  {input.options.map((option) => {
                    const selected = selection.includes(option.id);
                    const label = resolveInteractionText(option.text);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`${classes.button} ${classes.optionButton}`}
                        data-selected={selected}
                        data-selection-mode={input.max === 1 ? "single" : "multiple"}
                        role={input.max === 1 ? "radio" : undefined}
                        aria-checked={input.max === 1 ? selected : undefined}
                        aria-pressed={input.max === 1 ? undefined : selected}
                        disabled={option.enabled === false}
                        onClick={() => {
                          const nextSelection = toggleSelection(selection, option.id, input.max);
                          onChange?.(input.id, nextSelection);
                          if (
                            !isDraftControlled &&
                            !requiresConfirm &&
                            input.min === 1 &&
                            input.max === 1
                          ) {
                            submit(
                              acceptedValues({
                                ...values,
                                [input.id]: nextSelection,
                              }),
                            );
                          }
                        }}
                      >
                        <span className={classes.optionIndicator} aria-hidden="true">
                          <IconCheck size={14} stroke={2.5} />
                        </span>
                        <span>{renderText?.(label) ?? label}</span>
                      </button>
                    );
                  })}
                </div>
              )
            ) : input?.kind === "entity-allocation" ? (
              <AllocationWorkspace
                input={input}
                value={allocationValue ?? {}}
                onChange={(nextValue) => onChange?.(input.id, nextValue)}
                renderCandidate={renderCandidate}
              />
            ) : null}
          </div>
        ) : null}

        {isActor && !minimized && partitionInput && usesFocusedPartitionWorkspace ? (
          <PartitionWorkspace
            input={partitionInput}
            value={partitionValue ?? {}}
            onChange={(nextValue) => onChange?.(partitionInput.id, nextValue)}
            canConfirm={canConfirm}
            onConfirm={confirmSelection}
            renderCandidate={renderCandidate}
            onOrderedCandidatePreview={onOrderedCandidatePreview}
            onOrderedCandidatePreviewEnd={onOrderedCandidatePreviewEnd}
            renderText={renderText}
          />
        ) : null}
      </section>
      {choiceDialog}
    </>
  );
}

function selectedInputLabels(
  input: InteractionInput | undefined,
  selection: readonly string[],
): ReadonlyArray<{ readonly id: string; readonly label: string }> {
  if (!input || selection.length === 0) return [];
  if (input.kind === "entity-selection" || input.kind === "ordering") {
    return selection.map((id) => {
      const candidate = input.candidates.find((item) => item.entity.instanceId === id);
      return {
        id,
        label: resolveInteractionText(candidate?.text ?? { key: id }),
      };
    });
  }
  if (input.kind === "option-selection") {
    return selection.map((id) => {
      const option = input.options.find((item) => item.id === id);
      return { id, label: resolveInteractionText(option?.text ?? { key: id }) };
    });
  }
  return [];
}

function AllocationWorkspace({
  input,
  value,
  onChange,
  renderCandidate,
}: {
  readonly input: EntityAllocationInput;
  readonly value: EntityAllocationValue;
  readonly onChange: (value: EntityAllocationValue) => void;
  readonly renderCandidate?: InteractionResolutionPromptProps["renderCandidate"];
}) {
  const total = Object.values(value).reduce((sum, amount) => sum + amount, 0);
  const setAmount = (id: string, amount: number) => {
    const next = { ...value };
    if (amount === 0) delete next[id];
    else next[id] = amount;
    onChange(next);
  };
  return (
    <div className={classes.drawer} role="group" aria-label={`Allocation, ${total} assigned`}>
      {input.candidates.map((candidate) => {
        const id = candidate.entity.instanceId;
        const amount = value[id] ?? 0;
        const label = resolveInteractionText(candidate.text ?? { key: id });
        return (
          <div className={classes.candidate} key={id} data-selected={amount > 0 || undefined}>
            {renderCandidate?.(input, id) ?? label}
            <div className={classes.numberStepper} role="group" aria-label={`Allocate to ${label}`}>
              <button
                type="button"
                aria-label={`Decrease allocation for ${label}`}
                disabled={candidate.enabled === false || amount <= candidate.min}
                onClick={() => setAmount(id, amount - 1)}
              >
                <IconMinus size={18} aria-hidden="true" />
              </button>
              <output aria-label={`${label} allocation`}>{amount}</output>
              <button
                type="button"
                aria-label={`Increase allocation for ${label}`}
                disabled={
                  candidate.enabled === false || amount >= candidate.max || total >= input.totalMax
                }
                onClick={() => setAmount(id, amount + 1)}
              >
                <IconPlus size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PartitionWorkspace({
  input,
  value,
  onChange,
  canConfirm,
  onConfirm,
  renderCandidate,
  onOrderedCandidatePreview,
  onOrderedCandidatePreviewEnd,
  renderText,
}: {
  readonly input: EntityPartitionInput;
  readonly value: EntityPartitionValue;
  readonly onChange: (value: EntityPartitionValue) => void;
  readonly canConfirm: boolean;
  readonly onConfirm: () => void;
  readonly renderCandidate?: (input: InteractionInput, entityId: string) => ReactNode;
  readonly onOrderedCandidatePreview?: (input: EntityPartitionInput, entityId: string) => void;
  readonly onOrderedCandidatePreviewEnd?: () => void;
  readonly renderText?: (text: string) => ReactNode;
}) {
  const candidateStripRef = useRef<HTMLDivElement>(null);
  const [candidateScroll, setCandidateScroll] = useState({
    before: false,
    after: false,
  });

  useEffect(() => {
    const strip = candidateStripRef.current;
    if (!strip) return;

    const updateCandidateScroll = () => {
      const maximumScroll = Math.max(0, strip.scrollWidth - strip.clientWidth);
      setCandidateScroll({
        before: strip.scrollLeft > 1,
        after: strip.scrollLeft < maximumScroll - 1,
      });
    };

    const firstSelectable = strip.querySelector<HTMLElement>('[data-directly-selectable="true"]');

    if (firstSelectable) {
      const stripBounds = strip.getBoundingClientRect();
      const cardBounds = firstSelectable.getBoundingClientRect();
      const fullyVisible =
        cardBounds.left >= stripBounds.left && cardBounds.right <= stripBounds.right;
      if (!fullyVisible) {
        const centeredLeft =
          strip.scrollLeft +
          cardBounds.left -
          stripBounds.left -
          (stripBounds.width - cardBounds.width) / 2;
        strip.scrollTo({ left: Math.max(0, centeredLeft), behavior: "auto" });
      }
    }

    updateCandidateScroll();
    strip.addEventListener("scroll", updateCandidateScroll, { passive: true });
    const resizeObserver = new ResizeObserver(updateCandidateScroll);
    resizeObserver.observe(strip);
    return () => {
      strip.removeEventListener("scroll", updateCandidateScroll);
      resizeObserver.disconnect();
    };
  }, [input.id, input.candidates.length]);

  const scrollCandidates = (direction: -1 | 1) => {
    const strip = candidateStripRef.current;
    if (!strip) return;
    const maximumScroll = Math.max(0, strip.scrollWidth - strip.clientWidth);
    const distance = Math.max(strip.clientWidth * 0.8, 104);
    strip.scrollTo({
      left: Math.min(maximumScroll, Math.max(0, strip.scrollLeft + direction * distance)),
      behavior: "smooth",
    });
  };

  const orderedRoutes = directOrderedRoutes(input);
  if (orderedRoutes) {
    return (
      <DirectOrderedWorkspace
        input={input}
        routes={orderedRoutes}
        value={value}
        onChange={onChange}
        canConfirm={canConfirm}
        onConfirm={onConfirm}
        renderCandidate={renderCandidate}
        onOrderedCandidatePreview={onOrderedCandidatePreview}
        onOrderedCandidatePreviewEnd={onOrderedCandidatePreviewEnd}
        renderText={renderText}
      />
    );
  }

  const routeByCandidate = new Map<string, string>();
  for (const [routeId, ids] of Object.entries(value)) {
    for (const id of ids) routeByCandidate.set(id, routeId);
  }

  const assign = (entityId: string, routeId: string) => {
    const currentRoute = routeByCandidate.get(entityId);
    const next = Object.fromEntries(
      input.routes.map((route) => [
        route.id,
        (value[route.id] ?? []).filter((candidateId) => candidateId !== entityId),
      ]),
    );
    if (currentRoute !== routeId) next[routeId] = [...(next[routeId] ?? []), entityId];
    onChange(next);
  };

  const move = (entityId: string, routeId: string, offset: -1 | 1) => {
    const ids = [...(value[routeId] ?? [])];
    const from = ids.indexOf(entityId);
    const to = from + offset;
    if (from < 0 || to < 0 || to >= ids.length) return;
    [ids[from], ids[to]] = [ids[to]!, ids[from]!];
    onChange({ ...value, [routeId]: ids });
  };

  const assignedIds = new Set(Object.values(value).flat());
  const candidateById = new Map(
    input.candidates.map((candidate) => [candidate.entity.instanceId, candidate] as const),
  );
  const automaticIds =
    input.assignment === "remainder-automatic"
      ? input.candidates
          .map((candidate) => candidate.entity.instanceId)
          .filter((entityId) => !assignedIds.has(entityId))
      : [];
  return (
    <div
      className={classes.partition}
      data-density={input.candidates.length >= 5 ? "dense" : "standard"}
      aria-label="Card destinations"
    >
      <section className={classes.revealedSection} aria-labelledby={`${input.id}-candidates-title`}>
        <header className={classes.sectionHeader}>
          <h3 id={`${input.id}-candidates-title`}>
            {(() => {
              const label = resolveInteractionText(
                input.candidateSetText ?? {
                  key: "interaction.partition.candidates",
                  params: {
                    label:
                      input.routes.length === 1 && input.routes[0]?.ordered
                        ? "Choose cards in order"
                        : "Available cards",
                  },
                },
              );
              return renderText?.(label) ?? label;
            })()}
          </h3>
          <div className={classes.partitionHeaderTools}>
            {candidateScroll.before || candidateScroll.after ? (
              <button
                type="button"
                className={classes.partitionScrollButton}
                aria-label="Show earlier revealed cards"
                disabled={!candidateScroll.before}
                onClick={() => scrollCandidates(-1)}
              >
                <IconChevronLeft size={18} aria-hidden="true" />
              </button>
            ) : null}
            <span className={classes.sectionCount}>{input.candidates.length}</span>
            {candidateScroll.before || candidateScroll.after ? (
              <button
                type="button"
                className={classes.partitionScrollButton}
                aria-label="Show later revealed cards"
                disabled={!candidateScroll.after}
                onClick={() => scrollCandidates(1)}
              >
                <IconChevronRight size={18} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </header>
        <div ref={candidateStripRef} className={classes.partitionGrid}>
          {input.candidates.map((candidate, candidateIndex) => {
            const entityId = candidate.entity.instanceId;
            const routeId = routeByCandidate.get(entityId);
            const route = input.routes.find((candidateRoute) => candidateRoute.id === routeId);
            const automatic = !route && input.assignment === "remainder-automatic";
            const eligibleRoutes = input.routes.filter(
              (candidateRoute) =>
                candidateRoute.candidateIds === undefined ||
                candidateRoute.candidateIds.includes(entityId),
            );
            const directRoute = eligibleRoutes.length === 1 ? eligibleRoutes[0] : undefined;
            const directRouteFull =
              directRoute !== undefined &&
              directRoute.id !== routeId &&
              (value[directRoute.id]?.length ?? 0) >= directRoute.max;
            const directlySelectable =
              candidate.enabled !== false && directRoute !== undefined && !directRouteFull;
            const status = route
              ? resolveInteractionText(route.text)
              : automatic
                ? eligibleRoutes.length > 0
                  ? `Select for ${resolveInteractionText(eligibleRoutes[0]!.text)}`
                  : "Handled automatically"
                : eligibleRoutes.length > 0
                  ? "Choose a destination"
                  : "No eligible destination";
            return (
              <article
                key={entityId}
                className={classes.partitionCard}
                data-route={routeId ?? ""}
                data-eligible={eligibleRoutes.length > 0}
                data-selected={route !== undefined}
                data-directly-selectable={directlySelectable}
              >
                <button
                  type="button"
                  className={classes.partitionPreview}
                  disabled={!directlySelectable}
                  aria-pressed={directRoute ? directRoute.id === routeId : undefined}
                  aria-label={
                    directRoute
                      ? `${directRoute.id === routeId ? "Remove" : "Select"} card ${candidateIndex + 1} for ${resolveInteractionText(directRoute.text)}`
                      : `Card ${candidateIndex + 1} has no direct destination`
                  }
                  onClick={() => {
                    if (directRoute) assign(entityId, directRoute.id);
                  }}
                >
                  {renderCandidate?.(input, entityId) ??
                    (() => {
                      const label = resolveInteractionText(candidate.text ?? { key: entityId });
                      return renderText?.(label) ?? label;
                    })()}
                </button>
                <div className={classes.partitionStatus} aria-live="polite">
                  {renderText?.(status) ?? status}
                </div>
                {eligibleRoutes.length > 1 ? (
                  <div className={classes.partitionRoutes}>
                    {input.routes.map((candidateRoute) => {
                      const eligible =
                        !candidateRoute.candidateIds ||
                        candidateRoute.candidateIds.includes(entityId);
                      const selected = candidateRoute.id === routeId;
                      const routeFull =
                        !selected && (value[candidateRoute.id]?.length ?? 0) >= candidateRoute.max;
                      return (
                        <button
                          key={candidateRoute.id}
                          type="button"
                          className={classes.routeButton}
                          data-selected={selected}
                          aria-pressed={selected}
                          disabled={candidate.enabled === false || !eligible || routeFull}
                          onClick={() => assign(entityId, candidateRoute.id)}
                        >
                          {renderText?.(resolveInteractionText(candidateRoute.text)) ??
                            resolveInteractionText(candidateRoute.text)}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className={classes.destinationSection} aria-label="Destination summary">
        {input.routes.map((route) => {
          const routeIds = value[route.id] ?? [];
          const count = routeIds.length;
          const routeLabel = resolveInteractionText(route.text);
          return (
            <div key={route.id} className={classes.destinationGroup}>
              <div className={classes.destinationRow} data-active={count > 0}>
                <span>{renderText?.(routeLabel) ?? routeLabel}</span>
                <strong>
                  {count}/{route.max}
                </strong>
              </div>
              {route.ordered && routeIds.length > 0 ? (
                <div className={classes.orderedDestination}>
                  <span className={classes.orderLegend}>Chosen order</span>
                  <ol aria-label={`${routeLabel} chosen order`} className={classes.orderedList}>
                    {routeIds.map((entityId, orderIndex) => {
                      const candidate = candidateById.get(entityId);
                      const candidateLabel = resolveInteractionText(
                        candidate?.text ?? { key: entityId },
                      );
                      return (
                        <li key={entityId} className={classes.orderedItem}>
                          <span className={classes.orderPosition}>{orderIndex + 1}</span>
                          <span className={classes.orderedLabel}>
                            {renderText?.(candidateLabel) ?? candidateLabel}
                          </span>
                          <div className={classes.orderControls}>
                            <button
                              type="button"
                              className={classes.iconButton}
                              aria-label={`Move ${candidateLabel} earlier in ${routeLabel}`}
                              disabled={orderIndex <= 0}
                              onClick={() => move(entityId, route.id, -1)}
                            >
                              <IconChevronUp size={18} />
                            </button>
                            <button
                              type="button"
                              className={classes.iconButton}
                              aria-label={`Move ${candidateLabel} later in ${routeLabel}`}
                              disabled={orderIndex >= routeIds.length - 1}
                              onClick={() => move(entityId, route.id, 1)}
                            >
                              <IconChevronDown size={18} />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ) : null}
            </div>
          );
        })}
        {input.assignment === "remainder-automatic" ? (
          <div className={classes.destinationRow} data-automatic="true">
            <span>
              {renderText?.(resolveInteractionText(input.remainderText!)) ??
                resolveInteractionText(input.remainderText!)}
            </span>
            <strong>{automaticIds.length}</strong>
          </div>
        ) : null}
      </section>

      <footer className={classes.partitionFooter}>
        <span>
          {canConfirm ? "Ready to resolve" : "Complete the required selections before confirming"}
        </span>
        <button
          type="button"
          className={`${classes.button} ${classes.primary}`}
          disabled={!canConfirm}
          onClick={onConfirm}
        >
          Confirm
        </button>
      </footer>
    </div>
  );
}

function DirectOrderedWorkspace({
  input,
  routes,
  value,
  onChange,
  canConfirm,
  onConfirm,
  renderCandidate,
  onOrderedCandidatePreview,
  onOrderedCandidatePreviewEnd,
  renderText,
}: {
  readonly input: EntityPartitionInput;
  readonly routes: readonly DirectOrderedRoute[];
  readonly value: EntityPartitionValue;
  readonly onChange: (value: EntityPartitionValue) => void;
  readonly canConfirm: boolean;
  readonly onConfirm: () => void;
  readonly renderCandidate?: (input: InteractionInput, entityId: string) => ReactNode;
  readonly onOrderedCandidatePreview?: (input: EntityPartitionInput, entityId: string) => void;
  readonly onOrderedCandidatePreviewEnd?: () => void;
  readonly renderText?: (text: string) => ReactNode;
}) {
  const candidateIds = input.candidates.map(({ entity }) => entity.instanceId);
  const transformOrder = (route: DirectOrderedRoute, ids: readonly string[]) =>
    route.orderDirection === "bottom-first" ? [...ids].reverse() : [...ids];
  const playerLanes = Object.fromEntries(
    routes.map((route) => [route.id, transformOrder(route, value[route.id] ?? [])]),
  ) as Record<string, string[]>;
  const candidateById = new Map(
    input.candidates.map((candidate) => [candidate.entity.instanceId, candidate] as const),
  );
  const draggedIdRef = useRef<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const commit = (nextLanes: Readonly<Record<string, readonly string[]>>, movedId: string) => {
    const destination = routes.find((route) => nextLanes[route.id]?.includes(movedId));
    if (!destination) return;
    const position = nextLanes[destination.id]!.indexOf(movedId);
    const candidate = candidateById.get(movedId);
    const label = resolveInteractionText(candidate?.text ?? { key: movedId });
    onChange(
      Object.fromEntries(
        routes.map((route) => [route.id, transformOrder(route, nextLanes[route.id] ?? [])]),
      ),
    );
    setAnnouncement(
      `${label} moved to ${resolveInteractionText(destination.text)}, position ${position + 1}.`,
    );
  };
  const moveTo = (sourceId: string, routeId: string, targetId?: string) => {
    const next = Object.fromEntries(
      routes.map((route) => [
        route.id,
        (playerLanes[route.id] ?? []).filter((id) => id !== sourceId),
      ]),
    ) as Record<string, string[]>;
    const targetIndex = targetId ? next[routeId]!.indexOf(targetId) : -1;
    next[routeId]!.splice(targetIndex < 0 ? next[routeId]!.length : targetIndex, 0, sourceId);
    commit(next, sourceId);
  };
  const moveBy = (entityId: string, routeId: string, offset: -1 | 1) => {
    const lane = playerLanes[routeId] ?? [];
    const sourceIndex = lane.indexOf(entityId);
    const target = lane[sourceIndex + offset];
    if (!target) return;
    const next = [...lane];
    [next[sourceIndex], next[sourceIndex + offset]] = [next[sourceIndex + offset]!, entityId];
    commit({ ...playerLanes, [routeId]: next }, entityId);
  };

  return (
    <div className={classes.directOrderWorkspace} aria-label="Deck order">
      <div className={classes.directOrderLanes} data-route-count={routes.length}>
        {routes.map((route, routeIndex) => {
          const playerOrder = playerLanes[route.id] ?? [];
          const routeLabel = resolveInteractionText(route.text);
          return (
            <section key={route.id} className={classes.directOrderLane}>
              <header className={classes.directOrderLaneHeader}>
                <h3>{renderText?.(routeLabel) ?? routeLabel}</h3>
                <div className={classes.directOrderLaneGuide} aria-hidden="true">
                  <span>Drawn first</span>
                  <i />
                  <span>Deeper</span>
                </div>
                <span>
                  {playerOrder.length}/{candidateIds.length}
                </span>
              </header>
              <div className={classes.directOrderScroll} data-testid={`ordered-row-${route.id}`}>
                <ol
                  className={classes.directOrderTrack}
                  aria-label={`${routeLabel}. Cards are drawn from left to right.`}
                  data-direct-order-route={route.id}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const sourceId = draggedIdRef.current;
                    if (sourceId) moveTo(sourceId, route.id);
                    draggedIdRef.current = null;
                  }}
                  onPointerMove={(event) => {
                    const sourceId = draggedIdRef.current;
                    if (sourceId && event.buttons === 1 && playerOrder.length === 0)
                      moveTo(sourceId, route.id);
                  }}
                >
                  {playerOrder.map((entityId, index) => {
                    const candidate = candidateById.get(entityId);
                    const label = resolveInteractionText(candidate?.text ?? { key: entityId });
                    return (
                      <li
                        key={entityId}
                        className={classes.directOrderCard}
                        data-direct-order-id={entityId}
                        style={{ "--direct-order-position": index } as CSSProperties}
                        onFocus={() => onOrderedCandidatePreview?.(input, entityId)}
                        onBlur={(event) => {
                          if (
                            !(event.relatedTarget instanceof Node) ||
                            !event.currentTarget.contains(event.relatedTarget)
                          )
                            onOrderedCandidatePreviewEnd?.();
                        }}
                      >
                        <div
                          className={classes.directOrderArt}
                          aria-hidden="true"
                          onMouseEnter={() => onOrderedCandidatePreview?.(input, entityId)}
                          onMouseLeave={onOrderedCandidatePreviewEnd}
                        >
                          {renderCandidate?.(input, entityId) ?? renderText?.(label) ?? label}
                        </div>
                        <div className={classes.directOrderControls}>
                          <button
                            type="button"
                            className={classes.directOrderMove}
                            aria-label={
                              routes.length === 1
                                ? `Move ${label} left toward drawn first`
                                : `Move ${label} to ${resolveInteractionText(routes[0]!.text)}`
                            }
                            disabled={routes.length === 1 ? index === 0 : routeIndex === 0}
                            onClick={() =>
                              routes.length === 1
                                ? moveBy(entityId, route.id, -1)
                                : moveTo(entityId, routes[0]!.id)
                            }
                          >
                            {routes.length === 1 ? (
                              <IconChevronLeft size={16} aria-hidden="true" />
                            ) : (
                              <IconChevronUp size={16} aria-hidden="true" />
                            )}
                          </button>
                          <button
                            type="button"
                            draggable
                            className={classes.directOrderGrip}
                            aria-label={
                              routes.length === 1
                                ? `${label}, position ${index + 1} of ${playerOrder.length}. Drag to reorder, or use the left and right arrow keys.`
                                : `${label}, position ${index + 1} of ${playerOrder.length} in ${routeLabel}. Drag to reorder or move between rows, or use the arrow keys.`
                            }
                            onPointerDown={(event) => {
                              if (event.button === 0) {
                                draggedIdRef.current = entityId;
                                event.currentTarget.setPointerCapture?.(event.pointerId);
                              }
                            }}
                            onDragStart={(event) => {
                              draggedIdRef.current = entityId;
                              event.dataTransfer.effectAllowed = "move";
                              event.dataTransfer.setData("text/plain", entityId);
                            }}
                            onDragEnd={() => {
                              draggedIdRef.current = null;
                            }}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => {
                              event.preventDefault();
                              const sourceId = draggedIdRef.current;
                              if (sourceId && sourceId !== entityId)
                                moveTo(sourceId, route.id, entityId);
                              draggedIdRef.current = null;
                            }}
                            onPointerMove={(event) => {
                              const sourceId = draggedIdRef.current;
                              if (!sourceId || event.buttons !== 1) return;
                              const targetId = document
                                .elementFromPoint?.(event.clientX, event.clientY)
                                ?.closest<HTMLElement>("[data-direct-order-id]")
                                ?.dataset.directOrderId;
                              const targetRoute = document
                                .elementFromPoint?.(event.clientX, event.clientY)
                                ?.closest<HTMLElement>("[data-direct-order-route]")
                                ?.dataset.directOrderRoute;
                              if (targetRoute && targetId !== sourceId)
                                moveTo(sourceId, targetRoute, targetId);
                            }}
                            onPointerEnter={(event) => {
                              const sourceId = draggedIdRef.current;
                              if (event.buttons === 1 && sourceId && sourceId !== entityId)
                                moveTo(sourceId, route.id, entityId);
                            }}
                            onPointerUp={(event) => {
                              draggedIdRef.current = null;
                              if (event.currentTarget.hasPointerCapture?.(event.pointerId))
                                event.currentTarget.releasePointerCapture(event.pointerId);
                            }}
                            onPointerCancel={() => {
                              draggedIdRef.current = null;
                            }}
                            onKeyDown={(event) => {
                              if (
                                !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                                  event.key,
                                )
                              )
                                return;
                              event.preventDefault();
                              if (event.key === "ArrowLeft" || event.key === "ArrowRight")
                                moveBy(entityId, route.id, event.key === "ArrowLeft" ? -1 : 1);
                              else if (routes.length === 2)
                                moveTo(entityId, routes[event.key === "ArrowUp" ? 0 : 1]!.id);
                            }}
                          >
                            <IconGripVertical size={18} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className={classes.directOrderMove}
                            aria-label={
                              routes.length === 1
                                ? `Move ${label} right toward deeper in deck`
                                : `Move ${label} to ${resolveInteractionText(routes[1]!.text)}`
                            }
                            disabled={
                              routes.length === 1
                                ? index === playerOrder.length - 1
                                : routeIndex === 1
                            }
                            onClick={() =>
                              routes.length === 1
                                ? moveBy(entityId, route.id, 1)
                                : moveTo(entityId, routes[1]!.id)
                            }
                          >
                            {routes.length === 1 ? (
                              <IconChevronRight size={16} aria-hidden="true" />
                            ) : (
                              <IconChevronDown size={16} aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </section>
          );
        })}
      </div>
      <footer className={classes.directOrderFooter}>
        <button
          type="button"
          className={`${classes.button} ${classes.primary}`}
          disabled={!canConfirm}
          onClick={onConfirm}
        >
          Confirm order
        </button>
      </footer>
      <span className={classes.srOnly} role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}

function readPartitionValue(value: InteractionSubmissionValue | undefined): EntityPartitionValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string[]] =>
        Array.isArray(entry[1]) && entry[1].every((item) => typeof item === "string"),
    ),
  );
}

function readAllocationValue(value: InteractionSubmissionValue | undefined): EntityAllocationValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, number] => typeof entry[1] === "number",
    ),
  );
}

function selectedValues(
  input: InteractionInput,
  value: InteractionSubmissionValue | undefined,
): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value === "string") return [value];
  if (input.kind === "boolean" || input.kind === "number") return [];
  return [];
}

function toggleSelection(current: readonly string[], id: string, max: number): string[] {
  if (current.includes(id)) return current.filter((candidate) => candidate !== id);
  if (max <= 1) return [id];
  if (current.length >= max) return [...current];
  return [...current, id];
}

function selectionRequirementCopy(bounds: string, noun: string): string {
  return bounds
    .replace("Choose exactly", "Select")
    .replace("Choose up to", "Select up to")
    .replace("Choose ", "Select ")
    .replace(/target(s)?$/, (_match, plural: string | undefined) => `${noun}${plural ?? ""}`);
}
