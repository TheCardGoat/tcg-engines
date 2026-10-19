// @vitest-environment jsdom
import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type InteractionSubmission,
} from "@tcg/protocol";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, test, vi } from "vite-plus/test";
import { InteractionWorkspace, useInteractionBoard } from "./InteractionWorkspace";
import { useInteractionDraft } from "./InteractionDraftContext";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function fixture(max: number, disabled = false) {
  const view: EngineInteractionView = {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "gundam",
    stateVersion: 1,
    actorId: "p1",
    status: "ready",
    actions: [
      {
        id: "choose",
        requestId: "choose-1",
        intent: "activate",
        text: { key: "Choose" },
        enabled: true,
        inputs: [
          {
            kind: "option-selection",
            id: "options",
            text: { key: "Choose cards" },
            required: true,
            min: max === 1 ? 1 : 0,
            max,
            options: ["a", "b", "c", "disabled"].map((id) => ({
              id: `${id}-option`,
              text: { key: id },
              enabled: id !== "disabled",
              entity: { kind: "card", instanceId: id },
            })),
          },
        ],
      },
    ],
  };
  let board: ReturnType<typeof useInteractionBoard>;
  let draft: ReturnType<typeof useInteractionDraft>;
  const submit = vi.fn((_: InteractionSubmission) => false);
  function Probe() {
    board = useInteractionBoard(view);
    draft = useInteractionDraft();
    return null;
  }
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() =>
    root.render(
      <InteractionWorkspace view={view} viewerId="p1" disabled={disabled} onSubmit={submit}>
        <Probe />
      </InteractionWorkspace>,
    ),
  );
  act(() => draft.begin("choose"));
  return {
    select: (id: string) => act(() => board.selectEntity(id)),
    values: () => draft.values.options,
    submit,
    cleanup: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

test("board multi-option selection retains cards, enforces max, and toggles without submitting", () => {
  const f = fixture(2);
  try {
    f.select("a");
    f.select("b");
    f.select("c");
    f.select("disabled");
    expect(f.values()).toEqual(["a-option", "b-option"]);
    f.select("a");
    expect(f.values()).toEqual(["b-option"]);
    f.select("c");
    expect(f.values()).toEqual(["b-option", "c-option"]);
    expect(f.submit).not.toHaveBeenCalled();
  } finally {
    f.cleanup();
  }
});

test("single-option board choice still submits exactly one option", () => {
  const f = fixture(1);
  try {
    f.select("a");
    expect(f.submit).toHaveBeenCalledWith(
      expect.objectContaining({ values: { options: ["a-option"] } }),
    );
  } finally {
    f.cleanup();
  }
});

test("disabled board cannot change multi-option choices", () => {
  const f = fixture(2, true);
  try {
    f.select("a");
    expect(f.values()).toBeUndefined();
    expect(f.submit).not.toHaveBeenCalled();
  } finally {
    f.cleanup();
  }
});
