import { describe, expect, it } from "bun:test";
import { jumbaJookibaRenegadeScientist } from "./083-jumba-jookiba-renegade-scientist";

describe("Jumba Jookiba - Renegade Scientist", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(jumbaJookibaRenegadeScientist.vanilla).toBe(true);
    expect(jumbaJookibaRenegadeScientist.abilities).toBeUndefined();
  });
});
