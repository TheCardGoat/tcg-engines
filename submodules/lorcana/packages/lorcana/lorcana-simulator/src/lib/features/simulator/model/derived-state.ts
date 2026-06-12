import { m } from "$lib/i18n/messages.js";
import type { AvailableMove, CardInstanceId } from "@tcg/lorcana-engine";
import type { LorcanaEngineBase, LorcanaProjectedBoardView } from "@tcg/lorcana-engine";

import type {
  ExecutableMoveEntry,
  ExecutableMovePresentationCategoryId,
  LorcanaActiveEffectSummary,
  LorcanaCardTextEntrySnapshot,
  LorcanaPlayerSide,
  LorcanaPlayerSummary,
  LorcanaSimulatorMoveParams,
  MoveCategorySummary,
  MoveValidationResult,
  PendingResolutionMoveEntry,
} from "@/features/simulator/model/contracts.js";
import {
  getZoneCardCount,
  getAvailableInkForSide,
  getOwnerIdForSide as getOwnerIdForSideFromBoard,
} from "@/features/simulator/model/contracts.js";
import { type CardSnapshotMap, getCardsForZone } from "@/features/simulator/model/board-utils.js";
import { getMoveCategoryLabel } from "@/features/simulator/model/move-presentation.js";

export interface ChallengeState {
  invalidReasons: Record<string, string>;
  validTargetIds: string[];
}

function getChallengeValidationReason(validation: MoveValidationResult): string {
  switch (validation.code) {
    case "ATTACKER_DRYING":
      return "Your challenger is still drying.";
    case "ATTACKER_EXERTED":
      return "Your challenger is exerted.";
    case "ATTACKER_NOT_CHARACTER":
      return "Only characters can challenge.";
    case "ATTACKER_NOT_IN_PLAY":
      return "Your challenger is no longer in play.";
    case "DEFENDER_BODYGUARD_RESTRICTION":
      return "Another Bodyguard must be challenged first.";
    case "DEFENDER_CANT_BE_CHALLENGED":
      return "This character can't be challenged right now.";
    case "DEFENDER_CHARACTER_NOT_EXERTED":
      return "This character must be exerted to be challenged.";
    case "DEFENDER_EVASIVE_RESTRICTION":
      return "This character has Evasive.";
    case "DEFENDER_INVALID_TYPE":
      return "Only opposing characters or locations can be challenged.";
    case "DEFENDER_NOT_IN_PLAY":
      return "This target is no longer in play.";
    case "BAG_PENDING":
    case "EFFECT_PENDING":
      return "Resolve pending effects before challenging.";
    default:
      return validation.reason?.trim() || m["sim.errors.challenge.invalidTarget"]({});
  }
}

export function canValidateInk(engine: LorcanaEngineBase, cardId: string): boolean {
  return engine.validateMove("putCardIntoInkwell", {
    args: { cardId: cardId as CardInstanceId },
  }).valid;
}

function getCardLabel(cardId: string, cards: CardSnapshotMap): string {
  return cards[cardId]?.label ?? m["sim.card.unknown"]({});
}

function getPlayCostLabel(params: Record<string, unknown>): string | null {
  const cost = params.cost;
  if (cost === "shift") {
    return "Shift";
  }
  if (cost === "sing") {
    return "Sing";
  }
  if (cost === "singTogether") {
    return "Sing Together";
  }
  if (cost === "free") {
    return "Free";
  }
  if (cost === "sacrifice") {
    return "Banish Item";
  }
  if (cost === "exert-items") {
    return "Exert 4 Items";
  }
  return null;
}

function hasBodyguardKeyword(cardId: string, cards: CardSnapshotMap): boolean {
  return cards[cardId]?.keywords?.includes("Bodyguard") ?? false;
}

function hasSelfEnterExertedRestriction(cardId: string, cards: CardSnapshotMap): boolean {
  const card = cards[cardId];
  if (!card || card.cardType !== "character") {
    return false;
  }

  const searchableText = [
    card.text ?? "",
    ...(card.textEntries ?? []).map((entry) => entry.description),
  ]
    .join("\n")
    .toLowerCase();

  if (!searchableText.includes("this character enters play exerted")) {
    return false;
  }

  return !searchableText.includes("unless") && !searchableText.includes("if ");
}

function formatPlayerRestrictionLabel(restriction: string): string {
  switch (restriction) {
    case "cant-play-actions":
      return "Can't play actions";
    case "cant-play-items":
      return "Can't play items";
    case "cant-sing":
      return "Can't sing";
    default:
      return restriction
        .split("-")
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ");
  }
}

function formatPlayerEffectDuration(
  effect: LorcanaProjectedBoardView["activeEffects"][number],
): string | undefined {
  const payload = effect.payload;
  const rawDuration =
    payload &&
    typeof payload === "object" &&
    "duration" in payload &&
    typeof payload.duration === "string" &&
    payload.duration.trim().length > 0
      ? payload.duration.trim()
      : undefined;

  switch (rawDuration) {
    case "next-play-this-turn":
      return "For the next play this turn";
    case "this-turn":
      return "This turn";
    case "until-start-of-next-turn":
      return "Until the start of next turn";
    default:
      if (typeof effect.expiresAtTurn === "number") {
        return `Active through turn ${effect.expiresAtTurn}`;
      }
      return undefined;
  }
}

