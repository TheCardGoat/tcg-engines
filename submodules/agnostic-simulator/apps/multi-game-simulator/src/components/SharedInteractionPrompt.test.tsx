// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, test, vi } from "vite-plus/test";
import { InteractionWorkspace, useInteractionSurface } from "@tcg/simulator-ui";
import type { EngineInteractionView } from "@tcg/protocol";
import { SharedInteractionPrompt } from "./SharedInteractionPrompt";
import { interactionCatalog } from "./interaction-catalog";

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }));
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
afterEach(cleanup);
const cards = new Map(["alpha", "beta", "gamma"].map((id) => [id, { id, label: `Card ${id}` }]));
function caseView(id = "multi-target") {
  const fixture = interactionCatalog.find((entry) => entry.id === id);
  if (!fixture) throw new Error(`Missing fixture ${id}`);
  return fixture.view;
}
function Surface({ view, spatial = false }: { view: EngineInteractionView; spatial?: boolean }) {
  const surface = useInteractionSurface(view, {
    visibleEntityIds: new Set(spatial ? cards.keys() : []),
  });
  return (
    <>
      <button onClick={() => surface.select("alpha")}>Board alpha</button>
      <button onClick={() => surface.select("beta")}>Board beta</button>
      <SharedInteractionPrompt surface={surface} view={view} viewerId="player" cards={cards} />
    </>
  );
}
function Fixture({
  view = caseView(),
  disabled = false,
  spatial = false,
  onSubmit = vi.fn(() => true),
  viewerId = "player",
}: {
  view?: EngineInteractionView;
  disabled?: boolean;
  spatial?: boolean;
  onSubmit?: () => boolean;
  viewerId?: string;
}) {
  return (
    <MantineProvider>
      <InteractionWorkspace view={view} viewerId={viewerId} disabled={disabled} onSubmit={onSubmit}>
        <Surface view={view} spatial={spatial} />
      </InteractionWorkspace>
    </MantineProvider>
  );
}
const pick = (id: string) => screen.getByRole("button", { name: `Select Card ${id}` });
const minimize = () => fireEvent.click(screen.getByRole("button", { name: "Minimize" }));

test("sheet and board share one draft; minimizing never submits", () => {
  const submit = vi.fn(() => true);
  render(<Fixture onSubmit={submit} />);
  fireEvent.click(pick("alpha"));
  minimize();
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Board beta" }));
  fireEvent.click(screen.getByRole("button", { name: "Show choices" }));
  expect(pick("alpha").getAttribute("aria-pressed")).toBe("true");
  expect(pick("beta").getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(screen.getByRole("button", { name: "Confirm targets" }));
  expect(submit).toHaveBeenCalledOnce();
  expect(submit).toHaveBeenCalledWith(
    expect.objectContaining({ values: { cards: ["alpha", "beta"] } }),
  );
});

test("card-backed options select from the board and submit the native option id", () => {
  const submit = vi.fn(() => true);
  const view: EngineInteractionView = {
    protocolVersion: 2,
    gameSlug: "alpha-clash",
    stateVersion: 12,
    actorId: "player",
    status: "choosing",
    actions: [
      {
        id: "card-choice",
        requestId: "card-choice:12",
        intent: "choose-option",
        text: { key: "Choose source" },
        enabled: true,
        inputs: [
          {
            id: "selection",
            kind: "option-selection",
            text: { key: "Choose source" },
            required: true,
            min: 1,
            max: 1,
            options: [
              {
                id: "native-option-a",
                text: { key: "Card alpha" },
                entity: { kind: "card", instanceId: "alpha" },
                enabled: true,
              },
              {
                id: "native-option-b",
                text: { key: "Card beta" },
                entity: { kind: "card", instanceId: "beta" },
                enabled: true,
              },
            ],
          },
        ],
      },
    ],
  };
  render(<Fixture view={view} onSubmit={submit} spatial />);
  expect(screen.getByText("Select a highlighted card on the board.")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Choose Card alpha" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Board alpha" }));
  expect(submit).toHaveBeenCalledWith(
    expect.objectContaining({ values: { selection: ["native-option-a"] } }),
  );
});

