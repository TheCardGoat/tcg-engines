import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";

/**
 * CONDITIONAL ABILITIES
 * Tests for abilities that depend on cards-under conditions (e.g., "if this turn" or "for each card under")
 */
describe("Conditional Abilities Based on Cards-Under", () => {
  describe("MULAN-001 to MULAN-005: Mulan - FLOWING BLADE", () => {
    it.todo("MULAN-001: Takes no damage from challenges when card put under ANY char/loc", () => {});

    it.todo("MULAN-002: Only active during YOUR turn", () => {});

    it.todo("MULAN-003: Works when card put under by any means (Boost, etc.)", () => {});

    it.todo("MULAN-004: Resets at end of turn - must put card under EACH turn", () => {});

    it.todo("MULAN-005: Works for locations too", () => {});
  });

  describe("TREMAINE-001 to TREMAINE-005: Lady Tremaine - EXPEDIENT SCHEMES", () => {
    it.todo("TREMAINE-001: On quest: if card put under her this turn, may play action from discard", () => {});

    it.todo("TREMAINE-002: Action cost must be 5 or less", () => {});

    it.todo("TREMAINE-003: Action played for free", () => {});

    it.todo("TREMAINE-004: Action goes to bottom of deck instead of discard", () => {});

    it.todo("TREMAINE-005: Does NOT trigger if no card put under her this turn", () => {});
  });

  describe("PETE-001 to PETE-004: Pete - FOREBODING GLANCE", () => {
    it.todo("PETE-001: On quest: scry equal to cards under him", () => {});

    it.todo("PETE-002: Put one to hand, rest to bottom in any order", () => {});

    it.todo("PETE-003: Requires has-card-under condition", () => {});

    it.todo("PETE-004: 0 cards under = no trigger", () => {});
  });

  describe("BAMBI-001 to BAMBI-004: Bambi - COME SEE!", () => {
    it.todo("BAMBI-001: On exert during your turn: reveal cards equal to cards under", () => {});

    it.todo("BAMBI-002: Put character cards to hand", () => {});

    it.todo("BAMBI-003: Rest to bottom in any order", () => {});

    it.todo("BAMBI-004: Requires has-card-under condition", () => {});
  });

  describe("Conditional Ability Edge Cases", () => {
    it.todo("Condition state changes during ability resolution (cards removed mid-chain)", () => {});

    it.todo("Multiple conditional abilities check correctly at different times", () => {});
  });
});