function buildPlayerActiveEffects(
  ownerId: string,
  snapshot: LorcanaProjectedBoardView,
  cardSnapshotsById: CardSnapshotMap,
): LorcanaActiveEffectSummary[] | undefined {
  const effects: LorcanaActiveEffectSummary[] = [];

  for (const effect of snapshot.activeEffects) {
    if (effect.targetPlayerId !== ownerId) {
      continue;
    }

    const sourceCard = effect.sourceId ? (cardSnapshotsById[effect.sourceId] ?? null) : null;
    const sourceLabel = sourceCard?.label;
    const duration = formatPlayerEffectDuration(effect);
    const payload = effect.payload;

    if (
      effect.type === "player-cost-reduction" &&
      payload &&
      typeof payload === "object" &&
      "amount" in payload &&
      typeof payload.amount === "number"
    ) {
      const cardType =
        "cardType" in payload && typeof payload.cardType === "string" ? payload.cardType : "card";
      const label = `Cost -${payload.amount}`;
      const description = [`Next ${cardType} costs ${payload.amount} less`];
      if (sourceLabel) {
        description.push(`From ${sourceLabel}`);
      }
      if (duration) {
        description.push(duration);
      }

      effects.push({
        id: effect.id,
        type: effect.type,
        label,
        description: description.join(" · "),
        priority: 4,
        sourceCardId: sourceCard?.cardId,
        sourceLabel,
        sourceSet: sourceCard?.set,
        sourceCardNumber: sourceCard?.cardNumber,
        sourceInkType: sourceCard?.inkType,
        targetPlayerId: ownerId,
        amount: payload.amount,
        startsAtTurn: effect.startsAtTurn,
        expiresAtTurn: effect.expiresAtTurn,
      });
      continue;
    }

    if (
      effect.type === "player-restriction" &&
      payload &&
      typeof payload === "object" &&
      "restriction" in payload &&
      typeof payload.restriction === "string"
    ) {
      const label = formatPlayerRestrictionLabel(payload.restriction);
      const description = [label];
      if (sourceLabel) {
        description.push(`From ${sourceLabel}`);
      }
      if (duration) {
        description.push(duration);
      }

      effects.push({
        id: effect.id,
        type: effect.type,
        label,
        description: description.join(" · "),
        priority: 4,
        sourceCardId: sourceCard?.cardId,
        sourceLabel,
        sourceSet: sourceCard?.set,
        sourceCardNumber: sourceCard?.cardNumber,
        sourceInkType: sourceCard?.inkType,
        targetPlayerId: ownerId,
        restriction: payload.restriction,
        startsAtTurn: effect.startsAtTurn,
        expiresAtTurn: effect.expiresAtTurn,
      });
    }
  }

  if (effects.length === 0) {
    return undefined;
  }

  const deduped = new Map<string, LorcanaActiveEffectSummary>();
  for (const effect of effects) {
    const key = `${effect.type}:${effect.label}:${effect.sourceCardId ?? "none"}`;
    if (!deduped.has(key)) {
      deduped.set(key, effect);
    }
  }

  return [...deduped.values()].sort((left, right) => left.label.localeCompare(right.label));
}

function supportsEntryModePlayChoice(cardId: string, cards: CardSnapshotMap): boolean {
  const card = cards[cardId];
  if (!card || card.zoneId !== "hand" || card.cardType !== "character") {
    return false;
  }

  return (
    (hasBodyguardKeyword(cardId, cards) || card.mayEnterPlayExertedOption === true) &&
    !hasSelfEnterExertedRestriction(cardId, cards)
  );
}

function getPlayModeOptionLabel(
  params: Record<string, unknown>,
  cards: CardSnapshotMap,
): string | null {
  const cardId = typeof params.cardId === "string" ? params.cardId : null;
  if (!cardId) {
    return null;
  }

  if (params.resolveOptional === true) {
    return "Play Exerted";
  }

  if (
    supportsEntryModePlayChoice(cardId, cards) &&
    (!params.cost || params.cost === "standard") &&
    !params.targets
  ) {
    return "Play Ready";
  }

  if (
    supportsEntryModePlayChoice(cardId, cards) &&
    (!params.cost || params.cost === "standard") &&
    Array.isArray(params.targets)
  ) {
    return "Play Ready";
  }

  return null;
}

const KEYWORD_PATTERN =
  /^(Rush|Ward|Evasive|Bodyguard|Support|Reckless|Vanish|Alert|Challenger \+\d+|Resist \+\d+|Singer \d+|Sing Together \d+|Boost \d+|(?:Puppy |Universal )?Shift \d+)$/i;

function getMoveOptionLabel(
  moveId: string,
  params: Record<string, unknown>,
  cards: CardSnapshotMap,
): string {
  if (moveId === "playCard") {
    const cardId = typeof params.cardId === "string" ? params.cardId : null;
    if (!cardId) {
      return getMoveCategoryLabel(moveId);
    }

    const targetCardId =
      Array.isArray(params.targets) && typeof params.targets[0] === "string"
        ? params.targets[0]
        : null;
    const costLabel = getPlayCostLabel(params);
    const playLabel = costLabel
      ? `${getCardLabel(cardId, cards)} (${costLabel})`
      : getCardLabel(cardId, cards);
    const playModeLabel = getPlayModeOptionLabel(params, cards);

    if (playModeLabel) {
      return targetCardId
        ? `${playModeLabel} -> ${getCardLabel(targetCardId, cards)}`
        : `${playModeLabel} (${getCardLabel(cardId, cards)})`;
    }

    return targetCardId ? `${playLabel} -> ${getCardLabel(targetCardId, cards)}` : playLabel;
  }

  if (moveId === "putCardIntoInkwell" || moveId === "quest") {
    const cardId = typeof params.cardId === "string" ? params.cardId : null;
    return cardId ? getCardLabel(cardId, cards) : getMoveCategoryLabel(moveId);
  }

  if (moveId === "activateAbility") {
    const cardId = typeof params.cardId === "string" ? params.cardId : null;
    const abilityIndex = typeof params.abilityIndex === "number" ? params.abilityIndex : null;
    if (!cardId) {
      return moveId;
    }

    const card = cards[cardId];
    const abilityTitles = card?.textEntries?.map((e) => e.title) ?? [];
    const abilityTitle = abilityIndex !== null ? abilityTitles[abilityIndex] : null;

    return abilityTitle && abilityTitle.length > 0
      ? `${getCardLabel(cardId, cards)}: ${abilityTitle}`
      : getCardLabel(cardId, cards);
  }

  if (moveId === "moveCharacterToLocation") {
    const characterId = typeof params.characterId === "string" ? params.characterId : null;
    const locationId = typeof params.locationId === "string" ? params.locationId : null;
    if (characterId && locationId) {
      return `${getCardLabel(characterId, cards)} -> ${getCardLabel(locationId, cards)}`;
    }
  }

  if (moveId === "challenge") {
    const attackerId = typeof params.attackerId === "string" ? params.attackerId : null;
    const defenderId = typeof params.defenderId === "string" ? params.defenderId : null;
    if (attackerId && defenderId) {
      return `${getCardLabel(attackerId, cards)} -> ${getCardLabel(defenderId, cards)}`;
    }
  }

  return getMoveCategoryLabel(moveId);
}

