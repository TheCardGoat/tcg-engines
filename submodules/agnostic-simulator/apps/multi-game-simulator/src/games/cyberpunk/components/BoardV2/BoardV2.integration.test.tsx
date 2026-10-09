// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router";
import type { ReactNode } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import { CardPreviewProvider } from "../CardPreview/CardPreviewContext";
import { UserConfigProvider } from "../../engine";
import { BoardSharedPage } from "../../pages/BoardShared.page";
import { CyberpunkVersionMenuItem, V2_INVITATION_STORAGE_KEY } from "./VersionMenuItem";
import { theme } from "../../theme";

// jsdom validates real input/engine wiring. WebGL is validated in the in-app browser.
vi.mock("./Scene", () => ({ default: () => null }));
vi.mock("../../animation", async () => {
  const actual = await vi.importActual<typeof import("../../animation")>("../../animation");
  return {
    ...actual,
    CyberpunkSharedAnimationLayer: ({ children }: { children: ReactNode }) => children,
    SoundPlayer: () => null,
  };
});
function Location() {
  const location = useLocation();
  return (
    <output data-testid="location">
      {location.search}
      {location.hash}
    </output>
  );
}
beforeEach(() => {
  window.localStorage.clear();
  window.localStorage.setItem("tcg:cyberpunk:payment-selection-discovery:v1", "dismissed");
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
test("V2 plays and resolves a real card; Return to V1 preserves the game and other route options", async () => {
  render(
    <MemoryRouter initialEntries={["/cyberpunk/simulator/tests/openingMain?ui=v2&ai=off"]}>
      <MantineProvider theme={theme} env="test">
        <Notifications />
        <CardPreviewProvider>
          <UserConfigProvider>
            <Location />
            <BoardSharedPage
              scenarioId="openingMain"
              playerIdentities={{
                player: {
                  id: "local",
                  displayName: "Local Runner",
                  subscriptionTier: "tier2",
                  mmrAtMatch: 1250,
                },
                opponent: {
                  id: "rival",
                  displayName: "Rival Runner",
                  subscriptionTier: "tier4",
                  mmrAtMatch: 1600,
                },
              }}
              playerConnections={{
                player: { connected: true },
                opponent: { status: "reconnecting" },
              }}
              initialAi={{ player: null, opponent: null }}
              initialAiMode="step"
            />
          </UserConfigProvider>
        </CardPreviewProvider>
      </MantineProvider>
    </MemoryRouter>,
  );
  // The first render imports the V2 bundle lazily; allow that import on busy runners.
  const board = await screen.findByTestId("cyberpunk-board-v2", undefined, { timeout: 10_000 });
  const fieldLayer = within(board).getByTestId("v2-field-layer");
  const overlayLayer = within(board).getByTestId("v2-overlay-layer");
  const actionLayer = within(board).getByTestId("v2-action-layer");
  expect(within(actionLayer).getByTestId("phase-advance")).toBeTruthy();
  expect(overlayLayer.contains(actionLayer)).toBe(false);
  expect(fieldLayer.querySelector('[data-zone-lane="field"]')).toBeTruthy();
  expect(
    fieldLayer.querySelector(
      '[data-zone-lane="hand"], [data-zone-lane="legendArea"], [data-testid="fixer-zone"], [data-testid="deck-zone"]',
    ),
  ).toBeNull();
  expect(overlayLayer.querySelector('[data-zone-lane="field"]')).toBeNull();
  expect(overlayLayer.querySelectorAll('[data-zone-lane="hand"]').length).toBeGreaterThan(0);
  expect(overlayLayer.querySelectorAll('[data-testid="fixer-zone"]').length).toBe(2);
  expect(overlayLayer.querySelectorAll('[data-testid="deck-zone"]').length).toBe(2);

  expect(within(board).queryByLabelText("Available: Play and Sell")).toBeNull();
  expect(
    board.querySelector('[data-zone="p-hand"][data-interaction-appearance="actionable"]'),
  ).toBeTruthy();
  expect(within(board).getByText("Local Runner")).toBeTruthy();
  expect(within(board).getByText("Rival Runner")).toBeTruthy();
  expect(within(board).getByText("1250 MMR")).toBeTruthy();
  expect(within(board).getByText("1600 MMR")).toBeTruthy();
  expect(within(board).getByText("Connected")).toBeTruthy();
  expect(within(board).getByText("Reconnecting")).toBeTruthy();
  expect(
    within(board).getByRole("button", { name: "Your resources: 7 of 7. Open Eddies." }),
  ).toBeTruthy();
  expect(board.querySelector('[data-sim-zone-id="p-eddieArea"]')).toBeTruthy();
  expect(board.querySelector('[data-sim-zone-id="opp-eddieArea"]')).toBeTruthy();
  fireEvent.click(
    within(board).getByRole("img", { name: "Mox Inciters" }).closest('[data-testid="card"]')!,
  );
  fireEvent.click(await screen.findByRole("menuitem", { name: /Play Pay its current Eddie cost/ }));
  fireEvent.click(await screen.findByRole("button", { name: "Select Minotaur" }));
  await waitFor(() =>
    expect(
      within(board).getByRole("button", { name: "Your resources: 4 of 7. Open Eddies." }),
    ).toBeTruthy(),
  );
  expect(within(board).getByRole("img", { name: /Lag: can't attack this turn/ })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Match" }));
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Match controls" })).getByRole("button", {
      name: "Return to V1",
    }),
  );
  await waitFor(() => expect(screen.queryByTestId("cyberpunk-board-v2")).toBeNull());
  expect(screen.getByTestId("location").textContent).toBe("?ai=off");
  expect(
    within(screen.getByTestId("board-wrap"))
      .getAllByRole("img", { name: "Mox Inciters" })
      .some((image) => image.closest('[data-sim-zone-id="p-field"]')),
  ).toBe(true);
  if (screen.queryByRole("button", { name: "Expand sidebar" }))
    fireEvent.click(screen.getByRole("button", { name: "Expand sidebar" }));
  fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
  expect(await screen.findByRole("group", { name: "Help shape the new board" })).toBeTruthy();
  fireEvent.click(screen.getByRole("menuitem", { name: "Dismiss invitation" }));
  expect(window.localStorage.getItem(V2_INVITATION_STORAGE_KEY)).toBe("dismissed");
  fireEvent.click(screen.getByRole("menuitem", { name: "Try V2 · Beta" }));
  const restored = await screen.findByTestId("cyberpunk-board-v2");
  expect(screen.getByTestId("location").textContent).toBe("?ai=off&ui=v2");
  expect(
    within(restored).getByRole("button", { name: "Your resources: 4 of 7. Open Eddies." }),
  ).toBeTruthy();
  expect(within(restored).getByRole("img", { name: /Lag: can't attack this turn/ })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Match" }));
  if (screen.queryByRole("button", { name: "Expand sidebar" }))
    fireEvent.click(screen.getByRole("button", { name: "Expand sidebar" }));
  fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
  fireEvent.click(screen.getByRole("menuitem", { name: "Return to V1" }));
  await waitFor(() => expect(screen.queryByTestId("cyberpunk-board-v2")).toBeNull());
  if (screen.queryByRole("button", { name: "Expand sidebar" }))
    fireEvent.click(screen.getByRole("button", { name: "Expand sidebar" }));
  fireEvent.click(screen.getByRole("button", { name: "Open your player actions" }));
  expect(screen.queryByRole("group", { name: "Help shape the new board" })).toBeNull();
  expect(screen.getByRole("menuitem", { name: "Try V2 · Beta" })).toBeTruthy();
});

test("invitation can switch views when storage is blocked, preserving other URL options", async () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  render(
    <MemoryRouter initialEntries={["/cyberpunk/simulator/tests/openingMain?ai=off#board"]}>
      <MantineProvider theme={theme} env="test">
        <Location />
        <CyberpunkVersionMenuItem onComplete={() => {}} />
      </MantineProvider>
    </MemoryRouter>,
  );
  fireEvent.click(await screen.findByRole("menuitem", { name: /^Try V2$/ }));
  expect(screen.getByTestId("location").textContent).toBe("?ai=off&ui=v2#board");
  expect(screen.queryByRole("group", { name: "Help shape the new board" })).toBeNull();
  fireEvent.click(screen.getByRole("menuitem", { name: "Return to V1" }));
  expect(screen.getByTestId("location").textContent).toBe("?ai=off#board");
});

test("V2 hand exposes the reduced cost and plays a legal card by click", async () => {
  render(
    <MemoryRouter initialEntries={["/cyberpunk/simulator/tests/unitOctantRetail?ui=v2&ai=off"]}>
      <MantineProvider theme={theme} env="test">
        <Notifications />
        <CardPreviewProvider>
          <UserConfigProvider>
            <BoardSharedPage
              scenarioId="unitOctantRetail"
              initialAi={{ player: null, opponent: null }}
              initialAiMode="step"
            />
          </UserConfigProvider>
        </CardPreviewProvider>
      </MantineProvider>
    </MemoryRouter>,
  );
  const board = await screen.findByTestId("cyberpunk-board-v2");
  const hand = within(board).getByTestId("hand-card");
  const octant = within(hand).getByTestId("card");
  expect(octant.getAttribute("data-interaction-appearance")).toBe("actionable");
  expect(octant.getAttribute("data-draggable")).toBe("true");
  expect(octant.getAttribute("data-zone-index")).toBe("0");
  expect(within(hand).getByLabelText("7 printed cost, 5 current cost")).toBeTruthy();
  fireEvent.click(octant);
  fireEvent.click(await screen.findByRole("menuitem", { name: /Play Pay its current Eddie cost/ }));
  await waitFor(() =>
    expect(
      within(board).getByRole("button", { name: "Your resources: 1 of 6. Open Eddies." }),
    ).toBeTruthy(),
  );
  expect(within(board).queryByTestId("hand-card")).toBeNull();
});

test("V2 hand cards resolve a discard target choice", async () => {
  render(
    <MemoryRouter
      initialEntries={["/cyberpunk/simulator/tests/chooseDiscardFromHand?ui=v2&ai=off"]}
    >
      <MantineProvider theme={theme} env="test">
        <Notifications />
        <CardPreviewProvider>
          <UserConfigProvider>
            <BoardSharedPage
              scenarioId="chooseDiscardFromHand"
              initialAi={{ player: null, opponent: null }}
              initialAiMode="step"
            />
          </UserConfigProvider>
        </CardPreviewProvider>
      </MantineProvider>
    </MemoryRouter>,
  );
  const board = await screen.findByTestId("cyberpunk-board-v2");
  expect(within(board).getByTestId("prompt-banner")).toBeTruthy();
  expect(screen.queryByTestId("choice-modal-sheet")).toBeNull();
  const advance = within(board).getByTestId("phase-advance");
  expect(advance.textContent).toContain("Discard Card");
  expect(advance.hasAttribute("disabled")).toBe(true);
  const handCards = within(board)
    .getAllByTestId("hand-card")
    .filter((card) => card.getAttribute("data-rival") === "false");
  expect(handCards).toHaveLength(3);
  const target = handCards.find((card) =>
    within(card).queryByRole("img", { name: "Corpo Security" }),
  );
  expect(target).toBeTruthy();
  const card = within(target!).getByTestId("card");
  expect(card.getAttribute("data-choice-eligible")).toBe("true");
  fireEvent.click(card);
  await waitFor(() =>
    expect(within(board).getByRole("button", { name: "Your Trash, 1 card" })).toBeTruthy(),
  );
  expect(
    within(board)
      .getAllByTestId("hand-card")
      .filter(
        (item) =>
          item.getAttribute("data-rival") === "false" &&
          within(item).queryByRole("img", { name: "Corpo Security" }),
      ),
  ).toHaveLength(0);
});

test("V2 Gain Gig prompt defers to the highlighted fixer dice", async () => {
  render(
    <MemoryRouter
      initialEntries={["/cyberpunk/simulator/tests/unitEvelynParkerSchemingSiren?ui=v2&ai=off"]}
    >
      <MantineProvider theme={theme} env="test">
        <Notifications />
        <CardPreviewProvider>
          <UserConfigProvider>
            <BoardSharedPage
              scenarioId="unitEvelynParkerSchemingSiren"
              initialAi={{ player: null, opponent: null }}
              initialAiMode="step"
            />
          </UserConfigProvider>
        </CardPreviewProvider>
      </MantineProvider>
    </MemoryRouter>,
  );
  const board = await screen.findByTestId("cyberpunk-board-v2");
  await waitFor(() => expect(within(board).queryAllByTestId(/^prompt-gain-gig-/)).toHaveLength(0));
  expect(within(board).getByTestId("prompt-banner").getAttribute("data-prompt-skin")).toBe("v2");
  const candidateDie = await waitFor(() => {
    const die = board.querySelector<HTMLButtonElement>(
      '[data-testid="fixer-zone"][data-picking="true"] [data-testid="fixer-die"][data-candidate="true"]',
    );
    expect(die).not.toBeNull();
    return die!;
  });
  const gigArea = board.querySelector<HTMLElement>('[data-sim-zone-id="p-gigArea"]');
  expect(gigArea).not.toBeNull();
  const initialGigCount = Number(gigArea?.getAttribute("data-count"));
  fireEvent.click(candidateDie);
  await waitFor(() =>
    expect(gigArea?.getAttribute("data-count")).toBe(String(initialGigCount + 1)),
  );
  expect(within(board).queryAllByTestId(/^prompt-gain-gig-/)).toHaveLength(0);
});

test("V2 crowded hand keeps all thirteen cards on the table and actionable", async () => {
  render(
    <MemoryRouter initialEntries={["/cyberpunk/simulator/tests/handFanOverflow?ui=v2&ai=off"]}>
      <MantineProvider theme={theme} env="test">
        <Notifications />
        <CardPreviewProvider>
          <UserConfigProvider>
            <BoardSharedPage
              scenarioId="handFanOverflow"
              initialAi={{ player: null, opponent: null }}
              initialAiMode="step"
            />
          </UserConfigProvider>
        </CardPreviewProvider>
      </MantineProvider>
    </MemoryRouter>,
  );
  const board = await screen.findByTestId("cyberpunk-board-v2");
  const localHandCards = () =>
    within(board)
      .getAllByTestId("hand-card")
      .filter((card) => card.getAttribute("data-rival") === "false");
  // Hands never page: all thirteen cards are placed at once.
  expect(localHandCards()).toHaveLength(13);
  expect(within(board).queryByRole("button", { name: /hand page/ })).toBeNull();
  const thirteenth = within(localHandCards()[12]!).getByTestId("card");
  expect(thirteenth.getAttribute("data-zone-index")).toBe("12");
  expect(thirteenth.getAttribute("data-draggable")).toBe("true");
  fireEvent.click(thirteenth);
  fireEvent.click(await screen.findByRole("menuitem", { name: /Play Pay its current Eddie cost/ }));
  await waitFor(() =>
    expect(
      within(board).getByRole("button", { name: "Your resources: 8 of 10. Open Eddies." }),
    ).toBeTruthy(),
  );
  expect(localHandCards()).toHaveLength(12);
});

test("V2 anchors direct attacks to the defending Gig area and embeds combat progress in the clock", async () => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      if (this.matches('[data-testid="gig-row"][data-side="player"]')) {
        return new DOMRect(200, 400, 120, 80);
      }
      // Legacy player-info anchors are hidden in V2 and have no visible bounds.
      return new DOMRect(0, 0, 0, 0);
    },
  );
  render(
    <MemoryRouter initialEntries={["/cyberpunk/simulator/tests/reactStep?ui=v2&ai=off"]}>
      <MantineProvider theme={theme} env="test">
        <Notifications />
        <CardPreviewProvider>
          <UserConfigProvider>
            <BoardSharedPage
              scenarioId="reactStep"
              initialAi={{ player: null, opponent: null }}
              initialAiMode="step"
            />
          </UserConfigProvider>
        </CardPreviewProvider>
      </MantineProvider>
    </MemoryRouter>,
  );
  const board = await screen.findByTestId("cyberpunk-board-v2");
  const clock = within(board).getByTestId("phase-clock");
  const steps = within(clock).getByLabelText("Attack step");
  expect(within(clock).getByTestId("phase-turn").textContent).toBe("T2");
  expect(within(clock).getByTestId("priority-side-chip").textContent).toBe("Your priority");
  expect(within(clock).queryByTestId("phase-name")).toBeNull();
  expect(within(clock).queryByTestId("turn-side-chip")).toBeNull();
  expect(steps.textContent).toContain("Steal");
  expect(steps.querySelector('[aria-current="step"]')?.textContent).toBe("React");
  expect(within(board).getAllByLabelText("Attack step")).toHaveLength(1);
  expect(within(within(board).getByTestId("phase-hud")).queryByLabelText("Attack step")).toBeNull();
  await waitFor(() => {
    const arrow = within(board).getByTestId("combat-arrow-overlay");
    expect(arrow.querySelector("polygon")?.getAttribute("points")?.split(" ")[0]).toBe("260,440");
  });
  fireEvent.click(within(board).getByRole("button", { name: "Match" }));
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Match controls" })).getByRole("button", {
      name: "Return to V1",
    }),
  );
  await waitFor(() => expect(screen.queryByTestId("cyberpunk-board-v2")).toBeNull());
  expect(within(screen.getByTestId("phase-clock")).queryByLabelText("Attack step")).toBeNull();
  expect(within(screen.getByTestId("phase-clock")).getByTestId("phase-name").textContent).toBe(
    "MAIN",
  );
  expect(within(screen.getByTestId("phase-clock")).getByTestId("turn-side-chip").textContent).toBe(
    "Rival's turn",
  );
  expect(
    within(within(screen.getByTestId("board-wrap")).getByTestId("phase-hud")).getByLabelText(
      "Attack step",
    ),
  ).toBeTruthy();
});

