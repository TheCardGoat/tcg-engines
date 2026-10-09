// @vitest-environment jsdom

import { fireEvent, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { welcomeToNightCityRetailPanamPalmerNomadCavalry } from "@tcg/cyberpunk-cards";
import {
  composeDropEligibility,
  DISCONNECT_DROP_THRESHOLD_MS,
  unsupportedTimeoutChannel,
} from "@tcg/protocol";

import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { CYBERPUNK_P1 } from "../../testing/cyberpunk-simulator-pom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../testing/render-cyberpunk-simulator";

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
      const phaseHud = requiredElement<HTMLElement>(view.container, '[data-testid="phase-hud"]');
      const actionButtons = Array.from(
        phaseHud.parentElement?.querySelectorAll<HTMLButtonElement>("button") ?? [],
      );
      expect(actionButtons).toHaveLength(3);
      expect(actionButtons[0]?.textContent).toContain("Concede");
      expect(actionButtons[1]?.getAttribute("aria-label")).toBe("Undo last move");
      expect(actionButtons[1]?.disabled).toBe(true);
      expect(actionButtons[2]?.dataset.testid).toBe("phase-advance");
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
        requiredElement<HTMLElement>(board, '[data-drop-zone="opp-gigArea"]')?.dataset.dropSurface,
      ).toBe("rival-gigs");
      expect(
        requiredElement<HTMLElement>(board, '[data-drop-zone="p-eddies"]')?.dataset.dropSurface,
      ).toBe("friendly-gigs-legends");

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
      expect(zoneSummary.querySelector('[data-drop-zone="p-eddies"]')).toBeNull();
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

  test("keeps both Legend regions beside the Gig rails", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "mobileLedgerThreeLegends",
      layout: "mobile",
    });

    try {
      const ledger = await waitFor(() =>
        requiredElement<HTMLElement>(
          view.container,
          '[aria-label="Mobile Legends, Street Cred, and Gig dice"]',
        ),
      );
      const legendRegions = ledger.querySelectorAll<HTMLElement>(
        '[data-testid="mobile-ledger-legends"]',
      );
      expect(legendRegions).toHaveLength(2);

      for (const region of legendRegions) {
        expect(region.querySelector('[data-testid="legend-slot"]')).toBeTruthy();
      }
      expect(ledger.querySelectorAll('[data-testid="gig-row"]')).toHaveLength(2);

      expect(ledger.querySelector('[data-testid="resolving-program"]')).toBeNull();
      expect(ledger.parentElement?.getAttribute("data-has-resolving")).not.toBe("true");
    } finally {
      view.unmount();
    }
  });

  test("focuses one Legend side with its vertical Gig miniatures and shows attached Gear", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendCallEquippedSelfPay",
      layout: "mobile",
    });

    try {
      const ledger = await waitFor(() =>
        requiredElement<HTMLElement>(
          view.container,
          '[aria-label="Mobile Legends, Street Cred, and Gig dice"]',
        ),
      );
      const rows = ledger;
      expect(rows.dataset.legendFocus).toBe("none");
      const attachedGear = rows.querySelectorAll(
        '[data-testid="attached-gear"][class*="legendGearCard"]',
      );
      expect(attachedGear).toHaveLength(2);
      expect(
        Array.from(attachedGear, (card) => card.querySelector("img")?.getAttribute("alt")),
      ).toEqual(["Mantis Blades", "Kiroshi Optics"]);

      fireEvent.click(within(rows).getByRole("button", { name: "Focus Legends" }));
      expect(rows.dataset.legendFocus).toBe("friendly");
      expect(within(rows).getByRole("button", { name: /Show your Gigs: 1 dice/ })).toBeTruthy();
      expect(rows.querySelectorAll('[class*="mobileLedgerGigMiniDie"]')).toHaveLength(1);
      expect(
        rows.querySelectorAll('[data-testid="attached-gear"][class*="legendGearCard"]'),
      ).toHaveLength(2);

      fireEvent.click(within(rows).getByRole("button", { name: "Rival Legends" }));
      expect(rows.dataset.legendFocus).toBe("rival");
      expect(
        within(rows).getByRole("button", { name: "Rival Legends" }).getAttribute("aria-pressed"),
      ).toBe("true");
      expect(within(rows).getByRole("button", { name: /Show rival Gigs: 1 dice/ })).toBeTruthy();

      fireEvent.click(within(rows).getByRole("button", { name: "Close Legend focus" }));
      expect(rows.dataset.legendFocus).toBe("none");
    } finally {
      view.unmount();
    }
  });

  test("selects a visible attached Legend Gear", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendQaGearTempo",
    });

    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      const panam = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        welcomeToNightCityRetailPanamPalmerNomadCavalry.id,
      );
      await pom.activateAbility(panam.instanceId, 0, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");

      const slot = requiredElement<HTMLElement>(
        view.container,
        `[data-testid="legend-slot"][data-card-id="${panam.instanceId}"]`,
      );
      const gearTarget = await waitFor(() =>
        requiredElement<HTMLButtonElement>(
          slot,
          '[data-testid="attached-gear"] button[data-choice-eligible="true"]',
        ),
      );
      expect(gearTarget.getAttribute("aria-label")).toContain("Overwatch");
      fireEvent.click(gearTarget);
      await waitFor(() =>
        expect(
          slot.querySelector('[data-testid="attached-gear"] button[data-choice-eligible="true"]'),
        ).toBeNull(),
      );
    } finally {
      view.unmount();
    }
  });

  test("keeps positional empty Legend slots without exposing a Legend card", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitGoroTakemuraLosingHisWay",
      layout: "mobile",
    });

    try {
      const ledger = await waitFor(() =>
        requiredElement<HTMLElement>(
          view.container,
          '[aria-label="Mobile Legends, Street Cred, and Gig dice"]',
        ),
      );
      const emptySide = mobileLegendRegion(ledger, "rival");
      const activeSide = mobileLegendRegion(ledger, "friendly");

      expect(emptySide.dataset.legendCount).toBe("0");
      expect(
        Array.from(emptySide.querySelectorAll<HTMLElement>('[data-testid="legend-slot"]')).every(
          (slot) => slot.dataset.occupied === "false",
        ),
      ).toBe(true);
      expect(activeSide.dataset.legendCount).not.toBe("0");
      expect(activeSide.querySelector('[data-testid="legend-slot"]')).toBeTruthy();
    } finally {
      view.unmount();
    }
  });

  test("keeps friendly face-down Legends as a compact positional strip", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "attackStep",
      layout: "mobile",
    });

    try {
      const ledger = await waitFor(() =>
        requiredElement<HTMLElement>(
          view.container,
          '[aria-label="Mobile Legends, Street Cred, and Gig dice"]',
        ),
      );
      const friendly = mobileLegendRegion(ledger, "friendly");
      const friendlySlots = Array.from(
        friendly.querySelectorAll<HTMLElement>('[data-testid="legend-slot"]'),
      );
      const occupiedSlots = friendlySlots.filter((slot) => slot.dataset.occupied === "true");

      expect(friendly.dataset.legendCount).toBe("2");
      expect(occupiedSlots.map((slot) => slot.dataset.legendIndex)).toEqual(["0", "1"]);
      expect(occupiedSlots.map((slot) => slot.dataset.faceDown)).toEqual(["true", "true"]);
      expect(occupiedSlots.some((slot) => slot.dataset.callLegendActionable === "true")).toBe(true);
      expect(ledger.querySelectorAll('[data-testid="gig-row"]')).toHaveLength(2);
    } finally {
      view.unmount();
    }
  });

  test("keeps mixed face-up and face-down Legend indexes on the two-Legend ledger", async () => {
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
      const friendly = mobileLegendRegion(ledger, "friendly");
      const slots = Array.from(
        friendly.querySelectorAll<HTMLElement>('[data-testid="legend-slot"]'),
      );

      expect(ledger.querySelectorAll('[data-testid="mobile-ledger-legends"]')).toHaveLength(2);
      expect(slots.map((slot) => slot.dataset.legendIndex)).toEqual(["0", "1", "2"]);
      expect(slots.map((slot) => slot.dataset.occupied)).toEqual(["true", "true", "false"]);
      expect(slots.map((slot) => slot.dataset.faceDown)).toEqual(["false", "true", undefined]);
    } finally {
      view.unmount();
    }
  });

  test("keeps rival face-down Legends in the Bonnie and Clyde ledger", async () => {
    ensureJsdomAnimationSupport();
    installResizeObserverStub();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "progBonnieAndClyde",
      layout: "mobile",
    });

    try {
      const ledger = await waitFor(() =>
        requiredElement<HTMLElement>(
          view.container,
          '[aria-label="Mobile Legends, Street Cred, and Gig dice"]',
        ),
      );
      const friendly = mobileLegendRegion(ledger, "friendly");
      const rival = mobileLegendRegion(ledger, "rival");
      const friendlySlots = Array.from(
        friendly.querySelectorAll<HTMLElement>('[data-testid="legend-slot"]'),
      );

      const rivalSlots = Array.from(
        rival.querySelectorAll<HTMLElement>('[data-testid="legend-slot"]'),
      );
      expect(rival.dataset.legendCount).toBe("1");
      expect(rivalSlots[0]?.dataset.occupied).toBe("true");
      expect(rivalSlots[0]?.dataset.faceDown).toBe("true");
      expect(friendlySlots.map((slot) => slot.dataset.legendIndex)).toEqual(["0", "1", "2"]);
      expect(friendlySlots[0]?.dataset.occupied).toBe("true");
      expect(friendlySlots[0]?.dataset.faceDown).toBe("true");
      expect(ledger.querySelectorAll('[data-testid="gig-row"]')).toHaveLength(2);
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
    // The Drop menu item renders from server-projected eligibility, so feed
    // the page the same disconnect the connections fixture describes (past
    // the 30s threshold, i.e. claimable now).
    const nowMs = Date.now();

    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "gameStart",
      layout: "mobile",
      boardProps: {
        playerConnections: {
          player: { status: "connected", connected: true },
          opponent: {
            status: "disconnected",
            connected: false,
            disconnectedAt: new Date(nowMs - 31_000).toISOString(),
          },
        },
        onClaimRivalDrop,
        dropEligibility: composeDropEligibility({
          nowMs,
          timeout: unsupportedTimeoutChannel(),
          disconnect: {
            connected: false,
            disconnectedAtMs: nowMs - DISCONNECT_DROP_THRESHOLD_MS - 5_000,
          },
        }),
        liveMatchSidebar: {
          matchId: "match_1",
          gameId: "game_1",
          format: "best_of_1",
          gameNumber: 1,
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
      await waitFor(() =>
        requiredElement<HTMLElement>(view.container, '[data-testid="mobile-cyberpunk-board"]'),
      );
      expect(view.container.querySelector('[aria-label="Open AI controls"]')).toBeNull();

      fireEvent.click(
        requiredElement<HTMLButtonElement>(view.container, '[aria-label="Player actions"]'),
      );
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
          format: "best_of_1",
          gameNumber: 1,
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
      expect(
        within(selfDialog).getByRole("menuitem", { name: "Enable Board State Correction" }),
      ).toBeTruthy();
      expect(within(selfDialog).getByRole("menuitem", { name: "Undo to turn start" })).toBeTruthy();
      expect(within(selfDialog).getByLabelText("Open simulator settings")).toBeTruthy();

      fireEvent.click(requiredElement<HTMLButtonElement>(selfDialog, ".mantine-Drawer-close"));
      await waitFor(() => {
        expect(view.queryByRole("dialog", { name: "Your actions" })).toBeNull();
      });

      fireEvent.click(await view.findByRole("button", { name: "Open more match options" }));
      const moreDialog = await view.findByRole("dialog", { name: "Your actions" });
      expect(
        within(moreDialog).getByRole("menuitem", { name: "Enable Board State Correction" }),
      ).toBeTruthy();
      expect(within(moreDialog).getByRole("menuitem", { name: "Undo to turn start" })).toBeTruthy();
      expect(within(moreDialog).getByLabelText("Open simulator settings")).toBeTruthy();

      fireEvent.click(requiredElement<HTMLButtonElement>(moreDialog, ".mantine-Drawer-close"));
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

function mobileLegendRegion(ledger: HTMLElement, tone: "friendly" | "rival"): HTMLElement {
  return requiredElement<HTMLElement>(
    ledger,
    `[data-tone="${tone}"] [data-testid="mobile-ledger-legends"]`,
  );
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
