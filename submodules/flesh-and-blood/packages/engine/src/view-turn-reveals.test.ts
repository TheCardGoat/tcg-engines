import { describe, expect, it } from "vitest";

import { FabTestEngine } from "./testing/test-engine.ts";
import { bravo, dash, heartOfFyendal } from "./rules/fixtures.ts";
import { hitTrainer } from "./rules/test-trainers.ts";
import {
  projectFabViewerResources,
  projectFabViewerState,
  type FabViewerState,
  type FabViewerTurnReveal,
} from "./view.ts";

/** Walk priority/pitch timing by hand so receipts stay deterministic. */
const MANUAL = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

type DeckEdgeReveal = Extract<FabViewerTurnReveal, { kind: "deck-edge" }>;

function deckEdgeRevealsFor(viewer: FabViewerState, ownerId: string): readonly DeckEdgeReveal[] {
  return (viewer.turnReveals ?? []).filter(
    (reveal): reveal is DeckEdgeReveal => reveal.kind === "deck-edge" && reveal.ownerId === ownerId,
  );
}

function revealTrainer(slug: string, zone: "deck" | "hand") {
  return hitTrainer({
    slug,
    effect: {
      type: "reveal",
      target: {
        selector: "object",
        declared: "at-resolution",
        player: "controller",
        zones: [zone],
        ...(zone === "deck" ? { position: "top" as const } : {}),
        count: 1,
      },
    },
  });
}

describe("viewer turn reveals (CR 8.5.17 presentation recall)", () => {
  it("keeps a revealed deck-top card inspectable for the rest of the turn", () => {
    const attack = revealTrainer("view-turn-reveal-deck-top", "deck");
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], deck: 6 },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    const bravoId = game.as(bravo).id;
    const dashId = game.as(dash).id;
    const state = game.getState();
    const topOfDeck = state.containers.zonesByPlayerId[bravoId]!.deck.at(-1)!;
    expect(topOfDeck).toBeDefined();

    const opponentViewer = projectFabViewerState(state, { role: "player", actorId: dashId });
    const deckReveals = deckEdgeRevealsFor(opponentViewer, bravoId);
    expect(deckReveals).toHaveLength(1);
    const reveal = deckReveals[0]!;
    expect(reveal.position).toBe("top");
    expect(reveal.instanceId).toBe(topOfDeck);
    expect(reveal.canonicalId).toBe(state.objects[topOfDeck]!.canonicalId);

    // The reveal is public information: the revealing seat and spectators
    // project the identical recall.
    expect(projectFabViewerState(state, { role: "player", actorId: bravoId }).turnReveals).toEqual(
      opponentViewer.turnReveals,
    );
    expect(projectFabViewerState(state, { role: "spectator" }).turnReveals).toEqual(
      opponentViewer.turnReveals,
    );

    // The definition is disclosed so log/board previews can render it, while
    // the hidden instance itself stays undisclosed.
    const resources = projectFabViewerResources(state, { role: "player", actorId: dashId });
    expect(reveal.canonicalId && resources.cardDefinitions[reveal.canonicalId]).toBeDefined();
    expect(resources.cardInstances[reveal.instanceId]).toBeUndefined();
  });

  it("drops the deck-edge recall once the card leaves the top of the deck", () => {
    const attack = revealTrainer("view-turn-reveal-deck-moved", "deck");
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], deck: 6 },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    const bravoId = game.as(bravo).id;
    const dashId = game.as(dash).id;
    const topOfDeck = game.getState().containers.zonesByPlayerId[bravoId]!.deck.at(-1)!;
    expect(topOfDeck).toBeDefined();

    // The definition disclosure survives the move — the identity was seen.
    game.moveObject(topOfDeck, bravoId, "graveyard");
    const movedState = game.getState();
    const movedViewer = projectFabViewerState(movedState, { role: "player", actorId: dashId });
    expect(deckEdgeRevealsFor(movedViewer, bravoId)).toEqual([]);
    const movedResources = projectFabViewerResources(movedState, {
      role: "player",
      actorId: dashId,
    });
    const canonicalId = movedState.objects[topOfDeck]!.canonicalId;
    expect(movedResources.cardDefinitions[canonicalId]).toBeDefined();
  });

  it("clears the recall when the turn ends", () => {
    const attack = revealTrainer("view-turn-reveal-turn-scope", "deck");
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], deck: 6 },
      { hero: dash, deck: 6 },
      MANUAL,
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    const bravoId = game.as(bravo).id;
    expect(
      deckEdgeRevealsFor(
        projectFabViewerState(game.getState(), { role: "player", actorId: bravoId }),
        bravoId,
      ),
    ).not.toEqual([]);

    game.endTurn(bravoId);
    const nextTurnState = game.getState();
    for (const viewer of [
      { role: "player", actorId: bravoId },
      { role: "player", actorId: game.as(dash).id },
      { role: "spectator" },
    ] as const) {
      expect(projectFabViewerState(nextTurnState, viewer).turnReveals).toEqual([]);
    }
  });
});
