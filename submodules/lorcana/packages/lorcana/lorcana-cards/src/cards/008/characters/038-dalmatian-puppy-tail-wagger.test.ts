import { describe, expect, it } from "bun:test";
import { dalmatianPuppyTailWagger } from "./038-dalmatian-puppy-tail-wagger";

describe("Dalmatian Puppy - Tail Wagger", () => {
  it("allows up to 99 copies in your deck", () => {
    expect(dalmatianPuppyTailWagger.cardCopyLimit).toBe(99);
  });
});
