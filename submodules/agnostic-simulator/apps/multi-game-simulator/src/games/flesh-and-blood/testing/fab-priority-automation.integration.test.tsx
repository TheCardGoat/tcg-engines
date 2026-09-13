/**
 * FaB simulator POM integration · priority automation (auto-pass /
 * always-hold / play-and-skip) on the shipped practice surface.
 *
 * Fixture: `defend-declared` — the viewer is the ATTACKER (Rhinar) whose hand
 * is empty after blocks are declared (Alpha Rampage played, three Nimblism
 * pitched), so every remaining window — defend-step reactions, then the
 * damage and resolution steps — is pass-only: the canonical auto-pass
 * ladder. `ai=pass-only` lets the defending bot return priority automatically.
 *
 * Oracles:
 * - always-hold default arms the 5 s countdown on each pass-only window;
 *   Hold defers to an ordinary manual pass (bluff timing stays with the
 *   player), the gate re-arms per window, and an unattended countdown
 *   eventually submits the passes itself.
 * - Toggling the seat to auto-pass mid-match drains the windows *inside the
 *   engine* (practice parity for the in-dispatch drain) — no countdown, no
 *   client-side pass logic, and the chain closes without a human pass.
 * - play-and-skip keeps holding the pass-only *response* windows (bluff
 *   preservation): the countdown still arms instead of the engine draining.
 * - Under play-and-skip, playing a card hands priority to the opponent with
 *   no holder click: the engine skips the seat's own follow-up window, the
 *   pass-only bot returns it, and the card layer resolves untouched.
 */
// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { installBrowserShims } from "../../../testing/browser-shims";
import { renderFabSimulatorScenario, type FabSimulatorRender } from "./render-fab-simulator";

