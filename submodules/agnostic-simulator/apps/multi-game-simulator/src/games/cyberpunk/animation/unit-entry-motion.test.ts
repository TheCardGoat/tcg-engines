import { expect, test } from "vite-plus/test";
import {
  resolveUnitEntryPose,
  unitEntryElapsedMs,
  UNIT_ENTRY_CONTACT_PROGRESS,
} from "./unit-entry-motion";

const input = {
  source: { left: 100, top: 600, width: 100, height: 140 },
  destination: { left: 300, top: 300, width: 80, height: 112 },
  startAtMs: 100,
  durationMs: 760,
  faceChanges: false,
  sourceVisible: true,
  destinationVisible: true,
};
const poseAt = (progress: number) =>
  resolveUnitEntryPose({ ...input, elapsedMs: 100 + progress * 760 }, -5.5);

test("entry preserves the hand pose and lands at the measured field pose", () => {
  expect(poseAt(0)).toMatchObject({
    centerX: 150,
    centerY: 670,
    width: 100,
    height: 140,
    depth: 0,
  });
  expect(poseAt(0).rotationZ).toBeCloseTo((-5.5 * Math.PI) / 180);
  expect(poseAt(1)).toMatchObject({
    centerX: 340,
    centerY: 356,
    width: 80,
    height: 112,
    depth: 0,
    opacity: 0,
  });
  expect(poseAt(1).rotationZ).toBeCloseTo(0);
  expect(poseAt(1).rotationX).toBeCloseTo(0);
});

test("entry pauses, drops, then holds its landing pose while fading into the field", () => {
  const hover = poseAt(0.5);
  const anticipation = poseAt(0.62);
  const contact = poseAt(0.79);
  expect(hover.centerX).toBe(340);
  expect(hover.centerY).toBeLessThan(356);
  expect(anticipation.centerY).toBeLessThan(hover.centerY);
  expect(anticipation.width).toBeGreaterThan(hover.width);
  expect(contact.centerY).toBeCloseTo(356);
  expect(contact.width).toBeCloseTo(80);
  expect(contact.depth).toBeCloseTo(0);
  expect(contact.opacity).toBe(1);
  let opacity = contact.opacity;
  for (const progress of [0.8, 0.86, 0.93, 1]) {
    const pose = poseAt(progress);
    expect(pose).toMatchObject({
      centerX: 340,
      centerY: 356,
      width: 80,
      height: 112,
      depth: 0,
    });
    expect(pose.rotationX).toBeCloseTo(0);
    expect(pose.rotationZ).toBeCloseTo(0);
    expect(pose.opacity).toBeLessThan(opacity);
    opacity = pose.opacity;
  }
  expect(poseAt(1).opacity).toBe(0);
  expect(poseAt(1).shadowOpacity).toBe(0);
});

test("late capture preserves the source without delaying contact or the final handoff", () => {
  const contactAtMs = input.startAtMs + input.durationMs * UNIT_ENTRY_CONTACT_PROGRESS;
  expect(unitEntryElapsedMs(150, 50, input.startAtMs, input.durationMs)).toBe(input.startAtMs);
  expect(unitEntryElapsedMs(contactAtMs, 50, input.startAtMs, input.durationMs)).toBe(contactAtMs);
  expect(unitEntryElapsedMs(860, 50, input.startAtMs, input.durationMs)).toBe(860);
  // Mounting after contact must not replay a stale flight from the hand.
  expect(unitEntryElapsedMs(800, 700, input.startAtMs, input.durationMs)).toBe(800);
});
