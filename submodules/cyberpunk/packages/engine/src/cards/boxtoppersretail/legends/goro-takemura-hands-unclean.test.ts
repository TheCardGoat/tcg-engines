import { describe, expect, it } from "vite-plus/test";
import { boxToppersRetailCards } from "@tcg/cyberpunk-cards";

describe("Goro Takemura Hands Unclean", () => {
  it("has a canonical structured card definition", () => {
    const card = boxToppersRetailCards.find(
      (candidate) => candidate.slug === "goro-takemura-hands-unclean",
    );

    expect(card?.slug).toBe("goro-takemura-hands-unclean");
    expect(card?.set.code).toBe("boxtoppersretail");
  });
});
