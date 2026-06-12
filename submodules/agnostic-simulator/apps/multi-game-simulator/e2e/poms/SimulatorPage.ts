import { type Locator, type Page, expect } from "@playwright/test";
import type { PlayerId } from "@tcg/cyberpunk-engine";
import { GameBoardSection } from "./GameBoardSection";
import { PromptBanner } from "./PromptBanner";
// Type-only import of the shared types module. `src/types/e2e.ts` is
// hand-curated to export ONLY `type` declarations and to import only types
// from `@tcg/cyberpunk-engine`, so this does not drag React (or any other
// runtime app surface) into the e2e tsconfig.
import type {
  EngineAction,
  EngineActionMatcher,
  ScenarioId,
} from "../../src/games/cyberpunk/types/e2e";

export type { EngineAction, EngineActionMatcher, ScenarioId };

/**
 * Top-level page object for the simulator. Owns:
 *   - navigation to a fixture route
 *   - the engine bridge (window.__cyberpunkEngine, attached in DEV by EngineProvider)
 *   - per-side sub-POMs (player + opponent boards, prompt banners)
 *
 * Specs talk to this object — they never call page.evaluate directly.
 */
export class SimulatorPage {
  readonly page: Page;
  readonly playerBoard: GameBoardSection;
  readonly opponentBoard: GameBoardSection;
  readonly playerPrompt: PromptBanner;
  readonly opponentPrompt: PromptBanner;

  constructor(page: Page) {
    this.page = page;
    this.playerBoard = new GameBoardSection(page, "player");
    this.opponentBoard = new GameBoardSection(page, "opponent");
    this.playerPrompt = new PromptBanner(page, "player");
    this.opponentPrompt = new PromptBanner(page, "opponent");
  }

  /**
   * Navigate to a fixture route, wait for the board to mount, and wait for
   * the dev-only engine bridge to be attached to `window`.
   *
   * The default Board page boots a greedy AI on the rival seat, which would
   * race the test driver and resolve pending choices before assertions run.
   * We pin `?ai=off` so the engine only advances when the spec drives it.
   */
  async gotoFixture(id: ScenarioId, options: { ai?: "off" | "greedy" } = {}): Promise<void> {
    const ai = options.ai ?? "off";
    await this.page.goto(`/cyberpunk/simulator/tests/${id}?ai=${ai}`);
    await expect(this.playerBoard.root).toBeVisible({ timeout: 15_000 });
    await this.page.waitForFunction(() =>
      Boolean((window as unknown as { __cyberpunkEngine?: unknown }).__cyberpunkEngine),
    );
  }

  // ─── Engine state reads ─────────────────────────────────────────────────

  getPhase(): Promise<string> {
    return this.evalEngine((engine) => engine.getPhase());
  }

  getTurnNumber(): Promise<number> {
    return this.evalEngine((engine) => engine.getTurnNumber());
  }

  getActivePlayerId(): Promise<PlayerId> {
    return this.evalEngine((engine) => engine.getActivePlayerId());
  }

  getOpponentOf(player: PlayerId): Promise<PlayerId> {
    return this.evalEngine((engine, p) => engine.getOpponentOf(p), player);
  }

  getHandSize(player: PlayerId): Promise<number> {
    return this.evalEngine((engine, p) => engine.getCardsInZone("hand", p).length, player);
  }

  getDeckSize(player: PlayerId): Promise<number> {
    return this.evalEngine((engine, p) => engine.getCardsInZone("deck", p).length, player);
  }

  getFieldSize(player: PlayerId): Promise<number> {
    return this.evalEngine((engine, p) => engine.getCardsInZone("field", p).length, player);
  }

  getTrashDefinitionIds(player: PlayerId): Promise<ReadonlyArray<string>> {
    return this.evalEngine(
      (engine, p) =>
        engine
          .getCardsInZone("trash", p)
          .map((card) => (card as { definitionId: string }).definitionId),
      player,
    );
  }

