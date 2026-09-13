/**
 * AAA test for condition: zone-count.
 * Representative card: Threadbare Tunic (AZL005) — Generic Equipment Chest.
 * Activated: "Instant — Destroy Threadbare Tunic: Gain {r}. Activate this ability
 * only if you have no cards in hand."
 * Tests the zone-count condition (hand count == 0) gate on an activated ability.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, threadbareTunic, nimblismRed } from "../../../fixtures.ts";

describe("condition: zone-count", () => {
  it("Arrange/Act/Assert: Threadbare Tunic activates when hand is empty (zone-count hand eq 0)", () => {
    // Arrange — Bravo has the tunic equipped, no hand cards (intellect 0 prevents draw).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], chest: [threadbareTunic], deck: 4, intellect: 0 },
      { hero: dash, hand: [], deck: 4, intellect: 0 },
    );
    const Bravo = game.as(bravo);
    const resourcesBefore = Bravo.resourcePoints();
    expect(Bravo.handCount()).toBe(0); // precondition: empty hand

    // Act — Activate Threadbare Tunic (destroy-self cost → gain-resources 1).
    Bravo.activate(threadbareTunic);
    game.passBoth();

    // Assert — Resources increased by 1; tunic moved from chest to graveyard.
    expect(Bravo.resourcePoints()).toBe(resourcesBefore + 1);
    expect(Bravo.zone("chest")).not.toContain(threadbareTunic.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(threadbareTunic.canonicalId);
  });

  it("AAA boundary: Threadbare Tunic cannot activate when hand has cards (zone-count hand gt 0)", () => {
    // Arrange — Bravo has the tunic equipped AND cards in hand.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimblismRed], chest: [threadbareTunic], deck: 4 },
      { hero: dash, hand: [], deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Act — Attempt to activate; the zone-count condition (hand eq 0) should fail.
    expect(() => Bravo.activate(threadbareTunic)).toThrow();

    // Assert — Tunic still equipped (not destroyed).
    expect(Bravo.zone("chest")).toContain(threadbareTunic.canonicalId);
  });
});
