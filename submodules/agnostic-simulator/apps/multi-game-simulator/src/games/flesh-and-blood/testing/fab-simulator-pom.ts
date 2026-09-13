/**
 * Fluent Page Object Model for FaB simulator jsdom integration tests.
 *
 * Verb surface mirrors unit {@link FabTestEngine} / player handles:
 * `as(hero)`, `play`, `pitch`, `pass`, `passBoth`, `blockWith`/`defend`,
 * `life`, `combat`/`combatStep`, `prompt`, zones.
 *
 * | Unit `FabTestEngine`              | Integration POM                          |
 * | --------------------------------- | ---------------------------------------- |
 * | `FabTestEngine.start(...)`        | `renderFabSimulatorScenario({ scenarioId })` then `await pom.waitForReady()` |
 * | `game.as(hero)`                   | `game.as("player-1")` / `game.as("player-2")` |
 * | `player.play(card, { target })`   | `await player.play(card, { target })`    |
 * | `player.play(card)` (no target)   | `await player.play(card)` → select UI    |
 * | `player.pitch(card)`              | `await player.pitch(card)`               |
 * | `player.pass()` / `game.passBoth` | `await player.pass()` / `await game.passBoth()` |
 * | `player.blockWith(card)`          | `await player.blockWith(card)` / `defend` |
 * | `player.life()`                   | `await player.life()`                    |
 * | `game.combat()?.step`             | `await game.combatStep()`                |
 * | `game.prompt()`                   | `await game.prompt()`                    |
 *
 * Internals click production `data-testid`s on the practice match-actions panel
 * and read board attributes — rules stay in `FabMatchRuntime`.
 */
import type { SimulatorDomDriver, SimulatorDomElement } from "@tcg/simulator-testing";

export type FabPomPlayerId = "player-1" | "player-2";

/** Priority automation modes configured from the unified Game settings tab. */
export type FabPomPriorityMode = "auto-pass" | "always-hold" | "play-and-skip";

export type FabPomCardRef = string | { readonly name?: string; readonly canonicalId?: string };

export interface FabPomPlayOptions {
  /** Opponent player id or `"hero"` for the opposing seat. When set, picks the “→ hero” play command. */
  readonly target?: string;
  /** Pitch cards by name/id (optional; first matching legal pitch command is used when needed). */
  readonly pitch?: FabPomCardRef | readonly FabPomCardRef[];
}

function cardSearchText(ref: FabPomCardRef): string {
  if (typeof ref === "string") return ref.toLowerCase();
  return (ref.name ?? ref.canonicalId ?? "").toLowerCase();
}

function seatSideForViewer(playerId: FabPomPlayerId, viewerId: FabPomPlayerId): "top" | "bottom" {
  // Viewer is always bottom seat in practice chrome.
  return playerId === viewerId ? "bottom" : "top";
}

/** Zone kinds mirrored from unit `FabPlayerHandle.zone` / seat layout. */
export type FabPomZoneKind =
  | "hand"
  | "graveyard"
  | "pitch"
  | "banished"
  | "arsenal"
  | "deck"
  | "combatChain"
  | "head"
  | "chest"
  | "arms"
  | "legs"
  | "weapon1"
  | "weapon2"
  | "hero"
  | "arena"
  | "permanent";

export class FabSimulatorPlayerHandle {
  private readonly game: FabSimulatorPom;
  readonly id: FabPomPlayerId;

  constructor(game: FabSimulatorPom, id: FabPomPlayerId) {
    this.game = game;
    this.id = id;
  }

  /** Life total from the rendered seat (`data-life`). */
  async life(): Promise<number> {
    const seat = this.game.seatRoot(this.id);
    await seat.waitFor({ state: "attached" });
    const raw = await seat.getAttribute("data-life");
    if (raw == null || raw === "") {
      throw new Error(`Missing data-life on seat ${this.id}`);
    }
    return Number(raw);
  }

  async actionPoints(): Promise<number> {
    const raw = await this.game.seatRoot(this.id).getAttribute("data-ap");
    return Number(raw ?? 0);
  }

  async resourcePoints(): Promise<number> {
    const raw = await this.game.seatRoot(this.id).getAttribute("data-rp");
    return Number(raw ?? 0);
  }

  /**
   * Visible card labels in hand (viewer seat reveals own cards).
   * Mirrors unit `player.hand()` / zone membership by name when face-up.
   */
  async hand(): Promise<string[]> {
    return this.zone("hand");
  }

  /** Hand size from the rendered hand rail (`fab-hand-${side}`). */
  async handCount(): Promise<number> {
    return this.zoneCount("hand");
  }

  /**
   * Card labels currently rendered in a seat zone (unit `player.zone(kind)` parity).
   * Uses face-up card `aria-label` / title text when available; otherwise entity ids.
   */
  async zone(kind: FabPomZoneKind): Promise<string[]> {
    const labels = this.game.readZoneCardLabels(this.id, kind);
    return labels;
  }

  async zoneCount(kind: FabPomZoneKind): Promise<number> {
    return this.game.readZoneCardCount(this.id, kind);
  }

  /** True when a face-up card whose label includes `needle` is in the zone. */
  async zoneHas(kind: FabPomZoneKind, needle: string): Promise<boolean> {
    const n = needle.toLowerCase();
    const cards = await this.zone(kind);
    return cards.some((label) => label.toLowerCase().includes(n));
  }

