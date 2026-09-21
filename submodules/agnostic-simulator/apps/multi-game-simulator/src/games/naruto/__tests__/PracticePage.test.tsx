// @vitest-environment jsdom
/**
 * PracticePage integration: setup screen -> start game -> mulligan banner ->
 * board -> undo stack. AI loop runs on fake timers-free short delays; the
 * solo-vs-self mode is used to keep the test deterministic.
 */

import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";

import { TestingLibraryDomDriver } from "@tcg/simulator-testing/testing-library";
import { PREVIEW_DECKS, cardOf, previewDeckList } from "@tcg-engines/naruto-engine";
import type { DeckList } from "@tcg-engines/naruto-engine";

import { NarutoPracticePage } from "../pages/Practice.page.tsx";

function serializeDeck(deck: DeckList): string {
  const counts = new Map<string, number>();
  const chakraCounts = new Map<string, number>();
  for (const cardId of deck.cardIds) counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
  for (const cardId of deck.chakraCardIds) {
    chakraCounts.set(cardId, (chakraCounts.get(cardId) ?? 0) + 1);
  }
  return [
    `leader: ${deck.leaderId}`,
    ...[...counts].map(([cardId, quantity]) => `${quantity}x${cardId}`),
    ...[...chakraCounts].map(([cardId, quantity]) => `chakra: ${quantity}x${cardId}`),
    `summon: ${deck.summonCardId}`,
  ].join("\n");
}

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

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/naruto/simulator/practice");
});

describe("NarutoPracticePage", () => {
  test("starts a configured matchmaking practice handoff without returning to setup", async () => {
    window.history.replaceState(
      {},
      "",
      "/naruto/simulator/practice?deckKey=mountMyoboku&opponentDeckKey=theTaka&strategy=passive&seed=42&start=1",
    );
    const { baseElement: container } = render(<NarutoPracticePage />);
    const driver = new TestingLibraryDomDriver(container);

    await driver.getByTestId("naruto-practice-game").waitFor();
    expect(await driver.getByTestId("naruto-practice-setup").count()).toBe(0);
    expect(await driver.getByTestId("naruto-leader-p1").count()).toBe(1);
  });

  test("starts play-both-sides handoff without scheduling bot automation", async () => {
    window.history.replaceState({}, "", "/naruto/simulator/practice?mode=self&seed=42&start=1");
    vi.useFakeTimers();
    try {
      const { baseElement: container } = render(<NarutoPracticePage />);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2_000);
      });
      expect(container.querySelector('[data-testid="naruto-practice-game"]')).not.toBeNull();
      expect(container.textContent).toContain("Play both sides · controlling");
    } finally {
      vi.useRealTimers();
    }
  });

  test("does not create an undo checkpoint for an automated AI decision", async () => {
    window.history.replaceState({}, "", "/naruto/simulator/practice?mobile=1");
    vi.useFakeTimers();
    try {
      const { baseElement: container } = render(<NarutoPracticePage />);
      const start = container.querySelector<HTMLButtonElement>('[data-testid="naruto-start"]');
      expect(start).not.toBeNull();
      if (!start) return;

      fireEvent.click(start);
      expect(container.querySelector('[data-testid="naruto-practice-game"]')).not.toBeNull();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(450);
      });

      const undo = container.querySelector<HTMLButtonElement>('[data-testid="naruto-undo-mobile"]');
      expect(undo?.textContent).toBe("Undo");
      expect(undo?.disabled).toBe(true);
      expect(container.querySelector('[data-testid="naruto-mulligan"]')).not.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  test("custom deck import requires explicit Chakra and Summon setup", async () => {
    const { baseElement: container } = render(<NarutoPracticePage />);
    const driver = new TestingLibraryDomDriver(container);
    await driver.getByTestId("naruto-practice-setup").waitFor();

    const picker = container.querySelector<HTMLSelectElement>('[data-testid="naruto-deck-picker"]');
    expect(picker).not.toBeNull();
    if (!picker) return;
    fireEvent.change(picker, { target: { value: "custom" } });

    const textarea = driver.getByTestId("naruto-deck-import");
    expect(await textarea.getAttribute("placeholder")).toContain("chakra: 5xC-001");
    const textareaElement = container.querySelector<HTMLTextAreaElement>("textarea");
    expect(textareaElement).not.toBeNull();
    if (!textareaElement) return;
    fireEvent.change(textareaElement, {
      target: { value: "leader: N-001\n4xN-004\n" },
    });
    await driver.getByTestId("naruto-deck-status").waitFor();
    expect(await driver.getByTestId("naruto-deck-status").textContent()).toContain(
      "4 main cards, 0 Chakra, and 0 Summon parsed",
    );
  });

  test("starts with the imported deck when custom mode is selected", async () => {
    const customPreview = PREVIEW_DECKS[2];
    expect(customPreview).toBeDefined();
    if (!customPreview) return;
    const customDeck = previewDeckList(customPreview);
    const customLeader = cardOf({ uid: "custom-leader", cardId: customDeck.leaderId });
    expect(customLeader).toBeDefined();
    if (!customLeader) return;

    const { baseElement: container } = render(<NarutoPracticePage />);
    const driver = new TestingLibraryDomDriver(container);
    await driver.getByTestId("naruto-practice-setup").waitFor();

    const picker = container.querySelector<HTMLSelectElement>('[data-testid="naruto-deck-picker"]');
    const textarea = container.querySelector<HTMLTextAreaElement>(
      '[data-testid="naruto-deck-import"]',
    );
    expect(picker).not.toBeNull();
    if (!picker) return;
    fireEvent.change(picker, { target: { value: "custom" } });

    const importedTextarea = container.querySelector<HTMLTextAreaElement>(
      '[data-testid="naruto-deck-import"]',
    );
    expect(textarea).toBeNull();
    expect(importedTextarea).not.toBeNull();
    if (!importedTextarea) return;
    fireEvent.change(importedTextarea, { target: { value: serializeDeck(customDeck) } });

    await driver.getByTestId("naruto-start").clickJs();
    await driver.getByTestId("naruto-practice-game").waitFor();
    expect(await driver.getByTestId("naruto-leader-p1").textContent()).toContain(
      customLeader.nameEn,
    );
  });

  test("setup -> start -> mulligan -> undo", async () => {
    window.history.replaceState({}, "", "/naruto/simulator/practice?mobile=1");
    const { baseElement: container } = render(
      <StrictMode>
        <NarutoPracticePage />
      </StrictMode>,
    );
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
    expect(await driver.getByTestId("naruto-undo-mobile").getAttribute("disabled")).toBeNull();

    // summon a card with whichever seat is active, then undo it
    await driver.locator('[data-testid^="naruto-hand-card-"]').first().clickJs();
    await driver.getByTestId("naruto-pill-summon").clickJs();
    await driver.waitFor(
      async () => (await driver.locator('[data-testid^="naruto-character-"]').count()) === 1,
    );
    expect(await driver.getByTestId("naruto-undo-mobile").textContent()).toBe("Undo");
    expect(await driver.getByTestId("naruto-undo-mobile").getAttribute("disabled")).toBeNull();
    await driver.getByTestId("naruto-undo-mobile").clickJs();
    await driver.waitFor(
      async () => (await driver.locator('[data-testid^="naruto-character-"]').count()) === 0,
    );
    expect(await driver.getByTestId("naruto-undo-mobile").getAttribute("disabled")).toBeNull();
  });
});
