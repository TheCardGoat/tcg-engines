import { useCallback, useEffect, useRef } from "react";
import { createDecisionClient, type DecisionWorker } from "./decision-worker";

/** A snapshot decision overlaps pacing; only the current board may commit it. */
export function useBackgroundBot<Input, Output, Context>(options: {
  identity: object | null;
  getIdentity: () => object | null;
  workerKey: object;
  scope: string;
  enabled: boolean;
  auto: boolean;
  delayMs: number;
  createWorker: () => DecisionWorker<Input, Output, Context>;
  context: () => Context;
  input: () => Input;
  decide: (input: Input, context: Context) => Output;
  commit: (output: Output) => void;
  onError: (message: string) => void;
}) {
  const latest = useRef(options);
  latest.current = options;
  const client = useRef<ReturnType<typeof createDecisionClient<Input, Output, Context>> | null>(
    null,
  );
  const pending = useRef<{ cancelDelay: () => void } | null>(null);
  const cancel = useCallback(() => {
    pending.current?.cancelDelay();
    pending.current = null;
    client.current?.cancel();
  }, []);
  const run = useCallback(
    (delayMs: number) => {
      const captured = latest.current;
      if (!captured.enabled || pending.current || !captured.identity) return;
      const isCurrent = () =>
        latest.current.enabled &&
        latest.current.identity === captured.identity &&
        latest.current.getIdentity() === captured.identity &&
        latest.current.workerKey === captured.workerKey &&
        latest.current.scope === captured.scope &&
        latest.current.auto === captured.auto;
      let cancelDelay = () => {};
      const delay = new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, delayMs);
        cancelDelay = () => {
          clearTimeout(timer);
          resolve();
        };
      });
      const work = { cancelDelay };
      pending.current = work;
      try {
        client.current ??= createDecisionClient({
          createWorker: captured.createWorker,
          context: () => latest.current.context(),
          fallback: (input, context) => latest.current.decide(input, context),
        });
        void Promise.all([client.current.request(captured.input()), delay])
          .then(([output]) => {
            if (pending.current !== work || !isCurrent() || output === null) return;
            pending.current = null;
            try {
              latest.current.commit(output);
            } catch (error) {
              captured.onError(error instanceof Error ? error.message : String(error));
            }
          })
          .catch((error: unknown) => {
            if (pending.current === work && isCurrent())
              latest.current.onError(error instanceof Error ? error.message : String(error));
          })
          .finally(() => {
            work.cancelDelay();
            if (pending.current === work) pending.current = null;
          });
      } catch (error) {
        cancel();
        captured.onError(error instanceof Error ? error.message : String(error));
      }
    },
    [cancel],
  );
  useEffect(
    () => () => {
      cancel();
      client.current?.dispose();
      client.current = null;
    },
    [options.workerKey, options.createWorker, cancel],
  );
  useEffect(() => {
    if (options.auto && options.enabled) run(options.delayMs);
    return cancel;
  }, [
    options.identity,
    options.workerKey,
    options.scope,
    options.auto,
    options.enabled,
    options.delayMs,
    run,
    cancel,
  ]);
  return useCallback(() => run(0), [run]);
}
