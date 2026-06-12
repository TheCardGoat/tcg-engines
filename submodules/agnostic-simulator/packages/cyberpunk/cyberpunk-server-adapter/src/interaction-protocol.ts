import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type EntityCandidate,
  type InteractionAction,
  type InteractionInput,
  type InteractionSubmission,
} from "@tcg/protocol";
import type { AvailableMove, ChoicePrompt, PlayerPrompt } from "@tcg/cyberpunk-engine";

type NativePayload = Record<string, unknown>;

export function buildCyberpunkInteractionView(input: {
  actorId: string;
  stateVersion: number;
  prompt: PlayerPrompt;
}): EngineInteractionView {
  const actions =
    input.prompt.choice === null
      ? input.prompt.availableMoves.map((move) => actionFromAvailableMove(move, input.stateVersion))
      : [actionFromChoice(input.prompt.choice, input.stateVersion)];

  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "cyberpunk",
    actorId: input.actorId,
    stateVersion: input.stateVersion,
    status: mapStatus(input.prompt.status),
    actions,
  };
}

export function cyberpunkSubmissionToPayload(submission: InteractionSubmission): {
  moveType: string;
  payload: NativePayload;
} {
  switch (submission.actionId) {
    case "playCard": {
      const cardId = requireString(submission, "cardId");
      const attachToId = optionalString(submission, "attachToId");
      return {
        moveType: submission.actionId,
        payload: withOptional({ cardId }, "attachToId", attachToId),
      };
    }
    case "sellCard":
    case "goSolo":
    case "resolveCardToPlay":
      return {
        moveType: submission.actionId,
        payload: { cardId: requireString(submission, "cardId") },
      };
    case "callLegend":
      return {
        moveType: submission.actionId,
        payload: { legendId: requireString(submission, "cardId") },
      };
    case "attackRival":
      return {
        moveType: submission.actionId,
        payload: { attackerId: requireString(submission, "attackerId") },
      };
    case "attackUnit":
      return {
        moveType: submission.actionId,
        payload: {
          attackerId: requireString(submission, "attackerId"),
          defenderId: requireString(submission, "defenderId"),
        },
      };
    case "useBlocker":
      return {
        moveType: submission.actionId,
        payload: { blockerId: requireString(submission, "blockerId") },
      };
    case "activateAbility":
      return {
        moveType: submission.actionId,
        payload: {
          cardId: requireString(submission, "cardId"),
          abilityIndex: requireNumber(submission, "abilityIndex"),
        },
      };
    case "gainGig":
      return {
        moveType: submission.actionId,
        payload: { dieId: requireString(submission, "dieId") },
      };
    case "resolveStealGigs":
      return {
        moveType: submission.actionId,
        payload: { dieIds: requireStringArray(submission, "dieIds") },
      };
    case "resolveEffectTarget": {
      const pass = optionalBoolean(submission, "pass") ?? false;
      return {
        moveType: submission.actionId,
        payload: pass ? { pass } : { targetIds: requireStringArray(submission, "targetIds") },
      };
    }
    case "resolveDiscardFromHand": {
      const pass = optionalBoolean(submission, "pass") ?? false;
      return {
        moveType: submission.actionId,
        payload: pass ? { pass } : { cardIds: requireStringArray(submission, "cardIds") },
      };
    }
    case "resolveSearchDeck":
      return {
        moveType: submission.actionId,
        payload: { selectedCardIds: requireStringArray(submission, "selectedCardIds") },
      };
    case "resolveTrigger": {
      const triggerId = optionalString(submission, "triggerId");
      const pass = optionalBoolean(submission, "pass") ?? triggerId === undefined;
      return {
        moveType: submission.actionId,
        payload: withOptional({ pass }, "triggerId", triggerId),
      };
    }
    case "resolveAdjustGig":
      return {
        moveType: submission.actionId,
        payload: { value: requireNumber(submission, "value") },
      };
    case "resolveCardToMove": {
      const cardId = optionalString(submission, "cardId");
      const pass = optionalBoolean(submission, "pass") ?? false;
      return { moveType: submission.actionId, payload: withOptional({ pass }, "cardId", cardId) };
    }
    case "resolveAttack": {
      const pass = optionalBoolean(submission, "pass") ?? false;
      const gigIdsToSteal = optionalStringArray(submission, "gigIdsToSteal");
      return {
        moveType: submission.actionId,
        payload: { pass, ...(gigIdsToSteal !== undefined ? { gigIdsToSteal } : {}) },
      };
    }
    default:
      return { moveType: submission.actionId, payload: {} };
  }
}