  /**
   * Play a card from the legal-command panel.
   * - With `target`: dispatches the command that includes the hero target (no select-attack-target UI).
   * - Without `target`: dispatches the bare play command so the engine opens select-attack-target.
   */
  async play(card: FabPomCardRef, options: FabPomPlayOptions = {}): Promise<void> {
    this.game.assertHumanIs(this.id);
    const handCountBefore = await this.handCount();
    const playedFromHand = await this.zoneHas("hand", cardSearchText(card));
    await this.game.openCardFlow("play");
    await this.game.clickCardChoice(card);
    const wantTargeted = options.target != null;
    await this.game.clickPlayCommand(card, {
      withHeroTarget: wantTargeted,
      ...(playedFromHand ? { handCountBefore } : {}),
    });
  }

  async pitch(card: FabPomCardRef): Promise<void> {
    this.game.assertHumanIs(this.id);
    await this.game.openCardFlow("pitch");
    await this.game.clickCardChoice(card);
    // Single pitch command auto-dispatches; if commands remain, click first.
    if (await this.game.hasCommandsStep()) {
      await this.game.clickFirstCommandMatching(/pitch/i);
    }
  }

  async activate(card: FabPomCardRef): Promise<void> {
    this.game.assertHumanIs(this.id);
    await this.game.openCardFlow("activate");
    await this.game.clickCardChoice(card);
    if (await this.game.hasCommandsStep()) {
      await this.game.clickFirstCommandMatching(/activate/i);
    }
  }

  async pass(): Promise<void> {
    this.game.assertHumanIs(this.id);
    await this.game.clickPass();
  }

  /** Defend with one or more cards (intent `defend`). */
  async blockWith(card: FabPomCardRef | readonly FabPomCardRef[]): Promise<void> {
    this.game.assertHumanIs(this.id);
    const cards = Array.isArray(card) ? card : [card];
    await this.game.stageDefenders(cards);
    await this.game.declareStagedDefense();
  }

  async defend(card: FabPomCardRef | readonly FabPomCardRef[]): Promise<void> {
    await this.blockWith(card);
  }

  /** Resolve select-attack-target (or other select prompt) for this actor. */
  async selectTarget(target: string): Promise<void> {
    this.game.assertHumanIs(this.id);
    await this.game.resolveSelectTarget(target);
  }
}

export class FabSimulatorPom {
  readonly dom: SimulatorDomDriver;
  /** Viewer / human seat for this render (scenario.viewerId). */
  humanId: FabPomPlayerId = "player-1";

  constructor(dom: SimulatorDomDriver) {
    this.dom = dom;
  }

  static create(dom: SimulatorDomDriver): FabSimulatorPom {
    return new FabSimulatorPom(dom);
  }

  as(playerId: string): FabSimulatorPlayerHandle {
    const id = normalizePlayerId(playerId);
    return new FabSimulatorPlayerHandle(this, id);
  }

  root(): SimulatorDomElement {
    return this.dom.getByTestId("fab-practice-page");
  }

  tabletop(): SimulatorDomElement {
    return this.dom.getByTestId("fab-tabletop");
  }

  matchActions(): SimulatorDomElement {
    return this.dom.getByTestId("fab-match-actions");
  }

  seatRoot(playerId: FabPomPlayerId): SimulatorDomElement {
    const side = seatSideForViewer(playerId, this.humanId);
    return this.dom.getByTestId(`fab-player-${side}`);
  }

  seatSide(playerId: FabPomPlayerId): "top" | "bottom" {
    return seatSideForViewer(playerId, this.humanId);
  }

  /**
   * Read zone card labels from the shipped tabletop DOM.
   * Hand uses `fab-hand-${side}`; other piles live under the seat with `data-zone`.
   */
  readZoneCardCount(playerId: FabPomPlayerId, kind: string): number {
    const root = this.zoneRootElement(playerId, kind);
    if (!root) return 0;
    const aria = root.getAttribute("aria-label") ?? "";
    const labelledCount = /(\d+)\s+cards?/i.exec(aria);
    if (kind !== "combatChain" && labelledCount) return Number(labelledCount[1]);
    const entities = Array.from(root.querySelectorAll("[data-entity-id]"));
    return kind === "combatChain"
      ? entities.filter((entity) => (entity.getAttribute("aria-label") ?? "").includes(playerId))
          .length
      : entities.length;
  }

  readZoneCardLabels(playerId: FabPomPlayerId, kind: string): string[] {
    const root = this.zoneRootElement(playerId, kind);
    if (!root) return [];
    const entities = Array.from(root.querySelectorAll("[data-entity-id]")).filter(
      (entity) =>
        kind !== "combatChain" || (entity.getAttribute("aria-label") ?? "").includes(playerId),
    );
    if (entities.length === 0) {
      // Pile may only show a count without fanned entities (e.g. dense GY).
      return [];
    }
    return entities
      .map((el) => {
        const aria = el.getAttribute("aria-label") ?? "";
        // CardFace aria is typically "Title, Kind, ownerId, …" — take title token.
        const title = aria.split(",")[0]?.trim();
        if (title && title.length > 0 && !/^face\s*down/i.test(title)) return title;
        const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
        if (text.length > 0) return text.slice(0, 80);
        return el.getAttribute("data-entity-id") ?? el.getAttribute("data-card-id") ?? "";
      })
      .filter((s) => s.length > 0);
  }