  getLegendAreaDefinitionIds(player: PlayerId): Promise<ReadonlyArray<string>> {
    return this.evalEngine(
      (engine, p) =>
        engine
          .getCardsInZone("legendArea", p)
          .map((card) => (card as { definitionId: string }).definitionId),
      player,
    );
  }

  getFixerDiceCount(player: PlayerId): Promise<number> {
    return this.evalEngine((engine, p) => engine.getFixerDice(p).length, player);
  }

  getGigCount(player: PlayerId): Promise<number> {
    return this.evalEngine((engine, p) => engine.getGigCount(p), player);
  }

  getGigDice(
    player: PlayerId,
  ): Promise<ReadonlyArray<{ id: string; dieType: string; faceValue: number }>> {
    return this.evalEngine((engine, p) => engine.getGigDice(p), player);
  }

  getEddies(player: PlayerId): Promise<number> {
    return this.evalEngine((engine, p) => engine.getEddies(p), player);
  }

  getSpentLegendsCount(player: PlayerId): Promise<number> {
    return this.evalEngine((engine, p) => engine.getSpentLegends(p).length, player);
  }

  getPendingChoiceType(player: PlayerId): Promise<string | null> {
    return this.evalEngine((engine, p) => {
      const choice = engine.getPrompt(p).choice;
      return choice ? choice.type : null;
    }, player);
  }

  getEligibleTargetIds(player: PlayerId): Promise<ReadonlyArray<string>> {
    return this.evalEngine((engine, p) => {
      const eligibleIds = engine.getPrompt(p).choice?.payload.eligibleIds;
      return Array.isArray(eligibleIds) ? eligibleIds.map(String) : [];
    }, player);
  }

  getEligibleStealGigIds(player: PlayerId): Promise<ReadonlyArray<string>> {
    return this.evalEngine((engine, p) => {
      const eligibleDieIds = engine.getPrompt(p).choice?.payload.eligibleDieIds;
      return Array.isArray(eligibleDieIds) ? eligibleDieIds.map(String) : [];
    }, player);
  }

  getPendingStealGigChoice(): Promise<null | {
    chooserId: PlayerId;
    count: number;
    eligibleDieIds: string[];
  }> {
    return this.evalEngine((engine) => {
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      if (!choice || choice.type !== "chooseGigsToSteal") return null;
      return {
        chooserId: choice.chooserId as PlayerId,
        count: choice.payload?.count ?? 0,
        eligibleDieIds: (choice.payload?.eligibleDieIds ?? []).map(String),
      };
    });
  }

  /**
   * Returns the allowed die ids the active player can take, in engine order,
   * along with their die types. Mirrors the helper used in the unit tests.
   */
  getAllowedGigDice(player: PlayerId): Promise<ReadonlyArray<{ id: string; dieType: string }>> {
    return this.evalEngine((engine, p) => {
      const choice = engine.getPrompt(p).choice;
      if (!choice || choice.type !== "gainGig") {
        return [];
      }
      const allowed = choice.payload.allowedDieIds as ReadonlyArray<string>;
      const dice = engine.getState().G.gigDice;
      return allowed.map((id) => ({ id, dieType: dice[id]!.dieType }));
    }, player);
  }

  isGameOver(): Promise<boolean> {
    return this.evalEngine((engine) => engine.isGameOver());
  }

  getCardsInZone(
    zone: "hand" | "field" | "eddieArea" | "trash" | "legendArea" | "deck",
    player: PlayerId,
  ): Promise<ReadonlyArray<{ instanceId: string; definitionId: string; spent: boolean }>> {
    return this.evalEngine(
      (engine, input) =>
        engine.getCardsInZone(input.zone, input.player).map((card) => {
          const c = card as {
            instanceId: string;
            definitionId: string;
            meta?: { spent?: boolean };
          };
          return {
            instanceId: String(c.instanceId),
            definitionId: c.definitionId,
            spent: Boolean(c.meta?.spent),
          };
        }),
      { zone, player },
    );
  }