function mapStatus(status: PlayerPrompt["status"]): EngineInteractionView["status"] {
  switch (status) {
    case "idle":
      return "idle";
    case "action":
      return "ready";
    case "choice":
      return "choosing";
    case "waiting":
      return "waiting";
  }
}

function actionFromAvailableMove(move: AvailableMove, stateVersion: number): InteractionAction {
  return {
    id: move.moveId,
    requestId: requestId(stateVersion, move.moveId),
    intent: intentForMove(move.moveId),
    text: { key: `cyberpunk.move.${move.moveId}` },
    enabled: inputSpecIsActionable(move),
    inputs: inputsForMove(move),
  };
}

function actionFromChoice(choice: ChoicePrompt, stateVersion: number): InteractionAction {
  switch (choice.type) {
    case "searchDeck":
      const revealedCardCandidates = choice.payload.revealedCards.map((card) => ({
        entity: { kind: "card" as const, instanceId: card.instanceId },
        enabled: searchCardMatchesTarget(card, choice.payload.target),
      }));
      return choiceAction({
        stateVersion,
        id: "resolveSearchDeck",
        intent: "order-cards",
        textParams: {
          lookCount: choice.payload.lookCount,
          canSkip: choice.payload.select.kind === "upTo",
          ...(choice.payload.source
            ? {
                sourceCardId: choice.payload.source.cardId,
                sourceDisplayName: choice.payload.source.displayName,
                sourceRulesText: choice.payload.source.rulesText ?? "",
              }
            : {}),
        },
        source: choice.payload.source
          ? {
              kind: "card",
              instanceId: choice.payload.source.cardId,
            }
          : undefined,
        inputs: [
          entityInputFromCandidates(
            "selectedCardIds",
            "source",
            "card",
            boundsForSearch(choice),
            revealedCardCandidates,
          ),
        ],
      });
    case "chooseTarget": {
      if (choice.payload.type === "adjustGig") {
        const { min, max } = adjustGigValueBounds(choice);
        return choiceAction({
          stateVersion,
          id: "resolveAdjustGig",
          intent: "custom",
          textParams: {
            chooseUpTo: choice.payload.chooseUpTo === true,
          },
          source: choice.payload.dieId
            ? {
                kind: "die",
                instanceId: choice.payload.dieId,
                ...(choice.payload.dieOwnerId ? { ownerId: choice.payload.dieOwnerId } : {}),
              }
            : undefined,
          inputs: [
            {
              kind: "number",
              id: "value",
              text: { key: "cyberpunk.choice.adjustGig.value" },
              required: true,
              min,
              max,
            },
          ],
        });
      }
      const ids = choice.payload.eligibleIds ?? [];
      const inputId = choice.payload.type === "discardFromHand" ? "cardIds" : "targetIds";
      const actionId =
        choice.payload.type === "discardFromHand"
          ? "resolveDiscardFromHand"
          : "resolveEffectTarget";
      const source = choice.payload.type === "effectTarget" ? choice.payload.source : undefined;
      const inputBounds =
        choice.payload.type === "discardFromHand"
          ? bounds(choice.payload.amount, choice.payload.amount)
          : bounds(choice.payload.min, choice.payload.max);
      const canDecline = choice.payload.canDecline === true;
      return choiceAction({
        stateVersion,
        id: actionId,
        intent: "choose-targets",
        ...(source === undefined
          ? {}
          : {
              source: {
                kind: "card",
                instanceId: source.cardId,
              },
            }),
        textParams: {
          ...(source
            ? {
                sourceCardId: source.cardId,
                sourceDisplayName: source.displayName,
                sourceRulesText: source.rulesText ?? "",
              }
            : {}),
          ...(choice.payload.adjustGig
            ? {
                adjustGigMaxAmount: choice.payload.adjustGig.maxAmount ?? 0,
                adjustGigDirection: choice.payload.adjustGig.direction ?? "either",
                adjustGigChooseUpTo: choice.payload.adjustGig.chooseUpTo === true,
              }
            : {}),
          canDecline,
        },
        inputs: [
          entityInput(
            inputId,
            "target",
            choice.payload.targetKind === "gig" ? "die" : "card",
            canDecline ? { ...inputBounds, min: 0 } : inputBounds,
            ids,
            { ordered: isOrderedGigCopyChoice(choice) },
          ),
          ...(canDecline
            ? [
                {
                  kind: "boolean" as const,
                  id: "pass",
                  text: { key: "cyberpunk.input.pass" },
                  required: false,
                  trueText: { key: "cyberpunk.input.pass.true" },
                  falseText: { key: "cyberpunk.input.pass.false" },
                },
              ]
            : []),
        ],
      });
    }
    case "chooseTrigger":
      return choiceAction({
        stateVersion,
        id: "resolveTrigger",
        intent: "choose-option",
        inputs: [
          {
            kind: "option-selection",
            id: "triggerId",
            text: { key: "cyberpunk.choice.chooseTrigger" },
            required: !choice.payload.canPass,
            min: choice.payload.canPass ? 0 : 1,
            max: 1,
            options: choice.payload.options.map((option) => ({
              id: option.triggerId,
              text: {
                key: "cyberpunk.choice.trigger",
                params: { cardName: option.cardName, sourceCardId: option.sourceCardId },
              },
              enabled: true,
            })),
          },
        ],
      });
    case "chooseGigsToSteal":
      return choiceAction({
        stateVersion,
        id: "resolveStealGigs",
        intent: "choose-targets",
        inputs: [
          entityInput(
            "dieIds",
            "target",
            "die",
            { min: choice.payload.count, max: choice.payload.count },
            choice.payload.eligibleDice.map((die) => die.dieId),
          ),
        ],
      });
    case "chooseCardToPlay":
      return choiceAction({
        stateVersion,
        id: "resolveCardToPlay",
        intent: "play-card",
        inputs: [
          entityInput("cardId", "source", "card", { min: 1, max: 1 }, choice.payload.cardIds),
        ],
      });
    case "chooseCardToMove": {
      const canDecline = choice.payload.canDecline === true;
      return choiceAction({
        stateVersion,
        id: "resolveCardToMove",
        intent: "move-card",
        source: choice.payload.source
          ? {
              kind: "card",
              instanceId: choice.payload.source.cardId,
            }
          : undefined,
        textParams: choice.payload.source
          ? {
              sourceCardId: choice.payload.source.cardId,
              sourceDisplayName: choice.payload.source.displayName,
              sourceRulesText: choice.payload.source.rulesText ?? "",
              destination: choice.payload.destination ?? "",
            }
          : undefined,
        inputs: [
          entityInput(
            "cardId",
            "source",
            "card",
            canDecline ? { min: 0, max: 1 } : { min: 1, max: 1 },
            choice.payload.cardIds,
          ),
          ...(canDecline
            ? [
                {
                  kind: "boolean" as const,
                  id: "pass",
                  text: { key: "cyberpunk.input.pass" },
                  required: false,
                  trueText: { key: "cyberpunk.input.pass.true" },
                  falseText: { key: "cyberpunk.input.pass.false" },
                },
              ]
            : []),
        ],
      });
    }
    case "gainGig":
      return choiceAction({
        stateVersion,
        id: "gainGig",
        intent: "custom",
        inputs: [
          entityInput("dieId", "source", "die", { min: 1, max: 1 }, choice.payload.allowedDieIds),
        ],
      });
    case "chooseEffect":
      return choiceAction({
        stateVersion,
        id: "resolveEffectTarget",
        intent: "choose-option",
        enabled: false,
        disabledText: { key: "cyberpunk.choice.chooseEffect.unsupported" },
        inputs: [
          {
            kind: "option-selection",
            id: "effectId",
            text: { key: "cyberpunk.choice.chooseEffect" },
            required: true,
            min: 1,
            max: 1,
            options: choice.payload.options.map((option) => ({
              id: option.id,
              text: { key: "cyberpunk.choice.effect", params: { label: option.label } },
              enabled: true,
            })),
          },
        ],
      });
  }
}

