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

import { cleanup, render } from "@testing-library/react";
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
  // Mantine useMediaQuery needs matchMedia in jsdom.
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
    const { container } = render(
      <NarutoBoard
        state={fixtureState("mid-game")}
        viewer="p1"
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
    expect(await driver.getByTestId("naruto-inspector").count()).toBe(1);
    // shell carries the game marker
    const shell = await driver.getByTestId("naruto-shell").getAttribute("data-game");
    expect(shell).toBe("naruto");
  });

  test("mobile tree renders the portrait column with bottom bar", async () => {
    const { container } = render(
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
    expect(await driver.getByTestId("naruto-mobile-strip-p2").count()).toBe(1);
    expect(await driver.getByTestId("naruto-bottom-bar").count()).toBe(1);
    expect(await driver.getByTestId("naruto-mobile-hand").count()).toBe(1);
    expect(await driver.getByTestId("naruto-shell").getAttribute("data-layout")).toBe("mobile");
    // log drawer opens from the bottom bar toggle (interactive=false hides it, so skip)
  });

  test("mobile log drawer opens", async () => {
    const { container } = render(
      <NarutoBoard
        state={fixtureState("mid-game")}
        viewer="p1"
        forceMobile
        onAction={() => undefined}
      />,
    );
    const driver = new TestingLibraryDomDriver(container);
    await driver.getByTestId("naruto-log-toggle").clickJs();
    expect(await driver.getByTestId("naruto-log-drawer").count()).toBe(1);
  });
});

describe("scripted turn click-through", () => {
  test("keep hand -> summon -> attack leader -> pass -> end turn", async () => {
    const { container } = render(<Harness initial={newGame()} />);
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
  test("board-target choice resolves by clicking a pulsing target", async () => {
    const { container } = render(<Harness initial={fixtureState("board-target-choice")} />);
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
    const { container } = render(
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
    const { container } = render(<Harness initial={fixtureState("modal-choice")} />);
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
    const { container } = render(
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

  test("attack pill on a freshly summoned character cites summoning sickness", async () => {
    const { container } = render(<Harness initial={newGame()} />);
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
