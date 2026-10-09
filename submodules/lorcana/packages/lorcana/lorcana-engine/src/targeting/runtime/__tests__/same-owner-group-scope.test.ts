import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import { PLAYER_ONE, PLAYER_TWO } from "../../../testing/unit-harness";
import { createTestContext } from "../../../testing/unit-harness";
import { validateAndNormalizeTargetSelection, type TargetAnalysis } from "../target-analysis";

const GROUP_A = "group-a" as CardInstanceId;
const GROUP_B = "group-b" as CardInstanceId;
const OTHER = "other" as CardInstanceId;

function makeAnalysis(overrides: Partial<TargetAnalysis> = {}): TargetAnalysis {
  return {
    targetDsl: [],
    cardCandidates: [GROUP_A, GROUP_B, OTHER],
    playerCandidates: [],
    allowedZones: ["play"],
    minSelections: 0,
    maxSelections: 0,
    requiresExplicitSelection: false,
    allowsDeferredResolutionWithoutInitialSelection: false,
    allowDuplicateTargets: false,
    sameOwnerTargetGroups: [
      { candidateIds: [GROUP_A, GROUP_B], minSelections: 0, maxSameOwnerSelections: 2 },
    ],
    ...overrides,
  };
}

type ValidationContext = Parameters<typeof validateAndNormalizeTargetSelection>[2];

function makeContext(args: {
  owners: Record<string, string>;
  names?: Record<string, string>;
}): ValidationContext {
  const runtimeCtx = createTestContext({
    zoneCards: Object.fromEntries(
      Object.entries(args.owners).map(([cardId, owner]) => [`play:${owner}`, [cardId]]),
    ),
    definitions: Object.fromEntries(
      Object.entries(args.names ?? {}).map(([cardId, name]) => [
        cardId,
        { id: cardId, cardType: "character" as const, name },
      ]),
    ),
  });
  return { currentPlayer: PLAYER_ONE, ctx: runtimeCtx } as ValidationContext;
}

describe("same-owner/same-name group scope", () => {
  it("rejects two selected group members owned by different players", () => {
    const result = validateAndNormalizeTargetSelection(
      [GROUP_A, GROUP_B],
      makeAnalysis(),
      makeContext({
        owners: { [GROUP_A]: PLAYER_ONE, [GROUP_B]: PLAYER_TWO, [OTHER]: PLAYER_ONE },
      }),
    );
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errorCode).toBe("TARGETS_MUST_SHARE_OWNER");
    }
  });

  it("does not drag cards picked for other slots into the group's owner check", () => {
    // A future multi-descriptor card combines the same-owner group with an
    // independent descriptor: the unrelated card's owner must not fail the
    // group (slot-scoped constraint, rule 6.1.3).
    const result = validateAndNormalizeTargetSelection(
      [GROUP_A, OTHER],
      makeAnalysis(),
      makeContext({
        owners: { [GROUP_A]: PLAYER_ONE, [GROUP_B]: PLAYER_ONE, [OTHER]: PLAYER_TWO },
      }),
    );
    expect(result.valid).toBe(true);
  });

  it("rejects two selected same-name group members with different names", () => {
    const result = validateAndNormalizeTargetSelection(
      [GROUP_A, GROUP_B],
      makeAnalysis({
        sameOwnerTargetGroups: undefined,
        sameNameTargetGroups: [{ candidateIds: [GROUP_A, GROUP_B] }],
      }),
      makeContext({
        owners: { [GROUP_A]: PLAYER_ONE, [GROUP_B]: PLAYER_ONE, [OTHER]: PLAYER_ONE },
        names: { [GROUP_A]: "Flotsam", [GROUP_B]: "Jetsam", [OTHER]: "Other" },
      }),
    );
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.errorCode).toBe("TARGETS_MUST_SHARE_NAME");
    }
  });

  it("does not drag cards picked for other slots into the same-name check", () => {
    const result = validateAndNormalizeTargetSelection(
      [GROUP_A, OTHER],
      makeAnalysis({
        sameOwnerTargetGroups: undefined,
        sameNameTargetGroups: [{ candidateIds: [GROUP_A, GROUP_B] }],
      }),
      makeContext({
        owners: { [GROUP_A]: PLAYER_ONE, [GROUP_B]: PLAYER_ONE, [OTHER]: PLAYER_ONE },
        names: { [GROUP_A]: "Flotsam", [GROUP_B]: "Flotsam", [OTHER]: "Jetsam" },
      }),
    );
    expect(result.valid).toBe(true);
  });
});