function inputsForMove(move: AvailableMove): InteractionInput[] {
  switch (move.inputSpec.type) {
    case "none":
      return [];
    case "selectCard":
      return [
        entityInput(
          inputIdForSelectCardMove(move.moveId),
          roleForMove(move.moveId),
          "card",
          { min: 1, max: 1 },
          move.inputSpec.candidates,
        ),
      ];
    case "selectPair":
      return [
        entityInput(
          "attackerId",
          "from",
          "card",
          { min: 1, max: 1 },
          move.inputSpec.fromCandidates,
        ),
        entityInput("defenderId", "to", "card", { min: 1, max: 1 }, move.inputSpec.toCandidates),
      ];
    case "selectAbility":
      return [
        entityInput("cardId", "source", "card", { min: 1, max: 1 }, [
          ...new Set(move.inputSpec.candidates.map((candidate) => candidate.cardId)),
        ]),
        {
          kind: "option-selection",
          id: "abilityIndex",
          text: { key: "cyberpunk.input.ability" },
          required: true,
          min: 1,
          max: 1,
          options: move.inputSpec.candidates.map((candidate) => ({
            id: String(candidate.abilityIndex),
            text: {
              key: "cyberpunk.ability.index",
              params: { cardId: candidate.cardId, index: candidate.abilityIndex },
            },
            enabled: true,
          })),
        },
      ];
    case "playCard":
      const playableCandidates = playableCardCandidates(move.inputSpec.candidates);
      return [
        entityInput(
          "cardId",
          "source",
          "card",
          playableCandidates.length > 0 ? { min: 1, max: 1 } : { min: 0, max: 0 },
          playableCandidates.map((candidate) => candidate.cardId),
        ),
        ...attachTargetInputs(move.inputSpec.candidates),
      ];
  }
}

