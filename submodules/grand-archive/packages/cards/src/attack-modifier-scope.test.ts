import { describe, expect, it } from "vitest";
import { compileInstruction } from "../scripts/compile-card-abilities.ts";

describe("attack modifier precedence and scope", () => {
  for (const source of [undefined, "Flameblessed Trainee"]) {
    for (const amount of [3, -2]) {
      it(`keeps ${amount} power on the current attack with source=${source}`, () => {
        expect(
          compileInstruction(`This attack gets ${amount > 0 ? "+" : ""}${amount} POWER`, source)
            ?.effect,
        ).toMatchObject({
          kind: "continuous",
          subjects: { kind: "current-attack" },
          duration: { kind: "this-attack" },
          change: {
            kind: "numeric",
            property: "power",
            operation: amount < 0 ? "subtract" : "add",
            amount: Math.abs(amount),
          },
        });
      });
    }
  }
  it("preserves a named source's indefinite bonus", () => {
    expect(
      compileInstruction("Flameblessed Trainee gets +3 POWER", "Flameblessed Trainee")?.effect,
    ).toMatchObject({
      kind: "continuous",
      subjects: { kind: "source" },
      duration: { kind: "permanent" },
    });
  });
});
