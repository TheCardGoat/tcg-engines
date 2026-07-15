/**
 * Judge moves — special moves for test setup that modify game state through the
 * proper move/operations pipeline. They emit events, recompute active effects,
 * and produce patches, unlike raw state mutation.
 *
 * These are registered only by the test engine and are never available in
 * production. All judge moves return `false` from `available` so they never
 * appear in `enumerateMoves`, but can still be executed directly via `exec()`.
 */

import type { CardZone } from "@tcg/cyberpunk-types";
import {
  createGigDieId,
  type CardInstanceId,
  type GigDieId,
  type PlayerId,
} from "../types/branded.ts";
import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { CardMeta } from "../types/card-instance.ts";
import type {
  ActiveEffect,
  AttackState,
  PendingChoice,
  TurnMetadata,
} from "../types/match-state.ts";
import type { DieType } from "../types/gig-die.ts";

export interface JudgeSpendCardInput extends MoveInput {
  args: { cardId: string };
}

export interface JudgeReadyCardInput extends MoveInput {
  args: { cardId: string };
}

export interface JudgeSetCardMetaInput extends MoveInput {
  args: { cardId: string; meta: Partial<CardMeta> };
}

export interface JudgeSetCardDefinitionInput extends MoveInput {
  args: { cardId: string; definitionId: string };
}

export interface JudgeMoveCardToZoneInput extends MoveInput {
  args: { cardId: string; toZone: CardZone; playerId?: string; index?: number };
}

export interface JudgeMoveCardToTopOfDeckInput extends MoveInput {
  args: { cardId: string; playerId: string };
}

export interface JudgeStackDeckInput extends MoveInput {
  args: { playerId: string; cardIds: string[]; replace?: boolean };
}

export interface JudgeMoveFixerDieToGigAreaInput extends MoveInput {
  args: { playerId: string; dieId?: string; dieType?: DieType; faceValue?: number };
}

export interface JudgeMoveGigToPlayerInput extends MoveInput {
  args: { dieId: string; toPlayerId: string; sourceCardId?: string };
}

export interface JudgeAddGigDieInput extends MoveInput {
  args: { playerId: string; dieType: DieType; faceValue: number; id?: string };
}

export interface JudgeSetGigValueInput extends MoveInput {
  args: { dieId: string; value: number };
}

export interface JudgeSetTurnMetadataInput extends MoveInput {
  args: { patch: Partial<TurnMetadata> };
}

export interface JudgeSetAttackStateInput extends MoveInput {
  args: { attackState: AttackState | null };
}

export interface JudgeSetPendingChoiceInput extends MoveInput {
  args: { pendingChoice: PendingChoice | undefined };
}

export interface JudgeAddActiveEffectInput extends MoveInput {
  args: { effect: ActiveEffect };
}

const judgeSpendCard: MoveDefinition<JudgeSpendCardInput> = {
  available: () => false,
  execute({ input, operations }) {
    operations.card.spend(input.args.cardId as CardInstanceId);
  },
};

const judgeReadyCard: MoveDefinition<JudgeReadyCardInput> = {
  available: () => false,
  execute({ input, operations }) {
    operations.card.ready(input.args.cardId as CardInstanceId);
  },
};

const judgeSetCardMeta: MoveDefinition<JudgeSetCardMetaInput> = {
  available: () => false,
  execute({ input, operations }) {
    operations.card.setMeta(input.args.cardId as CardInstanceId, input.args.meta);
  },
};

const judgeSetCardDefinition: MoveDefinition<JudgeSetCardDefinitionInput> = {
  available: () => false,
  execute({ state, input }) {
    const card = state.G.cardIndex[input.args.cardId];
    if (card) card.definitionId = input.args.definitionId;
  },
};

const judgeMoveCardToZone: MoveDefinition<JudgeMoveCardToZoneInput> = {
  available: () => false,
  execute({ input, operations }) {
    operations.zone.moveCard(
      input.args.cardId as CardInstanceId,
      input.args.toZone,
      input.args.playerId as PlayerId | undefined,
      { index: input.args.index },
    );
  },
};

const judgeMoveCardToTopOfDeck: MoveDefinition<JudgeMoveCardToTopOfDeckInput> = {
  available: () => false,
  execute({ state, input, operations }) {
    const { cardId, playerId } = input.args;
    const player = state.G.players[playerId];
    if (!player) return;

    // Remove the card from its current position in the deck
    const idx = player.zones.deck.indexOf(cardId as CardInstanceId);
    if (idx !== -1) {
      player.zones.deck.splice(idx, 1);
    }

    // Place it at the front (top) of the deck
    operations.zone.moveCardsToTop(playerId as PlayerId, [cardId as CardInstanceId]);
  },
};

