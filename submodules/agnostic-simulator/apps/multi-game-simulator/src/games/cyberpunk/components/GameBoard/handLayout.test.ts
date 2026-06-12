import { describe, expect, it } from "vitest";
import { computePlayerHandLayout } from "./handLayout";

describe("computePlayerHandLayout", () => {
  it("keeps opening hands readable with gentler rotation and wider spacing", () => {
    const layout = computePlayerHandLayout(6, 960);

    expect(layout.cardWidth).toBeCloseTo(78);
    expect(layout.cards[0]?.angle).toBeCloseTo(-7);
    expect(layout.cards[5]?.angle).toBeCloseTo(7);
    expect(layout.cards[0]?.y).toBeCloseTo(10);

    const centerStep = layout.cards[1]!.x - layout.cards[0]!.x;
    expect(centerStep).toBeGreaterThanOrEqual(layout.cardWidth * 0.58);
  });

  it("keeps larger hands compact enough to fit the play surface", () => {
    const layout = computePlayerHandLayout(9, 960);

    expect(layout.cards[0]?.angle).toBeCloseTo(-11);
    expect(layout.cards[8]?.angle).toBeCloseTo(11);
    expect(layout.cards[0]?.y).toBeCloseTo(18);

    const span = layout.cards[8]!.x - layout.cards[0]!.x;
    expect(span).toBeLessThanOrEqual(960 * 0.58);
  });
});