test("V2 keeps the Gig and first blocker paths when a second blocker redirects the attack", async () => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () => new DOMRect(100, 100, 120, 160),
  );
  render(
    <MemoryRouter initialEntries={["/cyberpunk/simulator/tests/reactStep?ui=v2&ai=off"]}>
      <MantineProvider theme={theme} env="test">
        <Notifications />
        <CardPreviewProvider>
          <UserConfigProvider>
            <BoardSharedPage
              scenarioId="reactStep"
              initialAi={{ player: null, opponent: null }}
              initialAiMode="step"
            />
          </UserConfigProvider>
        </CardPreviewProvider>
      </MantineProvider>
    </MemoryRouter>,
  );
  const board = await screen.findByTestId("cyberpunk-board-v2");
  const securityCard = within(board)
    .getByRole("img", { name: "Corpo Security" })
    .closest('[data-testid="card"]')!;
  const securityId = securityCard.getAttribute("data-card-id");
  fireEvent.click(securityCard);
  await waitFor(() =>
    expect(
      within(board).getByTestId("combat-arrow-overlay").getAttribute("data-redirected-targets"),
    ).toBe("[null]"),
  );

  fireEvent.click(
    within(board).getByRole("img", { name: "Secondhand Bombus" }).closest('[data-testid="card"]')!,
  );
  await waitFor(() => {
    const arrow = within(board).getByTestId("combat-arrow-overlay");
    expect(arrow.getAttribute("data-redirected-targets")).toBe(JSON.stringify([null, securityId]));
    expect(arrow.getAttribute("aria-label")).toContain(
      "2 blockers redirect the attack to Secondhand Bombus",
    );
    expect(
      [
        ...arrow.querySelectorAll('[data-testid="blocker-redirect-preview"] path[data-target-id]'),
      ].map((path) => path.getAttribute("data-target-id")),
    ).toEqual(["gigs", securityId]);
  });
});

