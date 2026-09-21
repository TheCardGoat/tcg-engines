import { useCallback, useMemo, useState } from "react";

import type { InteractionInput } from "@tcg/protocol";

import { useGundamGame, useInteractionView } from "../../game/index.ts";

const AUTO_DECLINE_STORAGE_KEY = "gundam.autoDeclineOptionalEffects";

function interactionTextToString(
  text: { readonly key: string; readonly params?: Readonly<Record<string, unknown>> } | undefined,
): string {
  if (!text) return "";
  const params = text.params ?? {};
  if (typeof params.prompt === "string") return params.prompt;
  for (const value of Object.values(params)) {
    if (typeof value === "string") return value;
  }
  return text.key;
}

function isOptional(input: InteractionInput): boolean {
  return input.required === false;
}

/**
 * Live-match prompt for engine `resolveEffect` decisions.
 *
 * When the published interaction view enters the "choosing" status the seated
 * player must answer an effect choice (Burst, optional trigger, end-phase
 * decision, …). Without this panel the view offers the action but nothing
 * renders it, so the match stalls until the seat's timer expires.
 *
 * Includes an opt-in auto-decline ("auto-pass optional effects") setting that
 * answers purely optional boolean decisions with `false` so shield-burst
 * style prompts never stall a seat that prefers not to be asked.
 */