  private zoneRootElement(playerId: FabPomPlayerId, kind: string): Element | null {
    const side = this.seatSide(playerId);
    if (kind === "hand") {
      return document.querySelector(`[data-testid="fab-hand-${side}"]`);
    }
    if (kind === "combatChain") {
      return document.querySelector('[data-testid="fab-combat-chain"]');
    }
    const seat = document.querySelector(`[data-testid="fab-player-${side}"]`);
    if (!seat) return null;
    // Prefer exact data-zone match within the seat.
    const zoneAttr = kind === "combatChain" ? "combat-chain" : kind;
    return (
      seat.querySelector(`[data-zone="${zoneAttr}"]`) ??
      seat.querySelector(`.fab-zone-${zoneAttr}`) ??
      null
    );
  }

  async waitForReady(timeoutMs = 5000): Promise<void> {
    await this.root().waitFor({ timeoutMs, state: "attached" });
    await this.tabletop().waitFor({ timeoutMs, state: "attached" });
    const fixture = await this.root().getAttribute("data-fixture");
    if (fixture) {
      // Scenario boots async; wait until loading chrome is gone.
      await this.dom.waitFor(
        async () => (await this.dom.getByTestId("fab-scenario-loading").count()) === 0,
        { timeoutMs, message: "Scenario still loading" },
      );
    }
    // Infer human from bottom seat player id when present.
    const bottom = this.dom.getByTestId("fab-player-bottom");
    if ((await bottom.count()) > 0) {
      const id = await bottom.getAttribute("data-player-id");
      if (id === "player-1" || id === "player-2") {
        this.humanId = id;
      }
    }
  }

  /** Pending prompt kind from practice page root, or null. */
  async prompt(): Promise<{ kind: string } | null> {
    const kind = await this.root().getAttribute("data-prompt-kind");
    if (!kind) return null;
    return { kind };
  }

  /** Player who owns the current rules decision, even when no priority window is open. */
  async decisionActor(): Promise<FabPomPlayerId | null> {
    const actor = await this.root().getAttribute("data-decision-actor");
    return actor === "player-1" || actor === "player-2" ? actor : null;
  }

  /** Player who must act now: decision, defense declaration, or priority owner. */
  async interactionActor(): Promise<FabPomPlayerId | null> {
    const actor = await this.root().getAttribute("data-interaction-actor");
    return actor === "player-1" || actor === "player-2" ? actor : null;
  }

  /** Current turn owner projected by the practice shell. */
  async activePlayer(): Promise<FabPomPlayerId | null> {
    const playerId = await this.root().getAttribute("data-active-player");
    return playerId === "player-1" || playerId === "player-2" ? playerId : null;
  }

  /** Current engine phase projected by the practice shell. */
  async phase(): Promise<"start" | "action" | "end" | null> {
    const phase = await this.root().getAttribute("data-phase");
    return phase === "start" || phase === "action" || phase === "end" ? phase : null;
  }

  /**
   * End a deliberate main phase through the dedicated UI control.
   * Refuses to dispatch if combat, a rules layer, or a mandatory prompt owns the window.
   */
  async endActionPhase(playerId: FabPomPlayerId): Promise<void> {
    this.assertHumanIs(playerId);
    await this.waitForAnimations();
    await this.openPracticeNow();
    const [activePlayer, phase, combat, pendingEffects, prompt] = await Promise.all([
      this.activePlayer(),
      this.phase(),
      this.combatStep(),
      this.pendingEffectCount(),
      this.prompt(),
    ]);
    if (
      activePlayer !== playerId ||
      phase !== "action" ||
      combat !== null ||
      pendingEffects !== 0 ||
      prompt !== null
    ) {
      throw new Error(
        `Cannot end ${playerId}'s action phase from active=${activePlayer ?? "none"}, phase=${phase ?? "none"}, combat=${combat ?? "closed"}, effects=${pendingEffects}, prompt=${prompt?.kind ?? "none"}.`,
      );
    }
    const endTurn = this.dom.getByTestId("fab-action-end-turn");
    await endTurn.waitFor({ timeoutMs: 3000, state: "visible" });
    await endTurn.click();
  }

  /** Resolve the private end-turn pitch stack through its dedicated overlay. */
  async orderPitchStack(order: readonly FabPomCardRef[] | "as-pitched"): Promise<void> {
    await this.waitForAnimations();
    const panel = this.dom.getByTestId("fab-pitch-order-panel");
    await panel.waitFor({ timeoutMs: 3000, state: "visible" });
    if (order === "as-pitched") {
      await this.dom.getByTestId("fab-pitch-order-auto-sort").click();
    } else {
      for (const card of order) {
        const currentPanel = document.querySelector<HTMLElement>(
          '[data-testid="fab-pitch-order-panel"]',
        );
        if (!currentPanel) break; // The final forced card is placed automatically.
        const needle = cardSearchText(card);
        const candidates = Array.from(
          currentPanel.querySelectorAll<HTMLButtonElement>(
            '.fab-pitch-order-card--available[aria-label^="Choose "]',
          ),
        );
        const choice = candidates.find((button) =>
          (button.getAttribute("aria-label") ?? "").toLowerCase().includes(needle),
        );
        if (!choice) {
          throw new Error(
            `No pitch-stack card matching ${JSON.stringify(needle)}. Visible: ${candidates
              .map((button) => button.getAttribute("aria-label"))
              .join(" | ")}`,
          );
        }
        const availableBefore = candidates.length;
        choice.click();
        await this.dom.waitFor(
          async () => {
            const nextPanel = document.querySelector('[data-testid="fab-pitch-order-panel"]');
            return (
              nextPanel == null ||
              nextPanel.querySelectorAll(".fab-pitch-order-card--available").length <
                availableBefore
            );
          },
          { timeoutMs: 3000, message: `Expected ${needle} to enter the pitch-stack order` },
        );
      }
    }
    await this.dom.waitFor(
      async () => (await this.dom.getByTestId("fab-pitch-order-panel").count()) === 0,
      { timeoutMs: 5000, message: "Expected the pitch-stack ordering decision to complete" },
    );
  }