test("V2 keeps Floor It staged for target selection, then resolves onto the rival and into Trash", async () => {
  render(
    <MemoryRouter initialEntries={["/cyberpunk/simulator/tests/openingMain?ui=v2&ai=off"]}>
      <MantineProvider theme={theme} env="test">
        <Notifications />
        <CardPreviewProvider>
          <UserConfigProvider>
            <BoardSharedPage
              scenarioId="openingMain"
              initialAi={{ player: null, opponent: null }}
              initialAiMode="step"
            />
          </UserConfigProvider>
        </CardPreviewProvider>
      </MantineProvider>
    </MemoryRouter>,
  );
  const board = await screen.findByTestId("cyberpunk-board-v2");
  fireEvent.click(
    within(board).getByRole("img", { name: "Floor It" }).closest('[data-testid="card"]')!,
  );
  fireEvent.click(await screen.findByRole("menuitem", { name: /Play Pay its current Eddie cost/ }));
  const stage = await screen.findByTestId("resolving-program");
  expect(stage.getAttribute("aria-label")).toContain("Floor It");
  expect(stage.getAttribute("data-resolution-side")).toBe("left");
  // The source controller selects the rail, independent of turn or target chooser.
  fireEvent.click(screen.getByRole("button", { name: "Match" }));
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Match controls" })).getByRole("button", {
      name: "Switch player",
    }),
  );
  await waitFor(() =>
    expect(screen.getByTestId("resolving-program").getAttribute("data-resolution-side")).toBe(
      "right",
    ),
  );
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Match controls" })).getByRole("button", {
      name: "Switch player",
    }),
  );
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Match controls" })).getByRole("button", {
      name: "Close",
    }),
  );
  await waitFor(() =>
    expect(screen.getByTestId("resolving-program").getAttribute("data-resolution-side")).toBe(
      "left",
    ),
  );
  expect(
    within(stage).getByTestId("resolving-program-entity").getAttribute("data-sim-anchor-id"),
  ).toMatch(/^resolving-program:/);
  fireEvent.click(await within(board).findByRole("button", { name: "Select Minotaur" }));
  await waitFor(() => expect(screen.queryByTestId("resolving-program")).toBeNull());
  expect(
    within(
      within(board).getByRole("img", { name: "Minotaur" }).closest('[data-testid="card"]')!,
    ).getByLabelText("9 printed power, 8 current power"),
  ).toBeTruthy();
  expect(
    within(within(board).getByRole("button", { name: "Your Trash, 1 card" })).getByRole("img", {
      name: "Floor It",
    }),
  ).toBeTruthy();
  expect(within(board).getByLabelText("Deck, 35 cards")).toBeTruthy();
});

