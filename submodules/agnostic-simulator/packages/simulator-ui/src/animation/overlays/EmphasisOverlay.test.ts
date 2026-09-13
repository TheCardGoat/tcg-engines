import { describe, expect, it } from "vite-plus/test";

import { emphasisOverlayPosition, emphasisVisualStyle } from "./EmphasisOverlay";

describe("emphasisVisualStyle", () => {
  it("distinguishes positive and negative reactions without relying on color alone", () => {
    expect(emphasisVisualStyle("positive")).toMatchObject({
      tone: "positive",
      borderStyle: "solid",
      travel: -20,
    });
    expect(emphasisVisualStyle("negative")).toMatchObject({
      tone: "negative",
      borderStyle: "dashed",
      travel: 20,
    });
  });

  it("keeps existing emphasis steps neutral when no tone is supplied", () => {
    expect(emphasisVisualStyle(undefined)).toMatchObject({ tone: "neutral", travel: 0 });
  });

  it("keeps a hero reaction inside a narrow mobile viewport", () => {
    expect(emphasisOverlayPosition({ x: 334, y: 528 }, { width: 390, height: 844 })).toEqual({
      left: 182,
      top: 428,
    });
  });
});
