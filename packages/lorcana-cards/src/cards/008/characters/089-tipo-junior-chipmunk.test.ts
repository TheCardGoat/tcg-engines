import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { tipoJuniorChipmunk } from "./089-tipo-junior-chipmunk";

describe("Tipo - Junior Chipmunk", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(tipoJuniorChipmunk)).toBe(true);
  });
});
