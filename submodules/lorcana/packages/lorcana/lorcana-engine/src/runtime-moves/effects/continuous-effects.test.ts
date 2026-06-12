import { describe, expect, it } from "bun:test";
import { createCardId, createInitialTCGCtx, createPlayerId, type MatchState } from "#core";
import type { LocationCard } from "@tcg/lorcana-types";
import { createCardI18n } from "../../card-i18n";
import { createInitialLorcanaG, type LorcanaG } from "../../types";
import { createMockCharacter } from "../../testing";
import {
  addStatModifierEffect,
  cleanupExpiredEffects,
  getActiveStatModifierTotal,
  retargetContinuousEffects,
} from "./continuous-effects";

const PLAYER_ONE = createPlayerId("p1");
const PLAYER_TWO = createPlayerId("p2");
const SOURCE_CARD = createCardId("source");
const TARGET_CARD = createCardId("target");
const NEW_TOP_CARD = createCardId("new-top");
const DEFENDER_CARD = createCardId("defender");

function buildState(turn: number): MatchState {
  const ctx = createInitialTCGCtx({
    matchID: "continuous-effects-test",
    gameID: "lorcana",
    rulesetHash: "test-ruleset",
  });
  ctx.status.turn = turn;
  const playZone = `play:${PLAYER_ONE}`;
  ctx.zones.private.zoneCards[playZone] = [TARGET_CARD];
  ctx.zones.private.cardIndex[TARGET_CARD] = {
    zoneKey: playZone,
    index: 0,
    ownerID: PLAYER_ONE,
    controllerID: PLAYER_ONE,
  };

  return {
    G: createInitialLorcanaG(PLAYER_ONE, PLAYER_TWO),
    ctx,
  };
}

