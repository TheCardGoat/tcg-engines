import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { donaldDuckFredHoneywell } from "@tcg/lorcana-cards/cards/011";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { flynnRiderSpectralScoundrel } from "@tcg/lorcana-cards/cards/010";

/**
 * TRIGGERED ABILITIES ON BOOST USAGE
 * Tests for abilities triggered when Boost is activated
 */
describe("Triggered Abilities on Boost Usage", () => {
  describe("DONALD-001 to DONALD-008: Donald Duck - Fred Honeywell (SPIRIT OF GIVING)", () => {
    it.todo("DONALD-001: Triggers when YOU use Boost on YOUR character", () => {});

    it.todo("DONALD-002: Does NOT trigger when opponent uses Boost", () => {});

    it.todo("DONALD-003: Effect is optional ('you may')", () => {});

    it.todo("DONALD-004: Card is put under the boosted character (not Donald)", () => {});

    it.todo("DONALD-005: Card is put under facedown", () => {});

    it.todo("DONALD-006: Cannot put card if deck is empty", () => {});

    it.todo("DONALD-007: Triggers for EACH Boost activation (multiple characters = multiple triggers)", () => {});

    it.todo("DONALD-008: Does NOT trigger for passive strength gains (not Boost keyword)", () => {});
  });

  describe("DONALD-010 to DONALD-015: Donald Duck - WELL WISHES (banish draw)", () => {
    it.todo("DONALD-010: Triggers when YOUR other character is banished during opponent's turn", () => {});

    it.todo("DONALD-011: Draw count = cards-under-count of banished character", () => {});

    it.todo("DONALD-012: Effect is optional", () => {});

    it.todo("DONALD-013: Does NOT trigger on your turn", () => {});

    it.todo("DONALD-014: Does NOT trigger when Donald himself is banished", () => {});

    it.todo("DONALD-015: Handles 0 cards under correctly (condition check)", () => {});
  });

  describe("Other Boost-Triggered Abilities", () => {
    it.todo("Boost triggers should chain correctly when multiple characters have boost abilities", () => {});

    it.todo("Boost trigger should not fire for opponent's boost on their character", () => {});
  });
});
