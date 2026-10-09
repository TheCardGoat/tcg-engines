// @vitest-environment jsdom

import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import { CardPreviewProvider } from "../components/CardPreview/CardPreviewContext";
import {
  firstGameTutorialMessages,
  tutorialLocales,
} from "../components/FirstGameTutorial/firstGameTutorialMessages";
import { UserConfigProvider } from "../engine";
import { theme } from "../theme";
import { FirstGameTutorialPage } from "./FirstGameTutorial.page";

vi.mock("../animation", async () => {
  const actual = await vi.importActual<typeof import("../animation")>("../animation");
  return {
    ...actual,
    CyberpunkSharedAnimationLayer: ({ children }: { children: ReactNode }) => children,
    SoundPlayer: () => null,
  };
});

// The V2 board is lazy-loaded for routed ?ui=v2 renders; WebGL is not under test here.
vi.mock("../components/BoardV2/Scene", () => ({ default: () => null }));

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState({}, "", "/cyberpunk/simulator/tutorial");
});

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

function renderGuide() {
  return render(
    <MantineProvider theme={theme} env="test">
      <CardPreviewProvider>
        <UserConfigProvider>
          <FirstGameTutorialPage />
        </UserConfigProvider>
      </CardPreviewProvider>
    </MantineProvider>,
  );
}

test("the practice task waits for an action and can be skipped", () => {
  renderGuide();
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  const next = screen.getByRole("button", { name: "Next" });
  expect(next).toHaveProperty("disabled", true);
  fireEvent.click(screen.getByRole("button", { name: "Skip guide" }));
  expect(screen.getByRole("link", { name: "Back to lobby" })).toBeTruthy();
  expect(window.localStorage.getItem("tcg:cyberpunk:first-game-tutorial:v1")).toBe("dismissed");
});

