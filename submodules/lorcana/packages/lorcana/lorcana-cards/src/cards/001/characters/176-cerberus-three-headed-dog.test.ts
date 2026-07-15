import { describe, expect, it } from "bun:test";
import { cerberusThreeheadedDog } from "./176-cerberus-three-headed-dog";

describe("Cerberus - Three-Headed Dog", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(cerberusThreeheadedDog.vanilla).toBe(true);
    expect(cerberusThreeheadedDog.abilities).toBeUndefined();
  });
});
