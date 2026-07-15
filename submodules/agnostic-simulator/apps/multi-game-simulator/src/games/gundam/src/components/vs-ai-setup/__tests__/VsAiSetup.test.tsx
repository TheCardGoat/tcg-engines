// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vite-plus/test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { VsAiSetup } from "../VsAiSetup.tsx";

afterEach(cleanup);

/**
 * Component tests for the vs-AI setup screen. We pass an `onStart`
 * spy instead of letting the component navigate — the URL assembly
 * is the contract we want to pin, and staying off the router keeps
 * the tests cheap.
 */
function renderSetup(props: Partial<Parameters<typeof VsAiSetup>[0]> = {}) {
  let startedUrl: string | undefined;
  const view = render(
    <MemoryRouter initialEntries={["/vs-ai"]}>
      <VsAiSetup
        onStart={(url) => {
          startedUrl = url;
        }}
        {...props}
      />
    </MemoryRouter>,
  );
  return {
    ...view,
    getStartedUrl: () => startedUrl,
  };
}

/**
 * Query a radio by its `name` + `value` — a `getByRole("radio",
 * { name: "..." })` match would pull accessible-name from the full
 * label text (including chips like "50-MAIN"), which is brittle.
 * The name/value pair is the stable contract.
 */
function radio(container: HTMLElement, groupName: string, value: string): HTMLInputElement {
  const el = container.querySelector<HTMLInputElement>(
    `input[name="${groupName}"][value="${value}"]`,
  );
  if (!el) throw new Error(`no radio with name=${groupName} value=${value}`);
  return el;
}

describe("VsAiSetup: initial state", () => {
  it("renders the mission-select heading", () => {
    renderSetup();
    expect(screen.getByText(/launch a match/i)).toBeTruthy();
  });

  it("defaults the player deck to ef-starter", () => {
    const { container } = renderSetup();
    expect(radio(container, "player-deck", "ef-starter").checked).toBe(true);
    // The opponent picker defaults to something OTHER than the
    // player's pick (per the pickDifferent helper in VsAiSetup).
    expect(radio(container, "opponent-deck", "seed-aggro").checked).toBe(true);
  });

  it("defaults the strategy to Rookie (pass-only)", () => {
    const { container } = renderSetup();
    expect(radio(container, "opponent-strategy", "pass-only").checked).toBe(true);
  });
});

describe("VsAiSetup: start-button URL assembly", () => {
  it("encodes all four params into the navigation URL", () => {
    const { getStartedUrl } = renderSetup();
    fireEvent.click(screen.getByRole("button", { name: /start match/i }));
    const url = getStartedUrl();
    expect(url).toBeDefined();
    const parsed = new URL(url!, "http://test.local");
    expect(parsed.pathname).toBe("/vs-ai");
    expect(parsed.searchParams.get("deck")).toBe("ef-starter");
    expect(parsed.searchParams.get("opponent")).toBe("seed-aggro");
    expect(parsed.searchParams.get("strategy")).toBe("pass-only");
    expect(parsed.searchParams.get("start")).toBe("1");
  });

  it("reflects the user's deck + strategy selection in the URL", () => {
    const { container, getStartedUrl } = renderSetup();

    fireEvent.click(radio(container, "player-deck", "gd01-mixed"));
    fireEvent.click(radio(container, "opponent-strategy", "greedy-legal"));
    fireEvent.click(screen.getByRole("button", { name: /start match/i }));

    const parsed = new URL(getStartedUrl()!, "http://test.local");
    expect(parsed.searchParams.get("deck")).toBe("gd01-mixed");
    expect(parsed.searchParams.get("strategy")).toBe("greedy-legal");
  });
});

describe("VsAiSetup: props", () => {
  it("honors initialPlayerDeck / initialOpponentDeck / initialStrategy", () => {
    const { getStartedUrl } = renderSetup({
      initialPlayerDeck: "seed-aggro",
      initialOpponentDeck: "gd01-mixed",
      initialStrategy: "greedy-legal",
    });
    fireEvent.click(screen.getByRole("button", { name: /start match/i }));
    const parsed = new URL(getStartedUrl()!, "http://test.local");
    expect(parsed.searchParams.get("deck")).toBe("seed-aggro");
    expect(parsed.searchParams.get("opponent")).toBe("gd01-mixed");
    expect(parsed.searchParams.get("strategy")).toBe("greedy-legal");
  });
});