test("V2 live toggles share V1 state and the drawer keeps match actions", async () => {
  render(
    <MemoryRouter initialEntries={["/cyberpunk/simulator/tests/openingMain?ui=v2&ai=off"]}>
      <MantineProvider theme={theme} env="test">
        <Notifications />
        <CardPreviewProvider>
          <UserConfigProvider>
            <BoardSharedPage
              scenarioId="openingMain"
              initialAi={{ player: null, opponent: null }}
              initialAiMode="step"
            />
          </UserConfigProvider>
        </CardPreviewProvider>
      </MantineProvider>
    </MemoryRouter>,
  );
  await screen.findByTestId("cyberpunk-board-v2");
  const payment = screen.getByRole("button", { name: "Manual payment" });
  const held = screen.getByRole("button", { name: "Hold to react" });
  expect(payment.getAttribute("aria-pressed")).toBe("false");
  fireEvent.click(payment);
  expect(payment.getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(held);
  await waitFor(() => expect(held.getAttribute("aria-pressed")).toBe("true"));
  fireEvent.click(screen.getByRole("button", { name: "Match" }));
  const drawer = screen.getByRole("dialog", { name: "Match controls" });
  expect(within(drawer).getByRole("button", { name: "Concede" })).toBeTruthy();
  expect(within(drawer).getByRole("button", { name: /Board surface:/ })).toBeTruthy();
  expect(within(drawer).getByRole("button", { name: "Return to V1" })).toBeTruthy();
  expect(
    within(drawer)
      .getByRole("button", { name: "Manual payment enabled" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
  fireEvent.click(within(drawer).getByRole("button", { name: "Hold combat priority" }));
  fireEvent.click(within(drawer).getByRole("button", { name: "Close" }));
  await waitFor(() => expect(held.getAttribute("aria-pressed")).toBe("false"));
  fireEvent.click(screen.getByRole("button", { name: "Match" }));
  fireEvent.click(
    within(screen.getByRole("dialog", { name: "Match controls" })).getByRole("button", {
      name: "Return to V1",
    }),
  );
  await waitFor(() => expect(screen.queryByTestId("cyberpunk-board-v2")).toBeNull());
  expect(
    screen.getByRole("button", { name: "Manual payment enabled" }).getAttribute("aria-pressed"),
  ).toBe("true");
});

test("V2 right-click on empty board space opens the same board menu as V1", async () => {
  render(
    <MemoryRouter initialEntries={["/cyberpunk/simulator/tests/openingMain?ui=v2&ai=off"]}>
      <MantineProvider theme={theme} env="test">
        <Notifications />
        <CardPreviewProvider>
          <UserConfigProvider>
            <BoardSharedPage
              scenarioId="openingMain"
              initialAi={{ player: null, opponent: null }}
              initialAiMode="step"
            />
          </UserConfigProvider>
        </CardPreviewProvider>
      </MantineProvider>
    </MemoryRouter>,
  );
  const board = await screen.findByTestId("cyberpunk-board-v2");
  fireEvent.contextMenu(board, { button: 2, clientX: 400, clientY: 300 });
  const menu = await screen.findByTestId("board-context-menu");
  expect(menu.querySelector("[data-testid$='-board-correction']")).toBeTruthy();
  const pass = within(menu).getByTestId("board-action-pass-phase");
  expect(pass.textContent).toMatch(/^Pass .+ phase$/);
  expect(pass.hasAttribute("disabled")).toBe(false);
  expect(within(menu).getByTestId("board-action-undo")).toBeTruthy();
  expect(within(menu).getByTestId("board-action-undo-turn-start")).toBeTruthy();
  expect(within(menu).getByTestId("board-action-concede").hasAttribute("disabled")).toBe(false);
  expect(within(menu).getByTestId("board-action-shortcuts")).toBeTruthy();

  // Right-clicking a card keeps the card's own handling; the board menu stays shut.
  fireEvent.keyDown(window, { key: "Escape" });
  await waitFor(() => expect(screen.queryByTestId("board-context-menu")).toBeNull());
  const cardEntity = board.querySelector('[data-testid="hand-card"] [data-sim-entity-id]');
  expect(cardEntity).toBeTruthy();
  fireEvent.contextMenu(cardEntity!, { button: 2 });
  expect(screen.queryByTestId("board-context-menu")).toBeNull();

  // Concede asks for confirmation and cancelling keeps the game running.
  fireEvent.contextMenu(board, { button: 2, clientX: 500, clientY: 320 });
  fireEvent.click(await screen.findByTestId("board-action-concede"));
  expect(await screen.findByText("Concede match?")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Keep playing" }));
  await waitFor(() => expect(screen.queryByText("Concede match?")).toBeNull());
  expect(screen.queryByTestId("cyberpunk-board-v2")).toBeTruthy();
});
