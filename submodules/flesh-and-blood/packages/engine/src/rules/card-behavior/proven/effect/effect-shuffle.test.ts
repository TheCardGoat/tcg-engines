/**
 * AAA test for effect:shuffle.
 * Representative card: Stir the Pot (MST101) — Mystic Instant, cost 0, legendary.
 * Resolution effect: shuffle the deck (unconditional). The card has a second
 * conditional resolution effect (transform/transcend) gated on
 * "played another blue card this turn", which does not fire in this scenario.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, cosmicFlareRed, dash, nimblismBlue, stirThePotBlue } from "../../../fixtures.ts";
import { loadFleshAndBloodStructuredCards } from "../../../../../../cards/src/runtime-registry.ts";

describe("effect: shuffle", () => {
  it("Arrange/Act/Assert: Stir the Pot (shuffle deck) preserves deck count and card set", () => {
    // Arrange — Bravo has Stir the Pot and a 6-card deck.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [stirThePotBlue], deck: 6 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck");
    const countBefore = deckBefore.length;

    // Act — Play the instant; the response-free stack resolves and shuffles.
    Bravo.play(stirThePotBlue);

    // Assert — Deck count is unchanged (shuffle rearranges, does not add/remove).
    const deckAfter = Bravo.zone("deck");
    expect(deckAfter.length).toBe(countBefore);
    // Every card that was in the deck before is still in the deck after (same set).
    const beforeSet = new Set(deckBefore);
    for (const card of deckAfter) {
      expect(beforeSet.has(card)).toBe(true);
    }
  });

  it("AAA boundary: without shuffle, playing an instant leaves deck untouched", () => {
    // Arrange — Cosmic Flare is a Lightning Instant with gain-resources (no shuffle).
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cosmicFlareRed], deck: 6 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const deckBefore = Bravo.zone("deck").slice();

    // Act — Play the instant; the response-free stack resolves.
    Bravo.play(cosmicFlareRed);

    // Assert — Deck order is identical (no shuffle occurred).
    expect(Bravo.zone("deck")).toEqual(deckBefore);
  });

  it("AAA: another blue play lets physical Stir the Pot become Inner Chi in hand", async () => {
    const cards = await loadFleshAndBloodStructuredCards([stirThePotBlue.canonicalId]);
    const physicalStir = cards.get(stirThePotBlue.canonicalId);
    expect(physicalStir?.layout.kind).toBe("transcend");
    if (!physicalStir) throw new Error("physical Stir the Pot was not registered");

    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimblismBlue, physicalStir], deck: 6 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    Bravo.play(nimblismBlue);
    // Each response-free stack window resolves before the next play.
    Bravo.play(physicalStir);

    const hand = Bravo.getState().containers.zonesByPlayerId[Bravo.id]!.hand;
    const stirInstanceId = hand.find(
      (instanceId) =>
        Bravo.getState().objects[instanceId]?.canonicalId === physicalStir.canonicalId,
    );
    expect(stirInstanceId).toBeDefined();
    expect(Bravo.getState().objects[stirInstanceId!]!.activeFace).toMatchObject({
      family: "transcend",
      activeFaceIds: [`${physicalStir.canonicalId}:face:back`],
    });
  });
});
