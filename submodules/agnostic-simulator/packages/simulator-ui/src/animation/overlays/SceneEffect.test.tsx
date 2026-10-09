// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, test, vi } from "vite-plus/test";
import {
  CinematicSceneSchema,
  EffectStepV2Schema,
  cinematicSceneRefs,
  type CinematicScene,
  type AnimationRef,
} from "@tcg/protocol/animations";
import { createAnimationNodeRegistry } from "../lib/node-registry";
import {
  SceneEffect,
  sceneNodeFrames,
  scenePoint,
  sceneTrajectory,
  sceneParticle,
  sceneTrackTiming,
} from "./SceneEffect";
const board = { kind: "anchor", id: "board" } as const,
  target = { kind: "entity", id: "target" } as const;
const scene: CinematicScene = {
  board,
  tracks: [
    {
      id: "sky",
      kind: "backdrop",
      begin: 0,
      end: 1,
      color: "#17263b",
      accent: "#78d8c2",
      pattern: "sky",
      opacity: 0.5,
    },
    {
      id: "travel",
      kind: "travel",
      begin: 0.1,
      end: 0.5,
      from: { x: 0, y: 0.5 },
      to: { ref: target },
      path: "arc",
      count: 5,
      color: "#e0b967",
      stagger: 0.2,
      trail: true,
      shape: "arrow",
    },
    {
      id: "recoil",
      kind: "reaction",
      begin: 0.5,
      end: 0.7,
      at: target,
      motion: "recoil",
      strength: 1,
    },
    {
      id: "burn",
      kind: "material",
      begin: 0.5,
      end: 0.9,
      at: target,
      treatment: "burn",
      color: "#ef927e",
    },
    {
      id: "wipe",
      kind: "area",
      begin: 0.1,
      end: 0.5,
      color: "#78d8c2",
      motion: "sweep",
      direction: "left",
    },
  ],
};
test("strict scene schema rejects unbounded tracks, duplicated IDs and invalid beats", () => {
  expect(
    EffectStepV2Schema.safeParse({ id: "effect", type: "effect", durationMs: 1000, scene }).success,
  ).toBe(true);
  expect(
    CinematicSceneSchema.safeParse({ ...scene, tracks: [{ ...scene.tracks[0], end: 0 }] }).success,
  ).toBe(false);
  expect(
    CinematicSceneSchema.safeParse({ ...scene, tracks: [scene.tracks[0], scene.tracks[0]] })
      .success,
  ).toBe(false);
  expect(
    CinematicSceneSchema.safeParse({ ...scene, tracks: [{ ...scene.tracks[1], count: 999 }] })
      .success,
  ).toBe(false);
  expect(cinematicSceneRefs(scene)).toContainEqual(target);
});
test("arc/orbit tracks preserve endpoints, are finite, and particles are seeded", () => {
  for (const path of ["straight", "arc", "orbit", "zigzag"] as const) {
    const points = sceneTrajectory({ x: 1, y: 2 }, { x: 300, y: 400 }, path);
    expect(points[0]).toEqual({ x: 1, y: 2 });
    expect(points.at(-1)?.x).toBeCloseTo(300);
    expect(points.at(-1)?.y).toBeCloseTo(400);
    expect(
      sceneTrajectory({ x: 0, y: 0 }, { x: 0, y: 0 }, path).every(
        (p) => Number.isFinite(p.x) && Number.isFinite(p.y),
      ),
    ).toBe(true);
  }
  expect(sceneParticle(7, 10)).toBe(sceneParticle(7, 10));
  expect(sceneParticle(7, 10)).not.toBe(sceneParticle(8, 10));
  expect(sceneTrackTiming(scene.tracks[1]!, 100, 1000, 200)).toEqual({ delay: 0, duration: 400 });
  const rect = new DOMRect(100, 200, 800, 400);
  expect(scenePoint({ x: 0.5, y: 0.5 }, rect, () => null)).toEqual({ x: 400, y: 200 });
  expect(scenePoint({ ref: target }, rect, () => null)).toBeNull();
});
test("strike holds at contact and returns; material animates the image mask", () => {
  const frames = sceneNodeFrames(
    {
      id: "lunge",
      kind: "reaction",
      begin: 0,
      end: 1,
      at: target,
      toward: board,
      motion: "lunge",
      strength: 1,
    },
    new DOMRect(0, 0, 100, 140),
    new DOMRect(300, 0, 100, 140),
  );
  expect(frames[2]?.transform).toBe(frames[3]?.transform);
  expect(frames.at(-1)?.transform).toContain("translate(0,0)");
  const dissolve = sceneNodeFrames(
    {
      id: "d",
      kind: "material",
      at: target,
      begin: 0,
      end: 1,
      treatment: "dissolve",
      color: "#ffffff",
    },
    new DOMRect(),
  );
  expect(dissolve.at(-1)?.clipPath).toBe("inset(0 0 100% 0)");
});
test("late transfer mount rebinds reactions and unmount clears all mutations", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const registry = createAnimationNodeRegistry(),
    boardNode = document.createElement("div"),
    card = document.createElement("div"),
    host = document.createElement("div");
  document.body.append(boardNode, card, host);
  registry.register({ key: "b", ref: board, node: boardNode, presence: "present" });
  registry.register({ key: "t", ref: target, node: card, presence: "present" });
  const cancels = [vi.fn(), vi.fn()];
  const animate = vi
    .fn()
    .mockReturnValueOnce({ cancel: cancels[0] })
    .mockReturnValueOnce({ cancel: cancels[1] });
  card.animate = animate;
  const root = createRoot(host);
  const rectFor = (ref: AnimationRef) =>
    ref.id === "board" ? new DOMRect(100, 100, 800, 400) : new DOMRect(500, 180, 100, 140);
  try {
    await act(async () =>
      root.render(
        <SceneEffect
          scene={scene}
          startAtMs={0}
          durationMs={1000}
          registry={registry}
          scopeId="scene-test"
          rectFor={rectFor}
        />,
      ),
    );
    expect(host.querySelectorAll("[data-scene-projectile]")).toHaveLength(5);
    expect(host.querySelector('[data-scene-kind="area"] rect')?.getAttribute("height")).toBe("400");
    expect(animate).toHaveBeenCalledTimes(2);
    expect(animate.mock.calls[0]?.[1].delay).toBe(500);
    expect(animate.mock.calls[1]?.[0].at(-1).clipPath).toContain("95%");
    const layer = document.createElement("div");
    layer.dataset.animationScope = "scene-test";
    const clone = document.createElement("div");
    clone.dataset.animationTransferEntity = "target";
    const cloneCancel = vi.fn();
    const cloneAnimate = vi.fn().mockImplementation(() => ({ cancel: cloneCancel }));
    clone.animate = cloneAnimate;
    layer.append(clone);
    await act(async () => {
      document.body.append(layer);
      await Promise.resolve();
    });
    expect(cloneAnimate).toHaveBeenCalledTimes(2);
    expect(cancels.every((cancel) => cancel.mock.calls.length === 1)).toBe(true);
    await act(async () => root.unmount());
    expect(cloneCancel).toHaveBeenCalledTimes(2);
    layer.remove();
    expect(cancels.every((cancel) => cancel.mock.calls.length === 1)).toBe(true);
    expect(host.querySelector("[data-cinematic-scene]")).toBeNull();
  } finally {
    boardNode.remove();
    card.remove();
    host.remove();
    vi.unstubAllGlobals();
  }
});

