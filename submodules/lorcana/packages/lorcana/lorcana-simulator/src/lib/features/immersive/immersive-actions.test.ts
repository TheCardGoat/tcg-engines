import { describe, expect, it } from "bun:test";

import { requestFullscreenSafe } from "./immersive-actions.js";

describe("requestFullscreenSafe", () => {
  it("uses the standard Fullscreen API when available", async () => {
    let requestCount = 0;
    const element = {
      requestFullscreen: async () => {
        requestCount += 1;
      },
    } as HTMLElement;
    const document = {
      fullscreenEnabled: true,
      documentElement: element,
      fullscreenElement: null,
    } as Document;

    const result = await requestFullscreenSafe(undefined, document);

    expect(result.entered).toBe(true);
    expect(requestCount).toBe(1);
  });

  it("falls back to Safari-prefixed fullscreen requests", async () => {
    let requestCount = 0;
    const element = {
      webkitRequestFullscreen: async () => {
        requestCount += 1;
      },
    } as unknown as HTMLElement;
    const document = {
      fullscreenEnabled: false,
      documentElement: element,
      fullscreenElement: null,
      webkitFullscreenElement: null,
    } as unknown as Document;

    const result = await requestFullscreenSafe(undefined, document);

    expect(result.entered).toBe(true);
    expect(requestCount).toBe(1);
  });

  it("normalizes async request failures instead of throwing", async () => {
    const element = {
      requestFullscreen: async () => {
        throw new Error("Gesture denied");
      },
    } as unknown as HTMLElement;
    const document = {
      fullscreenEnabled: true,
      documentElement: element,
      fullscreenElement: null,
    } as Document;

    const result = await requestFullscreenSafe(undefined, document);

    expect(result.entered).toBe(false);
    expect(result.reason).toContain("Gesture denied");
  });

  it("returns an unsupported result when no fullscreen API exists", async () => {
    const result = await requestFullscreenSafe(undefined, {
      fullscreenEnabled: false,
      documentElement: {},
      fullscreenElement: null,
    } as Document);

    expect(result.entered).toBe(false);
    expect(result.reason).toContain("not supported");
  });
});
