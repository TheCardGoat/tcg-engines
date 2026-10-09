// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vite-plus/test";
import { createDragMotion } from "./drag-motion";
import { createAnimationNodeRegistry } from "../animation/lib/node-registry";

afterEach(() => vi.useRealTimers());

test("pointer motion keeps a stable snapshot and retains the release pose until handoff", () => {
  const motion = createDragMotion<string>();
  const changed = vi.fn();
  motion.subscribe(changed);
  motion.begin("card", { left: 10, top: 20, width: 60, height: 84 });
  const session = motion.getSnapshot();
  motion.move(100, -50);
  expect(motion.getSnapshot()).toBe(session);
  expect(session?.offset).toEqual({ x: 100, y: -50 });
  motion.release();
  expect(motion.getSnapshot()).toMatchObject({ phase: "pending", offset: { x: 100, y: -50 } });
  motion.move(300, 200);
  expect(motion.getSnapshot()?.offset).toEqual({ x: 100, y: -50 });
  motion.finish();
  expect(motion.getSnapshot()).toBeNull();
  expect(changed).toHaveBeenCalledTimes(4);
});

test("cancel returns the same visual and a new drag cancels the old return", () => {
  vi.useFakeTimers();
  const motion = createDragMotion<string>();
  const rect = { left: 0, top: 0, width: 60, height: 84 };
  motion.begin("first", rect);
  motion.move(80, -60);
  motion.returnToSource();
  expect(motion.getSnapshot()?.phase).toBe("returning");
  vi.advanceTimersByTime(80);
  expect(motion.getSnapshot()!.offset.x).toBeLessThan(80);
  motion.begin("second", rect);
  vi.advanceTimersByTime(250);
  expect(motion.getSnapshot()?.source).toBe("second");
  motion.returnToSource();
  vi.advanceTimersByTime(250);
  expect(motion.getSnapshot()).toBeNull();
});

test("a committed transfer consumes the drag pose only once", () => {
  const registry = createAnimationNodeRegistry();
  const rect = new DOMRect(120, 80, 60, 84);
  registry.setDragOrigin("card", rect);
  expect(registry.takeDragOrigin("card")).toBe(rect);
  expect(registry.takeDragOrigin("card")).toBeNull();
  registry.setDragOrigin("card", rect);
  registry.setDragOrigin("card", null);
  expect(registry.takeDragOrigin("card")).toBeNull();
  registry.setDragOrigin("card", rect);
  registry.clear();
  expect(registry.takeDragOrigin("card")).toBeNull();
});
