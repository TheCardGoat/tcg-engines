// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { GUNDAM_FIXTURE_SCENARIOS } from "../../../game/fixtures/scenarios.ts";
import { VsAiSetup } from "../VsAiSetup.tsx";

beforeEach(() => {
  vi.spyOn(Math, "random").mockReturnValue(0);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/**
 * Component tests for the vs-AI setup screen. We pass an `onStart`
 * spy instead of letting the component navigate — the URL assembly
 * is the contract we want to pin, and staying off the router keeps
 * the tests cheap.
 */
function renderSetup(
  props: Partial<Parameters<typeof VsAiSetup>[0]> = {},
  initialEntry = "/vs-ai",
) {
  let startedUrl: string | undefined;
  const view = render(
    <MemoryRouter initialEntries={[initialEntry]}>
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

function radio(container: HTMLElement, groupName: string, value: string): HTMLInputElement {
  const el = container.querySelector<HTMLInputElement>(
    `input[name="${groupName}"][value="${value}"]`,
  );
  if (!el) throw new Error(`no radio with name=${groupName} value=${value}`);
  return el;
}

function deckSelect(container: HTMLElement, name: string): HTMLSelectElement {
  const el = container.querySelector<HTMLSelectElement>(`select[name="${name}"]`);
  if (!el) throw new Error(`no select with name=${name}`);
  return el;
}

describe("VsAiSetup: initial state", () => {
  it("renders the mission-select heading", () => {
    renderSetup();
    expect(screen.getByRole("heading", { name: /set up your match/i })).toBeTruthy();
  });

  it("randomizes different decks for each side on load", () => {
    const { container } = renderSetup();
    const player = deckSelect(container, "player-deck").value;
    const opponent = deckSelect(container, "opponent-deck").value;

    expect(player).toBe("ef-starter");
    expect(opponent).toBe("seed-aggro");
    expect(player).not.toBe(opponent);
  });

  it("defaults the strategy to Ace (combat-aware)", () => {
    const { container } = renderSetup();
    expect(radio(container, "opponent-strategy", "combat-aware").checked).toBe(true);
  });

  it("owns a viewport-height scroll region so every setup control remains reachable", () => {
    renderSetup();
    const scrollRegion = screen.getByTestId("vs-ai-setup-scroll-region");
    expect(scrollRegion.className).toContain("h-dvh");
    expect(scrollRegion.className).toContain("overflow-y-auto");
  });

  it("renders every deterministic state and ST10 lab in one fixture catalog", () => {
    renderSetup();

    expect(screen.getByRole("heading", { name: "Deterministic fixture catalog" })).toBeTruthy();
    const catalog = screen.getByTestId("fixture-catalog");
    expect(catalog.querySelectorAll('ul[aria-label="Gundam fixtures"] a')).toHaveLength(
      GUNDAM_FIXTURE_SCENARIOS.length,
    );
    expect(catalog.querySelector('a[href="/tests/setup-default"]')).not.toBeNull();
    expect(
      screen.getByRole("link", { name: /Development and Commands/i }).getAttribute("href"),
    ).toBe("/tests/st10-development-lab");
    expect(screen.getByRole("link", { name: /Pair and Link chains/i }).getAttribute("href")).toBe(
      "/tests/st10-pair-link-lab",
    );
    expect(screen.getByRole("link", { name: /Zeta shield assault/i }).getAttribute("href")).toBe(
      "/tests/st10-shield-assault-lab",
    );
    expect(
      screen.getByRole("link", { name: /Block, Action, and Burst/i }).getAttribute("href"),
    ).toBe("/tests/st10-defense-action-lab");
    expect(screen.getByLabelText("Cards: ST10-009, ST10-010, ST10-016")).toBeDefined();
  });

  it("filters the unified catalog by card number", () => {
    renderSetup();

    fireEvent.change(screen.getByRole("searchbox", { name: "Search fixtures" }), {
      target: { value: "ST10-009" },
    });

    expect(screen.getByRole("link", { name: /Block, Action, and Burst/i })).toBeTruthy();
    expect(screen.queryByRole("link", { name: /Development and Commands/i })).toBeNull();
  });

  it("keeps custom AI practice secondary and expandable", () => {
    renderSetup();

    const summaryLabel = screen.getByText("Custom AI practice match");
    const customPractice = summaryLabel.closest("details");
    expect(customPractice).toBeTruthy();
    expect(customPractice!.open).toBe(false);

    fireEvent.click(summaryLabel);
    expect(customPractice!.open).toBe(true);
  });

  it("preserves the mounted simulator path in fixture links", () => {
    renderSetup({}, "/gundam/simulator");

    expect(
      screen.getByRole("link", { name: /Development and Commands/i }).getAttribute("href"),
    ).toBe("/gundam/simulator/tests/st10-development-lab");
    expect(
      screen.getByRole("link", { name: /Opening hand and mulligan/i }).getAttribute("href"),
    ).toBe("/gundam/simulator/tests/setup-default");
  });
});

describe("VsAiSetup: start-button URL assembly", () => {
  it("encodes all four params into the navigation URL", () => {
    const { getStartedUrl } = renderSetup();
    fireEvent.click(screen.getByRole("button", { name: /start practice match/i }));
    const url = getStartedUrl();
    expect(url).toBeDefined();
    const parsed = new URL(url!, "http://test.local");
    expect(parsed.pathname).toBe("/vs-ai");
    expect(parsed.searchParams.get("deck")).toBe("ef-starter");
    expect(parsed.searchParams.get("opponent")).toBe("seed-aggro");
    expect(parsed.searchParams.get("strategy")).toBe("combat-aware");
    expect(parsed.searchParams.get("start")).toBe("1");
  });

  it("reflects the user's deck + strategy selection in the URL", () => {
    const { container, getStartedUrl } = renderSetup();

    fireEvent.change(deckSelect(container, "player-deck"), { target: { value: "gd01-mixed" } });
    fireEvent.click(radio(container, "opponent-strategy", "greedy-legal"));
    fireEvent.click(screen.getByRole("button", { name: /start practice match/i }));

    const parsed = new URL(getStartedUrl()!, "http://test.local");
    expect(parsed.searchParams.get("deck")).toBe("gd01-mixed");
    expect(parsed.searchParams.get("strategy")).toBe("greedy-legal");
  });

  it("launches the promoted combat-aware opponent", () => {
    const { container, getStartedUrl } = renderSetup();

    fireEvent.click(radio(container, "opponent-strategy", "combat-aware"));
    fireEvent.click(screen.getByRole("button", { name: /start practice match/i }));

    const parsed = new URL(getStartedUrl()!, "http://test.local");
    expect(parsed.searchParams.get("strategy")).toBe("combat-aware");
  });

  it("preserves the mounted simulator path", () => {
    const { getStartedUrl } = renderSetup({}, "/gundam/simulator/vs-ai");
    fireEvent.click(screen.getByRole("button", { name: /start practice match/i }));
    const parsed = new URL(getStartedUrl()!, "http://test.local");
    expect(parsed.pathname).toBe("/gundam/simulator/vs-ai");
  });
});

describe("VsAiSetup: props", () => {
  it("honors initialPlayerDeck / initialOpponentDeck / initialStrategy", () => {
    const { getStartedUrl } = renderSetup({
      initialPlayerDeck: "seed-aggro",
      initialOpponentDeck: "gd01-mixed",
      initialStrategy: "greedy-legal",
    });
    fireEvent.click(screen.getByRole("button", { name: /start practice match/i }));
    const parsed = new URL(getStartedUrl()!, "http://test.local");
    expect(parsed.searchParams.get("deck")).toBe("seed-aggro");
    expect(parsed.searchParams.get("opponent")).toBe("gd01-mixed");
    expect(parsed.searchParams.get("strategy")).toBe("greedy-legal");
  });
});
