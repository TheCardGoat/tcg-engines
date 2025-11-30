import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { iagoPrettyPolly } from "./040-iago-pretty-polly";

describe("Iago - Pretty Polly", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(iagoPrettyPolly)).toBe(true);
  });
});