test("a new request removes prior selection and minimized visibility", () => {
  const view = caseView();
  const { rerender } = render(<Fixture view={view} />);
  fireEvent.click(pick("alpha"));
  minimize();
  rerender(
    <Fixture
      view={{
        ...view,
        stateVersion: 8,
        actions: view.actions.map((action) => ({ ...action, requestId: "new-request" })),
      }}
    />,
  );
  expect(pick("alpha").getAttribute("aria-pressed")).toBe("false");
  expect(screen.getByRole("button", { name: "Confirm targets" }).hasAttribute("disabled")).toBe(
    true,
  );
});

test("paused input cannot submit from a board callback and resumes with its draft", () => {
  const submit = vi.fn(() => true),
    view = caseView();
  const { rerender } = render(<Fixture view={view} onSubmit={submit} spatial />);
  fireEvent.click(screen.getByRole("button", { name: "Board alpha" }));
  rerender(<Fixture view={view} onSubmit={submit} spatial disabled />);
  fireEvent.click(screen.getByRole("button", { name: "Board beta" }));
  expect(submit).not.toHaveBeenCalled();
  rerender(<Fixture view={view} onSubmit={submit} spatial />);
  fireEvent.click(screen.getByRole("button", { name: "Confirm targets" }));
  expect(submit).toHaveBeenCalledWith(expect.objectContaining({ values: { cards: ["alpha"] } }));
});

test("rejection retains targets and allows one retry", () => {
  const submit = vi.fn().mockReturnValueOnce(false).mockReturnValue(true);
  render(<Fixture onSubmit={submit} />);
  fireEvent.click(pick("alpha"));
  fireEvent.click(screen.getByRole("button", { name: "Confirm targets" }));
  expect(pick("alpha").getAttribute("aria-pressed")).toBe("true");
  expect(screen.getAllByText(/choice was not accepted/).length).toBeGreaterThan(0);
  fireEvent.click(screen.getByRole("button", { name: "Confirm targets" }));
  expect(submit).toHaveBeenCalledTimes(2);
});

test("only the actor gets choices", () => {
  const submit = vi.fn(() => true);
  render(<Fixture onSubmit={submit} viewerId="spectator" />);
  fireEvent.click(screen.getByRole("button", { name: "Board alpha" }));
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(submit).not.toHaveBeenCalled();
});

test("non-card choices reuse the shared draft widgets", () => {
  const submit = vi.fn(() => true);
  render(<Fixture view={caseView("conditional")} onSubmit={submit} />);
  fireEvent.click(screen.getByRole("button", { name: "Skip effect" }));
  expect(submit).toHaveBeenCalledWith(expect.objectContaining({ values: { accept: false } }));
});

test("optional empty targets can be confirmed without a dead end", () => {
  const submit = vi.fn(() => true);
  render(<Fixture view={caseView("empty-target")} onSubmit={submit} />);
  fireEvent.click(screen.getByRole("button", { name: "Confirm targets" }));
  expect(submit).toHaveBeenCalledWith(expect.objectContaining({ values: { cards: [] } }));
});

test("ordered cards submit in the chosen order through the shared gallery", () => {
  const submit = vi.fn(() => true);
  render(<Fixture view={caseView("ordering")} onSubmit={submit} />);
  for (const id of ["gamma", "alpha", "beta"]) fireEvent.click(pick(id));
  expect(screen.getByLabelText("Position 1").textContent).toBe("1");
  fireEvent.click(screen.getByRole("button", { name: "Confirm order" }));
  expect(submit).toHaveBeenCalledWith(
    expect.objectContaining({ values: { order: ["gamma", "alpha", "beta"] } }),
  );
});

test("rejected immediate choices wait for an explicit retry", () => {
  const submit = vi.fn().mockReturnValueOnce(false).mockReturnValue(true);
  render(<Fixture view={caseView("options")} onSubmit={submit} />);
  fireEvent.click(screen.getByRole("button", { name: "Draw a card" }));
  expect(submit).toHaveBeenCalledOnce();
  fireEvent.click(screen.getByRole("button", { name: "Retry choice" }));
  expect(submit).toHaveBeenCalledTimes(2);
  expect(submit).toHaveBeenLastCalledWith(expect.objectContaining({ values: { mode: ["draw"] } }));
});

function numberView(bounds: { min?: number; max?: number; step?: number }) {
  const view = caseView("number");
  return {
    ...view,
    actions: view.actions.map((action) => ({
      ...action,
      inputs: action.inputs.map((input) =>
        input.kind === "number" ? { ...input, ...bounds } : input,
      ),
    })),
  };
}

