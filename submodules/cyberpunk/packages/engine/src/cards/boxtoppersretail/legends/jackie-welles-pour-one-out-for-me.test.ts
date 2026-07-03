import { describe, expect, it } from "vite-plus/test";
import { boxToppersRetailCards } from "@tcg/cyberpunk-cards";

describe("Jackie Welles Pour One Out For Me", () => {
  it("has a canonical structured card definition", () => {
    const card = boxToppersRetailCards.find(
      (candidate) => candidate.slug === "jackie-welles-pour-one-out-for-me",
    );

    expect(card?.slug).toBe("jackie-welles-pour-one-out-for-me");
    expect(card?.set.code).toBe("boxtoppersretail");
  });
});
