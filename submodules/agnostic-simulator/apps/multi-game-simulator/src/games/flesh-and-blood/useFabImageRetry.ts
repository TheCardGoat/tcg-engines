import { useEffect, useState } from "react";

/** Bounded retries reuse the published URL; never guess a different asset.
 * A new URL (including a locale change) starts a fresh retry budget. */
export function useFabImageRetry(source: string | undefined) {
  const [state, setState] = useState({ source, attempt: 0, failed: false });
  const current = state.source === source ? state : { source, attempt: 0, failed: false };
  useEffect(() => {
    setState((previous) =>
      previous.source === source ? previous : { source, attempt: 0, failed: false },
    );
  }, [source]);
  useEffect(() => {
    if (!source || !current.failed || current.attempt >= 2) return;
    const timer = window.setTimeout(
      () => {
        setState({ source, attempt: current.attempt + 1, failed: false });
      },
      500 * (current.attempt + 1),
    );
    return () => window.clearTimeout(timer);
  }, [source, current.failed, current.attempt]);
  return {
    key: `${source ?? "missing"}:${current.attempt}`,
    failed: current.failed,
    fail: () => setState({ ...current, failed: true }),
    retry: () => setState({ source, attempt: current.attempt + 1, failed: false }),
  };
}
