import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";

import CardBackTestHost from "./CardBack.test-host.svelte";

describe("CardBack", () => {
  it("falls back to the normal asset for art-only custom card backs", () => {
    const customBackUrl = "https://example.com/back.webp";

    const { body } = render(CardBackTestHost, {
      props: {
        displayWidth: 40,
        displayHeight: 56,
        imageFormat: "art_only",
        cardBackSrc: customBackUrl,
      },
    });

    expect(body).toContain(`data-card-back-src="${customBackUrl}"`);
    expect(body).toContain("card-back__image--art-only-fallback");
  });
});
