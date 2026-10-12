// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, test, vi } from "vite-plus/test";
import type { EngineInteractionView } from "@tcg/protocol";
import { InteractionWorkspace, useInteractionSurface } from "@tcg/simulator-ui";
import { SearchRetrievePrompt } from "./SearchRetrievePrompt";

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
afterEach(cleanup);
const cards = new Map(["one", "two", "three"].map((id) => [id, { id, label: `Card ${id}` }]));
function view(min = 2, max = 2): EngineInteractionView {
  return {
    protocolVersion: 2,
    gameSlug: "grand-archive",
    actorId: "player",
    stateVersion: 1,
    status: "choosing",
    actions: [
      {
        id: "choose",
        requestId: "choose:1",
        intent: "choose-targets",
        enabled: true,
        text: { key: "Choose cards" },
        inputs: [
          {
            id: "cards",
            kind: "entity-selection",
            entityKinds: ["card"],
            role: "target",
            ordered: false,
            min,
            max,
            text: { key: "Choose cards" },
            candidates: [...cards.keys()].map((id) => ({
              entity: { kind: "card", instanceId: id },
              enabled: true,
            })),
          },
        ],
      },
    ],
  };
}
function Prompt({ state }: { state: EngineInteractionView }) {
  const surface = useInteractionSurface(state);
  return <SearchRetrievePrompt surface={surface} cards={cards} />;
}
function mount(state = view(), submit = vi.fn(() => true)) {
  render(
    <MantineProvider>
      <InteractionWorkspace
        view={state}
        viewerId="player"
        onSubmit={submit}
        deferInitialSubmission={() => true}
      >
        <Prompt state={state} />
      </InteractionWorkspace>
    </MantineProvider>,
  );
  return submit;
}
const pick = (id: string) =>
  fireEvent.click(screen.getByRole("button", { name: `Select Card ${id}` }));
test("keeps multiple native selections and submits only after the final pick", () => {
  const submit = mount();
  pick("two");
  expect(submit).not.toHaveBeenCalled();
  pick("one");
  expect(submit).toHaveBeenCalledOnce();
  expect(submit).toHaveBeenCalledWith(
    expect.objectContaining({ values: { cards: ["two", "one"] } }),
  );
});
test("submits an explicit zero answer for optional retrieval", () => {
  const submit = mount(view(0, 2));
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Choose none" }));
  expect(submit).toHaveBeenCalledWith(expect.objectContaining({ values: { cards: [] } }));
});
test("preserves a rejected selection and requires explicit retry", () => {
  const submit = vi.fn(() => false);
  mount(view(), submit);
  pick("one");
  pick("two");
  expect(submit).toHaveBeenCalledOnce();
  expect(screen.getByRole("button", { name: "Select Card one" }).getAttribute("aria-pressed")).toBe(
    "true",
  );
  fireEvent.click(screen.getByRole("button", { name: "Retry selection" }));
  expect(submit).toHaveBeenCalledTimes(2);
});
test("displays only candidates, even when other viewer-visible cards exist", () => {
  const state = view(1, 1);
  const action = state.actions[0]!;
  const input = action.inputs[0]!;
  if (input.kind !== "entity-selection") throw new Error("Expected card input");
  mount({
    ...state,
    actions: [{ ...action, inputs: [{ ...input, candidates: input.candidates.slice(0, 1) }] }],
  });
  expect(screen.queryByRole("button", { name: "Select Card two" })).toBeNull();
  expect(screen.getByRole("button", { name: "Select Card one" })).toBeTruthy();
});

test("preserves Alpha Clash's forced destination in the same native submission", () => {
  const state = view(1, 1);
  const action = state.actions[0]!;
  const submit = mount({
    ...state,
    gameSlug: "alpha-clash",
    actions: [
      {
        ...action,
        inputs: [
          ...action.inputs,
          {
            id: "destination",
            kind: "entity-selection",
            entityKinds: ["zone"],
            role: "destination",
            ordered: false,
            min: 1,
            max: 1,
            text: { key: "Choose destination" },
            candidates: [{ entity: { kind: "zone", instanceId: "hand" }, enabled: true }],
          },
        ],
      },
    ],
  });
  pick("one");
  expect(submit).toHaveBeenCalledWith(
    expect.objectContaining({ values: { cards: ["one"], destination: ["hand"] } }),
  );
});

test("submits the native option ID when declining an Alpha Clash search", () => {
  const state = view();
  const action = state.actions[0]!;
  const submit = mount({
    ...state,
    gameSlug: "alpha-clash",
    actions: [
      {
        ...action,
        inputs: [
          {
            id: "search",
            kind: "option-selection",
            min: 1,
            max: 1,
            text: { key: "Search" },
            options: [
              {
                id: "choose-one",
                entity: { kind: "card", instanceId: "one" },
                text: { key: "Card one" },
                enabled: true,
              },
              { id: "done", text: { key: "Find no card" }, enabled: true },
            ],
          },
        ],
      },
    ],
  });
  fireEvent.click(screen.getByRole("button", { name: "Find no card" }));
  expect(submit).toHaveBeenCalledWith(expect.objectContaining({ values: { search: ["done"] } }));
});

test("omits an optional interim selection with a positive minimum", () => {
  const base = view(1, 1);
  const optional: EngineInteractionView = {
    ...base,
    actions: base.actions.map((action) => ({
      ...action,
      inputs: action.inputs.map((input) => ({ ...input, required: false, role: "cost" })),
    })),
  };
  const submit = mount(optional);
  expect(screen.getByRole("button", { name: "Choose none" }).hasAttribute("disabled")).toBe(true);
  fireEvent.click(screen.getByRole("button", { name: "Skip payment" }));
  expect(submit).toHaveBeenCalledOnce();
  expect(submit).toHaveBeenCalledWith(expect.objectContaining({ values: {} }));
});
