import { describe, expect, it } from "vitest";
import { compileInstruction } from "../scripts/compile-card-abilities.ts";

describe("negative subtype target compilation", () => {
  it("excludes the named subtype while retaining the object type", () => {
    const result = compileInstruction("Destroy target non-Fractal phantasia.");
    expect(result?.targets).toMatchObject([
      {
        candidates: {
          kind: "object",
          filter: {
            kind: "all",
            filters: [
              { kind: "type", oneOf: ["PHANTASIA"] },
              { kind: "not", filter: { kind: "subtype", oneOf: ["FRACTAL"] } },
            ],
          },
        },
      },
    ]);
  });
});
