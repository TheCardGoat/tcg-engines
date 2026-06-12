import type { Locator, Page } from "@playwright/test";
import type { LorcanaProjectedBoardView, LorcanaProjectedCard } from "@tcg/lorcana-engine";
import type {
  BrowserTransportLatencyModel,
  BrowserTransportMode,
  LorcanaBrowserHarnessConfig,
  LorcanaBrowserHarnessExecuteResult,
  LorcanaBrowserStatus,
  CanonicalPlayerId,
} from "../../src/lib/features/simulator-devtools/harness/browser-harness";
import {
  LORCANA_HARNESS_DEFAULT_FIXTURE_ID,
  LORCANA_HARNESS_DEFAULT_VIEW,
  toCanonicalPlayerId,
  toSimulatorView,
} from "../../src/lib/features/simulator-devtools/harness/browser-harness";
import {
  encodeInlineFixtureParam,
  serializeInlineFixture,
  type LorcanaBrowserFixtureInput,
} from "../../src/lib/features/simulator-devtools/harness/browser-fixture";
import { LORCANA_SIMULATOR_FIXTURES } from "../../src/lib/features/simulator-devtools/fixtures/index";
import type {
  LorcanaSimulatorFixture,
  LorcanaTableSeat,
  LorcanaSimulatorView,
  LorcanaZoneId,
} from "../../src/lib/features/simulator/model/contracts";

type OwnedSimulatorView = Extract<LorcanaSimulatorView, "playerOne" | "playerTwo">;

interface LorcanaHarnessWindow extends Window {
  __lorcanaTestHarness?: {
    getConfig(): LorcanaBrowserHarnessConfig;
    reset(): Promise<void>;
    execute(
      view: LorcanaSimulatorView,
      moveId: string,
      params?: Record<string, unknown>,
    ): Promise<LorcanaBrowserHarnessExecuteResult>;
    getStatus(view?: LorcanaSimulatorView): Promise<LorcanaBrowserStatus>;
  };
}

export interface LorcanaSimulatorPomLike {
  getStatus(): Promise<LorcanaBrowserStatus>;
  getBoard(): Promise<LorcanaProjectedBoardView>;
  getZoneCardCount(expected: { zone: LorcanaZoneId; player: string }): Promise<number>;
}

export interface LorcanaHarnessGotoOptions {
  fixture?: LorcanaBrowserFixtureInput | LorcanaSimulatorFixture;
  fixtureId?: string;
  latencyModel?: BrowserTransportLatencyModel;
  latencyMs?: number;
  transport?: BrowserTransportMode;
  view?: LorcanaSimulatorView;
}

export function buildLorcanaHarnessPath(options?: LorcanaHarnessGotoOptions): string {
  const view = options?.view ?? LORCANA_HARNESS_DEFAULT_VIEW;
  const params = new URLSearchParams({ view });
  const registeredFixtureId = resolveRegisteredFixtureId(options?.fixture);
  const fixtureId = options?.fixtureId ?? registeredFixtureId ?? LORCANA_HARNESS_DEFAULT_FIXTURE_ID;

  if (options?.fixture && !registeredFixtureId && !options.fixtureId) {
    params.set("fixture", encodeInlineFixtureParam(serializeInlineFixture(options.fixture)));
  } else {
    params.set("fixtureId", fixtureId);
  }

  if (options?.transport === "async") {
    params.set("transport", "async");
    if (typeof options.latencyMs === "number") {
      params.set("latencyMs", String(options.latencyMs));
    }
    if (options.latencyModel) {
      params.set("latencyModel", options.latencyModel);
    }
  }

  return `/tests/test?${params.toString()}`;
}

export class LorcanaSimulatorPom {
  private currentView: OwnedSimulatorView = LORCANA_HARNESS_DEFAULT_VIEW;

  constructor(readonly page: Page) {}

  async goto(options?: LorcanaHarnessGotoOptions): Promise<void> {
    await this.gotoPath(buildLorcanaHarnessPath(options));
  }