  getAttackState(): Promise<null | {
    kind: string;
    step?: string;
    attackerId?: string;
    defenderId: string | null;
    redirectedByBlocker?: boolean;
  }> {
    return this.evalEngine((engine) => engine.getAttackState());
  }

  getCardDefinitionId(cardId: string): Promise<string> {
    return this.evalEngine((engine, id) => engine.getState().G.cardIndex[id]!.definitionId, cardId);
  }

  getSearchDeckRevealedCardIds(player: PlayerId): Promise<ReadonlyArray<string>> {
    return this.evalEngine((engine, p) => {
      const choice = engine.getPrompt(p).choice;
      return choice?.type === "searchDeck"
        ? (choice.payload.revealedCardIds ?? []).map(String)
        : [];
    }, player);
  }

  async forceFixtureMainPhaseForPlayer(
    player: PlayerId,
    options: { spentCardIds?: ReadonlyArray<string> } = {},
  ): Promise<void> {
    await this.dispatchEngine(
      (engine, payload) => {
        const state = engine.getState().G;
        state.gamePhase = "main";
        state.turnMetadata.activePlayerId = payload.player;
        state.turnMetadata.pendingChoice = undefined;
        for (const cardId of payload.spentCardIds) {
          state.cardIndex[cardId]!.meta.spent = true;
        }
      },
      { player, spentCardIds: options.spentCardIds ?? [] },
    );
  }

  /** Convenience for `getPrompt(...).choice?.type === "gainGig"` workflows. */
  async pickFirstAllowedDie(player: PlayerId): Promise<string> {
    const allowed = await this.getAllowedGigDice(player);
    if (allowed.length === 0) {
      throw new Error(`No gainGig pending choice for ${player as unknown as string}`);
    }
    return allowed[0]!.id;
  }

  // ─── Engine moves ───────────────────────────────────────────────────────
  // Move methods that have a UI counterpart (a button or drop target) drive
  // through the rendered React tree — clicking the button — so the harness
  // exercises the same path a human would. The dispatch spy on the bridge
  // records every resulting engine action so specs can also verify the
  // UI→engine translation via `expectLastDispatch`.
  //
  // Moves without a UI counterpart yet (today: gainGig — no fixer-die click
  // handler) fall back to the engine bridge and call forceRender to keep
  // the rendered tree in sync. Migrate them as the UI lands.

  /** Click the side's "Mulligan" verb button. Flips Take Control if needed. */
  async mulligan(as: PlayerId): Promise<void> {
    await this.clickVerb(as, "mulligan");
  }

  /** Click the side's "Keep" verb button. */
  async keepHand(as: PlayerId): Promise<void> {
    await this.clickVerb(as, "keepHand");
  }

  /** Click the side's "Pass" verb button. */
  async passPhase(as: PlayerId): Promise<void> {
    await this.clickVerb(as, "passPhase");
  }

  /**
   * Flip the human seat to the side that maps to `player`. Mirrors the
   * "Take Control" sidebar button. Specs invoke this implicitly via
   * `clickVerb`; you only need to call it directly when reading UI state
   * for the rival side (their banner only renders when they're the human).
   */
  async takeControl(player: PlayerId): Promise<void> {
    const targetSide = this.sideForPlayer(player);
    const currentHuman = await this.getHumanSide();
    if (currentHuman === targetSide) {
      return;
    }
    await this.page.evaluate((side: "player" | "opponent") => {
      const sim = (
        window as unknown as {
          __cyberpunkSimulator?: { setHumanSide: (s: "player" | "opponent") => void };
        }
      ).__cyberpunkSimulator;
      if (!sim) {
        throw new Error("__cyberpunkSimulator not attached");
      }
      sim.setHumanSide(side);
    }, targetSide);
    const board = targetSide === "player" ? this.playerBoard : this.opponentBoard;
    await expect(board.root).toBeVisible();
  }

  /** Read the current human seat from the bridge. */
  async getHumanSide(): Promise<"player" | "opponent"> {
    return this.page.evaluate(() => {
      const sim = (
        window as unknown as {
          __cyberpunkSimulator?: { getHumanSide: () => "player" | "opponent" };
        }
      ).__cyberpunkSimulator;
      if (!sim) {
        throw new Error("__cyberpunkSimulator not attached");
      }
      return sim.getHumanSide();
    });
  }

