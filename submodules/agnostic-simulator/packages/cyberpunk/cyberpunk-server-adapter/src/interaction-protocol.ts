import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type EntityCandidate,
  type InteractionAction,
  type InteractionInput,
  type InteractionResolutionContext,
  type InteractionSubmission,
} from "@tcg/protocol";
import {
  defOf,
  legendCanPayEddie,
  type AvailableMove,
  type ChoicePrompt,
  type MatchState,
  type PlayerPrompt,
} from "@tcg/cyberpunk-engine";

type NativePayload = Record<string, unknown>;

export function buildCyberpunkInteractionView(input: {
  actorId: string;
  stateVersion: number;
  prompt: PlayerPrompt;
  state?: MatchState;
}): EngineInteractionView {
  const actions =
    input.prompt.choice === null
      ? actionsFromAvailableMoves(input.prompt, input.stateVersion, input.state, input.actorId)
      : [actionFromChoice(input.prompt.choice, input.stateVersion)];

  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "cyberpunk",
    actorId: input.actorId,
    stateVersion: input.stateVersion,
    status: mapStatus(input.prompt.status),
    resolution: cyberpunkResolutionContext(input, actions),
    actions,
  };
}

function cyberpunkResolutionContext(
  input: {
    actorId: string;
    prompt: PlayerPrompt;
    state?: MatchState;
  },
  actions: readonly InteractionAction[],
): InteractionResolutionContext | undefined {
  const turnMetadata = input.state?.G?.turnMetadata;
  const publicChoice = turnMetadata?.pendingChoice;
  const choice = input.prompt.choice ?? publicChoice;
  if (!choice) return undefined;

  // When this prompt carries its own choice, actions[0] is that choice's
  // action and may describe the decision step. When narrating someone else's
  // pending choice, this view's `actions` hold only idle moves (concede,
  // undo) that must never describe the chooser's decision.
  const narratingOwnChoice = input.prompt.choice !== null;
  const action = narratingOwnChoice ? actions[0] : undefined;
  const queueLength = turnMetadata?.triggerQueue?.length ?? 0;
  const hasCurrentTrigger = turnMetadata?.currentTrigger ? 1 : 0;
  const choiceOptionCount = choice.type === "chooseTrigger" ? choice.payload.options.length : 1;
  const pendingCount = Math.max(1, queueLength + hasCurrentTrigger, choiceOptionCount);
  const actingPlayerId = String(choice.chooserId);
  const source = cyberpunkChoiceSource(choice, input.state);
  const requirement = action ? cyberpunkRequirement(action.inputs[0]) : undefined;

  return {
    actingPlayerId,
    pendingCount,
    currentEffect: {
      id:
        ("effectId" in choice && typeof choice.effectId === "string" && choice.effectId) ||
        `${choice.type}:${actingPlayerId}`,
      text: {
        key: "cyberpunk.effect.current",
        params: {
          label: narratingOwnChoice
            ? (source?.label ?? "Effect")
            : input.actorId === "__public_spectator__"
              ? "Waiting for player"
              : "Waiting for opponent",
        },
      },
      ...(input.prompt.choice && source?.instanceId
        ? {
            source: {
              kind: "card" as const,
              instanceId: source.instanceId,
            },
          }
        : {}),
    },
    currentStep: {
      index: 1,
      count: pendingCount,
      text: action
        ? action.text
        : narratingOwnChoice
          ? { key: `cyberpunk.choice.${choice.type}` }
          : spectatorStepText(choice),
      ...(requirement ? { requirement } : {}),
    },
  };
}

function spectatorStepText(
  choice: ChoicePrompt | NonNullable<MatchState["G"]["turnMetadata"]["pendingChoice"]>,
): InteractionAction["text"] {
  return { key: "cyberpunk.choice.spectator", params: { label: spectatorStepLabel(choice) } };
}