  /** Idempotently move the local practice viewer to the requested seat. */
  async takeControl(playerId: FabPomPlayerId): Promise<void> {
    const controlled = await this.root().getAttribute("data-controlled-player");
    if (controlled === playerId) {
      this.humanId = playerId;
      return;
    }
    await this.dom.getByTestId("fab-practice-quick-take-control").click();
    await this.dom.waitFor(
      async () => (await this.root().getAttribute("data-controlled-player")) === playerId,
      { timeoutMs: 3000, message: `Expected to control ${playerId}` },
    );
    this.humanId = playerId;
  }

  /** Follow the current interaction owner without oscillating seats on closed priority windows. */
  async takeControlOfDecision(): Promise<FabPomPlayerId | null> {
    const actor = await this.interactionActor();
    if (actor) await this.takeControl(actor);
    return actor;
  }

  /** Stage the visible cards themselves, preserving point-and-click coverage. */
  async stageDefenders(cards: readonly FabPomCardRef[]): Promise<readonly string[]> {
    await this.waitForAnimations();
    await this.openPracticeNow();
    if (
      (await this.interactionActor()) !== this.humanId ||
      (await this.combatStep()) !== "defend"
    ) {
      throw new Error(`Cannot stage defenders while ${this.humanId} does not own the Defend step.`);
    }

    const staged: string[] = [];
    for (const card of cards) {
      const needle = cardSearchText(card);
      const cardElement = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-testid="fab-hand-bottom"] [data-entity-id], [data-testid="fab-player-bottom"] [data-zone="head"] [data-entity-id], [data-testid="fab-player-bottom"] [data-zone="chest"] [data-entity-id], [data-testid="fab-player-bottom"] [data-zone="arms"] [data-entity-id], [data-testid="fab-player-bottom"] [data-zone="legs"] [data-entity-id]',
        ),
      ).find((element) => {
        if (staged.includes(element.dataset.entityId ?? "")) return false;
        if (
          !element.closest("button")?.querySelector('[data-card-interaction-outline="actionable"]')
        )
          return false;
        const label = `${element.getAttribute("aria-label") ?? ""} ${element.textContent ?? ""}`;
        return label.toLowerCase().includes(needle);
      });
      const entityId = cardElement?.dataset.entityId;
      const button = cardElement?.closest("button");
      if (!entityId || !(button instanceof HTMLButtonElement)) {
        throw new Error(`Could not find visible defender ${needle} on the controlled board.`);
      }
      button.click();
      await this.dom.waitFor(
        async () =>
          Array.from(document.querySelectorAll<HTMLElement>("[data-entity-id]")).some(
            (element) =>
              element.dataset.entityId === entityId &&
              element
                .closest("button")
                ?.querySelector('[data-card-interaction-outline="selected"]') != null,
          ),
        { timeoutMs: 3000, message: `Expected ${needle} to become a staged defender` },
      );
      staged.push(entityId);
    }
    return staged;
  }

  /** Submit the currently staged defense through the dedicated board control. */
  async declareStagedDefense(): Promise<void> {
    const declare = this.dom.getByTestId("fab-quick-pass");
    await declare.waitFor({ timeoutMs: 3000, state: "visible" });
    if ((await declare.getAttribute("disabled")) != null) {
      throw new Error("The staged defender set is not a legal declaration.");
    }
    await declare.click();
  }

  async hasSelectAttackTargetPrompt(): Promise<boolean> {
    if ((await this.dom.getByTestId("fab-select-attack-target-prompt").count()) > 0) {
      return true;
    }
    const prompt = await this.prompt();
    return prompt?.kind === "select-attack-target";
  }

  /** Combat step from practice page, or null when chain closed. */
  async combatStep(): Promise<string | null> {
    return this.root().getAttribute("data-combat-step");
  }

  /** Publicly rendered card, activated, or triggered layers awaiting priority passes. */
  async pendingEffectCount(): Promise<number> {
    return this.dom.locator('[data-testid^="fab-chain-stack-entry-"]').count();
  }

  /** True while the shared animation boundary blocks another command. */
  async isAnimating(): Promise<boolean> {
    return (
      document.querySelector("[data-animation-interaction-boundary]")?.hasAttribute("inert") ??
      false
    );
  }

  async waitForAnimations(timeoutMs = 6000): Promise<void> {
    await this.dom.waitFor(async () => !(await this.isAnimating()), {
      timeoutMs,
      message: "Timed out waiting for FAB animations to settle",
    });
  }

  async combat(): Promise<{ step: string } | null> {
    const step = await this.combatStep();
    return step ? { step } : null;
  }

  /** True when the human match-actions panel can pass (priority / legal pass). */
  async humanCanPass(): Promise<boolean> {
    return this.canPass();
  }

  /**
   * Human passes, then waits for the pass-only bot to return priority (when applicable).
   * Mirrors unit `passBoth` for 1v1 with opponent automation.
   *
   * Note: fixture pages set a fixed status label, so we key off pass button / combat step,
   * not the “Your priority” status string.
   */
  async passBoth(options: { botDelayMs?: number } = {}): Promise<void> {
    const botDelayMs = options.botDelayMs ?? 700;
    await this.waitForAnimations();
    const stepBefore = await this.combatStep();
    await this.clickPass();
    // Opponent bot (pass-only) may take priority; wait until human can pass again or combat advances/closes.
    await this.dom.waitFor(
      async () => {
        const step = await this.combatStep();
        if (step == null) return true;
        if (step !== stepBefore) return true;
        if (await this.canPass()) return true;
        return false;
      },
      { timeoutMs: botDelayMs + 4000, message: "Timed out waiting after passBoth" },
    );
  }

  /** Pass priority with the bot until the current top rules layer resolves. */
  async resolvePendingLayer(options: { botDelayMs?: number } = {}): Promise<void> {
    const botDelayMs = options.botDelayMs ?? 700;
    await this.waitForAnimations();
    const pendingBefore = await this.pendingEffectCount();
    const stepBefore = await this.combatStep();
    if (pendingBefore === 0 && stepBefore !== "layer") {
      throw new Error("No pending FAB rules layer to resolve.");
    }
    await this.clickPass();
    await this.dom.waitFor(
      async () =>
        (await this.pendingEffectCount()) < pendingBefore ||
        (await this.combatStep()) !== stepBefore,
      { timeoutMs: botDelayMs + 4000, message: "Timed out resolving the pending FAB rules layer" },
    );
  }

  /** Pass repeatedly until combat closes or max rounds (for undefended resolve). */
  async resolveRestOfCombat(maxPasses = 16): Promise<void> {
    for (let i = 0; i < maxPasses; i++) {
      await this.waitForAnimations();
      if ((await this.combatStep()) == null) return;

      if (!(await this.canPass())) {
        // Wait for pass-only bot (or UI refresh) to return a pass control, or combat to close.
        await this.dom.waitFor(
          async () => (await this.canPass()) || (await this.combatStep()) == null,
          { timeoutMs: 6000, message: "Timed out waiting for pass or combat close" },
        );
      }

      if ((await this.combatStep()) == null) return;
      if (await this.canPass()) {
        await this.clickPass();
        // The pass-only bot acts after 450 ms. Wait through that cycle so the
        // next iteration observes fresh legality instead of clicking the stale
        // human Pass control repeatedly while React is still settling.
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    if ((await this.combatStep()) != null) {
      throw new Error(
        `resolveRestOfCombat: combat still open at step ${await this.combatStep()} after ${maxPasses} passes`,
      );
    }
  }

  // ── Internal UI drivers (used by player handle; tests should prefer fluent API) ──

  assertHumanIs(playerId: FabPomPlayerId): void {
    if (playerId !== this.humanId) {
      throw new Error(
        `Integration POM can only drive the human viewer seat (${this.humanId}); got ${playerId}. Use botMode pass-only for the opponent.`,
      );
    }
  }

  async openCardFlow(intent: "play" | "pitch" | "defend" | "activate" | "select"): Promise<void> {
    await this.waitForAnimations();
    await this.openPracticeNow();
    // Reset to intents if mid-flow
    if ((await this.dom.getByTestId("fab-action-cards").count()) > 0) {
      // already in cards — switch intent if multi-intent
      if ((await this.dom.getByTestId(`fab-action-intent-${intent}`).count()) > 0) {
        await this.dom.getByTestId(`fab-action-intent-${intent}`).click();
        return;
      }
      return;
    }
    if ((await this.dom.getByTestId("fab-action-choose-card").count()) > 0) {
      await this.dom.getByTestId("fab-action-choose-card").click();
    }
    // Multi-intent: pick play/pitch/defend
    if ((await this.dom.getByTestId(`fab-action-intent-${intent}`).count()) > 0) {
      await this.dom.getByTestId(`fab-action-intent-${intent}`).click();
    }
    await this.dom.getByTestId("fab-action-cards").waitFor({ timeoutMs: 3000, state: "attached" });
  }

  async clickCardChoice(card: FabPomCardRef): Promise<void> {
    const needle = cardSearchText(card);
    await this.dom.getByTestId("fab-action-cards").waitFor({ timeoutMs: 3000, state: "attached" });
    const container = document.querySelector('[data-testid="fab-action-cards"]');
    if (!container) throw new Error("fab-action-cards missing");
    const candidates = Array.from(container.querySelectorAll("button"));
    const match = candidates.find((btn) => {
      const label = (btn.textContent ?? "").toLowerCase();
      const testId = (btn.getAttribute("data-testid") ?? "").toLowerCase();
      return label.includes(needle) || testId.includes(needle.replace(/\s+/g, "-"));
    });
    if (match) {
      match.click();
      return;
    }
    if (candidates.length === 1) {
      candidates[0]!.click();
      return;
    }
    throw new Error(
      `No action card choice matching ${JSON.stringify(needle)}. Visible: ${candidates
        .map((b) => b.textContent?.trim())
        .join(" | ")}`,
    );
  }

  async hasCommandsStep(): Promise<boolean> {
    const legal = this.dom.getByTestId("fab-legal-moves");
    // Commands step can be either a payment chooser or a direct action chooser.
    const text = await legal.textContent();
    return /choose a legal (?:payment|action)/i.test(text);
  }

  async clickPlayCommand(
    card: FabPomCardRef,
    options: { withHeroTarget: boolean; handCountBefore?: number },
  ): Promise<void> {
    // Auto-dispatch may have already run if only one command.
    if (await this.hasCommandsStep()) {
      const needle = cardSearchText(card);
      await this.clickCommandMatching((label) => {
        const lower = label.toLowerCase();
        const mentions = lower.includes(needle.split(" ")[0] ?? needle);
        return mentions && /^play\b/i.test(label.trim());
      });
    }

    await this.dom.waitFor(
      async () => {
        // Count the physical hand transfer, not a matching name: duplicate
        // copies legitimately remain and must not make a finished play look stale.
        if (options.handCountBefore !== undefined) {
          return (await this.as(this.humanId).handCount()) < options.handCountBefore;
        }
        return (
          (await this.pendingEffectCount()) > 0 ||
          (await this.combatStep()) != null ||
          (await this.prompt()) != null ||
          (await this.dom.getByTestId("interaction-resolution-prompt").count()) > 0
        );
      },
      {
        timeoutMs: 3000,
        message: `Begin play did not create a rules layer, decision, or card transfer. Actions: ${await this.dom
          .getByTestId("fab-legal-moves")
          .textContent()}`,
      },
    );
  }

  async resolveSelectTarget(target: string): Promise<void> {
    // Open select flow if needed
    if ((await this.dom.getByTestId("fab-action-choose-card").count()) > 0) {
      await this.dom.getByTestId("fab-action-choose-card").click();
    }
    if ((await this.dom.getByTestId("fab-action-intent-select").count()) > 0) {
      await this.dom.getByTestId("fab-action-intent-select").click();
    }
    // Select commands may be card choices (target ids) or direct command buttons
    if ((await this.dom.getByTestId("fab-action-cards").count()) > 0) {
      // One choice per legal target — pick first or match player id in testid
      const targetId =
        target === "hero" ? (this.humanId === "player-1" ? "player-2" : "player-1") : target;
      try {
        await this.dom.locator(`[data-testid*="${targetId}"]`).first().click();
      } catch {
        await this.dom.locator('[data-testid^="fab-action-card-"]').first().click();
      }
      if (await this.hasCommandsStep()) {
        await this.clickFirstCommandMatching(/select/i);
      }
      return;
    }
    // Commands already listed at intents level as select moves
    const targetId =
      target === "hero" ? (this.humanId === "player-1" ? "player-2" : "player-1") : String(target);
    await this.clickCommandMatching(
      (label, testId) =>
        testId.includes(targetId) || label.toLowerCase().includes(targetId.toLowerCase()),
    );
  }

  async clickPass(): Promise<void> {
    await this.waitForAnimations();
    // The quick and chain controls remain mounted while History is selected.
    // Return to the live surface before resolving a control so the POM never
    // dispatches a stale-looking action from the wrong practice tab.
    await this.openPracticeNow();
    await this.dom.waitFor(async () => this.canPass(), {
      timeoutMs: 3000,
      message: "Expected a current FAB pass control after returning to Now",
    });
    const quickPass = this.dom.getByTestId("fab-quick-pass");
    if ((await quickPass.count()) > 0 && (await quickPass.getAttribute("disabled")) == null) {
      await quickPass.click();
      return;
    }
    const sidebarPass = this.dom.getByTestId("fab-action-pass-priority");
    if ((await sidebarPass.count()) > 0 && (await sidebarPass.getAttribute("disabled")) == null) {
      await sidebarPass.click();
      return;
    }
    const chainPass = this.dom.getByTestId("fab-chain-pass-priority");
    if ((await chainPass.count()) > 0 && (await chainPass.getAttribute("disabled")) == null) {
      await chainPass.click();
      return;
    }
    const interactionPass = this.interactionPassButton();
    if (interactionPass) {
      interactionPass.click();
      return;
    }
    throw new Error("A current FAB pass control disappeared before it could be clicked.");
  }

  async canPass(): Promise<boolean> {
    return (
      document.querySelector(
        '[data-testid="fab-quick-pass"]:not([disabled]), [data-testid="fab-action-pass-priority"]:not([disabled]), [data-testid="fab-chain-pass-priority"]:not([disabled]), [data-testid="fab-action-pass"]:not([disabled])',
      ) != null || this.interactionPassButton() != null
    );
  }

  private interactionPassButton(): HTMLButtonElement | null {
    return (
      Array.from(
        document.querySelectorAll<HTMLButtonElement>(
          '[data-testid="interaction-resolution-prompt"] button:not([disabled])',
        ),
      ).find((button) =>
        /^(pass priority|close combat chain)$/i.test(button.textContent?.trim() ?? ""),
      ) ?? null
    );
  }

  // ── Priority automation (auto-pass / always-hold / play-and-skip) drivers ──

  private async clickPortalControl(role: string, name: string): Promise<void> {
    const findTarget = () =>
      Array.from(document.querySelectorAll<HTMLElement>(`[role="${role}"]`)).find(
        (element) =>
          element.getAttribute("aria-label") === name || element.textContent?.trim() === name,
      );
    await this.dom.waitFor(async () => findTarget() != null, {
      timeoutMs: 3000,
      message: `Expected ${role} ${name} to appear`,
    });
    findTarget()?.click();
  }

  private async openPrioritySettings(): Promise<void> {
    await this.dom.getByRole("button", { name: "Open your player actions" }).click();
    await this.clickPortalControl("menuitem", "Settings");
    await this.clickPortalControl("tab", "Game");
  }

  private async closePrioritySettings(): Promise<void> {
    const findClose = () =>
      document.querySelector<HTMLButtonElement>('button[aria-label="Close settings"]');
    await this.dom.waitFor(async () => findClose() != null, {
      timeoutMs: 3000,
      message: "Expected the settings dialog close button",
    });
    findClose()!.click();
  }

  /** True when the priority control is draining for the current pass-only window. */
  async hasPassCountdown(): Promise<boolean> {
    return (
      document.querySelector(
        '[data-testid="fab-priority-automation-toggle"][data-countdown="true"]',
      ) != null
    );
  }

  /** Wait for the pass countdown to appear (present) or disappear. */
  async expectPassCountdown(present: boolean, timeoutMs = 5000): Promise<void> {
    await this.dom.waitFor(async () => (await this.hasPassCountdown()) === present, {
      timeoutMs,
      message: `Expected the pass countdown to ${present ? "appear" : "disappear"}`,
    });
  }

  /** Cancel the countdown through the integrated Hold control. */
  async holdPriority(): Promise<void> {
    // While a countdown runs the control renders exactly one button (the
    // cancel); the wrapper div itself carries no handler.
    const hold = this.dom
      .getByTestId("fab-priority-automation-toggle")
      .locator('button[data-countdown="true"]');
    await hold.waitFor({ timeoutMs: 3000, state: "attached" });
    await hold.click();
  }

  /** The seat's selected priority mode, or null when unavailable. */
  async priorityMode(): Promise<FabPomPriorityMode | null> {
    await this.openPrioritySettings();
    const selected = document.querySelector(
      '[role="dialog"] [role="radio"][aria-checked="true"][data-testid^="fab-priority-mode-"]',
    );
    if (!selected) {
      await this.closePrioritySettings();
      return null;
    }
    const testId = selected.getAttribute("data-testid") ?? "";
    const mode = testId.replace(/^fab-priority-mode-/, "") as FabPomPriorityMode;
    await this.closePrioritySettings();
    if (mode !== "auto-pass" && mode !== "always-hold" && mode !== "play-and-skip") {
      return null;
    }
    return mode;
  }

  /** Wait for a settings-dialog control to be attached and enabled, then click. */
  private async clickSettingsControl(selector: string, description: string): Promise<void> {
    await this.dom.waitFor(
      async () => {
        const target = document.querySelector<HTMLButtonElement>(selector);
        return target != null && !target.disabled;
      },
      { timeoutMs: 3000, message: `Expected ${description} to be enabled` },
    );
    document.querySelector<HTMLButtonElement>(selector)!.click();
  }

  /** Select a priority mode through the unified Game settings tab. */
  async selectPriorityMode(mode: FabPomPriorityMode): Promise<void> {
    await this.openPrioritySettings();
    await this.clickSettingsControl(
      `[data-testid="fab-priority-mode-${mode}"]`,
      `the ${mode} priority mode radio`,
    );
    await this.closePrioritySettings();
  }

  /** Arm the one-shot hold through the Game settings tab. */
  async armPriorityHold(): Promise<void> {
    await this.openPrioritySettings();
    await this.clickSettingsControl(
      '[data-testid="fab-priority-hold-arm"]',
      "the Hold next arm button",
    );
    await this.closePrioritySettings();
  }

  /**
   * Configure one visible card's Instant priority behavior through its
   * point-and-click board control. Auto-yield never activates the ability; it
   * only lets the engine pass when that card's Instant is the sole remaining
   * substantive action.
   */
  async setInstantAutoYield(card: FabPomCardRef, enabled = true): Promise<void> {
    await this.waitForAnimations();
    await this.openPracticeNow();
    const needle = cardSearchText(card);
    const findControl = () =>
      Array.from(
        document.querySelectorAll<HTMLButtonElement>(
          'button[aria-label^="Configure Instant auto-yield for "]',
        ),
      ).find((button) => (button.getAttribute("aria-label") ?? "").toLowerCase().includes(needle));

    const control = findControl();
    if (control) {
      const before = control.getAttribute("aria-label") ?? "";
      const alreadyEnabled = /Current setting: Auto-yield this card$/i.test(before);
      if (alreadyEnabled === enabled) return;

      control.click();
      const optionName = enabled ? "Auto-yield this card" : "Ask every priority window";
      const findOption = () =>
        Array.from(
          document.querySelectorAll<HTMLButtonElement>(
            '[role="group"][aria-label="Instant priority behavior"] button',
          ),
        ).find((button) => (button.textContent ?? "").includes(optionName));
      await this.dom.waitFor(async () => findOption() != null && !findOption()!.disabled, {
        timeoutMs: 3000,
        message: `Expected the ${optionName} option to be enabled for ${JSON.stringify(needle)}`,
      });
      findOption()!.click();
    } else {
      // Desktop hand cards expose the same command through the standard card
      // context menu rather than an inline badge.
      const cardElement = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-testid="fab-player-bottom"] [data-sim-entity-id], [data-testid="fab-hand-bottom"] [data-entity-id]',
        ),
      ).find((element) => {
        const label = `${element.getAttribute("aria-label") ?? ""} ${element.textContent ?? ""}`;
        return label.toLowerCase().includes(needle);
      });
      if (!cardElement) {
        throw new Error(`Expected a visible card matching ${JSON.stringify(needle)}`);
      }
      cardElement.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, cancelable: true, button: 2 }),
      );
      const findMenuItem = () =>
        Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).find((item) =>
          /^(Auto-yield this card|Stop auto-yielding this card)/i.test(
            item.textContent?.trim() ?? "",
          ),
        );
      await this.dom.waitFor(async () => findMenuItem() != null, {
        timeoutMs: 3000,
        message: `Expected an Instant auto-yield menu item for ${JSON.stringify(needle)}`,
      });
      const item = findMenuItem()!;
      const alreadyEnabled = /^Stop auto-yielding this card/i.test(item.textContent?.trim() ?? "");
      if (alreadyEnabled === enabled) {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        return;
      }
      if (item.getAttribute("aria-disabled") === "true") {
        throw new Error(`Instant auto-yield is disabled for ${JSON.stringify(needle)}`);
      }
      item.click();
    }

    await this.dom.waitFor(
      async () => {
        const control = findControl();
        if (!control) return true; // The command may immediately drain the window.
        const label = control.getAttribute("aria-label") ?? "";
        return enabled
          ? /Current setting: Auto-yield this card$/i.test(label)
          : /Current setting: Ask every priority window$/i.test(label);
      },
      {
        timeoutMs: 4000,
        message: `Instant auto-yield did not update for ${JSON.stringify(needle)}`,
      },
    );
  }

  /** Current rendered Instant auto-yield state for one visible card. */
  async instantAutoYieldEnabled(card: FabPomCardRef): Promise<boolean | null> {
    await this.waitForAnimations();
    await this.openPracticeNow();
    const needle = cardSearchText(card);
    const control = Array.from(
      document.querySelectorAll<HTMLButtonElement>(
        'button[aria-label^="Configure Instant auto-yield for "]',
      ),
    ).find((button) => (button.getAttribute("aria-label") ?? "").toLowerCase().includes(needle));
    if (control) {
      return /Current setting: Auto-yield this card$/i.test(
        control.getAttribute("aria-label") ?? "",
      );
    }
    const cardElement = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-testid="fab-player-bottom"] [data-sim-entity-id], [data-testid="fab-hand-bottom"] [data-entity-id]',
      ),
    ).find((element) => {
      const label = `${element.getAttribute("aria-label") ?? ""} ${element.textContent ?? ""}`;
      return label.toLowerCase().includes(needle);
    });
    if (!cardElement) return null;
    cardElement.dispatchEvent(
      new MouseEvent("contextmenu", { bubbles: true, cancelable: true, button: 2 }),
    );
    let enabled: boolean | null = null;
    await this.dom.waitFor(
      async () => {
        const item = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]')).find(
          (candidate) =>
            /^(Auto-yield this card|Stop auto-yielding this card)/i.test(
              candidate.textContent?.trim() ?? "",
            ),
        );
        if (!item) return false;
        enabled = /^Stop auto-yielding this card/i.test(item.textContent?.trim() ?? "");
        return true;
      },
      { timeoutMs: 3000, message: `Expected an Instant auto-yield menu item for ${needle}` },
    );
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    return enabled;
  }

  /** Who holds priority per the board root (`data-priority-owner`), or null. */
  async priorityOwner(): Promise<"self" | "opponent" | "none" | null> {
    const owner = document
      .querySelector('[data-testid="fab-board"]')
      ?.getAttribute("data-priority-owner");
    if (owner === "self" || owner === "opponent" || owner === "none") return owner;
    return null;
  }

  private async openPracticeNow(): Promise<void> {
    if ((await this.dom.getByTestId("fab-practice-now").count()) > 0) return;
    const findNowTab = () =>
      Array.from(document.querySelectorAll<HTMLButtonElement>('[role="tab"]')).find(
        (tab) => tab.textContent?.trim() === "Now",
      );
    await this.dom.waitFor(async () => findNowTab() != null, {
      timeoutMs: 3000,
      message: "Expected the Now tab to appear",
    });
    // React may replace the controlled tab strip while deferred command work
    // commits, so resolve and click the live DOM node in one synchronous step.
    findNowTab()!.click();
    await this.dom.getByTestId("fab-practice-now").waitFor({ timeoutMs: 3000, state: "attached" });
  }

  async clickFirstCommandMatching(pattern: RegExp): Promise<void> {
    await this.clickCommandMatching((label) => pattern.test(label));
  }

  async clickCommandMatching(predicate: (label: string, testId: string) => boolean): Promise<void> {
    const legal = this.dom.getByTestId("fab-legal-moves");
    await legal.waitFor({ timeoutMs: 3000, state: "attached" });
    // Scan the rendered command buttons because the DOM driver intentionally
    // exposes no indexed locator operation.
    const container = document.querySelector('[data-testid="fab-legal-moves"]');
    if (!container) throw new Error("fab-legal-moves missing");
    const candidates = Array.from(container.querySelectorAll("button"));
    for (const btn of candidates) {
      const label = btn.textContent ?? "";
      const testId = btn.getAttribute("data-testid") ?? "";
      if (predicate(label, testId)) {
        btn.click();
        return;
      }
    }
    throw new Error(
      `No command matched predicate. Visible: ${candidates.map((b) => b.textContent?.trim()).join(" | ")}`,
    );
  }
}

export function createFabSimulatorPom(dom: SimulatorDomDriver): FabSimulatorPom {
  return FabSimulatorPom.create(dom);
}

function normalizePlayerId(id: string): FabPomPlayerId {
  if (id === "player-1" || id === "player-2") return id;
  // Allow hero-like aliases used in unit tests
  const lower = id.toLowerCase();
  if (lower.includes("rhinar") || lower === "p1" || lower === "a") return "player-1";
  if (lower.includes("bravo") || lower === "p2" || lower === "b") return "player-2";
  throw new Error(`Unknown player id: ${id}`);
}