  /**
   * Resolve a `gainGig` pending choice by clicking the die in the FixerZone.
   * Auto-flips Take Control so the chooser side is the human (the FixerZone
   * onClick only fires when the side maps to the active human seat).
   */
  async gainGig(dieId: string, as: PlayerId): Promise<void> {
    await this.takeControl(as);
    const side = this.sideForPlayer(as);
    const board = side === "player" ? this.playerBoard : this.opponentBoard;
    await board.fixerZone.locator(`[data-testid="fixer-die"][data-die-id="${dieId}"]`).click();
  }

  async playCardFromHand(cardId: string, as: PlayerId): Promise<void> {
    await this.dispatchEngine(
      (engine, payload) => engine.playCard(payload.cardId, { as: payload.as }),
      { cardId, as },
    );
  }

  async attackRival(attackerId: string, as: PlayerId): Promise<void> {
    await this.dispatchEngine(
      (engine, payload) => engine.attackRival(payload.attackerId, { as: payload.as }),
      { attackerId, as },
    );
  }

  async attackUnit(attackerId: string, defenderId: string, as: PlayerId): Promise<void> {
    await this.dispatchEngine(
      (engine, payload) =>
        engine.attackUnit(payload.attackerId, payload.defenderId, { as: payload.as }),
      { attackerId, defenderId, as },
    );
  }

  async attachGearFromHand(gearId: string, attachToId: string, as: PlayerId): Promise<void> {
    await this.dispatchEngine(
      (engine, payload) =>
        engine.attachGear(payload.gearId, payload.attachToId, { as: payload.as }),
      { gearId, attachToId, as },
    );
  }

  async goSolo(legendId: string, as: PlayerId): Promise<void> {
    await this.dispatchEngine(
      (engine, payload) =>
        engine.executeMove("goSolo", { args: { cardId: payload.legendId } }, payload.as),
      { legendId, as },
    );
  }

  async callLegend(legendId: string, as: PlayerId): Promise<void> {
    await this.dispatchEngine(
      (engine, payload) => engine.callLegend(payload.legendId, { as: payload.as }),
      { legendId, as },
    );
  }

  async useBlocker(blockerId: string, as: PlayerId): Promise<void> {
    await this.dispatchEngine(
      (engine, payload) => engine.useBlocker(payload.blockerId, { as: payload.as }),
      { blockerId, as },
    );
  }

  async resolveAttack(
    as: PlayerId,
    options: { pass?: boolean; gigIdsToSteal?: ReadonlyArray<string> } = {},
  ): Promise<void> {
    await this.dispatchEngine(
      (engine, payload) =>
        engine.resolveAttack({
          as: payload.as,
          pass: payload.pass,
          gigIdsToSteal: payload.gigIdsToSteal,
        }),
      { as, pass: options.pass, gigIdsToSteal: options.gigIdsToSteal },
    );
  }

  async resolveEffectTarget(targetIds: ReadonlyArray<string>, as: PlayerId): Promise<void> {
    await this.dispatchEngine(
      (engine, payload) =>
        engine.executeMove(
          "resolveEffectTarget",
          { args: { targetIds: payload.targetIds.slice() } },
          payload.as,
        ),
      { targetIds, as },
    );
  }

  async resolveSearchDeck(selectedCardIds: ReadonlyArray<string>, as: PlayerId): Promise<void> {
    await this.dispatchEngine(
      (engine, payload) => engine.resolveSearchDeck(payload.selectedCardIds, { as: payload.as }),
      { selectedCardIds: selectedCardIds.slice(), as },
    );
  }

  async resolveDiscardFromHand(cardIds: ReadonlyArray<string>, as: PlayerId): Promise<void> {
    await this.dispatchEngine(
      (engine, payload) => engine.resolveDiscardFromHand(payload.cardIds, { as: payload.as }),
      { cardIds: cardIds.slice(), as },
    );
  }

