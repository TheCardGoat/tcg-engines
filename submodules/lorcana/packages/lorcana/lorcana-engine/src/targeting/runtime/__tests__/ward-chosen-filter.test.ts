import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import {
  createCardPlayed,
  createTestContext,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing/unit-harness";
import type { QueryResolutionContext } from "../target-resolver";
import { resolveCandidateTargets } from "../target-resolver";

const P1_CHAR = "p1-char" as CardInstanceId;
const P1_WARD_CHAR = "p1-ward-char" as CardInstanceId;
const P2_CHAR = "p2-char" as CardInstanceId;
const P2_WARD_CHAR = "p2-ward-char" as CardInstanceId;

const WARD_DESCRIPTOR = {
  selector: "chosen" as const,
  count: 1,
  owner: "any" as const,
  zones: ["play"] as string[],
  cardTypes: ["character"] as string[],
};

const WARD_ABILITY = { type: "keyword", keyword: "Ward" };

describe("Ward candidate filter for chosen selector", () => {
  it("excludes opponent characters with Ward from the candidate pool", () => {
    const ctx = createTestContext({
      zoneCards: {
        "play:player-one": [P1_CHAR, P1_WARD_CHAR],
        "play:player-two": [P2_CHAR, P2_WARD_CHAR],
      },
      definitions: {
        "p1-char": { id: "p1-char", cardType: "character" },
        "p1-ward-char": {
          id: "p1-ward-char",
          cardType: "character",
          abilities: [WARD_ABILITY],
        },
        "p2-char": { id: "p2-char", cardType: "character" },
        "p2-ward-char": {
          id: "p2-ward-char",
          cardType: "character",
          abilities: [WARD_ABILITY],
        },
      },
    });

    const candidates = resolveCandidateTargets(
      ctx,
      createCardPlayed({ cardId: "source", playerId: PLAYER_ONE }),
      WARD_DESCRIPTOR,
    );

    // P1 characters are always included (own cards)
    expect(candidates).toContain(P1_CHAR);
    expect(candidates).toContain(P1_WARD_CHAR);
    // P2 non-Ward character is included
    expect(candidates).toContain(P2_CHAR);
    // P2 Ward character is excluded
    expect(candidates).not.toContain(P2_WARD_CHAR);
  });

  it("includes opponent characters with Ward when skipWardExclusion is true (damage source)", () => {
    const ctx = createTestContext({
      zoneCards: {
        "play:player-one": [P1_CHAR, P1_WARD_CHAR],
        "play:player-two": [P2_CHAR, P2_WARD_CHAR],
      },
      definitions: {
        "p1-char": { id: "p1-char", cardType: "character" },
        "p1-ward-char": {
          id: "p1-ward-char",
          cardType: "character",
          abilities: [WARD_ABILITY],
        },
        "p2-char": { id: "p2-char", cardType: "character" },
        "p2-ward-char": {
          id: "p2-ward-char",
          cardType: "character",
          abilities: [WARD_ABILITY],
        },
      },
    });

    const queryContext: Partial<QueryResolutionContext> = {
      skipWardExclusion: true,
    };

    const candidates = resolveCandidateTargets(
      ctx,
      createCardPlayed({ cardId: "source", playerId: PLAYER_ONE }),
      WARD_DESCRIPTOR,
      queryContext,
    );

    // All characters should be available when skipWardExclusion is true
    expect(candidates).toContain(P1_CHAR);
    expect(candidates).toContain(P1_WARD_CHAR);
    expect(candidates).toContain(P2_CHAR);
    expect(candidates).toContain(P2_WARD_CHAR);
  });
});