function spectatorStepLabel(
  choice: ChoicePrompt | NonNullable<MatchState["G"]["turnMetadata"]["pendingChoice"]>,
): string {
  switch (choice.type) {
    case "scry":
      return "Arranging revealed cards";
    case "revealDestination":
      return "Choosing a reveal destination";
    case "chooseTarget":
      return "Choosing targets";
    case "chooseEffect":
      return "Choosing an effect";
    case "chooseTrigger":
      return "Resolving a triggered ability";
    case "chooseGigsToSteal":
      return "Choosing gigs to steal";
    case "preventGigSteal":
      return "Choosing gig-steal prevention";
    case "chooseCardToPlay":
      return "Choosing a card to play";
    case "chooseCardToMove":
      return "Choosing where to move a card";
    case "chooseCardType":
      return "Choosing a card type";
    case "gainGig":
      return "Taking a Gig";
    case "redirectDefeat":
      return "Choosing a replacement";
    case "chooseSacrificialGear":
      return "Choosing gear to sacrifice";
    case "chooseFirstPlayer":
      return "Choosing the first player";
    default: {
      const exhaustive: never = choice;
      return exhaustive;
    }
  }
}

function cyberpunkChoiceSource(
  choice: ChoicePrompt | NonNullable<MatchState["G"]["turnMetadata"]["pendingChoice"]>,
  state: MatchState | undefined,
): { label: string; instanceId?: string } | undefined {
  if (choice.type === "chooseTrigger") {
    const option = choice.payload.options[0];
    return option
      ? { label: `${option.cardName} — ${option.abilityText}`, instanceId: option.sourceCardId }
      : undefined;
  }

  const payload = choice.payload as {
    source?: { cardId?: string; displayName?: string };
    sourceCardId?: string;
  };
  const instanceId = payload.source?.cardId ?? payload.sourceCardId;
  if (payload.source?.displayName) return { label: payload.source.displayName, instanceId };
  const card = instanceId ? state?.G?.cardIndex?.[instanceId] : undefined;
  return card ? { label: defOf(card).displayName, instanceId } : undefined;
}

function cyberpunkRequirement(
  input: InteractionInput | undefined,
): InteractionResolutionContext["currentStep"]["requirement"] {
  if (!input) return undefined;
  const required =
    input.required === true || ("min" in input && typeof input.min === "number" && input.min > 0);
  if (input.kind === "entity-selection" || input.kind === "option-selection") {
    return {
      kind: input.kind,
      text: input.text,
      required,
      min: input.min,
      max: input.max,
    };
  }
  if (input.kind === "ordering") {
    return {
      kind: input.kind,
      text: input.text,
      required,
      min: input.min,
      max: input.max,
    };
  }
  return { kind: input.kind, text: input.text, required };
}

const MUST_ATTACK_PASS_DISABLED_TEXT = {
  key: "cyberpunk.move.passPhase.disabled.mustAttack",
  params: { label: "A Unit must attack before you can pass." },
} as const satisfies InteractionAction["disabledText"];

