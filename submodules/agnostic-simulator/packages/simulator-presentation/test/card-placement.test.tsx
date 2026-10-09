// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, test, vi } from "vitest";
import { Group } from "three";

const renderState = vi.hoisted(() => ({ frame: (_state: unknown, _delta: number) => {} }));
vi.mock("@react-three/fiber", () => ({
  useThree: (select?: (value: unknown) => unknown) => {
    const value = { invalidate: () => {}, camera: null, gl: null };
    return select ? select(value) : value;
  },
  useFrame: (frame: typeof renderState.frame) => {
    renderState.frame = frame;
  },
}));
import { useCardPose, type ScenePose } from "../src/three";

let unmount = () => {};
afterEach(() => {
  unmount();
  vi.restoreAllMocks();
});
test("placement keeps the release pose, settles before turning, and lands once", async () => {
  vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  const object = new Group();
  const onComplete = vi.fn();
  const root = createRoot(document.createElement("div"));
  unmount = () => {
    act(() => root.unmount());
  };
  const hand: ScenePose = { x: 0, y: -500, z: 85, scale: 180, turn: -0.1 };
  const resource: ScenePose = { x: 150, y: -300, z: 12, scale: 42, turn: Math.PI };
  function Pose({ target, keyId }: { target: ScenePose; keyId: string }) {
    const ref = useCardPose(target, {
      rotationX: 0,
      transition: { key: keyId, duration: 0.36, lift: 0, turnDelay: 0.25, onComplete },
    });
    ref.current = object;
    return null;
  }
  await act(async () => root.render(<Pose target={hand} keyId="hand" />));
  object.position.set(90, -310, 85); // Existing mesh at the player's release point.
  await act(async () => root.render(<Pose target={resource} keyId="resource" />));
  expect(object.position.x).toBe(90);
  renderState.frame({}, 0.09);
  expect(object.rotation.z).toBeCloseTo(-0.1);
  expect(object.scale.x).toBeLessThan(180);
  expect(onComplete).not.toHaveBeenCalled();
  renderState.frame({}, 0.28);
  expect(object.position.x).toBe(150);
  expect(object.rotation.z).toBeCloseTo(Math.PI);
  expect(object.scale.x).toBe(42);
  expect(onComplete).toHaveBeenCalledTimes(1);
  renderState.frame({}, 0.1);
  await act(async () => root.render(<Pose target={resource} keyId="resource" />));
  expect(onComplete).toHaveBeenCalledTimes(1);
});

test("reduced motion places immediately and completes once", async () => {
  const object = new Group();
  const onComplete = vi.fn();
  const root = createRoot(document.createElement("div"));
  unmount = () => {
    act(() => root.unmount());
  };
  function Pose({ resource }: { resource: boolean }) {
    const ref = useCardPose(
      {
        x: resource ? 150 : 0,
        y: -300,
        z: 12,
        scale: resource ? 42 : 180,
        turn: resource ? Math.PI : 0,
      },
      {
        reduced: true,
        rotationX: 0,
        transition: { key: resource, duration: 0.36, lift: 0, onComplete },
      },
    );
    ref.current = object;
    return null;
  }
  await act(async () => root.render(<Pose resource={false} />));
  expect(onComplete).not.toHaveBeenCalled();
  await act(async () => root.render(<Pose resource />));
  expect(object.position.x).toBe(150);
  expect(object.scale.x).toBe(42);
  expect(onComplete).toHaveBeenCalledTimes(1);
  await act(async () => root.render(<Pose resource />));
  expect(onComplete).toHaveBeenCalledTimes(1);
});
