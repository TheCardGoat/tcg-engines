import {
  buildInteractionSubmission,
  inputAllowsOmission,
  type EngineInteractionView,
  type InteractionInput,
  type InteractionAction,
  type InteractionSubmission,
  type InteractionSubmissionValue,
  validateInteractionSubmission,
} from "@tcg/protocol";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  activeActionableInputs,
  currentActionableInput,
  implicitSubmissionValues,
  interactionInputComplete,
  optionalDecisionInteraction,
} from "./interaction-presentation";

export interface InteractionDraftState {
  readonly submissionRejected?: boolean;
  readonly actionId?: string;
  readonly requestId?: string;
  readonly values: Readonly<Record<string, InteractionSubmissionValue>>;
  readonly confirmedInputIds: ReadonlySet<string>;
}

export interface InteractionDraftControls extends InteractionDraftState {
  readonly active: boolean;
  readonly begin: (
    actionId: string,
    values?: Readonly<Record<string, InteractionSubmissionValue>>,
  ) => void;
  readonly change: (inputId: string, value: InteractionSubmissionValue) => void;
  readonly unset: (inputId: string) => void;
  readonly toggleEntity: (inputId: string, entityId: string) => void;
  readonly clear: () => void;
  readonly cancel: () => void;
  readonly submit: () => void;
  readonly confirmCurrent: () => void;
  readonly skipCurrent: () => void;
}

const EMPTY_VALUES: Readonly<Record<string, InteractionSubmissionValue>> = {};
const DEFAULT: InteractionDraftControls = {
  active: false,
  values: EMPTY_VALUES,
  confirmedInputIds: new Set(),
  begin: () => undefined,
  change: () => undefined,
  unset: () => undefined,
  toggleEntity: () => undefined,
  clear: () => undefined,
  cancel: () => undefined,
  submit: () => undefined,
  confirmCurrent: () => undefined,
  skipCurrent: () => undefined,
};

const InteractionDraftContext = createContext<InteractionDraftControls>(DEFAULT);

