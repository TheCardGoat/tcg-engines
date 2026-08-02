// @vitest-environment jsdom
/**
 * PracticePage integration: setup screen -> start game -> mulligan banner ->
 * board -> undo stack. AI loop runs on fake timers-free short delays; the
 * solo-vs-self mode is used to keep the test deterministic.
 */

import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, test } from "vitest";

import { TestingLibraryDomDriver } from "@tcg/simulator-testing/testing-library";

import { NarutoPracticePage } from "../pages/Practice.page.tsx";

beforeAll(() => {
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

describe("NarutoPracticePage", () => {
  test("setup -> start -> mulligan -> undo", async () => {
    const { container } = render(<NarutoPracticePage />);
    const driver = new TestingLibraryDomDriver(container);

    // setup screen
    await driver.getByTestId("naruto-practice-setup").waitFor();
    expect(await driver.getByTestId("naruto-deck-picker").count()).toBe(1);
    expect(await driver.getByTestId("naruto-seed").count()).toBe(1);

    // hot-seat mode so no AI timers fire
    const select = container.querySelector<HTMLSelectElement>('[data-testid="naruto-mode-picker"]');
    expect(select).not.toBeNull();
    if (select) {
      fireEvent.change(select, { target: { value: "self" } });
    }

    await driver.getByTestId("naruto-start").clickJs();
    await driver.getByTestId("naruto-practice-game").waitFor();

    // mulligan banner for the second player, keep it
    await driver.getByTestId("naruto-mulligan").waitFor();
    await driver.getByTestId("naruto-mulligan-keep").clickJs();
    await driver.waitFor(
      async () => (await driver.getByTestId("naruto-turn").textContent()) === "T1",
    );

    // summon a card with whichever seat is active, then undo it
    await driver.locator('[data-testid^="naruto-hand-card-"]').first().clickJs();
    await driver.getByTestId("naruto-pill-summon").clickJs();
    await driver.waitFor(
      async () => (await driver.locator('[data-testid^="naruto-character-"]').count()) === 1,
    );
    expect(await driver.getByTestId("naruto-undo").getAttribute("disabled")).toBeNull();
    await driver.getByTestId("naruto-undo").clickJs();
    await driver.waitFor(
      async () => (await driver.locator('[data-testid^="naruto-character-"]').count()) === 0,
    );

    // back to setup
    await driver.getByTestId("naruto-quit").clickJs();
    await driver.getByTestId("naruto-practice-setup").waitFor();
  });
});
