// @vitest-environment jsdom

import { HeadlessMantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router";
import { MemoryRouter } from "react-router-dom";

import FabFirstGameTutorialRoute from "../../routes/fab-first-game-tutorial";

import { installBrowserShims } from "../../testing/browser-shims";
import { FleshAndBloodSimulatorProviders } from "./App";
import { FabPresentationTestProvider } from "./presentation-test-provider";
import { FabFirstGameEntry } from "./first-game/FabFirstGameGuide";
import { FabFirstGameTutorialPage } from "./first-game/FabFirstGameTutorial.page";
import { fabFirstGameMessages, fabGuideStepIds, tutorialLocales } from "./first-game/messages";
import {
  FAB_FIRST_GAME_TUTORIAL_ENABLED,
  FAB_FIRST_GAME_TUTORIAL_STORAGE_KEY,
} from "./first-game/storage";
import { fabGuideTargetSelector } from "./first-game/targets";

beforeEach(() => {
  installBrowserShims();
  window.localStorage.clear();
  window.innerWidth = 1280;
  window.innerHeight = 900;
  window.history.replaceState({}, "", "/flesh-and-blood/simulator/tutorial");
});

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

function renderGuide() {
  return render(
    <HeadlessMantineProvider>
      <MemoryRouter>
        <FabPresentationTestProvider>
          <FleshAndBloodSimulatorProviders>
            <FabFirstGameTutorialPage />
          </FleshAndBloodSimulatorProviders>
        </FabPresentationTestProvider>
      </MemoryRouter>
    </HeadlessMantineProvider>,
  );
}

test("guide steps name distinct desktop and mobile controls and highlight the hand", async () => {
  renderGuide();

  expect(screen.getByRole("heading", { name: "Move and play cards" })).toBeTruthy();
  const desktop = screen.getByTestId("fab-first-game-desktop").textContent ?? "";
  const mobile = screen.getByTestId("fab-first-game-mobile").textContent ?? "";
  expect(desktop).not.toBe(mobile);
  expect(desktop).toContain("Click");
  expect(mobile).toContain("Tap");

  for (const step of fabGuideStepIds) {
    expect(document.querySelector(fabGuideTargetSelector(step, false))).toBeTruthy();
  }

  const hand = document.querySelector<HTMLElement>('[data-testid="fab-hand-bottom"]');
  expect(hand).toBeTruthy();
  const handRect = DOMRect.fromRect({ x: 48, y: 420, width: 280, height: 96 });
  const rectSpy = vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: HTMLElement) {
      return this === hand ? handRect : DOMRect.fromRect({ x: 0, y: 0, width: 0, height: 0 });
    });
  try {
    window.dispatchEvent(new Event("resize"));
    const spotlight = await waitFor(() => screen.getByTestId("fab-first-game-spotlight"));
    const left = Number.parseFloat(spotlight.style.left);
    const top = Number.parseFloat(spotlight.style.top);
    const width = Number.parseFloat(spotlight.style.width);
    const height = Number.parseFloat(spotlight.style.height);
    expect(left).toBeLessThanOrEqual(handRect.left);
    expect(top).toBeLessThanOrEqual(handRect.top);
    expect(left + width).toBeGreaterThanOrEqual(handRect.right);
    expect(top + height).toBeGreaterThanOrEqual(handRect.bottom);
  } finally {
    rectSpy.mockRestore();
  }

  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.getByRole("heading", { name: "Attack" })).toBeTruthy();
  expect(screen.getByTestId("fab-first-game-desktop").textContent).not.toBe(
    screen.getByTestId("fab-first-game-mobile").textContent,
  );
  fireEvent.click(screen.getByRole("button", { name: "Back" }));
  expect(screen.getByRole("heading", { name: "Move and play cards" })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Skip guide" }));
  expect(window.localStorage.getItem(FAB_FIRST_GAME_TUTORIAL_STORAGE_KEY)).toBe("dismissed");
  expect(screen.queryByRole("heading", { name: "Move and play cards" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Show first-game guide" }));
  expect(screen.getByRole("heading", { name: "Move and play cards" })).toBeTruthy();
}, 30_000);

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

function readStyleBox(element: HTMLElement): Box {
  return {
    top: Number.parseFloat(element.style.top),
    left: Number.parseFloat(element.style.left),
    width: Number.parseFloat(element.style.width),
    height: Number.parseFloat(element.style.height),
  };
}

function boxesOverlap(first: Box, second: Box): boolean {
  return (
    first.left < second.left + second.width &&
    first.left + first.width > second.left &&
    first.top < second.top + second.height &&
    first.top + first.height > second.top
  );
}

async function expectHighlightOnControl(title: string, control: DOMRect) {
  expect(screen.getByRole("heading", { name: title })).toBeTruthy();
  await waitFor(() => {
    const spotlight = readStyleBox(screen.getByTestId("fab-first-game-spotlight"));
    const guide = readStyleBox(screen.getByTestId("fab-first-game-guide"));
    expect(spotlight.width).toBeGreaterThan(0);
    expect(spotlight.height).toBeGreaterThan(0);
    expect(spotlight.left).toBeLessThanOrEqual(control.left);
    expect(spotlight.top).toBeLessThanOrEqual(control.top);
    expect(spotlight.left + spotlight.width).toBeGreaterThanOrEqual(control.right);
    expect(spotlight.top + spotlight.height).toBeGreaterThanOrEqual(control.bottom);
    expect(guide.width).toBeGreaterThan(0);
    expect(guide.height).toBeGreaterThan(0);
    expect(boxesOverlap(spotlight, guide)).toBe(false);
  });
}

test("mobile settings, report, and priority highlights cover those controls", async () => {
  window.innerWidth = 390;
  window.innerHeight = 844;
  const originalMatchMedia = window.matchMedia.bind(window);
  window.matchMedia = ((query: string) => ({
    matches: query.includes("max-width") && window.innerWidth <= 767,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  })) as typeof window.matchMedia;
  window.history.replaceState({}, "", "/flesh-and-blood/simulator/tutorial?step=settings");
  const rectSpy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect");
  try {
    renderGuide();
    await waitFor(() => {
      expect(document.querySelector('[data-fab-layout="mobile"]')).toBeTruthy();
      expect(document.querySelector('[aria-label="Open match menu"]')).toBeTruthy();
      expect(document.querySelector('[data-testid="fab-opponent-rail"]')).toBeTruthy();
    });

    const menu = document.querySelector<HTMLElement>('[aria-label="Open match menu"]');
    const rail = document.querySelector<HTMLElement>('[data-testid="fab-opponent-rail"]');
    expect(menu).toBeTruthy();
    expect(rail).toBeTruthy();
    const menuRect = DOMRect.fromRect({ x: 8, y: 800, width: 44, height: 44 });
    const railRect = DOMRect.fromRect({ x: 0, y: 0, width: 390, height: 48 });
    rectSpy.mockImplementation(function (this: HTMLElement) {
      if (this.getAttribute("aria-label") === "Open match menu") return menuRect;
      if (this.getAttribute("data-testid") === "fab-opponent-rail") return railRect;
      return DOMRect.fromRect({ x: 0, y: 0, width: 0, height: 0 });
    });
    window.dispatchEvent(new Event("resize"));

    await expectHighlightOnControl("Change game settings", menuRect);
    expect(screen.getByTestId("fab-first-game-mobile").textContent).toContain("Open match menu");

    fireEvent.click(
      within(screen.getByTestId("fab-first-game-guide")).getByRole("button", { name: "Next" }),
    );
    await expectHighlightOnControl("Report a player", railRect);

    fireEvent.click(
      within(screen.getByTestId("fab-first-game-guide")).getByRole("button", { name: "Next" }),
    );
    await expectHighlightOnControl("Hold priority", menuRect);
    expect(screen.getByTestId("fab-first-game-mobile").textContent).toContain("Open match menu");
  } finally {
    rectSpy.mockRestore();
    window.matchMedia = originalMatchMedia;
  }
}, 30_000);

test("priority deep link still opens that lesson, and finishing the last step stores completion", () => {
  window.history.replaceState({}, "", "/flesh-and-blood/simulator/tutorial?step=report");
  const report = renderGuide();
  expect(screen.getByRole("heading", { name: "Report a player" })).toBeTruthy();
  expect(screen.getByTestId("fab-first-game-tutorial").getAttribute("data-step")).toBe("report");
  report.unmount();

  window.localStorage.setItem(FAB_FIRST_GAME_TUTORIAL_STORAGE_KEY, "dismissed");
  window.history.replaceState({}, "", "/flesh-and-blood/simulator/tutorial?step=priority");
  renderGuide();

  expect(screen.getByRole("heading", { name: "Hold priority" })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.getByRole("heading", { name: "The game can fail" })).toBeTruthy();
  const bugDesktop = screen.getByTestId("fab-first-game-desktop").textContent ?? "";
  const bugMobile = screen.getByTestId("fab-first-game-mobile").textContent ?? "";
  expect(bugDesktop).toContain("The game can fail");
  expect(bugDesktop).toContain("Report bug");
  expect(bugDesktop).toContain("separate from Report player");
  expect(bugMobile).toContain("Report bug");
  expect(bugMobile).toContain("Open match menu");
  expect(bugDesktop).not.toBe(bugMobile);

  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.getByRole("heading", { name: "Correct the board" })).toBeTruthy();
  const correctionDesktop = screen.getByTestId("fab-first-game-desktop").textContent ?? "";
  const correctionMobile = screen.getByTestId("fab-first-game-mobile").textContent ?? "";
  const correction = `${correctionDesktop} ${correctionMobile}`;
  expect(correctionDesktop).toContain("local practice");
  expect(correctionDesktop).toContain("without a person accepting");
  expect(correctionDesktop).toContain("after it is accepted");
  expect(correctionMobile).toContain("from this layout");
  expect(correction).not.toContain("Enable Board State Correction");
  expect(correction).not.toContain("Request Board State Correction");
  expect(correction).not.toContain("Exit Board State Correction");
  expect(correctionDesktop).not.toBe(correctionMobile);

  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.getByRole("heading", { name: "Undo an action" })).toBeTruthy();
  const undoDesktop = screen.getByTestId("fab-first-game-desktop").textContent ?? "";
  const undoMobile = screen.getByTestId("fab-first-game-mobile").textContent ?? "";
  expect(undoDesktop).toContain("Choose Undo to put back");
  expect(undoDesktop).toContain("Undo turn");
  expect(undoDesktop).toContain("ranked live match");
  expect(undoDesktop).toContain("without asking");
  expect(undoMobile).toContain("Undo turn");
  expect(undoMobile).toContain("match menu");
  expect(undoDesktop).not.toBe(undoMobile);

  fireEvent.click(screen.getByRole("button", { name: "Finish guide" }));
  expect(window.localStorage.getItem(FAB_FIRST_GAME_TUTORIAL_STORAGE_KEY)).toBe("completed");
  fireEvent.click(screen.getByRole("button", { name: "Show first-game guide" }));
  expect(screen.getByRole("heading", { name: "Move and play cards" })).toBeTruthy();
}, 30_000);

