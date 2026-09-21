import { describe, expect, test } from "vite-plus/test";
import { compareGigStats, computeGigSideStats } from "./gigStats";
import type { GigDieView } from "../../engine";

function die(
  dieType: GigDieView["dieType"],
  faceValue: number,
  id = `${dieType}-${faceValue}-${Math.random()}`,
): GigDieView {
  return { id, dieType, label: dieType.toUpperCase(), faceValue };
}

describe("computeGigSideStats", () => {
  test("street cred is the sum of face values and count is the dice count", () => {
    const stats = computeGigSideStats([die("d6", 3), die("d8", 7), die("d4", 2)]);
    expect(stats.cred).toBe(12);
    expect(stats.count).toBe(3);
  });

  test("min gigs are dice at face 1 and max gigs at their die type's highest face", () => {
    const stats = computeGigSideStats([die("d4", 1), die("d20", 20), die("d6", 6), die("d10", 4)]);
    expect(stats.minCount).toBe(1);
    expect(stats.maxCount).toBe(2);
  });

  test("even/odd counts split by face value", () => {
    const stats = computeGigSideStats([die("d6", 2), die("d6", 5), die("d8", 8)]);
    expect(stats.evenCount).toBe(2);
    expect(stats.oddCount).toBe(1);
  });

  test("three same-value dice make exactly one value-pair (rule 6.5.1)", () => {
    const stats = computeGigSideStats([die("d4", 3), die("d6", 3), die("d8", 3)]);
    expect(stats.pairs).toBe(1);
  });

  test("distinct values make no pairs; two pairs come from four matching dice", () => {
    expect(computeGigSideStats([die("d4", 1), die("d6", 2), die("d8", 3)]).pairs).toBe(0);
    expect(
      computeGigSideStats([die("d4", 5), die("d6", 5), die("d8", 5), die("d10", 5)]).pairs,
    ).toBe(2);
  });

  test("empty gig area has zero everything", () => {
    expect(computeGigSideStats([])).toEqual({
      cred: 0,
      count: 0,
      minCount: 0,
      maxCount: 0,
      evenCount: 0,
      oddCount: 0,
      pairs: 0,
    });
  });
});

describe("compareGigStats", () => {
  test("reports the friendly/rival leader, gap, and ties", () => {
    const leading = compareGigStats([die("d6", 6), die("d4", 4)], [die("d4", 1)]);
    expect(leading.credLeader).toBe("friendly");
    expect(leading.credGap).toBe(9);

    const trailing = compareGigStats([die("d4", 1)], [die("d6", 6), die("d4", 4)]);
    expect(trailing.credLeader).toBe("rival");
    expect(trailing.credGap).toBe(9);

    const tied = compareGigStats([die("d4", 3)], [die("d6", 3)]);
    expect(tied.credLeader).toBe("tied");
    expect(tied.credGap).toBe(0);
  });

  test("does not invent a numeric gap while either side has Null Street Cred", () => {
    expect(compareGigStats([], [die("d20", 20)])).toMatchObject({
      credLeader: null,
      credGap: null,
    });
    expect(compareGigStats([die("d4", 1)], [])).toMatchObject({
      credLeader: null,
      credGap: null,
    });
  });
});
