import { describe, expect, it } from "bun:test";
import { sugarRushSpeedwayFinishLine } from "./035-sugar-rush-speedway-finish-line";
import { sugarRushSpeedwayFinishLineEnchanted } from "./207-sugar-rush-speedway-finish-line-enchanted";
import { treasureMountainAzuriteSeaIsland } from "./203-treasure-mountain-azurite-sea-island";
import { treasureMountainAzuriteSeaIslandEnchanted } from "./222-treasure-mountain-azurite-sea-island-enchanted";

describe("set 006 location enchanted parity", () => {
  it("matches Sugar Rush Speedway enchanted parity", () => {
    expect(sugarRushSpeedwayFinishLineEnchanted.canonicalId).toBe(
      sugarRushSpeedwayFinishLine.canonicalId,
    );
    expect(sugarRushSpeedwayFinishLineEnchanted.missingImplementation).toBe(
      sugarRushSpeedwayFinishLine.missingImplementation,
    );
    expect(sugarRushSpeedwayFinishLineEnchanted.missingTests).toBe(
      sugarRushSpeedwayFinishLine.missingTests,
    );
    expect(sugarRushSpeedwayFinishLineEnchanted.abilities).toEqual(
      sugarRushSpeedwayFinishLine.abilities,
    );
  });

  it("matches Treasure Mountain enchanted parity", () => {
    expect(treasureMountainAzuriteSeaIslandEnchanted.canonicalId).toBe(
      treasureMountainAzuriteSeaIsland.canonicalId,
    );
    expect(treasureMountainAzuriteSeaIslandEnchanted.missingImplementation).toBe(
      treasureMountainAzuriteSeaIsland.missingImplementation,
    );
    expect(treasureMountainAzuriteSeaIslandEnchanted.missingTests).toBe(
      treasureMountainAzuriteSeaIsland.missingTests,
    );
    expect(treasureMountainAzuriteSeaIslandEnchanted.abilities).toEqual(
      treasureMountainAzuriteSeaIsland.abilities,
    );
  });
});