  executeMove(
    move: string,
    args: Record<string, unknown>,
    as: PlayerId,
  ): Promise<{ success: boolean; errorCode?: string }> {
    return this.dispatchEngine(
      (engine, payload) => engine.executeMove(payload.move, { args: payload.args }, payload.as),
      { move, args, as },
    ) as Promise<{ success: boolean; errorCode?: string }>;
  }

  /**
   * Drag a card-like locator onto a drop-target locator.
   *
   * Drives raw pointer events so dnd-kit's PointerSensor activates
   * naturally — it has a `distance: 4` activation constraint, so the helper
   * issues a small wiggle move past the threshold before the long move to
   * the target. Without that wiggle the drag never starts.
   *
   * Accepts either Locator instances or the source/target sub-locators on
   * the GameBoardSection POMs. The dispatch spy records whatever
   * EngineAction the drop-handler produced — specs assert on that.
   */
  async drag(
    source: Locator,
    target: Locator,
    options: { targetOffset?: { x: number; y: number } } = {},
  ): Promise<void> {
    const sourceBox = await source.boundingBox();
    const targetBox = await target.boundingBox();
    if (!sourceBox || !targetBox) {
      throw new Error("drag: source or target locator has no bounding box");
    }
    const sourceCenter = {
      x: sourceBox.x + sourceBox.width / 2,
      y: sourceBox.y + sourceBox.height / 2,
    };
    const targetPoint = options.targetOffset
      ? {
          x: targetBox.x + options.targetOffset.x,
          y: targetBox.y + options.targetOffset.y,
        }
      : {
          x: targetBox.x + targetBox.width / 2,
          y: targetBox.y + targetBox.height / 2,
        };
    await this.page.mouse.move(sourceCenter.x, sourceCenter.y);
    await this.page.mouse.down();
    // Past dnd-kit's 4px activation threshold — required for the drag to start.
    await this.page.mouse.move(sourceCenter.x + 8, sourceCenter.y + 8, { steps: 5 });
    // Multi-step move so dnd-kit keeps recomputing the `over` target.
    await this.page.mouse.move(targetPoint.x, targetPoint.y, { steps: 12 });
    await this.page.mouse.up();
  }

  // ─── Dispatch spy ───────────────────────────────────────────────────────
  // Every action that flows through `EngineProvider.dispatch` is recorded by
  // the bridge. Specs assert that a UI click produced the right engine call.

  /** Read the recorded action log. */
  async getDispatchLog(): Promise<ReadonlyArray<{ action: EngineAction; result: unknown }>> {
    return this.page.evaluate(() => {
      const sim = (
        window as unknown as {
          __cyberpunkSimulator?: { getDispatchLog: () => ReadonlyArray<unknown> };
        }
      ).__cyberpunkSimulator;
      if (!sim) {
        throw new Error("__cyberpunkSimulator not attached");
      }
      return sim.getDispatchLog() as ReadonlyArray<{ action: EngineAction; result: unknown }>;
    });
  }

  /** Clear the dispatch log. Call between phases to scope assertions. */
  async clearDispatchLog(): Promise<void> {
    await this.page.evaluate(() => {
      const sim = (window as unknown as { __cyberpunkSimulator?: { clearDispatchLog: () => void } })
        .__cyberpunkSimulator;
      sim?.clearDispatchLog();
    });
  }

  /**
   * Assert the most recent dispatched action matches `expected` (deep
   * equality on every key listed). Catches silent UI bugs where a button
   * click goes nowhere or dispatches the wrong shape.
   *
   * Typed as {@link EngineActionMatcher} — `type` stays required (and
   * narrows the variant), every other field is optional but must match the
   * shape of the chosen variant. So `{ type: "mulligan", as: P1 }` typechecks
   * against the `mulligan` variant only, and a typo like
   * `{ type: "mulligan", cardId: "x" }` is a compile error.
   */
  async expectLastDispatch(expected: EngineActionMatcher): Promise<void> {
    const log = await this.getDispatchLog();
    expect(log.length, "dispatch log is empty").toBeGreaterThan(0);
    const last = log[log.length - 1]!.action as Record<string, unknown>;
    for (const [key, value] of Object.entries(expected)) {
      expect(last[key], `dispatched action.${key} (full action: ${JSON.stringify(last)})`).toEqual(
        value,
      );
    }
  }

