import { describe, expect, it } from "bun:test";
import { jimHawkinsThrillSeeker } from "./110-jim-hawkins-thrill-seeker";

describe("Jim Hawkins - Thrill Seeker", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(jimHawkinsThrillSeeker.vanilla).toBe(true);
    expect(jimHawkinsThrillSeeker.abilities).toBeUndefined();
  });
});
