import { describe, expect, it } from "bun:test";
import { adelaideBonfamillePatronOfTheArts } from "./164-adelaide-bonfamille-patron-of-the-arts";

describe("Adelaide Bonfamille - Patron of the Arts", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(adelaideBonfamillePatronOfTheArts.vanilla).toBe(true);
    expect(adelaideBonfamillePatronOfTheArts.abilities).toBeUndefined();
  });

  it("has correct stats", () => {
    expect(adelaideBonfamillePatronOfTheArts.cost).toBe(2);
    expect(adelaideBonfamillePatronOfTheArts.strength).toBe(2);
    expect(adelaideBonfamillePatronOfTheArts.willpower).toBe(3);
    expect(adelaideBonfamillePatronOfTheArts.lore).toBe(1);
  });

  it("is inkable", () => {
    expect(adelaideBonfamillePatronOfTheArts.inkable).toBe(true);
  });
});
