import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { sisuInHerElement } from "./039-sisu-in-her-element";

describe("Sisu - In Her Element", () => {
  it("should have Challenger 2 ability", () => {
    expect(hasKeyword(sisuInHerElement, "Challenger")).toBe(true);
  });
});
