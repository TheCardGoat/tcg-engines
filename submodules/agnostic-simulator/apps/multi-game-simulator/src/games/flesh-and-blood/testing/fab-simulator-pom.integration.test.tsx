/**
 * FaB simulator integration tests (jsdom + Testing Library).
 *
 * Drives the **real** practice play surface through {@link FabSimulatorPom}
 * only — no raw screen.getBy in the cases below.
 *
 * Behavioral oracles parallel unit dual-target tests in the engine package:
 * - begin play creates a normal card layer before combat
 * - the sole opposing hero target is declared without a redundant prompt
 * - undefended Snatch → opponent life 16; attacker hand keeps the three
 *   Ravenous Rabble copies / Snatch in GY
 * - defend step blockWith → reduced life damage
 */
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { installBrowserShims } from "../../../testing/browser-shims";
import { renderFabSimulatorScenario, type FabSimulatorRender } from "./render-fab-simulator";

describe("FaB simulator POM integration · dual-target combat", () => {
  let session: FabSimulatorRender | null = null;

  beforeEach(() => {
    installBrowserShims();
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });
  });

  afterEach(() => {
    session?.unmount();
    session = null;
    vi.restoreAllMocks();
  });

  async function bootDualTarget() {
    session = renderFabSimulatorScenario({ scenarioId: "dual-target-open" });
    await session.pom.waitForReady();
    return session.pom;
  }

  it("play WITH legal target skips select-attack-target UI and deals damage (life 16)", async () => {
    const game = await bootDualTarget();
    const attacker = game.as("player-1");
    const defender = game.as("player-2");

    expect(await defender.life()).toBe(20);
    expect(await attacker.handCount()).toBe(4);
    expect(await attacker.zoneHas("hand", "Snatch")).toBe(true);
    expect(await game.hasSelectAttackTargetPrompt()).toBe(false);

    // Fluent mirror of unit: Bravo.play(snatch, { target: Dash.id })
    await attacker.play("Snatch", { target: "player-2" });

    expect(await game.hasSelectAttackTargetPrompt()).toBe(false);
    expect(await game.prompt()).toBeNull();
    expect(await game.combatStep()).toBe("defend");
    await game.waitForAnimations();
    // The attack card layer is represented by the combat chain itself, not a
    // duplicate generic stack entry.
    expect(await game.pendingEffectCount()).toBe(0);
    // Card left hand for the stack/chain (not still sitting in hand rail);
    // the three Ravenous Rabble copies remain in hand.
    expect(await attacker.handCount()).toBe(3);

    await game.resolveRestOfCombat();

    expect(await game.combatStep()).toBeNull();
    expect(await defender.life()).toBe(16);
    // Hit → draw: hand may have 1 deck card, but not Snatch.
    expect(await attacker.zoneHas("hand", "Snatch")).toBe(false);
    expect(await attacker.handCount()).toBeGreaterThanOrEqual(0);
  }, 30_000);

  it("play without an explicit target declares the sole opposing hero before combat", async () => {
    const game = await bootDualTarget();
    const attacker = game.as("player-1");
    const defender = game.as("player-2");

    expect(await attacker.handCount()).toBe(4);

    await attacker.play("Snatch");

    expect(await game.hasSelectAttackTargetPrompt()).toBe(false);
    expect(await game.prompt()).toBeNull();
    expect(await game.combatStep()).toBe("defend");
    await game.waitForAnimations();
    expect(await game.pendingEffectCount()).toBe(0);

    expect(await game.hasSelectAttackTargetPrompt()).toBe(false);
    expect(await game.combatStep()).toBe("defend");
    expect(await attacker.handCount()).toBe(3);

    await game.resolveRestOfCombat();

    expect(await defender.life()).toBe(16);
    expect(await attacker.zoneHas("hand", "Snatch")).toBe(false);
  }, 30_000);

  it("settles one played copy while identical cards remain in hand", async () => {
    const game = await bootDualTarget();
    const attacker = game.as("player-1");

    expect(await attacker.handCount()).toBe(4);
    await attacker.play("Ravenous Rabble", { target: "player-2" });

    expect(await attacker.handCount()).toBe(3);
    expect(await attacker.zoneHas("hand", "Ravenous Rabble")).toBe(true);
    expect(await game.combatStep()).toBe("defend");
  }, 30_000);

  it("returns to NOW before the POM passes priority from History", async () => {
    const game = await bootDualTarget();
    const attacker = game.as("player-1");
    await attacker.play("Snatch", { target: "player-2" });

    await session!.dom.getByRole("tab", { name: "History" }).click();
    expect(await session!.dom.getByTestId("fab-practice-now").count()).toBe(0);

    await game.clickPass();

    expect(await session!.dom.getByTestId("fab-practice-now").count()).toBe(1);
  }, 30_000);

  it("changes practice seats idempotently through the POM", async () => {
    const game = await bootDualTarget();
    expect(game.humanId).toBe("player-1");

    await game.takeControl("player-2");
    expect(game.humanId).toBe("player-2");
    expect(await game.root().getAttribute("data-controlled-player")).toBe("player-2");

    await game.takeControl("player-2");
    expect(await game.root().getAttribute("data-controlled-player")).toBe("player-2");

    await game.takeControl("player-1");
    expect(game.humanId).toBe("player-1");
    expect(await game.root().getAttribute("data-controlled-player")).toBe("player-1");
  }, 30_000);

  it("enters the controlled player's end phase through the dedicated control", async () => {
    const game = await bootDualTarget();

    expect(await game.activePlayer()).toBe("player-1");
    expect(await game.phase()).toBe("action");
    await game.endActionPhase("player-1");

    await session!.dom.waitFor(async () => (await game.phase()) === "end", {
      timeoutMs: 5000,
      message: "Expected the player to enter the end phase",
    });
    expect(await game.activePlayer()).toBe("player-1");
    expect((await game.prompt())?.kind).toBe("turn-arsenal");
  }, 30_000);

  it("refuses to end the action phase while combat owns the window", async () => {
    const game = await bootDualTarget();
    await game.as("player-1").play("Snatch", { target: "player-2" });

    await expect(game.endActionPhase("player-1")).rejects.toThrow(
      /Cannot end player-1's action phase/,
    );
    expect(await game.combatStep()).not.toBeNull();
  }, 30_000);

  it("orders the private pitch stack through the overlay instead of zone-card previews", async () => {
    session = renderFabSimulatorScenario({
      scenarioId: "pitch-stack-four-cards",
      search: "ai=off",
    });
    const game = session.pom;
    await game.waitForReady();

    expect((await game.prompt())?.kind).toBe("turn-pitch-order");
    await game.orderPitchStack(["Sink Below", "Snatch", "Disable", "Nimblism"]);

    expect(await game.prompt()).toBeNull();
  }, 30_000);

  it("defend-open: blockWith hand card reduces damage via UI defend intent", async () => {
    /**
     * defend-open: Snatch (power 4) already at Defend; human is defender (player-2).
     * Enlightened Strike has defense 3 → net 1 damage → life 19.
     * Opponent (attacker) uses pass-only bot so resolveRestOfCombat can finish.
     */
    session = renderFabSimulatorScenario({
      scenarioId: "defend-open",
      search: "ai=pass-only",
    });
    await session.pom.waitForReady();
    const game = session.pom;
    const defender = game.as("player-2");

    expect(game.humanId).toBe("player-2");
    expect(await game.combatStep()).toBe("defend");
    expect(await defender.life()).toBe(20);
    expect(await defender.handCount()).toBeGreaterThanOrEqual(1);
    expect(await defender.zoneHas("hand", "Enlightened Strike")).toBe(true);
    expect(await game.interactionActor()).toBe("player-2");

    await defender.blockWith("Enlightened Strike");

    // Declared block: card left hand for the chain.
    await game.waitForAnimations();
    expect(await defender.zoneHas("hand", "Enlightened Strike")).toBe(false);

    await game.resolveRestOfCombat();

    expect(await game.combatStep()).toBeNull();
    // 20 − (4 − 3) = 19
    expect(await defender.life()).toBe(19);
    // Defender's block card typically ends in GY after chain close.
    expect(await defender.zoneHas("graveyard", "Enlightened Strike")).toBe(true);
  }, 30_000);

  it("activates Corpse Cover from the combat chain during the Reaction Step", async () => {
    session = renderFabSimulatorScenario({
      scenarioId: "usurp-corpse-cover-defense-board",
      search: "ai=pass-only",
    });
    await session.pom.waitForReady();
    const game = session.pom;
    const defender = game.as("player-2");

    expect(game.humanId).toBe("player-2");
    expect(await game.combatStep()).toBe("reaction");
    expect(await defender.zoneHas("combatChain", "Corpse Cover")).toBe(true);

    await defender.activate("Corpse Cover");
    await game.resolveRestOfCombat();
    // Snatch's projected 1 damage is fully covered by the 2-point prevention effect.
    expect(await defender.life()).toBe(20);
  }, 30_000);

  it("CR 4.4.3f: the player on the draw refills after defending through the practice shell", async () => {
    session = renderFabSimulatorScenario({
      scenarioId: "defend-open",
      search: "ai=pass-only",
    });
    await session.pom.waitForReady();
    const game = session.pom;
    const defender = game.as("player-2");

    expect(game.humanId).toBe("player-2");
    expect(await defender.handCount()).toBe(3);
    await defender.blockWith("Enlightened Strike");
    await session.dom.waitFor(async () => (await defender.handCount()) === 2, {
      timeoutMs: 3_000,
      message: "The defending card did not leave the rendered hand",
    });
    expect(await defender.handCount()).toBe(2);

    await game.resolveRestOfCombat();
    await session.dom.waitFor(async () => (await defender.handCount()) === 4, {
      timeoutMs: 8_000,
      message: "The player on the draw did not refill after the bot ended turn 1",
    });

    expect(await defender.handCount()).toBe(4);
    expect(await game.seatRoot("player-2").getAttribute("data-turn")).toBe("true");
  }, 30_000);
});

