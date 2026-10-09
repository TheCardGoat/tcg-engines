import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { OpeningFixturePage } from "./OpeningFixturePage";
import { alphaClashOpening } from "../../games/alpha-clash/opening-fixture";
import { grandArchiveOpening } from "../../games/grand-archive/opening-fixture";

vi.mock("@tcg/simulator-presentation/canvas", () => ({
  SimulatorEffectCanvas: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@tcg/simulator-presentation/opening/OpeningScene", () => ({
  OpeningScene: ({ beat, onDone }: { beat: { duration?: number }; onDone: () => void }) =>
    beat.duration ? <button onClick={onDone}>Finish animation</button> : null,
}));
vi.mock("@tcg/simulator-presentation/audio/sound-service", () => ({
  initSimulatorSoundService: vi.fn(async () => undefined),
  playSimulatorSound: vi.fn(),
}));

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
  Object.defineProperty(HTMLImageElement.prototype, "decode", {
    configurable: true,
    value: vi.fn(async () => undefined),
  });
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
afterEach(cleanup);
const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
const finish = () => click("Finish animation");

describe("opening decisions", () => {
  it("previews selected mulligan cards and lets the player change or clear the selection", async () => {
    render(<OpeningFixturePage fixture={alphaClashOpening} />);
    await screen.findByRole("button", { name: "Begin opening" });
    fireEvent.click(screen.getByText("Fixture notes"));
    click("Preview selected mulligan");
    expect(screen.getAllByRole("button", { pressed: true })).toHaveLength(2);
    expect(screen.queryByText("MULLIGAN")).toBeNull();
    expect(screen.queryByText("KEEP")).toBeNull();
    expect(screen.getByRole("button", { name: "Replace 2 cards" })).toBeTruthy();
    click("Replace Sonoro");
    expect(screen.getAllByRole("button", { pressed: true })).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Replace 1 card" })).toBeTruthy();
    click("Clear selection");
    expect(screen.queryByText("MULLIGAN")).toBeNull();
    expect(screen.getByRole("button", { name: "Keep hand" })).toBeTruthy();
  });
  it("lets the player choose second, replace two cards once, and reach the opponent resource step", async () => {
    render(<OpeningFixturePage fixture={alphaClashOpening} />);
    await screen.findByRole("button", { name: "Begin opening" });
    click("Begin opening");
    await screen.findByRole("button", { name: "Finish animation" });
    finish();
    finish();
    finish();
    click("Play second");
    finish();
    finish();
    click("Replace Sonoro");
    click("Replace The Avenging Guy");
    expect(
      screen.getByRole("button", { name: "Replace Sonoro" }).getAttribute("aria-pressed"),
    ).toBe("true");
    click("Replace 2 cards");
    expect(screen.queryByRole("button", { name: "Keep hand" })).toBeNull();
    finish();
    finish();
    finish();
    finish();
    expect(screen.getByRole("heading", { name: "Expansion · Resource step" })).toBeTruthy();
    expect(screen.getByText(/Opponent may deploy/)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Inspect Sonoro, the Awakened Breaker" }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Inspect Magnate, Cunning Planner" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Replace/ })).toBeNull();
    click("Restart");
    expect(screen.getByRole("button", { name: "Begin opening" })).toBeTruthy();
  });
  it("Grand Archive reveals Spirits and resolves each draw without offering a mulligan", async () => {
    render(<OpeningFixturePage fixture={grandArchiveOpening} />);
    await screen.findByRole("button", { name: "Begin opening" });
    click("Begin opening");
    await screen.findByRole("button", { name: "Finish animation" });
    finish();
    finish();
    click("You play first · Continue");
    click("Reveal Spirits");
    finish();
    finish();
    finish();
    finish();
    expect(screen.queryByRole("button", { name: /Replace/ })).toBeNull();
    expect(screen.queryByRole("button", { name: "Keep hand" })).toBeNull();
    click("Begin game");
    finish();
    expect(screen.getByRole("heading", { name: "Main phase" })).toBeTruthy();
  });
});
