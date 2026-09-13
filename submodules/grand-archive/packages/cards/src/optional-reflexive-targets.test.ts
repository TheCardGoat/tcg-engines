import { describe, expect, it } from "vitest";
import { compileInstruction } from "../scripts/compile-card-abilities.ts";

describe("optional consequence target ownership", () => {
  it("announces When-you-do consequence targets on the reflexive trigger", () => {
    const result = compileInstruction(
      "You may pay (2). When you do, put a buff counter on target Guardian ally you control.",
    );
    expect(result?.targets).toBeUndefined();
    expect(result?.effect).toMatchObject({
      kind: "optional",
      effect: {
        kind: "reflexive",
        targets: [{ id: "target-1" }],
        action: { kind: "pay" },
        consequence: { kind: "add-counter" },
      },
    });
  });
  it("retains If-you-do consequence targets on the original ability", () => {
    const result = compileInstruction(
      "You may pay (2). If you do, put a buff counter on target Guardian ally you control.",
    );
    expect(result?.targets).toMatchObject([{ id: "target-1" }]);
    expect(result?.effect).toMatchObject({ kind: "optional", effect: { kind: "sequence" } });
  });
});
