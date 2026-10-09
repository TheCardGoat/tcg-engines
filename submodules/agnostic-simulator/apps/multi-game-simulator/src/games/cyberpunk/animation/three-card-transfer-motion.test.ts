import { describe, expect, it } from "vitest";

import { resolveCardTransferPose } from "@tcg/simulator-presentation/motion";

const source = { left: 10, top: 20, width: 100, height: 140 };
const destination = { left: 410, top: 260, width: 80, height: 112 };

describe("resolveCardTransferPose", () => {
  it("visits the resource area before landing on a sold-card marker", () => {
    const resource = { left: 90, top: 300, width: 60, height: 84 };
    const receipt = { left: 180, top: 320, width: 24, height: 34 };
    const atResource = resolveCardTransferPose({
      source,
      via: resource,
      destination: receipt,
      elapsedMs: 496,
      startAtMs: 0,
      durationMs: 800,
      faceChanges: false,
      sourceVisible: true,
      destinationVisible: true,
    });
    const atReceipt = resolveCardTransferPose({
      source,
      via: resource,
      destination: receipt,
      elapsedMs: 800,
      startAtMs: 0,
      durationMs: 800,
      faceChanges: false,
      sourceVisible: true,
      destinationVisible: true,
    });
    expect(atResource).toMatchObject({ centerX: 120, centerY: 342, width: 60, height: 84 });
    expect(atReceipt).toMatchObject({ centerX: 192, centerY: 337, width: 24, height: 34 });
  });

  it("parks a staged retrieval at the display spot before continuing to the hand", () => {
    const stage = { left: 400, top: 200, width: 150, height: 210 };
    const input = {
      source,
      destination,
      via: stage,
      viaHold: 0.45,
      startAtMs: 0,
      durationMs: 1_400,
      faceChanges: false,
      sourceVisible: true,
      destinationVisible: true,
    };
    // progress 0.5 sits inside the hold window (0.341→0.791): parked, full
    // display-spot size, no lift or tilt.
    const parked = resolveCardTransferPose({ ...input, elapsedMs: 700 });
    expect(parked).toMatchObject({ centerX: 475, centerY: 305, width: 150, height: 210 });
    expect(parked.depth).toBeCloseTo(0);
    expect(parked.shadowOpacity).toBeCloseTo(0);
    // Past the hold the flight continues from the stage toward the hand.
    const continuing = resolveCardTransferPose({ ...input, elapsedMs: 1_190 });
    expect(continuing.centerX).toBeLessThan(475);
    expect(continuing.centerX).toBeGreaterThan(450);
    expect(continuing.width).toBeLessThan(150);
  });

  it("keeps a scheduled transfer copy hidden until its source handoff begins", () => {
    const waiting = resolveCardTransferPose({
      source,
      destination,
      elapsedMs: 300,
      startAtMs: 620,
      durationMs: 560,
      faceChanges: false,
      sourceVisible: true,
      destinationVisible: true,
    });

    expect(waiting).toMatchObject({ progress: 0, opacity: 0, centerX: 60, centerY: 90 });
  });

  it("parks a held transfer visible at its source until its beat starts", () => {
    const waiting = resolveCardTransferPose({
      source,
      destination,
      elapsedMs: 300,
      startAtMs: 2_400,
      durationMs: 800,
      faceChanges: false,
      sourceVisible: true,
      destinationVisible: true,
      holdsAtSource: true,
    });
    const takingOff = resolveCardTransferPose({
      source,
      destination,
      elapsedMs: 2_400,
      startAtMs: 2_400,
      durationMs: 800,
      faceChanges: false,
      sourceVisible: true,
      destinationVisible: true,
      holdsAtSource: true,
    });

    expect(waiting).toMatchObject({
      progress: 0,
      opacity: 1,
      centerX: 60,
      centerY: 90,
      width: 100,
      height: 140,
    });
    expect(takingOff).toMatchObject({ progress: 0, opacity: 1, centerX: 60, centerY: 90 });
  });

  it("keeps a held transfer hidden when its source was never measured", () => {
    const waiting = resolveCardTransferPose({
      source,
      destination,
      elapsedMs: 300,
      startAtMs: 2_400,
      durationMs: 800,
      faceChanges: false,
      sourceVisible: false,
      destinationVisible: true,
      holdsAtSource: true,
    });

    expect(waiting).toMatchObject({ progress: 0, opacity: 0 });
  });

  it("matches the measured card size at takeoff and landing", () => {
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

    expect(start).toMatchObject({ centerX: 60, centerY: 90, width: 100, height: 140 });
    expect(end).toMatchObject({ centerX: 450, centerY: 316, width: 80, height: 112 });
  });

  it("changes size during the same flight that lifts and tilts the card", () => {
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
    expect(middle.width).toBeGreaterThan(destination.width);
    expect(middle.width).toBeLessThan(source.width);
    expect(middle.height).toBeGreaterThan(destination.height);
    expect(middle.height).toBeLessThan(source.height);
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

  it("settles at the destination by the final beat", () => {
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
    expect(landing.width).toBe(destination.width);
    expect(landing.height).toBe(destination.height);
  });
});