  /**
   * Assert at least one dispatch in the current scoped log matches. Useful for
   * UI actions that intentionally auto-advance and therefore leave a follow-up
   * action, such as `resolveAttack`, as the final dispatch.
   */
  async expectDispatch(expected: EngineActionMatcher): Promise<void> {
    const log = await this.getDispatchLog();
    const found = log.some(({ action }) => {
      const candidate = action as Record<string, unknown>;
      return Object.entries(expected).every(([key, value]) => candidate[key] === value);
    });
    expect(
      found,
      `expected dispatch ${JSON.stringify(expected)} in log ${JSON.stringify(
        log.map((entry) => entry.action),
      )}`,
    ).toBe(true);
  }

  // ─── Internal: side helpers ─────────────────────────────────────────────

  private sideForPlayer(player: PlayerId): "player" | "opponent" {
    return (player as unknown as string) === "p1" ? "player" : "opponent";
  }

  private promptBannerFor(player: PlayerId): PromptBanner {
    return this.sideForPlayer(player) === "player" ? this.playerPrompt : this.opponentPrompt;
  }

  /**
   * Click a verb button on the side whose engine player is `as`. Flips
   * Take Control first if the rival currently holds the seat — only the
   * human-side PromptBanner is in the DOM at any moment.
   */
  private async clickVerb(
    as: PlayerId,
    verb: "mulligan" | "keepHand" | "passPhase",
  ): Promise<void> {
    await this.takeControl(as);
    await this.promptBannerFor(as).verbButton(verb).click();
  }

  // ─── UI-mode helpers tied to the engine's active player ─────────────────

  /**
   * The human seat is fixed at "player" (P1) in the simulator's default
   * config; the rival board is "opponent" (P2). Returns the UI side that
   * matches the engine's currently active player.
   */
  async getActiveSide(): Promise<"player" | "opponent"> {
    return this.evalEngine((engine) => {
      const active = engine.getActivePlayerId() as unknown as string;
      return active === "p1" ? "player" : "opponent";
    });
  }

  /** Asserts the side whose engine player is active is in `mode`. */
  async expectActiveBoardMode(mode: "view" | "select-action" | "select-target"): Promise<void> {
    const side = await this.getActiveSide();
    const board = side === "player" ? this.playerBoard : this.opponentBoard;
    await board.expectMode(mode);
  }

  /** Map an engine `PlayerId` to the UI side. P1 → player; P2 → opponent. */
  private boardForPlayer(player: PlayerId): GameBoardSection {
    return (player as unknown as string) === "p1" ? this.playerBoard : this.opponentBoard;
  }

  // ─── Combined engine + UI assertions ────────────────────────────────────
  // Each helper asserts the engine value first (fast, exact), then asserts
  // the rendered UI matches via Playwright's auto-retrying matchers. If
  // either layer disagrees with the expected value, the test fails — so a
  // bug in either the engine OR the render path surfaces.

  /** Hand size: engine `getCardsInZone("hand")` AND `[data-testid="hand-card"]` count. */
  async expectHandSize(player: PlayerId, n: number): Promise<void> {
    expect(
      await this.getHandSize(player),
      `engine hand size for ${player as unknown as string}`,
    ).toBe(n);
    const board = this.boardForPlayer(player);
    await expect(board.handZone).toHaveAttribute("data-count", String(n));
    const faceDown = (await board.handZone.getAttribute("data-face-down")) === "true";
    const visibleCards = faceDown ? Math.min(n, 5) : n;
    await expect(board.handCards).toHaveCount(visibleCards);
  }

