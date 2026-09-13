import { describe, expect, it } from "vitest";

describe("card subpath exports", () => {
  it("loads one authored unit without the aggregate registry entrypoint", async () => {
    const cardModule = await import("@tcg/flesh-and-blood-cards/cards/actions/snatch");

    expect(cardModule.snatchRed.slug).toBe("snatch-red");
    expect(cardModule.snatchYellow.slug).toBe("snatch-yellow");
    expect(cardModule.snatchBlue.slug).toBe("snatch-blue");
    expect(cardModule).not.toHaveProperty("fleshAndBloodStructuredCardsByCanonicalId");
  });
});
