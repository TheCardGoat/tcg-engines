// @vitest-environment jsdom
import type { HarnessFixture, SimulatorEntity } from "@tcg/simulator-contract";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { InteractionPanel } from "./InteractionPanel";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

// The F8 repro shape: a die-target effect prompt projected as an optional
// (min 0, max 1) single-target selection with one gig-die candidate.
const gigDie: SimulatorEntity = {
  id: "gd_755974976",
  title: "D12",
  subtitle: "Gig die",
  kind: "die",
  ownerId: "player-1",
  face: "public",
  states: ["active"],
  stats: [{ label: "Face", value: "10" }],
  traits: ["d12"],
};

const unit: SimulatorEntity = {
  id: "unit-a",
  title: "Test Unit",
  subtitle: "Unit",
  kind: "unit",
  ownerId: "player-1",
  face: "public",
  states: ["ready"],
  stats: [{ label: "Power", value: "3" }],
  traits: [],
};

const fixture: HarnessFixture = {
  id: "optional-target-fixture",
  gameSlug: "cyberpunk",
  name: "Optional Target Fixture",
  summary: "Optional (min 0) target prompts must be resolvable without selecting a candidate.",
  adapterGoal: "Submit an empty selection as the decline for optional targets.",
  table: {
    status: { activeSeatId: "player-1", phase: "main", turn: 1, stateVersion: 1 },
    seats: [
      { id: "player-1", label: "Player", role: "human", perspective: "bottom", counters: [] },
    ],
    zones: [],
  },
  boardLayout: {
    title: "Test Table",
    summary: "Minimal layout.",
    buildingBlocks: [],
    sections: [],
  },
  entities: [gigDie, unit],
  interactions: [
    {
      id: "resolveEffectTarget",
      label: "Choose Gig for Afterparty at Lizzie's",
      prompt: "Optional · Choose up to 1 target.",
      input: {
        kind: "single-target",
        min: 0,
        max: 1,
        candidateEntityIds: [gigDie.id],
        targetZoneIds: [],
        options: [],
      },
      movePreview: { engine: "cyberpunk", command: "resolveEffectTarget", payload: "{}" },
    },
    {
      id: "requiredTarget",
      label: "Choose a target",
      prompt: "Required · Choose exactly 1 target.",
      input: {
        kind: "single-target",
        min: 1,
        max: 1,
        candidateEntityIds: [unit.id],
        targetZoneIds: [],
        options: [],
      },
      movePreview: { engine: "test", command: "target", payload: "{}" },
    },
  ],
  guideSteps: [],
  agentChecks: [],
  coreComponents: [],
};

let root: Root | null = null;
let container: HTMLDivElement | null = null;

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
});

describe("InteractionPanel optional (min 0) target prompts", () => {
  test("die candidate chips select and an empty submission declines the prompt", () => {
    const onSubmitInteraction = vi.fn();
    renderPanel(onSubmitInteraction);

    const dieChip = getChip("interaction-candidate:resolveEffectTarget:gd_755974976");
    expect(dieChip.textContent).toContain("D12");
    const optionalSubmit = getSubmit("interaction-submit:resolveEffectTarget");

    // Optional prompt: submitting with no selection is the decline, so the
    // submit button must be enabled before any candidate is selected.
    expect(optionalSubmit.disabled).toBe(false);

    // Selecting the die candidate still works like any other chip.
    act(() => dieChip.click());
    expect(dieChip.getAttribute("aria-pressed")).toBe("true");
    act(() => optionalSubmit.click());
    expect(onSubmitInteraction).toHaveBeenCalledWith("resolveEffectTarget", {
      entityIds: ["gd_755974976"],
      optionIds: [],
      paymentIds: [],
      orderedIds: [],
    });

    // Deselect, then submit the empty selection as an explicit decline.
    onSubmitInteraction.mockClear();
    act(() => dieChip.click());
    expect(dieChip.getAttribute("aria-pressed")).toBe("false");
    expect(optionalSubmit.disabled).toBe(false);
    act(() => optionalSubmit.click());
    expect(onSubmitInteraction).toHaveBeenCalledWith("resolveEffectTarget", {
      entityIds: [],
      optionIds: [],
      paymentIds: [],
      orderedIds: [],
    });
  });

  test("required (min 1) target prompts still demand a selection", () => {
    const onSubmitInteraction = vi.fn();
    renderPanel(onSubmitInteraction);

    const requiredSubmit = getSubmit("interaction-submit:requiredTarget");
    expect(requiredSubmit.disabled).toBe(true);
    const chip = getChip("interaction-candidate:requiredTarget:unit-a");
    act(() => chip.click());
    expect(chip.getAttribute("aria-pressed")).toBe("true");
    expect(requiredSubmit.disabled).toBe(false);
  });
});

function renderPanel(onSubmitInteraction: (id: string, selection: unknown) => void) {
  if (!container) {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  }
  act(() =>
    root?.render(
      <InteractionPanel
        fixture={fixture}
        onSubmitInteraction={
          onSubmitInteraction as unknown as React.ComponentProps<
            typeof InteractionPanel
          >["onSubmitInteraction"]
        }
      />,
    ),
  );
}

function getChip(testId: string): HTMLButtonElement {
  const chip = container?.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`);
  if (!chip) throw new Error(`Missing candidate chip ${testId}.`);
  return chip;
}

function getSubmit(testId: string): HTMLButtonElement {
  const submit = container?.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`);
  if (!submit) throw new Error(`Missing submit button ${testId}.`);
  return submit;
}