test("practice entry stays hidden after skip until the player chooses replay", () => {
  render(
    <MemoryRouter>
      <FabFirstGameEntry surface="setup" />
    </MemoryRouter>,
  );

  if (!FAB_FIRST_GAME_TUTORIAL_ENABLED) {
    expect(screen.queryByTestId("fab-first-game-invitation")).toBeNull();
    expect(screen.queryByTestId("fab-first-game-replay")).toBeNull();
    return;
  }

  expect(screen.getByTestId("fab-first-game-invitation")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Skip guide" }));
  expect(screen.queryByTestId("fab-first-game-invitation")).toBeNull();
  expect(window.localStorage.getItem(FAB_FIRST_GAME_TUTORIAL_STORAGE_KEY)).toBe("dismissed");
  expect(screen.getByTestId("fab-first-game-replay").getAttribute("href")).toBe(
    "/flesh-and-blood/simulator/tutorial",
  );
});

test("tutorial route sends bookmarks to the hub while the guide is disabled", async () => {
  const router = createMemoryRouter(
    [
      {
        path: "/flesh-and-blood/simulator/tutorial",
        element: <FabFirstGameTutorialRoute />,
      },
      {
        path: "/flesh-and-blood/simulator",
        element: <p>Flesh and Blood simulator</p>,
      },
    ],
    { initialEntries: ["/flesh-and-blood/simulator/tutorial"] },
  );
  render(<RouterProvider router={router} />);

  if (!FAB_FIRST_GAME_TUTORIAL_ENABLED) {
    expect(await screen.findByText("Flesh and Blood simulator")).toBeTruthy();
    expect(router.state.location.pathname).toBe("/flesh-and-blood/simulator");
    expect(screen.queryByTestId("fab-first-game-tutorial")).toBeNull();
  } else {
    expect(await screen.findByTestId("fab-first-game-tutorial")).toBeTruthy();
    expect(router.state.location.pathname).toBe("/flesh-and-blood/simulator/tutorial");
  }

  router.dispose();
});

test("every locale has distinct desktop and mobile guide copy", () => {
  const forbidden = [
    "Enable Board State Correction",
    "Request Board State Correction",
    "Exit Board State Correction",
  ];
  for (const locale of tutorialLocales) {
    const copy = fabFirstGameMessages[locale];
    expect(copy.label.length).toBeGreaterThan(0);
    expect(copy.invitation.toLowerCase()).not.toContain("eddie");
    expect(copy.steps.pitch.desktop.toLowerCase()).toContain("pitch");
    for (const stepId of fabGuideStepIds) {
      const step = copy.steps[stepId];
      expect(step.desktop.length).toBeGreaterThan(0);
      expect(step.mobile.length).toBeGreaterThan(0);
      expect(step.desktop).not.toBe(step.mobile);
      expect(step.title.length).toBeGreaterThan(0);
      const text = `${step.title}\n${step.desktop}\n${step.mobile}`;
      for (const label of forbidden) expect(text).not.toContain(label);
    }
    expect(copy.steps.bug.desktop).toContain("Report bug");
    expect(copy.steps.bug.mobile).toContain("Report bug");
    expect(copy.steps.undo.desktop).toContain("Undo turn");
    expect(copy.steps.undo.mobile).toContain("Undo turn");
    expect(copy.steps.correction.desktop.toLowerCase()).toContain("bot");
    expect(copy.steps.correction.mobile.toLowerCase()).toContain("bot");
  }
});
