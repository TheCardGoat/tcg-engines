import { describe, expect, it } from "bun:test";

import {
  countHiddenScrollableItems,
  getInitialHiddenItemsToRight,
  getScrollableItemStep,
} from "@/features/simulator/board/item-zone-mobile.js";

describe("mobile item zone", () => {
  it("shows an initial right-overflow affordance only on mobile when more than two items exist", () => {
    expect(getInitialHiddenItemsToRight("mobile", 4)).toBe(2);
    expect(getInitialHiddenItemsToRight("mobile", 2)).toBe(0);
    expect(getInitialHiddenItemsToRight("desktop", 5)).toBe(0);
  });

  it("counts hidden items on each side from scroll position", () => {
    const counts = countHiddenScrollableItems({
      viewportLeft: 90,
      viewportWidth: 120,
      elements: [
        { offsetLeft: 0, offsetWidth: 60 },
        { offsetLeft: 70, offsetWidth: 60 },
        { offsetLeft: 140, offsetWidth: 60 },
        { offsetLeft: 210, offsetWidth: 60 },
      ],
    });

    expect(counts).toEqual({
      left: 2,
      right: 1,
    });
  });

  it("uses item spacing as the scroll step when multiple cards exist", () => {
    expect(
      getScrollableItemStep({
        viewportWidth: 120,
        elements: [
          { offsetLeft: 0, offsetWidth: 44 },
          { offsetLeft: 52, offsetWidth: 44 },
          { offsetLeft: 104, offsetWidth: 44 },
        ],
      }),
    ).toBe(52);
  });
});
