// @vitest-environment jsdom
import { HeadlessMantineProvider } from "@mantine/core";
import type { EngineInteractionView } from "@tcg/protocol";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, expect, test, vi } from "vite-plus/test";
import {
  AnimationRuntimeContext,
  type AnimationRuntimeContextValue,
} from "../animation/provider/contexts";
import { createAnimationNodeRegistry } from "../animation/lib/node-registry";
import {
  InteractionWorkspace,
  InteractionActionMenu,
  InteractionDraftPrompt,
  useInteractionBoard,
} from "./InteractionWorkspace";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let root: Root | undefined;
let container: HTMLDivElement;
afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
});
const view: EngineInteractionView = {
  protocolVersion: 2,
  gameSlug: "alpha-clash",
  stateVersion: 7,
  actorId: "player",
  status: "choosing",
  actions: [
    {
      id: "target",
      requestId: "target:7",
      intent: "choose-targets",
      text: { key: "Choose target" },
      enabled: true,
      inputs: [
        {
          id: "cards",
          kind: "entity-selection",
          role: "target",
          text: { key: "Choose a card" },
          required: true,
          entityKinds: ["card"],
          min: 1,
          max: 1,
          ordered: false,
          candidates: [
            {
              entity: { kind: "card", instanceId: "alpha" },
              text: { key: "Alpha" },
              enabled: true,
            },
          ],
        },
      ],
    },
  ],
};
function Board() {
  const board = useInteractionBoard(view);
  return (
    <button
      data-board
      disabled={!board.candidateIds.has("alpha")}
      onClick={() => board.selectEntity("alpha")}
    >
      Board target
    </button>
  );
}
function runtime(phase: "preparing" | "running" | null): AnimationRuntimeContextValue {
  return {
    scopeId: "test",
    speed: "normal",
    spatialMotionSuppressed: false,
    viewerSeatId: "player",
    compiledPlan: null,
    activeTransition: phase
      ? {
          id: "transfer",
          source: "authoritative",
          fromState: {},
          toState: {},
          fromVersion: 6,
          toVersion: 7,
          plan: { id: "transfer", version: 2, steps: [] },
          phase,
        }
      : null,
    registry: createAnimationNodeRegistry(),
    entityRenderer: () => null,
    getEntity: () => null,
    getZone: () => null,
  };
}
for (const phase of ["preparing", "running"] as const) {
  test(`all interaction surfaces wait during ${phase} and resume together`, () => {
    const submit = vi.fn(() => true);
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    const render = (value: AnimationRuntimeContextValue) =>
      act(() =>
        root?.render(
          <HeadlessMantineProvider>
            <AnimationRuntimeContext.Provider value={value}>
              <InteractionWorkspace view={view} viewerId="player" onSubmit={submit}>
                <InteractionActionMenu view={view} viewerId="player" />
                <Board />
                <InteractionDraftPrompt view={view} viewerId="player" onSubmit={submit} />
              </InteractionWorkspace>
            </AnimationRuntimeContext.Provider>
          </HeadlessMantineProvider>,
        ),
      );
    render(runtime(null));
    expect(container.querySelector<HTMLButtonElement>("[data-board]")!.disabled).toBe(false);
    render(runtime(phase));
    expect(container.querySelector("[data-testid='interaction-resolution-prompt']")).toBeNull();
    expect(container.querySelector<HTMLButtonElement>("[aria-pressed]")!.disabled).toBe(true);
    const board = container.querySelector<HTMLButtonElement>("[data-board]")!;
    expect(board.disabled).toBe(true);
    act(() => board.click());
    expect(submit).not.toHaveBeenCalled();
    render(runtime(null));
    expect(board.disabled).toBe(false);
    expect(container.querySelector("[data-testid='interaction-resolution-prompt']")).not.toBeNull();
    act(() => board.click());
    expect(submit).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ stateVersion: 7, values: { cards: ["alpha"] } }),
    );
  });
}
