import { describe, expect, it } from "bun:test";
import { hasRush } from "@tcg/lorcana";
import { mulanSoldierInTraining } from "./117-mulan-soldier-in-training";

describe("Mulan - Soldier in Training", () => {
  it("should have Rush ability", () => {
    expect(hasRush(mulanSoldierInTraining)).toBe(true);
  });
});