  async gotoPath(path: string): Promise<void> {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        await this.page.goto(path, { waitUntil: "domcontentloaded" });
        break;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const isRetryable =
          message.includes("ERR_ABORTED") || message.includes("frame was detached");

        if (!isRetryable || attempt === 3) {
          throw error;
        }

        await this.page.waitForTimeout(750);
      }
    }

    await this.page.getByTestId("lorcana-test-harness").waitFor();
    await this.waitForHarness();
    this.currentView = await this.getCurrentOwnedView();
  }

  asTopPlayer(): LorcanaSimulatorSeatPom {
    return new LorcanaSimulatorSeatPom(this, "top");
  }

  asBottomPlayer(): LorcanaSimulatorSeatPom {
    return new LorcanaSimulatorSeatPom(this, "bottom");
  }

  async swapPlayers(): Promise<void> {
    await this.page.getByLabel("Open simulator debug actions").click();
    await this.page.getByText("Swap players").click();
    this.currentView = await this.getCurrentOwnedView();
  }

  async reset(): Promise<void> {
    await this.page.evaluate(async () => {
      await (window as LorcanaHarnessWindow).__lorcanaTestHarness?.reset();
    });
    await this.waitForHarness();
  }

  async getStatus(view?: LorcanaSimulatorView): Promise<LorcanaBrowserStatus> {
    return this.page.evaluate(async (targetView) => {
      const harness = (window as LorcanaHarnessWindow).__lorcanaTestHarness;
      if (!harness) {
        throw new Error("Lorcana test harness is unavailable in the page.");
      }

      return harness.getStatus(targetView);
    }, view);
  }

  async execute(
    view: LorcanaSimulatorView,
    moveId: string,
    params: Record<string, unknown> = {},
  ): Promise<LorcanaBrowserHarnessExecuteResult> {
    return this.page.evaluate(
      async ({ targetView, targetMoveId, targetParams }) => {
        const harness = (window as LorcanaHarnessWindow).__lorcanaTestHarness;
        if (!harness) {
          throw new Error("Lorcana test harness is unavailable in the page.");
        }

        return harness.execute(targetView, targetMoveId, targetParams);
      },
      { targetView: view, targetMoveId: moveId, targetParams: params },
    );
  }

  async getBoard(view?: LorcanaSimulatorView): Promise<LorcanaProjectedBoardView> {
    return this.page.evaluate(async (targetView) => {
      const harness = (window as LorcanaHarnessWindow).__lorcanaTestHarness;
      if (!harness) {
        throw new Error("Lorcana test harness is unavailable in the page.");
      }

      return harness.getBoard(targetView ?? "authoritative");
    }, view);
  }

  async waitForStateChange(previousStateID: number, view: LorcanaSimulatorView): Promise<void> {
    await this.page.waitForFunction(
      async ({ targetView, targetStateID }) => {
        const harness = (window as LorcanaHarnessWindow).__lorcanaTestHarness;
        if (!harness) {
          return false;
        }

        const status = await harness.getStatus(targetView);
        return status.stateID !== targetStateID;
      },
      { targetView: view, targetStateID: previousStateID },
    );
  }

  private async waitForHarness(): Promise<void> {
    await this.page.waitForFunction(() =>
      Boolean((window as LorcanaHarnessWindow).__lorcanaTestHarness),
    );
  }

  async getHarnessConfig(): Promise<LorcanaBrowserHarnessConfig> {
    return this.page.evaluate(() => {
      const harness = (window as LorcanaHarnessWindow).__lorcanaTestHarness;
      if (!harness) {
        throw new Error("Lorcana test harness is unavailable in the page.");
      }

      return harness.getConfig();
    });
  }

  async getCurrentOwnedView(): Promise<OwnedSimulatorView> {
    const config = await this.getHarnessConfig();
    if (config.view === "playerOne" || config.view === "playerTwo") {
      return config.view;
    }

    return this.currentView;
  }

  get resolutionTargetOverlay(): Locator {
    return this.page.getByTestId("resolution-target-overlay");
  }

  async openResolutionTargetOverlay(): Promise<void> {
    await this.page.getByRole("button", { name: "Open target selector" }).click();
  }

  resolutionTargetSlot(slotKey: "subject" | "location" | "from" | "to"): Locator {
    return this.page.getByTestId(`resolution-target-slot:${slotKey}`);
  }

  async chooseResolutionTargetSlot(slotKey: "subject" | "location" | "from" | "to"): Promise<void> {
    await this.page.getByTestId(`resolution-target-slot-action:${slotKey}`).click();
  }

  async chooseResolutionTargetCandidate(cardId: string): Promise<void> {
    await this.page.getByTestId(`resolution-target-candidate:${cardId}`).click();
  }

  async confirmResolutionSelection(): Promise<void> {
    const overlayConfirm = this.resolutionTargetOverlay.getByRole("button", { name: "Confirm" });
    if (
      (await overlayConfirm.count()) > 0 &&
      (await overlayConfirm
        .first()
        .isVisible()
        .catch(() => false))
    ) {
      await overlayConfirm.first().click();
      return;
    }

    await this.page
      .getByRole("button", { name: /^Confirm/ })
      .first()
      .click();
  }

  async resolveViewForSeat(seat: LorcanaTableSeat): Promise<OwnedSimulatorView> {
    const ownedView = await this.getCurrentOwnedView();

    if (seat === "bottom") {
      return ownedView;
    }

    return ownedView === "playerOne" ? "playerTwo" : "playerOne";
  }
}

function resolveRegisteredFixtureId(
  fixture: LorcanaBrowserFixtureInput | LorcanaSimulatorFixture | undefined,
): string | undefined {
  if (!fixture?.id) {
    return undefined;
  }

  const registeredFixture = LORCANA_SIMULATOR_FIXTURES[fixture.id];
  return registeredFixture === fixture ? registeredFixture.id : undefined;
}

export class LorcanaSimulatorSeatPom implements LorcanaSimulatorPomLike {
  constructor(
    private readonly pom: LorcanaSimulatorPom,
    private readonly seat: LorcanaTableSeat,
  ) {}

  async chooseFirstPlayer(playerId: CanonicalPlayerId): Promise<void> {
    const view = await this.pom.resolveViewForSeat(this.seat);
    const previousStatus = await this.getStatus();
    const promptButton = this.pom.page.getByTestId(`pregame-choose-first-player-${playerId}`);

    if (
      (await promptButton.count()) > 0 &&
      (await promptButton
        .first()
        .isVisible()
        .catch(() => false))
    ) {
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
    const playerBoard = board.players[player];

    if (!playerBoard) {
      return [];
    }

    return playerBoard.hand.map(String);
  }

  async clickHandCard(cardId: string): Promise<void> {
    await this.pom.page
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
      return matchingCards[0];
    }

    if (matchingCards.length === 0) {
      throw new Error(`Could not find card with label '${label}' in projected board.`);
    }

    throw new Error(`Found multiple cards with label '${label}' in projected board.`);
  }
}