function sortExecutableMoves(entries: ExecutableMoveEntry[]): ExecutableMoveEntry[] {
  return entries.sort((left, right) => {
    if (left.moveId === "playCard" && right.moveId === "playCard") {
      const leftParams = left.params as { cardId?: string; resolveOptional?: boolean };
      const rightParams = right.params as { cardId?: string; resolveOptional?: boolean };
      const leftCardId = typeof leftParams.cardId === "string" ? leftParams.cardId : null;
      const rightCardId = typeof rightParams.cardId === "string" ? rightParams.cardId : null;
      if (leftCardId && leftCardId === rightCardId) {
        const leftResolveOptional =
          typeof leftParams.resolveOptional === "boolean" ? leftParams.resolveOptional : false;
        const rightResolveOptional =
          typeof rightParams.resolveOptional === "boolean" ? rightParams.resolveOptional : false;
        if (leftResolveOptional !== rightResolveOptional) {
          return leftResolveOptional ? 1 : -1;
        }
      }
    }

    return left.label.localeCompare(right.label);
  });
}

function pushSupplementalExecutableMoves(
  engine: LorcanaEngineBase,
  legalMoveIds: readonly string[],
  entries: ExecutableMoveEntry[],
): void {
  if (
    legalMoveIds.includes("alterHand") &&
    !entries.some((entry) => entry.moveId === "alterHand")
  ) {
    const playerId = engine.getClientPlayerId() ?? "";
    const label = getMoveCategoryLabel("alterHand");
    entries.push({
      id: "alterHand",
      label,
      moveId: "alterHand",
      params: { playerId, cardsToMulligan: [] } as LorcanaSimulatorMoveParams["alterHand"],
      presentation: {
        kind: "direct",
        categoryId: "alter-hand",
        categoryLabel: label,
      },
    });
  }

  if (legalMoveIds.includes("concede") && !entries.some((entry) => entry.moveId === "concede")) {
    const playerId = engine.getClientPlayerId() ?? "";
    entries.push({
      id: "concede",
      label: getMoveCategoryLabel("concede"),
      moveId: "concede",
      params: { playerId } as LorcanaSimulatorMoveParams["concede"],
      presentation: {
        kind: "direct",
        categoryId: "concede",
        categoryLabel: getMoveCategoryLabel("concede"),
      },
    });
  }

  if (engine.canUndo?.() && !entries.some((entry) => entry.moveId === "undo")) {
    entries.push({
      id: "undo",
      label: getMoveCategoryLabel("undo"),
      moveId: "undo",
      params: {} as LorcanaSimulatorMoveParams["undo"],
      presentation: {
        kind: "direct",
        categoryId: "undo",
        categoryLabel: getMoveCategoryLabel("undo"),
      },
    });
  }
}

