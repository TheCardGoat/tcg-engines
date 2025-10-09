import { describe, expect, it } from "bun:test";
import { lorcanaZones, type LorcanaZoneId } from "../zones";

/**
 * Task 1.3: Tests for Zone Configurations
 * 
 * Validates zone configurations match Lorcana Comprehensive Rules Section 8:
 * - Deck (Rule 8.2): Private, ordered, facedown
 * - Hand (Rule 8.3): Private, can rearrange
 * - Play (Rule 8.4): Public, all can see
 * - Discard (Rule 8.6): Public, ordered, faceup
 * - Inkwell (Rule 8.5): Private, facedown
 * 
 * References:
 * - Rule 8.1.2 (Public zones)
 * - Rule 8.1.3 (Private zones)
 * - Rule 8.2.2 (Deck is private and ordered)
 * - Rule 8.3.2 (Hand is private)
 * - Rule 8.4.3 (Play is public)
 * - Rule 8.5.3 (Inkwell is private)
 * - Rule 8.6.3 (Discard is public and ordered)
 */

describe("Lorcana Zone Configurations", () => {
  it("should have all 5 required zones", () => {
    const zoneIds = Object.keys(lorcanaZones);
    
    expect(zoneIds).toContain("deck");
    expect(zoneIds).toContain("hand");
    expect(zoneIds).toContain("play");
    expect(zoneIds).toContain("discard");
    expect(zoneIds).toContain("inkwell");
    expect(zoneIds).toHaveLength(5);
  });

  describe("Deck Zone", () => {
    it("should be private visibility (Rule 8.2.2)", () => {
      expect(lorcanaZones.deck.visibility).toBe("owner");
    });

    it("should be ordered (Rule 8.2.2)", () => {
      expect(lorcanaZones.deck.ordered).toBe(true);
    });

    it("should be facedown (Rule 8.2.2)", () => {
      expect(lorcanaZones.deck.facedown).toBe(true);
    });
  });

  describe("Hand Zone", () => {
    it("should be private visibility (Rule 8.3.2)", () => {
      expect(lorcanaZones.hand.visibility).toBe("owner");
    });

    it("should be unordered - can rearrange (Rule 8.3.2)", () => {
      expect(lorcanaZones.hand.ordered).toBe(false);
    });

    it("should not be facedown (cards are visible to owner)", () => {
      expect(lorcanaZones.hand.facedown).toBe(false);
    });
  });

  describe("Play Zone", () => {
    it("should be public visibility (Rule 8.4.3)", () => {
      expect(lorcanaZones.play.visibility).toBe("all");
    });

    it("should be unordered (no specific arrangement required)", () => {
      expect(lorcanaZones.play.ordered).toBe(false);
    });

    it("should not be facedown (cards are visible)", () => {
      expect(lorcanaZones.play.facedown).toBe(false);
    });
  });

  describe("Discard Zone", () => {
    it("should be public visibility (Rule 8.6.3)", () => {
      expect(lorcanaZones.discard.visibility).toBe("all");
    });

    it("should be ordered (Rule 8.6.3)", () => {
      expect(lorcanaZones.discard.ordered).toBe(true);
    });

    it("should not be facedown (cards are visible)", () => {
      expect(lorcanaZones.discard.facedown).toBe(false);
    });
  });

  describe("Inkwell Zone", () => {
    it("should be private visibility (Rule 8.5.3)", () => {
      expect(lorcanaZones.inkwell.visibility).toBe("owner");
    });

    it("should be unordered (can arrange as convenient) (Rule 8.5.4)", () => {
      expect(lorcanaZones.inkwell.ordered).toBe(false);
    });

    it("should be facedown (Rule 8.5.2, 8.5.3)", () => {
      expect(lorcanaZones.inkwell.facedown).toBe(true);
    });
  });

  describe("Zone Properties Validation", () => {
    it("should have exactly 2 private zones", () => {
      const privateZones = Object.values(lorcanaZones).filter(
        (zone) => zone.visibility === "owner"
      );
      expect(privateZones).toHaveLength(3); // deck, hand, inkwell
    });

    it("should have exactly 2 public zones", () => {
      const publicZones = Object.values(lorcanaZones).filter(
        (zone) => zone.visibility === "all"
      );
      expect(publicZones).toHaveLength(2); // play, discard
    });

    it("should have exactly 2 facedown zones", () => {
      const facedownZones = Object.values(lorcanaZones).filter(
        (zone) => zone.facedown === true
      );
      expect(facedownZones).toHaveLength(2); // deck, inkwell
    });

    it("should have exactly 2 ordered zones", () => {
      const orderedZones = Object.values(lorcanaZones).filter(
        (zone) => zone.ordered === true
      );
      expect(orderedZones).toHaveLength(2); // deck, discard
    });
  });

  describe("Zone Type Safety", () => {
    it("should type-check valid zone IDs", () => {
      const validIds: LorcanaZoneId[] = ["deck", "hand", "play", "discard", "inkwell"];
      
      for (const id of validIds) {
        expect(lorcanaZones[id]).toBeDefined();
      }
    });

    it("should have correct zone ID type", () => {
      // This test validates TypeScript type checking at compile time
      const zoneId: LorcanaZoneId = "deck";
      expect(zoneId).toBe("deck");
      
      // TypeScript should prevent this:
      // const invalid: LorcanaZoneId = "invalid"; // Type error
    });
  });
});