function inputSpecIsActionable(move: AvailableMove): boolean {
  switch (move.inputSpec.type) {
    case "none":
      return true;
    case "selectCard":
      return move.inputSpec.candidates.length > 0;
    case "selectPair":
      return move.inputSpec.fromCandidates.length > 0 && move.inputSpec.toCandidates.length > 0;
    case "selectAbility":
      return move.inputSpec.candidates.length > 0;
    case "playCard":
      return playableCardCandidates(move.inputSpec.candidates).length > 0;
  }
}

function playableCardCandidates(
  candidates: Extract<AvailableMove["inputSpec"], { type: "playCard" }>["candidates"],
): Extract<AvailableMove["inputSpec"], { type: "playCard" }>["candidates"] {
  return candidates.filter(
    (candidate) => candidate.attachTargets === undefined || candidate.attachTargets.length > 0,
  );
}

function attachTargetInputs(
  candidates: Extract<AvailableMove["inputSpec"], { type: "playCard" }>["candidates"],
): InteractionInput[] {
  const attachTargets = [
    ...new Set(candidates.flatMap((candidate) => candidate.attachTargets ?? [])),
  ];
  if (attachTargets.length === 0) {
    return [];
  }

  return [entityInput("attachToId", "target", "card", { min: 0, max: 1 }, attachTargets)];
}

