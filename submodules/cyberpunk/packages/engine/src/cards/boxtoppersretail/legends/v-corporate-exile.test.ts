import { describe, expect, it } from "vite-plus/test";
import { boxToppersRetailCards } from "@tcg/cyberpunk-cards";

describe("V Corporate Exile", () => {
  it("has a canonical structured card definition", () => {
    const card = boxToppersRetailCards.find((candidate) => candidate.slug === "v-corporate-exile");

    expect(card?.slug).toBe("v-corporate-exile");
    expect(card?.set.code).toBe("boxtoppersretail");
  });
});
