import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  EngineInteractionView,
  InteractionPreviewRequest,
  InteractionPreviewResult,
  InteractionSubmissionValue,
} from "@tcg/protocol";

export type InteractionPreviewHandler = (
  request: InteractionPreviewRequest,
  signal: AbortSignal,
) => Promise<InteractionPreviewResult>;
type Values = Readonly<Record<string, InteractionSubmissionValue>>;

/** Preview forms are ephemeral and scoped to the exact actor/version/action/draft. */
export function useInteractionPreview(input: {
  view: EngineInteractionView;
  actionId?: string;
  requestId?: string;
  values: Values;
  onPreview?: InteractionPreviewHandler;
  onNormalize: (values: Values, activeInputIds: readonly string[]) => void;
}) {
  const { view, actionId, requestId, values } = input;
  const action = view.actions.find(
    (action) => action.id === actionId && action.requestId === requestId,
  );
  const required = action?.requiresPreview === true;
  const scope = JSON.stringify([
    view.gameSlug,
    view.actorId,
    view.stateVersion,
    actionId,
    requestId,
  ]);
  const valuesKey = JSON.stringify(values);
  const [attempt, retry] = useState(0);
  const retryPreview = useCallback(() => retry((value) => value + 1), []);
  const key = `${scope}:${valuesKey}:${attempt}`;
  const callbacks = useRef(input);
  callbacks.current = input;
  const [preview, setPreview] = useState<{
    scope: string;
    key: string;
    result?: Exclude<InteractionPreviewResult, { status: "unavailable" }>;
    error?: string;
  }>();
  const latest = required && preview?.scope === scope ? preview : undefined;
  const current = latest?.key === key ? latest : undefined;
  const available = Boolean(input.onPreview);
  useEffect(() => {
    if (!required || !actionId || !available || current) return;
    const controller = new AbortController();
    const request: InteractionPreviewRequest = {
      protocolVersion: view.protocolVersion,
      stateVersion: view.stateVersion,
      actionId,
      values: { ...values },
    };
    let active = true;
    void callbacks.current.onPreview!(request, controller.signal)
      .then((result) => {
        if (!active) return;
        if (result.status === "unavailable") {
          setPreview({ scope, key, error: result.message });
          return;
        }
        if (
          result.stateVersion !== view.stateVersion ||
          result.action.id !== actionId ||
          result.action.requestId !== requestId
        ) {
          setPreview({ scope, key, error: "The match changed; refresh the declaration." });
          return;
        }
        const normalizedKey = `${scope}:${JSON.stringify(result.values)}:${attempt}`;
        setPreview({
          scope,
          key: normalizedKey,
          result,
          ...(result.status === "invalid"
            ? { error: result.message ?? "Review the selected choices." }
            : {}),
        });
        callbacks.current.onNormalize(
          result.values,
          result.action.inputs.map((input) => input.id),
        );
      })
      .catch((error) => {
        if (active)
          setPreview({
            scope,
            key,
            error: error instanceof Error ? error.message : "Could not update choices.",
          });
      });
    return () => {
      active = false;
      controller.abort();
    };
    // The serialized draft identifies a request; callback identity changes do not restart it.
  }, [
    required,
    actionId,
    available,
    key,
    scope,
    view.actorId,
    view.stateVersion,
    view.protocolVersion,
    requestId,
    attempt,
  ]);

  const effectiveView = useMemo(
    () =>
      latest?.result
        ? {
            ...view,
            actions: view.actions.map((action) =>
              action.id === actionId
                ? { ...latest.result!.action, requiresPreview: true as const }
                : action,
            ),
          }
        : view,
    [view, latest?.result, actionId],
  );
  return {
    view: effectiveView,
    canSubmit: !required || current?.result?.status === "ready",
    pending: required && available && !current,
    error:
      required && !available ? "Action choices are unavailable in this session." : current?.error,
    retry: retryPreview,
  };
}
