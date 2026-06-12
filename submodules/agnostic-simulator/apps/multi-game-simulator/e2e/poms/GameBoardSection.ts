import { type Locator, type Page, expect } from "@playwright/test";

export type Side = "player" | "opponent";
export type BoardMode = "view" | "select-action" | "select-target";

/**
 * One side of the board. Owns:
 *   - the GameBoard root (`data-side` + `data-mode`)
 *   - per-side zone locators (hand, fixer, field, legends, eddies, gig row)
 *
 * Locators target the stable `data-testid` + `data-side` attrs that the
 * React zone components render. Specs use these to assert the UI agrees
 * with the engine state surfaced via the bridge.
 */
export class GameBoardSection {
  readonly page: Page;
  readonly side: Side;
  readonly root: Locator;

  // Zone roots — each carries `data-side` + `data-count` (where applicable).
  readonly handZone: Locator;
  readonly deckZone: Locator;
  readonly trashZone: Locator;
  readonly fixerZone: Locator;
  readonly fieldZone: Locator;
  readonly legendsZone: Locator;
  readonly eddiesZone: Locator;
  readonly gigRow: Locator;

  // Inner element collections — use these for `toHaveCount` assertions.
  readonly handCards: Locator;
  readonly fixerDice: Locator;
  readonly legendSlots: Locator;
  readonly faceDownLegends: Locator;
  readonly gigDice: Locator;

  constructor(page: Page, side: Side) {
    this.page = page;
    this.side = side;
    // The Board page wraps the GameBoard in a `data-side` container too, so
    // scope the root locator to the GameBoard root which carries `data-testid`.
    this.root = page.locator(`[data-testid="game-board"][data-side="${side}"]`);

    this.handZone = page.locator(`[data-testid="hand-zone"][data-side="${side}"]`);
    this.handCards = this.handZone.locator('[data-testid="hand-card"]');

    this.deckZone = page.locator(`[data-testid="deck-zone"][data-side="${side}"]`);
    this.trashZone = page.locator(`[data-testid="trash-zone"][data-side="${side}"]`);

    this.fixerZone = page.locator(`[data-testid="fixer-zone"][data-side="${side}"]`);
    this.fixerDice = this.fixerZone.locator('[data-testid="fixer-die"]');

    this.fieldZone = page.locator(`[data-testid="field-zone"][data-side="${side}"]`);

    this.legendsZone = page.locator(`[data-testid="legends-zone"][data-side="${side}"]`);
    this.legendSlots = this.legendsZone.locator(
      '[data-testid="legend-slot"][data-occupied="true"]',
    );
    this.faceDownLegends = this.legendsZone.locator(
      '[data-testid="legend-slot"][data-face-down="true"]',
    );

    this.eddiesZone = page.locator(`[data-testid="eddies-zone"][data-side="${side}"]`);

    this.gigRow = page.locator(`[data-testid="gig-row"][data-side="${side}"]`);
    this.gigDice = this.gigRow.locator('[data-testid="gig-die"]');
  }

  /** Asserts the rendered board for this side is in the given interaction mode. */
  async expectMode(mode: BoardMode): Promise<void> {
    await expect(this.root).toHaveAttribute("data-mode", mode);
  }

  /** Returns the currently rendered mode (`data-mode`) for this side. */
  async getMode(): Promise<BoardMode | null> {
    const value = await this.root.getAttribute("data-mode");
    return value as BoardMode | null;
  }

  // ─── Numeric-attribute reads ────────────────────────────────────────────
  // These read `data-count` from the zone wrapper. For zones whose count is
  // visible-element-driven (hand, fixer, gig row) you can also assert directly
  // on the inner-element locator with `toHaveCount(n)`.

  async getEddiesCount(): Promise<number> {
    return readIntAttr(this.eddiesZone, "data-count");
  }

  async getDataCount(zone: Locator): Promise<number> {
    return readIntAttr(zone, "data-count");
  }

  gigDieByType(dieType: string): Locator {
    return this.gigRow.locator(`[data-testid="gig-die"][data-die-type="${dieType}"]`);
  }
}

async function readIntAttr(locator: Locator, attr: string): Promise<number> {
  const v = await locator.getAttribute(attr);
  if (v === null) {
    throw new Error(`Missing attribute ${attr} on ${locator.toString()}`);
  }
  return Number.parseInt(v, 10);
}
