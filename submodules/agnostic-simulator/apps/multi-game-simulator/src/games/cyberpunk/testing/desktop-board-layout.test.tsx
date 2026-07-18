import { fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vite-plus/test";

vi.mock("../animation", async () => {
  const actual = await vi.importActual<typeof import("../animation")>("../animation");
  return { ...actual, SoundPlayer: () => null };
});

import { CYBERPUNK_P1 } from "./cyberpunk-simulator-pom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "./render-cyberpunk-simulator";
import type { Side } from "../engine";
import {
  DEFAULT_PLAYER_ZONE_WIDTH,
  HAND_SIZE_MULTIPLIERS,
  computePlayerHandLayout,
} from "../components/GameBoard/handLayout";

/**
 * Locks in the desktop board layout contract for the Cyberpunk route:
 * - MobileShell collapses to a two-column grid (sidebar + board) because the
 *   interactions slot is null.
 * - The shared InteractionPanel (aria-label + interaction-card testids) is
 *   re-homed INSIDE the board overlay (a descendant of the board-wrap) so the
 *   test harness — which forces a 1440px desktop width — can still drive it.
 * - The opponent hand anchors to the top slot and the self hand to the bottom
 *   slot (standard layout, mirrors e2e/specs/practice-setup.spec.ts).
 */
describe("Cyberpunk desktop board layout", () => {
  test("MobileShell renders two columns and hosts the interaction panel inside the board", async () => {
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "gameStart" });
    try {
      const container = view.container;

      const desktopShell = container.querySelector(".mobile-shell-desktop");
      expect(desktopShell, "expected desktop MobileShell at 1440px").not.toBeNull();
      // interactions slot is null -> only sidebar + board children remain.
      expect(desktopShell!.childElementCount).toBe(2);

      // The interaction panel is mounted inside the board overlay (board-wrap),
      // not in a dedicated right-hand column.
      const boardWrap = container.querySelector('[data-testid="board-wrap"]');
      expect(boardWrap, "expected board-wrap container").not.toBeNull();
      const panelInsideBoard = boardWrap!.querySelector('[aria-label="Interaction panel"]');
      expect(panelInsideBoard, "expected Interaction panel inside the board").not.toBeNull();
      // No standalone right-hand interaction column wrapper exists.
      expect(container.querySelector('[data-testid="board-wrap"]')).not.toBeNull();

      // Hand zones: opponent anchored top, self anchored bottom.
      const opponentHand = container.querySelector<HTMLElement>(
        '[data-testid="hand-zone"][data-side="opponent"]',
      );
      const playerHand = container.querySelector<HTMLElement>(
        '[data-testid="hand-zone"][data-side="player"]',
      );
      expect(opponentHand, "expected opponent hand zone").not.toBeNull();
      expect(playerHand, "expected player hand zone").not.toBeNull();
      expect(opponentHand!.closest('[class*="handTop"]')).not.toBeNull();
      expect(playerHand!.closest('[class*="handBottom"]')).not.toBeNull();
      expect(opponentHand!.dataset.handLayout).toBe("opponent");
      expect(opponentHand!.dataset.handAlignment).toBe("start");
      expect(playerHand!.dataset.handLayout).toBe("player");
      expect(playerHand!.dataset.handAlignment).toBe("center");
      expect(Number(playerHand!.dataset.handCardWidth)).toBeGreaterThan(
        Number(opponentHand!.dataset.handCardWidth),
      );
      expect(container.querySelector('[data-testid="player-hand-dock"]')).not.toBeNull();
      expect(container.querySelector('[data-testid="opponent-hand-overlay"]')).not.toBeNull();
    } finally {
      view.unmount();
    }
  });

  test("hand layout sizes self larger, opponent smaller, and emits integer pixels", () => {
    const cardCount = 5;
    const playerLayout = computePlayerHandLayout(cardCount, DEFAULT_PLAYER_ZONE_WIDTH, "player");
    const opponentLayout = computePlayerHandLayout(
      cardCount,
      DEFAULT_PLAYER_ZONE_WIDTH,
      "opponent",
    );

    expect(HAND_SIZE_MULTIPLIERS.player).toBe(1.05);
    expect(HAND_SIZE_MULTIPLIERS.opponent).toBe(0.75);
    expect(playerLayout.cardWidth).toBeGreaterThan(opponentLayout.cardWidth);
    expect(Number.isInteger(playerLayout.cardWidth)).toBe(true);
    expect(Number.isInteger(opponentLayout.cardWidth)).toBe(true);
    expectIntegerLayout(playerLayout.cards);
    expectIntegerLayout(opponentLayout.cards);
  });

  test("rival hand can grow from its safe left edge while the player hand stays centered", () => {
    const cardCount = 5;
    const opponentLayout = computePlayerHandLayout(
      cardCount,
      DEFAULT_PLAYER_ZONE_WIDTH,
      "opponent",
      "start",
    );
    const playerLayout = computePlayerHandLayout(
      cardCount,
      DEFAULT_PLAYER_ZONE_WIDTH,
      "player",
      "center",
    );

    expect(opponentLayout.cards[0]!.x).toBe(Math.round(opponentLayout.cardWidth / 2));
    expect(opponentLayout.cards.at(-1)!.x).toBeGreaterThan(opponentLayout.cards[0]!.x);
    expect(playerLayout.cards[0]!.x).toBeLessThan(0);
    expect(playerLayout.cards.at(-1)!.x).toBeGreaterThan(0);
    expect(Math.min(...playerLayout.cards.map((card) => card.y))).toBeGreaterThan(0);
    expect(Math.max(...playerLayout.cards.map((card) => card.y))).toBeGreaterThan(
      Math.min(...playerLayout.cards.map((card) => card.y)),
    );
  });

  test("priority lane follows the player with priority for both human seats", async () => {
    const priorityCases: Array<{
      scenarioId: Parameters<typeof renderCyberpunkSimulatorScenario>[0]["scenarioId"];
      humanSide: Side;
      prioritySide: Side;
    }> = [
      { scenarioId: "openingMain", humanSide: "player", prioritySide: "player" },
      { scenarioId: "openingMain", humanSide: "opponent", prioritySide: "player" },
      { scenarioId: "opponentTurn", humanSide: "player", prioritySide: "opponent" },
      { scenarioId: "opponentTurn", humanSide: "opponent", prioritySide: "opponent" },
    ];

    for (const testCase of priorityCases) {
      const view = renderCyberpunkSimulatorScenario({
        scenarioId: testCase.scenarioId,
        initialHumanSide: testCase.humanSide,
      });
      try {
        await createTestingLibraryCyberpunkSimulatorPom(view.container).waitForReady();
        expectPriorityLane(view.container, testCase.prioritySide);
        expectHumanSeatPlacement(view.container, testCase.humanSide);
      } finally {
        view.unmount();
      }
    }
  });

  test("target prompt can temporarily move to the rival board and resets on the next prompt", async () => {
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "chooseCardTarget" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectBoardMode(CYBERPUNK_P1, "select-target");
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToPlay");

      const panel = view.container.querySelector<HTMLElement>(
        '[data-testid="desktop-action-panel-floating"]',
      );
      expect(panel, "expected desktop floating prompt panel").not.toBeNull();
      expect(panel!.dataset.promptPlacement).toBe("player");

      const toggle = view.container.querySelector<HTMLButtonElement>(
        '[data-testid="prompt-banner-toggle-board-placement"]',
      );
      expect(toggle, "expected target prompt relocation button").not.toBeNull();
      expect(toggle!.getAttribute("aria-label")).toBe("Move prompt to rival board");

      fireEvent.click(toggle!);
      expect(panel!.dataset.promptPlacement).toBe("rival");
      expect(toggle!.getAttribute("aria-label")).toBe("Move prompt back to your board");

      fireEvent.click(toggle!);
      expect(panel!.dataset.promptPlacement).toBe("player");

      fireEvent.click(toggle!);
      expect(panel!.dataset.promptPlacement).toBe("rival");

      const [cardToPlay] = await pom.getChoiceCardIds(CYBERPUNK_P1);
      expect(cardToPlay, "expected a card choice to resolve").toBeTruthy();
      await pom.resolveCardToPlay(cardToPlay!, CYBERPUNK_P1);

      await waitFor(() => {
        expect(panel!.dataset.promptPlacement).toBe("player");
      });
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
    } finally {
      view.unmount();
    }
  });

  test("only the local human side shows card action affordances", async () => {
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "opponentTurn",
      initialHumanSide: "player",
    });
    try {
      await createTestingLibraryCyberpunkSimulatorPom(view.container).waitForReady();

      const opponentLegendSlots = view.container.querySelectorAll<HTMLElement>(
        '[data-testid="legends-zone"][data-side="opponent"] [data-testid="legend-slot"][data-occupied="true"]',
      );
      expect(opponentLegendSlots.length).toBeGreaterThan(0);
      for (const slot of opponentLegendSlots) {
        expect(slot.dataset.actionable).toBe("false");
        expect(slot.dataset.callLegendActionable).toBe("false");
      }

      const opponentActionCards = view.container.querySelectorAll<HTMLElement>(
        '[data-testid="card"][data-side="opponent"][data-actionable="true"]',
      );
      expect(opponentActionCards).toHaveLength(0);

      const selfActionCards = view.container.querySelectorAll<HTMLElement>(
        '[data-testid="card"][data-side="player"][data-actionable="true"]',
      );
      expect(selfActionCards).toHaveLength(0);
    } finally {
      view.unmount();
    }
  });
});

