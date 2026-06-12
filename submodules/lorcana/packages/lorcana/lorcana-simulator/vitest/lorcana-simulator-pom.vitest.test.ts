// @vitest-environment jsdom

import { render } from "@testing-library/svelte";
import { TestingLibraryDomDriver } from "@tcg/simulator-testing/testing-library";
import { describe, expect, test, vi } from "vite-plus/test";

import {
  LorcanaDomSimulatorPom,
  WindowLorcanaHarnessClient,
} from "../src/testing/lorcana-simulator-pom";

class TestResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver ??= TestResizeObserver as typeof ResizeObserver;
window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  dispatchEvent: () => false,
})) as typeof window.matchMedia;

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  configurable: true,
  value: () => null,
});
Element.prototype.scrollTo ??= () => {};

vi.mock("$env/dynamic/public", () => ({ env: {} }));
vi.mock("@/features/simulator/animations/sound-service.js", () => ({
  boardMoveVariantToSoundId: () => null,
  cardEffectKindToSoundId: (kind: string) => kind,
  disposeSoundService: () => {},
  initSoundService: () => {},
  overlayKindToSoundId: (kind: string) => kind,
  playSound: () => {},
  setSoundVolume: () => {},
}));

describe("LorcanaDomSimulatorPom jsdom driver", () => {
  test("reads a mounted simulator harness without Playwright", async () => {
    const [{ default: LorcanaBrowserHarnessView }, { getLorcanaFixture }] = await Promise.all([
      import("@/features/simulator-devtools/harness/LorcanaBrowserHarnessView.svelte"),
      import("@/features/simulator-devtools/fixtures"),
    ]);
    const fixture = getLorcanaFixture("opening-hand");
    const view = render(LorcanaBrowserHarnessView, {
      props: {
        aiBot: false,
        browserTransport: { mode: "sync" },
        fixture,
        fixtureId: fixture.id,
        view: "playerOne",
      },
    });
    const pom = new LorcanaDomSimulatorPom(
      new TestingLibraryDomDriver(view.container),
      new WindowLorcanaHarnessClient(),
    );

    await pom.waitForReady();

    const status = await pom.getStatus("playerOne");
    expect(status.stateID).toBeGreaterThanOrEqual(0);
    expect(
      await pom.asBottomPlayer().getZoneCardCount({ player: "player_one", zone: "hand" }),
    ).toBe(status.zoneCounts.player_one?.hand ?? 0);
  }, 40_000);
});
