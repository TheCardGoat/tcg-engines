// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "vite-plus/test";
import type { ReactNode } from "react";

import { CardPreviewProvider } from "../CardPreview/CardPreviewContext";
import { theme } from "../../theme";
import { CardInspectProvider } from "./CardInspectContext";
import { DragDropProvider } from "./DragDropContext";
import { HandZone } from "./HandZone";
import { MobileHandZone } from "./MobileHandZone";

const TEST_IMAGE_URL =
  "https://cdn.tcg.online/public/cyberpunk/cards/welcometonightcityretail/113.webp";

class TestResizeObserver implements ResizeObserver {
  observe(_target: Element, _options?: ResizeObserverOptions): void {}
  unobserve(_target: Element): void {}
  disconnect(): void {}
}

function Providers({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} env="test">
      <CardInspectProvider>
        <CardPreviewProvider>
          <DragDropProvider>{children}</DragDropProvider>
        </CardPreviewProvider>
      </CardInspectProvider>
    </MantineProvider>
  );
}

function testCards() {
  return [
    {
      imageUrl: TEST_IMAGE_URL,
      name: "Hidden Card",
      cardId: "hidden-card",
      definitionId: "hidden-definition",
      cardType: "unit" as const,
      color: "blue" as const,
    },
    {
      imageUrl: TEST_IMAGE_URL,
      name: "Recovered Card",
      cardId: "recovered-card",
      definitionId: "recovered-definition",
      cardType: "program" as const,
      color: "yellow" as const,
      temporaryRevealed: true,
    },
  ];
}

function manyTestCards() {
  return Array.from({ length: 8 }, (_, index) => ({
    imageUrl: TEST_IMAGE_URL,
    name: `Hand Card ${index + 1}`,
    cardId: `hand-card-${index + 1}`,
    definitionId: `hand-definition-${index + 1}`,
    cardType: "unit" as const,
    color: "blue" as const,
  }));
}

function setReadonlyNumberProperty(target: HTMLElement, key: "clientWidth" | "scrollWidth") {
  return (value: number) => {
    Object.defineProperty(target, key, {
      configurable: true,
      value,
    });
  };
}

describe("temporary hand reveal rendering", () => {
  const originalResizeObserver = globalThis.ResizeObserver;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    globalThis.ResizeObserver = TestResizeObserver;
    window.matchMedia = (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList;
  });

  afterEach(() => {
    cleanup();
    globalThis.ResizeObserver = originalResizeObserver;
    window.matchMedia = originalMatchMedia;
  });

  test("desktop opponent hand keeps hidden cards private while rendering temporary reveals face-up", () => {
    const view = render(<HandZone faceDown cards={testCards()} side="opponent" />, {
      wrapper: Providers,
    });

    const handCards = view.getAllByTestId("hand-card");
    expect(handCards).toHaveLength(2);
    expect(handCards[0]?.getAttribute("data-face-down")).toBe("true");
    expect(handCards[0]?.getAttribute("data-card-id")).toBeNull();
    expect(handCards[0]?.getAttribute("data-definition-id")).toBeNull();

    expect(handCards[1]?.getAttribute("data-face-down")).toBe("false");
    expect(handCards[1]?.getAttribute("data-temporary-revealed")).toBe("true");
    expect(handCards[1]?.getAttribute("data-card-id")).toBe("recovered-card");
    expect(handCards[1]?.getAttribute("data-definition-id")).toBe("recovered-definition");
    expect(view.getByAltText("Recovered Card")).not.toBeNull();
  });

  test("mobile opponent hand uses the same privacy boundary", () => {
    const view = render(<MobileHandZone faceDown cards={testCards()} side="opponent" />, {
      wrapper: Providers,
    });

    const handCards = view.getAllByTestId("hand-card");
    expect(handCards).toHaveLength(2);
    expect(handCards[0]?.getAttribute("data-face-down")).toBe("true");
    expect(handCards[0]?.getAttribute("data-card-id")).toBeNull();
    expect(handCards[0]?.getAttribute("data-definition-id")).toBeNull();

    expect(handCards[1]?.getAttribute("data-face-down")).toBe("false");
    expect(handCards[1]?.getAttribute("data-temporary-revealed")).toBe("true");
    expect(handCards[1]?.getAttribute("data-card-id")).toBe("recovered-card");
    expect(handCards[1]?.getAttribute("data-definition-id")).toBe("recovered-definition");
    expect(view.getByAltText("Recovered Card")).not.toBeNull();
  });

  test("mobile player hand exposes overflow cues for hidden cards", async () => {
    const view = render(<MobileHandZone cards={manyTestCards()} side="player" />, {
      wrapper: Providers,
    });

    const handZone = view.getByTestId("hand-zone");
    const scroller = view.getByTestId("mobile-hand-scroller");
    setReadonlyNumberProperty(scroller, "clientWidth")(180);
    setReadonlyNumberProperty(scroller, "scrollWidth")(480);
    Object.defineProperty(scroller, "scrollLeft", {
      configurable: true,
      value: 0,
      writable: true,
    });

    fireEvent.scroll(scroller);

    await waitFor(() => {
      expect(handZone.getAttribute("data-overflow-before")).toBe("false");
      expect(handZone.getAttribute("data-overflow-after")).toBe("true");
    });
    expect(view.getByLabelText("Show more hand cards")).not.toBeNull();
    expect(view.getByTestId("mobile-hand-overflow-after")).not.toBeNull();

    scroller.scrollLeft = 160;
    fireEvent.scroll(scroller);

    await waitFor(() => {
      expect(handZone.getAttribute("data-overflow-before")).toBe("true");
      expect(handZone.getAttribute("data-overflow-after")).toBe("true");
    });
    expect(view.getByLabelText("Show earlier hand cards")).not.toBeNull();
    expect(view.getByTestId("mobile-hand-overflow-before")).not.toBeNull();
  });
});