function buildEntriesForAvailableMove(
  engine: LorcanaEngineBase,
  cards: CardSnapshotMap,
  move: AvailableMove,
  availableMoves: AvailableMove[],
  sourceCardId?: string,
): ExecutableMoveEntry[] {
  const entries: ExecutableMoveEntry[] = [];

  for (const cardId of move.selectableCardIds) {
    if (sourceCardId && String(cardId) !== sourceCardId) {
      continue;
    }

    switch (move.moveId) {
      case "playCard": {
        const id = String(cardId);
        const targetOptions = engine.getMoveOptions("playCard", cardId);
        const supportsEntryModeChoice = supportsEntryModePlayChoice(id, cards);

        if (targetOptions.length > 0) {
          for (const option of targetOptions) {
            if (option.kind !== "card") {
              continue;
            }

            const targetId = String(option.cardId);
            const playVariants = supportsEntryModeChoice
              ? [
                  {
                    idSuffix: "ready",
                    params: {
                      cardId: id,
                      cost: "standard",
                      targets: [targetId],
                    } as LorcanaSimulatorMoveParams["playCard"],
                  },
                  {
                    idSuffix: "exerted",
                    params: {
                      cardId: id,
                      cost: "standard",
                      targets: [targetId],
                      resolveOptional: true,
                    } as LorcanaSimulatorMoveParams["playCard"],
                  },
                ]
              : [
                  {
                    idSuffix: null,
                    params: {
                      cardId: id,
                      cost: "standard",
                      targets: [targetId],
                    } as LorcanaSimulatorMoveParams["playCard"],
                  },
                ];

            for (const variant of playVariants) {
              const label = getMoveOptionLabel("playCard", variant.params, cards);
              const optionLabel = getPlayModeOptionLabel(variant.params, cards) ?? label;
              entries.push({
                id:
                  variant.idSuffix === null
                    ? `playCard:${id}:${targetId}`
                    : `playCard:${id}:${targetId}:${variant.idSuffix}`,
                label,
                moveId: "playCard",
                params: variant.params,
                presentation: {
                  kind: "targeted",
                  categoryId: "play-card",
                  categoryLabel: getMoveCategoryLabel("playCard"),
                  optionLabel,
                },
              });
            }
          }
          continue;
        }

        const playVariants = supportsEntryModeChoice
          ? [
              {
                idSuffix: "ready",
                params: { cardId: id, cost: "standard" } as LorcanaSimulatorMoveParams["playCard"],
              },
              {
                idSuffix: "exerted",
                params: {
                  cardId: id,
                  cost: "standard",
                  resolveOptional: true,
                } as LorcanaSimulatorMoveParams["playCard"],
              },
            ]
          : [
              {
                idSuffix: null,
                params: { cardId: id, cost: "standard" } as LorcanaSimulatorMoveParams["playCard"],
              },
            ];

        for (const variant of playVariants) {
          const label = getMoveOptionLabel("playCard", variant.params, cards);
          const optionLabel = getPlayModeOptionLabel(variant.params, cards) ?? label;
          entries.push({
            id: variant.idSuffix === null ? `playCard:${id}` : `playCard:${id}:${variant.idSuffix}`,
            label,
            moveId: "playCard",
            params: variant.params,
            presentation: {
              kind: "targeted",
              categoryId: "play-card",
              categoryLabel: getMoveCategoryLabel("playCard"),
              optionLabel,
            },
          });
        }

        // Alternative cost entries (sacrifice / exert items / put-toy-on-deck-bottom)
        const cardDef =
          typeof engine.getCardDefinitionByInstanceId === "function"
            ? (engine.getCardDefinitionByInstanceId(cardId) as
                | { abilities?: Array<{ type: string; alternativeCost?: string }> }
                | undefined)
            : undefined;
        if (cardDef?.abilities) {
          const hasSacrificeCost = cardDef.abilities.some(
            (a) => a.type === "action" && a.alternativeCost === "sacrifice-item",
          );
          const hasExertItemsCost = cardDef.abilities.some(
            (a) => a.type === "action" && a.alternativeCost === "exert-4-items",
          );
          const hasPutToyOnDeckBottomCost = cardDef.abilities.some(
            (a) => a.type === "action" && a.alternativeCost === "put-toy-character-on-deck-bottom",
          );

          if (hasSacrificeCost || hasExertItemsCost) {
            const board = engine.getBoard();
            const clientPlayerId = engine.getClientPlayerId();
            const playerBoard = clientPlayerId ? board.players[clientPlayerId] : null;

            if (playerBoard) {
              if (hasSacrificeCost) {
                const itemIds = playerBoard.play
                  .filter((pid) => {
                    const pDef = engine.getCardDefinitionByInstanceId(pid as CardInstanceId) as
                      | { cardType?: string }
                      | undefined;
                    return pDef?.cardType === "item";
                  })
                  .map(String);
                if (itemIds.length > 0) {
                  const sacrificeLabel = getMoveOptionLabel(
                    "playCard",
                    { cardId: id, cost: "sacrifice" },
                    cards,
                  );
                  entries.push({
                    id: `playCard:${id}:sacrifice`,
                    label: sacrificeLabel,
                    moveId: "playCard",
                    params: {
                      cardId: id,
                      cost: "sacrifice",
                    } as LorcanaSimulatorMoveParams["playCard"],
                    presentation: {
                      kind: "targeted",
                      categoryId: "play-card",
                      categoryLabel: getMoveCategoryLabel("playCard"),
                      optionLabel: "Banish Item",
                      selectableCosts: [
                        {
                          kind: "banishItems" as const,
                          count: 1,
                          candidateCardIds: itemIds as CardInstanceId[],
                          zone: "play" as const,
                        },
                      ],
                    },
                  });
                }
              }

              if (hasExertItemsCost) {
                const readyItemIds = playerBoard.play
                  .filter((pid) => {
                    const pDef = engine.getCardDefinitionByInstanceId(pid as CardInstanceId) as
                      | { cardType?: string }
                      | undefined;
                    if (pDef?.cardType !== "item") return false;
                    const cardState = board.cards[String(pid)];
                    return !cardState?.exerted;
                  })
                  .map(String);
                if (readyItemIds.length >= 4) {
                  const exertLabel = getMoveOptionLabel(
                    "playCard",
                    { cardId: id, cost: "exert-items" },
                    cards,
                  );
                  entries.push({
                    id: `playCard:${id}:exert-items`,
                    label: exertLabel,
                    moveId: "playCard",
                    params: {
                      cardId: id,
                      cost: "exert-items",
                    } as LorcanaSimulatorMoveParams["playCard"],
                    presentation: {
                      kind: "targeted",
                      categoryId: "play-card",
                      categoryLabel: getMoveCategoryLabel("playCard"),
                      optionLabel: "Exert 4 Items",
                      selectableCosts: [
                        {
                          kind: "exertItems" as const,
                          count: 4,
                          candidateCardIds: readyItemIds as CardInstanceId[],
                          zone: "play" as const,
                        },
                      ],
                    },
                  });
                }
              }
            }
          }

          if (hasPutToyOnDeckBottomCost) {
            const board = engine.getBoard();
            const clientPlayerId = engine.getClientPlayerId();
            const playerBoard = clientPlayerId ? board.players[clientPlayerId] : null;

            if (playerBoard) {
              const toyCharacterDiscardIds = (playerBoard.discard ?? [])
                .filter((did) => {
                  const dDef = engine.getCardDefinitionByInstanceId(did as CardInstanceId) as
                    | { cardType?: string; classifications?: string[] }
                    | undefined;
                  if (dDef?.cardType !== "character") return false;
                  return (dDef.classifications ?? []).includes("Toy");
                })
                .map(String);
              if (toyCharacterDiscardIds.length > 0) {
                const putOnDeckBottomLabel = getMoveOptionLabel(
                  "playCard",
                  { cardId: id, cost: "put-on-deck-bottom" },
                  cards,
                );
                entries.push({
                  id: `playCard:${id}:put-on-deck-bottom`,
                  label: putOnDeckBottomLabel,
                  moveId: "playCard",
                  params: {
                    cardId: id,
                    cost: "put-on-deck-bottom",
                  } as LorcanaSimulatorMoveParams["playCard"],
                  presentation: {
                    kind: "targeted",
                    categoryId: "play-card",
                    categoryLabel: getMoveCategoryLabel("playCard"),
                    optionLabel: "Put Toy on Deck Bottom",
                    selectableCosts: [
                      {
                        kind: "putOnDeckBottom" as const,
                        count: 1,
                        candidateCardIds: toyCharacterDiscardIds as CardInstanceId[],
                        zone: "discard" as const,
                      },
                    ],
                  },
                });
              }
            }
          }
        }

        continue;
      }
      case "shiftCard": {
        const id = String(cardId);
        const shiftTargetOptions = engine.getMoveOptions("shiftCard", cardId);

        if (shiftTargetOptions.length > 0) {
          for (const option of shiftTargetOptions) {
            if (option.kind !== "card") {
              continue;
            }

            const targetId = String(option.cardId);
            const params = {
              cardId: id,
              cost: "shift",
              shiftTarget: targetId,
              targets: [targetId],
            } as LorcanaSimulatorMoveParams["playCard"];
            const label = getMoveOptionLabel("playCard", params, cards);
            entries.push({
              id: `shiftCard:${id}:${targetId}`,
              label,
              moveId: "playCard",
              params,
              presentation: {
                kind: "targeted",
                categoryId: "shift-card",
                categoryLabel: getMoveCategoryLabel("shiftCard"),
                optionLabel: label,
                ...(option.selectableCosts ? { selectableCosts: option.selectableCosts } : {}),
              },
            });
          }
          continue;
        }

        const shiftParams = {
          cardId: id,
          cost: "shift",
        } as LorcanaSimulatorMoveParams["playCard"];
        const shiftLabel = getMoveOptionLabel("playCard", shiftParams, cards);
        entries.push({
          id: `shiftCard:${id}`,
          label: shiftLabel,
          moveId: "playCard",
          params: shiftParams,
          presentation: {
            kind: "targeted",
            categoryId: "shift-card",
            categoryLabel: getMoveCategoryLabel("shiftCard"),
            optionLabel: shiftLabel,
          },
        });
        continue;
      }
      case "singCard": {
        const id = String(cardId);
        const singerOptions = engine.getMoveOptions("singCard", cardId);

        if (singerOptions.length > 0) {
          for (const option of singerOptions) {
            if (option.kind === "card") {
              const singerId = String(option.cardId);
              const params = {
                cardId: id,
                cost: "sing",
                singer: singerId,
              } as LorcanaSimulatorMoveParams["playCard"];
              const label = getMoveOptionLabel("playCard", params, cards);
              entries.push({
                id: `singCard:${id}:${singerId}`,
                label,
                moveId: "playCard",
                params,
                presentation: {
                  kind: "targeted",
                  categoryId: "sing-card",
                  categoryLabel: getMoveCategoryLabel("singCard"),
                  optionLabel: label,
                },
              });
              continue;
            }

            if (option.kind !== "singTogether") {
              continue;
            }

            const params = {
              cardId: id,
              cost: "singTogether",
            } as LorcanaSimulatorMoveParams["playCard"];
            const label = getMoveOptionLabel("playCard", params, cards);
            entries.push({
              id: `singCard:${id}:singTogether`,
              label,
              moveId: "playCard",
              params,
              presentation: {
                kind: "targeted",
                categoryId: "sing-card",
                categoryLabel: getMoveCategoryLabel("singCard"),
                optionLabel: "Sing Together",
                selectionMode: "singTogether",
                candidateCards: option.singers.map((singer) => ({
                  cardId: String(singer.cardId),
                  value: singer.value,
                })),
                requiredValue: option.requiredTotal,
              },
            });
          }
          continue;
        }

        const singParams = {
          cardId: id,
          cost: "sing",
        } as LorcanaSimulatorMoveParams["playCard"];
        const singLabel = getMoveOptionLabel("playCard", singParams, cards);
        entries.push({
          id: `singCard:${id}`,
          label: singLabel,
          moveId: "playCard",
          params: singParams,
          presentation: {
            kind: "targeted",
            categoryId: "sing-card",
            categoryLabel: getMoveCategoryLabel("singCard"),
            optionLabel: singLabel,
          },
        });
        continue;
      }
      case "putCardIntoInkwell": {
        const id = String(cardId);
        const params = { cardId: id } as LorcanaSimulatorMoveParams["putCardIntoInkwell"];
        const label = getMoveOptionLabel("putCardIntoInkwell", params, cards);
        entries.push({
          id: `putCardIntoInkwell:${id}`,
          label,
          moveId: "putCardIntoInkwell",
          params,
          presentation: {
            kind: "targeted",
            categoryId: "ink-card",
            categoryLabel: getMoveCategoryLabel("putCardIntoInkwell"),
            optionLabel: label,
          },
        });
        continue;
      }
      case "quest": {
        const id = String(cardId);
        const params = { cardId: id } as LorcanaSimulatorMoveParams["quest"];
        const label = getMoveOptionLabel("quest", params, cards);
        entries.push({
          id: `quest:${id}`,
          label,
          moveId: "quest",
          params,
          presentation: {
            kind: "targeted",
            categoryId: "quest",
            categoryLabel: getMoveCategoryLabel("quest"),
            optionLabel: label,
          },
        });
        continue;
      }
      case "challenge": {
        const defenderOptions = engine.getMoveOptions("challenge", cardId);
        for (const option of defenderOptions) {
          if (option.kind !== "card") continue;
          const attackerId = String(cardId);
          const defenderId = String(option.cardId);
          const params = {
            attackerId,
            defenderId,
          } as LorcanaSimulatorMoveParams["challenge"];
          const label = getMoveOptionLabel("challenge", params, cards);
          entries.push({
            id: `challenge:${attackerId}:${defenderId}`,
            label,
            moveId: "challenge",
            params,
            presentation: {
              kind: "targeted",
              categoryId: "challenge",
              categoryLabel: getMoveCategoryLabel("challenge"),
              optionLabel: label,
            },
          });
        }
        continue;
      }
      case "moveCharacterToLocation": {
        const locationOptions = engine.getMoveOptions("moveCharacterToLocation", cardId);
        for (const option of locationOptions) {
          if (option.kind !== "card") continue;
          const characterId = String(cardId);
          const locationId = String(option.cardId);
          const params = {
            characterId,
            locationId,
          } as LorcanaSimulatorMoveParams["moveCharacterToLocation"];
          const label = getMoveOptionLabel("moveCharacterToLocation", params, cards);
          entries.push({
            id: `moveCharacterToLocation:${characterId}:${locationId}`,
            label,
            moveId: "moveCharacterToLocation",
            params,
            presentation: {
              kind: "targeted",
              categoryId: "move-to-location",
              categoryLabel: getMoveCategoryLabel("moveCharacterToLocation"),
              optionLabel: label,
            },
          });
        }
        continue;
      }
      case "activateAbility": {
        const abilityOptions = engine.getMoveOptions("activateAbility", cardId);
        for (const option of abilityOptions) {
          if (option.kind !== "ability") continue;
          const id = String(cardId);
          const params = {
            cardId: id,
            abilityIndex: option.abilityIndex,
          } as LorcanaSimulatorMoveParams["activateAbility"];
          const label = option.abilityLabel?.trim().length
            ? `${getCardLabel(id, cards)}: ${option.abilityLabel.trim()}`
            : getMoveOptionLabel("activateAbility", params, cards);
          entries.push({
            id: `activateAbility:${id}:${option.abilityIndex}`,
            label,
            moveId: "activateAbility",
            params,
            presentation: {
              kind: "targeted",
              categoryId: "activate-ability",
              categoryLabel: getMoveCategoryLabel("activateAbility"),
              optionLabel: label,
              ...(option.selectableCosts ? { selectableCosts: option.selectableCosts } : {}),
            },
          });
        }
        continue;
      }
    }
  }

  switch (move.moveId) {
    case "chooseWhoGoesFirst": {
      const board = engine.getBoard();
      const sides = ["playerOne", "playerTwo"] as const;
      board.playerOrder.forEach((playerId, index) => {
        const id = String(playerId);
        const side = sides[index];
        const params = { playerId: id, side } as LorcanaSimulatorMoveParams["chooseWhoGoesFirst"];
        const label = side === "playerOne" ? "Player 1 goes first" : "Player 2 goes first";
        entries.push({
          id: `chooseWhoGoesFirst:${id}`,
          label,
          moveId: "chooseWhoGoesFirst",
          params,
          presentation: {
            kind: "targeted",
            categoryId: "choose-first-player",
            categoryLabel: getMoveCategoryLabel("chooseWhoGoesFirst"),
            optionLabel: label,
          },
        });
      });
      break;
    }
    case "concede": {
      const playerId = engine.getClientPlayerId() ?? "";
      entries.push({
        id: "concede",
        label: getMoveCategoryLabel("concede"),
        moveId: "concede",
        params: { playerId } as LorcanaSimulatorMoveParams["concede"],
        presentation: {
          kind: "direct",
          categoryId: "concede",
          categoryLabel: getMoveCategoryLabel("concede"),
        },
      });
      break;
    }
    case "passTurn": {
      entries.push({
        id: "passTurn",
        label: getMoveCategoryLabel("passTurn"),
        moveId: "passTurn",
        params: {} as LorcanaSimulatorMoveParams["passTurn"],
        presentation: {
          kind: "direct",
          categoryId: "pass-turn",
          categoryLabel: getMoveCategoryLabel("passTurn"),
        },
      });
      break;
    }
    case "questWithAll": {
      const questMove = availableMoves.find((availableMove) => availableMove.moveId === "quest");
      const questCardIds = questMove?.selectableCardIds ?? [];
      if (questCardIds.length > 0) {
        let totalLore = 0;
        for (const cardId of questCardIds) {
          totalLore += cards[String(cardId)]?.loreValue ?? 0;
        }
        const label = m["sim.actions.label.questWithAll"]({
          count: questCardIds.length,
          lore: totalLore,
        });
        entries.push({
          id: "questWithAll",
          label,
          moveId: "questWithAll",
          params: {} as LorcanaSimulatorMoveParams["questWithAll"],
          presentation: {
            kind: "direct",
            categoryId: "quest-all",
            categoryLabel: label,
          },
        });
      }
      break;
    }
  }

  return entries;
}