test("the guided game runs on the V2 board when ?ui=v2", async () => {
  window.history.replaceState({}, "", "/cyberpunk/simulator/tutorial?ui=v2");
  render(
    <MantineProvider theme={theme} env="test">
      <CardPreviewProvider>
        <UserConfigProvider>
          <MemoryRouter initialEntries={["/cyberpunk/simulator/tutorial?ui=v2"]}>
            <FirstGameTutorialPage />
          </MemoryRouter>
        </UserConfigProvider>
      </CardPreviewProvider>
    </MantineProvider>,
  );

  expect(await screen.findByTestId("cyberpunk-board-v2")).toBeTruthy();
  expect(screen.getByTestId("first-game-tutorial").getAttribute("data-step")).toBe("cards");
  expect(screen.getByText("The new board")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Skip guide" }));
  expect(window.localStorage.getItem("tcg:cyberpunk:first-game-tutorial:board-v2")).toBe(
    "dismissed",
  );
  expect(window.localStorage.getItem("tcg:cyberpunk:first-game-tutorial:v1")).toBeNull();
});

test("payment requires turning manual payment on and off during this lesson", async () => {
  window.localStorage.setItem(
    "cyberpunk:userConfig",
    JSON.stringify({ choosePaymentSources: true }),
  );
  window.history.replaceState({}, "", "/cyberpunk/simulator/tutorial?step=payment");
  renderGuide();

  const next = screen.getByRole("button", { name: "Next" });
  expect(next).toHaveProperty("disabled", true);
  fireEvent.click(screen.getByRole("button", { name: "Manual payment enabled" }));
  expect(next).toHaveProperty("disabled", true);
  fireEvent.click(screen.getByRole("button", { name: "Choose payment for every cost" }));
  expect(next).toHaveProperty("disabled", true);
  fireEvent.click(screen.getByRole("button", { name: "Manual payment enabled" }));
  await waitFor(() => expect(next).toHaveProperty("disabled", false));
});

test("passing the block step completes the task", async () => {
  window.history.replaceState({}, "", "/cyberpunk/simulator/tutorial?step=block");
  renderGuide();

  const next = screen.getByRole("button", { name: "Next" });
  expect(next).toHaveProperty("disabled", true);
  fireEvent.click(screen.getAllByRole("button", { name: "Skip block" })[0]);
  fireEvent.click(screen.getAllByRole("button", { name: "Are you sure?" })[0]);
  await waitFor(() => expect(next).toHaveProperty("disabled", false));
});

test("settings, report, and priority deep links still open those lessons", () => {
  for (const [step, title] of [
    ["settings", "Change your game settings"],
    ["report", "Report a player"],
    ["priority", "Keep time to respond"],
  ] as const) {
    cleanup();
    window.history.replaceState({}, "", `/cyberpunk/simulator/tutorial?step=${step}`);
    renderGuide();
    expect(screen.getByRole("heading", { name: title })).toBeTruthy();
    expect(screen.getByTestId("first-game-tutorial").getAttribute("data-step")).toBe(step);
  }
}, 60_000);

function renderStep(step: string) {
  cleanup();
  window.history.replaceState({}, "", `/cyberpunk/simulator/tutorial?step=${step}`);
  renderGuide();
}

test("failure, board correction, and undo steps render in English", () => {
  renderStep("bug");
  expect(screen.getByRole("heading", { name: "The game can fail" })).toBeTruthy();
  const bugDesktop = screen.getByTestId("first-game-desktop").textContent ?? "";
  const bugMobile = screen.getByTestId("first-game-mobile").textContent ?? "";
  expect(bugDesktop).not.toBe(bugMobile);
  expect(bugDesktop).toContain("The game can fail");
  expect(bugDesktop).toContain("Report bug");
  expect(bugDesktop).toContain("separate from Report player");
  expect(bugMobile).toContain("Report bug");
  expect(bugMobile).toContain("bottom left");
  expect(screen.getByRole("button", { name: "Next" })).toHaveProperty("disabled", false);

  renderStep("correction");
  expect(screen.getByRole("heading", { name: "Correct the board" })).toBeTruthy();
  const correctionDesktop = screen.getByTestId("first-game-desktop").textContent ?? "";
  const correctionMobile = screen.getByTestId("first-game-mobile").textContent ?? "";
  const correction = `${correctionDesktop} ${correctionMobile}`;
  expect(correctionDesktop).not.toBe(correctionMobile);
  expect(correction).toContain("Enable Board State Correction");
  expect(correction).toContain("Request Board State Correction");
  expect(correction).toContain("Exit");
  expect(correctionDesktop).toMatch(
    /local practice[\s\S]*Enable Board State Correction[\s\S]*hosted match against a bot[\s\S]*Request Board State Correction/,
  );
  expect(correctionDesktop).toContain("without a person accepting");
  expect(correction).toContain("after it is accepted");
  expect(correction).toContain("attached gear");
  expect(correction).toContain("deck");
  expect(correction).toContain("trash");
  expect(correction).toContain("Gigs");
  expect(correction).toContain("Eddies");
  expect(correctionDesktop).toContain("menu beside your name");
  expect(correctionMobile).toMatch(/More[\s\S]*Details[\s\S]*Enable Board State Correction/);
  const hostedBotClause = correctionMobile.slice(
    correctionMobile.indexOf("hosted match against a bot"),
    correctionMobile.indexOf("Against a human"),
  );
  expect(hostedBotClause).toMatch(/More[\s\S]*Details[\s\S]*Request Board State Correction/);
  expect(hostedBotClause).not.toContain("your name");
  expect(correctionMobile).toMatch(/Against a human, tap your name at the bottom left/);

  renderStep("undo");
  expect(screen.getByRole("heading", { name: "Undo a move" })).toBeTruthy();
  const undoDesktop = screen.getByTestId("first-game-desktop").textContent ?? "";
  const undoMobile = screen.getByTestId("first-game-mobile").textContent ?? "";
  expect(undoDesktop).not.toBe(undoMobile);
  expect(undoDesktop).toContain("Undo last move");
  expect(undoDesktop).toContain("Undo to turn start");
  expect(undoMobile).toContain("Undo last move");
  expect(undoMobile).toContain("Undo to turn start");
  expect(undoDesktop).toContain("ranked live match");
  expect(undoDesktop).toContain("without asking");
  const undoBotClause = undoMobile.slice(
    undoMobile.indexOf("hosted match against a bot"),
    undoMobile.indexOf("Against a human"),
  );
  expect(undoBotClause).toMatch(/More[\s\S]*Details[\s\S]*Undo to turn start/);
  expect(undoBotClause).not.toContain("your name");
  expect(undoMobile).toMatch(/Against a human, tap your name at the bottom left/);
  expect(screen.getByRole("button", { name: "Finish guide" })).toHaveProperty("disabled", false);
}, 60_000);

test("finishing the undo lesson stores completion", () => {
  window.history.replaceState({}, "", "/cyberpunk/simulator/tutorial?step=undo");
  renderGuide();
  fireEvent.click(screen.getByRole("button", { name: "Finish guide" }));
  expect(window.localStorage.getItem("tcg:cyberpunk:first-game-tutorial:v1")).toBe("completed");
  expect(screen.getByRole("link", { name: "Back to lobby" })).toBeTruthy();
});

test("every locale has distinct desktop and mobile copy for failure, correction, and undo", () => {
  const recoverySteps = ["bug", "correction", "undo"] as const;
  for (const locale of tutorialLocales) {
    const copy = firstGameTutorialMessages[locale];
    for (const stepId of recoverySteps) {
      const step = copy.steps[stepId];
      expect(step.title.length).toBeGreaterThan(0);
      expect(step.desktop.length).toBeGreaterThan(0);
      expect(step.mobile.length).toBeGreaterThan(0);
      expect(step.desktop).not.toBe(step.mobile);
    }
    expect(copy.steps.bug.desktop).toContain("Report bug");
    expect(copy.steps.bug.mobile).toContain("Report bug");
    expect(copy.steps.correction.desktop).toContain("Enable Board State Correction");
    expect(copy.steps.correction.desktop).toContain("Request Board State Correction");
    expect(copy.steps.correction.mobile).toContain("Enable Board State Correction");
    expect(copy.steps.correction.mobile).toContain("Request Board State Correction");
    expect(copy.steps.correction.mobile).toContain("Details");
    expect(copy.steps.correction.mobile).toContain("Exit");
    const correctionRequestAt = copy.steps.correction.mobile.indexOf(
      "Request Board State Correction",
    );
    const correctionBeforeRequest = copy.steps.correction.mobile.slice(0, correctionRequestAt);
    expect(correctionBeforeRequest).toContain("More");
    expect(correctionBeforeRequest).toContain("Details");
    expect(correctionBeforeRequest).not.toMatch(/\b(name|nom|Namen|nombre|nome)\b/);
    expect(copy.steps.undo.desktop).toContain("Undo last move");
    expect(copy.steps.undo.desktop).toContain("Undo to turn start");
    expect(copy.steps.undo.mobile).toContain("Details");
    expect(copy.steps.undo.mobile).toContain("Undo to turn start");
    const undoTurnAt = copy.steps.undo.mobile.indexOf("Undo to turn start");
    const undoBeforeTurn = copy.steps.undo.mobile.slice(0, undoTurnAt);
    expect(undoBeforeTurn).toContain("More");
    expect(undoBeforeTurn).toContain("Details");
    expect(undoBeforeTurn).not.toMatch(/\b(name|nom|Namen|nombre|nome)\b/);
  }
});