test("pixel camera uses native discrete URL keyframes on board and scene and cancels both", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const registry = createAnimationNodeRegistry(),
    boardNode = document.createElement("div"),
    host = document.createElement("div");
  document.body.append(boardNode, host);
  registry.register({ key: "board", ref: board, node: boardNode, presence: "present" });
  const cancel = vi.fn(),
    animate = vi.fn(
      (
        _frames: Keyframe[] | PropertyIndexedKeyframes,
        _options?: number | KeyframeAnimationOptions,
      ) => ({ cancel }),
    );
  const previous = Object.getOwnPropertyDescriptor(SVGElement.prototype, "animate");
  Object.defineProperty(SVGElement.prototype, "animate", {
    configurable: true,
    writable: true,
    value: animate,
  });
  Object.defineProperty(boardNode, "animate", { value: animate });
  const root = createRoot(host);
  try {
    await act(async () =>
      root.render(
        <SceneEffect
          scene={{
            board,
            tracks: [
              { id: "pixel", kind: "camera", begin: 0.25, end: 0.7, motion: "pixel", strength: 1 },
            ],
          }}
          startAtMs={0}
          durationMs={1000}
          registry={registry}
          rectFor={() => new DOMRect(0, 0, 800, 400)}
        />,
      ),
    );
    expect(animate).toHaveBeenCalledTimes(2);
    for (const call of animate.mock.calls) {
      const frames = call[0] as Keyframe[];
      expect(frames[1]?.filter).toMatch(/^url\(#.+-pixels\)$/);
      expect(frames[0]?.filter).toBe("none");
      expect(frames.at(-1)?.filter).toBe("none");
    }
    await act(async () => root.unmount());
    expect(cancel).toHaveBeenCalledTimes(2);
  } finally {
    if (previous) Object.defineProperty(SVGElement.prototype, "animate", previous);
    else Reflect.deleteProperty(SVGElement.prototype, "animate");
    boardNode.remove();
    host.remove();
    vi.unstubAllGlobals();
  }
});
