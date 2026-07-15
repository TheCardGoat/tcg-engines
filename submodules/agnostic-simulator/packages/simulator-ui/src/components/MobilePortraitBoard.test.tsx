// @vitest-environment jsdom

import { act, type ReactElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";

import {
  MobileBattlefieldLane,
  MobileHandDock,
  MobileMirrorLedger,
  MobilePlayerRail,
  MobilePortraitBoard,
  MobileZoneInventoryPopover,
} from "./MobilePortraitBoard";

describe("mobile portrait board primitives", () => {
  test("renders the portrait board slots in rail-to-hand order", () => {
    const markup = renderToStaticMarkup(
      <MobilePortraitBoard
        topRail={<span>top rail</span>}
        opponentHand={<span>rival hand</span>}
        opponentBattlefield={<span>rival field</span>}
        ledger={<span>ledger</span>}
        playerBattlefield={<span>player field</span>}
        playerHand={<span>player hand</span>}
        bottomRail={<span>bottom rail</span>}
      />,
    );

    expect(markup.indexOf("top rail")).toBeLessThan(markup.indexOf("rival hand"));
    expect(markup.indexOf("rival hand")).toBeLessThan(markup.indexOf("rival field"));
    expect(markup.indexOf("ledger")).toBeLessThan(markup.indexOf("player field"));
    expect(markup.indexOf("player hand")).toBeLessThan(markup.indexOf("bottom rail"));
  });

  test("keeps rail identity, clock, and controls in distinct slots", () => {
    const markup = renderToStaticMarkup(
      <MobilePlayerRail
        side="player"
        left={<span>identity</span>}
        center={<span>clock</span>}
        right={<button type="button">controls</button>}
      />,
    );

    expect(markup).toContain('data-side="player"');
    expect(markup.indexOf("identity")).toBeLessThan(markup.indexOf("clock"));
    expect(markup.indexOf("clock")).toBeLessThan(markup.indexOf("controls"));
  });

  test("renders explicit battlefield scroll cues when overflow is provided", () => {
    const markup = renderToStaticMarkup(
      <MobileBattlefieldLane
        scrollCueLabel="field cards"
        scrollCues={{ before: true, after: true }}
      >
        <div>cards</div>
      </MobileBattlefieldLane>,
    );

    expect(markup).toContain('data-scroll-axis="horizontal"');
    expect(markup).toContain("Jump to left edge of field cards");
    expect(markup).toContain("Jump to right edge of field cards");
    expect(markup).toContain("‹");
    expect(markup).toContain("›");
  });

  test("lets battlefield lanes opt into vertical scrolling", () => {
    const markup = renderToStaticMarkup(
      <MobileBattlefieldLane
        scrollAxis="vertical"
        scrollCueLabel="field cards"
        scrollCues={{ before: false, after: true }}
      >
        <div>cards</div>
      </MobileBattlefieldLane>,
    );

    expect(markup).toContain('data-scroll-axis="vertical"');
    expect(markup).toContain("Jump to bottom edge of field cards");
    expect(markup).toContain("End");
  });

  test("hides measured battlefield scroll cues when all cards are visible", async () => {
    const view = await renderClient(
      <MobileBattlefieldLane
        scrollCueLabel="field cards"
        scrollTargetSelector='[data-testid="field-cards"]'
      >
        <div data-testid="field-cards" ref={installScrollerMetrics({ afterClipped: false })}>
          <div data-testid="field-card-a" />
          <div data-testid="field-card-b" />
        </div>
      </MobileBattlefieldLane>,
    );

    expect(view.container.querySelector('[aria-label^="Jump to right edge"]')).toBeNull();
    expect(view.container.querySelector('[aria-label^="Jump to left edge"]')).toBeNull();
    view.unmount();
  });

  test("shows measured battlefield scroll cues when a card is clipped", async () => {
    const view = await renderClient(
      <MobileBattlefieldLane
        scrollCueLabel="field cards"
        scrollTargetSelector='[data-testid="field-cards"]'
      >
        <div data-testid="field-cards" ref={installScrollerMetrics({ afterClipped: true })}>
          <div data-testid="field-card-a" />
          <div data-testid="field-card-b" />
        </div>
      </MobileBattlefieldLane>,
    );

    expect(
      view.container.querySelector('[aria-label="Jump to right edge of field cards"]'),
    ).not.toBeNull();
    view.unmount();
  });

  test("scroll cue buttons jump to the nearest field edge", async () => {
    const scrollCalls: ScrollToOptions[] = [];
    const view = await renderClient(
      <MobileBattlefieldLane
        scrollCueLabel="field cards"
        scrollTargetSelector='[data-testid="field-cards"]'
        scrollCues={{ before: true, after: true }}
      >
        <div
          data-testid="field-cards"
          ref={(node) => {
            if (!node) return;
            defineMetric(node, "clientWidth", 100);
            defineMetric(node, "scrollWidth", 280);
            node.scrollTo = (options?: ScrollToOptions | number) => {
              if (typeof options === "object") {
                scrollCalls.push(options);
              }
            };
          }}
        >
          <div />
        </div>
      </MobileBattlefieldLane>,
    );

    await clickButton(view.container, "Jump to right edge of field cards");
    expect(scrollCalls.at(-1)).toMatchObject({ left: 180, behavior: "smooth" });

    await clickButton(view.container, "Jump to left edge of field cards");
    expect(scrollCalls.at(-1)).toMatchObject({ left: 0, behavior: "smooth" });
    view.unmount();
  });

  test("renders a mirror ledger with stable slots for empty state variants", () => {
    const legends = ["Legend A", "Empty", "Used"];
    const markup = renderToStaticMarkup(
      <MobileMirrorLedger
        left={
          <div>
            {legends.map((legend) => (
              <span key={legend}>{legend}</span>
            ))}
          </div>
        }
        center={<strong>Priority: You</strong>}
        right={<div>No legends</div>}
      />,
    );

    expect(markup).toContain("Legend A");
    expect(markup).toContain("Empty");
    expect(markup).toContain("Used");
    expect(markup).toContain("Priority: You");
    expect(markup).toContain("No legends");
  });

  test("lets mirror ledgers omit the center slot when the game does not need one", () => {
    const markup = renderToStaticMarkup(
      <MobileMirrorLedger left={<div>Rival shelf</div>} right={<div>Player shelf</div>} />,
    );

    expect(markup).toContain('data-has-center="false"');
    expect(markup).toContain("Rival shelf");
    expect(markup).toContain("Player shelf");
    expect(markup).not.toContain("Priority:");
  });

  test("renders hand dock and a closed zone inventory trigger without panel content", () => {
    const markup = renderToStaticMarkup(
      <MobileHandDock>
        <MobileZoneInventoryPopover>
          <span>Deck 38</span>
        </MobileZoneInventoryPopover>
      </MobileHandDock>,
    );

    expect(markup).toContain("Zones");
    expect(markup).not.toContain("Deck 38");
  });
});

async function renderClient(element: ReactElement): Promise<{
  container: HTMLDivElement;
  root: Root;
  unmount: () => void;
}> {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  await act(async () => {
    root.render(element);
  });

  return {
    container,
    root,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

async function clickButton(container: HTMLElement, label: string) {
  const button = container.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);
  if (!button) {
    throw new Error(`Missing button: ${label}`);
  }
  await act(async () => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

function installScrollerMetrics({ afterClipped }: { afterClipped: boolean }) {
  return (node: HTMLDivElement | null) => {
    if (!node) {
      return;
    }
    defineMetric(node, "clientWidth", 100);
    defineMetric(node, "scrollWidth", 106);
    defineMetric(node, "clientHeight", 40);
    defineMetric(node, "scrollHeight", 40);
    defineMetric(node, "scrollLeft", 0);
    defineMetric(node, "scrollTop", 0);
    node.getBoundingClientRect = () => rect({ left: 0, right: 100, top: 0, bottom: 40 });

    const [first, second] = Array.from(node.children) as HTMLElement[];
    if (!first || !second) {
      throw new Error("Expected the measured scroller fixture to render two cards.");
    }
    first.getBoundingClientRect = () => rect({ left: 6, right: 42, top: 0, bottom: 40 });
    second.getBoundingClientRect = () =>
      rect({ left: 50, right: afterClipped ? 108 : 92, top: 0, bottom: 40 });
  };
}

function defineMetric(node: HTMLElement, key: keyof HTMLElement, value: number) {
  Object.defineProperty(node, key, {
    configurable: true,
    value,
  });
}

function rect({
  left,
  right,
  top,
  bottom,
}: {
  left: number;
  right: number;
  top: number;
  bottom: number;
}): DOMRect {
  return {
    x: left,
    y: top,
    left,
    right,
    top,
    bottom,
    width: right - left,
    height: bottom - top,
    toJSON: () => ({}),
  };
}
