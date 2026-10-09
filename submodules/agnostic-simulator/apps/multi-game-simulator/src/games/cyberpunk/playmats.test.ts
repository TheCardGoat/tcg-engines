import { describe, expect, test } from "vitest";

import {
  cyberpunkSeatMayUsePlaymat,
  cyberpunkSeatPlaymat,
  resolveCyberpunkPlaymat,
  cyberpunkPlaymatSeatStyle,
} from "./playmats";

describe("cyberpunk playmats", () => {
  test("keeps the solid board for the default and unknown ids", () => {
    expect(resolveCyberpunkPlaymat(null)).toEqual({ id: "default", src: null });
    expect(resolveCyberpunkPlaymat("night-city")).toEqual({ id: "default", src: null });
    expect(cyberpunkPlaymatSeatStyle(null)).toBeUndefined();
  });

  test("keeps a free seat on the bare board", () => {
    expect(cyberpunkSeatMayUsePlaymat("free")).toBe(false);
    expect(cyberpunkSeatMayUsePlaymat(undefined)).toBe(false);
    expect(cyberpunkSeatPlaymat({ playmatId: "maelstrom", subscriptionTier: "free" })).toEqual({
      id: "default",
      src: null,
    });
  });

  test("shows a pictured mat for a supporter seat", () => {
    expect(cyberpunkSeatMayUsePlaymat("tier2")).toBe(true);
    expect(cyberpunkSeatPlaymat({ playmatId: "street-fire", subscriptionTier: "tier3" }).src).toBe(
      "https://cdn.tcg.online/public/cyberpunk/simulator/playmats/street-fire.webp",
    );
  });

  test.each([
    "https://cdn.example.test/custom.webp",
    "data:image/png;base64,abc",
    "/custom.webp",
    "constructor",
    "__proto__",
  ])("rejects non-catalog selection %s", (selection) => {
    expect(resolveCyberpunkPlaymat(selection)).toEqual({ id: "default", src: null });
    expect(cyberpunkSeatPlaymat({ playmatId: selection, subscriptionTier: "tier3" })).toEqual({
      id: "default",
      src: null,
    });
    expect(cyberpunkPlaymatSeatStyle(resolveCyberpunkPlaymat(selection).src)).toBeUndefined();
  });
});