describe("FaB simulator POM integration · priority automation", () => {
  let session: FabSimulatorRender | null = null;

  beforeEach(() => {
    installBrowserShims();
    window.localStorage.clear();
    window.sessionStorage.clear();
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

  async function bootDefendDeclared() {
    session = renderFabSimulatorScenario({
      scenarioId: "defend-declared",
      search: "ai=pass-only",
    });
    await session.pom.waitForReady();
    await session.pom.waitForAnimations();
    return session.pom;
  }

  async function bootDualTarget() {
    session = renderFabSimulatorScenario({ scenarioId: "dual-target-open" });
    await session.pom.waitForReady();
    await session.pom.waitForAnimations();
    return session.pom;
  }

  async function selectAlwaysHold(game: Awaited<ReturnType<typeof bootDefendDeclared>>) {
    await game.selectPriorityMode("always-hold");
    await game.dom.waitFor(async () => (await game.priorityMode()) === "always-hold", {
      timeoutMs: 4000,
      message: "Expected the in-match control to report always-hold",
    });
  }

  it("always-hold arms the countdown on the pass-only window; Hold defers to a manual pass", async () => {
    const game = await bootDefendDeclared();

    await selectAlwaysHold(game);
    await game.expectPassCountdown(true);
    await game.holdPriority();
    await game.expectPassCountdown(false);

    // Holding kept the window open — the chain still waits on our pass.
    expect(await game.combatStep()).not.toBeNull();

    // The manual pass closes the defend-step window; the engine then opens the
    // reaction step with priority back on the attacker (the active player),
    // whose empty hand is pass-only again — the gate must re-arm per window.
    await game.clickPass();
    await game.dom.waitFor(async () => (await game.combatStep()) === "reaction", {
      timeoutMs: 6000,
      message: "Timed out waiting for the reaction step after the manual pass",
    });
    await game.expectPassCountdown(true);

    // Hold again, then pass manually: bluff timing stays with the player on
    // every window; the pass-only bot then closes the chain on its own.
    await game.holdPriority();
    await game.expectPassCountdown(false);
    await game.clickPass();

    // With the hand empty, the remaining damage- and resolution-step windows
    // are pass-only too: the gate re-arms on each, and their 5 s expiries
    // submit the passes themselves — always-hold seats pass on their own
    // timing, and here that timing is the countdown the player left running.
    await game.dom.waitFor(async () => (await game.combatStep()) === "damage", {
      timeoutMs: 8000,
      message: "Timed out waiting for the damage step after the manual passes",
    });
    await game.expectPassCountdown(true);
    await game.expectPassCountdown(true);
  }, 45_000);

  it("selecting auto-pass drains the window in-engine with no countdown (practice parity)", async () => {
    const game = await bootDefendDeclared();

    await selectAlwaysHold(game);
    await game.expectPassCountdown(true);
    // Disarm first so the 5 s expiry cannot race the mode change.
    await game.holdPriority();

    expect(await game.priorityMode()).toBe("always-hold");
    await game.selectPriorityMode("auto-pass");
    await game.dom.waitFor(async () => (await game.priorityMode()) === "auto-pass", {
      timeoutMs: 4000,
      message: "Expected the in-match control to report auto-pass",
    });

    // The engine's in-dispatch drain passes the seat's pass-only window with
    // the mode command's receipt; the pass-only bot then closes the chain.
    // No countdown may appear and no human pass is ever submitted.
    await game.expectPassCountdown(false);
    await game.dom.waitFor(async () => (await game.combatStep()) !== "defend", {
      timeoutMs: 8000,
      message: "Timed out waiting for the engine drain to advance the combat window",
    });
  }, 30_000);

  it("play-and-skip still holds pass-only response windows with the countdown (bluff preserved)", async () => {
    const game = await bootDefendDeclared();

    await selectAlwaysHold(game);
    await game.expectPassCountdown(true);
    await game.holdPriority();
    await game.expectPassCountdown(false);

    await game.selectPriorityMode("play-and-skip");
    // The mode command bumps the state version, so the still-open defend-step
    // response window re-derives under the new holding mode and the countdown
    // re-arms — play-and-skip never engine-drains a pass-only response window
    // (bluff preservation; the auto-pass contrast is the previous test).
    // Cancel again so the radios return and report the new mode.
    await game.expectPassCountdown(true);
    await game.holdPriority();
    expect(await game.priorityMode()).toBe("play-and-skip");
    await game.expectPassCountdown(false);

    // Manual pass still works, and the pass-only bot closes the chain.
    await game.clickPass();
    await game.dom.waitFor(async () => (await game.combatStep()) !== "defend", {
      timeoutMs: 20_000,
      message: "Timed out waiting for the combat window to advance after the manual pass",
    });
  }, 45_000);

  it("playing under play-and-skip hands priority to the opponent with no holder click", async () => {
    const game = await bootDualTarget();
    const viewer = game.as("player-1");

    expect(await game.priorityMode()).toBe("auto-pass");
    await game.selectPriorityMode("play-and-skip");
    await game.dom.waitFor(async () => (await game.priorityMode()) === "play-and-skip", {
      timeoutMs: 4000,
      message: "Expected the in-match control to report play-and-skip",
    });

    // Play Snatch (a 0-cost attack). The engine skips the seat's own follow-up
    // window inside the play receipt: priority crosses to the opponent with no
    // holder click (under always-hold this window would wait on the viewer
    // instead), the pass-only bot returns it, and the attack proceeds.
    await viewer.play("Snatch");
    await game.dom.waitFor(async () => (await game.combatStep()) === "defend", {
      timeoutMs: 4000,
      message: "Expected the own-window skip to advance the attack to defense",
    });
    // The observable contract is that no holder click is required to reach
    // the fresh defender window. A countdown may already represent the next
    // pass-only priority window by the time that render commits.
  }, 45_000);

  it("arming the one-shot hold keeps the next own window with the holder", async () => {
    const game = await bootDualTarget();
    const viewer = game.as("player-1");

    await game.selectPriorityMode("play-and-skip");
    await game.dom.waitFor(async () => (await game.priorityMode()) === "play-and-skip", {
      timeoutMs: 4000,
      message: "Expected the in-match control to report play-and-skip",
    });
    await game.armPriorityHold();

    // Armed: the seat's next own follow-up window is held (“play and hold”).
    // Playing Snatch leaves the post-play window with the viewer — no skip
    // rides the play receipt — and, that window being pass-only for this
    // hand, the uniform countdown (not the engine) resolves it.
    await viewer.play("Snatch");
    await game.dom.waitFor(
      async () => (await game.priorityOwner()) === "self" && (await game.hasPassCountdown()),
      {
        timeoutMs: 4000,
        message: "Expected the armed holder to keep the post-play window with a countdown",
      },
    );
    // The countdown expiry is the seat's own pass commit: it clears the arm
    // and hands the defend window to the bot, exactly like a manual pass.
    await game.dom.waitFor(async () => !(await game.hasPassCountdown()), {
      timeoutMs: 10_000,
      message: "Expected the armed countdown to resolve the held window",
    });
  }, 45_000);
});
