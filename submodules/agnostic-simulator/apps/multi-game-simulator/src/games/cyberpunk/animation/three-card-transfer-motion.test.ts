import { describe, expect, it } from "vitest";

import { resolveCardTransferPose } from "./three-card-transfer-motion";

const source = { left: 10, top: 20, width: 100, height: 140 };
const destination = { left: 410, top: 260, width: 80, height: 112 };

describe("resolveCardTransferPose", () => {
  it("travels at the smaller measured card footprint", () => {
    const start = resolveCardTransferPose({
      source,
      destination,
      elapsedMs: 0,
      startAtMs: 0,
      durationMs: 560,
      faceChanges: false,
      sourceVisible: true,
      destinationVisible: true,
    });
    const end = resolveCardTransferPose({
      source,
      destination,
      elapsedMs: 560,
      startAtMs: 0,
      durationMs: 560,
      faceChanges: false,
      sourceVisible: true,
      destinationVisible: true,
    });

    expect(start).toMatchObject({ centerX: 60, centerY: 90, width: 80, height: 112 });
    expect(end).toMatchObject({ centerX: 450, centerY: 316, width: 80, height: 112 });
  });

  it("lifts and tilts without swelling or resizing during travel", () => {
    const middle = resolveCardTransferPose({
      source,
      destination,
      elapsedMs: 280,
      startAtMs: 0,
      durationMs: 560,
      faceChanges: false,
      sourceVisible: true,
      destinationVisible: true,
    });

    expect(middle.centerY).toBeLessThan((90 + 316) / 2);
    expect(middle.width).toBe(80);
    expect(middle.height).toBe(112);
    expect(middle.depth).toBeGreaterThan(0);
    expect(middle.rotationZ).toBeGreaterThan(0);
  });

  it("turns a changing face exactly once and supports appearance fades", () => {
    const middle = resolveCardTransferPose({
      source,
      destination,
      elapsedMs: 280,
      startAtMs: 0,
      durationMs: 560,
      faceChanges: true,
      sourceVisible: false,
      destinationVisible: true,
    });
    const end = resolveCardTransferPose({
      source,
      destination,
      elapsedMs: 560,
      startAtMs: 0,
      durationMs: 560,
      faceChanges: true,
      sourceVisible: false,
      destinationVisible: true,
    });

    expect(middle.rotationY).toBeCloseTo(0);
    expect(middle.faceRevealed).toBe(true);
    expect(middle.opacity).toBeGreaterThan(0.5);
    expect(middle.opacity).toBeLessThan(0.7);
    expect(end.rotationY).toBeCloseTo(0);
    expect(end.faceRevealed).toBe(true);
    expect(end.opacity).toBe(1);
  });

  it("settles before the end and uses the final beat for a landing pulse", () => {
    const landing = resolveCardTransferPose({
      source,
      destination,
      elapsedMs: 504,
      startAtMs: 0,
      durationMs: 560,
      faceChanges: false,
      sourceVisible: true,
      destinationVisible: true,
    });

    expect(landing.centerX).toBeCloseTo(450);
    expect(landing.centerY).toBeCloseTo(316);
    expect(landing.landingHaloOpacity).toBeGreaterThan(0);
    expect(landing.landingHaloScale).toBeGreaterThan(0.62);
  });
});
