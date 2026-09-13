import { deathDealer } from "@tcg/flesh-and-blood-cards/cards/weapons/death-dealer";
import { driftwoodQuiver } from "@tcg/flesh-and-blood-cards/cards/equipment/driftwood-quiver";
import { riptideLurkerOfTheDeep } from "@tcg/flesh-and-blood-cards/cards/heroes/riptide-lurker-of-the-deep";
import {
  registerFabCardDefinition,
  type FabPregameCardPool,
} from "@tcg/flesh-and-blood-engine/simulator";
import { createDefaultFabPregameSelection } from "@tcg/flesh-and-blood-engine/simulator";
// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { DEFAULT_PLAYER_DECK_ID } from "@tcg/flesh-and-blood-engine/automation";

import {
  createFabLocalPracticeMatch,
  createFabLocalPracticeMatchFromPlayerSeat,
} from "./create-local-practice-match";
import { createFabPracticeMatchup } from "./practice-matchup-fixture";
import { resolvePracticeDeckSelection, materializeFabPracticeSeat } from "./resolve-text-deck";

describe("practice automation seeding", () => {
  it("applies the saved automation defaults to the human seat at creation", () => {
    const seat = resolvePracticeDeckSelection(DEFAULT_PLAYER_DECK_ID, "practice-automation");
    const deckCanonicalId = seat.player.deck?.[0];
    expect(typeof deckCanonicalId).toBe("string");

    const match = createFabLocalPracticeMatch({
      seed: "practice-automation",
      automation: {
        automationPreferences: { "player-1": { priorityMode: "always-hold" } },
        optionalTriggerDeclines: {
          "player-1": { [deckCanonicalId as string]: true, "unknown-card": true },
        },
      },
    });

    const snapshot = match.runtime.snapshot();
    // Only the human seat is seeded; the bot keeps engine defaults.
    expect(snapshot.automationPreferences["player-1"]?.priorityMode).toBe("always-hold");
    const declinedInstances = Object.keys(snapshot.optionalTriggerAutomation["player-1"] ?? {});
    // Every owned instance of the declined deck card is seeded (a deck may run
    // multiple copies); unknown canonical ids and other seats drop out.
    expect(declinedInstances.length).toBeGreaterThanOrEqual(1);
    expect(snapshot.optionalTriggerAutomation["player-2"]).toBeUndefined();
    for (const instanceId of declinedInstances) {
      expect(snapshot.objects[instanceId]).toBeDefined();
    }
  });

  it("seeds the play-and-skip mode for the human seat", () => {
    const match = createFabLocalPracticeMatch({
      seed: "practice-play-and-skip",
      automation: {
        automationPreferences: { "player-1": { priorityMode: "play-and-skip" } },
        optionalTriggerDeclines: {},
      },
    });

    const snapshot = match.runtime.snapshot();
    expect(snapshot.automationPreferences["player-1"]?.priorityMode).toBe("play-and-skip");
  });

  it("leaves both seats on engine defaults when no automation seed is provided", () => {
    const match = createFabLocalPracticeMatch({ seed: "practice-automation-guest" });

    const snapshot = match.runtime.snapshot();
    expect(snapshot.automationPreferences["player-1"]?.priorityMode).toBe("always-hold");
    expect(snapshot.automationPreferences["player-2"]?.priorityMode).toBe("always-hold");
    expect(snapshot.optionalTriggerAutomation).toEqual({});
  });
});

describe("visual fixture automation defaults", () => {
  it("starts real-deck matchup fixtures with auto-pass and trigger auto-order for both seats", () => {
    const match = createFabPracticeMatchup({ seed: "fixture-automation" });
    const snapshot = match.runtime.snapshot();

    for (const playerId of [match.player1Id, match.player2Id]) {
      expect(snapshot.automationPreferences[playerId]).toMatchObject({
        priorityMode: "auto-pass",
        autoOrderTriggers: true,
      });
    }
  });
});

describe("prepared local practice", () => {
  it("preserves every registered card for both curated seats", () => {
    const match = createFabLocalPracticeMatch({
      seed: "curated-conservation",
      player1DeckId: DEFAULT_PLAYER_DECK_ID,
      player2DeckId: DEFAULT_PLAYER_DECK_ID,
    });
    const resolved = resolvePracticeDeckSelection(DEFAULT_PLAYER_DECK_ID, "curated-conservation");
    const expected = 1 + resolved.cardPool.entries.reduce((sum, entry) => sum + entry.quantity, 0);
    const objects = Object.values(match.runtime.snapshot().objects);
    for (const id of ["player-1", "player-2"]) {
      expect(objects.filter((object) => object.ownerId === id)).toHaveLength(expected);
    }
  });

  it("materializes a saved reverse-order bow and quiver in the same slots used by hosted matches", () => {
    const definitions = [riptideLurkerOfTheDeep, deathDealer, driftwoodQuiver].map(
      registerFabCardDefinition,
    );
    const cardDefinitions = Object.fromEntries(
      definitions.map((definition) => [definition.canonicalId, definition]),
    );
    const cardPool: FabPregameCardPool = {
      format: "cc",
      heroId: riptideLurkerOfTheDeep.canonicalId,
      cardDefinitions,
      entries: [deathDealer, driftwoodQuiver].map((card) => ({
        canonicalId: card.canonicalId,
        quantity: 1,
        source: "equipment",
      })),
    };
    const player = materializeFabPracticeSeat(
      { cardPool, cardDefinitions },
      {
        equipment: { weapon1: driftwoodQuiver.canonicalId, weapon2: deathDealer.canonicalId },
        deck: [],
      },
      "reverse-order-weapons",
    );
    expect(player.weapon1).toEqual([deathDealer.canonicalId]);
    expect(player.weapon2).toEqual([driftwoodQuiver.canonicalId]);
    expect(player.inventory).toEqual([]);
  });

  it("preserves the whole pool and deals only selected deck cards when the bot starts", () => {
    const resolved = resolvePracticeDeckSelection(DEFAULT_PLAYER_DECK_ID, "pool-conservation");
    const selection = createDefaultFabPregameSelection(resolved.cardPool);
    const player = materializeFabPracticeSeat(resolved, selection, "pool-conservation");
    const match = createFabLocalPracticeMatchFromPlayerSeat(
      { ...resolved, player },
      {
        seed: "pool-conservation",
        firstPlayerId: "player-2",
      },
    );
    const snapshot = match.runtime.snapshot();
    expect(snapshot.firstTurnPlayerId).toBe("player-2");
    const owned = Object.values(snapshot.objects).filter((object) => object.ownerId === "player-1");
    expect(owned).toHaveLength(
      1 + resolved.cardPool.entries.reduce((total, entry) => total + entry.quantity, 0),
    );
    expect(Array.isArray(player.hand) && player.hand.length).toBe(4);
    expect(Array.isArray(player.inventory) && player.inventory.length).toBeGreaterThan(0);
  });
});
