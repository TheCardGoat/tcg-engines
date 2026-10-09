// @vitest-environment jsdom
import { DndContext } from "@dnd-kit/core";
import { createSimulatorAnimationScope } from "@tcg/simulator-ui";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, expect, test } from "vite-plus/test";
import { FieldZone } from "./FieldZone";

const Animation = createSimulatorAnimationScope<Record<string, never>>();
const motionGlobal = globalThis as typeof globalThis & {
  __TCG_TEST_DISABLE_SIMULATOR_MOTION__?: boolean;
};
const previousMotion = motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__;

afterEach(() => {
  cleanup();
  motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = previousMotion;
});

test("a silent ability shows its text-free pulse on an empty field", async () => {
  motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = false;
  function Board() {
    const actions = Animation.useActions();
    return (
      <>
        <DndContext>
          <FieldZone units={[]} side="player" />
        </DndContext>
        <button
          type="button"
          onClick={() =>
            actions.enqueue({
              state: {},
              version: 2,
              plan: {
                id: "silent-ability",
                version: 2,
                steps: [
                  {
                    id: "field-pulse",
                    type: "emphasize",
                    at: { kind: "zone", id: "p-field", ownerId: "p1" },
                    style: "pulse",
                    durationMs: 800,
                  },
                ],
              },
            })
          }
        >
          Resolve silent ability
        </button>
      </>
    );
  }

  const view = render(
    <Animation.Root
      sessionKey="field-emphasis"
      initialState={{}}
      initialVersion={1}
      projection={{ getEntity: () => null, getZone: () => null }}
      entityRenderer={() => null}
      viewerSeatId="p1"
      animationSpeed="normal"
    >
      <Board />
    </Animation.Root>,
  );
  fireEvent.click(view.getByRole("button", { name: "Resolve silent ability" }));
  await waitFor(() =>
    expect(document.querySelector('[data-animation-overlay="emphasize"]')).not.toBeNull(),
  );
  expect(document.querySelector("[data-animation-label]")).toBeNull();
});
