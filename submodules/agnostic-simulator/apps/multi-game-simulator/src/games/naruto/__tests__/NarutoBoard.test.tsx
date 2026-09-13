// @vitest-environment jsdom
/**
 * jsdom component tests for the naruto board surface, driven through
 * @tcg/simulator-testing's TestingLibraryDomDriver:
 *  - desktop + mobile renders
 *  - scripted turn click-through: keep hand -> summon -> (turn 3) declare
 *    attack on the opposing leader -> pass counter -> end turn
 *  - board-target choice + choice modal flows
 *  - disabled pills carry *Block reason tooltips
 */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, test } from "vitest";
import { useState } from "react";

import { TestingLibraryDomDriver } from "@tcg/simulator-testing/testing-library";
import {
  applyAction,
  buildDeck,
  createInitialState,
  deciderOf,
  leaderUid,
} from "@tcg-engines/naruto-engine";
import type { Action, GameState, PlayerId } from "@tcg-engines/naruto-engine";

import { NarutoBoard } from "../board/NarutoBoard.tsx";
import { getNarutoFixture } from "../stories/fixtures.ts";

beforeAll(() => {
  // The shared viewport shell reads matchMedia in jsdom.
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
});

afterEach(cleanup);

function fixtureState(id: string): GameState {
  const fixture = getNarutoFixture(id);
  if (!fixture) throw new Error(`fixture ${id} missing`);
  return fixture.state;
}

/** Stateful harness: applies actions like the practice page (solo-vs-self). */
function Harness({ initial }: { readonly initial: GameState }) {
  const [state, setState] = useState(initial);
  const viewer: PlayerId = deciderOf(state) ?? state.activePlayer;
  return (
    <NarutoBoard
      state={state}
      viewer={viewer}
      onAction={(action: Action) => setState((current) => applyAction(current, action))}
    />
  );
}

function newGame(): GameState {
  return createInitialState({
    seed: 5,
    firstPlayer: "p1",
    decks: { p1: buildDeck("N-001"), p2: buildDeck("N-012") },
    names: { p1: "You", p2: "Opponent" },
  });
}

