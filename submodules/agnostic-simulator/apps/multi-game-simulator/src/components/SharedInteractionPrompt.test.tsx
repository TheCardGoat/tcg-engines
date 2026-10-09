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
  fireEvent.click(screen.getByRole("radio", { name: "Draw a card" }));
  expect(submit).toHaveBeenCalledOnce();
  fireEvent.click(screen.getByRole("button", { name: "Retry choice" }));
  expect(submit).toHaveBeenCalledTimes(2);
  expect(submit).toHaveBeenLastCalledWith(expect.objectContaining({ values: { mode: ["draw"] } }));
});
