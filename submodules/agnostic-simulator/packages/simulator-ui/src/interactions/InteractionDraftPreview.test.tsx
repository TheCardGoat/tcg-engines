// @vitest-environment jsdom
import type {
  EngineInteractionView,
  InteractionAction,
  InteractionPreviewRequest,
  InteractionPreviewResult,
} from "@tcg/protocol";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { InteractionDraftProvider, useInteractionDraft } from "./InteractionDraftContext";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const action: InteractionAction = {
  id: "choose",
  requestId: "choice-1",
  intent: "choose-option",
  text: { key: "Choose" },
  enabled: true,
  requiresPreview: true,
  inputs: [{ kind: "number", id: "X", text: { key: "X" }, required: true, min: 30, max: 40 }],
};
const view: EngineInteractionView = {
  protocolVersion: 2,
  gameSlug: "grand-archive",
  actorId: "p1",
  stateVersion: 1,
  status: "choosing",
  actions: [action],
};
const cleanups: (() => void)[] = [];
afterEach(() => cleanups.splice(0).forEach((cleanup) => cleanup()));
function fixture(previewAvailable = true) {
  let draft!: ReturnType<typeof useInteractionDraft>;
  const pending: {
    request: InteractionPreviewRequest;
    signal: AbortSignal;
    resolve: (result: InteractionPreviewResult) => void;
    reject: (error: Error) => void;
  }[] = [];
  const onPreview = vi.fn(
    (request: InteractionPreviewRequest, signal: AbortSignal) =>
      new Promise<InteractionPreviewResult>((resolve, reject) =>
        pending.push({ request, signal, resolve, reject }),
      ),
  );
  const submit = vi.fn(() => true);
  function Probe() {
    draft = useInteractionDraft();
    return null;
  }
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const render = (next = view) =>
    act(() =>
      root.render(
        <InteractionDraftProvider
          view={next}
          onPreview={previewAvailable ? onPreview : undefined}
          onSubmit={submit}
        >
          <Probe />
        </InteractionDraftProvider>,
      ),
    );
  render();
  act(() => draft.begin("choose"));
  cleanups.push(() => {
    act(() => root.unmount());
    container.remove();
  });
  const reply = async (index: number, result: InteractionPreviewResult) => {
    await act(async () => pending[index]!.resolve(result));
  };
  const response = (
    index: number,
    status: "incomplete" | "ready" | "invalid",
    inputs = action.inputs,
  ): Exclude<InteractionPreviewResult, { status: "unavailable" }> => ({
    status,
    stateVersion: 1,
    action: { ...action, inputs },
    values: pending[index]!.request.values,
    ignoredInputIds: [],
  });
  return { draft: () => draft, pending, submit, render, reply, response };
}

test("waits for the current preview and displays newly dependent inputs before submission", async () => {
  const f = fixture();
  expect(f.draft().previewPending).toBe(true);
  await f.reply(0, f.response(0, "incomplete"));
  act(() => f.draft().change("X", 32));
  act(() => f.draft().confirmCurrent());
  act(() => f.draft().submit());
  expect(f.submit).not.toHaveBeenCalled();
  const inputs: InteractionAction["inputs"] = [
    ...action.inputs,
    { kind: "number", id: "Y", text: { key: "Y" }, required: true, min: 32, max: 34 },
  ];
  await f.reply(1, f.response(1, "incomplete", inputs));
  expect(f.draft().view!.actions[0]!.inputs).toHaveLength(2);
  act(() => f.draft().change("Y", 33));
  act(() => f.draft().confirmCurrent());
  expect(f.submit).not.toHaveBeenCalled();
  await f.reply(2, f.response(2, "ready", inputs));
  expect(f.submit).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ values: { X: 32, Y: 33 } }),
  );
});

test("aborts obsolete drafts and ignores late responses even when the transport ignores abort", async () => {
  const f = fixture();
  act(() => f.draft().change("X", 32));
  expect(f.pending[0]!.signal.aborted).toBe(true);
  await f.reply(1, f.response(1, "incomplete"));
  await f.reply(0, { ...f.response(0, "ready"), values: { X: 40 } });
  expect(f.draft().values).toEqual({ X: 32 });
  expect(f.submit).not.toHaveBeenCalled();
  f.render({ ...view, actorId: "p2" });
  expect(f.draft().active).toBe(false);
  expect(f.draft().values).toEqual({});
});

test("rejects mismatched versions and retries a failed preview without discarding the draft", async () => {
  const f = fixture();
  await f.reply(0, { ...f.response(0, "ready"), stateVersion: 2 });
  expect(f.draft().previewError).toContain("match changed");
  act(() => f.draft().retryPreview());
  await act(async () => f.pending[1]!.reject(new Error("Disconnected")));
  expect(f.draft().previewError).toBe("Disconnected");
  expect(f.draft().active).toBe(true);
  act(() => f.draft().retryPreview());
  await f.reply(2, f.response(2, "incomplete"));
  expect(f.draft().previewError).toBeUndefined();
  expect(f.submit).not.toHaveBeenCalled();
});

test("changing an earlier choice removes dependent values and confirmations", async () => {
  const f = fixture();
  const inputs: InteractionAction["inputs"] = [
    ...action.inputs,
    { kind: "number", id: "Y", text: { key: "Y" }, required: true, min: 32, max: 34 },
  ];
  await f.reply(0, { ...f.response(0, "incomplete", inputs), values: { X: 32 } });
  act(() => f.draft().confirmCurrent());
  act(() => f.draft().change("Y", 33));
  act(() => f.draft().confirmCurrent());
  act(() => f.draft().change("X", 35));
  expect(f.draft().values).toEqual({ X: 35 });
  expect([...f.draft().confirmedInputIds]).toEqual([]);
  expect(f.submit).not.toHaveBeenCalled();
});

test("a preview-required action cannot submit when the session has no preview provider", () => {
  const f = fixture(false);
  act(() => f.draft().change("X", 32));
  act(() => f.draft().confirmCurrent());
  act(() => f.draft().submit());
  expect(f.draft().previewError).toContain("unavailable");
  expect(f.submit).not.toHaveBeenCalled();
});