  /** Fixer dice count: engine `getFixerDice` AND rendered `[data-testid="fixer-die"]`. */
  async expectFixerDiceCount(player: PlayerId, n: number): Promise<void> {
    expect(
      await this.getFixerDiceCount(player),
      `engine fixer dice for ${player as unknown as string}`,
    ).toBe(n);
    await expect(this.boardForPlayer(player).fixerDice).toHaveCount(n);
  }

  /** Gig count: engine `getGigCount` AND rendered `[data-testid="gig-die"]`. */
  async expectGigCount(player: PlayerId, n: number): Promise<void> {
    expect(
      await this.getGigCount(player),
      `engine gig count for ${player as unknown as string}`,
    ).toBe(n);
    await expect(this.boardForPlayer(player).gigDice).toHaveCount(n);
  }

  async expectGigFaceValue(player: PlayerId, dieType: string, faceValue: number): Promise<void> {
    const dice = await this.getGigDice(player);
    const die = dice.find((d) => d.dieType === dieType);
    expect(die?.faceValue, `engine ${dieType} face value for ${player as unknown as string}`).toBe(
      faceValue,
    );
    await expect(this.boardForPlayer(player).gigDieByType(dieType)).toHaveAttribute(
      "aria-label",
      `${dieType.toUpperCase()}, showing ${faceValue}`,
    );
  }

  /** Eddies: engine `getEddies` AND `[data-testid="eddies-zone"][data-count]`. */
  async expectEddies(player: PlayerId, n: number): Promise<void> {
    expect(await this.getEddies(player), `engine eddies for ${player as unknown as string}`).toBe(
      n,
    );
    await expect(this.boardForPlayer(player).eddiesZone).toHaveAttribute("data-count", String(n));
  }

  /**
   * Face-down legends count: engine `getFaceDownLegends(p).length` AND rendered
   * `[data-face-down="true"]` slots. (Spent legends are not visually
   * distinguishable from ready ones when face-down, so use the engine bridge
   * directly for `getSpentLegendsCount` — there's no UI counterpart.)
   */
  async expectFaceDownLegendsCount(player: PlayerId, n: number): Promise<void> {
    const engineCount = await this.evalEngine(
      (engine, p) => engine.getFaceDownLegends(p).length,
      player,
    );
    expect(engineCount, `engine face-down legends for ${player as unknown as string}`).toBe(n);
    await expect(this.boardForPlayer(player).faceDownLegends).toHaveCount(n);
  }

  // ─── Internal: bridge to window.__cyberpunkEngine ───────────────────────

  /**
   * Call a function in the page context with the live engine instance.
   * The function and `arg` must both be serializable across the bridge.
   * Centralised here so specs and sub-POMs don't reach into `page.evaluate`.
   */
  private evalEngine<T>(fn: (engine: CyberpunkEngineHandle) => T): Promise<T>;
  private evalEngine<T, A>(fn: (engine: CyberpunkEngineHandle, arg: A) => T, arg: A): Promise<T>;
  private async evalEngine<T, A>(
    fn: (engine: CyberpunkEngineHandle, arg?: A) => T,
    arg?: A,
  ): Promise<T> {
    const fnSrc = fn.toString();
    return (await this.page.evaluate(
      (payload: { fnSrc: string; arg: unknown }) => {
        const handle = (window as unknown as { __cyberpunkEngine?: unknown }).__cyberpunkEngine;
        if (!handle) {
          throw new Error("window.__cyberpunkEngine not attached");
        }
        // eslint-disable-next-line no-eval
        const reified = (0, eval)(`(${payload.fnSrc})`) as (engine: unknown, x: unknown) => unknown;
        return reified(handle, payload.arg);
      },
      { fnSrc, arg: arg as unknown },
    )) as T;
  }