const judgeStackDeck: MoveDefinition<JudgeStackDeckInput> = {
  available: () => false,
  execute({ state, input, operations }) {
    const { cardIds, playerId, replace } = input.args;
    const player = state.G.players[playerId];
    if (!player) return;

    if (replace) {
      player.zones.deck = [];
    }

    for (const cardId of cardIds) {
      const idx = player.zones.deck.indexOf(cardId as CardInstanceId);
      if (idx !== -1) {
        player.zones.deck.splice(idx, 1);
      }
    }

    operations.zone.moveCardsToTop(
      playerId as PlayerId,
      cardIds.map((id) => id as CardInstanceId),
    );
  },
};

const judgeMoveFixerDieToGigArea: MoveDefinition<JudgeMoveFixerDieToGigAreaInput> = {
  available: () => false,
  execute({ state, input, operations }) {
    const { playerId, dieId, dieType, faceValue } = input.args;
    const player = state.G.players[playerId];
    if (!player) return;

    const selectedDieId =
      dieId ??
      player.fixerArea.find((id) => {
        const die = state.G.gigDice[id as string];
        return dieType === undefined || die?.dieType === dieType;
      });
    if (!selectedDieId) return;

    const die = state.G.gigDice[selectedDieId as string];
    if (!die) return;
    operations.gig.takeFromFixer(playerId as PlayerId, selectedDieId as GigDieId, () => {
      return faceValue ?? die.faceValue;
    });
  },
};

const judgeMoveGigToPlayer: MoveDefinition<JudgeMoveGigToPlayerInput> = {
  available: () => false,
  execute({ input, operations }) {
    operations.gig.moveGig(
      input.args.dieId as GigDieId,
      input.args.toPlayerId as PlayerId,
      input.args.sourceCardId as CardInstanceId | undefined,
    );
  },
};

const judgeAddGigDie: MoveDefinition<JudgeAddGigDieInput> = {
  available: () => false,
  execute({ state, input }) {
    const player = state.G.players[input.args.playerId];
    if (!player) return;

    const dieId = createGigDieId(
      input.args.id ??
        `judge-gig-${input.args.playerId}-${Object.keys(state.G.gigDice).length + 1}`,
    );
    state.G.gigDice[dieId as string] = {
      id: dieId,
      dieType: input.args.dieType,
      faceValue: input.args.faceValue,
      location: "gigArea",
      ownerId: input.args.playerId as PlayerId,
    };
    player.gigArea.push(dieId);
  },
};

const judgeSetGigValue: MoveDefinition<JudgeSetGigValueInput> = {
  available: () => false,
  execute({ input, operations }) {
    operations.gig.setGigValue(input.args.dieId as GigDieId, input.args.value);
  },
};

const judgeSetTurnMetadata: MoveDefinition<JudgeSetTurnMetadataInput> = {
  available: () => false,
  execute({ input, operations }) {
    operations.game.setTurnMetadata(input.args.patch);
  },
};

const judgeSetAttackState: MoveDefinition<JudgeSetAttackStateInput> = {
  available: () => false,
  execute({ input, operations }) {
    operations.game.setAttackState(input.args.attackState);
  },
};

const judgeSetPendingChoice: MoveDefinition<JudgeSetPendingChoiceInput> = {
  available: () => false,
  execute({ input, operations }) {
    operations.game.setPendingChoice(input.args.pendingChoice);
  },
};

const judgeAddActiveEffect: MoveDefinition<JudgeAddActiveEffectInput> = {
  available: () => false,
  execute({ input, operations }) {
    operations.game.addActiveEffect(input.args.effect);
  },
};

const judgeRecomputeActiveEffects: MoveDefinition<MoveInput> = {
  available: () => false,
  execute() {
    // The command processor recomputes static active effects after every move.
  },
};

export const judgeAllMoves: Record<string, MoveDefinition<any>> = {
  "judge:spendCard": judgeSpendCard,
  "judge:readyCard": judgeReadyCard,
  "judge:setCardMeta": judgeSetCardMeta,
  "judge:setCardDefinition": judgeSetCardDefinition,
  "judge:moveCardToZone": judgeMoveCardToZone,
  "judge:moveCardToTopOfDeck": judgeMoveCardToTopOfDeck,
  "judge:stackDeck": judgeStackDeck,
  "judge:moveFixerDieToGigArea": judgeMoveFixerDieToGigArea,
  "judge:moveGigToPlayer": judgeMoveGigToPlayer,
  "judge:addGigDie": judgeAddGigDie,
  "judge:setGigValue": judgeSetGigValue,
  "judge:setTurnMetadata": judgeSetTurnMetadata,
  "judge:setAttackState": judgeSetAttackState,
  "judge:setPendingChoice": judgeSetPendingChoice,
  "judge:addActiveEffect": judgeAddActiveEffect,
  "judge:recomputeActiveEffects": judgeRecomputeActiveEffects,
};
