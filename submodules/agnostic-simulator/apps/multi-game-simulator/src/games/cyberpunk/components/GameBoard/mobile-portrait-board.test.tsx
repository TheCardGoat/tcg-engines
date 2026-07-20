// @vitest-environment jsdom

import { fireEvent, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { renderCyberpunkSimulatorScenario } from "../../testing/render-cyberpunk-simulator";

describe("Cyberpunk mobile portrait board", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("renders the mirror ledger and keeps zone inventory behind the Zones popover", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendQaPromosAndV",
      layout: "mobile",
    });

    try {
      const board = await waitFor(() =>
        requiredElement<HTMLElement>(view.container, '[data-testid="mobile-cyberpunk-board"]'),
      );
      const ledger = requiredElement<HTMLElement>(
        board,
        '[aria-label="Mobile Legends, Street Cred, and Gig dice"]',
      );
      expect(ledger.dataset.hasCenter).toBe("false");
      expect(ledger.textContent).not.toContain("Priority");

      const fieldCardRows = board.querySelectorAll<HTMLElement>('[data-testid="field-cards"]');
      expect(fieldCardRows).toHaveLength(2);
      for (const fieldCards of fieldCardRows) {
        expect(fieldCards.dataset.scrollAxis).toBe("horizontal");
      }

      const battlefieldLanes = Array.from(
        board.querySelectorAll<HTMLElement>("[data-scroll-axis]"),
      ).filter((lane) => lane.getAttribute("data-testid") !== "field-cards");
      expect(battlefieldLanes.map((lane) => lane.dataset.scrollAxis)).toEqual([
        "horizontal",
        "horizontal",
      ]);

      const legendSlots = ledger.querySelectorAll<HTMLElement>('[data-testid="legend-slot"]');
      expect(legendSlots).toHaveLength(6);
      expect(Array.from(legendSlots).some((slot) => slot.dataset.occupied === "true")).toBe(true);
      expect(
        Array.from(legendSlots).every(
          (slot) => slot.dataset.occupied === "true" || slot.dataset.occupied === "false",
        ),
      ).toBe(true);

      const gigRows = ledger.querySelectorAll<HTMLElement>('[data-testid="gig-row"]');
      expect(gigRows).toHaveLength(2);
      expect(
        Array.from(gigRows)
          .map((row) => row.dataset.streetCred)
          .sort((left, right) => String(left).localeCompare(String(right))),
      ).toEqual(["2", "3"]);
      expect(ledger.textContent).toContain("SC");

      expect(
        requiredElement<HTMLElement>(board, '[data-drop-zone="opp-pinfo"]')?.dataset.dropSurface,
      ).toBe("rival-gigs");

      const gigDice = ledger.querySelectorAll<HTMLElement>('[data-testid="gig-die"]');
      expect(gigDice.length).toBeGreaterThan(0);
      for (const die of gigDice) {
        expect(die.dataset.dieId).toBeTruthy();
        expect(die.dataset.face).toMatch(/^\d+$/);
      }

      expect(board.querySelector('[data-testid="deck-zone"]')).toBeNull();
      expect(board.querySelector('[data-testid="trash-zone"]')).toBeNull();
      expect(board.querySelector('[data-testid="fixer-zone"]')).toBeNull();
      expect(board.querySelector('[data-testid="eddies-zone"]')).toBeNull();

      const zoneSummary = requiredElement<HTMLElement>(
        board,
        '[data-testid="player-zone-summary-bar"]',
      );
      expect(
        Array.from(
          zoneSummary.querySelectorAll<HTMLElement>('[data-testid="zone-summary-fixer-die"]'),
        ).map((die) => die.dataset.dieType),
      ).toEqual(["d20", "d12", "d10", "d8", "d6"]);
      const zoneButton = requiredElement<HTMLButtonElement>(zoneSummary, "button");
      fireEvent.click(zoneButton);

      await waitFor(() => requiredElement<HTMLElement>(board, '[data-testid="deck-zone"]'));
      expect(requiredElement<HTMLElement>(board, '[data-testid="trash-zone"]')).not.toBeNull();
      expect(requiredElement<HTMLElement>(board, '[data-testid="fixer-zone"]')).not.toBeNull();
      expect(requiredElement<HTMLElement>(board, '[data-testid="eddies-zone"]')).not.toBeNull();
    } finally {
      view.unmount();
    }
  });

  test("uses the readable stacked ledger for two Legends", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "mobileLedgerTwoLegends",
      layout: "mobile",
    });

    try {
      const ledger = await waitFor(() =>
        requiredElement<HTMLElement>(
          view.container,
          '[aria-label="Mobile Legends, Street Cred, and Gig dice"]',
        ),
      );
      const sides = ledger.querySelectorAll<HTMLElement>('[data-side-layout="stacked"]');
      expect(sides).toHaveLength(2);

      for (const side of sides) {
        expect(side.querySelector('[data-sim-anchor-id$="street-cred"]')).toBeTruthy();
        expect(side.querySelector('[data-testid="gig-row"]')).toBeTruthy();
      }
    } finally {
      view.unmount();
    }
  });

  test("reserves attached-gear space from the field card width, not the field width", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "progCyberpsychosis",
      layout: "mobile",
    });

    try {
      const equippedUnit = await waitFor(() =>
        requiredElement<HTMLElement>(
          view.container,
          '[data-testid="field-unit"][data-gear-count="2"]',
        ),
      );

      expect(equippedUnit.style.getPropertyValue("--attached-gear-count")).toBe("2");
      expect(equippedUnit.style.getPropertyValue("--attached-gear-space")).toBe("");
    } finally {
      view.unmount();
    }
  });

  test("keeps practice sidebar AI tools available from the mobile top rail", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "gameStart",
      layout: "mobile",
    });

    try {
      const board = await waitFor(() =>
        requiredElement<HTMLElement>(view.container, '[data-testid="mobile-cyberpunk-board"]'),
      );
      fireEvent.click(requiredElement<HTMLButtonElement>(board, '[aria-label="Open AI controls"]'));

      await waitFor(() => requiredElement<HTMLElement>(document.body, '[data-testid="ai-tools"]'));
      expect(
        requiredElement<HTMLButtonElement>(document.body, '[data-testid="ai-log-snapshot"]'),
      ).toBeTruthy();
      expect(
        requiredElement<HTMLButtonElement>(document.body, '[data-testid="ai-log-clear"]'),
      ).toBeTruthy();
      expect(
        requiredElement<HTMLButtonElement>(document.body, '[data-testid="ai-reset-scenario"]'),
      ).toBeTruthy();
    } finally {
      view.unmount();
    }
  });

  test("exposes live match player actions from the mobile top rail", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();
    const fetchCalls: Array<{ input: RequestInfo | URL; init?: RequestInit }> = [];
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      fetchCalls.push({ input, init });
      return {
        ok: true,
        json: async () => ({}),
        text: async () => "",
      } as Response;
    });
    vi.stubGlobal("fetch", fetchMock);
    const onClaimRivalDrop = vi.fn();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "gameStart",
      layout: "mobile",
      boardProps: {
        playerConnections: {
          player: { status: "connected", connected: true },
          opponent: {
            status: "disconnected",
            connected: false,
            disconnectedAt: new Date(Date.now() - 31_000).toISOString(),
          },
        },
        onClaimRivalDrop,
        liveMatchSidebar: {
          matchId: "match_1",
          gameId: "game_1",
          localPlayerId: "gp_self",
          returnUrl: "/cyberpunk/matchmaking",
          participants: [
            {
              id: "gp_self",
              seat: 1,
              userId: "user_self",
              displayName: "Wazar Testing",
            },
            {
              id: "gp_opp",
              seat: 2,
              userId: "user_opp",
              displayName: "MrGMBH",
            },
          ],
        },
      },
    });

    try {
      const board = await waitFor(() =>
        requiredElement<HTMLElement>(view.container, '[data-testid="mobile-cyberpunk-board"]'),
      );
      expect(board.querySelector('[aria-label="Open AI controls"]')).toBeNull();

      fireEvent.click(requiredElement<HTMLButtonElement>(board, '[aria-label="Player actions"]'));
      await waitFor(() =>
        requiredElement<HTMLElement>(document.body, '[data-testid="mobile-player-actions"]'),
      );

      fireEvent.click(requiredElement<HTMLButtonElement>(document.body, '[role="menuitem"]'));
      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
      expect(fetchUrl(fetchCalls[0])).toContain("/friends/by-user/user_opp");
      expect(fetchJsonBody(fetchCalls[0])).toMatchObject({
        matchId: "match_1",
        gameId: "game_1",
      });

      expect(document.body.textContent).toContain("Report player");
      expect(document.body.textContent).toContain("Report bug");
      expect(document.body.textContent).toContain("Request feature");
      expect(document.body.textContent).toContain("Share feedback");
      expect(document.body.textContent).toContain("Drop opponent");
      expect(document.body.textContent).toContain("Matchmaking");

      fireEvent.click(
        requiredElement<HTMLButtonElement>(document.body, 'button[data-danger="true"]'),
      );
      await waitFor(() => requiredElement<HTMLTextAreaElement>(document.body, "textarea"));
      fireEvent.change(requiredElement<HTMLTextAreaElement>(document.body, "textarea"), {
        target: { value: "Opponent stalled for several minutes." },
      });
      fireEvent.click(requiredElement<HTMLButtonElement>(document.body, 'button[type="submit"]'));
      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
      expect(fetchUrl(fetchCalls[1])).toContain("/moderation/player-reports");
      expect(fetchJsonBody(fetchCalls[1])).toMatchObject({
        reportedGameProfileId: "gp_opp",
        matchId: "match_1",
        gameId: "game_1",
        details: "Opponent stalled for several minutes.",
      });

      fireEvent.click(requiredElement<HTMLButtonElement>(document.body, '[role="menuitem"]'));
      await waitFor(() => {
        const added = Array.from(
          document.body.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
        ).find((button) => button.textContent?.includes("Friend added"));
        expect(added?.disabled).toBe(true);
      });

      fireEvent.click(
        Array.from(document.body.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')).find(
          (button) => button.textContent?.includes("Drop opponent"),
        ) ?? requiredElement<HTMLButtonElement>(document.body, '[role="menuitem"]'),
      );
      expect(onClaimRivalDrop).toHaveBeenCalledTimes(1);
    } finally {
      view.unmount();
    }
  });

  test("opens player-specific live match actions from the mobile rails", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "gameStart",
      layout: "mobile",
      boardProps: {
        playerIdentities: {
          player: {
            id: "profile-self",
            displayName: "Wazar Testing",
            isMobile: true,
          },
          opponent: {
            id: "profile-opponent",
            displayName: "MrGMBH",
            isMobile: false,
          },
        },
        liveMatchSidebar: {
          matchId: "match-123",
          gameId: "game-123",
          localPlayerId: "profile-self",
          participants: [
            {
              id: "profile-self",
              userId: "user-self",
              seat: 1,
              displayName: "Wazar Testing",
              deckName: "Solo Test",
            },
            {
              id: "profile-opponent",
              userId: "user-opponent",
              seat: 2,
              displayName: "MrGMBH",
              deckName: "Corpo Test",
            },
          ],
        },
      },
    });

    try {
      await waitFor(() =>
        requiredElement<HTMLElement>(view.container, '[data-testid="mobile-cyberpunk-board"]'),
      );

      fireEvent.click(await view.findByRole("button", { name: /open actions for Wazar Testing/i }));
      const selfDialog = await view.findByRole("dialog", { name: "Your actions" });
      expect(selfDialog).toBeTruthy();
      expect(within(selfDialog).getByRole("menuitem", { name: /Concede game/i })).toBeTruthy();
      expect(within(selfDialog).getByLabelText("Open simulator settings")).toBeTruthy();

      fireEvent.click(requiredElement<HTMLButtonElement>(selfDialog, ".mantine-Drawer-close"));
      await waitFor(() => {
        expect(view.queryByRole("dialog", { name: "Your actions" })).toBeNull();
      });

      fireEvent.click(await view.findByRole("button", { name: /open actions for MrGMBH/i }));
      const opponentDialog = await view.findByRole("dialog", { name: "Opponent actions" });
      expect(opponentDialog).toBeTruthy();
      expect(within(opponentDialog).getByRole("menuitem", { name: "Report player" })).toBeTruthy();
      expect(within(opponentDialog).getByRole("menuitem", { name: "Add friend" })).toBeTruthy();
    } finally {
      view.unmount();
    }
  });
});

function installResizeObserverStub() {
  globalThis.ResizeObserver ??= class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

function requiredElement<T extends Element>(container: ParentNode, selector: string): T {
  const element = container.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Expected element matching ${selector}.`);
  }
  return element;
}

function fetchUrl(call: { input: RequestInfo | URL } | undefined): string {
  if (!call) return "";
  if (typeof call.input === "string") return call.input;
  if (call.input instanceof URL) return call.input.href;
  return call.input.url;
}

function fetchJsonBody(call: { init?: RequestInit } | undefined): unknown {
  const body = call?.init?.body;
  return typeof body === "string" ? JSON.parse(body) : null;
}