describe("NarutoBoard rendering", () => {
  test("desktop tree renders all seat zones", async () => {
    const { baseElement: container } = render(
      <NarutoBoard
        state={fixtureState("mid-game")}
        viewer="p1"
        participantNames={{ p1: "Local Naruto P1", p2: "Naruto E2E Player Two" }}
        interactive={false}
        onAction={() => undefined}
      />,
    );
    const driver = new TestingLibraryDomDriver(container);
    await driver.getByTestId("naruto-shell").waitFor();
    expect(await driver.getByTestId("naruto-desktop-board").count()).toBe(1);
    expect(await driver.getByTestId("naruto-half-p1").count()).toBe(1);
    expect(await driver.getByTestId("naruto-half-p2").count()).toBe(1);
    expect(await driver.getByTestId("naruto-life-p1").textContent()).toBe("15");
    expect(await driver.getByTestId("naruto-characters-p1").locator("button").count()).toBe(1);
    expect(await driver.getByTestId("naruto-characters-p2").locator("button").count()).toBe(1);
    // p1 set one support, face-down but visible to the p1 viewer
    expect(await driver.getByTestId("naruto-supports-p1").locator("button").count()).toBe(1);
    // seam + rail
    expect(await driver.getByTestId("naruto-seam").count()).toBe(1);
    expect(await driver.getByTestId("naruto-rail").count()).toBe(1);
    expect(await driver.getByTestId("naruto-log").count()).toBe(1);
    expect(await driver.getByTestId("naruto-sidebar-self").textContent()).toContain(
      "Local Naruto P1",
    );
    expect(await driver.getByTestId("naruto-sidebar-opponent").textContent()).toContain(
      "Naruto E2E Player Two",
    );
    expect(await driver.getByTestId("naruto-sidebar-self").textContent()).toContain("Life");
    fireEvent.click(screen.getByRole("tab", { name: "Card & tools" }));
    expect(await driver.getByTestId("naruto-inspector").count()).toBe(1);
    // shell carries the game marker
    const shell = await driver.getByTestId("naruto-shell").getAttribute("data-game");
    expect(shell).toBe("naruto");
  });

  test("opens a provisional Naruto bug report with current match evidence", () => {
    const state = fixtureState("mid-game");
    render(
      <NarutoBoard
        state={state}
        viewer="p1"
        onAction={() => undefined}
        bugReportContext={{
          gameSlug: "naruto",
          turn: state.turn,
          stateVersion: state.log.length,
          playerCount: 2,
        }}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Card & tools" }));
    fireEvent.click(screen.getByRole("button", { name: "Report a bug from this turn" }));
    expect(screen.getByRole("dialog", { name: "Report a Naruto bug" })).not.toBeNull();
  });

  test("mobile tree renders the portrait column with bottom bar", async () => {
    const { baseElement: container } = render(
      <NarutoBoard
        state={fixtureState("mid-game")}
        viewer="p1"
        interactive={false}
        forceMobile
        onAction={() => undefined}
      />,
    );
    const driver = new TestingLibraryDomDriver(container);
    expect(await driver.getByTestId("naruto-mobile-board").count()).toBe(1);
    expect(await driver.getByTestId("naruto-mobile-seat-p1").count()).toBe(1);
    expect(await driver.getByTestId("naruto-mobile-seat-p2").count()).toBe(1);
    expect(await driver.getByTestId("naruto-mobile-activity").count()).toBe(1);
    expect(await driver.getByTestId("naruto-mobile-hand").count()).toBe(1);
    // Chakra, deck, and trash are public state: phones must expose the same
    // in-match information and trash inspection entry point as desktop.
    expect(await driver.getByTestId("naruto-chakra-p1").count()).toBe(1);
    expect(await driver.getByTestId("naruto-deck-p1").count()).toBe(1);
    expect(await driver.getByTestId("naruto-trash-p1").count()).toBe(1);
    expect(await driver.getByTestId("naruto-mobile-support-capacity-p1").textContent()).toBe("1/5");
    expect(await driver.getByTestId("naruto-mobile-support-capacity-p2").textContent()).toBe("0/5");
    expect(await driver.getByTestId("naruto-undo-mobile").count()).toBe(0);
    expect(await driver.getByTestId("naruto-shell").getAttribute("data-layout")).toBe("mobile");
    // log drawer opens from the bottom bar toggle (interactive=false hides it, so skip)
  });

  test("uses shared actionable, selected, and inspect-only card interactions", () => {
    const { container } = render(
      <NarutoBoard state={fixtureState("mid-game")} viewer="p1" onAction={() => undefined} />,
    );
    const actionable = container.querySelector<HTMLElement>('[data-card-interaction="actionable"]');
    expect(actionable).not.toBeNull();
    fireEvent.click(actionable!.closest("button")!);
    expect(container.querySelector('[data-card-interaction="selected"]')).not.toBeNull();

    const inspectOnly = container.querySelector<HTMLElement>(
      '[data-testid="naruto-half-p2"] [data-card-interaction="idle"]',
    );
    expect(inspectOnly).not.toBeNull();
    fireEvent.click(inspectOnly!.closest("button")!);
    expect(document.querySelector('[role="dialog"][aria-label$="details"]')).not.toBeNull();
  });

  test("mobile log drawer opens", async () => {
    const { baseElement: container } = render(
      <NarutoBoard
        state={fixtureState("mid-game")}
        viewer="p1"
        forceMobile
        onAction={() => undefined}
      />,
    );
    const driver = new TestingLibraryDomDriver(container);
    await driver.getByTestId("naruto-mobile-activity").clickJs();
    expect(
      await driver.locator('[role="dialog"][aria-label="Naruto match activity"]').count(),
    ).toBe(1);
  });

  test("mobile activity drawer keeps the practice setup exit available", async () => {
    let setupCalls = 0;
    const { baseElement: container } = render(
      <NarutoBoard
        state={fixtureState("mid-game")}
        viewer="p1"
        forceMobile
        onNewGame={() => {
          setupCalls += 1;
        }}
        onAction={() => undefined}
      />,
    );
    const driver = new TestingLibraryDomDriver(container);

    await driver.getByTestId("naruto-mobile-activity").clickJs();
    await driver.getByTestId("naruto-setup-rail").clickJs();
    expect(setupCalls).toBe(1);
  });

  test("mobile bottom rail exposes the real undo and primary match actions", async () => {
    let undoCalls = 0;
    const { baseElement: container } = render(
      <NarutoBoard
        state={fixtureState("mid-game")}
        viewer="p1"
        forceMobile
        canUndo
        onUndo={() => {
          undoCalls += 1;
        }}
        onAction={() => undefined}
      />,
    );
    const driver = new TestingLibraryDomDriver(container);

    const undo = driver.getByTestId("naruto-undo-mobile");
    expect(await undo.getAttribute("disabled")).toBeNull();
    await undo.clickJs();
    expect(undoCalls).toBe(1);
    expect(await driver.getByTestId("naruto-end-turn-mobile").count()).toBe(1);
  });

  test("mobile bottom rail promotes pass priority during a counter window", async () => {
    const actions: Action[] = [];
    const { baseElement: container } = render(
      <NarutoBoard
        state={fixtureState("counter-window")}
        viewer="p2"
        forceMobile
        onAction={(action) => actions.push(action)}
      />,
    );
    const driver = new TestingLibraryDomDriver(container);

    const pass = driver.getByTestId("naruto-pass-counter-mobile");
    expect(await driver.getByTestId("naruto-mobile-phase").textContent()).toBe(
      "Turn 3 · Counter step",
    );
    expect(await driver.getByTestId("naruto-seam-text").textContent()).toBe(
      "Attack by Naruto Uzumaki",
    );
    expect(await driver.getByTestId("naruto-seam").textContent()).toContain(
      "You have priority - chain a support or pass.",
    );
    expect(await pass.textContent()).toBe("Pass priority");
    await pass.clickJs();
    expect(actions).toEqual([{ type: "PASS_COUNTER", player: "p2" }]);
  });

  test("attack queue points at the leader and reports its pending damage", async () => {
    const { baseElement: container } = render(
      <NarutoBoard state={fixtureState("counter-window")} viewer="p2" onAction={() => undefined} />,
    );
    const driver = new TestingLibraryDomDriver(container);

    expect(await driver.getByTestId("naruto-attack-arrow").count()).toBe(1);
    expect(container.querySelector('[data-testid="naruto-attack-preview"]')?.textContent).toBe(
      "1 damage to Leader",
    );
  });

  test("character attack queue reports incoming damage and a K.O. forecast", async () => {
    const { baseElement: container } = render(
      <NarutoBoard
        state={fixtureState("character-counter-window")}
        viewer="p2"
        onAction={() => undefined}
      />,
    );
    const driver = new TestingLibraryDomDriver(container);

    expect(await driver.getByTestId("naruto-attack-arrow").count()).toBe(1);
    expect(container.querySelector('[data-testid="naruto-attack-preview"]')?.textContent).toBe(
      "5 damage · K.O. if unchanged",
    );
  });

  test("mobile selection moves contextual actions into an accessible dock", async () => {
    const { baseElement: container } = render(
      <NarutoBoard
        state={fixtureState("mid-game")}
        viewer="p1"
        forceMobile
        onAction={() => undefined}
      />,
    );
    const driver = new TestingLibraryDomDriver(container);
    const handCards = driver.getByTestId("naruto-hand-p1").locator("button");
    expect(await handCards.count()).toBeGreaterThan(0);
    await handCards.first().clickJs();
    expect(await driver.getByTestId("naruto-mobile-action-dock").count()).toBe(1);
    const actions = driver.getByTestId("naruto-mobile-action-dock").locator("button");
    expect(await actions.count()).toBeGreaterThan(0);
    await driver.getByTestId("naruto-mobile-card-details").clickJs();
    expect(document.querySelector('[role="dialog"][aria-label$="details"]')).not.toBeNull();
  });

  test("desktop selection keeps contextual actions out of the mobile dock", async () => {
    const { baseElement: container } = render(
      <NarutoBoard state={fixtureState("mid-game")} viewer="p1" onAction={() => undefined} />,
    );
    const driver = new TestingLibraryDomDriver(container);
    await driver.getByTestId("naruto-hand-p1").locator("button").first().clickJs();
    expect(await driver.getByTestId("naruto-mobile-action-dock").count()).toBe(0);
    expect(await driver.getByTestId("naruto-card-details").count()).toBe(1);
  });
});

describe("scripted turn click-through", () => {
  test("keep hand -> summon -> attack leader -> pass -> end turn", async () => {
    const { baseElement: container } = render(<Harness initial={newGame()} />);
    const driver = new TestingLibraryDomDriver(container);

    // 1. p2 keeps the opening hand via the mulligan banner.
    await driver.getByTestId("naruto-mulligan").waitFor();
    await driver.getByTestId("naruto-mulligan-keep").clickJs();
    await driver.waitFor(
      async () => (await driver.getByTestId("naruto-turn").textContent()) === "T1",
    );

    // 2. p1 summons the first hand card (buildDeck hands are all characters).
    const handCards = driver.getByTestId("naruto-hand-p1").locator("button");
    expect(await handCards.count()).toBeGreaterThan(0);
    await handCards.first().clickJs();
    await driver.getByTestId("naruto-pill-summon").clickJs();
    await driver.waitFor(
      async () =>
        (await driver.getByTestId("naruto-characters-p1").locator("button").count()) === 1,
    );

    // 3. Turn 1: attack is blocked (too early). End the turn, p2 summons, ends.
    await driver.getByTestId("naruto-end-turn").clickJs();
    await driver.waitFor(
      async () => (await driver.getByTestId("naruto-turn").textContent()) === "T2",
    );
    const p2Hand = driver.getByTestId("naruto-hand-p2").locator("button");
    await p2Hand.first().clickJs();
    await driver.getByTestId("naruto-pill-summon").clickJs();
    await driver.waitFor(
      async () =>
        (await driver.getByTestId("naruto-characters-p2").locator("button").count()) === 1,
    );
    await driver.getByTestId("naruto-end-turn").clickJs();
    await driver.waitFor(
      async () => (await driver.getByTestId("naruto-turn").textContent()) === "T3",
    );

    // 4. Turn 3: p1's character attacks the p2 leader (two-step flow).
    const attacker = driver.getByTestId("naruto-characters-p1").locator("button").first();
    await attacker.clickJs();
    await driver.getByTestId("naruto-pill-attack").clickJs();
    // target: the p2 leader card carries data-board-uid="leader:p2"
    await driver
      .locator(`[data-board-uid=${JSON.stringify(leaderUid("p2"))}]`)
      .first()
      .clickJs();
    await driver.waitFor(
      async () => (await driver.getByTestId("naruto-seam").getAttribute("data-step")) === "counter",
    );

    // 5. Defender (viewer follows the decider) passes; the attack resolves.
    const lifeBefore = await driver.getByTestId("naruto-life-p2").textContent();
    await driver.getByTestId("naruto-pass-counter").clickJs();
    await driver.waitFor(
      async () => (await driver.getByTestId("naruto-seam").getAttribute("data-step")) === "normal",
    );
    const lifeAfter = await driver.getByTestId("naruto-life-p2").textContent();
    expect(Number(lifeAfter)).toBeLessThan(Number(lifeBefore));

    // 6. Back in p1's main phase: end the turn.
    await driver.getByTestId("naruto-end-turn").clickJs();
    await driver.waitFor(
      async () => (await driver.getByTestId("naruto-turn").textContent()) === "T4",
    );
  });
});

describe("pendingChoice flows", () => {
  test("non-cancellable choice is a modal dialog and cannot be dismissed with Escape", async () => {
    const actions: Action[] = [];
    const { baseElement: container } = render(
      <NarutoBoard
        state={fixtureState("modal-choice")}
        viewer="p1"
        onAction={(action) => actions.push(action)}
      />,
    );
    const driver = new TestingLibraryDomDriver(container);
    await driver.getByTestId("naruto-choice-modal").waitFor();
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog?.getAttribute("aria-modal")).toBe("true");
    expect(document.activeElement).toBe(
      container.querySelector('[data-testid^="naruto-choice-option-"]'),
    );

    fireEvent.keyDown(dialog ?? document.body, { key: "Escape" });
    expect(actions).toEqual([]);
    expect(container.querySelector('[data-testid="naruto-choice-modal"]')).not.toBeNull();
  });

  test("board-target choice resolves by clicking a pulsing target", async () => {
    const { baseElement: container } = render(
      <Harness initial={fixtureState("board-target-choice")} />,
    );
    const driver = new TestingLibraryDomDriver(container);
    // prompt + cancel chip are visible to the choosing player
    expect((await driver.getByTestId("naruto-seam-text").textContent()).length).toBeGreaterThan(0);
    expect(await driver.getByTestId("naruto-choice-cancel").count()).toBe(1);
    // click a board character (both are options in this fixture)
    await driver.getByTestId("naruto-characters-p1").locator("button").first().clickJs();
    // choice resolved: prompt returns to the main-phase text
    await driver.waitFor(
      async () => (await driver.getByTestId("naruto-choice-cancel").count()) === 0,
    );
  });

  test("choice cancel submits a null resolution", async () => {
    const actions: Action[] = [];
    const { baseElement: container } = render(
      <NarutoBoard
        state={fixtureState("board-target-choice")}
        viewer="p1"
        onAction={(action) => actions.push(action)}
      />,
    );
    const driver = new TestingLibraryDomDriver(container);
    await driver.getByTestId("naruto-choice-cancel").clickJs();
    expect(actions).toEqual([{ type: "RESOLVE_CHOICE", player: "p1", key: null }]);
  });

  test("choice modal resolves from the option grid", async () => {
    const { baseElement: container } = render(<Harness initial={fixtureState("modal-choice")} />);
    const driver = new TestingLibraryDomDriver(container);
    await driver.getByTestId("naruto-choice-modal").waitFor();
    const options = driver.locator('[data-testid^="naruto-choice-option-"]');
    expect(await options.count()).toBeGreaterThan(0);
    await options.first().clickJs();
    await driver.waitFor(
      async () => (await driver.getByTestId("naruto-choice-modal").count()) === 0,
    );
  });
});