/**
 * Builds the flat list of executable moves by delegating to the engine's
 * getAvailableMoves() and getMoveOptions() APIs instead of enumerating
 * card combinations and calling validateMove() locally.
 */
export function buildExecutableMoves(
  engine: LorcanaEngineBase,
  cards: CardSnapshotMap,
  availableMoves: AvailableMove[],
  legalMoveIds: readonly string[],
): ExecutableMoveEntry[] {
  const entries: ExecutableMoveEntry[] = [];

  for (const move of availableMoves) {
    entries.push(...buildEntriesForAvailableMove(engine, cards, move, availableMoves));
  }

  pushSupplementalExecutableMoves(engine, legalMoveIds, entries);

  return sortExecutableMoves(entries);
}

/**
 * Builds lightweight category summaries from available moves without calling
 * getMoveOptions(). This is cheap enough to run on every state change.
 */
export function buildMoveCategorySummaries(
  engine: LorcanaEngineBase,
  availableMoves: AvailableMove[],
  legalMoveIds: readonly string[],
): MoveCategorySummary[] {
  const summaries: MoveCategorySummary[] = [];

  for (const move of availableMoves) {
    switch (move.moveId) {
      case "playCard": {
        summaries.push({
          categoryId: "play-card",
          categoryLabel: getMoveCategoryLabel("playCard"),
          sourceCardIds: move.selectableCardIds.map(String),
          isDirect: false,
        });
        break;
      }
      case "shiftCard": {
        summaries.push({
          categoryId: "shift-card",
          categoryLabel: getMoveCategoryLabel("shiftCard"),
          sourceCardIds: move.selectableCardIds.map(String),
          isDirect: false,
        });
        break;
      }
      case "singCard": {
        summaries.push({
          categoryId: "sing-card",
          categoryLabel: getMoveCategoryLabel("singCard"),
          sourceCardIds: move.selectableCardIds.map(String),
          isDirect: false,
        });
        break;
      }
      case "putCardIntoInkwell": {
        summaries.push({
          categoryId: "ink-card",
          categoryLabel: getMoveCategoryLabel("putCardIntoInkwell"),
          sourceCardIds: move.selectableCardIds.map(String),
          isDirect: false,
        });
        break;
      }
      case "quest": {
        summaries.push({
          categoryId: "quest",
          categoryLabel: getMoveCategoryLabel("quest"),
          sourceCardIds: move.selectableCardIds.map(String),
          isDirect: false,
        });
        break;
      }
      case "challenge": {
        summaries.push({
          categoryId: "challenge",
          categoryLabel: getMoveCategoryLabel("challenge"),
          sourceCardIds: move.selectableCardIds.map(String),
          isDirect: false,
        });
        break;
      }
      case "activateAbility": {
        summaries.push({
          categoryId: "activate-ability",
          categoryLabel: getMoveCategoryLabel("activateAbility"),
          sourceCardIds: move.selectableCardIds.map(String),
          isDirect: false,
        });
        break;
      }
      case "moveCharacterToLocation": {
        summaries.push({
          categoryId: "move-to-location",
          categoryLabel: getMoveCategoryLabel("moveCharacterToLocation"),
          sourceCardIds: move.selectableCardIds.map(String),
          isDirect: false,
        });
        break;
      }
      case "passTurn": {
        summaries.push({
          categoryId: "pass-turn",
          categoryLabel: getMoveCategoryLabel("passTurn"),
          sourceCardIds: [],
          isDirect: true,
        });
        break;
      }
      case "concede": {
        summaries.push({
          categoryId: "concede",
          categoryLabel: getMoveCategoryLabel("concede"),
          sourceCardIds: [],
          isDirect: true,
        });
        break;
      }
      case "questWithAll": {
        const questMove = availableMoves.find((m) => m.moveId === "quest");
        if (questMove && questMove.selectableCardIds.length > 0) {
          summaries.push({
            categoryId: "quest-all",
            categoryLabel: getMoveCategoryLabel("questWithAll"),
            sourceCardIds: [],
            isDirect: true,
          });
        }
        break;
      }
      case "chooseWhoGoesFirst": {
        summaries.push({
          categoryId: "choose-first-player",
          categoryLabel: getMoveCategoryLabel("chooseWhoGoesFirst"),
          sourceCardIds: [],
          isDirect: false,
        });
        break;
      }
    }
  }

  // Handle moves not exposed via getAvailableMoves() but present in enumerateMoves()
  if (legalMoveIds.includes("alterHand") && !summaries.some((s) => s.categoryId === "alter-hand")) {
    summaries.push({
      categoryId: "alter-hand",
      categoryLabel: getMoveCategoryLabel("alterHand"),
      sourceCardIds: [],
      isDirect: true,
    });
  }

  if (legalMoveIds.includes("concede") && !summaries.some((s) => s.categoryId === "concede")) {
    summaries.push({
      categoryId: "concede",
      categoryLabel: getMoveCategoryLabel("concede"),
      sourceCardIds: [],
      isDirect: true,
    });
  }

  if (engine.canUndo?.() && !summaries.some((s) => s.categoryId === "undo")) {
    summaries.push({
      categoryId: "undo",
      categoryLabel: getMoveCategoryLabel("undo"),
      sourceCardIds: [],
      isDirect: true,
    });
  }

  return summaries;
}

