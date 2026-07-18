import { describe, expect, it } from "bun:test";

import {
  countHiddenScrollableItems,
  getInitialHiddenItemsToRight,
  getScrollableItemStep,
} from "../../features/simulator/board/item-zone-mobile.js";

describe("item zone scrolling", () => {
  it("shows an initial right-overflow affordance only on mobile when more than two items exist", () => {
    expect(getInitialHiddenItemsToRight("mobile", 4)).toBe(2);
    expect(getInitialHiddenItemsToRight("mobile", 2)).toBe(0);
    expect(getInitialHiddenItemsToRight("desktop", 5)).toBe(0);
  });

  it("counts hidden items on each side from scroll position in any layout", () => {
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

  it("reports desktop overflow so both player shelves can expose directional controls", () => {
    const counts = countHiddenScrollableItems({
      viewportLeft: 0,
      viewportWidth: 120,
      elements: [
        { offsetLeft: 0, offsetWidth: 60 },
        { offsetLeft: 70, offsetWidth: 60 },
        { offsetLeft: 140, offsetWidth: 60 },
      ],
    });

    expect(counts).toEqual({ left: 0, right: 2 });
  });

  it("advances a page while retaining one item of visual context", () => {
    expect(
      getScrollableItemStep({
        viewportWidth: 120,
        elements: [
          { offsetLeft: 0, offsetWidth: 44 },
          { offsetLeft: 52, offsetWidth: 44 },
          { offsetLeft: 104, offsetWidth: 44 },
        ],
      }),
    ).toBe(68);
  });
});
