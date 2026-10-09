// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";

import { stateChangeVisualNode, stateChangeVisualRect } from "./EntityStateChangeLayer";

describe("stateChangeVisualNode", () => {
  it("keeps attached presentation siblings visible during a face change", () => {
    const host = document.createElement("div");
    const gear = document.createElement("div");
    const face = document.createElement("div");
    const orientation = document.createElement("div");
    gear.dataset.testid = "attached-gear";
    face.dataset.simAnimationFaceTarget = "";
    orientation.dataset.simAnimationOrientationTarget = "";
    host.append(gear, face, orientation);

    expect(stateChangeVisualNode(host, "face")).toBe(face);
    expect(stateChangeVisualNode(host, "orientation")).toBe(orientation);
    expect(gear.style.visibility).toBe("");
  });

  it("falls back to the registered entity when no face target is declared", () => {
    const host = document.createElement("div");

    expect(stateChangeVisualNode(host, "face")).toBe(host);
    expect(stateChangeVisualNode(host, "orientation")).toBe(host);
  });
});

describe("stateChangeVisualRect", () => {
  it("recovers the unrotated card surface from a spent card bounding box", () => {
    const spentRect = new DOMRect(100, 200, 140, 90);

    expect(stateChangeVisualRect(spentRect, 90).toJSON()).toMatchObject({
      x: 125,
      y: 175,
      width: 90,
      height: 140,
    });
  });

  it("keeps a ready card bounding box unchanged", () => {
    const readyRect = new DOMRect(100, 200, 90, 140);

    expect(stateChangeVisualRect(readyRect, 0)).toBe(readyRect);
  });
});
