// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";

import AnimationFixturesPage from "./AnimationFixturesPage";

vi.mock("../simulator/audio/sound-service.ts", () => ({
  disposeSimulatorSoundService: vi.fn(),
  initSimulatorSoundService: vi.fn(async () => undefined),
  playSimulatorSound: vi.fn(),
  setSimulatorSoundPack: vi.fn(async () => undefined),
}));

describe("AnimationFixturesPage · Flesh and Blood", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/animation-fixtures?game=flesh-and-blood");
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test("renders the complete FAB step and sound inventories", async () => {
    const { container } = render(<AnimationFixturesPage onNavigate={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByRole("status").textContent).toBe("23 cues ready");
    });
    expect(container.querySelectorAll("[data-animation-step]")).toHaveLength(11);
    expect(container.querySelectorAll("[data-audio-cue]")).toHaveLength(23);
    expect((screen.getByTestId("play-audio-combat.hit") as HTMLButtonElement).disabled).toBe(false);
    expect(screen.getByTestId("open-audio-card.draw").getAttribute("href")).toContain(
      "/flesh-and-blood/simulator/tests/dual-target-open",
    );
    expect(screen.queryByTestId("open-audio-resource.steal")).toBeNull();
  });

  test("auditions alternate game-agnostic sound packs", async () => {
    const soundService = await import("../simulator/audio/sound-service.ts");
    render(<AnimationFixturesPage onNavigate={vi.fn()} />);

    await waitFor(() => expect(screen.getByTestId("sound-pack-original")).not.toBeNull());
    fireEvent.click(screen.getByTestId("sound-pack-tabletop"));

    await waitFor(() => {
      expect(soundService.setSimulatorSoundPack).toHaveBeenLastCalledWith("tabletop");
    });
    expect(screen.getByTestId("sound-pack-tabletop").getAttribute("aria-pressed")).toBe("true");
  });
});
