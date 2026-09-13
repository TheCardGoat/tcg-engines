import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vite-plus/test";

import { CardImage } from "./CardImage.js";

it("forwards standard img attributes onto the rendered img element", () => {
  const markup = renderToStaticMarkup(
    <CardImage
      src="https://example.invalid/card.webp"
      alt="Card"
      data-art-variant="extended-art"
    />,
  );

  expect(markup).toContain('data-art-variant="extended-art"');
});
