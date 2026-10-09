import { resolveGainKeywordEffect } from "../runtime-moves/resolution/action-effects/gain-keyword-effect";
import { hasTemporaryKeyword } from "../runtime-moves/effects/temporary-effects";
import { evaluateActionCondition } from "../runtime-moves/resolution/action-effects/action-condition-evaluator";
import { expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockLocation,
  PLAYER_ONE,
  PLAYER_TWO,
} from "./index";
import {
  createTestContext,
  createCardPlayed,
  PLAYER_ONE as UNIT_ONE,
  PLAYER_TWO as UNIT_TWO,
} from "./unit-harness";
import { resolveRestrictionEffect } from "../runtime-moves/resolution/action-effects/restriction-effect";
import { resolveEffectWindow } from "../rules/effect-registry";
import { getLegalChallengeDefendersForAttacker } from "../runtime-moves/rules/challenge-rules";

const action = createMockAction({
  id: "scoped-challenge",
  name: "Scoped challenge",
  cost: 1,
  abilities: [
    {
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        defenderPlayers: "CONTROLLER",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "until-start-of-next-turn",
      },
    },
  ],
});
const attacker = createMockCharacter({
  id: "scoped-attacker",
  name: "Attacker",
  cost: 2,
  strength: 2,
  willpower: 8,
});
const defender = createMockCharacter({
  id: "scoped-defender",
  name: "Defender",
  cost: 2,
  strength: 1,
  willpower: 8,
});
const location = createMockLocation({
  id: "scoped-location",
  name: "Location",
  cost: 1,
  willpower: 8,
});
it("blocks the protected player's characters and locations then expires", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [action], inkwell: 1, deck: 6, play: [{ card: defender, exerted: true }, location] },
    { deck: 6, play: [attacker] },
  );
  expect(game.asPlayerOne().playCard(action, { targets: [attacker] })).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().canChallenge(attacker, defender)).toBe(false);
  expect(game.asPlayerTwo().canChallenge(attacker, location)).toBe(false);
  expect(game.asPlayerTwo().challenge(attacker, defender)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().challenge(attacker, location)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().challenge(attacker, location)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getDamage(location)).toBe(2);
});
it("retains until-next-turn effects for the full three-player cycle", () => {
  expect(
    resolveEffectWindow(4, "until-start-of-next-turn", {
      playerIds: [PLAYER_ONE, PLAYER_TWO, "third" as PlayerId],
    }),
  ).toEqual({ startsAtTurn: 4, expiresAtTurn: 6 });
});
it("permits another opponent's defenders and rejects only the protected controller", () => {
  const third = "third" as PlayerId;
  const attackId = "attacker" as CardInstanceId,
    protectedId = "protected" as CardInstanceId,
    otherId = "other" as CardInstanceId;
  const ctx = createTestContext({
    currentPlayer: UNIT_TWO,
    zoneCards: {
      [`play:${UNIT_TWO}`]: [attackId],
      [`play:${UNIT_ONE}`]: [protectedId],
      [`play:${third}`]: [otherId],
    },
    definitions: {
      attacker: { id: "attacker", cardType: "character", strength: 2, willpower: 8 },
      protected: { id: "protected", cardType: "location", willpower: 8 },
      other: { id: "other", cardType: "location", willpower: 8 },
    },
    cardMeta: { attacker: { state: "ready", isDrying: false } },
  });
  ctx.framework.state.playerIds.push(third);
  resolveRestrictionEffect(
    ctx,
    createCardPlayed({ cardId: "source", playerId: UNIT_ONE }),
    {
      type: "restriction",
      restriction: "cant-challenge",
      defenderPlayers: "CONTROLLER",
      target: { ref: "previous-target" },
      duration: "until-start-of-next-turn",
    },
    { targets: [attackId] },
  );
  expect(ctx.cards.require(attackId).meta.temporaryRestrictions).toEqual({
    [`cant-challenge-player:${UNIT_ONE}`]: 3,
  });
  expect(
    evaluateActionCondition(
      { type: "opponent-count", comparison: "greater-or-equal", value: 2 },
      ctx,
      createCardPlayed({ cardId: "source", playerId: UNIT_ONE }),
      {},
    ),
  ).toBe(true);
  resolveGainKeywordEffect(
    ctx,
    createCardPlayed({ cardId: "source", playerId: UNIT_ONE }),
    {
      type: "gain-keyword",
      keyword: "Reckless",
      duration: "until-start-of-next-turn",
      target: { ref: "previous-target" },
    },
    { targets: [attackId] },
  );
  expect(hasTemporaryKeyword(ctx.cards.require(attackId).meta, 3, "Reckless")).toBe(true);
  expect(hasTemporaryKeyword(ctx.cards.require(attackId).meta, 4, "Reckless")).toBe(false);
  const atTurn = (turn: number) => ({
    ...ctx,
    queryMoves: () => [],
    framework: {
      ...ctx.framework,
      state: { ...ctx.framework.state, status: { ...ctx.framework.state.status, turn } },
    },
  });
  const intent = atTurn(1);
  expect(getLegalChallengeDefendersForAttacker(intent, attackId)).toEqual([otherId]);
  resolveRestrictionEffect(
    atTurn(2),
    createCardPlayed({ cardId: "second-source", playerId: third }),
    {
      type: "restriction",
      restriction: "cant-challenge",
      defenderPlayers: "CONTROLLER",
      target: { ref: "previous-target" },
      duration: "until-start-of-next-turn",
    },
    { targets: [attackId] },
  );
  expect(getLegalChallengeDefendersForAttacker(atTurn(2), attackId)).toEqual([]);
  expect(getLegalChallengeDefendersForAttacker(atTurn(4), attackId)).toEqual([protectedId]);
  expect(getLegalChallengeDefendersForAttacker(atTurn(5), attackId)).toEqual([
    protectedId,
    otherId,
  ]);
});