// Always-available moves have no engine-defined display text; without an
// explicit label their protocol key would surface verbatim in shared UI.
const CONCEDE_ACTION_LABEL = "Concede the match";

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
        payload: withOptional(
          withOptional({ cardId }, "attachToId", attachToId),
          "paymentSourceIds",
          optionalStringArray(submission, "paymentSourceIds"),
        ),
      };
    }
    case "sellCard":
    case "goSolo":
      return {
        moveType: submission.actionId,
        payload: withOptional(
          { cardId: requireString(submission, "cardId") },
          "paymentSourceIds",
          optionalStringArray(submission, "paymentSourceIds"),
        ),
      };
    case "resolveCardToPlay": {
      const cardId = optionalString(submission, "cardId");
      const pass = optionalBoolean(submission, "pass") ?? cardId === undefined;
      if (pass) {
        return { moveType: submission.actionId, payload: { pass: true } };
      }
      const attachToId = optionalString(submission, "attachToId");
      return {
        moveType: submission.actionId,
        payload: withOptional(
          { cardId: requireString(submission, "cardId") },
          "attachToId",
          attachToId,
        ),
      };
    }
    case "resolveChooseEffect":
      return {
        moveType: submission.actionId,
        payload: { optionId: requireString(submission, "optionId") },
      };
    case "callLegend":
      return {
        moveType: submission.actionId,
        payload: withOptional(
          { legendId: requireString(submission, "cardId") },
          "paymentSourceIds",
          optionalStringArray(submission, "paymentSourceIds"),
        ),
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
          abilityIndex: requireAbilityIndex(submission),
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
    case "resolveScry":
      return {
        moveType: submission.actionId,
        payload: { destinations: requireScryDestinations(submission) },
      };
    case "resolveRevealDestination":
      return {
        moveType: submission.actionId,
        payload: { destination: requireString(submission, "destination") },
      };
    case "resolveTrigger": {
      const triggerId = optionalString(submission, "triggerId");
      const pass = optionalBoolean(submission, "pass") ?? triggerId === undefined;
      return {
        moveType: submission.actionId,
        payload: withOptional({ pass }, "triggerId", triggerId),
      };
    }
    case "resolveAdjustGig": {
      const pass = optionalBoolean(submission, "pass") ?? false;
      return {
        moveType: submission.actionId,
        payload: pass
          ? { kind: "noAdjustment" }
          : {
              kind: "adjust",
              dieId: requireString(submission, "dieId"),
              value: requireNumber(submission, "value"),
            },
      };
    }
    case "resolveCardTypeChoice":
      return {
        moveType: submission.actionId,
        payload: { cardType: requireString(submission, "cardType") },
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
    case "resolveRedirectDefeat": {
      const pass = optionalBoolean(submission, "pass") ?? false;
      return {
        moveType: submission.actionId,
        payload: { pass },
      };
    }
    case "resolveSacrificialGear":
      return {
        moveType: submission.actionId,
        payload: { cardId: requireString(submission, "cardId") },
      };
    case "resolveFirstPlayer":
      return {
        moveType: submission.actionId,
        payload: { goFirst: optionalBoolean(submission, "goFirst") ?? true },
      };
    case "resolvePreventGigSteal": {
      const pass = optionalBoolean(submission, "pass") ?? false;
      const dieIds = optionalStringArray(submission, "dieIds") ?? [];
      const cardIds = optionalStringArray(submission, "cardIds") ?? [];
      if (dieIds.length !== cardIds.length) {
        throw new Error('Interaction values "dieIds" and "cardIds" must have matching lengths.');
      }
      return {
        moveType: submission.actionId,
        payload: {
          pass,
          preventions: dieIds.map((dieId, index) => ({ dieId, cardId: cardIds[index]! })),
        },
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

function actionFromAvailableMove(
  move: AvailableMove,
  stateVersion: number,
  state: MatchState | undefined,
  actorId: string,
): InteractionAction {
  return {
    id: move.moveId,
    requestId: requestId(stateVersion, move.moveId),
    intent: intentForMove(move.moveId),
    text:
      move.moveId === "concede"
        ? {
            key: `cyberpunk.move.${move.moveId}`,
            params: { label: CONCEDE_ACTION_LABEL },
          }
        : { key: `cyberpunk.move.${move.moveId}` },
    enabled: inputSpecIsActionable(move),
    inputs: inputsForMove(move, state, actorId),
  };
}

function actionsFromAvailableMoves(
  prompt: PlayerPrompt,
  stateVersion: number,
  state: MatchState | undefined,
  actorId: string,
): InteractionAction[] {
  const actions = prompt.availableMoves.map((move) =>
    actionFromAvailableMove(move, stateVersion, state, actorId),
  );
  if (shouldExposeMustAttackBlockedPass(prompt)) {
    actions.push({
      id: "passPhase",
      requestId: requestId(stateVersion, "passPhase"),
      intent: "pass",
      text: { key: "cyberpunk.move.passPhase" },
      enabled: false,
      disabledText: MUST_ATTACK_PASS_DISABLED_TEXT,
      inputs: [],
    });
  }
  return actions;
}

function shouldExposeMustAttackBlockedPass(prompt: PlayerPrompt): boolean {
  if (prompt.status !== "action" || prompt.choice !== null) return false;

  const moveIds = new Set(prompt.availableMoves.map((move) => move.moveId));
  if (moveIds.has("passPhase")) return false;
  if (moveIds.has("resolveAttack") || moveIds.has("useBlocker")) return false;

  return moveIds.has("attackRival") || moveIds.has("attackUnit");
}

function actionFromChoice(choice: ChoicePrompt, stateVersion: number): InteractionAction {
  switch (choice.type) {
    case "scry": {
      const destination =
        choice.payload.destinations.find((entry) => !entry.remainder) ??
        choice.payload.destinations[0];
      const remainder = choice.payload.destinations.find((entry) => entry.remainder);
      const eligibilityLabel = scryEligibilityLabel(destination?.target ?? null);
      const revealedCardCandidates = choice.payload.revealedCards.map((card) => {
        const enabled = scryCardMatchesTarget(card, destination?.target ?? null);
        return {
          entity: { kind: "card" as const, instanceId: card.instanceId },
          enabled,
          ...(enabled
            ? {}
            : {
                disabledText: {
                  key: "cyberpunk.choice.scry.ineligible",
                  params: { label: `Needs ${eligibilityLabel}` },
                },
              }),
        };
      });
      const eligibleCount = revealedCardCandidates.filter((candidate) => candidate.enabled).length;
      return choiceAction({
        stateVersion,
        id: "resolveScry",
        intent: "order-cards",
        textParams: {
          lookCount: choice.payload.amount,
          canSkip: (destination?.min ?? 0) === 0,
          eligibleCount,
          destinationZone: destination?.zone ?? "hand",
          destinationReveal: destination?.reveal === true,
          eligibilityLabel,
          remainderZone: remainder?.zone ?? "deckBottom",
          remainderOrder: remainder?.order ?? "original",
          ...(scrySelectionLimitLabel(destination?.selectionLimitContext) === undefined
            ? {}
            : {
                selectionLimitLabel: scrySelectionLimitLabel(destination?.selectionLimitContext)!,
              }),
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
          {
            kind: "option-selection",
            id: "destinationZone",
            text: { key: "cyberpunk.choice.scry.destination" },
            min: 0,
            max: 1,
            options: [
              {
                id: destination?.zone ?? "hand",
                text: {
                  key: "cyberpunk.choice.scry.destinationZone",
                  params: { destinationZone: destination?.zone ?? "hand" },
                },
                enabled: true,
              },
            ],
          },
          entityInputFromCandidates(
            "selectedCardIds",
            "source",
            "card",
            boundsForScryDestination(destination),
            revealedCardCandidates,
          ),
        ],
      });
    }
    case "revealDestination":
      return choiceAction({
        stateVersion,
        id: "resolveRevealDestination",
        intent: "choose-option",
        textParams: {
          destinationOwnerId: choice.payload.player,
          revealedCount: choice.payload.revealedCards.length,
          revealedCardIds: choice.payload.revealedCards.map((card) => card.instanceId).join(","),
          drawAmount: choice.payload.drawIfDestination?.amount ?? 0,
          drawDestination: choice.payload.drawIfDestination?.destination ?? "",
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
          {
            kind: "option-selection",
            id: "destination",
            text: { key: "cyberpunk.choice.revealDestination.destination" },
            min: 1,
            max: 1,
            options: choice.payload.destinations.map((destination) => ({
              id: destination,
              text: {
                key: `cyberpunk.choice.revealDestination.${destination}`,
                params: { destination },
              },
              enabled: true,
            })),
          },
        ],
      });
    case "chooseTarget": {
      if (
        choice.payload.type === "adjustGig" ||
        (choice.payload.type === "effectTarget" && choice.payload.adjustGig)
      ) {
        return atomicAdjustGigAction(choice, stateVersion);
      }
      const ids = choice.payload.eligibleIds ?? [];
      const inputId = choice.payload.type === "discardFromHand" ? "cardIds" : "targetIds";
      const actionId =
        choice.payload.type === "discardFromHand"
          ? "resolveDiscardFromHand"
          : "resolveEffectTarget";
      // Preserve the effect source for every target-style prompt, including
      // discard choices, so players can see what caused the decision.
      const source = choice.payload.source;
      const inputBounds =
        choice.payload.type === "discardFromHand"
          ? bounds(choice.payload.amount, choice.payload.amount)
          : bounds(choice.payload.min, choice.payload.max);
      // Mirror the engine's resolveEffectTarget pass rule (canDecline, a min of
      // 0, or a declining play-card purpose). A min-0 "SELECT TARGET (0-1)"
      // choice without this derivation would advertise no pass affordance at
      // all and become mandatory-in-practice for protocol consumers.
      const canDecline =
        choice.payload.canDecline === true ||
        (choice.payload.type === "effectTarget" && (choice.payload.min ?? 1) === 0) ||
        (choice.payload.type === "effectTarget" && choice.payload.targetPurpose === "playCard");
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
          ...(choice.payload.targetPurpose ? { targetPurpose: choice.payload.targetPurpose } : {}),
          ...(typeof choice.payload.availableEddiesAfterCosts === "number"
            ? { availableEddiesAfterCosts: choice.payload.availableEddiesAfterCosts }
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
          entityInputFromCandidates(
            inputId,
            "target",
            choice.payload.targetKind === "gig" ? "die" : "card",
            canDecline ? { ...inputBounds, min: 0 } : inputBounds,
            playCardTargetCandidates(choice.payload, ids, choice.payload.targetKind === "gig"),
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
                params: {
                  abilityText: option.abilityText,
                  cardName: option.cardName,
                  sourceCardId: option.sourceCardId,
                  optional: option.optional === true,
                  containsOptionalEffect: option.containsOptionalEffect === true,
                  ...(option.context?.kind === "gigRoll"
                    ? {
                        rollDieId: option.context.dieId,
                        rollDieType: option.context.dieType,
                        rollResult: option.context.result,
                        rollOrigin: option.context.origin,
                      }
                    : {}),
                },
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
    case "chooseCardToPlay": {
      const canDecline = choice.payload.canDecline === true;
      return choiceAction({
        stateVersion,
        id: "resolveCardToPlay",
        intent: "play-card",
        textParams: { canDecline },
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
    case "chooseCardType":
      return choiceAction({
        stateVersion,
        id: "resolveCardTypeChoice",
        intent: "choose-option",
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
            }
          : undefined,
        inputs: [
          {
            kind: "option-selection",
            id: "cardType",
            text: { key: "cyberpunk.choice.chooseCardType" },
            required: true,
            min: 1,
            max: 1,
            options: choice.payload.cardTypes.map((cardType) => ({
              id: cardType,
              text: {
                key: `cyberpunk.cardType.${cardType}`,
                params: { label: cardTypeLabel(cardType) },
              },
              enabled: true,
            })),
          },
        ],
      });
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
        id: "resolveChooseEffect",
        intent: "choose-option",
        inputs: [
          {
            kind: "option-selection",
            id: "optionId",
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
    case "redirectDefeat":
      return choiceAction({
        stateVersion,
        id: "resolveRedirectDefeat",
        intent: "choose-option",
        textParams: {
          protectedCardId: choice.payload.protectedCardId,
          replacementCardId: choice.payload.replacementCardId,
          cost: choice.payload.cost,
          ...(choice.payload.source
            ? {
                sourceCardId: choice.payload.source.cardId,
                sourceDisplayName: choice.payload.source.displayName,
                sourceRulesText: choice.payload.source.rulesText ?? "",
              }
            : {}),
        },
        source: {
          kind: "card",
          instanceId: choice.payload.replacementCardId,
        },
        inputs: [
          booleanInput(
            "pass",
            { key: "cyberpunk.input.pass" },
            { key: "cyberpunk.input.pass.true" },
            { key: "cyberpunk.input.pass.false" },
          ),
        ],
      });
    case "chooseSacrificialGear":
      return choiceAction({
        stateVersion,
        id: "resolveSacrificialGear",
        intent: "choose-targets",
        textParams: {
          hostId: choice.payload.hostId,
          ...(choice.payload.source
            ? {
                sourceCardId: choice.payload.source.cardId,
                sourceDisplayName: choice.payload.source.displayName,
                sourceRulesText: choice.payload.source.rulesText ?? "",
              }
            : {}),
        },
        source: {
          kind: "card",
          instanceId: choice.payload.hostId,
        },
        inputs: [
          entityInput("cardId", "source", "card", { min: 1, max: 1 }, choice.payload.gearIds),
        ],
      });
    case "preventGigSteal":
      return choiceAction({
        stateVersion,
        id: "resolvePreventGigSteal",
        intent: "custom",
        inputs: [
          entityInput(
            "dieIds",
            "target",
            "die",
            { min: 0, max: choice.payload.stealEntries.length },
            choice.payload.stealEntries.map((entry) => entry.dieId),
          ),
          entityInput(
            "cardIds",
            "source",
            "card",
            { min: 0, max: choice.payload.handEntries.length },
            choice.payload.handEntries.map((entry) => entry.cardId),
          ),
          booleanInput(
            "pass",
            { key: "cyberpunk.input.pass" },
            { key: "cyberpunk.input.pass.true" },
            { key: "cyberpunk.input.pass.false" },
          ),
        ],
      });
    case "chooseFirstPlayer":
      return choiceAction({
        stateVersion,
        id: "resolveFirstPlayer",
        intent: "choose-option",
        inputs: [
          booleanInput(
            "goFirst",
            { key: "cyberpunk.input.goFirst" },
            { key: "cyberpunk.input.goFirst.true" },
            { key: "cyberpunk.input.goFirst.false" },
          ),
        ],
      });
  }
}

function cardTypeLabel(cardType: string): string {
  switch (cardType) {
    case "gear":
      return "Gear";
    case "legend":
      return "Legend";
    case "program":
      return "Program";
    case "unit":
      return "Unit";
    default:
      return cardType;
  }
}

function inputsForMove(
  move: AvailableMove,
  state: MatchState | undefined,
  actorId: string,
): InteractionInput[] {
  switch (move.inputSpec.type) {
    case "none":
      if (move.moveId === "resolveAttack") {
        return [
          booleanInput(
            "pass",
            { key: "cyberpunk.input.pass" },
            { key: "cyberpunk.input.pass.true" },
            { key: "cyberpunk.input.pass.false" },
          ),
        ];
      }
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
        ...paymentSourceInput(move.moveId, state, actorId),
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
        ...paymentSourceInput(move.moveId, state, actorId),
      ];
  }
}

function paymentSourceInput(
  moveId: AvailableMove["moveId"],
  state: MatchState | undefined,
  actorId: string,
): InteractionInput[] {
  if (moveId !== "playCard" && moveId !== "callLegend" && moveId !== "goSolo") return [];
  const player = state?.G.players[actorId];
  if (!state || !player) return [];
  const ids = [...player.eddieCardIds, ...player.zones.legendArea].filter((id) => {
    const card = state.G.cardIndex[id as string];
    return Boolean(
      card &&
      !card.meta.spent &&
      (card.zone === "eddieArea" || (card.zone === "legendArea" && legendCanPayEddie(card))),
    );
  });
  return [entityInput("paymentSourceIds", "cost", "card", { min: 0, max: ids.length }, ids)];
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

function atomicAdjustGigAction(
  choice: Extract<ChoicePrompt, { type: "chooseTarget" }>,
  stateVersion: number,
): InteractionAction {
  const fixed = choice.payload.type === "adjustGig";
  const adjustment = fixed ? choice.payload : choice.payload.adjustGig!;
  const dieIds = fixed
    ? choice.payload.dieId
      ? [choice.payload.dieId]
      : []
    : (choice.payload.eligibleIds ?? []);
  const canDecline = fixed
    ? adjustment.chooseUpTo === true
    : choice.payload.canDecline === true ||
      (choice.payload.min ?? 1) === 0 ||
      adjustment.chooseUpTo === true;
  const bounds = fixed ? adjustGigValueBounds(choice) : {};
  const source = choice.payload.source;

  return choiceAction({
    stateVersion,
    id: "resolveAdjustGig",
    intent: "custom",
    textParams: {
      adjustGigMaxAmount: adjustment.maxAmount ?? 0,
      adjustGigDirection: adjustment.direction ?? "either",
      adjustGigChooseUpTo: adjustment.chooseUpTo === true,
      canDecline,
      ...(source
        ? {
            sourceCardId: source.cardId,
            sourceDisplayName: source.displayName,
            sourceRulesText: source.rulesText ?? "",
          }
        : {}),
    },
    source: source
      ? { kind: "card", instanceId: source.cardId }
      : choice.payload.dieId
        ? {
            kind: "die",
            instanceId: choice.payload.dieId,
            ...(choice.payload.dieOwnerId ? { ownerId: choice.payload.dieOwnerId } : {}),
          }
        : undefined,
    inputs: [
      entityInput("dieId", "target", "die", { min: canDecline ? 0 : 1, max: 1 }, dieIds),
      {
        kind: "number",
        id: "value",
        text: { key: "cyberpunk.choice.adjustGig.value" },
        required: false,
        ...bounds,
      },
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
  const canKeepCurrentValue = choice.payload.chooseUpTo === true;
  switch (choice.payload.direction) {
    case "increase":
      return { min: canKeepCurrentValue ? current : current + 1, max: upper };
    case "decrease":
      return { min: lower, max: canKeepCurrentValue ? current : current - 1 };
    default:
      return { min: lower, max: upper };
  }
}

function playCardTargetCandidates(
  payload: {
    targetPurpose?: string;
    availableEddiesAfterCosts?: number;
    effectiveCostsByCardId?: Record<string, number>;
  },
  ids: readonly string[],
  isDie: boolean,
): EntityCandidate[] {
  const remaining = payload.availableEddiesAfterCosts;
  const costs = payload.effectiveCostsByCardId;
  return ids.map((instanceId) => {
    const cost = costs?.[instanceId];
    const unaffordable =
      payload.targetPurpose === "playCard" &&
      typeof cost === "number" &&
      typeof remaining === "number" &&
      cost > remaining;
    return {
      entity: { kind: isDie ? ("die" as const) : ("card" as const), instanceId },
      enabled: !unaffordable,
      ...(unaffordable
        ? {
            disabledText: {
              key: "cyberpunk.target.insufficientEddies",
              params: { cost, available: remaining },
            },
          }
        : {}),
    };
  });
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

function booleanInput(
  id: string,
  text: InteractionAction["text"],
  trueText: InteractionAction["text"],
  falseText: InteractionAction["text"],
): InteractionInput {
  return {
    kind: "boolean",
    id,
    text,
    required: false,
    trueText,
    falseText,
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

function boundsForScryDestination(
  destination:
    | Extract<ChoicePrompt, { type: "scry" }>["payload"]["destinations"][number]
    | undefined,
): {
  min: number;
  max: number;
} {
  return { min: destination?.min ?? 0, max: destination?.max ?? Number.MAX_SAFE_INTEGER };
}

function scryCardMatchesTarget(
  card: Extract<ChoicePrompt, { type: "scry" }>["payload"]["revealedCards"][number],
  target: Extract<ChoicePrompt, { type: "scry" }>["payload"]["destinations"][number]["target"],
): boolean {
  return (
    (!target?.cardTypes || (card.type !== null && target.cardTypes.includes(card.type))) &&
    (!target?.classifications ||
      target.classifications.some((classification) =>
        card.classifications.includes(classification),
      )) &&
    (target?.minCost === undefined || (card.cost !== null && card.cost >= target.minCost)) &&
    (target?.maxCost === undefined || (card.cost !== null && card.cost <= target.maxCost)) &&
    (!target?.allowedCosts || (card.cost !== null && target.allowedCosts.includes(card.cost))) &&
    (target?.minPower === undefined || card.effectivePower >= target.minPower) &&
    (target?.maxPower === undefined || card.effectivePower <= target.maxPower)
  );
}

function scryEligibilityLabel(
  target: Extract<ChoicePrompt, { type: "scry" }>["payload"]["destinations"][number]["target"],
): string {
  if (!target) return "any card";

  const parts: string[] = [];
  if (target.cardTypes?.length) {
    parts.push(
      target.cardTypes
        .map((type) => `${type[0]?.toUpperCase() ?? ""}${type.slice(1)}`)
        .join(" or "),
    );
  }
  if (target.classifications?.length) {
    parts.push(target.classifications.join(" or "));
  }
  if (target.allowedCosts?.length) {
    parts.push(`cost matching a friendly Gig value (${target.allowedCosts.join(", ")})`);
  } else if (target.minCost !== undefined && target.maxCost !== undefined) {
    parts.push(`cost ${target.minCost}-${target.maxCost}`);
  } else if (target.maxCost !== undefined) {
    parts.push(`cost ${target.maxCost} or less`);
  } else if (target.minCost !== undefined) {
    parts.push(`cost ${target.minCost} or more`);
  }
  if (target.minPower !== undefined && target.maxPower !== undefined) {
    parts.push(`power ${target.minPower}-${target.maxPower}`);
  } else if (target.maxPower !== undefined) {
    parts.push(`power ${target.maxPower} or less`);
  } else if (target.minPower !== undefined) {
    parts.push(`power ${target.minPower} or more`);
  }
  return parts.length > 0 ? parts.join(" with ") : "any card";
}

function scrySelectionLimitLabel(
  context:
    | Extract<
        ChoicePrompt,
        { type: "scry" }
      >["payload"]["destinations"][number]["selectionLimitContext"]
    | undefined,
): string | undefined {
  if (!context) return undefined;
  if (
    context.countedTarget.selector === "gig" &&
    context.countedTarget.controller === "friendly" &&
    context.countedTarget.minValue === 1 &&
    context.countedTarget.maxValue === 1
  ) {
    return `${context.matchCount} friendly min Gig${context.matchCount === 1 ? "" : "s"} allow${
      context.matchCount === 1 ? "s" : ""
    } ${context.matchCount * context.multiplier} extra card${
      context.matchCount * context.multiplier === 1 ? "" : "s"
    }`;
  }
  return `${context.matchCount} matching target${context.matchCount === 1 ? "" : "s"} add ${
    context.matchCount * context.multiplier
  } to the limit`;
}

function requireScryDestinations(
  submission: InteractionSubmission,
): Array<{ zone: string; cardIds: string[] }> {
  const raw = submission.values.destinations;
  if (Array.isArray(raw)) {
    return raw.map((entry, index) => {
      if (!entry || typeof entry !== "object") {
        throw new Error(`Interaction value "destinations[${index}]" must be an object.`);
      }
      const destination = entry as { zone?: unknown; cardIds?: unknown };
      if (typeof destination.zone !== "string") {
        throw new Error(`Interaction value "destinations[${index}].zone" must be a string.`);
      }
      if (
        !Array.isArray(destination.cardIds) ||
        destination.cardIds.some((item) => typeof item !== "string")
      ) {
        throw new Error(
          `Interaction value "destinations[${index}].cardIds" must be a string array.`,
        );
      }
      return { zone: destination.zone, cardIds: destination.cardIds };
    });
  }
  return [
    {
      zone: optionalString(submission, "destinationZone") ?? "hand",
      cardIds: requireStringArray(submission, "selectedCardIds"),
    },
  ];
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

// abilityIndex is declared as an option-selection input whose option ids are
// String(index), so validated submissions always carry the string form.
function requireAbilityIndex(submission: InteractionSubmission): number {
  const value = submission.values["abilityIndex"];
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 0) return parsed;
  }
  throw new Error(`Interaction value "abilityIndex" must be a non-negative integer.`);
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
  // List-typed values arrive as arrays from modal flows and as a scalar when
  // the input allows a single pick (the shared panel submits `ids[0]` for
  // max-1 entity selections). Normalize the scalar to a one-element list.
  if (typeof value === "string") return [value];
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
  value: string | string[] | undefined,
): NativePayload {
  if (value === undefined) return payload;
  return { ...payload, [key]: value };
}
