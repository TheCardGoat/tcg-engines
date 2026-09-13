import { describe, expect, it } from "vitest";
import { grandArchiveCardPresentation, grandArchiveConcealedCard } from "./card-presentation.ts";

const back = "https://cdn.tcg.online/public/grand-archive/simulator/card-back.webp";

describe("Grand Archive card presentation", () => {
  it("uses the portrait back for concealed cards, including stale square presentation", () => {
    const concealed = grandArchiveConcealedCard("opponent:hand:concealed:0", "opponent");
    const presented = grandArchiveCardPresentation({
      ...concealed,
      backImageUrl: "placeholder.svg",
      hiddenBackLayout: "square",
      imageAspectRatio: 1,
    });
    expect(presented).toEqual(concealed);
    expect(presented).toMatchObject({ backImageUrl: back, imageAspectRatio: 5 / 7 });
    expect(presented.hiddenBackLayout).toBeUndefined();
    expect(presented.imageUrl).toBeUndefined();
  });

  it("preserves public artwork and geometry while providing a back for face-down display", () => {
    const publicCard = {
      ...grandArchiveConcealedCard("known-card", "self"),
      face: "public" as const,
      title: "Known card",
      imageUrl: "https://example.test/printed.webp",
      imageAspectRatio: 0.72,
    };
    const presented = grandArchiveCardPresentation(publicCard);
    expect(presented).toMatchObject(publicCard);
    expect(presented.backImageUrl).toBe(back);
    expect(grandArchiveCardPresentation(presented)).toEqual(presented);
  });
});
