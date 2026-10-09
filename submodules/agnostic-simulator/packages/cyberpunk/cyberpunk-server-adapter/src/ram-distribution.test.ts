import { describe, expect, it } from "vitest";
import { projectRamDistribution } from "./ram-distribution";

describe("RAM distribution", () => {
  it("separates 4 green / 2 red from 2 green / 4 red", () => {
    const green = { color: "green", ram: 2 };
    const red = { color: "red", ram: 2 };
    const first = projectRamDistribution([green, green, red]);
    const second = projectRamDistribution([green, red, red]);
    expect(first?.key).toBe("blue:0|green:4|red:2|yellow:0");
    expect(second?.key).toBe("blue:0|green:2|red:4|yellow:0");
    expect(first?.colors).toEqual(second?.colors);
    expect(first?.label).toBe("4 Green / 2 Red");
    expect(projectRamDistribution([red, green, green])).toEqual(first);
  });

  it("sums actual RAM values rather than assuming two per Legend", () => {
    expect(
      projectRamDistribution([
        { color: "blue", ram: 1 },
        { color: "blue", ram: 3 },
        { color: "yellow", ram: 2 },
      ])?.key,
    ).toBe("blue:4|green:0|red:0|yellow:2");
  });

  it("handles mono-color and three-color crews", () => {
    expect(
      projectRamDistribution(Array.from({ length: 3 }, () => ({ color: "red", ram: 2 })))?.label,
    ).toBe("6 Red");
    expect(
      projectRamDistribution(["blue", "green", "yellow"].map((color) => ({ color, ram: 2 })))
        ?.label,
    ).toBe("2 Blue / 2 Green / 2 Yellow");
  });

  it("does not turn incomplete or invalid Legend data into a RAM profile", () => {
    const known = [
      { color: "green", ram: 2 },
      { color: "red", ram: 2 },
    ];
    expect(projectRamDistribution(known)).toBeNull();
    for (const ram of [null, -1, NaN, 1.5]) {
      expect(projectRamDistribution([...known, { color: "blue", ram }])).toBeNull();
    }
    expect(projectRamDistribution([...known, { color: "unknown", ram: 2 }])).toBeNull();
  });
});
