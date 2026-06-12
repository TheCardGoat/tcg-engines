import { describe, expect, it } from "bun:test";

import { detectImmersiveCapabilities, isRunningStandalonePwa } from "./immersive-capabilities.js";

function createNavigator(userAgent: string, standalone?: boolean): Navigator {
  return {
    userAgent,
    standalone,
  } as unknown as Navigator;
}

function createWindowWithDisplayMode(matches: boolean): Window {
  return {
    matchMedia: () =>
      ({
        matches,
      }) as MediaQueryList,
  } as unknown as Window;
}

describe("immersive capabilities", () => {
  it("detects standard fullscreen support and standalone mode", () => {
    const capabilities = detectImmersiveCapabilities(
      {
        fullscreenEnabled: true,
        documentElement: {},
      } as Document,
      createWindowWithDisplayMode(true),
      createNavigator(
        "Mozilla/5.0 (Linux; Android 15; Pixel 9) Chrome/135.0.0.0 Mobile Safari/537.36",
      ),
    );

    expect(capabilities.standardFullscreenSupported).toBe(true);
    expect(capabilities.fullscreenSupported).toBe(true);
    expect(capabilities.isStandalone).toBe(true);
    expect(capabilities.isIosSafari).toBe(false);
    expect(capabilities.orientationLockSupported).toBe(false);
  });

  it("detects iOS Safari browser limitations without throwing", () => {
    const capabilities = detectImmersiveCapabilities(
      {
        fullscreenEnabled: false,
        documentElement: {},
      } as Document,
      createWindowWithDisplayMode(false),
      createNavigator(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
      ),
    );

    expect(capabilities.isIos).toBe(true);
    expect(capabilities.isIosSafari).toBe(true);
    expect(capabilities.fullscreenSupported).toBe(false);
  });

  it("detects vendor-prefixed fullscreen support when Safari exposes it", () => {
    const capabilities = detectImmersiveCapabilities(
      {
        fullscreenEnabled: false,
        documentElement: {
          webkitRequestFullscreen: () => {},
        },
      } as unknown as Document,
      createWindowWithDisplayMode(false),
      createNavigator("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15"),
    );

    expect(capabilities.standardFullscreenSupported).toBe(false);
    expect(capabilities.safariFullscreenSupported).toBe(true);
    expect(capabilities.fullscreenSupported).toBe(true);
  });

  it("detects standalone mode from navigator.standalone", () => {
    expect(
      isRunningStandalonePwa(
        createWindowWithDisplayMode(false),
        createNavigator(
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
          true,
        ),
      ),
    ).toBe(true);
  });

  it("returns a safe unsupported shape when browser globals are missing", () => {
    const capabilities = detectImmersiveCapabilities(undefined, undefined, undefined);

    expect(capabilities.fullscreenSupported).toBe(false);
    expect(capabilities.isStandalone).toBe(false);
    expect(capabilities.orientationPolicy).toBe("portrait-only");
  });
});
