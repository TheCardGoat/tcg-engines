import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";

describe("animation viewer-safe rendering boundary", () => {
  it("keeps animation overlays free of direct card image rendering", () => {
    const source = readFileSync(new URL("./MotionOverlays.tsx", import.meta.url), "utf8");

    expect(source).not.toContain("<img");
    expect(source).not.toMatch(/import\s+\{?\s*CardImage/);
    expect(source).toContain("projectSimulatorEntityForFace");
    expect(source).toContain("<CardFace");
  });

  it("keeps resolving stages on the shared viewer-safe card face", () => {
    const source = readFileSync(
      new URL("../components/ResolvingEntityStage.tsx", import.meta.url),
      "utf8",
    );

    expect(source).not.toContain("<img");
    expect(source).not.toMatch(/import\s+\{?\s*CardImage/);
    expect(source).toContain("projectSimulatorEntityForFace");
    expect(source).toContain("<CardFace");
  });
});
