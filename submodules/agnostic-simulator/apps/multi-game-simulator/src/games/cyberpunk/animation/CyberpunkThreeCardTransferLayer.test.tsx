// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import type { SimulatorSpatialStateChange } from "@tcg/simulator-ui";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { CyberpunkThreeCardStateChangeLayer } from "./CyberpunkThreeCardTransferLayer";

const entity: SimulatorEntity = {
  id: "legend-1",
  title: "Hidden card",
  subtitle: "",
  kind: "card",
  ownerId: "player",
  face: "hidden",
  states: [],
  stats: [],
  traits: [],
  backImageUrl: "/back.webp",
};

const change: SimulatorSpatialStateChange = {
  id: "spend-1",
  step: {
    id: "spend-1",
    type: "entityStateChange",
    entity: { id: entity.id, kind: "entity" },
    at: { kind: "entity", id: entity.id },
    change: "orientation",
    sourceFace: "hidden",
    destinationFace: "hidden",
    fromRotationDeg: 0,
    toRotationDeg: 90,
  },
  sourceEntity: entity,
  destinationEntity: entity,
  rect: new DOMRect(100, 200, 80, 112),
  density: "normal",
  startAtMs: 0,
  durationMs: 550,
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

test("state-change playback has one frame loop and releases it on retarget and unmount", () => {
  const pending = new Map<number, FrameRequestCallback>();
  let nextId = 0;
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    pending.set(++nextId, callback);
    return nextId;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => pending.delete(id));
  vi.spyOn(performance, "now").mockReturnValue(0);

  const view = render(
    <CyberpunkThreeCardStateChangeLayer changes={[change]} playbackStartedAtMs={0} />,
  );
  const clone = document.querySelector<HTMLElement>("[data-three-card-state-change-entity]");
  // Source handoff is visible before the first scheduled frame.
  expect(clone?.style.left).toBe("140px");
  expect(clone?.style.opacity).toBe("1");
  expect(pending.size).toBe(1);

  vi.mocked(performance.now).mockReturnValue(275);
  act(() => {
    const frame = [...pending.entries()][0]!;
    pending.delete(frame[0]);
    frame[1](275);
  });
  expect(clone?.style.transform).toContain("rotateZ(45deg)");
  expect(pending.size).toBe(1);

  view.rerender(
    <CyberpunkThreeCardStateChangeLayer
      changes={[{ ...change, id: "spend-2" }]}
      playbackStartedAtMs={275}
    />,
  );
  expect(pending.size).toBe(1);
  view.unmount();
  expect(pending.size).toBe(0);
});
