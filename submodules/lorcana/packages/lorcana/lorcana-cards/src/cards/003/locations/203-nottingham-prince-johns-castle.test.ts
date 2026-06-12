import { describe, expect, it } from "bun:test";
import { nottinghamPrinceJohnsCastle } from "./203-nottingham-prince-johns-castle";

describe("Nottingham - Prince John's Castle", () => {
  it("is a vanilla location with the printed baseline stats", () => {
    expect(nottinghamPrinceJohnsCastle.vanilla).toBe(true);
    expect(nottinghamPrinceJohnsCastle.abilities).toBeUndefined();
    expect(nottinghamPrinceJohnsCastle.cost).toBe(2);
    expect(nottinghamPrinceJohnsCastle.moveCost).toBe(1);
    expect(nottinghamPrinceJohnsCastle.willpower).toBe(6);
    expect(nottinghamPrinceJohnsCastle.lore).toBe(1);
    expect(nottinghamPrinceJohnsCastle.inkable).toBe(true);
  });
});
