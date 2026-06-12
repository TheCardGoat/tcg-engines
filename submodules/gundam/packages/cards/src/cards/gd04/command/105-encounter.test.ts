import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Encounter105 } from "./105-encounter.ts";

describe("Encounter (GD04-105)", () => {
  it("【Main】 reveals top 5 and adds a Pilot among them to hand", () => {
    const pilot = createMockPilot({ name: "Searched Pilot", level: 1, cost: 1 });
    const filler1 = createMockUnit({ ap: 1, hp: 1 });
    const filler2 = createMockUnit({ ap: 1, hp: 1 });
    const filler3 = createMockUnit({ ap: 1, hp: 1 });
    const filler4 = createMockUnit({ ap: 1, hp: 1 });

    const engine = GundamTestEngine.create({
      hand: [gd04Encounter105],
      // Top 5 cards: pilot is in there (first), then 4 fillers.
      deck: [pilot, filler1, filler2, filler3, filler4],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    const handBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE });
    const [pilotId, ...fillerIds] = p1.getCardsInZone("deck");

    expectSuccess(p1.playCommand(gd04Encounter105));
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { 0: { tutorCardId: pilotId!, toBottom: fillerIds } },
      }),
    );

    // The Pilot was added to hand; the command card itself moved to trash.
    // Net: hand has -1 (command played) + 1 (pilot tutored) = 0 change.
    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE })).toBe(handBefore);
    // Verify the Pilot is in hand by looking up by name.
    const framework = engine.getRuntime().getFrameworkReadAPI();
    const handIds = p1.getCardsInZone("hand");
    const pilotInHand = handIds.some((id) => {
      const def = framework.cards.getDefinition(id) as { name?: string } | undefined;
      return def?.name === "Searched Pilot";
    });
    expect(pilotInHand).toBe(true);
  });

  it("【Main】 returns all 5 cards to deck bottom when no Pilot is among them", () => {
    const fillers = Array.from({ length: 5 }, (_, i) =>
      createMockUnit({ ap: 1, hp: 1, traits: [`filler-${i}`] }),
    );

    const engine = GundamTestEngine.create({
      hand: [gd04Encounter105],
      deck: fillers,
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    const revealedIds = p1.getCardsInZone("deck");

    expectSuccess(p1.playCommand(gd04Encounter105));
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { 0: { toBottom: revealedIds } },
      }),
    );

    // No Pilot to tutor → all 5 cards remain in the deck (just reshuffled
    // to the bottom). Deck size unchanged.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore);
  });
});
