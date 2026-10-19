import { afterEach, expect, test, vi } from "vite-plus/test";
import { createAiDecisionClient, type AiWorkerPort } from "./ai-worker-client";
import type { AiWorkerResponse } from "./ai-worker-protocol";
import { getScenario, P1 } from "./fixtures/scenarios";

afterEach(() => vi.useRealTimers());

function worker() {
  const port: AiWorkerPort = {
    onmessage: null,
    onerror: null,
    onmessageerror: null,
    postMessage: vi.fn(),
    terminate: vi.fn(),
  };
  const reply = (response: AiWorkerResponse) =>
    port.onmessage?.(new MessageEvent("message", { data: response }));
  return { port, reply };
}

const selection = { kind: "idle", reason: "waiting" } as const;

test("serializes work, ignores old replies and transfers unchanged definitions only once", async () => {
  const state = getScenario("openingMain").build().getState();
  const { port, reply } = worker();
  const client = createAiDecisionClient(P1, { id: "first-legal" }, "seed", () => port);
  const first = client.decide(state, "automatic");
  expect(port.postMessage).toHaveBeenCalledOnce();
  const request = vi.mocked(port.postMessage).mock.calls[0]![0];
  expect(request.definitions.length).toBeGreaterThan(0);
  expect(structuredClone(request)).toEqual(request);
  expect(await client.decide(state, "automatic")).toBeNull();
  reply({ id: request.id + 1, selection });
  reply({ id: request.id, selection });
  expect(await first).toEqual(selection);
  const second = client.decide(state, "automatic");
  const next = vi.mocked(port.postMessage).mock.calls[1]![0];
  expect(next.definitions).toEqual([]);
  reply({ id: next.id, selection });
  await second;
  client.dispose();
});

test("disposal terminates in-flight work and settles it without committing a late reply", async () => {
  const { port, reply } = worker();
  const client = createAiDecisionClient(P1, { id: "first-legal" }, "seed", () => port);
  const result = client.decide(getScenario("openingMain").build().getState(), "automatic");
  client.dispose();
  reply({ id: 1, selection });
  expect(await result).toBeNull();
  expect(port.terminate).toHaveBeenCalledOnce();
});

test("worker errors and timeouts reject and allow a clean retry", async () => {
  vi.useFakeTimers();
  const state = getScenario("openingMain").build().getState();
  const { port, reply } = worker();
  const create = vi.fn(() => port);
  const client = createAiDecisionClient(P1, { id: "first-legal" }, "seed", create);
  const failed = client.decide(state, "automatic");
  const failedAssertion = expect(failed).rejects.toThrow("test worker failure");
  reply({ id: 1, error: "test worker failure" });
  await failedAssertion;
  const timedOut = client.decide(state, "automatic");
  const timeoutAssertion = expect(timedOut).rejects.toThrow("timed out");
  await vi.advanceTimersByTimeAsync(15_000);
  await timeoutAssertion;
  expect(create).toHaveBeenCalledTimes(2);
  expect(port.terminate).toHaveBeenCalledTimes(2);
  client.dispose();
});