function expectPriorityLane(container: HTMLElement, prioritySide: Side): void {
  const playerLane = requireLane(container, "player");
  const opponentLane = requireLane(container, "opponent");

  expect(playerLane.dataset.priority).toBe(prioritySide === "player" ? "true" : "false");
  expect(opponentLane.dataset.priority).toBe(prioritySide === "opponent" ? "true" : "false");
}

function expectHumanSeatPlacement(container: HTMLElement, humanSide: Side): void {
  const boardShell = container.querySelector('[data-testid="board-wrap"] > [class*="boardShell"]');
  expect(boardShell, "expected desktop board shell").not.toBeNull();

  const topLane = boardShell!.children.item(0) as HTMLElement | null;
  const bottomLane = boardShell!.children.item(2) as HTMLElement | null;

  expect(topLane?.dataset.side).toBe(humanSide === "player" ? "opponent" : "player");
  expect(bottomLane?.dataset.side).toBe(humanSide);
}

function requireLane(container: HTMLElement, side: Side): HTMLElement {
  const lane = container.querySelector<HTMLElement>(
    `[data-testid="board-wrap"] [data-side="${side}"][data-priority]`,
  );
  expect(lane, `expected ${side} lane`).not.toBeNull();
  return lane!;
}

function expectIntegerLayout(cards: ReadonlyArray<{ x: number; y: number }>): void {
  for (const card of cards) {
    expect(Number.isInteger(card.x)).toBe(true);
    expect(Number.isInteger(card.y)).toBe(true);
  }
}
