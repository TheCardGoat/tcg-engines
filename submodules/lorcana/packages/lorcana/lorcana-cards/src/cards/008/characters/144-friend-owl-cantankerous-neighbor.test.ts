import { describe, expect, it } from "bun:test";
import { friendOwlCantankerousNeighbor } from "./144-friend-owl-cantankerous-neighbor";

describe("Friend Owl - Cantankerous Neighbor", () => {
  it("is a vanilla character with the printed baseline stats", () => {
    expect(friendOwlCantankerousNeighbor.vanilla).toBe(true);
    expect(friendOwlCantankerousNeighbor.abilities).toBeUndefined();
    expect(friendOwlCantankerousNeighbor.cost).toBe(2);
    expect(friendOwlCantankerousNeighbor.strength).toBe(2);
    expect(friendOwlCantankerousNeighbor.willpower).toBe(2);
    expect(friendOwlCantankerousNeighbor.lore).toBe(2);
    expect(friendOwlCantankerousNeighbor.inkable).toBe(true);
  });
});
