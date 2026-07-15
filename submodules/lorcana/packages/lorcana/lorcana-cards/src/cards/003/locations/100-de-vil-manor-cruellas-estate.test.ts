import { describe, expect, it } from "bun:test";
import { deVilManorCruellasEstate } from "./100-de-vil-manor-cruellas-estate";

describe("De Vil Manor - Cruella's Estate", () => {
  it("is a vanilla location with the printed baseline stats", () => {
    expect(deVilManorCruellasEstate.vanilla).toBe(true);
    expect(deVilManorCruellasEstate.abilities).toBeUndefined();
    expect(deVilManorCruellasEstate.cost).toBe(1);
    expect(deVilManorCruellasEstate.moveCost).toBe(1);
    expect(deVilManorCruellasEstate.willpower).toBe(4);
    expect(deVilManorCruellasEstate.lore).toBe(1);
    expect(deVilManorCruellasEstate.inkable).toBe(true);
  });
});