export function GundamPendingChoicePrompt() {
  const view = useInteractionView();
  const { adapter } = useGundamGame();
  const [error, setError] = useState<string | null>(null);
  const [autoDecline, setAutoDecline] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(AUTO_DECLINE_STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  const choosing = view.status === "choosing";
  const action = useMemo(
    () => (choosing ? (view.actions.find((candidate) => candidate.enabled) ?? null) : null),
    [choosing, view],
  );

  const summary = useMemo(() => {
    if (!action) return null;
    const optionInputs = action.inputs.filter(
      (input): input is Extract<InteractionInput, { kind: "option-selection" }> =>
        input.kind === "option-selection",
    );
    const booleanInputs = action.inputs.filter(
      (input): input is Extract<InteractionInput, { kind: "boolean" }> => input.kind === "boolean",
    );
    return { optionInputs, booleanInputs };
  }, [action]);

  const submitDecline = useCallback(() => {
    if (!action || !summary) return;
    const values: Record<string, unknown> = {};
    for (const input of summary.optionInputs) {
      if (input.min > 0) {
        const enabled = input.options.filter((option) => option.enabled !== false);
        if (enabled.length === 0) return;
        values[input.id] = [enabled[0]!.id];
      }
    }
    for (const input of summary.booleanInputs) {
      if (input.required === false) values[input.id] = false;
    }
    try {
      adapter.submit("resolveEffect", values);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : String(submitError));
    }
  }, [action, adapter, summary]);

  // Auto-decline purely optional boolean decisions when the setting is on.
  const autoDeclineSignature = action ? `${action.requestId}` : "";
  const autoDeclineAppliedRef = useMemo(() => new Set<string>(), []);
  if (autoDecline && action && summary && !autoDeclineAppliedRef.has(action.requestId)) {
    const purelyOptional =
      summary.booleanInputs.length > 0 &&
      summary.booleanInputs.every((input) => isOptional(input)) &&
      summary.optionInputs.every(
        (input) =>
          input.required !== true && input.options.filter((o) => o.enabled !== false).length <= 1,
      );
    if (purelyOptional) {
      autoDeclineAppliedRef.add(action.requestId);
      submitDecline();
    }
  }

  if (!choosing || !action || !summary) return null;

  const toggleAutoDecline = () => {
    const next = !autoDecline;
    setAutoDecline(next);
    try {
      window.localStorage.setItem(AUTO_DECLINE_STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* private mode — the toggle still works for this session */
    }
  };

  const questionTexts = summary.booleanInputs
    .map((input) => interactionTextToString(input.text))
    .filter(Boolean);
  const stepPrompt = interactionTextToString(view.resolution?.currentStep?.text);
  const singleOptionYesNo =
    summary.optionInputs.length === 1 &&
    summary.booleanInputs.length === 1 &&
    summary.optionInputs[0]!.options.filter((o) => o.enabled !== false).length === 1;

  const submitChoice = (activate: boolean) => {
    setError(null);
    try {
      const values: Record<string, unknown> = {};
      for (const optionInput of summary.optionInputs) {
        const enabled = optionInput.options.filter((o) => o.enabled !== false);
        values[optionInput.id] = enabled.map((o) => o.id);
      }
      for (const boolInput of summary.booleanInputs) {
        values[boolInput.id] = activate;
      }
      adapter.submit("resolveEffect", values);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : String(submitError));
    }
  };
  const question = questionTexts[0] ?? stepPrompt;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-16 z-40 flex justify-center px-4">
      <div className="pointer-events-auto w-full max-w-md rounded-lg border border-hud-border bg-hud-surface/95 p-4 shadow-lg">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-hud-xs font-semibold uppercase tracking-hud-label text-hud-text-faint">
            Effect decision
          </span>
          <label className="flex items-center gap-1.5 text-hud-xs text-hud-text-muted">
            <input
              type="checkbox"
              checked={autoDecline}
              onChange={toggleAutoDecline}
              className="h-3.5 w-3.5"
            />
            Auto-pass optional effects
          </label>
        </div>
        {error ? (
          <p className="mb-2 text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        {question && singleOptionYesNo ? (
          <p className="mb-2 text-sm leading-snug text-hud-text">{question}</p>
        ) : null}
        <div className="flex flex-col gap-2">
          {singleOptionYesNo ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => submitChoice(true)}
                className="rounded border border-hud-border px-3 py-2 text-sm text-hud-text transition-colors hover:bg-hud-surface-strong/60"
              >
                Activate
              </button>
              {summary.booleanInputs.every((input) => input.required === false) ? (
                <button
                  type="button"
                  onClick={() => submitChoice(false)}
                  className="rounded border border-hud-border px-3 py-2 text-sm text-hud-text-muted transition-colors hover:bg-hud-surface-strong/60"
                >
                  Decline
                </button>
              ) : null}
            </div>
          ) : null}
          {summary.optionInputs.map((input) => (
            <div key={input.id} className="flex flex-wrap gap-2">
              {input.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setError(null);
                    try {
                      const values: Record<string, unknown> = { [input.id]: [option.id] };
                      for (const boolInput of summary.booleanInputs) {
                        values[boolInput.id] = boolInput.required === false ? false : true;
                      }
                      adapter.submit("resolveEffect", values);
                    } catch (submitError) {
                      setError(
                        submitError instanceof Error ? submitError.message : String(submitError),
                      );
                    }
                  }}
                  className="rounded border border-hud-border px-3 py-2 text-left text-sm text-hud-text transition-colors hover:bg-hud-surface-strong/60"
                >
                  {interactionTextToString(option.text) || option.id}
                </button>
              ))}
            </div>
          ))}
          {summary.booleanInputs.map((input) => (
            <div key={input.id} className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  try {
                    const values: Record<string, unknown> = {};
                    for (const optionInput of summary.optionInputs) {
                      const enabled = optionInput.options.filter((o) => o.enabled !== false);
                      values[optionInput.id] = enabled.map((o) => o.id);
                    }
                    values[input.id] = true;
                    adapter.submit("resolveEffect", values);
                  } catch (submitError) {
                    setError(
                      submitError instanceof Error ? submitError.message : String(submitError),
                    );
                  }
                }}
                className="rounded border border-hud-border px-3 py-2 text-sm text-hud-text transition-colors hover:bg-hud-surface-strong/60"
              >
                Activate
              </button>
              {input.required === false ? (
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    try {
                      const values: Record<string, unknown> = {};
                      for (const optionInput of summary.optionInputs) {
                        const enabled = optionInput.options.filter((o) => o.enabled !== false);
                        values[optionInput.id] = enabled.map((o) => o.id);
                      }
                      values[input.id] = false;
                      adapter.submit("resolveEffect", values);
                    } catch (submitError) {
                      setError(
                        submitError instanceof Error ? submitError.message : String(submitError),
                      );
                    }
                  }}
                  className="rounded border border-hud-border px-3 py-2 text-sm text-hud-text-muted transition-colors hover:bg-hud-surface-strong/60"
                >
                  Decline
                </button>
              ) : null}
            </div>
          ))}
          {questionTexts.length > 0 ? (
            <p className="text-hud-xs text-hud-text-faint">{questionTexts.join(" · ")}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
