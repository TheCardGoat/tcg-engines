import { describe, expect, it } from "bun:test";
import {
  createPlayerId,
  type AutomatedActionDecisionTrace,
  type CardInstanceId,
} from "@tcg/lorcana-engine";
import { buildPresentedDecisionTrace } from "./decision-trace-presentation.js";

const PLAYER_ONE = createPlayerId("player_one");
const QUESTER_ID = "quester-1" as CardInstanceId;

describe("buildPresentedDecisionTrace", () => {
  it("formats policy-driven resolve decisions for the AI viewer", () => {
    const trace = {
      actorId: PLAYER_ONE,
      boardSnapshot: {
        bagCount: 1,
        boardCounts: {
          [PLAYER_ONE]: 1,
        },
        handCounts: {
          [PLAYER_ONE]: 5,
        },
        inkCounts: {
          [PLAYER_ONE]: 2,
        },
        loreTotals: {
          [PLAYER_ONE]: 0,
        },
        pendingEffectCount: 0,
        stateFingerprint: "trace:fingerprint",
      },
      diagnostics: [],
      executionAttempts: [],
      kind: "execution",
      orderedCandidates: [
        {
          candidate: {
            family: "resolveBag",
            bagId: "bag:doc:drastic-measures",
            resolveOptional: false,
          },
          family: "resolveBag",
          heuristics: [
            { direction: "asc", key: "familyOrder", value: 3 },
            { direction: "desc", key: "resolveBenefitScore", value: 0 },
            { direction: "preferTrue", key: "resolvePolicyMatched", value: true },
            { direction: "asc", key: "resolvePolicyDecision", value: "decline" },
            {
              direction: "asc",
              key: "resolvePolicyReason",
              value: "keep-larger-inkable-hand",
            },
            { direction: "asc", key: "resolvePolicyHandSize", value: 5 },
            { direction: "asc", key: "resolvePolicyUninkableHandCount", value: 1 },
            { direction: "asc", key: "stableKey", value: "resolveBag:doc:false" },
          ],
          stableKey: "resolveBag:doc:false",
        },
        {
          candidate: {
            family: "resolveBag",
            bagId: "bag:doc:drastic-measures",
            resolveOptional: true,
          },
          family: "resolveBag",
          heuristics: [
            { direction: "asc", key: "familyOrder", value: 3 },
            { direction: "desc", key: "resolveBenefitScore", value: 6 },
            { direction: "preferTrue", key: "resolvePolicyMatched", value: true },
            { direction: "asc", key: "resolvePolicyDecision", value: "decline" },
            {
              direction: "asc",
              key: "resolvePolicyReason",
              value: "keep-larger-inkable-hand",
            },
            { direction: "asc", key: "stableKey", value: "resolveBag:doc:true" },
          ],
          stableKey: "resolveBag:doc:true",
        },
        {
          candidate: {
            family: "quest",
            cardId: QUESTER_ID,
          },
          family: "quest",
          heuristics: [
            { direction: "asc", key: "familyOrder", value: 4.5 },
            { direction: "desc", key: "printedLore", value: 1 },
            { direction: "asc", key: "stableKey", value: `quest:${QUESTER_ID}` },
          ],
          stableKey: `quest:${QUESTER_ID}`,
        },
      ],
      selectedCandidate: {
        candidate: {
          family: "resolveBag",
          bagId: "bag:doc:drastic-measures",
          resolveOptional: false,
        },
        family: "resolveBag",
        heuristics: [
          { direction: "asc", key: "familyOrder", value: 3 },
          { direction: "preferTrue", key: "resolvePolicyMatched", value: true },
          { direction: "asc", key: "resolvePolicyDecision", value: "decline" },
          {
            direction: "asc",
            key: "resolvePolicyReason",
            value: "keep-larger-inkable-hand",
          },
          { direction: "asc", key: "resolvePolicyHandSize", value: 5 },
          { direction: "asc", key: "resolvePolicyUninkableHandCount", value: 1 },
          { direction: "asc", key: "stableKey", value: "resolveBag:doc:false" },
        ],
        stableKey: "resolveBag:doc:false",
      },
      strategyName: "default-lore-race",
      turnNumber: 3,
      unsupportedSkips: [],
      validationSkips: [],
    } satisfies AutomatedActionDecisionTrace;

    const presented = buildPresentedDecisionTrace(trace);

    expect(presented?.selectedCandidate?.stableKey).toBe("resolveBag:doc:false");
    expect(presented?.selectedCandidate?.policyMatched).toBe(true);
    expect(presented?.selectedCandidate?.policyDecision).toBe("Decline optional effect");
    expect(presented?.selectedCandidate?.policyReason).toBe(
      "Keep the larger hand because it still contains inkable cards.",
    );
    expect(presented?.selectedCandidate?.fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "resolvePolicyHandSize",
          value: "5",
        }),
        expect.objectContaining({
          key: "resolvePolicyUninkableHandCount",
          value: "1",
        }),
      ]),
    );
    expect(presented?.topCandidates).toHaveLength(3);
  });

  it("returns undefined when no trace is available", () => {
    expect(buildPresentedDecisionTrace(undefined)).toBeUndefined();
  });
});
