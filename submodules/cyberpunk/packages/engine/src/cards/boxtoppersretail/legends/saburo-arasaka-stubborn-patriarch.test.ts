import { describe, expect, it } from "vite-plus/test";
import { boxToppersRetailCards } from "@tcg/cyberpunk-cards";

describe("Saburo Arasaka Stubborn Patriarch", () => {
  it("has a canonical structured card definition", () => {
    const card = boxToppersRetailCards.find(
      (candidate) => candidate.slug === "saburo-arasaka-stubborn-patriarch",
    );

    expect(card?.slug).toBe("saburo-arasaka-stubborn-patriarch");
    expect(card?.set.code).toBe("boxtoppersretail");
  });
});