describe("continuous-effects", () => {
  it("keeps until-start-of-next-turn stat modifiers through the next turn", () => {
    const state = buildState(1);
    const created = addStatModifierEffect(state, {
      sourceId: SOURCE_CARD,
      targetId: TARGET_CARD,
      stat: "strength",
      modifier: 3,
      duration: "until-start-of-next-turn",
      currentTurn: 1,
    });

    expect(created?.expiresAtTurn).toBe(2);
    expect(getActiveStatModifierTotal(state, TARGET_CARD, "strength")).toBe(3);

    cleanupExpiredEffects(state, 2);
    expect(state.G.continuousEffects.instances).toHaveLength(1);

    cleanupExpiredEffects(state, 3);
    expect(state.G.continuousEffects.instances).toHaveLength(0);
  });

  it("only applies conditioned stat modifiers while the target is challenging a location", () => {
    const state = buildState(1);
    const defenderZone = `play:${PLAYER_TWO}`;
    state.ctx.zones.private.zoneCards[defenderZone] = [DEFENDER_CARD];
    state.ctx.zones.private.cardIndex[DEFENDER_CARD] = {
      zoneKey: defenderZone,
      index: 0,
      ownerID: PLAYER_TWO,
      controllerID: PLAYER_TWO,
    };

    addStatModifierEffect(state, {
      sourceId: SOURCE_CARD,
      targetId: TARGET_CARD,
      controllerId: PLAYER_ONE,
      stat: "strength",
      modifier: 3,
      condition: {
        type: "in-challenge",
        role: "attacker",
        againstCardType: "location",
      },
      duration: "this-turn",
      currentTurn: 1,
    });

    const targetDefinition = createMockCharacter({
      id: "target",
      name: "Target",
      cost: 2,
      strength: 2,
      willpower: 2,
    });
    const defenderDefinition: LocationCard = {
      id: "defender",
      canonicalId: "ci_defender",
      name: "Defender",
      cardType: "location",
      inkType: ["amber"],
      set: "test",
      cardNumber: 2,
      rarity: "common",
      cost: 1,
      moveCost: 1,
      willpower: 4,
      lore: 1,
      inkable: true,
      i18n: createCardI18n("Defender"),
    };
    const getDefinitionByInstanceId = (cardId: typeof TARGET_CARD) => {
      if (cardId === TARGET_CARD) {
        return targetDefinition;
      }

      if (cardId === DEFENDER_CARD) {
        return defenderDefinition;
      }

      return undefined;
    };

    expect(
      getActiveStatModifierTotal(state, TARGET_CARD, "strength", getDefinitionByInstanceId),
    ).toBe(0);

    state.G.challengeState = {
      attacker: TARGET_CARD,
      defender: DEFENDER_CARD,
      attackerOwnerId: PLAYER_ONE,
      defenderOwnerId: PLAYER_TWO,
      stage: "damage",
    };
    expect(
      getActiveStatModifierTotal(state, TARGET_CARD, "strength", getDefinitionByInstanceId),
    ).toBe(3);

    state.G.challengeState = {
      attacker: DEFENDER_CARD,
      defender: TARGET_CARD,
      attackerOwnerId: PLAYER_TWO,
      defenderOwnerId: PLAYER_ONE,
      stage: "damage",
    };
    expect(
      getActiveStatModifierTotal(state, TARGET_CARD, "strength", getDefinitionByInstanceId),
    ).toBe(0);
  });

  describe("retargetContinuousEffects", () => {
    it("moves stat modifiers from old target to new target", () => {
      const state = buildState(1);
      const playZone = `play:${PLAYER_ONE}`;
      state.ctx.zones.private.zoneCards[playZone] = [TARGET_CARD, NEW_TOP_CARD];
      state.ctx.zones.private.cardIndex[NEW_TOP_CARD] = {
        zoneKey: playZone,
        index: 1,
        ownerID: PLAYER_ONE,
        controllerID: PLAYER_ONE,
      };

      addStatModifierEffect(state, {
        sourceId: SOURCE_CARD,
        targetId: TARGET_CARD,
        stat: "strength",
        modifier: 3,
        duration: "this-turn",
        currentTurn: 1,
      });

      expect(getActiveStatModifierTotal(state, TARGET_CARD, "strength")).toBe(3);
      expect(getActiveStatModifierTotal(state, NEW_TOP_CARD, "strength")).toBe(0);

      retargetContinuousEffects(state, TARGET_CARD, NEW_TOP_CARD);

      expect(getActiveStatModifierTotal(state, TARGET_CARD, "strength")).toBe(0);
      expect(getActiveStatModifierTotal(state, NEW_TOP_CARD, "strength")).toBe(3);
    });

    it("retargets multiple effects from the same source", () => {
      const state = buildState(1);
      const playZone = `play:${PLAYER_ONE}`;
      state.ctx.zones.private.zoneCards[playZone] = [TARGET_CARD, NEW_TOP_CARD];
      state.ctx.zones.private.cardIndex[NEW_TOP_CARD] = {
        zoneKey: playZone,
        index: 1,
        ownerID: PLAYER_ONE,
        controllerID: PLAYER_ONE,
      };

      addStatModifierEffect(state, {
        sourceId: SOURCE_CARD,
        targetId: TARGET_CARD,
        stat: "strength",
        modifier: 1,
        duration: "this-turn",
        currentTurn: 1,
      });
      addStatModifierEffect(state, {
        sourceId: SOURCE_CARD,
        targetId: TARGET_CARD,
        stat: "strength",
        modifier: 1,
        duration: "this-turn",
        currentTurn: 1,
      });
      addStatModifierEffect(state, {
        sourceId: SOURCE_CARD,
        targetId: TARGET_CARD,
        stat: "strength",
        modifier: 1,
        duration: "this-turn",
        currentTurn: 1,
      });

      expect(getActiveStatModifierTotal(state, TARGET_CARD, "strength")).toBe(3);

      retargetContinuousEffects(state, TARGET_CARD, NEW_TOP_CARD);

      expect(getActiveStatModifierTotal(state, NEW_TOP_CARD, "strength")).toBe(3);
      expect(state.G.continuousEffects.instances).toHaveLength(3);
    });

    it("does not retarget effects belonging to other cards", () => {
      const state = buildState(1);
      const otherCard = createCardId("other");
      const playZone = `play:${PLAYER_ONE}`;
      state.ctx.zones.private.zoneCards[playZone] = [TARGET_CARD, NEW_TOP_CARD, otherCard];
      state.ctx.zones.private.cardIndex[NEW_TOP_CARD] = {
        zoneKey: playZone,
        index: 1,
        ownerID: PLAYER_ONE,
        controllerID: PLAYER_ONE,
      };
      state.ctx.zones.private.cardIndex[otherCard] = {
        zoneKey: playZone,
        index: 2,
        ownerID: PLAYER_ONE,
        controllerID: PLAYER_ONE,
      };

      addStatModifierEffect(state, {
        sourceId: SOURCE_CARD,
        targetId: TARGET_CARD,
        stat: "strength",
        modifier: 3,
        duration: "this-turn",
        currentTurn: 1,
      });
      addStatModifierEffect(state, {
        sourceId: SOURCE_CARD,
        targetId: otherCard,
        stat: "strength",
        modifier: 2,
        duration: "this-turn",
        currentTurn: 1,
      });

      retargetContinuousEffects(state, TARGET_CARD, NEW_TOP_CARD);

      expect(getActiveStatModifierTotal(state, NEW_TOP_CARD, "strength")).toBe(3);
      expect(getActiveStatModifierTotal(state, otherCard, "strength")).toBe(2);
    });
  });
});
