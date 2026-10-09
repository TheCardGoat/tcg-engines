import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { DEFAULT_BOT_PRACTICE_DECK_ID, getPracticeDeckFixture } from "../engine";
import { WebviewPracticePage } from "./WebviewPractice.page";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.history.replaceState({}, "", "/");
});

describe("matchmaking practice launch recovery", () => {
  test("an invalid deck link explains the problem and returns to matchmaking", async () => {
    window.history.replaceState({}, "", "/cyberpunk/simulator/play/practice?source=matchmaking");

    render(<WebviewPracticePage />);

    expect(await screen.findByText(/couldn't read the deck from this practice link/i)).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Try again" })).toBeNull();
    expect(
      (screen.getByRole("link", { name: "Return to matchmaking" }) as HTMLAnchorElement).pathname,
    ).toBe("/cyberpunk/matchmaking");
  });

  test("a failed creation shows the cause and retries the same practice launch", async () => {
    const fixture = getPracticeDeckFixture(DEFAULT_BOT_PRACTICE_DECK_ID);
    if (!fixture) throw new Error("Practice deck fixture is missing");
    const payload = btoa(
      JSON.stringify({
        game: "cyberpunk",
        format: "constructed",
        legends: fixture.deck.legends.map((cardId) => ({ cardId, quantity: 1 })),
        mainDeck: fixture.deck.mainDeck.map((cardId) => ({ cardId, quantity: 1 })),
        bot: { deckFixtureId: DEFAULT_BOT_PRACTICE_DECK_ID },
      }),
    );
    window.history.replaceState(
      {},
      "",
      `/cyberpunk/simulator/play/practice?source=matchmaking&payload=${encodeURIComponent(payload)}`,
    );
    let attempts = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url =
          typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        if (url.endsWith("/quick-match")) attempts += 1;
        return {
          ok: false,
          status: 500,
          json: async () => ({ message: "Failed to create quick match" }),
        };
      }),
    );

    render(<WebviewPracticePage />);

    expect(await screen.findByText("Failed to create quick match")).toBeTruthy();
    expect(screen.getByText(/couldn't start your match against the bot/i)).toBeTruthy();
    expect(
      (screen.getByRole("link", { name: "Return to matchmaking" }) as HTMLAnchorElement).pathname,
    ).toBe("/cyberpunk/matchmaking");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    await waitFor(() => expect(attempts).toBe(2));
  });
});
