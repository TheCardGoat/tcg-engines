import {
  buildInteractionSubmission,
  type EngineInteractionView,
  type InteractionInput,
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
  currentActionableInput,
  implicitSubmissionValues,
  interactionInputComplete,
  optionalDecisionInteraction,
} from "./interaction-presentation";

export interface InteractionDraftState {
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
};

const InteractionDraftContext = createContext<InteractionDraftControls>(DEFAULT);

export function InteractionDraftProvider({
  view,
  onSubmit,
  children,
}: {
  readonly view: EngineInteractionView;
  readonly onSubmit: (submission: InteractionSubmission) => boolean;
  readonly children: ReactNode;
}) {
  const [draft, setDraft] = useState<InteractionDraftState>({
    values: EMPTY_VALUES,
    confirmedInputIds: new Set(),
  });
  const submittedKeyRef = useRef<string | null>(null);

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

      // Actions whose inputs are already fully determined (for example, deploying a
      // card that has no mode, target, or cost decision) do not need a draft UI.
      // Submitting them here avoids briefly rendering a redundant "Complete action"
      // prompt before the effect below submits the draft on the next render.
      if (validateInteractionSubmission(view, submission).ok) {
        const key = `${submission.requestId}:${JSON.stringify(submission.values)}`;
        if (submittedKeyRef.current === key) return;
        submittedKeyRef.current = key;
        if (onSubmit(submission)) return;
      }

      submittedKeyRef.current = null;
      setDraft({
        actionId,
        requestId: nextAction.requestId,
        values: nextValues,
        confirmedInputIds: new Set(),
      });
    },
    [onSubmit, view],
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
    submittedKeyRef.current = null;
    setDraft({ values: EMPTY_VALUES, confirmedInputIds: new Set() });
  }, [action, draft.actionId, view.actions, view.status]);

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
      values: action ? implicitSubmissionValues(action) : {},
      confirmedInputIds: new Set(),
    }));
  }, [action]);

  const confirmCurrent = useCallback(() => {
    if (!action) return;
    const input = currentActionableInput(action, draft.values, draft.confirmedInputIds);
    if (!input) return;
    setDraft((current) => {
      // A partition whose routes are all optional can be valid without a
      // player assignment (for example, a deck look with no eligible tutor).
      // Persist its empty answer before marking it confirmed so the next
      // actionable-input pass can advance and submit it.
      if (input.kind === "entity-partition" && current.values[input.id] === undefined) {
        const emptyPartition = Object.fromEntries(input.routes.map((route) => [route.id, []]));
        const values = { ...current.values, [input.id]: emptyPartition };
        if (
          !validateInteractionSubmission(view, buildInteractionSubmission({ view, action, values }))
            .ok
        ) {
          return current;
        }
        return {
          ...current,
          values,
          confirmedInputIds: new Set([...current.confirmedInputIds, input.id]),
        };
      }
      return {
        ...current,
        confirmedInputIds: new Set([...current.confirmedInputIds, input.id]),
      };
    });
  }, [action, draft.confirmedInputIds, draft.values, view]);

  const submit = useCallback(() => {
    if (!action) return;
    const submission = buildInteractionSubmission({ view, action, values: { ...draft.values } });
    if (!validateInteractionSubmission(view, submission).ok) return;
    const key = `${submission.requestId}:${JSON.stringify(submission.values)}`;
    if (submittedKeyRef.current === key) return;
    submittedKeyRef.current = key;
    if (onSubmit(submission)) return;
    submittedKeyRef.current = null;
    setDraft((current) => {
      const retryInput = [...action.inputs]
        .reverse()
        .find((input) => current.confirmedInputIds.has(input.id));
      if (!retryInput) return current;
      return {
        ...current,
        confirmedInputIds: new Set(
          [...current.confirmedInputIds].filter((inputId) => inputId !== retryInput.id),
        ),
      };
    });
  }, [action, draft.values, onSubmit, view]);

  useEffect(() => {
    if (!action || currentActionableInput(action, draft.values, draft.confirmedInputIds)) return;
    submit();
  }, [action, draft.confirmedInputIds, draft.values, submit]);

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
    }),
    [action, begin, cancel, change, clear, confirmCurrent, draft, submit, toggleEntity, unset],
  );

  return (
    <InteractionDraftContext.Provider value={value}>{children}</InteractionDraftContext.Provider>
  );
}

export function useInteractionDraft(): InteractionDraftControls {
  return useContext(InteractionDraftContext);
}
