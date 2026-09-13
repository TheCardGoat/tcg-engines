// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { describe, expect, it, vi } from "vite-plus/test";

import { MatchHistoryPanel } from "./MatchHistoryPanel";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;
Object.defineProperty(window, "matchMedia", {
  configurable: true,
  value: vi.fn((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});

describe("MatchHistoryPanel", () => {
  it("renders a flat turn narrative without diagnostic counts or filters", () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    act(() =>
      root.render(
        <MantineProvider>
          <MatchHistoryPanel
            rows={[
              {
                id: "start",
                turn: 1,
                timestamp: new Date(0).toISOString(),
                actorSeatId: "p1",
                turnOwnerSeatId: "p1",
                kind: "match-start",
                title: "Match started · You go first",
              },
              {
                id: "attack",
                turn: 1,
                timestamp: new Date(1).toISOString(),
                actorSeatId: "p1",
                turnOwnerSeatId: "p1",
                kind: "combat",
                title: "You attacked with Wrecker Romp",
                cardRefs: [{ name: "Wrecker Romp", definitionId: "wrecker-romp" }],
                metrics: [{ kind: "value", label: "Attack", value: 7 }],
                details: [
                  {
                    kind: "cards",
                    label: "Cost",
                    cards: [{ name: "Sink Below", definitionId: "sink-below" }],
                    amount: 2,
                  },
                ],
              },
              {
                id: "attack-resolved",
                turn: 1,
                timestamp: new Date(2).toISOString(),
                actorSeatId: "p1",
                turnOwnerSeatId: "p1",
                kind: "combat",
                title: "Wrecker Romp became the attacking card",
              },
              {
                id: "defense",
                turn: 1,
                timestamp: new Date(3).toISOString(),
                actorSeatId: "p2",
                turnOwnerSeatId: "p1",
                kind: "combat",
                title: "Opponent defended with Sink Below",
              },
            ]}
            viewerSeatId="p1"
            rowGroup={(row) =>
              row.kind === "match-start"
                ? { key: "system", label: "Match", variant: "system" }
                : row.actorSeatId === "p1"
                  ? { key: "p1", label: "You", variant: "viewer" }
                  : { key: "p2", label: "Opponent", variant: "opponent" }
            }
            turnOwnerLabel={() => "You"}
            renderCardReference={(card) => (
              <button aria-label={`Preview ${card.name}`}>{card.name}</button>
            )}
          />
        </MantineProvider>,
      ),
    );

    expect(container.textContent).toContain("Turn 1");
    expect(container.textContent).toContain("You");
    expect(container.textContent).toContain("Match started · You go first");
    expect(container.textContent).toContain("Attack 7");
    expect(container.querySelector('[aria-label="Preview Wrecker Romp"]')).not.toBeNull();
    expect(container.querySelector('[aria-label="Preview Sink Below"]')).not.toBeNull();
    expect(container.querySelector('[aria-label="Opponent response on your turn"]')).toBeNull();
    expect(container.querySelectorAll('[data-off-turn="true"]')).toHaveLength(0);
    expect(container.querySelectorAll('[data-alignment="left"]')).toHaveLength(4);
    expect(container.querySelectorAll('[data-group-start="true"]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-group-variant="system"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-group-variant="viewer"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-group-variant="opponent"]')).toHaveLength(1);
    expect(container.textContent).not.toMatch(/entries|events/i);
    expect(
      [...container.querySelectorAll("button")].some((button) => button.textContent === "All"),
    ).toBe(false);
    expect(
      [...container.querySelectorAll("button")].some((button) => button.textContent === "Yours"),
    ).toBe(false);
    act(() => root.unmount());
    container.remove();
  });

  it("keeps chronological rows on one reading edge while preserving actor tint", () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    act(() =>
      root.render(
        <MantineProvider>
          <MatchHistoryPanel
            rows={[
              {
                id: "viewer-action",
                turn: 1,
                timestamp: new Date(1).toISOString(),
                actorSeatId: "p1",
                kind: "activity",
                title: "You played Wrecker Romp",
              },
              {
                id: "opponent-action",
                turn: 1,
                timestamp: new Date(2).toISOString(),
                actorSeatId: "p2",
                kind: "combat",
                title: "Opponent defended with Sink Below",
              },
            ]}
            viewerSeatId="p1"
            rowAlignment="left"
            rowVariant={(row) => (row.actorSeatId === "p1" ? "viewer" : "opponent")}
            turnOwnerLabel={() => "You"}
          />
        </MantineProvider>,
      ),
    );

    expect(container.querySelectorAll('[data-alignment="left"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-group-variant="viewer"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-group-variant="opponent"]')).toHaveLength(1);
    expect(container.querySelectorAll("[data-grouped]")).toHaveLength(0);
    act(() => root.unmount());
    container.remove();
  });
});
