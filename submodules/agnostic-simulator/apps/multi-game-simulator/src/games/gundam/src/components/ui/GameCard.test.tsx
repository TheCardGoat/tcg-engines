// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { TargetingProvider } from "@tcg/simulator-ui";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { CardInspectProvider } from "./card/card-inspect-context.tsx";
import { GameCard } from "./GameCard.tsx";
import { CardHoverPreview } from "./card/CardHoverPreview.tsx";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("GameCard inspection ownership", () => {
  it("dismisses its hover preview when the card is clicked", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(any-hover: hover)",
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }));
    render(
      <TargetingProvider active={false} candidateIds={[]} role="effectTarget">
        <CardInspectProvider>
          <div data-testid="click-source">
            <GameCard id="unit" name="BuCUE" cardType="unit" />
          </div>
          <CardHoverPreview />
        </CardInspectProvider>
      </TargetingProvider>,
    );
    const source = screen.getByTestId("click-source").firstElementChild!;
    fireEvent.mouseEnter(source);
    expect(screen.queryByTestId("card-hover-preview")).not.toBeNull();

    fireEvent.click(source);

    expect(screen.queryByTestId("card-hover-preview")).toBeNull();
    fireEvent.mouseEnter(source);
    expect(screen.queryByTestId("card-hover-preview")).toBeNull();
    fireEvent.mouseLeave(source);
    fireEvent.mouseEnter(source);
    expect(screen.queryByTestId("card-hover-preview")).not.toBeNull();
  });

  it("dismisses a stale hover preview when the viewport changes and allows hovering again", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(any-hover: hover)",
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }));
    render(
      <TargetingProvider active={false} candidateIds={[]} role="effectTarget">
        <CardInspectProvider>
          <div data-testid="hover-source">
            <GameCard id="unit" name="Guncannon" cardType="unit" />
          </div>
          <CardHoverPreview />
        </CardInspectProvider>
      </TargetingProvider>,
    );
    const source = screen.getByTestId("hover-source").firstElementChild!;
    fireEvent.mouseEnter(source);
    expect(screen.queryByTestId("card-hover-preview")).not.toBeNull();
    fireEvent(window, new Event("resize"));
    expect(screen.queryByTestId("card-hover-preview")).toBeNull();
    fireEvent.mouseLeave(source);
    fireEvent.mouseEnter(source);
    expect(screen.queryByTestId("card-hover-preview")).not.toBeNull();
  });

  it("does not alternate hover state between retained source and destination cards", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <TargetingProvider active={false} candidateIds={[]} role="effectTarget">
        <CardInspectProvider>
          <div data-testid="source-card">
            <GameCard
              id="shared-card"
              name="RX-78-2"
              cardType="unit"
              zoneId="hand:player_one"
              playable
              ap={2}
              hp={3}
            />
          </div>
          <div data-testid="destination-card">
            <GameCard
              id="shared-card"
              name="RX-78-2"
              cardType="unit"
              zoneId="battleArea:player_one"
              deployedThisTurn
              ap={2}
              hp={3}
            />
          </div>
        </CardInspectProvider>
      </TargetingProvider>,
    );

    const sourceWrapper = screen.getByTestId("source-card").firstElementChild;
    expect(sourceWrapper).not.toBeNull();
    fireEvent.mouseEnter(sourceWrapper!);

    expect(
      consoleError.mock.calls.some(([message]) =>
        String(message).includes("Maximum update depth exceeded"),
      ),
    ).toBe(false);
    expect(screen.getAllByText("RX-78-2").length).toBeGreaterThanOrEqual(2);
  });
});