function choiceAction(input: {
  stateVersion: number;
  id: string;
  intent: InteractionAction["intent"];
  inputs: InteractionInput[];
  enabled?: boolean;
  disabledText?: InteractionAction["disabledText"];
  source?: InteractionAction["source"];
  textParams?: InteractionAction["text"]["params"];
}): InteractionAction {
  return {
    id: input.id,
    requestId: requestId(input.stateVersion, input.id),
    intent: input.intent,
    text: {
      key: `cyberpunk.move.${input.id}`,
      ...(input.textParams === undefined ? {} : { params: input.textParams }),
    },
    enabled: input.enabled ?? true,
    disabledText: input.disabledText,
    ...(input.source === undefined ? {} : { source: input.source }),
    inputs: input.inputs,
  };
}

function adjustGigValueBounds(choice: Extract<ChoicePrompt, { type: "chooseTarget" }>): {
  min?: number;
  max?: number;
} {
  const current = choice.payload.currentValue;
  const maxFace = choice.payload.maxFaceValue;
  const maxAmount = Math.max(0, choice.payload.maxAmount ?? 0);
  if (current === undefined || maxFace === undefined) {
    return { min: 1, max: maxFace };
  }
  const lower = Math.max(1, current - maxAmount);
  const upper = Math.min(maxFace, current + maxAmount);
  switch (choice.payload.direction) {
    case "increase":
      return { min: current + 1, max: upper };
    case "decrease":
      return { min: lower, max: current - 1 };
    default:
      return { min: lower, max: upper };
  }
}

function entityInput(
  id: string,
  role: InteractionInput extends infer T
    ? T extends { kind: "entity-selection"; role: infer R }
      ? R
      : never
    : never,
  kind: EntityCandidate["entity"]["kind"],
  limit: { min: number; max: number },
  ids: readonly string[],
  options: { ordered?: boolean } = {},
): InteractionInput {
  return {
    kind: "entity-selection",
    id,
    text: { key: `cyberpunk.input.${id}` },
    required: limit.min > 0,
    role,
    entityKinds: [kind],
    min: limit.min,
    max: limit.max,
    ordered: options.ordered ?? false,
    candidates: ids.map((instanceId) => ({ entity: { kind, instanceId }, enabled: true })),
  };
}

function entityInputFromCandidates(
  id: string,
  role: InteractionInput extends infer T
    ? T extends { kind: "entity-selection"; role: infer R }
      ? R
      : never
    : never,
  kind: EntityCandidate["entity"]["kind"],
  limit: { min: number; max: number },
  candidates: readonly EntityCandidate[],
  options: { ordered?: boolean } = {},
): InteractionInput {
  return {
    kind: "entity-selection",
    id,
    text: { key: `cyberpunk.input.${id}` },
    required: limit.min > 0,
    role,
    entityKinds: [kind],
    min: limit.min,
    max: limit.max,
    ordered: options.ordered ?? false,
    candidates: [...candidates],
  };
}

function isOrderedGigCopyChoice(choice: Extract<ChoicePrompt, { type: "chooseTarget" }>): boolean {
  if (choice.payload.targetKind !== "gig") {
    return false;
  }
  const min = choice.payload.min ?? 1;
  const max = choice.payload.max ?? min;
  const text = choice.payload.source?.rulesText?.toLowerCase() ?? "";
  return (
    min === 2 &&
    max === 2 &&
    (choice.payload.source?.displayName === "Peace Offering" ||
      text.includes("value of another gig"))
  );
}

function bounds(min: number | undefined, max: number | undefined): { min: number; max: number } {
  return { min: min ?? 1, max: max ?? min ?? 1 };
}

