import { describe, expect, it } from "bun:test";
import { arielCuriousTraveler } from "./018-ariel-curious-traveler";
import { arielCuriousTravelerP3Promo } from "./p3-043-ariel-curious-traveler-promo";

describe("Ariel - Curious Traveler (P3 Promo)", () => {
  it("has identical abilities (excluding id) to the regular printing", () => {
    const stripIds = (abilities: typeof arielCuriousTraveler.abilities) =>
      abilities?.map(({ id: _id, ...rest }) => rest);
    expect(stripIds(arielCuriousTravelerP3Promo.abilities)).toEqual(
      stripIds(arielCuriousTraveler.abilities),
    );
  });

  it("shares stats with the regular printing", () => {
    expect(arielCuriousTravelerP3Promo.cost).toBe(arielCuriousTraveler.cost);
    expect(arielCuriousTravelerP3Promo.strength).toBe(arielCuriousTraveler.strength);
    expect(arielCuriousTravelerP3Promo.willpower).toBe(arielCuriousTraveler.willpower);
    expect(arielCuriousTravelerP3Promo.lore).toBe(arielCuriousTraveler.lore);
    expect(arielCuriousTravelerP3Promo.classifications).toEqual(
      arielCuriousTraveler.classifications,
    );
    expect(arielCuriousTravelerP3Promo.inkType).toEqual(arielCuriousTraveler.inkType);
  });
});