test.each([0, 4])("small amounts submit %i in one click without a default choice", (amount) => {
  const submit = vi.fn(() => true);
  render(<Fixture view={caseView("number")} onSubmit={submit} />);
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(screen.queryByRole("spinbutton")).toBeNull();
  expect(screen.queryByRole("button", { name: "Confirm amount" })).toBeNull();
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: `Choose amount ${amount}` }));
  expect(submit).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ values: { amount } }));
});

test("small amounts use the legal lower bound and step", () => {
  const submit = vi.fn(() => true);
  render(<Fixture view={numberView({ min: 3, max: 8, step: 2 })} onSubmit={submit} />);
  expect(
    screen.getAllByRole("button", { name: /^Choose amount/ }).map((button) => button.textContent),
  ).toEqual(["3", "5", "7"]);
  fireEvent.click(screen.getByRole("button", { name: "Choose amount 7" }));
  expect(submit).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ values: { amount: 7 } }),
  );
});

test.each([
  { min: 0, max: 6, step: 1 },
  { min: 0, max: 2, step: 0.5 },
  { min: 0, max: undefined, step: 1 },
  { min: 0, max: 2, step: undefined },
])("large or continuous ranges keep an explicit input: %j", (bounds) => {
  render(<Fixture view={numberView(bounds)} />);
  expect(screen.getByRole("spinbutton", { name: "Amount" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Confirm amount" }).hasAttribute("disabled")).toBe(
    true,
  );
  expect(screen.queryByRole("button", { name: /^Choose amount/ })).toBeNull();
});

test("six amounts fit as buttons, and locked amounts cannot submit", () => {
  const submit = vi.fn(() => true);
  const view = numberView({ min: 0, max: 5, step: 1 });
  const { rerender } = render(<Fixture view={view} onSubmit={submit} />);
  const buttons = screen.getAllByRole("button", { name: /^Choose amount/ });
  expect(buttons).toHaveLength(6);
  rerender(<Fixture view={view} onSubmit={submit} disabled />);
  for (const button of screen.getAllByRole("button", { name: /^Choose amount/ })) {
    expect(button.hasAttribute("disabled")).toBe(true);
    fireEvent.click(button);
  }
  expect(submit).not.toHaveBeenCalled();
});

test("rejected amounts do not loop and can be retried once", () => {
  const submit = vi.fn().mockReturnValueOnce(false).mockReturnValue(true);
  render(<Fixture view={caseView("number")} onSubmit={submit} />);
  fireEvent.click(screen.getByRole("button", { name: "Choose amount 3" }));
  expect(submit).toHaveBeenCalledOnce();
  fireEvent.click(screen.getByRole("button", { name: "Choose amount 3" }));
  expect(submit).toHaveBeenCalledTimes(2);
  expect(submit).toHaveBeenLastCalledWith(expect.objectContaining({ values: { amount: 3 } }));
});

test("large amounts enforce the limits before confirming", () => {
  const submit = vi.fn(() => true);
  render(<Fixture view={numberView({ max: 10 })} onSubmit={submit} />);
  const amount = screen.getByRole("spinbutton", { name: "Amount" });
  for (const value of ["99", "-1", "0.5", ""]) {
    fireEvent.change(amount, { target: { value } });
    expect(screen.getByRole("button", { name: "Confirm amount" }).hasAttribute("disabled")).toBe(
      true,
    );
    fireEvent.click(screen.getByRole("button", { name: "Confirm amount" }));
    expect(submit).not.toHaveBeenCalled();
  }
  fireEvent.change(amount, { target: { value: "10" } });
  expect(screen.getByRole("button", { name: "Increase amount" }).hasAttribute("disabled")).toBe(
    true,
  );
  fireEvent.click(screen.getByRole("button", { name: "Confirm amount" }));
  expect(submit).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ values: { amount: 10 } }),
  );
});

test("short modes commit once without opening a dialog; unavailable modes stay disabled", () => {
  const submit = vi.fn(() => true);
  render(<Fixture view={caseView("options")} onSubmit={submit} />);
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(screen.getByRole("button", { name: "Unavailable mode" }).hasAttribute("disabled")).toBe(
    true,
  );
  fireEvent.click(screen.getByRole("button", { name: "Draw a card" }));
  expect(submit).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ values: { mode: ["draw"] } }),
  );
});

