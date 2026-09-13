// @vitest-environment jsdom
import { useEffect } from "react";
import { describe, expect, it, afterEach } from "vite-plus/test";
import { render, cleanup, fireEvent, within } from "@testing-library/react";

import { CardHoverPreview } from "./CardHoverPreview.tsx";
import { CardInspectProvider, useCardInspect } from "./card-inspect-context.tsx";
import type { GameCardData } from "../types.ts";

/**
 * The hover preview used to show only the color-tinted `ArtFallback`
 * (tiny name on a gradient) while the card art fetched, and it fetched
 * lazily on every hover. The preview now renders a readable text
 * representation until the art is ready, loads eagerly, and remembers
 * loaded URLs so re-hovers skip the fallback entirely.
 *
 * Note: the loaded/failed URL caches are module-level, so each test uses
 * its own image URL to stay isolated.
 */
describe("CardHoverPreview · text fallback and image-status cache", () => {
  afterEach(cleanup);

  const baseCard: GameCardData = {
    id: "unit_1",
    name: "RX-78-2 Gundam",
    cardType: "unit",
    color: "blue",
    cost: 4,
    level: 3,
    ap: 4,
    hp: 3,
    baseAp: 4,
    baseHp: 3,
    keywords: [{ keyword: "Blocker" }, { keyword: "Repair", value: 1 }],
    traits: ["Earth Federation", "White Base Team"],
    effect: "[When Deployed] Rest up to 1 enemy Unit.",
  };

  function HoverHarness({ card }: { readonly card: GameCardData }) {
    const inspect = useCardInspect();
    useEffect(() => {
      inspect?.setHover(card);
    }, [inspect, card]);
    return <CardHoverPreview />;
  }

  function renderPreview(card: GameCardData) {
    return render(
      <CardInspectProvider>
        <HoverHarness card={card} />
      </CardInspectProvider>,
    );
  }

  it("shows the text fallback with an 'Image loading' chip before the art loads", () => {
    const { getByTestId, container } = renderPreview({
      ...baseCard,
      img: "https://example.com/preview-loading.webp",
    });
    const fallback = getByTestId("card-preview-fallback");
    expect(fallback).toBeTruthy();
    const fallbackText = within(fallback);
    expect(fallbackText.getByText("Image loading")).toBeTruthy();
    expect(fallbackText.getByText("RX-78-2 Gundam")).toBeTruthy();
    expect(fallbackText.getByText("Cost 4")).toBeTruthy();
    expect(fallbackText.getByText("AP 4")).toBeTruthy();
    expect(fallbackText.getByText("HP 3")).toBeTruthy();
    expect(fallbackText.getByText("Blocker · Repair 1")).toBeTruthy();
    expect(fallbackText.getByText("Earth Federation / White Base Team")).toBeTruthy();
    expect(fallbackText.getByText("[When Deployed] Rest up to 1 enemy Unit.")).toBeTruthy();
    // The preview art must load eagerly, not lazily.
    expect(container.querySelector("img")?.getAttribute("loading")).toBe("eager");
  });

  it("shows the fallback permanently with no status chip when the card has no image", () => {
    const { getByTestId, queryByText } = renderPreview({
      ...baseCard,
      id: "token_1",
      name: "Token Unit",
      img: undefined,
      set: undefined,
      cardNumber: undefined,
    });
    expect(getByTestId("card-preview-fallback")).toBeTruthy();
    expect(queryByText("Image loading")).toBeNull();
    expect(queryByText("Image unavailable")).toBeNull();
  });

  it("drops the fallback once the art loads and skips it on re-hover via the URL cache", () => {
    const img = "https://example.com/preview-cached.webp";
    const { getByTestId, queryByTestId, container, rerender } = renderPreview({
      ...baseCard,
      img,
    });
    expect(getByTestId("card-preview-fallback")).toBeTruthy();

    const image = container.querySelector("img");
    expect(image).toBeTruthy();
    fireEvent.load(image!);
    expect(queryByTestId("card-preview-fallback")).toBeNull();

    // Re-hovering a (same-art) card must not flash the fallback again.
    rerender(
      <CardInspectProvider>
        <HoverHarness card={{ ...baseCard, id: "unit_2", name: "RX-78-2 Gundam (Copy)", img }} />
      </CardInspectProvider>,
    );
    expect(queryByTestId("card-preview-fallback")).toBeNull();
  });

  it("switches to 'Image unavailable' when the art fails to load", () => {
    const { getByTestId, getByText, container } = renderPreview({
      ...baseCard,
      img: "https://example.com/preview-broken.webp",
    });
    fireEvent.error(container.querySelector("img")!);
    expect(getByTestId("card-preview-fallback")).toBeTruthy();
    expect(getByText("Image unavailable")).toBeTruthy();
  });
});
