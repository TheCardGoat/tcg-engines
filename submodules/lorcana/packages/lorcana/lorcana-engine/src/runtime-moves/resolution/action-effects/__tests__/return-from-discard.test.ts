import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import type { ReturnFromDiscardEffect } from "@tcg/lorcana-types";
import { hasReturnFromDiscardCandidates } from "../return-from-discard-effect";

/**
 * Minimal context shim for `hasReturnFromDiscardCandidates`. The helper only
 * touches `ctx.framework.zones.getCards` and `ctx.cards.getDefinition`, so we
 * can test the filter logic in isolation without a full simulator harness.
 */
const p1 = "p1" as PlayerId;
const asCardId = (s: string) => s as CardInstanceId;

function buildCtx(opts: {
  discardByPlayer: Record<string, string[]>;
  definitions: Record<string, { name?: string; cardType?: string; classifications?: string[] }>;
}) {
  return {
    framework: {
      zones: {
        getCards: ({ zone, playerId }: { zone: string; playerId: string }) =>
          zone === "discard" ? (opts.discardByPlayer[playerId] ?? []) : [],
      },
    },
    cards: {
      getDefinition: (id: string) => opts.definitions[id],
    },
  } as unknown as Parameters<typeof hasReturnFromDiscardCandidates>[0];
}

describe("return-from-discard", () => {
  describe("source filter", () => {
    it("excludes the source card itself when filter is { type: 'source', ref: 'other' }", () => {
      // Player report bugrepL-L9OusYMIjcZE0Eborf3 (Alien — True Believer):
      // banished card must not be a valid candidate for its own
      // "return another character card named X" effect.
      const ctx = buildCtx({
        discardByPlayer: { p1: ["alien-self", "alien-other"] },
        definitions: {
          "alien-self": { name: "Alien", cardType: "character" },
          "alien-other": { name: "Alien", cardType: "character" },
        },
      });

      const effect: ReturnFromDiscardEffect = {
        type: "return-from-discard",
        cardType: "character",
        cardName: "Alien",
        destination: "hand",
        target: "CONTROLLER",
        filter: { type: "source", ref: "other" },
      } as ReturnFromDiscardEffect;

      // With another Alien still in discard, candidates are non-empty (the OTHER
      // alien matches; the source itself is excluded).
      expect(hasReturnFromDiscardCandidates(ctx, p1, effect, asCardId("alien-self"))).toBe(true);
    });

    it("returns no candidates when the only matching card IS the source", () => {
      const ctx = buildCtx({
        discardByPlayer: { p1: ["alien-self"] },
        definitions: {
          "alien-self": { name: "Alien", cardType: "character" },
        },
      });

      const effect: ReturnFromDiscardEffect = {
        type: "return-from-discard",
        cardType: "character",
        cardName: "Alien",
        destination: "hand",
        target: "CONTROLLER",
        filter: { type: "source", ref: "other" },
      } as ReturnFromDiscardEffect;

      expect(hasReturnFromDiscardCandidates(ctx, p1, effect, asCardId("alien-self"))).toBe(false);
    });

    it("falls back to no exclusion when no sourceCardId is supplied (legacy callers)", () => {
      const ctx = buildCtx({
        discardByPlayer: { p1: ["alien-a"] },
        definitions: {
          "alien-a": { name: "Alien", cardType: "character" },
        },
      });

      // No filter at all — any matching card passes.
      const effect: ReturnFromDiscardEffect = {
        type: "return-from-discard",
        cardType: "character",
        cardName: "Alien",
        destination: "hand",
        target: "CONTROLLER",
      } as ReturnFromDiscardEffect;

      expect(hasReturnFromDiscardCandidates(ctx, p1, effect)).toBe(true);
    });

    it("source: other with unknown sourceCardId fails closed (excludes everything)", () => {
      // Safety: if we don't know the source, do not allow self-return slipping through.
      const ctx = buildCtx({
        discardByPlayer: { p1: ["alien-a"] },
        definitions: {
          "alien-a": { name: "Alien", cardType: "character" },
        },
      });

      const effect: ReturnFromDiscardEffect = {
        type: "return-from-discard",
        cardType: "character",
        cardName: "Alien",
        destination: "hand",
        target: "CONTROLLER",
        filter: { type: "source", ref: "other" },
      } as ReturnFromDiscardEffect;

      expect(hasReturnFromDiscardCandidates(ctx, p1, effect)).toBe(false);
    });
  });
});
