/** Game-agnostic transport. Context is sent once per worker lifetime. */
export interface DecisionRequest<Input, Context> {
  id: number;
  input: Input;
  context?: Context;
}
export type DecisionResponse<Output> =
  | { id: number; output: Output }
  | { id: number; error: string };
export interface DecisionWorker<Input, Output, Context> {
  onmessage: ((event: MessageEvent<DecisionResponse<Output>>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  onmessageerror: ((event: MessageEvent) => void) | null;
  postMessage: (request: DecisionRequest<Input, Context>) => void;
  terminate: () => void;
}

export function createDecisionClient<Input, Output, Context>(options: {
  createWorker: () => DecisionWorker<Input, Output, Context>;
  context: () => Context;
  fallback: (input: Input, context: Context) => Output;
}) {
  let worker: DecisionWorker<Input, Output, Context> | null = null;
  let sequence = 0;
  let pending: {
    id: number;
    resolve: (output: Output | null) => void;
    reject: (error: Error) => void;
    timer: ReturnType<typeof setTimeout>;
  } | null = null;
  function stop() {
    worker?.terminate();
    worker = null;
  }
  function fail(error: Error) {
    const request = pending;
    pending = null;
    stop();
    if (request) {
      clearTimeout(request.timer);
      request.reject(error);
    }
  }
  return {
    request(input: Input): Promise<Output | null> {
      if (pending) return Promise.resolve(null);
      if (typeof Worker === "undefined")
        return Promise.resolve().then(() => options.fallback(input, options.context()));
      return new Promise((resolve, reject) => {
        const id = ++sequence;
        pending = {
          id,
          resolve,
          reject,
          timer: setTimeout(() => fail(new Error("Bot decision timed out")), 15_000),
        };
        try {
          const fresh = !worker;
          if (!worker) {
            const port = options.createWorker();
            worker = port;
            port.onmessage = ({ data }) => {
              if (worker !== port || !pending || data.id !== pending.id) return;
              if ("error" in data) return fail(new Error(data.error));
              const request = pending;
              pending = null;
              clearTimeout(request.timer);
              request.resolve(data.output);
            };
            port.onerror = () => {
              if (worker === port) fail(new Error("Bot worker failed to load or execute"));
            };
            port.onmessageerror = () => {
              if (worker === port) fail(new Error("Bot worker returned an unreadable decision"));
            };
          }
          worker.postMessage({ id, input, ...(fresh ? { context: options.context() } : {}) });
        } catch (error) {
          fail(error instanceof Error ? error : new Error(String(error)));
        }
      });
    },
    cancel() {
      if (!pending) return;
      clearTimeout(pending.timer);
      pending.resolve(null);
      pending = null;
      stop();
    },
    dispose() {
      this.cancel();
      stop();
    },
  };
}

/** Called only by a game's module worker entrypoint. */
export function installDecisionWorker<Input, Output, Context>(
  initialize: (context: Context) => (input: Input) => Output,
) {
  let decide: ((input: Input) => Output) | undefined;
  self.onmessage = ({ data }: MessageEvent<DecisionRequest<Input, Context>>) => {
    let response: DecisionResponse<Output>;
    try {
      if (data.context !== undefined) decide = initialize(data.context);
      if (!decide) throw new Error("Missing bot worker context");
      response = { id: data.id, output: decide(data.input) };
    } catch (error) {
      response = { id: data.id, error: error instanceof Error ? error.message : String(error) };
    }
    self.postMessage(response);
  };
}
