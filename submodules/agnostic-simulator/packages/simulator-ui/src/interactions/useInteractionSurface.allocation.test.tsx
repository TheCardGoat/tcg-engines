// @vitest-environment jsdom
import type { EngineInteractionView } from "@tcg/protocol";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { InteractionWorkspace } from "./InteractionWorkspace";
import { useInteractionDraft } from "./InteractionDraftContext";
import { useInteractionSurface } from "./useInteractionSurface";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let container: HTMLDivElement;
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
});

function render(totalMin = 0, candidateMin = 0) {
  const onSubmit = vi.fn(() => true);
  const view: EngineInteractionView = {
    protocolVersion: 2,
    gameSlug: "grand-archive",
    stateVersion: 1,
    actorId: "p1",
    status: "choosing",
    actions: [
      {
        id: "remove-counters",
        requestId: "remove-counters:1",
        intent: "choose-targets",
        enabled: true,
        text: { key: "Remove counters" },
        inputs: [
          {
            kind: "entity-allocation",
            id: "allocation",
            text: { key: "Remove up to three counters" },
            required: true,
            entityKinds: ["card"],
            role: "target",
            totalMin,
            totalMax: 3,
            candidates: [
              {
                entity: { kind: "card", instanceId: "champion" },
                text: { key: "Champion" },
                min: candidateMin,
                max: 3,
                enabled: true,
              },
            ],
          },
        ],
      },
    ],
  };
  function Controls() {
    const surface = useInteractionSurface(view);
    const draft = useInteractionDraft();
    return (
      <>
        <button disabled={!surface.canConfirm} onClick={surface.confirm}>
          Confirm allocation
        </button>
        <button onClick={() => draft.change("allocation", { champion: 2 })}>Assign two</button>
        <button onClick={surface.clear}>Clear allocation</button>
      </>
    );
  }
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() =>
    root.render(
      <InteractionWorkspace view={view} viewerId="p1" onSubmit={onSubmit}>
        <Controls />
      </InteractionWorkspace>,
    ),
  );
  return onSubmit;
}
function button(label: string) {
  const result = [...container.querySelectorAll("button")].find(
    (node) => node.textContent === label,
  );
  if (!result) throw new Error(`Missing button ${label}`);
  return result;
}

test("zero allocation is available immediately but requires explicit confirmation", () => {
  const submit = render();
  expect(submit).not.toHaveBeenCalled();
  expect(button("Confirm allocation").disabled).toBe(false);
  act(() => button("Confirm allocation").click());
  expect(submit).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ values: { allocation: {} } }),
  );
});

test.each([
  [1, 0],
  [1, 1],
])("zero stays unavailable when bounds require more (%i, %i)", (totalMin, candidateMin) => {
  const submit = render(totalMin, candidateMin);
  expect(button("Confirm allocation").disabled).toBe(true);
  act(() => button("Confirm allocation").click());
  expect(submit).not.toHaveBeenCalled();
  act(() => button("Assign two").click());
  act(() => button("Confirm allocation").click());
  expect(submit).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ values: { allocation: { champion: 2 } } }),
  );
});

test("clearing a partial allocation restores the legal explicit zero choice", () => {
  const submit = render();
  act(() => button("Assign two").click());
  act(() => button("Clear allocation").click());
  expect(submit).not.toHaveBeenCalled();
  expect(button("Confirm allocation").disabled).toBe(false);
  act(() => button("Confirm allocation").click());
  expect(submit).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ values: { allocation: {} } }),
  );
});
