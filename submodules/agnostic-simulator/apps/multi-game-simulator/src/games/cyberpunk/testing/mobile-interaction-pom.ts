import {
  cssString,
  type SimulatorDomDriver,
  type SimulatorDomElement,
} from "@tcg/simulator-testing";

/**
 * POM for the native CYBERPUNK MOBILE board surface.
 *
 * Why a separate POM: `MobileBoard` does NOT render the generic
 * `InteractionPanel` that `InteractionPanelPom` drives (that panel is desktop
 * only). On mobile every action is reached through the native UI:
 *   - hand cards: tap -> `hand-command-tray` (`hand-action-play`/`sell`/`goSolo`)
 *   - field units / legends: tap -> `card-action-menu` (`card-action-*`)
 *   - target selection: `prompt-target-modal-open` -> `ChoiceModal` sheet
 *     (`target-modal-card` / `target-modal-gig` / `search-deck-card`)
 *   - phase advance: `phase-advance` (bottom rail)
 *
 * This POM is driver-agnostic (works with both the jsdom TestingLibraryDomDriver
 * and the Playwright driver) so the same selectors serve unit-level mobile
 * component tests and Playwright mobile e2e. Compose it onto a
 * `CyberpunkSimulatorPom` or use standalone with a `SimulatorDomDriver`.
 *
 * NOTE on hand-card taps: the mobile `useHandCardTap` recognizer treats a tap as
 * a pointerdown+pointerup at (nearly) the same point. With the Playwright driver
 * `click()` synthesizes real pointer events and works directly. In jsdom, mirror
 * the pointer sequence used in `mobile-target-modal.test.tsx` if a plain click
 * does not open the tray.
 */
export class MobileInteractionPom {
  private readonly dom: SimulatorDomDriver;

  constructor(dom: SimulatorDomDriver) {
    this.dom = dom;
  }

  /** The mobile portrait board root (`data-testid="mobile-cyberpunk-board"`). */
  board(): SimulatorDomElement {
    return this.dom.getByTestId("mobile-cyberpunk-board");
  }

  /** A hand card by card instance id (mobile hand cards carry data-card-id). */
  handCard(cardId: string): SimulatorDomElement {
    return this.dom.locator(`[data-testid="hand-card"][data-card-id=${cssString(cardId)}]`);
  }

  /** The command tray that appears once a hand card is selected. */
  handCommandTray(): SimulatorDomElement {
    return this.dom.getByTestId("hand-command-tray");
  }

  /** A specific action button in the hand command tray (play/sell/goSolo). */
  handAction(action: "play" | "sell" | "goSolo"): SimulatorDomElement {
    return this.dom.getByTestId(`hand-action-${action}`);
  }

  /**
   * A field unit or legend card. Mobile field units + face-up legends expose
   * data-definition-id; face-down legends hide it (hidden info) and must be
   * targeted by instance id (data-card-id) instead.
   */
  boardCard(options: { definitionId?: string; instanceId?: string }): SimulatorDomElement {
    if (options.definitionId) {
      return this.dom.locator(`[data-definition-id=${cssString(options.definitionId)}]`);
    }
    if (options.instanceId) {
      return this.dom.locator(`[data-card-id=${cssString(options.instanceId)}]`);
    }
    throw new Error("boardCard requires definitionId or instanceId");
  }

  /** The floating action menu that opens when a field unit / legend is tapped. */
  cardActionMenu(): SimulatorDomElement {
    return this.dom.getByTestId("card-action-menu");
  }

  /** A specific action in the card action menu. */
  cardAction(action: MobileCardAction): SimulatorDomElement {
    return this.dom.getByTestId(`card-action-${action}`);
  }

  /** The "Show valid targets" button that opens the mobile target sheet. */
  targetModalOpen(): SimulatorDomElement {
    return this.dom.getByTestId("prompt-target-modal-open");
  }