test("cancel in the amount control commits the declared cancellation value once", () => {
  const submit = vi.fn(() => true);
  const initial = caseView("number");
  const view = {
    ...initial,
    actions: initial.actions.map((action) => ({
      ...action,
      inputs: action.inputs.map((input) =>
        input.kind === "number"
          ? {
              ...input,
              presentation: {
                contextText: { key: "From Sonoro to Magnate" },
                cancel: { value: 0, text: { key: "Cancel transfer" } },
              },
            }
          : input,
      ),
    })),
  };
  render(<Fixture view={view} onSubmit={submit} />);
  expect(screen.getByText("From Sonoro to Magnate")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Cancel transfer" }));
  expect(submit).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ values: { amount: 0 } }),
  );
});

test("card options preview by instance ID and choose only through the explicit action", () => {
  const submit = vi.fn(() => true);
  const base = caseView("options");
  const view = {
    ...base,
    actions: base.actions.map((action) => ({
      ...action,
      inputs: action.inputs.map((input) =>
        input.kind === "option-selection"
          ? {
              ...input,
              options: input.options.map((option, index) =>
                index === 0
                  ? { ...option, entity: { kind: "card" as const, instanceId: "alpha" } }
                  : option,
              ),
            }
          : input,
      ),
    })),
  };
  render(<Fixture view={view} onSubmit={submit} />);
  fireEvent.click(screen.getByRole("button", { name: "Preview Card alpha" }));
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Choose Card alpha" }));
  expect(submit).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ values: { mode: ["draw"] } }),
  );
});

test("long option search resets for a new request and submits only the matching native id", () => {
  const base = caseView("options");
  const view: EngineInteractionView = {
    ...base,
    actions: base.actions.map((action) => ({
      ...action,
      inputs: action.inputs.map((input) =>
        input.kind === "option-selection"
          ? {
              ...input,
              options: Array.from({ length: 20 }, (_, n) => ({
                id: `name-${n}`,
                text: { key: `Card name ${n}` },
                enabled: true,
              })),
            }
          : input,
      ),
    })),
  };
  const submit = vi.fn(() => true);
  const { rerender } = render(<Fixture view={view} onSubmit={submit} />);
  expect(screen.queryByRole("dialog")).toBeNull();
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "name 19" } });
  expect(screen.queryByRole("button", { name: "Card name 0" })).toBeNull();
  rerender(
    <Fixture
      view={{
        ...view,
        stateVersion: 99,
        actions: view.actions.map((a) => ({ ...a, requestId: "new-name-choice" })),
      }}
      onSubmit={submit}
    />,
  );
  expect(screen.getByRole("searchbox").getAttribute("value")).toBe("");
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "name 12" } });
  fireEvent.click(screen.getByRole("button", { name: "Card name 12" }));
  expect(submit).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ values: { mode: ["name-12"] } }),
  );
});
test("destination draft uses board selection, cancel, and the named confirm", () => {
  const submit = vi.fn().mockReturnValueOnce(false).mockReturnValue(true);
  const view: EngineInteractionView = {
    ...caseView(),
    status: "choosing",
    actions: [
      {
        id: "destination",
        requestId: "destination:1",
        intent: "choose-targets",
        enabled: true,
        text: { key: "Discard one card" },
        inputs: [
          {
            kind: "entity-selection",
            id: "selection",
            text: { key: "Discard one card" },
            role: "target",
            entityKinds: ["card"],
            min: 1,
            max: 1,
            ordered: false,
            candidates: [{ entity: { kind: "card", instanceId: "alpha" }, enabled: true }],
            cardDestination: { label: { key: "Oblivion" }, confirmText: { key: "Discard card" } },
          },
        ],
      },
    ],
  };
  render(<Fixture view={view} onSubmit={submit} spatial />);
  expect(screen.getByRole("button", { name: "Confirm choice" }).hasAttribute("disabled")).toBe(
    true,
  );
  fireEvent.click(screen.getByRole("button", { name: "Board alpha" }));
  expect(screen.getByText("Card alpha selected. Not yet applied.")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Cancel selection" }));
  expect(screen.getByRole("button", { name: "Confirm choice" }).hasAttribute("disabled")).toBe(
    true,
  );
  fireEvent.click(screen.getByRole("button", { name: "Board alpha" }));
  fireEvent.click(screen.getByRole("button", { name: "Discard card" }));
  expect(submit).toHaveBeenCalledOnce();
  // Rejected submissions keep the prompt up for retry.
  fireEvent.click(screen.getByRole("button", { name: "Discard card" }));
  expect(submit).toHaveBeenCalledTimes(2);
  expect(submit).toHaveBeenLastCalledWith(
    expect.objectContaining({ values: { selection: ["alpha"] } }),
  );
});
test.each([false, true])(
  "card options can wait for explicit confirmation (spatial=%s)",
  (spatial) => {
    const submit = vi.fn(() => true);
    const view: EngineInteractionView = {
      protocolVersion: 2,
      gameSlug: "alpha-clash",
      stateVersion: 1,
      actorId: "player",
      status: "choosing",
      actions: [
        {
          id: "pick",
          requestId: "pick:1",
          intent: "choose-option",
          text: { key: "Choose target" },
          enabled: true,
          inputs: [
            {
              kind: "option-selection",
              id: "selection",
              text: { key: "Choose target" },
              min: 1,
              max: 1,
              confirmBeforeSubmit: true,
              options: [
                {
                  id: "a",
                  text: { key: "Card alpha" },
                  entity: { kind: "card", instanceId: "alpha" },
                  enabled: true,
                },
              ],
            },
          ],
        },
      ],
    };
    render(<Fixture view={view} onSubmit={submit} spatial={spatial} />);
    fireEvent.click(
      screen.getByRole("button", { name: spatial ? "Board alpha" : "Choose Card alpha" }),
    );
    expect(submit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /^Confirm target$/ }));
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ values: { selection: ["a"] } }));
  },
);

