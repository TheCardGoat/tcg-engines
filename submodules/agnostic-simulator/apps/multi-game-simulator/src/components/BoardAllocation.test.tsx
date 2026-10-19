import { beginBarrageFixture } from "../games/alpha-clash/prompt-fixture-play";
import { useState } from "react";
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import {
  InteractionDraftPrompt,
  InteractionWorkspace,
  useInteractionDraft,
  useInteractionSurface,
} from "@tcg/simulator-ui";
import type { EngineInteractionView } from "@tcg/protocol";
import { createAlphaClashPromptFixture } from "../games/alpha-clash/prompt-fixtures";
import { labelAlphaClashInteractions } from "../games/alpha-clash/components/AlphaClashInteractions";
import { BoardAllocation } from "./BoardAllocation";
import { SharedInteractionPrompt } from "./SharedInteractionPrompt";

afterEach(async () => {
  cleanup();
  vi.restoreAllMocks();
  // dnd-kit retains click suppression for 50 ms after a mouse drag ends.
  await new Promise((resolve) => setTimeout(resolve, 60));
});
function setup(rejectOnce = false, mode: "board" | "drawer" | "direct" = "board") {
  const engine = createAlphaClashPromptFixture("prompt-barrage");
  beginBarrageFixture(engine);
  const adjust = vi.fn();
  const choice = engine.state.pendingChoices[0];
  if (choice.kind !== "division") throw new Error("Expected Barrage");
  const candidates = choice.candidates;
  const labels = new Map(candidates.map((id, i) => [id, `Target ${i + 1}`]));
  const initialView = labelAlphaClashInteractions(
    engine.getInteractionView("human"),
    (id) => labels.get(id) ?? "Card",
  );
  const sourceId = initialView.actions.find((a) => a.source)?.source?.instanceId;
  const anchors = candidates.map((id, i) => ({
    id,
    left: 300 + i * 120,
    top: 100,
    width: 100,
    height: 140,
  }));
  if (sourceId && !candidates.includes(sourceId))
    anchors.push({ id: sourceId, left: 60, top: 100, width: 100, height: 140 });
  function Content({ view }: { view: EngineInteractionView }) {
    const surface = useInteractionSurface(view);
    const draft = useInteractionDraft();
    if (mode === "drawer") return <InteractionDraftPrompt view={view} viewerId="human" embedded />;
    if (mode === "direct")
      return (
        <>
          <button
            onClick={() =>
              draft.begin(view.actions.find((a) => a.id.startsWith("resolveChoice:"))!.id)
            }
          >
            Begin allocation
          </button>
          {candidates.map((id, i) => (
            <button key={id} onClick={() => surface.select(id)}>
              Select target {i + 1}
            </button>
          ))}
          <output
            aria-label="Draft allocation"
            data-locked={surface.locked}
            data-input={surface.input?.kind}
            data-candidates={[...surface.candidateIds].join(",")}
          >
            {JSON.stringify(surface.values.allocation ?? {})}
          </output>
        </>
      );
    return surface.input?.kind === "entity-allocation" ? (
      <BoardAllocation
        input={surface.input}
        surface={surface}
        anchors={anchors}
        labels={labels}
        reducedMotion
        onAdjust={adjust}
      />
    ) : (
      <SharedInteractionPrompt surface={surface} view={view} viewerId="human" cards={new Map()} />
    );
  }
  function Harness() {
    const [view, update] = useState(() => initialView);
    return (
      <MantineProvider>
        <InteractionWorkspace
          view={view}
          viewerId="human"
          onSubmit={(submission) => {
            if (rejectOnce) {
              rejectOnce = false;
              return false;
            }
            const result = engine.submitInteraction("human", submission, {
              gameId: "allocation-component",
              sourceAuthority: "server",
            });
            if (result.success) update(engine.getInteractionView("human"));
            return result.success;
          }}
        >
          <Content view={view} />
        </InteractionWorkspace>
      </MantineProvider>
    );
  }
  render(<Harness />);
  return { engine, adjust, choice };
}
test("board amount controls enforce remaining total and recipient limit, reset and auto-resolve", async () => {
  const { engine, adjust, choice } = setup();
  const add = (n: number) =>
    screen.getByRole("button", { name: `Allocate 1 point to Target ${n}` });
  const remove = (n: number) =>
    screen.getByRole("button", { name: `Remove 1 point from Target ${n}` });
  fireEvent.click(add(1));
  fireEvent.click(add(2));
  expect(add(3).hasAttribute("disabled")).toBe(true);
  fireEvent.click(remove(1));
  expect(screen.getByText(/5 of 6 points remaining/)).toBeTruthy();
  fireEvent.click(add(1));
  fireEvent.click(screen.getByRole("button", { name: "Reset allocation" }));
  expect(screen.getByText(/6 of 6 points remaining/)).toBeTruthy();
  for (let i = 0; i < choice.total; i++) fireEvent.click(add(2));
  expect(add(2).hasAttribute("disabled")).toBe(true);
  await new Promise((resolve) => setTimeout(resolve, 700));
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(screen.queryByRole("button", { name: "Confirm allocation" })).toBeNull();
  expect(adjust).toHaveBeenCalledTimes(choice.total + 4);
});
test("decline sends an empty allocation through the production adapter", () => {
  const { engine } = setup();
  fireEvent.click(screen.getByRole("button", { name: "Allocate 1 point to Target 1" }));
  fireEvent.click(screen.getByRole("button", { name: "Decline effect" }));
  expect(engine.state.pendingChoices).toHaveLength(0);
});
test("a rejected submission keeps its division for explicit retry", async () => {
  const { engine, choice } = setup(true);
  for (let i = 0; i < choice.total; i++)
    fireEvent.click(screen.getByRole("button", { name: "Allocate 1 point to Target 2" }));
  await new Promise((resolve) => setTimeout(resolve, 700));
  expect(engine.state.pendingChoices).toHaveLength(1);
  fireEvent.click(screen.getByRole("button", { name: "Remove 1 point from Target 2" }));
  expect(screen.getByLabelText("Target 2 allocation").textContent).toBe(String(choice.total - 1));
  fireEvent.click(screen.getByRole("button", { name: "Allocate 1 point to Target 2" }));
  await waitFor(() => expect(engine.state.pendingChoices).toHaveLength(0));
});

