// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react";
import { overrideDefinition } from "@tcg/cyberpunk-engine";
import * as cards from "@tcg/cyberpunk-cards";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { CyberpunkCardEffectFxLayer } from "./CyberpunkCardEffectFxLayer";

type FxCompiledStep = { step: Record<string, unknown>; startAtMs: number; durationMs: number };

const animation = vi.hoisted(() => {
  const runtime: {
    activeTransition: { id: string; phase: string } | null;
    playbackStartedAtMs: number;
    compiledPlan: { steps: FxCompiledStep[] };
  } = { activeTransition: null, playbackStartedAtMs: 0, compiledPlan: { steps: [] } };
  return { runtime };
});

const state = vi.hoisted(() => ({
  matchState: { G: { cardIndex: {} as Record<string, { definitionId: string }> } },
}));

const audio = vi.hoisted(() => ({
  controller: { play: vi.fn(), cancelScheduled: vi.fn(), dispose: vi.fn() },
}));

// The real frame is a stable provider value; a fresh object per render would
// loop the rect-measuring layout effects.
const surface = vi.hoisted(() => ({
  frame: {
    surface: null,
    rotated: false,
    mapRect: (rect: DOMRect) => rect,
  },
}));

vi.mock("@tcg/simulator-ui", () => ({
  useAnimationRuntime: () => animation.runtime,
}));
vi.mock("./animationSurfaceFrame", () => ({
  useAnimationSurfaceFrame: () => surface.frame,
}));
vi.mock("../../../simulator/settings", () => ({
  useSimulatorSettings: () => ({ settings: { soundVolume: 60, animationSpeed: "normal" } }),
}));
vi.mock("../engine", () => ({
  useEngine: () => ({ humanSide: "player", matchState: state.matchState }),
}));
vi.mock("./cyberpunk-effect-audio", () => ({
  createCyberpunkEffectAudio: () => audio.controller,
}));

const smasherUnit = cards.welcomeToNightCityRetailAdamSmasherMetalOverMeat;
const smasherLegend = cards.welcomeToNightCityRetailAdamSmasherEnderOfLegends;
overrideDefinition(smasherUnit);
overrideDefinition(smasherLegend);

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  animation.runtime.activeTransition = null;
  animation.runtime.compiledPlan = { steps: [] };
  state.matchState.G.cardIndex = {};
  audio.controller.play.mockClear();
  audio.controller.cancelScheduled.mockClear();
  document.body.innerHTML = "";
});

function mountEntity(entityId: string): void {
  const anchor = document.createElement("div");
  anchor.setAttribute("data-sim-entity-id", entityId);
  // jsdom has no layout engine; fake a visible box so the layer can anchor.
  Object.defineProperty(anchor, "getClientRects", {
    value: () => [{ left: 0, top: 0, right: 112, bottom: 157, width: 112, height: 157 }],
  });
  document.body.appendChild(anchor);
}

function mountBoard(): HTMLElement {
  const board = document.createElement("div");
  board.setAttribute("data-sim-board", "");
  document.body.appendChild(board);
  return board;
}

const defeatTransferStep = (id: string, entityId: string, startAtMs: number) => ({
  step: {
    id,
    type: "entityTransfer",
    entity: { kind: "entity", id: entityId },
    from: { kind: "zone", id: "p-field", ownerId: "p1" },
    to: { kind: "zone", id: "p-trash", ownerId: "p1" },
    sourceFace: "public",
    destinationFace: "public",
    sourcePresentation: "hold",
    audioCue: "card.destroy",
  },
  startAtMs,
  durationMs: 400,
});

function startTransition(id: string, steps: FxCompiledStep[]): void {
  animation.runtime.activeTransition = { id, phase: "running" };
  animation.runtime.compiledPlan = { steps };
}

test("renders the defeat glitch anchored to the defeated entity and schedules its sound", () => {
  vi.useFakeTimers();
  mountEntity("unit-1");
  startTransition("fx-defeat-1", [defeatTransferStep("exit-1", "unit-1", 120)]);

  const view = render(<CyberpunkCardEffectFxLayer />);

  expect(document.querySelector("[data-cyberpunk-effect-fx]")).not.toBeNull();
  expect(document.querySelector("[data-fx-defeat='unit-1']")).not.toBeNull();
  expect(
    view.container.ownerDocument.querySelector("[data-fx-defeat='unit-1']")?.textContent,
  ).toContain("DEFEATED");
  expect(audio.controller.play).toHaveBeenCalledWith("defeat", 120);

  act(() => {
    vi.advanceTimersByTime(2_000);
  });
  expect(document.querySelector("[data-cyberpunk-effect-fx]")).toBeNull();
  expect(document.querySelector("[data-fx-defeat='unit-1']")).toBeNull();
});

