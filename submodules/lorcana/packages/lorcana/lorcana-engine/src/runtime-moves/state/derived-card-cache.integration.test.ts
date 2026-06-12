import { describe, expect, it } from "bun:test";
import { buildValidationContext } from "../../core/runtime/match-runtime.utils";
import {
  createStateScopedValueCache,
  getStateScopedValueCacheStats,
} from "../../core/runtime/state-scoped-value-cache";
import { createCardQueryAPIForState } from "../../core/runtime/match-runtime.apis";
import { projectLorcanaBoardView } from "../../runtime-game/project-board";
import { lorcanaRuntimeConfig } from "../../runtime-game";
import { snapshotTriggeredCandidatesForCard } from "../../triggered-abilities";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "../../testing";
import { createLorcanaRuntimeCardDeriver } from "./runtime-card-derived";
import type {
  LorcanaMatchState,
  LorcanaRuntimeMoveInputs,
  ProjectedLorcanaCardDerived,
} from "../../types";

const triggerWatcher = createMockCharacter({
  id: "cache-trigger-watcher",
  name: "Cache Trigger Watcher",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      type: "triggered",
      name: "Watch The Quest",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "gain-lore",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
});

describe("derived-card-cache integration", () => {
  it("reuses the same cached derived payload across card queries, board projection, and trigger snapshots", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [triggerWatcher] },
      { deck: 1 },
    );

    try {
      const state = testEngine.getAuthoritativeState() as LorcanaMatchState;
      const staticResources = testEngine.getServerEngine().staticResources;
      const runtimeCardCache = createStateScopedValueCache<ProjectedLorcanaCardDerived>();
      const cardId = testEngine.findCardInstanceId(triggerWatcher, "play", "player_one");
      const stateID = state.ctx._stateID;

      const cards = createCardQueryAPIForState(
        state,
        staticResources,
        createLorcanaRuntimeCardDeriver(),
        "player_one",
        runtimeCardCache,
      );
      expect(cards.require(cardId).instanceId).toBe(cardId);
      expect(getStateScopedValueCacheStats(runtimeCardCache)).toMatchObject({
        stateID,
        hits: 0,
        misses: 1,
      });

      const board = projectLorcanaBoardView(
        state,
        { role: "player", playerID: "player_one" },
        staticResources,
        {
          serverTimestamp: 0,
          runtimeCardCache,
        },
      );
      expect(board.cards[cardId]?.id).toBe(cardId);
      const afterBoard = getStateScopedValueCacheStats(runtimeCardCache);
      expect(afterBoard.stateID).toBe(stateID);
      expect(afterBoard.misses).toBe(1);
      expect(afterBoard.hits).toBeGreaterThan(0);

      const validationContext = buildValidationContext({
        state,
        playerId: "player_one",
        input: { args: {} } as LorcanaRuntimeMoveInputs["passTurn"],
        config: lorcanaRuntimeConfig,
        staticResources,
        gameEnded: false,
        validationMode: "final",
        caches: { runtimeCard: runtimeCardCache },
      });
      const candidates = snapshotTriggeredCandidatesForCard(validationContext as never, cardId);
      expect(candidates).toHaveLength(1);

      const afterTriggers = getStateScopedValueCacheStats(runtimeCardCache);
      expect(afterTriggers.stateID).toBe(stateID);
      expect(afterTriggers.misses).toBe(1);
      expect(afterTriggers.hits).toBeGreaterThan(afterBoard.hits);
    } finally {
      testEngine.dispose();
    }
  });
});