test("off-board destination options expose cards and keep Done separate from movement", () => {
  const submit = vi.fn(() => true);
  const view: EngineInteractionView = {
    ...caseView(),
    status: "choosing",
    actions: [
      {
        id: "reveal",
        requestId: "reveal:1",
        intent: "choose-option",
        enabled: true,
        text: { key: "Choose cards" },
        inputs: [
          {
            kind: "option-selection",
            id: "selection",
            text: { key: "Choose cards" },
            min: 1,
            max: 1,
            required: true,
            options: [
              {
                id: "send-alpha",
                text: { key: "Card alpha" },
                entity: { kind: "card", instanceId: "alpha" },
                enabled: true,
              },
              { id: "done", text: { key: "Done" }, enabled: true },
            ],
            cardDestination: {
              label: { key: "Oblivion" },
              confirmText: { key: "Send to Oblivion" },
            },
          },
        ],
      },
    ],
  };
  render(<Fixture view={view} onSubmit={submit} />);
  expect(screen.queryByText("Select a highlighted card on the board.")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Choose Card alpha" }));
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Send to Oblivion" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Cancel selection" }));
  fireEvent.click(screen.getByRole("button", { name: "Done" }));
  expect(screen.queryByRole("button", { name: "Send to Oblivion" })).toBeNull();
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Confirm: Done" }));
  expect(submit).toHaveBeenCalledWith(expect.objectContaining({ values: { selection: ["done"] } }));
});

test("allocation uses one card workspace and a separate confirmation footer", () => {
  const submit = vi.fn(() => true);
  const { rerender } = render(<Fixture view={caseView("allocation")} onSubmit={submit} />);
  const dialog = screen.getByRole("dialog");
  expect(dialog.classList.contains("tcg-target-focus")).toBe(true);
  expect(screen.queryByTestId("interaction-resolution-prompt")).toBeNull();
  const confirm = screen.getByRole("button", { name: "Confirm allocation" });
  expect(confirm.closest("footer")).not.toBeNull();
  const increase = screen.getByRole("button", { name: "Increase allocation for Card alpha" });
  fireEvent.click(increase);
  rerender(<Fixture view={caseView("allocation")} onSubmit={submit} disabled />);
  expect(
    screen
      .getByRole("button", { name: "Increase allocation for Card alpha" })
      .hasAttribute("disabled"),
  ).toBe(true);
  rerender(<Fixture view={caseView("allocation")} onSubmit={submit} />);
  fireEvent.click(screen.getByRole("button", { name: "Increase allocation for Card alpha" }));
  fireEvent.click(screen.getByRole("button", { name: "Increase allocation for Card beta" }));
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Confirm allocation" }));
  expect(submit).toHaveBeenCalledWith(
    expect.objectContaining({ values: { allocation: { alpha: 2, beta: 1 } } }),
  );
});