/**
 * Expands a single move category into full ExecutableMoveEntry[].
 * Called lazily on user interaction (category click in AvailableMovesPanel),
 * NOT on every state change. This defers getMoveOptions() calls until needed.
 * Only the requested category's AvailableMove entries are expanded.
 */
export function expandCategoryMoves(
  engine: LorcanaEngineBase,
  cards: CardSnapshotMap,
  availableMoves: AvailableMove[],
  legalMoveIds: readonly string[],
  categoryId: ExecutableMovePresentationCategoryId,
): ExecutableMoveEntry[] {
  const entries: ExecutableMoveEntry[] = [];
  const relevantMoves = availableMoves.filter((move) => {
    switch (categoryId) {
      case "play-card":
        return move.moveId === "playCard";
      case "shift-card":
        return move.moveId === "shiftCard";
      case "sing-card":
        return move.moveId === "singCard";
      case "ink-card":
        return move.moveId === "putCardIntoInkwell";
      case "quest":
        return move.moveId === "quest";
      case "challenge":
        return move.moveId === "challenge";
      case "move-to-location":
        return move.moveId === "moveCharacterToLocation";
      case "activate-ability":
        return move.moveId === "activateAbility";
      case "choose-first-player":
        return move.moveId === "chooseWhoGoesFirst";
      case "pass-turn":
        return move.moveId === "passTurn";
      case "concede":
        return move.moveId === "concede";
      case "quest-all":
        return move.moveId === "questWithAll";
      default:
        return false;
    }
  });

  for (const move of relevantMoves) {
    entries.push(...buildEntriesForAvailableMove(engine, cards, move, availableMoves));
  }

  if (categoryId === "alter-hand" || categoryId === "concede" || categoryId === "undo") {
    pushSupplementalExecutableMoves(engine, legalMoveIds, entries);
  }

  return sortExecutableMoves(entries.filter((move) => move.presentation.categoryId === categoryId));
}

