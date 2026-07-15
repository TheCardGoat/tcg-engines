import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";

import ImmersiveStartCard from "./ImmersiveStartCard.svelte";
import type { ImmersiveCapabilities } from "@/features/immersive/immersive-capabilities.js";
import type { InstallNudgeVariant } from "@/features/matchmaking/state/install-nudge.svelte.js";

function createCapabilities(overrides?: Partial<ImmersiveCapabilities>): ImmersiveCapabilities {
  return {
    fullscreenSupported: false,
    standardFullscreenSupported: false,
    safariFullscreenSupported: false,
    isIos: false,
    isIosSafari: false,
    isStandalone: false,
    orientationLockSupported: false,
    orientationPolicy: "portrait-only",
    ...overrides,
  };
}

function createInstallNudge(variant: InstallNudgeVariant = "native") {
  return {
    shouldShow: true,
    variant,
    installing: false,
    promptInstall: async () => null,
    dismissForAWeek: () => {},
  };
}

describe("ImmersiveStartCard", () => {
  it("renders the immersive CTA for supported browsers", () => {
    const { body } = render(ImmersiveStartCard, {
      props: {
        immersive: {
          isStandalone: false,
          canRequestFullscreen: true,
          capabilities: createCapabilities(),
          startInBrowser: () => ({
            started: true,
            enteredFullscreen: false,
          }),
          startExperience: async () => ({
            started: true,
            enteredFullscreen: true,
          }),
        },
        installNudge: createInstallNudge("native"),
      },
    });

    expect(body).toContain("Open lobby now");
    expect(body).toContain("Continue in Browser");
    expect(body).toContain("Try Fullscreen");
    expect(body).toContain("Optional fullscreen");
    expect(body).toContain("Install Lorcanito");
    expect(body).toContain("Install app");
  });

  it("renders standalone guidance when the app is already installed", () => {
    const { body } = render(ImmersiveStartCard, {
      props: {
        immersive: {
          isStandalone: true,
          canRequestFullscreen: false,
          capabilities: createCapabilities({
            isStandalone: true,
          }),
          startInBrowser: () => ({
            started: true,
            enteredFullscreen: false,
          }),
          startExperience: async () => ({
            started: true,
            enteredFullscreen: false,
          }),
        },
      },
    });

    expect(body).toContain("Continue to Lobby");
    expect(body).toContain("Standalone active");
    expect(body).toContain("Home screen launch detected");
  });

  it("renders the iOS install helper without a native install button", () => {
    const { body } = render(ImmersiveStartCard, {
      props: {
        immersive: {
          isStandalone: false,
          canRequestFullscreen: false,
          capabilities: createCapabilities({
            isIos: true,
            isIosSafari: true,
          }),
          startInBrowser: () => ({
            started: true,
            enteredFullscreen: false,
          }),
          startExperience: async () => ({
            started: true,
            enteredFullscreen: false,
          }),
        },
        installNudge: createInstallNudge("ios-safari"),
      },
    });

    expect(body).toContain("Install for one-tap return");
    expect(body).toContain("Tap Share");
    expect(body).toContain("Add to Home Screen");
    expect(body).not.toContain("Install app");
  });
});
