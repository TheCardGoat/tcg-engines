// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";

import { stateChangeVisualNode } from "./EntityStateChangeLayer";

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
