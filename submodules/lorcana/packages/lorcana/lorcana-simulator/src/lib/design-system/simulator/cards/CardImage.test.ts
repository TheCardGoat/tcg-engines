import { describe, expect, it } from "bun:test";
import { render } from "svelte/server";
import CardImage from "./CardImage.svelte";

describe("CardImage", () => {
  it("pads numeric set folders", () => {
    const { body } = render(CardImage, {
      props: {
        alt: "Numeric set card",
        number: 21,
        set: 1,
      },
    });

    expect(body).toContain("https://new-cdn.lorcanito.com/public/lorcana/EN/001/021.webp");
  });

  it("normalizes set-prefixed numeric folders", () => {
    const { body } = render(CardImage, {
      props: {
        alt: "Set prefixed card",
        number: "143",
        set: "set6",
      },
    });

    expect(body).toContain("https://new-cdn.lorcanito.com/public/lorcana/EN/006/143.webp");
  });

  it("normalizes single-letter promo and challenge bucket names", () => {
    const { body: promoBody } = render(CardImage, {
      props: {
        alt: "Promo card",
        crop: "art_and_name",
        number: "021",
        set: "P1",
      },
    });
    const { body: challengeBody } = render(CardImage, {
      props: {
        alt: "Challenge card",
        crop: "art_and_name",
        number: "003",
        set: "C2",
      },
    });

    expect(promoBody).toContain(
      "https://new-cdn.lorcanito.com/public/lorcana/EN/P01/art_and_name/021.webp",
    );
    expect(promoBody).not.toContain("/EN/P1/");
    expect(challengeBody).toContain(
      "https://new-cdn.lorcanito.com/public/lorcana/EN/C02/art_and_name/003.webp",
    );
    expect(challengeBody).not.toContain("/EN/C2/");
  });

  it("normalizes P4 challenge promo folders to the asset bucket path", () => {
    const { body } = render(CardImage, {
      props: {
        alt: "Randall Boggs - Scary Smart",
        crop: "art_and_name",
        number: "011",
        set: "P4",
      },
    });

    expect(body).toContain(
      "https://new-cdn.lorcanito.com/public/lorcana/EN/P04/art_and_name/011.webp",
    );
    expect(body).not.toContain("/EN/P4/art_and_name/011.webp");
  });

  it("preserves multi-letter promo bucket names", () => {
    const { body } = render(CardImage, {
      props: {
        alt: "Pocahontas promo card",
        crop: "art_and_name",
        number: "003",
        set: "PD1",
      },
    });

    expect(body).toContain(
      "https://new-cdn.lorcanito.com/public/lorcana/EN/PD1/art_and_name/003.webp",
    );
    expect(body).not.toContain("/EN/PD01/");
  });
});
