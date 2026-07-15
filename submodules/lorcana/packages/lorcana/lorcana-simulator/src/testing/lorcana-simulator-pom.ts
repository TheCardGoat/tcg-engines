import type { SimulatorDomDriver, SimulatorDomElement } from "@tcg/simulator-testing";
import type { LorcanaProjectedBoardView, LorcanaProjectedCard } from "@tcg/lorcana-engine";

import {
  toCanonicalPlayerId,
  toSimulatorView,
  type CanonicalPlayerId,
  type LorcanaBrowserHarnessConfig,
  type LorcanaBrowserHarnessExecuteResult,
  type LorcanaBrowserStatus,
} from "@/features/simulator-devtools/harness/browser-harness.js";
import type {
  LorcanaSimulatorView,
  LorcanaTableSeat,
  LorcanaZoneId,
} from "@/features/simulator/model/contracts.js";

type OwnedSimulatorView = Extract<LorcanaSimulatorView, "playerOne" | "playerTwo">;

export interface LorcanaHarnessClient {
  waitForReady(): Promise<void>;
  getConfig(): Promise<LorcanaBrowserHarnessConfig>;
  reset(): Promise<void>;
  execute(
    view: LorcanaSimulatorView,
    moveId: string,
    params?: Record<string, unknown>,
  ): Promise<LorcanaBrowserHarnessExecuteResult>;
  getStatus(view?: LorcanaSimulatorView): Promise<LorcanaBrowserStatus>;
  getBoard(view: LorcanaSimulatorView): Promise<LorcanaProjectedBoardView>;
}

export interface LorcanaSimulatorPomLike {
  getStatus(): Promise<LorcanaBrowserStatus>;
  getBoard(): Promise<LorcanaProjectedBoardView>;
  getZoneCardCount(expected: { zone: LorcanaZoneId; player: string }): Promise<number>;
}

export class LorcanaDomSimulatorPom {
  private currentView: OwnedSimulatorView = "playerOne";

  constructor(
    readonly dom: SimulatorDomDriver,
    readonly harness: LorcanaHarnessClient,
  ) {}

  async waitForReady(): Promise<void> {
    await this.dom.getByTestId("lorcana-test-harness").waitFor();
    await this.harness.waitForReady();
    this.currentView = await this.getCurrentOwnedView();
  }

  asTopPlayer(): LorcanaDomSimulatorSeatPom {
    return new LorcanaDomSimulatorSeatPom(this, "top");
  }

  asBottomPlayer(): LorcanaDomSimulatorSeatPom {
    return new LorcanaDomSimulatorSeatPom(this, "bottom");
  }

  async reset(): Promise<void> {
    await this.harness.reset();
    await this.harness.waitForReady();
  }

  getStatus(view?: LorcanaSimulatorView): Promise<LorcanaBrowserStatus> {
    return this.harness.getStatus(view);
  }

  execute(
    view: LorcanaSimulatorView,
    moveId: string,
    params: Record<string, unknown> = {},
  ): Promise<LorcanaBrowserHarnessExecuteResult> {
    return this.harness.execute(view, moveId, params);
  }

  getBoard(view: LorcanaSimulatorView = "authoritative"): Promise<LorcanaProjectedBoardView> {
    return this.harness.getBoard(view);
  }

  async waitForStateChange(previousStateID: number, view: LorcanaSimulatorView): Promise<void> {
    await this.dom.waitFor(async () => {
      const status = await this.harness.getStatus(view);
      return status.stateID !== previousStateID;
    });
  }

  get resolutionTargetOverlay(): SimulatorDomElement {
    return this.dom.getByTestId("resolution-target-overlay");
  }

  async openResolutionTargetOverlay(): Promise<void> {
    await this.dom.getByRole("button", { name: "Open target selector" }).click();
  }

  resolutionTargetSlot(slotKey: "subject" | "location" | "from" | "to"): SimulatorDomElement {
    return this.dom.getByTestId(`resolution-target-slot:${slotKey}`);
  }

  async chooseResolutionTargetSlot(slotKey: "subject" | "location" | "from" | "to"): Promise<void> {
    await this.dom.getByTestId(`resolution-target-slot-action:${slotKey}`).click();
  }

  async chooseResolutionTargetCandidate(cardId: string): Promise<void> {
    await this.dom.getByTestId(`resolution-target-candidate:${cardId}`).click();
  }

  async confirmResolutionSelection(): Promise<void> {
    await this.dom
      .getByRole("button", { name: /^Confirm/ })
      .first()
      .click();
  }

  async getCurrentOwnedView(): Promise<OwnedSimulatorView> {
    const config = await this.harness.getConfig();
    if (config.view === "playerOne" || config.view === "playerTwo") {
      return config.view;
    }

    return this.currentView;
  }

  async resolveViewForSeat(seat: LorcanaTableSeat): Promise<OwnedSimulatorView> {
    const ownedView = await this.getCurrentOwnedView();
    if (seat === "bottom") {
      return ownedView;
    }

    return ownedView === "playerOne" ? "playerTwo" : "playerOne";
  }
}

export class LorcanaDomSimulatorSeatPom implements LorcanaSimulatorPomLike {
  constructor(
    private readonly pom: LorcanaDomSimulatorPom,
    private readonly seat: LorcanaTableSeat,
  ) {}

