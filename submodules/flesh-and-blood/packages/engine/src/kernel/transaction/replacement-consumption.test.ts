import { describe, expect, it } from "vitest";
import { selectReplacementConsumptionCandidates } from "./replacement-consumption.ts";

// Kernel bookkeeping contract only: these are policy records, not card definitions
// or gameplay fixtures. Card evidence remains in the real Double Down scenarios.
describe("replacement consumption candidate bookkeeping", () => {
  const applied = {
    replacementId: "follow-up",
    consumptionPolicy: { kind: "on-application" as const },
  };
  const offered = {
    replacementId: "offered",
    consumptionPolicy: { kind: "on-opportunity" as const },
  };
  const unoffered = {
    replacementId: "unoffered",
    consumptionPolicy: { kind: "on-opportunity" as const },
  };
  const persistent = { replacementId: "persistent", consumptionPolicy: { kind: "never" as const } };

  it("retains newly applicable on-application policies for the committed application gate", () => {
    expect(selectReplacementConsumptionCandidates([], [applied], [], [])).toEqual([applied]);
  });

  it("does not consume an unoffered optional opportunity or persistent effect", () => {
    expect(selectReplacementConsumptionCandidates([], [unoffered, persistent], [], [])).toEqual([]);
  });

  it("retains either an accepted or declined offered opportunity without duplicates", () => {
    for (const accepted of [true, false]) {
      expect(
        selectReplacementConsumptionCandidates(
          [],
          [offered, unoffered],
          accepted ? [offered.replacementId] : [],
          accepted ? [] : [offered.replacementId],
        ),
      ).toEqual([offered]);
      expect(
        selectReplacementConsumptionCandidates([offered], [offered], [offered.replacementId], []),
      ).toEqual([offered]);
    }
  });
});