test("renders the cannot-attack lock-on with the emphasis label", () => {
  vi.useFakeTimers();
  mountEntity("unit-5");
  startTransition("fx-lockon-1", [
    {
      step: {
        id: "lock-1",
        type: "emphasize",
        at: { kind: "entity", id: "unit-5" },
        style: "pulse",
        tone: "negative",
        label: "CAN'T ATTACK",
      },
      startAtMs: 0,
      durationMs: 600,
    },
  ]);

  render(<CyberpunkCardEffectFxLayer />);

  expect(document.querySelector("[data-fx-lockon='unit-5']")).not.toBeNull();
  expect(document.body.textContent).toContain("CAN'T ATTACK");
  expect(audio.controller.play).toHaveBeenCalledWith("lockOn", 0);
});

test("renders the go solo deploy for a legendArea→field transfer", () => {
  vi.useFakeTimers();
  state.matchState.G.cardIndex["legend-1"] = { definitionId: smasherLegend.id };
  mountEntity("legend-1");
  startTransition("fx-solo-1", [
    {
      step: {
        id: "solo-1",
        type: "entityTransfer",
        entity: { kind: "entity", id: "legend-1" },
        from: { kind: "zone", id: "p-legendArea", ownerId: "p1" },
        to: { kind: "zone", id: "p-field", ownerId: "p1" },
        sourceFace: "hidden",
        destinationFace: "public",
        audioCue: "card.move",
      },
      startAtMs: 0,
      durationMs: 500,
    },
  ]);

  render(<CyberpunkCardEffectFxLayer />);

  expect(document.querySelector("[data-fx-gosolo='legend-1']")).not.toBeNull();
  expect(document.body.textContent).toContain("GO SOLO");
  expect(audio.controller.play).toHaveBeenCalledWith("goSolo", 0);
});

test("plays the board-wipe spectacle for a Smasher mass defeat and shakes the board", () => {
  vi.useFakeTimers();
  state.matchState.G.cardIndex["smasher-1"] = { definitionId: smasherUnit.id };
  mountEntity("smasher-1");
  mountEntity("unit-a");
  mountEntity("unit-b");
  const board = mountBoard();
  startTransition("fx-wipe-1", [
    {
      step: {
        id: "effect-1",
        type: "effect",
        source: { kind: "entity", id: "smasher-1" },
        targets: [
          { kind: "entity", id: "unit-a" },
          { kind: "entity", id: "unit-b" },
        ],
        tone: "negative",
        label: "Defeat",
        showText: false,
      },
      startAtMs: 0,
      durationMs: 700,
    },
    defeatTransferStep("exit-a", "unit-a", 500),
    defeatTransferStep("exit-b", "unit-b", 500),
  ]);

  render(<CyberpunkCardEffectFxLayer />);

  expect(document.querySelector("[data-fx-wipe]")).not.toBeNull();
  const caption = document.querySelector("[data-fx-wipe-caption]");
  expect(caption?.textContent).toContain("ADAM SMASHER");
  expect(caption?.textContent).toContain("TOTAL DEFEAT");
  // The detonation replaces the individual defeat pops for wiped units.
  expect(audio.controller.play).not.toHaveBeenCalledWith("defeat", expect.anything());
  expect(audio.controller.play).toHaveBeenCalledWith("wipeCharge", 0);
  expect(audio.controller.play).toHaveBeenCalledWith("wipeImpact", 500);
  expect([...board.classList].some((className) => className.includes("boardShake"))).toBe(true);

  act(() => {
    vi.advanceTimersByTime(2_600);
  });
  expect(document.querySelector("[data-fx-wipe]")).toBeNull();
  expect([...board.classList].some((className) => className.includes("boardShake"))).toBe(false);
});

test("renders nothing for plans without classifiable effect moments", () => {
  vi.useFakeTimers();
  startTransition("fx-none-1", [
    {
      step: {
        id: "phase-1",
        type: "phaseChange",
        from: "main",
        to: "start",
        variant: "turn",
        turnNumber: 3,
      },
      startAtMs: 0,
      durationMs: 1_200,
    },
  ]);

  render(<CyberpunkCardEffectFxLayer />);

  expect(document.querySelector("[data-cyberpunk-effect-fx]")).toBeNull();
  expect(audio.controller.play).not.toHaveBeenCalled();
});