describe("FaB simulator POM integration · animation labs", () => {
  let session: FabSimulatorRender | null = null;

  beforeEach(() => {
    installBrowserShims();
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });
  });

  afterEach(() => {
    session?.unmount();
    session = null;
    vi.restoreAllMocks();
  });

  it("auto-yields a visible Instant source through its point-and-click board control", async () => {
    session = renderFabSimulatorScenario({
      scenarioId: "hand-play-or-activate",
      search: "ai=off",
    });
    const game = session.pom;
    await game.waitForReady();

    // Cosmic Duality's Instant remains a real available action. Configuring its
    // card-scoped yield tells the engine to skip only windows where that
    // ability is the last reason priority would otherwise be held.
    expect(await game.instantAutoYieldEnabled("Cosmic Duality")).toBe(false);
    await game.setInstantAutoYield("Cosmic Duality");
    expect(await game.instantAutoYieldEnabled("Cosmic Duality")).toBe(true);

    // The inverse is equally point-and-click and restores deliberate holds.
    await game.setInstantAutoYield("Cosmic Duality", false);
    expect(await game.instantAutoYieldEnabled("Cosmic Duality")).toBe(false);
  }, 30_000);

  it("activates a real shuffle-self cost and settles the item in the deck", async () => {
    session = renderFabSimulatorScenario({
      scenarioId: "reveal-and-shuffle",
      search: "ai=off",
    });
    const game = session.pom;
    await game.waitForReady();
    const player = game.as("player-1");
    await player.activate("Shuffle Lab Hood");
    await game.waitForAnimations();

    expect(await player.zoneHas("head", "Shuffle Lab Hood")).toBe(false);
  }, 30_000);

  it("pays Arcane Barrier 1 on the defender view and reduces Voltic Bolt damage to 4", async () => {
    session = renderFabSimulatorScenario({ scenarioId: "damage-prevention" });
    const game = session.pom;
    await game.waitForReady();
    // The scenario is the defender's view: Oscilio faces Voltic Bolt (5 arcane)
    // with Nullrune Robe's Arcane Barrier 1 and exactly 1 resource to pay.
    const defender = game.as("player-2");
    expect(await defender.life()).toBe(20);
    expect(await defender.resourcePoints()).toBe(1);
    expect(await game.decisionActor()).toBe("player-2");

    await defender.chooseOption(/Nullrune Robe · Pay 1 resource · Prevent 1/);
    await game.waitForAnimations();
    await session.dom.waitFor(async () => (await defender.life()) === 16, {
      timeoutMs: 8_000,
      message: "Barrier prevention did not reduce the bolt to 4 damage",
    });

    expect(await defender.life()).toBe(16);
    expect(await defender.resourcePoints()).toBe(0);
    expect(await game.prompt()).toBeNull();
  }, 30_000);
});