describe("disabled reasons", () => {
  test("out-of-turn pills are disabled with *Block reason tooltips", async () => {
    // mid-game, p1 to act; render from p2's seat.
    const { baseElement: container } = render(
      <NarutoBoard state={fixtureState("mid-game")} viewer="p2" onAction={() => undefined} />,
    );
    const driver = new TestingLibraryDomDriver(container);
    // p2's hand card shows a disabled Summon pill with "Not your turn"
    await driver.getByTestId("naruto-hand-p2").locator("button").first().clickJs();
    const summon = driver.getByTestId("naruto-pill-summon");
    expect(await summon.getAttribute("disabled")).not.toBeNull();
    expect(await summon.getAttribute("title")).toBe("Not your turn");
    // end turn also gated
    const endTurn = driver.getByTestId("naruto-end-turn");
    expect(await endTurn.getAttribute("disabled")).not.toBeNull();
    expect(await endTurn.getAttribute("title")).toBe("Not your turn");
  });

  test("mobile seam explains a disabled selected action without relying on its tooltip", async () => {
    const { baseElement: container } = render(
      <NarutoBoard
        state={fixtureState("mid-game")}
        viewer="p2"
        forceMobile
        onAction={() => undefined}
      />,
    );
    const driver = new TestingLibraryDomDriver(container);
    await driver.getByTestId("naruto-hand-p2").locator("button").first().clickJs();

    const summon = driver.getByTestId("naruto-mobile-pill-summon");
    expect(await summon.getAttribute("disabled")).not.toBeNull();
    expect(await driver.getByTestId("naruto-seam-guidance").textContent()).toBe(
      "Summon unavailable - Not your turn",
    );
  });

  test("attack pill on a freshly summoned character cites summoning sickness", async () => {
    const { baseElement: container } = render(<Harness initial={newGame()} />);
    const driver = new TestingLibraryDomDriver(container);
    await driver.getByTestId("naruto-mulligan-keep").clickJs();
    await driver.getByTestId("naruto-hand-p1").locator("button").first().clickJs();
    await driver.getByTestId("naruto-pill-summon").clickJs();
    await driver.getByTestId("naruto-characters-p1").locator("button").first().clickJs();
    const attack = driver.getByTestId("naruto-pill-attack");
    expect(await attack.getAttribute("disabled")).not.toBeNull();
    // turn 1 is both "too early" and the character was just summoned
    expect(["Too early in the game", "Summoned this turn"]).toContain(
      await attack.getAttribute("title"),
    );
  });
});