function boundsForSearch(choice: Extract<ChoicePrompt, { type: "searchDeck" }>): {
  min: number;
  max: number;
} {
  const select = choice.payload.select;
  switch (select.kind) {
    case "all":
      return {
        min: choice.payload.revealedCardIds.length,
        max: choice.payload.revealedCardIds.length,
      };
    case "exact":
      return { min: select.amount, max: select.amount };
    case "upTo":
      return { min: 0, max: select.max };
  }
}

function searchCardMatchesTarget(
  card: Extract<ChoicePrompt, { type: "searchDeck" }>["payload"]["revealedCards"][number],
  target: Extract<ChoicePrompt, { type: "searchDeck" }>["payload"]["target"],
): boolean {
  return (
    (!target?.cardTypes || (card.type !== null && target.cardTypes.includes(card.type))) &&
    (!target?.classifications ||
      target.classifications.some((classification) =>
        card.classifications.includes(classification),
      )) &&
    (target?.maxCost === undefined || (card.cost !== null && card.cost <= target.maxCost)) &&
    (target?.minPower === undefined || card.effectivePower >= target.minPower) &&
    (target?.maxPower === undefined || card.effectivePower <= target.maxPower)
  );
}

function intentForMove(moveId: string): InteractionAction["intent"] {
  if (moveId === "playCard" || moveId === "resolveCardToPlay") return "play-card";
  if (moveId === "attackUnit" || moveId === "attackRival" || moveId === "resolveAttack")
    return "attack";
  if (moveId === "activateAbility") return "activate";
  if (moveId === "passPhase") return "pass";
  if (moveId === "concede") return "concede";
  if (moveId === "mulligan") return "mulligan";
  if (moveId.startsWith("resolve")) return "choose-option";
  return "custom";
}

function inputIdForSelectCardMove(moveId: string): string {
  if (moveId === "attackRival") return "attackerId";
  if (moveId === "useBlocker") return "blockerId";
  return "cardId";
}

function roleForMove(moveId: string): "source" | "attacker" | "defender" {
  if (moveId === "attackRival") return "attacker";
  if (moveId === "useBlocker") return "defender";
  return "source";
}

function requestId(stateVersion: number, id: string): string {
  return `cyberpunk:${stateVersion}:${id}`;
}

function requireString(submission: InteractionSubmission, key: string): string {
  const value = submission.values[key];
  if (typeof value !== "string") throw new Error(`Interaction value "${key}" must be a string.`);
  return value;
}

function optionalString(submission: InteractionSubmission, key: string): string | undefined {
  const value = submission.values[key];
  return typeof value === "string" ? value : undefined;
}

function requireNumber(submission: InteractionSubmission, key: string): number {
  const value = submission.values[key];
  if (typeof value !== "number") throw new Error(`Interaction value "${key}" must be a number.`);
  return value;
}

function optionalBoolean(submission: InteractionSubmission, key: string): boolean | undefined {
  const value = submission.values[key];
  return typeof value === "boolean" ? value : undefined;
}

function optionalStringArray(submission: InteractionSubmission, key: string): string[] | undefined {
  const value = submission.values[key];
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Interaction value "${key}" must be a string array.`);
  }
  return value;
}

function requireStringArray(submission: InteractionSubmission, key: string): string[] {
  const value = submission.values[key];
  if (!Array.isArray(value)) {
    throw new Error(`Interaction value "${key}" must be a string array; received ${typeof value}.`);
  }
  const invalidIndex = value.findIndex((item) => typeof item !== "string");
  if (invalidIndex >= 0) {
    throw new Error(
      `Interaction value "${key}" must be a string array; element at index ${invalidIndex} is ${typeof value[invalidIndex]}.`,
    );
  }
  return value;
}

function withOptional<T extends NativePayload>(
  payload: T,
  key: string,
  value: string | undefined,
): NativePayload {
  if (value === undefined) return payload;
  return { ...payload, [key]: value };
}
