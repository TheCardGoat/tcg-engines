import { describe, expect, it } from "bun:test";
import { billyBonesKeeperOfTheMap } from "./104-billy-bones-keeper-of-the-map";

describe("Billy Bones - Keeper of the Map", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(billyBonesKeeperOfTheMap.vanilla).toBe(true);
    expect(billyBonesKeeperOfTheMap.abilities).toBeUndefined();
  });
});