  /** The mobile ChoiceModal sheet (portaled to document.body). */
  choiceModalSheet(): SimulatorDomElement {
    return this.dom.getByTestId("choice-modal-sheet");
  }

  /** A selectable card target inside the mobile sheet. */
  targetModalCard(cardId: string): SimulatorDomElement {
    return this.dom.locator(`[data-testid="target-modal-card"][data-card-id=${cssString(cardId)}]`);
  }

  /** A selectable gig/die target inside the mobile sheet. */
  targetModalGig(dieId: string): SimulatorDomElement {
    return this.dom.locator(`[data-testid="target-modal-gig"][data-die-id=${cssString(dieId)}]`);
  }

  /** Multi-select confirm button in the mobile sheet. */
  targetModalConfirm(): SimulatorDomElement {
    return this.dom.getByTestId("target-modal-confirm");
  }

  /** A revealed deck-search card in the mobile sheet. */
  searchDeckCard(cardId: string): SimulatorDomElement {
    return this.dom.locator(`[data-testid="search-deck-card"][data-card-id=${cssString(cardId)}]`);
  }

  searchDeckConfirm(): SimulatorDomElement {
    return this.dom.getByTestId("search-deck-confirm");
  }

  searchDeckSkip(): SimulatorDomElement {
    return this.dom.getByTestId("search-deck-skip");
  }

  /** The phase advance / pass control in the mobile bottom rail. */
  phaseAdvance(): SimulatorDomElement {
    return this.dom.getByTestId("phase-advance");
  }

  passConfirmSubmit(): SimulatorDomElement {
    return this.dom.getByTestId("pass-confirm-submit");
  }

  /** The mobile prompt banner. */
  promptBanner(): SimulatorDomElement {
    return this.dom.getByTestId("prompt-banner");
  }

  // --- high-level mobile flows ------------------------------------------------

  /**
   * Select a hand card and tap a tray action. Opens the tray first, then taps
   * the requested action button.
   */
  async playHandAction(cardId: string, action: "play" | "sell" | "goSolo"): Promise<void> {
    await this.handCard(cardId).click();
    await this.handCommandTray().waitFor({ state: "visible" });
    await this.handAction(action).click();
  }

  /**
   * Tap a field unit / legend, open its action menu, and tap the action.
   * If tapping dispatches directly (no menu, e.g. a single-action card), this
   * still succeeds: the action is treated as fired once the element is tapped.
   */
  async playCardAction(
    target: { definitionId?: string; instanceId?: string },
    action: MobileCardAction,
  ): Promise<void> {
    await this.boardCard(target).click();
    const menu = this.cardActionMenu();
    if ((await menu.count()) > 0) {
      await this.cardAction(action).click();
    }
  }

  /**
   * Open the mobile target sheet (if not already open) and select the first
   * visible card target. For single-select prompts the tap auto-submits; for
   * multi-select it also clicks the confirm button.
   */
  async pickFirstCardTarget(): Promise<string | null> {
    if ((await this.targetModalOpen().count()) > 0) {
      await this.targetModalOpen().click();
      await this.choiceModalSheet().waitFor({ state: "visible" });
    }
    const cards = this.dom.locator('[data-testid="target-modal-card"]');
    if ((await cards.count()) === 0) return null;
    const cardId = await cards.first().getAttribute("data-card-id");
    await cards.first().click();
    const confirm = this.targetModalConfirm();
    if ((await confirm.count()) > 0) {
      await confirm.click();
    }
    return cardId;
  }

  /** Advance the phase; click the pass-confirm dialog if it appears. */
  async advancePhase(): Promise<void> {
    await this.phaseAdvance().click();
    const confirm = this.passConfirmSubmit();
    if ((await confirm.count()) > 0) {
      await confirm.click();
    }
  }
}

export type MobileCardAction =
  | "playCard"
  | "callLegend"
  | "goSolo"
  | "attackUnit"
  | "attackRival"
  | "useBlocker"
  | "activateAbility"
  | "sellCard";
