import { describe, expect, it } from "vite-plus/test";
import type { CardEffect, PilotCard } from "@tcg/gundam-types";
import type { PlayerId } from "../../types/branded.ts";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO } from "../../index.ts";
import { enqueueObserverTriggers } from "./pending-effects.ts";
import { createMockUnit } from "../testing/card-mocks.ts";
import { markAsLinkUnit } from "../testing/command-test-helpers.ts";

function makeLinkDestroyObserver(): PilotCard {
  const effect: CardEffect = {
    type: "triggered",
    activation: { timing: ["onEnemyLinkUnitDestroyed"] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "When an enemy Link Unit is destroyed, draw 1.",
  };
  return {
    cardNumber: `TEST-LINKOBS-${Math.random().toString(36).slice(2, 8)}`,
    name: "Link Destroy Observer",
    type: "pilot",
    color: "red",
    traits: [],
    level: 1,
    cost: 1,
    apBonus: 0,
    hpBonus: 0,
    keywordEffects: [],
    rarity: "common",
    effects: [effect],
  };
}

describe("enemyLinkUnitDestroyed timing", () => {
  it("enqueues on an observer when enemy link unit destroyed", () => {
    const observer = makeLinkDestroyObserver();
    const attacker = createMockUnit({ ap: 5, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [attacker], hand: [observer] },
      { play: [defender] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    const runtime = engine.getRuntime();
    const observerId = runtime.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      observer.cardNumber,
    )!;
    expect(observerId).toBeDefined();

    // Move observer to battleArea and pair with attacker.
    runtime.runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      framework.zones.moveCard(observerId, { zone: "battleArea", playerId: PLAYER_ONE });
      G.pilotAssignments[attackerId] = observerId;
    });

    markAsLinkUnit(engine, defenderId);

    let qLen = 0;
    runtime.runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      const event = {
        type: "enemyLinkUnitDestroyed" as const,
        cardId: defenderId,
        ownerId: PLAYER_TWO,
        destroyedBy: PLAYER_ONE,
      };
      enqueueObserverTriggers(G, event, framework, defenderId);
      qLen = G.pendingEffects.length;
    });

    expect(qLen).toBeGreaterThan(0);
  });
});