  /**
   * Same as `evalEngine` but also forces a React re-render afterwards.
   * Use for any state-mutating engine call so the rendered DOM picks up the
   * new state before the next UI assertion runs.
   */
  private dispatchEngine<T>(fn: (engine: CyberpunkEngineHandle) => T): Promise<T>;
  private dispatchEngine<T, A>(
    fn: (engine: CyberpunkEngineHandle, arg: A) => T,
    arg: A,
  ): Promise<T>;
  private async dispatchEngine<T, A>(
    fn: (engine: CyberpunkEngineHandle, arg?: A) => T,
    arg?: A,
  ): Promise<T> {
    const result = (await this.evalEngine(fn as never, arg as never)) as T;
    await this.page.evaluate(() => {
      const sim = (window as unknown as { __cyberpunkSimulator?: { forceRender: () => void } })
        .__cyberpunkSimulator;
      sim?.forceRender();
    });
    return result;
  }
}

/**
 * Minimal structural view of `CyberpunkTestEngine` — only the methods the POM
 * actually invokes. We intentionally avoid importing the concrete class type
 * here so the page-context evaluator doesn't pull in engine internals.
 */
interface CyberpunkEngineHandle {
  getPhase(): string;
  getTurnNumber(): number;
  getActivePlayerId(): PlayerId;
  getOpponentOf(p: PlayerId): PlayerId;
  getCardsInZone(
    zone: "hand" | "field" | "eddieArea" | "trash" | "legendArea" | "deck",
    p: PlayerId,
  ): ReadonlyArray<unknown>;
  getFixerDice(p: PlayerId): ReadonlyArray<unknown>;
  getGigCount(p: PlayerId): number;
  getGigDice(p: PlayerId): ReadonlyArray<{ id: string; dieType: string; faceValue: number }>;
  getEddies(p: PlayerId): number;
  getSpentLegends(p: PlayerId): ReadonlyArray<unknown>;
  getFaceDownLegends(p: PlayerId): ReadonlyArray<unknown>;
  getPrompt(p: PlayerId): {
    choice: null | {
      type: string;
      payload: {
        allowedDieIds?: ReadonlyArray<string>;
        eligibleIds?: ReadonlyArray<string>;
        eligibleDieIds?: ReadonlyArray<string>;
        revealedCardIds?: ReadonlyArray<string>;
      } & Record<string, unknown>;
    };
  };
  getState(): {
    G: {
      cardIndex: Record<string, { definitionId: string; meta: { spent?: boolean } }>;
      gamePhase: string;
      gigDice: Record<string, { dieType: string }>;
      turnMetadata: {
        activePlayerId: PlayerId;
        pendingChoice?: {
          type: string;
          chooserId?: PlayerId;
          payload?: { count?: number; eligibleDieIds?: ReadonlyArray<string> };
        };
      };
    };
  };
  isGameOver(): boolean;
  getAttackState(): null | {
    kind: string;
    step?: string;
    attackerId?: string;
    defenderId: string | null;
    redirectedByBlocker?: boolean;
  };
  mulligan(opts: { as: PlayerId }): unknown;
  keepHand(opts: { as: PlayerId }): unknown;
  gainGig(dieId: string, opts: { as: PlayerId }): unknown;
  passPhase(opts: { as: PlayerId }): unknown;
  playCard(cardId: string, opts: { as: PlayerId }): unknown;
  attackRival(attackerId: string, opts: { as: PlayerId }): unknown;
  attackUnit(attackerId: string, defenderId: string, opts: { as: PlayerId }): unknown;
  attachGear(gearId: string, attachToId: string, opts: { as: PlayerId }): unknown;
  callLegend(legendId: string, opts: { as: PlayerId }): unknown;
  useBlocker(blockerId: string, opts: { as: PlayerId }): unknown;
  resolveAttack(opts: {
    as: PlayerId;
    pass?: boolean;
    gigIdsToSteal?: ReadonlyArray<string>;
  }): unknown;
  executeMove(move: string, input: { args: Record<string, unknown> }, as: PlayerId): unknown;
  resolveSearchDeck(selectedCardIds: ReadonlyArray<string>, opts: { as: PlayerId }): unknown;
  resolveDiscardFromHand(cardIds: ReadonlyArray<string>, opts: { as: PlayerId }): unknown;
}
