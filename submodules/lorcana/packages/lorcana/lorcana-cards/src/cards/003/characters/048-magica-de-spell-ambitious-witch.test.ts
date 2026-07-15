import { describe, expect, it } from "bun:test";
import { magicaDeSpellAmbitiousWitch } from "./048-magica-de-spell-ambitious-witch";

describe("Magica De Spell - Ambitious Witch", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(magicaDeSpellAmbitiousWitch.vanilla).toBe(true);
    expect(magicaDeSpellAmbitiousWitch.abilities).toBeUndefined();
  });
});
