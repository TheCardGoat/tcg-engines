import { describe, expect, it } from "vitest";
import { compileInstruction } from "../scripts/compile-card-abilities.ts";

describe("other-card selection compilation", () => {
  it("excludes the ability source from graveyard choices", () => {
    expect(
      compileInstruction("Banish two other fire element cards from your graveyard.")?.effect,
    ).toMatchObject({
      kind: "banish",
      selection: {
        candidates: {
          filter: {
            kind: "all",
            filters: [{ kind: "element", oneOf: ["FIRE"] }, { kind: "not-source" }],
          },
        },
      },
    });
  });
});
