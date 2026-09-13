import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";

import { CardSlot } from "./CardSlot";

describe("CardSlot", () => {
  test("renders the card image when imageUrl is given", () => {
    const markup = renderToStaticMarkup(
      <CardSlot imageUrl="https://example.com/card.png" label="Unit" />,
    );

    expect(markup).toContain('data-card-slot="md"');
    expect(markup).toContain('src="https://example.com/card.png"');
    expect(markup).toContain('alt="Unit"');
    expect(markup).not.toContain("card-slot--empty");
  });

  test("renders the centered label when the slot is empty", () => {
    const markup = renderToStaticMarkup(<CardSlot label="Resource" size="sm" />);

    expect(markup).toContain('data-card-slot="sm"');
    expect(markup).toContain("card-slot--empty");
    expect(markup).toContain(">Resource</span>");
    expect(markup).not.toContain("<img");
  });

  test("applies the dashed hook class when dashed is set", () => {
    const markup = renderToStaticMarkup(<CardSlot label="Drop" dashed />);

    expect(markup).toContain("card-slot--dashed");
    expect(markup).toContain("border-dashed");
  });

  test("renders a game-neutral face-down block when faceDown is set", () => {
    const markup = renderToStaticMarkup(<CardSlot faceDown />);

    expect(markup).toContain("card-slot-face-down");
    expect(markup).toContain("var(--card-bg)");
    expect(markup).not.toContain("<img");
  });
});
