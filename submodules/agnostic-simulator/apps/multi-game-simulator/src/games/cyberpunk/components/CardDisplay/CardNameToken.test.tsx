// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vite-plus/test";

import { CardNameToken } from "./CardNameToken";

const preview = vi.hoisted(() => ({
  hide: vi.fn(),
  show: vi.fn(),
}));

vi.mock("../CardPreview/CardPreviewContext", () => ({
  useCardPreview: () => preview,
}));

vi.mock("../../../../lib/media-query", () => ({
  useHasHover: () => false,
}));

vi.mock("../../engine/zoneViews", () => ({
  useCardView: () => null,
  useCardViewByName: () => ({
    cardId: "top-dog",
    definitionId: "top-dog-definition",
    imageUrl: "https://cdn.test/top-dog.webp",
    name: "Caliber: Totentanz's Top Dog",
    color: "yellow",
    cardType: "unit",
    hasSellTag: false,
    rulesText: null,
    classifications: [],
    keywords: [],
    cost: 3,
    effectiveCost: 3,
    costEffects: [],
    power: 5,
    effectivePower: 5,
    activeEffects: [],
    effectiveRules: [],
    spent: false,
    hasLag: false,
    faceDown: false,
  }),
}));

describe("CardNameToken", () => {
  beforeEach(() => {
    preview.hide.mockReset();
    preview.show.mockReset();
  });

  test("opens the card inspector without activating an enclosing choice when tapped", () => {
    const enclosingChoice = vi.fn();
    render(
      <button type="button" onClick={enclosingChoice}>
        <CardNameToken fallbackName="Caliber: Totentanz's Top Dog" />
      </button>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Inspect Caliber: Totentanz's Top Dog" }));

    expect(preview.show).toHaveBeenCalledWith(
      expect.objectContaining({
        imageUrl: "https://cdn.test/top-dog.webp",
        alt: "Caliber: Totentanz's Top Dog",
        face: "public",
      }),
    );
    expect(enclosingChoice).not.toHaveBeenCalled();
  });
});