test("direct board target selection cannot exceed the native recipient limit", () => {
  const { choice } = setup(false, "direct");
  fireEvent.click(screen.getByRole("button", { name: "Begin allocation" }));
  for (const n of [1, 2, 3])
    fireEvent.click(screen.getByRole("button", { name: `Select target ${n}` }));
  expect(screen.getByLabelText("Draft allocation").getAttribute("data-locked")).toBe("false");
  expect(screen.getByLabelText("Draft allocation").getAttribute("data-input")).toBe(
    "entity-allocation",
  );
  expect(screen.getByLabelText("Draft allocation").getAttribute("data-candidates")).toContain(
    choice.candidates[0],
  );
  expect(JSON.parse(screen.getByLabelText("Draft allocation").textContent!)).toEqual({
    [choice.candidates[0]]: 1,
    [choice.candidates[1]]: 1,
  });
});

test("the match actions drawer enforces the same recipient limit as the board", () => {
  setup(false, "drawer");
  for (const n of [1, 2])
    fireEvent.click(screen.getByRole("button", { name: `Increase allocation for Target ${n}` }));
  expect(
    screen
      .getByRole("button", { name: "Increase allocation for Target 3" })
      .hasAttribute("disabled"),
  ).toBe(true);
});
test("drag cancellation and illegal drops preserve the draft; a legal drop assigns one", () => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      const left = Number.parseFloat(this.style.left) || 10;
      const top = Number.parseFloat(this.style.top) || 10;
      const width = Number.parseFloat(this.style.width) || 48;
      const height = Number.parseFloat(this.style.height) || 48;
      return {
        left,
        top,
        width,
        height,
        right: left + width,
        bottom: top + height,
        x: left,
        y: top,
        toJSON: () => ({}),
      };
    },
  );
  const { engine, adjust } = setup();
  const marker = screen.getByRole("button", { name: "Drag one point" });
  const start = () => {
    fireEvent.mouseDown(marker, { button: 0, clientX: 20, clientY: 20 });
    fireEvent.mouseMove(document, { clientX: 30, clientY: 30 });
  };
  start();
  fireEvent.keyDown(document, { code: "Escape" });
  expect(screen.getByText("Drag cancelled. Allocation unchanged.")).toBeTruthy();
  start();
  fireEvent.mouseMove(document, { clientX: 900, clientY: 600 });
  fireEvent.mouseUp(document);
  expect(
    screen.getByText("No amount assigned. Drop on a highlighted card with room remaining."),
  ).toBeTruthy();
  start();
  fireEvent.mouseMove(document, { clientX: 350, clientY: 150 });
  fireEvent.mouseUp(document);
  expect(screen.getByText(/5 of 6 points remaining/)).toBeTruthy();
  expect(adjust).toHaveBeenCalledTimes(1);
  expect(engine.state.pendingChoices).toHaveLength(1);
});
test("the resolving card is visually distinct and tethers connect its allocations", () => {
  setup();
  expect(document.querySelector(".tcg-allocation-focus")).toBeTruthy();
  expect(document.querySelector(".tcg-allocation-veil")).toBeTruthy();
  expect(screen.getByText("Resolving")).toBeTruthy();
  expect(document.querySelector(".tcg-allocation-target[data-issource]")).toBeTruthy();
  const solidTethers = () =>
    document.querySelectorAll(".tcg-allocation-tether:not(.tcg-allocation-tether--preview)").length;
  expect(solidTethers()).toBe(0);
  fireEvent.click(screen.getByRole("button", { name: "Allocate 1 point to Target 2" }));
  expect(solidTethers()).toBe(1);
});
