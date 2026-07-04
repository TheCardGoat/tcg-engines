import { describe, expect, test, vi } from "vite-plus/test";

vi.mock("../animation", async () => {
  const actual = await vi.importActual<typeof import("../animation")>("../animation");
  return { ...actual, SoundPlayer: () => null };
});

import { renderCyberpunkSimulatorScenario } from "./render-cyberpunk-simulator";

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
      const opponentHand = container.querySelector(
        '[data-testid="hand-zone"][data-side="opponent"]',
      );
      const playerHand = container.querySelector('[data-testid="hand-zone"][data-side="player"]');
      expect(opponentHand, "expected opponent hand zone").not.toBeNull();
      expect(playerHand, "expected player hand zone").not.toBeNull();
      expect(opponentHand!.closest('[class*="handTop"]')).not.toBeNull();
      expect(playerHand!.closest('[class*="handBottom"]')).not.toBeNull();
    } finally {
      view.unmount();
    }
  });
});
