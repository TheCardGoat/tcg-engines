import { describe, expect, it } from "vite-plus/test";
import { boxToppersRetailCards } from "@tcg/cyberpunk-cards";

describe("Yorinobu Arasaka Embracing Destruction", () => {
  it("has a canonical structured card definition", () => {
    const card = boxToppersRetailCards.find(
      (candidate) => candidate.slug === "yorinobu-arasaka-embracing-destruction",
    );

    expect(card?.slug).toBe("yorinobu-arasaka-embracing-destruction");
    expect(card?.set.code).toBe("boxtoppersretail");
  });
});