/**
 * Expands moves for a specific source card.
 * Called lazily on card hover (getCardActionViews) and DnD checks.
 */
export function expandCardMoves(
  engine: LorcanaEngineBase,
  cards: CardSnapshotMap,
  availableMoves: AvailableMove[],
  _legalMoveIds: readonly string[],
  cardId: string,
): ExecutableMoveEntry[] {
  const entries: ExecutableMoveEntry[] = [];

  for (const move of availableMoves) {
    if (
      move.moveId !== "playCard" &&
      move.moveId !== "shiftCard" &&
      move.moveId !== "singCard" &&
      move.moveId !== "putCardIntoInkwell" &&
      move.moveId !== "quest" &&
      move.moveId !== "challenge" &&
      move.moveId !== "moveCharacterToLocation" &&
      move.moveId !== "activateAbility"
    ) {
      continue;
    }

    entries.push(...buildEntriesForAvailableMove(engine, cards, move, availableMoves, cardId));
  }

  return sortExecutableMoves(entries).filter((move) => getSourceCardId(move) === cardId);
}

export function expandCardActionCategoryMoves(
  engine: LorcanaEngineBase,
  cards: CardSnapshotMap,
  availableMoves: AvailableMove[],
  legalMoveIds: readonly string[],
  cardId: string,
  categoryId: ExecutableMovePresentationCategoryId,
): ExecutableMoveEntry[] {
  const entries: ExecutableMoveEntry[] = [];
  const relevantMoves = availableMoves.filter((move) => {
    switch (categoryId) {
      case "play-card":
        return move.moveId === "playCard";
      case "shift-card":
        return move.moveId === "shiftCard";
      case "sing-card":
        return move.moveId === "singCard";
      case "ink-card":
        return move.moveId === "putCardIntoInkwell";
      case "quest":
        return move.moveId === "quest";
      case "challenge":
        return move.moveId === "challenge";
      case "move-to-location":
        return move.moveId === "moveCharacterToLocation";
      case "activate-ability":
        return move.moveId === "activateAbility";
      default:
        return false;
    }
  });

  for (const move of relevantMoves) {
    entries.push(...buildEntriesForAvailableMove(engine, cards, move, availableMoves, cardId));
  }

  if (categoryId === "alter-hand" || categoryId === "concede" || categoryId === "undo") {
    pushSupplementalExecutableMoves(engine, legalMoveIds, entries);
  }

  return sortExecutableMoves(
    entries.filter(
      (move) => move.presentation.categoryId === categoryId && getSourceCardId(move) === cardId,
    ),
  );
}

function getSourceCardId(move: ExecutableMoveEntry): string | null {
  const params = move.params as Record<string, unknown>;
  if (typeof params.cardId === "string") return params.cardId;
  if (typeof params.attackerId === "string") return params.attackerId;
  if (typeof params.characterId === "string") return params.characterId;
  return null;
}

export function areMoveCategorySummariesEqual(
  left: MoveCategorySummary[],
  right: MoveCategorySummary[],
): boolean {
  if (left.length !== right.length) return false;
  for (let i = 0; i < left.length; i++) {
    const l = left[i];
    const r = right[i];
    if (
      l.categoryId !== r.categoryId ||
      l.categoryLabel !== r.categoryLabel ||
      l.isDirect !== r.isDirect ||
      l.sourceCardIds.length !== r.sourceCardIds.length
    ) {
      return false;
    }
    for (let j = 0; j < l.sourceCardIds.length; j++) {
      if (l.sourceCardIds[j] !== r.sourceCardIds[j]) return false;
    }
  }
  return true;
}

/**
 * Returns card IDs that can initiate a challenge.
 * Delegates to engine.getAvailableMoves() instead of iterating card pairs.
 */
export function buildChallengeReadyCardIds(availableMoves: AvailableMove[]): string[] {
  const challengeMove = availableMoves.find((move) => move.moveId === "challenge");
  if (!challengeMove) {
    return [];
  }
  return challengeMove.selectableCardIds.map(String).sort();
}

/**
 * Returns hand card IDs that can be played or inked.
 * Delegates to engine.getAvailableMoves() instead of iterating hand cards.
 */
