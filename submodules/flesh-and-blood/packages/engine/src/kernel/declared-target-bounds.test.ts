import { describe, expect, it } from "vitest";
import { declaredObjectTargetBounds } from "./declared-target-bounds.ts";

const objectTarget = {
  selector: "object" as const,
  declared: "on-stack" as const,
  zones: ["permanent"] as const,
};

describe("declaredObjectTargetBounds", () => {
  it("treats count: { type: up-to } as a 0..N chooser", () => {
    const bounds = declaredObjectTargetBounds(
      { ...objectTarget, count: { type: "up-to", amount: 3 } },
      (amount) => (typeof amount === "number" ? amount : null),
      false,
      5,
    );
    expect(bounds).toEqual({ count: 3, min: 0 });
  });

  it("keeps a bare numeric count mandatory", () => {
    const bounds = declaredObjectTargetBounds(
      { ...objectTarget, count: 2 },
      (amount) => (typeof amount === "number" ? amount : null),
      false,
      5,
    );
    expect(bounds).toEqual({ count: 2, min: 2 });
  });

  it("honors the deprecated upTo flag on a numeric count", () => {
    const bounds = declaredObjectTargetBounds(
      { ...objectTarget, count: 2, upTo: true },
      (amount) => (typeof amount === "number" ? amount : null),
      false,
      5,
    );
    expect(bounds).toEqual({ count: 2, min: 0 });
  });

  it("treats count: { type: all } as the exact legal set size", () => {
    const evaluate = (): number => Number.POSITIVE_INFINITY;
    const bounds = declaredObjectTargetBounds(
      { ...objectTarget, count: { type: "all" } },
      evaluate,
      false,
      4,
    );
    expect(bounds).toEqual({ count: 4, min: 4 });
  });

  it("treats count: { type: any-number } as a 0..set-size chooser", () => {
    const evaluate = (): number => Number.POSITIVE_INFINITY;
    const bounds = declaredObjectTargetBounds(
      { ...objectTarget, count: { type: "any-number" } },
      evaluate,
      false,
      4,
    );
    expect(bounds).toEqual({ count: 4, min: 0 });
  });

  it("treats optional all as 0..set size", () => {
    const bounds = declaredObjectTargetBounds(
      { ...objectTarget, count: { type: "all" } },
      () => Number.POSITIVE_INFINITY,
      true,
      3,
    );
    expect(bounds).toEqual({ count: 3, min: 0 });
  });

  it("does not evaluate quantifiers as numeric amounts", () => {
    const evaluate = (): number => {
      throw new Error("quantifiers must not use the numeric amount evaluator");
    };
    expect(
      declaredObjectTargetBounds({ ...objectTarget, count: { type: "all" } }, evaluate, false, 2),
    ).toEqual({ count: 2, min: 2 });
    expect(
      declaredObjectTargetBounds(
        { ...objectTarget, count: { type: "any-number" } },
        evaluate,
        false,
        2,
      ),
    ).toEqual({ count: 2, min: 0 });
  });
});