export function InteractionDraftProvider({
  view,
  onSubmit,
  deferInitialSubmission,
  children,
}: {
  readonly view: EngineInteractionView;
  readonly onSubmit: (submission: InteractionSubmission) => boolean;
  /** Keep optional choices open instead of submitting their default when an action begins. */
  readonly deferInitialSubmission?: (action: InteractionAction) => boolean;
  readonly children: ReactNode;
}) {
  const [draft, setDraft] = useState<InteractionDraftState>({
    values: EMPTY_VALUES,
    confirmedInputIds: new Set(),
  });
  const submittedKeyRef = useRef<string | null>(null);
  // Last action id for which begin() actually opened a draft. Effects close
  // over the render that scheduled them, so the stale-draft invalidation below
  // uses this to recognize a draft that a child effect (for example a game
  // layer's decision auto-begin) opened after that render.
  const begunActionIdRef = useRef<string | undefined>(undefined);
  const begunRequestIdRef = useRef<string | undefined>(undefined);

  const action = draft.actionId
    ? view.actions.find(
        (candidate) => candidate.id === draft.actionId && candidate.requestId === draft.requestId,
      )
    : undefined;

  const begin = useCallback(
    (actionId: string, values: Readonly<Record<string, InteractionSubmissionValue>> = {}) => {
      const nextAction = view.actions.find(
        (candidate) => candidate.id === actionId && candidate.enabled,
      );
      if (!nextAction) return;
      const nextValues = { ...implicitSubmissionValues(nextAction), ...values };
      const submission = buildInteractionSubmission({
        view,
        action: nextAction,
        values: nextValues,
      });

      let submissionRejected = false;
      // Actions whose inputs are already fully determined (for example, deploying a
      // card that has no mode, target, or cost decision) do not need a draft UI.
      // Submitting them here avoids briefly rendering a redundant "Complete action"
      // prompt before the effect below submits the draft on the next render.
      const choicesComplete = activeActionableInputs(nextAction, nextValues).every((input) =>
        interactionInputComplete(input, nextValues[input.id]),
      );
      // A legal omission is still a player decision, and games can defer even
      // complete initial choices to keep their direct-selection flow open.
      if (
        choicesComplete &&
        !deferInitialSubmission?.(nextAction) &&
        validateInteractionSubmission(view, submission).ok
      ) {
        const key = `${submission.requestId}:${JSON.stringify(submission.values)}`;
        if (submittedKeyRef.current === key) return;
        submittedKeyRef.current = key;
        if (onSubmit(submission)) return;
        submissionRejected = true;
      }

      submittedKeyRef.current = null;
      begunActionIdRef.current = actionId;
      begunRequestIdRef.current = nextAction.requestId;
      setDraft({
        actionId,
        submissionRejected,
        requestId: nextAction.requestId,
        values: nextValues,
        confirmedInputIds: new Set(),
      });
    },
    [onSubmit, view, deferInitialSubmission],
  );

  useEffect(() => {
    if (view.status !== "choosing") return;
    const resolving = view.actions.find(
      (candidate) => candidate.id === "resolveEffect" && candidate.enabled,
    );
    if (!resolving || draft.requestId === resolving.requestId) return;
    begin(resolving.id);
  }, [begin, draft.requestId, view.actions, view.status]);

  useEffect(() => {
    if (!draft.actionId || action) return;
    if (
      view.status === "choosing" &&
      view.actions.some((candidate) => candidate.id === "resolveEffect" && candidate.enabled)
    ) {
      return;
    }
    // Race guard: on a view flip into a decision, a child effect (a game
    // layer's decision auto-begin) can call begin() for an action that IS in
    // this view before this parent effect runs, while this effect still closes
    // over the previous draft (child-before-parent effect ordering). Clearing
    // now would wipe the freshly begun draft in the same commit and strand the
    // prompt. Skip when a newer draft was begun for a different action or request that is
    // still present in the view — only clear drafts whose own action no longer
    // exists in the view. Genuinely stale drafts (their action id gone from the
    // view) are still cleared on this pass or the next one.
    const begunActionId = begunActionIdRef.current;
    if (
      begunActionId !== undefined &&
      (begunActionId !== draft.actionId || begunRequestIdRef.current !== draft.requestId) &&
      view.actions.some(
        (candidate) =>
          candidate.id === begunActionId && candidate.requestId === begunRequestIdRef.current,
      )
    ) {
      return;
    }
    submittedKeyRef.current = null;
    setDraft({ values: EMPTY_VALUES, confirmedInputIds: new Set() });
  }, [action, draft.actionId, draft.requestId, view.actions, view.status]);

  const change = useCallback(
    (inputId: string, value: InteractionSubmissionValue) => {
      submittedKeyRef.current = null;
      const optionalDecision = action ? optionalDecisionInteraction(action.inputs) : undefined;
      const acceptsOptionalDecision =
        optionalDecision?.dependent.id === inputId &&
        interactionInputComplete(optionalDecision.dependent, value);
      const changedIndex = action?.inputs.findIndex((input) => input.id === inputId) ?? -1;
      setDraft((current) => {
        const retainedValues =
          action && changedIndex >= 0
            ? Object.fromEntries(
                Object.entries(current.values).filter(([id]) => {
                  const index = action.inputs.findIndex((input) => input.id === id);
                  return index < 0 || index <= changedIndex;
                }),
              )
            : current.values;
        return {
          ...current,
          submissionRejected: false,
          values: {
            ...retainedValues,
            ...(acceptsOptionalDecision ? { [optionalDecision.decision.id]: true } : {}),
            [inputId]: value,
          },
          confirmedInputIds: new Set(
            [...current.confirmedInputIds].filter((confirmedId) => {
              const index = action?.inputs.findIndex((input) => input.id === confirmedId) ?? -1;
              return index >= 0 && index < changedIndex;
            }),
          ),
        };
      });
    },
    [action],
  );

  const unset = useCallback((inputId: string) => {
    submittedKeyRef.current = null;
    setDraft((current) => {
      const nextValues = { ...current.values };
      delete nextValues[inputId];
      return {
        ...current,
        values: nextValues,
        submissionRejected: false,
        confirmedInputIds: new Set(
          [...current.confirmedInputIds].filter((confirmedId) => confirmedId !== inputId),
        ),
      };
    });
  }, []);

  const toggleEntity = useCallback(
    (inputId: string, entityId: string) => {
      if (!action) return;
      const input = action.inputs.find(
        (
          candidate,
        ): candidate is Extract<
          InteractionInput,
          { kind: "entity-selection" | "entity-partition" | "entity-allocation" }
        > =>
          candidate.id === inputId &&
          (candidate.kind === "entity-selection" ||
            candidate.kind === "entity-partition" ||
            candidate.kind === "entity-allocation"),
      );
      if (!input) return;
      const candidate = input.candidates.find(
        (item) => item.enabled !== false && item.entity.instanceId === entityId,
      );
      if (!candidate) return;

      if (input.kind === "entity-partition") {
        const eligibleRoutes = input.routes.filter(
          (route) => route.candidateIds === undefined || route.candidateIds.includes(entityId),
        );
        // A direct board click is only meaningful when it maps to one destination.
        // Multi-destination partitions retain their focused selection workspace.
        if (eligibleRoutes.length !== 1) return;
        const route = eligibleRoutes[0]!;
        const current = draft.values[inputId];
        const partition =
          current && typeof current === "object" && !Array.isArray(current)
            ? Object.fromEntries(
                Object.entries(current).filter(
                  (entry): entry is [string, string[]] =>
                    Array.isArray(entry[1]) && entry[1].every((value) => typeof value === "string"),
                ),
              )
            : {};
        const selected = partition[route.id] ?? [];
        const next = Object.fromEntries(
          input.routes.map((candidateRoute) => [
            candidateRoute.id,
            (partition[candidateRoute.id] ?? []).filter((id) => id !== entityId),
          ]),
        );
        if (!selected.includes(entityId) && next[route.id]!.length < route.max) {
          next[route.id] = [...next[route.id]!, entityId];
        }
        change(inputId, next);
        return;
      }

      if (input.kind === "entity-allocation") {
        const allocationCandidate = input.candidates.find(
          (item) => item.enabled !== false && item.entity.instanceId === entityId,
        );
        if (!allocationCandidate) return;
        const currentValue = draft.values[inputId];
        const allocation =
          currentValue && typeof currentValue === "object" && !Array.isArray(currentValue)
            ? Object.fromEntries(
                Object.entries(currentValue).filter(
                  (entry): entry is [string, number] => typeof entry[1] === "number",
                ),
              )
            : {};
        const currentAmount = allocation[entityId] ?? 0;
        const total = Object.values(allocation).reduce((sum, amount) => sum + amount, 0);
        if (currentAmount >= allocationCandidate.max || total >= input.totalMax) return;
        change(inputId, { ...allocation, [entityId]: currentAmount + 1 });
        return;
      }

      const current = Array.isArray(draft.values[inputId])
        ? (draft.values[inputId] as string[])
        : [];
      const next = current.includes(entityId)
        ? current.filter((id) => id !== entityId)
        : input.max === 1
          ? [entityId]
          : current.length < input.max
            ? [...current, entityId]
            : current;
      change(inputId, next);
    },
    [action, change, draft.values],
  );

  const cancel = useCallback(() => {
    submittedKeyRef.current = null;
    setDraft({ values: EMPTY_VALUES, confirmedInputIds: new Set() });
  }, []);

  const clear = useCallback(() => {
    submittedKeyRef.current = null;
    setDraft((current) => ({
      ...current,
      submissionRejected: false,
      values: action ? implicitSubmissionValues(action) : {},
      confirmedInputIds: new Set(),
    }));
  }, [action]);

  const confirmCurrent = useCallback(() => {
    if (!action) return;
    const input = currentActionableInput(action, draft.values, draft.confirmedInputIds);
    if (!input) return;
    setDraft((current) => {
      // A partition whose routes are all optional, or an optional selection
      // (min 0), can be valid without a player assignment (for example, a
      // deck look with no eligible tutor, or a "choose up to one" target).
      // Persist the empty answer before marking it confirmed so the next
      // actionable-input pass can advance and submit it.
      const emptyAnswer =
        current.values[input.id] === undefined
          ? input.kind === "entity-partition"
            ? Object.fromEntries(input.routes.map((route) => [route.id, []]))
            : input.kind === "entity-selection" && interactionInputComplete(input, [])
              ? []
              : undefined
          : undefined;
      if (emptyAnswer !== undefined) {
        const values = { ...current.values, [input.id]: emptyAnswer };
        if (!interactionInputComplete(input, emptyAnswer)) {
          return current;
        }
        return {
          ...current,
          values,
          submissionRejected: false,
          confirmedInputIds: new Set([...current.confirmedInputIds, input.id]),
        };
      }
      return {
        ...current,
        submissionRejected: false,
        confirmedInputIds: new Set([...current.confirmedInputIds, input.id]),
      };
    });
  }, [action, draft.confirmedInputIds, draft.values, view]);

  const skipCurrent = useCallback(() => {
    if (!action) return;
    const input = currentActionableInput(action, draft.values, draft.confirmedInputIds);
    if (!input || !inputAllowsOmission(input, draft.values)) return;
    submittedKeyRef.current = null;
    const index = action.inputs.findIndex((candidate) => candidate.id === input.id);
    const precedingIds = new Set(action.inputs.slice(0, index).map((candidate) => candidate.id));
    setDraft((current) => ({
      ...current,
      submissionRejected: false,
      values: {
        ...implicitSubmissionValues(action),
        ...Object.fromEntries(
          Object.entries(current.values).filter(([id]) => precedingIds.has(id)),
        ),
      },
      confirmedInputIds: new Set([
        ...[...current.confirmedInputIds].filter((id) => precedingIds.has(id)),
        input.id,
      ]),
    }));
  }, [action, draft.values, draft.confirmedInputIds]);

  const submit = useCallback(() => {
    if (!action) return;
    const submission = buildInteractionSubmission({ view, action, values: { ...draft.values } });
    if (!validateInteractionSubmission(view, submission).ok) return;
    const key = `${submission.requestId}:${JSON.stringify(submission.values)}`;
    if (submittedKeyRef.current === key) return;
    submittedKeyRef.current = key;
    if (onSubmit(submission)) {
      setDraft((current) =>
        current.submissionRejected ? { ...current, submissionRejected: false } : current,
      );
      return;
    }
    submittedKeyRef.current = null;
    setDraft((current) => {
      const retryInput = [...action.inputs]
        .reverse()
        .find((input) => current.confirmedInputIds.has(input.id));
      return {
        ...current,
        submissionRejected: true,
        confirmedInputIds: retryInput
          ? new Set([...current.confirmedInputIds].filter((inputId) => inputId !== retryInput.id))
          : current.confirmedInputIds,
      };
    });
  }, [action, draft.values, onSubmit, view]);

  useEffect(() => {
    if (
      !action ||
      draft.submissionRejected ||
      currentActionableInput(action, draft.values, draft.confirmedInputIds)
    )
      return;
    submit();
  }, [action, draft.confirmedInputIds, draft.values, draft.submissionRejected, submit]);

  const value = useMemo<InteractionDraftControls>(
    () => ({
      ...draft,
      active: Boolean(action),
      begin,
      change,
      unset,
      toggleEntity,
      clear,
      cancel,
      submit,
      confirmCurrent,
      skipCurrent,
    }),
    [
      action,
      begin,
      cancel,
      change,
      clear,
      confirmCurrent,
      skipCurrent,
      draft,
      submit,
      toggleEntity,
      unset,
    ],
  );

  return (
    <InteractionDraftContext.Provider value={value}>{children}</InteractionDraftContext.Provider>
  );
}

export function useInteractionDraft(): InteractionDraftControls {
  return useContext(InteractionDraftContext);
}
