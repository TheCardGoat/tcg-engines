import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

import type { SubmitOutcome } from "../../game/index.ts";

/**
 * Last-error state for failed `adapter.submit` / `pending.confirm` calls.
 *
 * Problem: `adapter.submit` returns `{ok:false, errorCode, error}` on
 * engine-validate rejection, but nothing in the tree renders those
 * strings — most invalid moves are already filtered at the pre-submit
 * layer (`enumerateCandidates` strips the card from `selectableCardIds`
 * and the click is a no-op). The residual cases that slip through —
 * phase-gated passes, stale-state re-submissions, the occasional
 * `PENDING_COMBAT` mid-combat pass — currently fail silently.
 *
 * Keeping the selection state in context (not inside a specific
 * container) mirrors `discard-mode-context`: the failing call can
 * happen from any container, and every container that submits should
 * be able to publish errors without plumbing extra props.
 *
 * `lastError.nonce` advances on every `report()` call so consumers can
 * `useEffect` on the nonce and restart the auto-dismiss timer even if
 * two identical error strings arrive back-to-back.
 */
export interface SubmitError {
  readonly message: string;
  readonly code: string;
  readonly nonce: number;
}

export interface SubmitErrorReporter {
  readonly lastError: SubmitError | null;
  readonly report: (outcome: SubmitOutcome | null | undefined) => SubmitOutcome | null | undefined;
  readonly clear: () => void;
}

const SubmitErrorContext = createContext<SubmitErrorReporter | null>(null);

export function SubmitErrorProvider({ children }: { readonly children: ReactNode }) {
  const [lastError, setLastError] = useState<SubmitError | null>(null);
  const nonceRef = useRef(0);

  const report = useCallback(
    (outcome: SubmitOutcome | null | undefined): SubmitOutcome | null | undefined => {
      // Pass null/undefined through unchanged — the pending-controller's
      // `confirm()` returns `null` when the state is already idle, and
      // callers shouldn't have to special-case that at every callsite.
      if (!outcome) return outcome;
      if (!outcome.ok) {
        nonceRef.current += 1;
        setLastError({
          message: outcome.error,
          code: outcome.errorCode,
          nonce: nonceRef.current,
        });
      }
      return outcome;
    },
    [],
  );

  const clear = useCallback(() => {
    setLastError(null);
  }, []);

  const value = useMemo<SubmitErrorReporter>(
    () => ({ lastError, report, clear }),
    [lastError, report, clear],
  );

  return <SubmitErrorContext.Provider value={value}>{children}</SubmitErrorContext.Provider>;
}

export function useSubmitError(): SubmitErrorReporter {
  const ctx = useContext(SubmitErrorContext);
  if (!ctx) throw new Error("useSubmitError called outside SubmitErrorProvider");
  return ctx;
}

/**
 * Auto-dismiss the last error `delayMs` after it arrives. Keyed on
 * `nonce` so two identical-message errors in a row each get the full
 * visibility window instead of the second one landing on an in-flight
 * timer for the first.
 */
export function useAutoDismissSubmitError(delayMs = 3000): void {
  const { lastError, clear } = useSubmitError();
  useEffect(() => {
    if (!lastError) return;
    const handle = window.setTimeout(clear, delayMs);
    return () => {
      window.clearTimeout(handle);
    };
  }, [lastError, clear, delayMs]);
}
