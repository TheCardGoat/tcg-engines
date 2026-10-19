// @vitest-environment jsdom
import { StrictMode } from "react";
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import { useBackgroundBot } from "./use-background-bot";
import type { DecisionRequest, DecisionResponse, DecisionWorker } from "./decision-worker";

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("Worker", class {});
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
function fixture(strict = false) {
  type Port = DecisionWorker<{ state: object }, { move: string }, { catalog: string[] }>;
  const ports: Port[] = [];
  const createWorker = vi.fn(() => {
    const port: Port = {
      onmessage: null,
      onerror: null,
      onmessageerror: null,
      postMessage: vi.fn(),
      terminate: vi.fn(),
    };
    ports.push(port);
    return port;
  });
  const commit = vi.fn();
  const onError = vi.fn();
  const decide = vi.fn(() => ({ move: "fallback" }));
  const workerKey = {};
  const state = { version: 1 };
  let authoritative: object = state;
  const initialProps = { identity: state, scope: "greedy", auto: true, enabled: true };
  const view = renderHook(
    (props) =>
      useBackgroundBot({
        ...props,
        getIdentity: () => authoritative,
        workerKey,
        delayMs: 600,
        createWorker,
        context: () => ({ catalog: ["card"] }),
        input: () => ({ state: props.identity }),
        decide,
        commit,
        onError,
      }),
    { initialProps, ...(strict ? { wrapper: StrictMode } : {}) },
  );
  function request(port = ports.at(-1)!) {
    return vi.mocked(port.postMessage).mock.calls.at(-1)![0];
  }
  function reply(
    port = ports.at(-1)!,
    data: DecisionResponse<{ move: string }> = { id: request(port).id, output: { move: "play" } },
  ) {
    port.onmessage?.(new MessageEvent("message", { data }));
  }
  return {
    view,
    ports,
    request,
    reply,
    commit,
    decide,
    onError,
    initialProps,
    replaceState(next: object) {
      authoritative = next;
    },
  };
}

test("starts thinking immediately, overlaps pacing, and commits one current result", async () => {
  const f = fixture();
  expect(f.ports).toHaveLength(1);
  expect(f.decide).not.toHaveBeenCalled();
  expect(structuredClone(f.request())).toEqual(f.request());
  await act(async () => {
    await vi.advanceTimersByTimeAsync(300);
    f.reply();
  });
  expect(f.commit).not.toHaveBeenCalled();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(300);
  });
  expect(f.commit).toHaveBeenCalledExactlyOnceWith({ move: "play" });
  await act(async () => f.reply());
  expect(f.commit).toHaveBeenCalledOnce();
});

test.each(["replacement", "authoritative change before render", "pause", "takeover", "strategy"])(
  "discards a decision after %s",
  async (change) => {
    const f = fixture();
    const old = f.ports[0]!;
    if (change === "replacement") f.view.rerender({ ...f.initialProps, identity: { version: 1 } });
    if (change === "authoritative change before render") f.replaceState({ version: 1 });
    if (change === "pause") f.view.rerender({ ...f.initialProps, auto: false });
    if (change === "takeover") f.view.rerender({ ...f.initialProps, enabled: false });
    if (change === "strategy")
      f.view.rerender({ ...f.initialProps, scope: "passive", auto: false });
    await act(async () => {
      f.reply(old, { id: 1, output: { move: "stale" } });
      await vi.advanceTimersByTimeAsync(600);
    });
    expect(f.commit).not.toHaveBeenCalled();
  },
);

test("step starts one request without automatic pacing or duplicate work", async () => {
  const f = fixture();
  f.view.rerender({ ...f.initialProps, auto: false });
  act(() => {
    f.view.result.current();
    f.view.result.current();
  });
  const port = f.ports.at(-1)!;
  expect(port.postMessage).toHaveBeenCalledOnce();
  await act(async () => {
    f.reply(port);
    await vi.advanceTimersByTimeAsync(0);
  });
  expect(f.commit).toHaveBeenCalledOnce();
});

test("StrictMode remount creates a usable worker and unmount cancels pending work", async () => {
  const f = fixture(true);
  expect(f.ports[0]!.terminate).toHaveBeenCalledOnce();
  const active = f.ports.at(-1)!;
  await act(async () => {
    f.reply(active);
    await vi.advanceTimersByTimeAsync(600);
  });
  expect(f.commit).toHaveBeenCalledOnce();
  f.view.unmount();
  expect(active.terminate).toHaveBeenCalledOnce();
});

test("timeout surfaces an error without running planning on the UI thread", async () => {
  const f = fixture();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(15_000);
  });
  expect(f.onError).toHaveBeenCalledExactlyOnceWith("Bot decision timed out");
  expect(f.decide).not.toHaveBeenCalled();
  expect(f.ports[0]!.terminate).toHaveBeenCalledOnce();
});

test("sends immutable context once across successive decisions", async () => {
  const f = fixture();
  await act(async () => {
    f.reply();
    await vi.advanceTimersByTimeAsync(600);
  });
  const next = { version: 2 };
  f.replaceState(next);
  f.view.rerender({ ...f.initialProps, identity: next });
  expect(f.ports).toHaveLength(1);
  const req: DecisionRequest<{ state: object }, { catalog: string[] }> = f.request();
  expect(req.context).toBeUndefined();
  await act(async () => {
    f.reply();
    await vi.advanceTimersByTimeAsync(600);
  });
  expect(f.commit).toHaveBeenCalledTimes(2);
});
