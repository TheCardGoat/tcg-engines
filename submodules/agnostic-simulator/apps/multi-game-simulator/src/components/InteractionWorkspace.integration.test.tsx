import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import type { EngineInteractionView } from "@tcg/protocol";
import {
  InteractionWorkspace,
  InteractionActionMenu,
  InteractionDraftPrompt,
  useInteractionBoard,
} from "@tcg/simulator-ui";
import { interactionCatalog } from "./interaction-catalog";

afterEach(cleanup);
const submit = vi.fn(() => true);
afterEach(() => submit.mockClear());
function Board({ view }: { view: EngineInteractionView }) {
  const board = useInteractionBoard(view);
  return (
    <>
      {[...board.candidateIds].map((id) => (
        <button key={id} onClick={() => board.selectEntity(id)}>
          Board {id}
        </button>
      ))}
    </>
  );
}
function Harness({ view, disabled = false }: { view: EngineInteractionView; disabled?: boolean }) {
  return (
    <MantineProvider>
      <InteractionWorkspace view={view} viewerId="player" onSubmit={submit} disabled={disabled}>
        <InteractionActionMenu view={view} viewerId="player" />
        <Board view={view} />
        <InteractionDraftPrompt view={view} viewerId="player" onSubmit={submit} />
      </InteractionWorkspace>
    </MantineProvider>
  );
}
function viewFor(
  id: string,
  gameSlug: "alpha-clash" | "grand-archive" | "cyberpunk",
): EngineInteractionView {
  return { ...interactionCatalog.find((entry) => entry.id === id)!.view, gameSlug };
}
for (const game of ["alpha-clash", "grand-archive", "cyberpunk"] as const) {
  test(`${game}: shared pending decision accepts false`, async () => {
    render(<Harness view={viewFor("boolean", game)} />);
    fireEvent.click(await screen.findByRole("button", { name: "Skip effect" }));
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ values: { accept: false } }));
  });
}
test("board selection advances the same draft and rejects stale candidates", async () => {
  const first = viewFor("single-target", "alpha-clash");
  const { rerender } = render(<Harness view={first} />);
  await screen.findByRole("button", { name: "Board alpha" });
  const next: EngineInteractionView = {
    ...first,
    stateVersion: 8,
    actions: first.actions.map((action) => ({
      ...action,
      requestId: "new:8",
      inputs: action.inputs.map((input) =>
        input.kind === "entity-selection"
          ? {
              ...input,
              candidates: input.candidates.filter((c) => c.entity.instanceId === "gamma"),
            }
          : input,
      ),
    })),
  };
  rerender(<Harness view={next} />);
  await waitFor(() => expect(screen.queryByRole("button", { name: "Board alpha" })).toBeNull());
  fireEvent.click(await screen.findByRole("button", { name: "Board gamma" }));
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        stateVersion: 8,
        requestId: "new:8",
        values: { cards: ["gamma"] },
      }),
    ),
  );
});
test("disabled workspace prevents menu and board submission", () => {
  render(<Harness view={viewFor("single-target", "alpha-clash")} disabled />);
  expect(screen.getByRole("button", { name: "Single target" }).hasAttribute("disabled")).toBe(true);
  expect(screen.queryByRole("button", { name: "Board alpha" })).toBeNull();
  expect(submit).not.toHaveBeenCalled();
});
test("allocation input validates the total before submission", async () => {
  render(<Harness view={viewFor("allocation", "alpha-clash")} />);
  fireEvent.click(
    await screen.findByRole("button", { name: "Increase allocation for Card alpha" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Increase allocation for Card alpha" }));
  expect(screen.getByRole("button", { name: "Confirm allocation" }).hasAttribute("disabled")).toBe(
    true,
  );
  fireEvent.click(screen.getByRole("button", { name: "Increase allocation for Card beta" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm allocation" }));
  await waitFor(() =>
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({ values: { allocation: { alpha: 2, beta: 1 } } }),
    ),
  );
});

test("an informational prompt does not offer cancellation when the host forbids it", () => {
  const view = { ...viewFor("single-target", "grand-archive"), resolution: undefined };
  render(
    <MantineProvider>
      <InteractionWorkspace view={view} viewerId="player" onSubmit={submit}>
        <InteractionDraftPrompt
          view={view}
          viewerId="player"
          actionId={view.actions[0].id}
          instructionOnly
          cancellable={false}
        />
      </InteractionWorkspace>
    </MantineProvider>,
  );
  expect(screen.getByText("Choose a card")).toBeTruthy();
  expect(screen.queryByRole("button", { name: /^Cancel/ })).toBeNull();
  expect(submit).not.toHaveBeenCalled();
});

for (const game of ["alpha-clash", "grand-archive", "cyberpunk"] as const) {
  test(`${game}: a lone optional target waits for an explicit answer`, async () => {
    render(<Harness view={viewFor("optional-target", game)} />);
    await screen.findByRole("button", { name: "Choose card" });
    expect(submit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Choose none" }));
    await waitFor(() =>
      expect(submit).toHaveBeenCalledWith(expect.objectContaining({ values: { cards: [] } })),
    );
  });
}

test("locking an open picker removes choices until the workspace is enabled", async () => {
  const view = viewFor("multi-target", "alpha-clash");
  const { rerender } = render(<Harness view={view} />);
  fireEvent.click(await screen.findByRole("button", { name: "Choose card" }));
  expect(screen.getByRole("button", { name: "Card alpha" })).toBeTruthy();
  rerender(<Harness view={view} disabled />);
  expect(screen.queryByRole("button", { name: "Card alpha" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
  rerender(<Harness view={view} />);
  expect(screen.queryByRole("button", { name: "Card alpha" })).toBeNull();
  fireEvent.click(await screen.findByRole("button", { name: "Choose card" }));
  expect(screen.getByRole("button", { name: "Card alpha" })).toBeTruthy();
  expect(submit).not.toHaveBeenCalled();
});

test("locking a destination workspace removes route controls", async () => {
  const view = viewFor("partition", "grand-archive");
  const { rerender } = render(<Harness view={view} />);
  expect(await screen.findAllByRole("button", { name: "Hand" })).toHaveLength(3);
  rerender(<Harness view={view} disabled />);
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(screen.queryByRole("button", { name: "Hand" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Confirm" })).toBeNull();
  expect(submit).not.toHaveBeenCalled();
});