export function buildPlayableHandCardIds(availableMoves: AvailableMove[]): string[] {
  const playableCardIds = new Set<string>();

  for (const move of availableMoves) {
    if (
      move.moveId === "playCard" ||
      move.moveId === "singCard" ||
      move.moveId === "shiftCard" ||
      move.moveId === "putCardIntoInkwell"
    ) {
      for (const cardId of move.selectableCardIds) {
        playableCardIds.add(String(cardId));
      }
    }
  }

  return [...playableCardIds].sort();
}

function hasMove(legalMoves: readonly string[], moveId: string): boolean {
  return legalMoves.includes(moveId);
}

export function buildPendingResolutionMoves(
  legalMoves: readonly string[],
  board: LorcanaProjectedBoardView,
): PendingResolutionMoveEntry[] {
  const entries: PendingResolutionMoveEntry[] = [];

  if (hasMove(legalMoves, "resolveBag")) {
    entries.push(
      ...board.bagEffects.map((bagEffect) => ({
        id: `resolveBag:${bagEffect.id}`,
        moveId: "resolveBag" as const,
        params: { bagId: bagEffect.id },
      })),
    );
  }

  if (hasMove(legalMoves, "resolveEffect") && board.pendingChoice?.requestID) {
    entries.push({
      id: `resolveEffect:${board.pendingChoice.requestID}`,
      moveId: "resolveEffect",
      params: { effectId: board.pendingChoice.requestID, params: {} },
    });
  }

  return entries.sort((left, right) => left.id.localeCompare(right.id));
}

/**
 * Builds challenge state for a specific attacker.
 * Uses engine.getMoveOptions() for valid targets, and engine.validateMove()
 * only for the invalid targets to get user-facing reason strings.
 */
export function buildChallengeState(
  engine: LorcanaEngineBase,
  cards: CardSnapshotMap,
  board: LorcanaProjectedBoardView,
  currentOwnerSide: LorcanaPlayerSide | null,
  currentChallengeSourceCardId: string | null,
): ChallengeState {
  if (!currentOwnerSide || !currentChallengeSourceCardId) {
    return {
      invalidReasons: {},
      validTargetIds: [],
    };
  }

  // Get valid targets from the engine's 2-layer API
  const validOptions = engine.getMoveOptions(
    "challenge",
    currentChallengeSourceCardId as CardInstanceId,
  );
  const validTargetIdSet = new Set(
    validOptions
      .filter((opt): opt is { kind: "card"; cardId: CardInstanceId } => opt.kind === "card")
      .map((opt) => String(opt.cardId)),
  );
  const validTargetIds = [...validTargetIdSet].sort();

  // For invalid targets, get the reason via engine validation
  const opponentSide = currentOwnerSide === "playerOne" ? "playerTwo" : "playerOne";
  const invalidReasons: Record<string, string> = {};
  const opponentCards = getCardsForZone(cards, board, opponentSide, "play");

  for (const card of opponentCards) {
    if (validTargetIdSet.has(card.cardId)) continue;

    const validation = engine.validateMove("challenge", {
      args: {
        attackerId: currentChallengeSourceCardId as CardInstanceId,
        defenderId: card.cardId as CardInstanceId,
      },
    });
    invalidReasons[card.cardId] = getChallengeValidationReason(validation);
  }

  return { invalidReasons, validTargetIds };
}

export function areOrderedStringArraysEqual(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return false;
    }
  }

  return true;
}

export function areStringRecordsEqual(
  left: Record<string, string>,
  right: Record<string, string>,
): boolean {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  for (const key of leftKeys) {
    if (!(key in right) || left[key] !== right[key]) {
      return false;
    }
  }

  return true;
}

function areUnknownRecordsEqual(
  left: Record<string, unknown> | undefined,
  right: Record<string, unknown> | undefined,
): boolean {
  if (!left || !right) {
    return left === right;
  }

  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  for (const key of leftKeys) {
    if (!(key in right) || !Object.is(left[key], right[key])) {
      return false;
    }
  }

  return true;
}

export function areExecutableMovesEqual(
  left: ExecutableMoveEntry[],
  right: ExecutableMoveEntry[],
): boolean {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    const leftMove = left[index];
    const rightMove = right[index];

    if (
      leftMove.id !== rightMove.id ||
      leftMove.label !== rightMove.label ||
      leftMove.moveId !== rightMove.moveId ||
      leftMove.presentation.kind !== rightMove.presentation.kind ||
      leftMove.presentation.categoryId !== rightMove.presentation.categoryId ||
      leftMove.presentation.categoryLabel !== rightMove.presentation.categoryLabel ||
      (leftMove.presentation.kind === "targeted" ? leftMove.presentation.optionLabel : null) !==
        (rightMove.presentation.kind === "targeted" ? rightMove.presentation.optionLabel : null) ||
      !areUnknownRecordsEqual(leftMove.params, rightMove.params)
    ) {
      return false;
    }
  }

  return true;
}

export function arePendingResolutionMovesEqual(
  left: PendingResolutionMoveEntry[],
  right: PendingResolutionMoveEntry[],
): boolean {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    const leftMove = left[index];
    const rightMove = right[index];
    if (
      leftMove.id !== rightMove.id ||
      leftMove.moveId !== rightMove.moveId ||
      !areUnknownRecordsEqual(leftMove.params, rightMove.params)
    ) {
      return false;
    }
  }

  return true;
}

export function getPlayerSummary(
  side: LorcanaPlayerSide | null,
  snapshot: LorcanaProjectedBoardView | null,
  cardSnapshotsById: CardSnapshotMap = {},
): LorcanaPlayerSummary | null {
  if (!side || !snapshot) {
    return null;
  }

  const ownerId = getOwnerIdForSideFromBoard(snapshot, side);
  if (!ownerId) {
    return null;
  }

  const timer = snapshot.timerView.players?.[ownerId];
  const activeEffects = buildPlayerActiveEffects(ownerId, snapshot, cardSnapshotsById);
  const effectSourceCardIds = activeEffects
    ? ([...new Set(activeEffects.map((effect) => effect.sourceCardId).filter(Boolean))] as string[])
    : snapshot.playerEffectSourceIds?.[ownerId];

  return {
    lore: snapshot.players[ownerId]?.lore ?? 0,
    deckCount: getZoneCardCount(snapshot, side, "deck"),
    handCount: getZoneCardCount(snapshot, side, "hand"),
    discardCount: getZoneCardCount(snapshot, side, "discard"),
    inkwellCount: getZoneCardCount(snapshot, side, "inkwell"),
    availableInk: getAvailableInkForSide(snapshot, side),
    activeEffects,
    effectSourceCardIds,
    timer,
  };
}
