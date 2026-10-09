import { describe, expect, it } from "vitest";
import { handFanLayout } from "@tcg/simulator-presentation";

describe("shared hand fan", () => {
  it("keeps small and dense hands reachable within horizontal bounds", () => {
    for (const width of [360, 800, 1280])
      for (const count of [1, 3, 7, 10, 20]) {
        const fan = handFanLayout(width, 580, count);
        for (let index = 0; index < count; index++) {
          const rest = fan.pose(index),
            inspected = fan.pose(index, true);
          expect(rest.height / rest.width).toBeCloseTo(1.4);
          expect(inspected.left).toBeGreaterThanOrEqual(12);
          expect(inspected.left + inspected.width).toBeLessThanOrEqual(width - 12);
          expect(inspected.top).toBeGreaterThanOrEqual(0);
          expect(fan.hit(rest.left + rest.width / 2, 575, null)).toBe(index);
        }
      }
  });
  it("uses a symmetric downward arc with level inspection", () => {
    const fan = handFanLayout(1280, 580, 7);
    expect(fan.pose(0).rotation).toBeLessThan(0);
    expect(fan.pose(6).rotation).toBe(-fan.pose(0).rotation);
    expect(fan.pose(0).top).toBe(fan.pose(6).top);
    expect(fan.pose(0).top).toBeGreaterThan(fan.pose(3).top);
    expect(fan.pose(0, true).rotation).toBe(0);
  });
  it("keeps neighbouring poses and hit regions stable during inspection", () => {
    const fan = handFanLayout(800, 580, 10),
      before = fan.pose(5);
    fan.pose(4, true);
    expect(fan.pose(5)).toEqual(before);
    expect(fan.hit(before.left + before.width / 2, 575, 4)).toBe(5);
    expect(fan.hit(400, 10, 4)).toBeNull();
    expect(fan.hit(-1, 575, 4)).toBeNull();
    expect(handFanLayout(800, 580, 0).hit(400, 575, null)).toBeNull();
  });
});