  async chooseFirstPlayer(playerId: CanonicalPlayerId): Promise<void> {
    const view = await this.pom.resolveViewForSeat(this.seat);
    const previousStatus = await this.getStatus();
    const promptButton = this.pom.dom.getByTestId(`pregame-choose-first-player-${playerId}`);

    if ((await promptButton.count()) > 0 && (await promptButton.first().isVisible())) {
      await promptButton.first().click();
    } else {
      const targetSide = toSimulatorView(playerId);
      const result = await this.pom.execute(view, "chooseWhoGoesFirst", {
        playerId,
        side: targetSide,
      });

      if (!result.success) {
        throw new Error(result.reason ?? `Failed to execute chooseWhoGoesFirst for ${playerId}.`);
      }
    }

    await this.pom.waitForStateChange(previousStatus.stateID, view);
  }

  async getStatus(): Promise<LorcanaBrowserStatus> {
    const view = await this.pom.resolveViewForSeat(this.seat);
    return this.pom.getStatus(view);
  }

  async getBoard(): Promise<LorcanaProjectedBoardView> {
    const view = await this.pom.resolveViewForSeat(this.seat);
    return this.pom.getBoard(view);
  }

  async getZoneCardCount(expected: { zone: LorcanaZoneId; player: string }): Promise<number> {
    const status = await this.getStatus();
    return status.zoneCounts[expected.player]?.[expected.zone] ?? 0;
  }

  async getHandCardIds(player: CanonicalPlayerId): Promise<string[]> {
    const view = await this.pom.resolveViewForSeat(this.seat);
    const board = await this.pom.getBoard(view);
    return board.players[player]?.hand.map(String) ?? [];
  }

  async clickHandCard(cardId: string): Promise<void> {
    await this.pom.dom
      .locator(`[data-testid="hand-zone-${this.seat}"] [data-card-id="${cardId}"]`)
      .click();
  }

  async mulligan(cardsToMulligan: string[]): Promise<void> {
    const view = await this.pom.resolveViewForSeat(this.seat);
    const previousStatus = await this.getStatus();
    const playerId = toCanonicalPlayerId(view);

    const result = await this.pom.execute(view, "alterHand", {
      playerId,
      cardsToMulligan,
    });

    if (!result.success) {
      throw new Error(result.reason ?? `Failed to execute alterHand for ${playerId}.`);
    }

    await this.pom.waitForStateChange(previousStatus.stateID, view);
  }

  async inkCard(cardId: string): Promise<void> {
    const view = await this.pom.resolveViewForSeat(this.seat);
    const previousStatus = await this.getStatus();
    const result = await this.pom.execute(view, "putCardIntoInkwell", { cardId });

    if (!result.success) {
      throw new Error(result.reason ?? `Failed to execute putCardIntoInkwell for card ${cardId}.`);
    }

    await this.pom.waitForStateChange(previousStatus.stateID, view);
  }

  async passTurn(): Promise<void> {
    const view = await this.pom.resolveViewForSeat(this.seat);
    const previousStatus = await this.getStatus();
    const result = await this.pom.execute(view, "passTurn", {});

    if (!result.success) {
      throw new Error(result.reason ?? "Failed to execute passTurn.");
    }

    await this.pom.waitForStateChange(previousStatus.stateID, view);
  }

  async findCard(label: string): Promise<LorcanaProjectedCard> {
    const board = await this.getBoard();
    const matchingCards = Object.values(board.cards).filter((card) => card.fullName === label);

    if (matchingCards.length === 1) {
      return matchingCards[0]!;
    }

    if (matchingCards.length === 0) {
      throw new Error(`Could not find card with label '${label}' in projected board.`);
    }

    throw new Error(`Found multiple cards with label '${label}' in projected board.`);
  }
}

export class WindowLorcanaHarnessClient implements LorcanaHarnessClient {
  async waitForReady(): Promise<void> {
    const deadline = Date.now() + 5_000;
    while (Date.now() <= deadline) {
      if (this.getOptionalHarness()) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    throw new Error("Timed out waiting for window.__lorcanaTestHarness.");
  }

  getConfig(): Promise<LorcanaBrowserHarnessConfig> {
    return Promise.resolve(this.getHarness().getConfig());
  }

  reset(): Promise<void> {
    return this.getHarness().reset();
  }

  execute(
    view: LorcanaSimulatorView,
    moveId: string,
    params: Record<string, unknown> = {},
  ): Promise<LorcanaBrowserHarnessExecuteResult> {
    return this.getHarness().execute(view, moveId, params);
  }

  getStatus(view?: LorcanaSimulatorView): Promise<LorcanaBrowserStatus> {
    return this.getHarness().getStatus(view);
  }

  getBoard(view: LorcanaSimulatorView): Promise<LorcanaProjectedBoardView> {
    return this.getHarness().getBoard(view);
  }

  private getOptionalHarness(): LorcanaHarnessBridge | undefined {
    return (window as unknown as LorcanaHarnessWindow).__lorcanaTestHarness;
  }

  private getHarness(): LorcanaHarnessBridge {
    const harness = this.getOptionalHarness();
    if (!harness) {
      throw new Error("window.__lorcanaTestHarness is unavailable.");
    }
    return harness;
  }
}

interface LorcanaHarnessWindow {
  __lorcanaTestHarness?: LorcanaHarnessBridge;
}

interface LorcanaHarnessBridge {
  getConfig(): LorcanaBrowserHarnessConfig;
  reset(): Promise<void>;
  execute(
    view: LorcanaSimulatorView,
    moveId: string,
    params?: Record<string, unknown>,
  ): Promise<LorcanaBrowserHarnessExecuteResult>;
  getStatus(view?: LorcanaSimulatorView): Promise<LorcanaBrowserStatus>;
  getBoard(view: LorcanaSimulatorView): Promise<LorcanaProjectedBoardView>;
}
