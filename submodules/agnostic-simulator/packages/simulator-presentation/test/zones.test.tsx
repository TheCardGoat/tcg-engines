import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { PresentationZone, cardRowSlot } from "../src/zones";
import { CardSurface } from "../src/dom";

describe("shared presentation contracts", () => {
  it("accepts game-owned layouts and omits cards without a visible pose", () => {
    const cards = [
      { id: "public", art: "visible" },
      { id: "hidden", art: "secret" },
    ];
    const html = renderToStaticMarkup(
      <PresentationZone
        cards={cards}
        getKey={(card) => card.id}
        getPose={(card) => (card.id === "public" ? { x: 42 } : undefined)}
      >
        {(card, pose) => <span data-x={pose.x}>{card.art}</span>}
      </PresentationZone>,
    );
    expect(html).toContain('data-x="42"');
    expect(html).toContain("visible");
    expect(html).not.toContain("secret");
  });
  it("uses caller units for both world-space rows and pixel grids", () => {
    expect(cardRowSlot(0, 3, 1.5)).toEqual({ x: -1.5, y: 0 });
    expect(cardRowSlot(2, 3, 1.5)).toEqual({ x: 1.5, y: 0 });
    expect(cardRowSlot(5, 8, 100, 4, 150)).toEqual({ x: -50, y: 150 });
  });
  it("keeps selection accessible without adding a label below the card", () => {
    const html = renderToStaticMarkup(
      <CardSurface
        selected
        interactive
        role="button"
        aria-label="Replace card"
        aria-pressed={true}
        back={<span>Back</span>}
      />,
    );
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('data-selected="true"');
    expect(html).toContain("--selection-rim:#f5e642");
    expect(html).not.toContain(">Replace card<");
  });
});
