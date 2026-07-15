import { describe, expect, it } from "bun:test";
import { createPlayerId } from "#core";
import { initializeMatchState } from "../core/runtime/match-runtime.init";
import { createRecordCardCatalog, createRecordCardInstanceRegistry } from "../core/runtime";
import { lorcanaRuntimeConfig } from "./definition";

const PLAYER_ONE = createPlayerId("player_one");
const PLAYER_TWO = createPlayerId("player_two");

describe("lorcanaRuntimeConfig.boardSetup", () => {
  it("seeds starting decks into owner-scoped deck zones", () => {
    const { state } = initializeMatchState({
      config: lorcanaRuntimeConfig,
      players: [{ id: PLAYER_ONE }, { id: PLAYER_TWO }],
      seed: "definition-board-setup-test",
      staticResources: {
        cards: createRecordCardCatalog("test-cards", {}),
        instances: createRecordCardInstanceRegistry("test-instances", {
          "p1-card-1": {
            instanceId: "p1-card-1",
            definitionId: "missing-definition",
            ownerID: PLAYER_ONE,
          },
          "p1-card-2": {
            instanceId: "p1-card-2",
            definitionId: "missing-definition",
            ownerID: PLAYER_ONE,
          },
          "p2-card-1": {
            instanceId: "p2-card-1",
            definitionId: "missing-definition",
            ownerID: PLAYER_TWO,
          },
          "p2-card-2": {
            instanceId: "p2-card-2",
            definitionId: "missing-definition",
            ownerID: PLAYER_TWO,
          },
        }),
        zoneDefinitions: {},
      },
    });

    expect(state.ctx.zones.private.zoneCards[`deck:${PLAYER_ONE}`]).toHaveLength(2);
    expect(state.ctx.zones.private.zoneCards[`deck:${PLAYER_TWO}`]).toHaveLength(2);
    expect(state.ctx.zones.private.zoneCards.deck).toEqual([]);
    expect(state.ctx.zones.public.zoneSummaries[`deck:${PLAYER_ONE}`]).toMatchObject({
      revision: 1,
      count: 2,
    });
    expect(state.ctx.zones.public.zoneSummaries[`deck:${PLAYER_TWO}`]).toMatchObject({
      revision: 1,
      count: 2,
    });

    for (const cardId of state.ctx.zones.private.zoneCards[`deck:${PLAYER_ONE}`] ?? []) {
      expect(state.ctx.zones.private.cardIndex[cardId]?.zoneKey).toBe(`deck:${PLAYER_ONE}`);
      expect(state.ctx.zones.private.cardIndex[cardId]?.ownerID).toBe(PLAYER_ONE);
    }

    for (const cardId of state.ctx.zones.private.zoneCards[`deck:${PLAYER_TWO}`] ?? []) {
      expect(state.ctx.zones.private.cardIndex[cardId]?.zoneKey).toBe(`deck:${PLAYER_TWO}`);
      expect(state.ctx.zones.private.cardIndex[cardId]?.ownerID).toBe(PLAYER_TWO);
    }
  });
});
