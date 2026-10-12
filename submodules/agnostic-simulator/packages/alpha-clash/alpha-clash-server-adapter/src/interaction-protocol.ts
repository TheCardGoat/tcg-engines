import { costRouteInputs, costRoutePayload } from "./cost-routes";
import { cardDestination, destination } from "./card-destination";
import { paymentFromOptionIds } from "./resource-payment";
import { openingActionFor } from "./opening";
import { getCard } from "@tcg/alpha-clash-cards";
import type { AcCardDefinition, AcCardType, AcEffect, AcTarget } from "@tcg/alpha-clash-types";
import { deckOrderOptions, collectChosenSelectorEntries } from "@tcg/alpha-clash-engine";
import type { ProjectedState } from "@tcg/alpha-clash-engine";
import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type EntityCandidate,
  type EntityRef,
  type InteractionAction,
  type InteractionInput,
  type InteractionOption,
  type InteractionSubmission,
} from "@tcg/protocol";

type NativePayload = Record<string, unknown>;
type Seat = "player-one" | "player-two";
type TargetResolver = (target: AcTarget, sourceId: string) => readonly string[];

const IN_PLAY_ZONES: readonly string[] = ["contender", "clashground", "clash", "accessory"];

/**
 * Projects the engine's public pacing state into protocol interaction
 * actions. The engine stays the rules authority: every action translates
 * 1:1 into an `AcCommand`, and the engine rejects anything illegal at the
 * dispatch boundary.
 */
export function buildAlphaClashInteractionView(input: {
  actorId: string;
  seat: Seat;
  decisionSeat?: Seat;
  stateVersion: number;
  playerView: ProjectedState;
  /** Native engine resource eligibility, before presentation. */
  resourceCandidateIds?: readonly string[];
  resolveTargetCandidates?: TargetResolver;
  /** Native-validated targets for each attacker; declarations can have different legal sets. */
  clashTargets?: Readonly<Record<string, readonly string[]>>;
  obstructorSelection?: { candidateIds: readonly string[]; min: number };
}): EngineInteractionView {
  const { seat, playerView, stateVersion } = input;
  if (playerView.phase.name === "complete")
    return {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "alpha-clash",
      actorId: input.actorId,
      stateVersion,
      status: "game-over",
      actions: [],
    };
  if (playerView.pendingOrderingPlayer && playerView.pendingOrderingPlayer !== seat)
    return {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      gameSlug: "alpha-clash",
      actorId: input.actorId,
      stateVersion,
      status: "waiting",
      actions: [],
    };
  const other = seat === "player-one" ? "player-two" : "player-one";
  const actions: InteractionAction[] = [];
  const isActive = playerView.activePlayer === seat;
  const windowOpenForSeat = playerView.responseWindow?.openFor === seat;
  const phase = playerView.phase;
  const hasPendingChoice = Boolean(
    playerView.pendingChoicePlayerId || playerView.pendingChoices.length,
  );

  // 1. Pending choices (rule 608) always come first; the engine's
  //    guardCommand blocks everything else while one is open.
  for (const choice of playerView.pendingChoices) {
    if (choice.playerId !== seat) continue;
    const action = choiceAction(choice, stateVersion, playerView);
    const destination = retrievalDestination(choice, playerView);
    actions.push(destination ? { ...action, inputs: [...action.inputs, destination] } : action);
  }

  // 2. Setup: ordered declarations, private selections, then start (103.5).
  if (phase.name === "setup" && !hasPendingChoice) {
    const step = openingActionFor(playerView, seat);
    if (step === "declare") {
      actions.push(
        simpleAction("declareMulligan:keep", "activate", "Keep hand", stateVersion),
        simpleAction("declareMulligan:take", "activate", "Take mulligan", stateVersion),
      );
    }
    if (step === "select") {
      const input = handSelectionInput(playerView, seat, "cardIds", "Choose cards to replace");
      if (input?.kind === "entity-selection")
        actions.push({
          ...simpleAction("mulligan", "mulligan", "Replace selected cards", stateVersion),
          inputs: [{ ...input, min: 0, max: input.candidates.length, confirmBeforeSubmit: true }],
        });
    }
    if (step === "start")
      actions.push(simpleAction("startGame", "activate", "Begin game", stateVersion));
  }

  // 3. Expansion Phase, Resource Step (408.1): deploy one card or pass.
  if (phase.name === "expansion" && phase.step === "resource" && isActive && !hasPendingChoice) {
    const handInput = handSelectionInput(playerView, seat, "cardId", "Choose a card to deploy");
    if (handInput?.kind === "entity-selection") {
      const candidates = handInput.candidates.map((candidate) => ({
        ...candidate,
        enabled:
          input.resourceCandidateIds === undefined ||
          input.resourceCandidateIds.includes(candidate.entity.instanceId ?? ""),
      }));
      actions.push({
        id: "deployResource",
        requestId: requestId(stateVersion, "deployResource"),
        intent: "resource-card",
        text: { key: "Deploy a card to the Resource Zone" },
        enabled: candidates.some((candidate) => candidate.enabled),
        inputs: [{ ...handInput, candidates }],
      });
    }
    actions.push(simpleAction("passResource", "pass", "Skip the Resource Step", stateVersion));
  }

  // 4. Primary Phase (503): the main decision surface.
  if (phase.name === "primary" && isActive && !playerView.responseWindow && !hasPendingChoice) {
    actions.push(simpleAction("endTurn", "pass", "End turn", stateVersion));
    {
      actions.push(
        simpleAction(
          "activatePortal",
          "activate",
          playerView.portalOpen ? "Close the Portal" : "Open the Portal",
          stateVersion,
        ),
      );
    }
    const clashAction = initiateClashAction(
      playerView,
      seat,
      other,
      stateVersion,
      input.clashTargets,
    );
    if (clashAction) actions.push(clashAction);
    actions.push(
      ...handPlayActions(playerView, seat, stateVersion, {
        window: false,
        resolveTargets: input.resolveTargetCandidates,
      }),
    );
    actions.push(...accessoryActions(playerView, seat, stateVersion));
    actions.push(
      ...activatedAbilityActions(
        playerView,
        seat,
        stateVersion,
        false,
        input.resolveTargetCandidates,
      ),
    );
  }

  // 5. Response windows (114.3): respond with Counter-tagged cards or pass.
  if (windowOpenForSeat && !hasPendingChoice) {
    actions.push(simpleAction("passCounter", "pass", "Pass", stateVersion));
    actions.push(
      ...handPlayActions(playerView, seat, stateVersion, {
        window: true,
        resolveTargets: input.resolveTargetCandidates,
      }),
    );
    actions.push(
      ...activatedAbilityActions(
        playerView,
        seat,
        stateVersion,
        true,
        input.resolveTargetCandidates,
      ),
    );
  }

  // 6. Clash steps the defender owes a decision (504.2c).
  if (
    !hasPendingChoice &&
    phase.name === "clash" &&
    playerView.clash &&
    playerView.clash.step === "obstruct"
  ) {
    const defender = playerView.cards.find(
      (card) => card.instanceId === playerView.clash?.targetId,
    )?.controller;
    if (defender === seat) {
      const obstructors =
        input.obstructorSelection?.candidateIds.map(candidateRef) ??
        readyClashCandidates(playerView, seat).filter(
          (candidate) =>
            !playerView.cards.find((card) => card.instanceId === candidate.entity.instanceId)
              ?.distracted,
        );
      const minimum = input.obstructorSelection?.min ?? 0;
      actions.push({
        id: "declareObstructors",
        requestId: requestId(stateVersion, "declareObstructors"),
        intent: "choose-targets",
        text: { key: "Declare obstructors" },
        enabled: true,
        inputs: [
          {
            kind: "entity-selection",
            id: "obstructorIds",
            text: { key: "Choose ready Clash cards to obstruct" },
            required: minimum > 0,
            role: "defender",
            entityKinds: ["card"],
            min: minimum,
            max: obstructors.length,
            ordered: false,
            candidates: obstructors,
          },
        ],
      });
      actions.push(simpleAction("passObstruct", "pass", "Do not obstruct", stateVersion));
    }
  }

  // 7. Pass in clash buff/counter/pre-damage steps for the acting seat.
  if (
    phase.name === "clash" &&
    playerView.clash &&
    ["counter", "attackerBuff", "defenderBuff", "beforeDamage"].includes(playerView.clash.step) &&
    !hasPendingChoice
  ) {
    if (playerView.clash.step === "beforeDamage") {
      // Rule 504.2f (v8.0): the attacking player has priority for effects
      // before damage; both seats may pass and the engine validates the
      // order (damage only after the attacker has passed).
      if (!input.decisionSeat || input.decisionSeat === seat)
        actions.push(simpleAction("passClashStep", "pass", "Pass", stateVersion));
    } else {
      const stepSeat =
        playerView.clash.step === "attackerBuff"
          ? playerView.cards.find((card) => card.instanceId === playerView.clash?.attackerId)
              ?.controller
          : playerView.cards.find((card) => card.instanceId === playerView.clash?.targetId)
              ?.controller;
      if (stepSeat === seat) {
        actions.push(
          ...clashBuffActions(playerView, seat, stateVersion, input.resolveTargetCandidates),
        );
        actions.push(simpleAction("passClashStep", "pass", "Pass", stateVersion));
      }
    }
  }

  actions.push({
    id: "concede",
    requestId: requestId(stateVersion, "concede"),
    intent: "concede",
    text: { key: "Concede" },
    enabled: true,
    inputs: [
      {
        kind: "boolean",
        id: "confirm",
        text: { key: "Concede this game?" },
        required: true,
        trueText: { key: "Concede" },
        falseText: { key: "Cancel" },
      },
    ],
  });

  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "alpha-clash",
    actorId: input.actorId,
    stateVersion,
    status: statusFor(playerView, seat, input.decisionSeat),
    actions,
  };
}

export function alphaClashSubmissionToPayload(submission: InteractionSubmission): {
  moveType: string;
  payload: NativePayload;
} {
  const values = submission.values;
  const [moveType, ...args] = submission.actionId.split(":");

  const targetId = singleEntity(values.targetId);
  const xValue = typeof values.xValue === "number" ? values.xValue : undefined;
  const stringList = (key: string): string[] | undefined => {
    const value = values[key];
    if (typeof value === "string") return [value];
    if (Array.isArray(value)) return value.filter((id): id is string => typeof id === "string");
    return undefined;
  };

  switch (moveType) {
    case "resolveChoice": {
      const choiceId = args.join(":");
      const payload: NativePayload = { choiceId };
      if (values.deckOrder !== undefined) {
        payload.deckOrder = values.deckOrder;
      } else if (Array.isArray(values.order)) {
        payload.orderedIds = stringList("order");
      } else if (typeof values.confirm === "boolean") {
        payload.optionId = values.confirm ? "yes" : "no";
      } else if (
        typeof values.selection === "string" ||
        typeof values.selection === "number" ||
        typeof values.selection === "boolean"
      ) {
        payload.optionId = String(values.selection);
      } else if (Array.isArray(values.selection)) {
        payload.optionId = singleEntity(values.selection);
      } else if (typeof values.count === "number") {
        payload.optionId = String(values.count);
      } else if (values.allocation !== undefined) {
        payload.division = allocationDivision(values.allocation);
      }
      return { moveType, payload };
    }
    case "playCard":
    case "respond": {
      const payload: NativePayload = { cardId: args[0] ?? "", ...costRoutePayload(values) };
      if (targetId) payload.targetId = targetId;
      const targetIds = remainingTargets(values);
      if (targetIds) payload.targetIds = targetIds;
      if (xValue !== undefined) payload.xValue = xValue;
      if (typeof values.healthReduction === "number")
        payload.healthReduction = values.healthReduction;
      const paymentKey =
        typeof values.healthReduction === "number" && values.healthReduction > 0
          ? `healthResourcePayment:${values.healthReduction}`
          : "resourcePayment";
      const payment = paymentFromOptionIds(values[paymentKey]);
      if (payment) payload.resourcePayment = payment;
      const alternate = stringList("alternateCostCardIds");
      if (alternate && values.costRoute === undefined) payload.alternateCostCardIds = alternate;
      return { moveType, payload };
    }
    case "setCard":
      // Face-down Trap/Ambush set (304.7); mirrors playCard's hand-source arg.
      return { moveType, payload: { cardId: args[0] ?? "" } };
    case "activateAbility":
      return {
        moveType,
        payload: {
          cardId: args[0] ?? "",
          abilityIndex: Number.parseInt(args[1] ?? "0", 10) || 0,
          ...(targetId ? { targetId } : {}),
          ...(remainingTargets(values) ? { targetIds: remainingTargets(values) } : {}),
          ...(xValue !== undefined ? { xValue } : {}),
        },
      };
    case "attachWeapon":
      return { moveType, payload: { cardId: args[0] ?? "", targetId: targetId ?? "" } };
    case "detachWeapon":
      return { moveType, payload: { cardId: args[0] ?? "" } };
    case "initiateClash":
      return {
        moveType,
        payload: {
          attackerId: singleEntity(values.attackerId) ?? "",
          targetId:
            singleEntity(values[`targetId:${singleEntity(values.attackerId)}`]) ??
            singleEntity(values.targetId) ??
            "",
        },
      };
    case "declareObstructors":
      return { moveType, payload: { obstructorIds: stringList("obstructorIds") ?? [] } };
    case "deployResource":
      return { moveType, payload: { cardId: singleEntity(values.cardId) ?? "" } };
    case "concede": {
      if (values.confirm === false) {
        throw new Error("Concede was cancelled.");
      }
      return { moveType, payload: {} };
    }
    case "declareMulligan":
      return { moveType, payload: { take: args[0] === "take" } };
    case "mulligan":
      return { moveType, payload: { cardIds: stringList("cardIds") ?? [] } };
    case "startGame":
    case "activatePortal":
    case "pass":
    case "passResource":
    case "passCounter":
    case "passObstruct":
    case "passClashStep":
    case "endTurn":
      return { moveType: moveType.startsWith("pass") ? "pass" : moveType, payload: {} };
    default:
      throw new Error(`Unknown Alpha Clash action: ${submission.actionId}`);
  }
}

// ---------------------------------------------------------------------------
// Action builders
// ---------------------------------------------------------------------------

type PendingChoice = ProjectedState["pendingChoices"][number];

/** Fixed destinations come from native effects, never from UI guesses or card names. */
function retrievalDestination(
  choice: PendingChoice,
  view: ProjectedState,
): InteractionInput | undefined {
  const destinationOf = (effects: readonly AcEffect[]): string | undefined => {
    for (const effect of effects) {
      if (effect.type === "returnToHand") return "hand";
      if (effect.type === "tutor" && effect.controller === "friendly") {
        return effect.destination === "accessoryZone"
          ? "accessory"
          : effect.destination === "topOfDeck" || effect.destination === "bottomOfDeck"
            ? "deck"
            : effect.destination;
      }
    }
    return undefined;
  };
  let destination: string | undefined;
  let optionIds: string[] | undefined;
  if (choice.kind === "modal") {
    const selections = choice.options.flatMap((option) => {
      const selection = option.effects.find((effect) => effect.type === "selectCards");
      const id = selection?.selected?.at(-1);
      const card = view.cards.find((card) => card.instanceId === id);
      const to = selection && destinationOf(selection.then);
      // Multi-card selections must finish their native sequence before placement.
      return card &&
        card.owner === choice.playerId &&
        ["deck", "oblivion"].includes(card.zone) &&
        to &&
        selection?.max === 1
        ? [{ id: option.id, to }]
        : [];
    });
    if (selections.length && selections.every((entry) => entry.to === selections[0].to)) {
      destination = selections[0].to;
      optionIds = selections.map((entry) => entry.id);
    }
  } else if (
    choice.kind === "target" &&
    choice.candidates.length &&
    choice.candidates.every((id) =>
      view.cards.some(
        (card) =>
          card.instanceId === id &&
          card.owner === choice.playerId &&
          ["deck", "oblivion"].includes(card.zone),
      ),
    )
  )
    // The selected candidate belongs to the first effect. Later effects can
    // move an earlier declared card (Trugg), not this choice's candidate.
    destination = destinationOf(choice.effects.slice(0, 1));
  if (!destination) return undefined;
  const label =
    destination === "accessory"
      ? "Accessory Zone"
      : destination === "clash"
        ? "Clash Zone"
        : destination;
  return {
    kind: "entity-selection",
    id: "destination",
    text: { key: `Place the selected card in your ${label}` },
    required: !optionIds,
    ...(optionIds
      ? { requiredWhen: optionIds.map((id) => ({ all: [{ inputId: "selection", value: [id] }] })) }
      : {}),
    role: "destination",
    entityKinds: ["zone"],
    min: 1,
    max: 1,
    ordered: false,
    candidates: [
      {
        entity: { kind: "zone", instanceId: `${choice.playerId}:${destination}` },
        text: { key: `Your ${label}` },
        enabled: true,
      },
    ],
  };
}

function choiceAction(
  choice: PendingChoice,
  stateVersion: number,
  playerView: ProjectedState,
): InteractionAction {
  const id = `resolveChoice:${choice.id}`;
  // Public reveal references identify the card this decision concerns. Read
  // its face from the viewer projection, never from the hidden deck registry.
  const revealedCards = [...new Set((choice.publicReveals ?? []).map((ref) => ref.cardId))]
    .map((id) => playerView.cards.find((card) => card.instanceId === id))
    .flatMap((card) => {
      if (!card?.name || !card.definitionId) return [];
      const definition = safeDefinition(card.definitionId);
      return [
        definition && definition.cardType !== "contender"
          ? `${card.name} (cost ${costLabel(definition)})`
          : card.name,
      ];
    });
  const prompt = revealedCards.length
    ? `${choice.prompt}. Revealed: ${revealedCards.join(", ")}.`
    : choice.prompt;
  const base = {
    id,
    requestId: requestId(stateVersion, id),
    intent: "choose-option" as const,
    text: { key: prompt },
    source: entityRef(choice.sourceId),
    enabled: true,
  };
  const ordering = deckOrderOptions(choice);
  if (ordering.length) {
    const ids = [...new Set(ordering.map((option) => option.cardId))];
    return {
      ...base,
      text: { key: "Order the looked-at cards" },
      inputs: [
        {
          kind: "entity-partition",
          id: "deckOrder",
          required: true,
          text: {
            key: ordering.every((option) => option.destination === "top")
              ? "Place each card in Top, then set the order."
              : ordering.every((option) => option.destination === "bottom")
                ? "Place each card in Bottom, then set the order."
                : "Place each card in Top or Bottom, then set the order.",
          },
          candidateSetText: { key: "Looked-at cards" },
          entityKind: "card",
          assignment: "exhaustive",
          candidates: ids.map((id) => ({
            ...candidateRef(id),
            text: { key: playerView.cards.find((card) => card.instanceId === id)?.name ?? "Card" },
          })),
          routes: (["top", "bottom"] as const)
            .filter((destination) => ordering.some((option) => option.destination === destination))
            .map((destination) => ({
              id: destination,
              text: { key: destination === "top" ? "Top" : "Bottom" },
              kind: "destination",
              ordered: true,
              orderDirection: "top-first",
              min: 0,
              max: ids.length,
              candidateIds: ordering
                .filter((option) => option.destination === destination)
                .map((option) => option.cardId),
            })),
        },
      ],
    };
  }
  switch (choice.kind) {
    case "ordering":
      return {
        ...base,
        inputs: [
          {
            kind: "ordering",
            id: "order",
            text: { key: choice.prompt },
            required: true,
            entityKind: choice.purpose === "triggers" ? "effect" : "card",
            min: choice.candidates.length,
            max: choice.candidates.length,
            candidates: choice.candidates.map((candidate) => ({
              entity: {
                kind: choice.purpose === "triggers" ? "effect" : "card",
                instanceId: candidate.id,
                definitionId:
                  playerView.cards.find((card) => card.instanceId === candidate.cardId)
                    ?.definitionId ?? undefined,
              },
              enabled: true,
              text: {
                key: candidate.label,
              },
            })),
          },
        ],
      };
    case "option":
      return {
        ...base,
        inputs: [
          {
            kind: "boolean",
            id: "confirm",
            text: { key: choice.prompt },
            required: true,
            trueText: { key: "Use" },
            falseText: { key: "Decline" },
          },
        ],
      };
    case "modal": {
      // A simultaneous-trigger order renders as the numbered tray and submits
      // the controller's whole remaining order through orderedIds.
      const order = choice.triggerOrder;
      if (order) {
        return {
          ...base,
          inputs: [
            {
              kind: "ordering",
              id: "order",
              text: { key: choice.prompt },
              required: true,
              entityKind: "effect",
              min: choice.options.length,
              max: choice.options.length,
              candidates: choice.options.map((option) => {
                const sourceId = order.batch.find((trigger) => trigger.id === option.id)?.context
                  .sourceId;
                return {
                  entity: {
                    kind: "effect" as const,
                    instanceId: option.id,
                    definitionId:
                      playerView.cards.find((card) => card.instanceId === sourceId)?.definitionId ??
                      undefined,
                  },
                  enabled: true,
                  text: { key: option.label },
                };
              }),
            },
          ],
        };
      }
      return {
        ...base,
        inputs: [
          {
            kind: "option-selection",
            id: "selection",
            text: { key: prompt },
            required: true,
            min: 1,
            max: 1,
            cardDestination: cardDestination(
              choice.options
                .flatMap((option) => option.effects)
                .filter((effect) => effect.type === "selectCards"),
            ),
            options: choice.options.map((option): InteractionOption => ({
              id: option.id,
              text: { key: option.label },
              entity: (() => {
                const selection = option.effects.find((effect) => effect.type === "selectCards");
                const cardId = selection?.selected?.at(-1);
                return cardId ? entityRef(cardId) : undefined;
              })(),
              enabled: true,
            })),
          },
        ],
      };
    }
    case "target":
      return {
        ...base,
        inputs: [
          {
            kind: "entity-selection",
            id: "selection",
            text: { key: choice.prompt },
            required: true,
            role: "target",
            entityKinds: ["card"],
            min: 1,
            max: 1,
            ordered: false,
            candidates: choice.candidates.map(candidateRef),
            cardDestination: choice.discard
              ? destination("Oblivion", "Discard card")
              : cardDestination(choice.effects),
          },
        ],
      };
    case "count": {
      const transfer = choice.then.find((effect) => effect.type === "moveCounters");
      const visibleName = (id: string | undefined) =>
        playerView.cards.find((card) => card.instanceId === id)?.name ?? "card";
      const sourceId =
        transfer?.source.type === "bound" ? choice.bindings?.[transfer.source.binding] : undefined;
      const destinationId =
        transfer?.target.type === "selected" ? choice.selectedCardIds?.[0] : undefined;
      return {
        ...base,
        inputs: [
          {
            kind: "number",
            id: "count",
            ...(transfer && sourceId && destinationId
              ? {
                  presentation: {
                    contextText: {
                      key: `From ${visibleName(sourceId)} to ${visibleName(destinationId)}`,
                    },
                    contextParts: [
                      { kind: "text" as const, text: { key: "From " } },
                      { kind: "card" as const, entity: entityRef(sourceId) },
                      { kind: "text" as const, text: { key: " to " } },
                      { kind: "card" as const, entity: entityRef(destinationId) },
                    ],
                    confirmText: { key: "Move counters" },
                    cancel: {
                      value: 0,
                      text: { key: "Cancel transfer" },
                      description: {
                        key: "Cancel moves no counters. The ability remains used this turn.",
                      },
                    },
                  },
                }
              : {}),
            text: { key: choice.prompt },
            required: true,
            min: 0,
            max: choice.max,
            step: 1,
          },
        ],
      };
    }
    case "division": {
      const prevention =
        choice.sharedPrevention?.targetAmounts ??
        choice.sharedClashPrevention?.amounts ??
        choice.prevention?.sourceAmounts;
      return {
        ...base,
        inputs: [
          {
            kind: "entity-allocation",
            id: "allocation",
            text: { key: choice.prompt },
            required: true,
            role: "target",
            entityKinds: ["card"],
            totalMin: choice.total,
            totalMax: choice.total,
            allowEmpty: !prevention,
            maxRecipients: choice.maxTargets,
            candidates: choice.candidates.map((candidateId) => ({
              entity: entityRef(candidateId),
              enabled: true,
              min: 0,
              max: prevention?.[candidateId] ?? choice.total,
            })),
          },
        ],
      };
    }
    default:
      return { ...base, inputs: [] };
  }
}

function simpleAction(
  id: string,
  intent: InteractionAction["intent"],
  label: string,
  stateVersion: number,
): InteractionAction {
  return {
    id,
    requestId: requestId(stateVersion, id),
    intent,
    text: { key: label },
    enabled: true,
    inputs: [],
  };
}

function handPlayActions(
  playerView: ProjectedState,
  seat: Seat,
  stateVersion: number,
  options: { window: boolean; resolveTargets?: TargetResolver },
): InteractionAction[] {
  const actions: InteractionAction[] = [];
  for (const card of playerView.cards.filter(
    (card) =>
      card.owner === seat &&
      (card.zone === "hand" ||
        (options.window &&
          card.zone === "accessory" &&
          card.faceDown &&
          card.setOnTurn !== playerView.turnNumber) ||
        (!options.window && card.zone === "oblivion")),
  )) {
    if (!card.definitionId) continue;
    const definition = safeDefinition(card.definitionId);
    if (!definition) continue;
    if (card.zone === "oblivion" && (definition.cardType !== "clash" || !definition.replay))
      continue;
    if (
      definition.cardType === "clash" &&
      definition.playCondition?.condition.type === "selfInZone" &&
      definition.playCondition.condition.zone !== card.zone
    )
      continue;

    if (options.window) {
      // Counter windows accept Counter-tagged Quick Actions, Trap
      // activations, and Ambush entrances (304.7, 704.17h).
      const tag = counterTagForWindow(playerView);
      if (!tag) continue;
      const tags =
        ("ambush" in definition ? definition.ambush?.counterTags : undefined) ??
        (definition as { counterTags?: readonly AcCounterTag[] }).counterTags;
      const isAmbush = isAmbushCard(definition);
      const usable =
        (definition.cardType === "action" &&
          definition.subtype === "quick" &&
          tags?.includes(tag) === true) ||
        (definition.cardType === "accessory" &&
          (definition.subtype === "trap" || isAmbushCard(definition)) &&
          tags?.includes(tag) === true) ||
        (isAmbush && tags?.includes(tag) === true);
      if (!usable) continue;
      if (card.zone === "hand" && (definition.cardType === "accessory" || isAmbush)) continue;
      if (!responseConditionMatches(definition, playerView, seat)) continue;
      const inputs = playInputs(
        definition,
        playerView,
        seat,
        card.instanceId,
        options.resolveTargets,
        "ambush" in definition ? definition.ambush?.effects : undefined,
      );
      if (inputs.some((candidate) => requiredInputEmpty(candidate))) continue;
      actions.push({
        id: `respond:${card.instanceId}`,
        requestId: requestId(stateVersion, `respond:${card.instanceId}`),
        intent: "play-card",
        text: { key: isAmbush ? `Ambush ${definition.name}` : `Counter with ${definition.name}` },
        source: entityRef(card.instanceId),
        enabled: true,
        inputs,
      });
      continue;
    }

    if (definition.cardType === "contender") continue;
    if (card.zone === "hand" && canSet(definition))
      actions.push({
        ...simpleAction(
          `setCard:${card.instanceId}`,
          "move-card",
          `Set ${definition.name} face down`,
          stateVersion,
        ),
        source: entityRef(card.instanceId),
      });
    if (
      (definition.cardType === "action" &&
        (definition.subtype === "quick" || definition.subtype === "clash-buff")) ||
      (definition.cardType === "accessory" && definition.subtype === "trap")
    )
      continue;
    const inputs = playInputs(
      definition,
      playerView,
      seat,
      card.instanceId,
      options.resolveTargets,
    );
    if (inputs.some((candidate) => requiredInputEmpty(candidate))) continue;
    actions.push({
      id: `playCard:${card.instanceId}`,
      source: entityRef(card.instanceId),
      requestId: requestId(stateVersion, `playCard:${card.instanceId}`),
      intent: "play-card",
      text: {
        key: `Play ${definition.name} (${costLabel(definition)})`,
      },
      enabled: true,
      inputs,
    });
  }
  return actions;
}

function responseConditionMatches(
  definition: AcCardDefinition,
  view: ProjectedState,
  seat: Seat,
): boolean {
  const condition = "responseCondition" in definition ? definition.responseCondition : undefined;
  if (condition?.type !== "answeredPlayCardType") return true;
  const answered = view.standby[view.standby.length - 1];
  const card = view.cards.find((candidate) => candidate.instanceId === answered?.cardId);
  const printed = card?.definitionId ? safeDefinition(card.definitionId) : undefined;
  if (!answered || !printed || printed.cardType !== condition.cardType) return false;
  if (condition.opponentOnly && answered.controller === seat) return false;
  if (
    condition.trapActivation !== undefined &&
    answered.trapActivation !== condition.trapActivation
  )
    return false;
  if (
    condition.subtypes &&
    !condition.subtypes.some(
      (subtype) =>
        "subtype" in printed &&
        (printed.subtype === subtype ||
          (subtype === "weapon" && printed.subtype === "contender-weapon")),
    )
  )
    return false;
  if (
    condition.costAtMost !== undefined &&
    (!("cost" in printed) || printed.cost.total > condition.costAtMost)
  )
    return false;
  if (
    condition.costAtLeast !== undefined &&
    (!("cost" in printed) || printed.cost.total < condition.costAtLeast)
  )
    return false;
  return true;
}

/** A declared cost, not a resolution choice: cancelling the draft pays nothing. */
function healthPaymentInputs(
  definition: AcCardDefinition,
  playerView: ProjectedState,
  seat: Seat,
): InteractionInput[] {
  if (definition.cardType !== "action" || !definition.healthCostReduction) return [];
  const max = Math.max(
    0,
    Math.min(definition.healthCostReduction.max, playerView.players[seat].health),
  );
  return [
    {
      kind: "number",
      id: "healthReduction",
      text: { key: "Choose health payment" },
      required: true,
      min: 0,
      max,
      step: 1,
      presentation: {
        contextText: {
          key: "Pay health to reduce the resource cost; zero pays no health and cancel pays nothing",
        },
        confirmText: { key: "Confirm health payment" },
      },
    },
  ];
}

function playInputs(
  definition: AcCardDefinition,
  playerView: ProjectedState,
  seat: Seat,
  sourceId: string,
  resolveTargets?: TargetResolver,
  responseEffects?: readonly AcEffect[],
): InteractionInput[] {
  const inputs = chosenTargetInputs(definition, playerView, seat, {
    sourceId,
    resolveTargets,
    abilityIndex: null,
    effects: responseEffects,
  });
  inputs.push(...healthPaymentInputs(definition, playerView, seat));
  if (definition.cardType === "clash" && "cost" in definition && definition.cost?.x) {
    inputs.push({
      kind: "number",
      id: "xValue",
      text: { key: "Declare X" },
      required: true,
      min: 0,
      step: 1,
    });
  }
  inputs.unshift(
    ...costRouteInputs(definition, playerView, seat, sourceId, (target) =>
      target.type === "card" || target.type === "contender" || target.type === "contenderOrClash"
        ? candidatesForTarget(playerView, seat, target)
        : [],
    ),
  );
  return inputs;
}

/** Chosen card selectors need play-time candidates (rule 113.6b). Triggered
 *  abilities declare later (603.3d), so callers scope the tree via abilityIndex. */
function chosenTargetInputs(
  definition: AcCardDefinition,
  playerView: ProjectedState,
  seat: Seat,
  context: {
    sourceId: string;
    resolveTargets?: TargetResolver;
    abilityIndex: number | null;
    effects?: readonly AcEffect[];
  },
): InteractionInput[] {
  const ability =
    context.abilityIndex === null ? undefined : definition.abilities?.[context.abilityIndex];
  const groups = new Map<number, AcTarget[]>();
  let requiredCount: number | undefined;
  if (ability?.kind === "activated" && ability.requiredTargets) {
    const requirement = ability.requiredTargets;
    requiredCount = playerView.portalOpen
      ? (requirement.portalAmount ?? requirement.amount)
      : requirement.amount;
    groups.set(0, [requirement.target]);
  } else {
    for (const tree of context.effects
      ? [{ abilityIndex: null, effects: context.effects }]
      : effectTreesOf(definition)) {
      if (tree.abilityIndex !== context.abilityIndex) continue;
      // Action effects share native declared indices; activated top-level effects
      // consume declarations in order (including attachment host declarations).
      const entries =
        context.abilityIndex === null
          ? collectChosenSelectorEntries(tree.effects)
          : tree.effects
              .flatMap((effect) =>
                collectChosenSelectorEntries([effect]).slice(0, effect.type === "attach" ? 2 : 1),
              )
              .map((entry, index) => ({ ...entry, index }));
      for (const entry of entries)
        groups.set(entry.index, [...(groups.get(entry.index) ?? []), entry.target]);
    }
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a - b)
    .map(([index, targets]) => {
      const sets = targets.map((target) => {
        if (context.resolveTargets) return context.resolveTargets(target, context.sourceId);
        const selector = target.type === "declared" ? target.selector : target;
        if (selector.type === "player") {
          if (selector.controller === "any") return ["player-one", "player-two"];
          if (selector.controller === "friendly") return [seat];
          if (selector.controller === "opponent")
            return [seat === "player-one" ? "player-two" : "player-one"];
          if (selector.controller === "active") return [playerView.activePlayer];
          return [];
        }
        return selector.type === "card" ||
          selector.type === "contender" ||
          selector.type === "contenderOrClash"
          ? candidatesForTarget(playerView, seat, selector).map((c) => c.entity.instanceId!)
          : [];
      });
      const candidates = (sets[0] ?? [])
        .filter((id) => sets.every((set) => set.includes(id)))
        .map((id): EntityCandidate =>
          id === "player-one" || id === "player-two"
            ? {
                entity: { kind: "player", instanceId: id },
                text: { key: id === seat ? "You" : "Opponent" },
                enabled: true,
              }
            : candidateRef(id),
        );
      const optional = targets.every((target) => target.type === "declared" && target.optional);
      const count = requiredCount ?? 1;
      return {
        kind: "entity-selection",
        id:
          requiredCount && requiredCount > 1
            ? "targetIds"
            : index === 0
              ? "targetId"
              : index === 1
                ? "targetIds"
                : `targetIds:${index}`,
        text: { key: count > 1 ? `Choose ${count} targets` : "Choose a target" },
        required: true,
        role: "target",
        entityKinds: [...new Set(candidates.map((candidate) => candidate.entity.kind))],
        min: optional ? 0 : count,
        max: count,
        ordered: count > 1,
        candidates,
        cardDestination:
          definition.cardType === "action"
            ? cardDestination(
                definition.effects.filter(
                  (effect) =>
                    "target" in effect &&
                    effect.target !== undefined &&
                    targets.includes(effect.target),
                ),
              )
            : undefined,
      };
    });
}

function initiateClashAction(
  playerView: ProjectedState,
  seat: Seat,
  other: Seat,
  stateVersion: number,
  nativeTargets?: Readonly<Record<string, readonly string[]>>,
): InteractionAction | null {
  const fallbackTargets = [
    ...contenderCandidates(playerView, other),
    ...cardsWhere(
      playerView,
      (card, definition) =>
        card.controller === other && card.zone === "clash" && definition.cardType === "clash",
    ),
  ];
  const possibleAttackers = [
    ...readyClashCandidates(playerView, seat),
    ...contenderCandidates(playerView, seat).filter(
      (candidate) =>
        playerView.cards.find((card) => card.instanceId === candidate.entity.instanceId)?.ready,
    ),
  ];
  const attackers = possibleAttackers.filter(
    (candidate) =>
      nativeTargets === undefined || (nativeTargets[candidate.entity.instanceId]?.length ?? 0) > 0,
  );
  if (attackers.length === 0) return null;
  const targetsFor = (id: string) =>
    nativeTargets?.[id] ?? fallbackTargets.map((candidate) => candidate.entity.instanceId);
  const firstTargets = targetsFor(attackers[0].entity.instanceId);
  if (firstTargets.length === 0) return null;
  const sameTargets = attackers.every(
    (candidate) =>
      JSON.stringify(targetsFor(candidate.entity.instanceId)) === JSON.stringify(firstTargets),
  );
  const targetInput = (ids: readonly string[], attackerId?: string): InteractionInput => ({
    kind: "entity-selection",
    id: attackerId ? `targetId:${attackerId}` : "targetId",
    text: { key: "Choose the clash target" },
    required: !attackerId,
    ...(attackerId
      ? { requiredWhen: [{ all: [{ inputId: "attackerId", value: [attackerId] }] }] }
      : {}),
    role: "defender",
    entityKinds: ["card"],
    min: 1,
    max: 1,
    ordered: false,
    candidates: ids.map(candidateRef),
  });
  return {
    id: "initiateClash",
    requestId: requestId(stateVersion, "initiateClash"),
    intent: "attack",
    text: { key: "Initiate a clash" },
    enabled: true,
    inputs: [
      {
        kind: "entity-selection",
        id: "attackerId",
        text: { key: "Choose a ready attacker" },
        required: true,
        role: "attacker",
        entityKinds: ["card"],
        min: 1,
        max: 1,
        ordered: false,
        candidates: attackers,
      },
      ...(sameTargets
        ? [targetInput(firstTargets)]
        : attackers.map((candidate) =>
            targetInput(targetsFor(candidate.entity.instanceId), candidate.entity.instanceId),
          )),
    ],
  };
}

/** C4/C5 (504.2d-e): the acting player may play one Clash Buff. */
function clashBuffActions(
  playerView: ProjectedState,
  seat: Seat,
  stateVersion: number,
  resolveTargets?: TargetResolver,
): InteractionAction[] {
  const actions: InteractionAction[] = [];
  for (const card of handCards(playerView, seat)) {
    if (!card.definitionId) continue;
    const definition = safeDefinition(card.definitionId);
    if (definition?.cardType !== "action" || definition.subtype !== "clash-buff") continue;
    const inputs = playInputs(definition, playerView, seat, card.instanceId, resolveTargets);
    if (inputs.some((candidate) => requiredInputEmpty(candidate))) continue;
    actions.push({
      id: `playCard:${card.instanceId}`,
      source: entityRef(card.instanceId),
      requestId: requestId(stateVersion, `playCard:${card.instanceId}`),
      intent: "play-card",
      text: { key: `Clash Buff: ${definition.name}` },
      enabled: true,
      inputs,
    });
  }
  return actions;
}

function accessoryActions(
  playerView: ProjectedState,
  seat: Seat,
  stateVersion: number,
): InteractionAction[] {
  const actions: InteractionAction[] = [];
  for (const card of playerView.cards) {
    if (
      card.controller !== seat ||
      card.faceDown ||
      (card.zone !== "accessory" && !card.attachedTo)
    )
      continue;
    const definition = card.definitionId ? safeDefinition(card.definitionId) : undefined;
    if (!definition) continue;
    if (card.attachedTo && definition.cardType === "accessory" && definition.attachCost) {
      actions.push({
        ...simpleAction(
          `detachWeapon:${card.instanceId}`,
          "activate",
          `Detach ${definition.name}`,
          stateVersion,
        ),
        source: entityRef(card.instanceId),
      });
      continue;
    }
    if (definition.cardType === "accessory" && definition.subtype === "weapon") {
      const candidates = cardsWhere(
        playerView,
        (owned, def) =>
          def.cardType === "clash" && owned.controller === seat && owned.zone === "clash",
      );
      if (candidates.length === 0) continue;
      actions.push({
        id: `attachWeapon:${card.instanceId}`,
        requestId: requestId(stateVersion, `attachWeapon:${card.instanceId}`),
        source: entityRef(card.instanceId),
        intent: "choose-targets",
        text: { key: `Attach ${definition.name}` },
        enabled: true,
        inputs: [
          {
            kind: "entity-selection",
            id: "targetId",
            text: { key: "Choose a Clash card" },
            required: true,
            role: "target",
            entityKinds: ["card"],
            min: 1,
            max: 1,
            ordered: false,
            candidates,
          },
        ],
      });
    }
    if (definition.cardType === "accessory" && definition.subtype === "contender-weapon") {
      actions.push({
        id: `attachWeapon:${card.instanceId}`,
        requestId: requestId(stateVersion, `attachWeapon:${card.instanceId}`),
        source: entityRef(card.instanceId),
        intent: "choose-targets",
        text: { key: `Attach ${definition.name} to your Contender` },
        enabled: true,
        inputs: [
          {
            kind: "entity-selection",
            id: "targetId",
            text: { key: "Choose your Contender" },
            required: true,
            role: "target",
            entityKinds: ["card"],
            min: 1,
            max: 1,
            ordered: false,
            candidates: contenderCandidates(playerView, seat),
          },
        ],
      });
    }
  }
  return actions;
}

function activatedAbilityActions(
  playerView: ProjectedState,
  seat: Seat,
  stateVersion: number,
  counterWindow = false,
  resolveTargets?: TargetResolver,
): InteractionAction[] {
  const actions: InteractionAction[] = [];
  const tag = counterTagForWindow(playerView);
  if (counterWindow && !tag) return actions;
  for (const card of playerView.cards) {
    if (card.controller !== seat || !card.definitionId) continue;
    const definition = safeDefinition(card.definitionId);
    if (!definition) continue;
    // Activated abilities exist on Contenders, Clash cards, Clashgrounds,
    // and Accessories; Actions resolve through play/respond instead.
    const abilities = definition.cardType === "action" ? [] : (definition.abilities ?? []);
    const abilityCounter = tag ? windowTagToAbilityCounter(tag) : undefined;
    abilities.forEach((ability, abilityIndex) => {
      if (ability.kind !== "activated") return;
      if (counterWindow ? ability.counter !== abilityCounter : ability.counter !== undefined)
        return;
      if (ability.cost?.kind === "engage" && ability.cost.target.type === "self" && !card.ready)
        return;
      const fromHere =
        card.zone === "hand"
          ? ability.activation === "hand"
          : IN_PLAY_ZONES.includes(card.zone) ||
            (card.zone === "oblivion" && ability.activation === "oblivion");
      if (!fromHere) return;
      const inputs = chosenTargetInputs(definition, playerView, seat, {
        sourceId: card.instanceId,
        resolveTargets,
        abilityIndex,
      });
      if (inputs.some((candidate) => requiredInputEmpty(candidate))) return;
      actions.push({
        id: `activateAbility:${card.instanceId}:${abilityIndex}`,
        requestId: requestId(stateVersion, `activateAbility:${card.instanceId}:${abilityIndex}`),
        intent: "activate",
        text: { key: ability.text },
        source: entityRef(card.instanceId),
        enabled: true,
        inputs,
      });
    });
  }
  return actions;
}

// ---------------------------------------------------------------------------
// Candidate helpers
// ---------------------------------------------------------------------------

function candidatesForTarget(
  playerView: ProjectedState,
  seat: Seat,
  target: PlayTarget,
): EntityCandidate[] {
  const other = seat === "player-one" ? "player-two" : "player-one";
  const controllerSeats =
    target.controller === "friendly"
      ? [seat]
      : target.controller === "opponent"
        ? [other]
        : target.controller === "active"
          ? [playerView.activePlayer]
          : [seat, other];
  const cards = cardsWhere(playerView, (card, definition) => {
    if (!controllerSeats.includes(card.controller as Seat)) return false;
    if (target.type === "contender" || target.type === "contenderOrClash") {
      if (
        definition.cardType !== "contender" &&
        !(target.type === "contenderOrClash" && definition.cardType === "clash")
      )
        return false;
      if (!IN_PLAY_ZONES.includes(card.zone)) return false;
      return (
        target.type !== "contender" ||
        !target.colors ||
        target.colors.some((color) => definition.colors.includes(color))
      );
    }
    if (target.cardTypes && !target.cardTypes.includes(definition.cardType)) return false;
    if (target.attacking && card.instanceId !== playerView.clash?.attackerId) return false;
    if (target.unattached && card.attachedTo !== undefined) return false;
    if (target.status === "ready" && !card.ready) return false;
    if (target.status === "engaged" && card.ready) return false;
    if (
      target.attackAtMost !== undefined &&
      (card.attack === undefined || card.attack > target.attackAtMost)
    )
      return false;
    if (
      target.attackAtLeast !== undefined &&
      (card.attack === undefined || card.attack < target.attackAtLeast)
    )
      return false;
    if (
      target.costAtMost !== undefined &&
      (definition.cardType === "contender" || definition.cost.total > target.costAtMost)
    )
      return false;
    const affiliation = (definition as { affiliation?: string }).affiliation;
    if (target.affiliations && !target.affiliations.some((a) => affiliation === a)) {
      return false;
    }
    if (
      target.subtypes &&
      !target.subtypes.some(
        (subtype) =>
          "subtype" in definition &&
          (definition.subtype === subtype ||
            (subtype === "weapon" && definition.subtype === "contender-weapon")),
      )
    ) {
      return false;
    }
    if (target.zones ? !target.zones.includes(card.zone) : !IN_PLAY_ZONES.includes(card.zone))
      return false;
    if (target.colors && !target.colors.some((color) => definition.colors.includes(color)))
      return false;
    if (
      target.costAtLeast !== undefined &&
      (definition.cardType === "contender" || definition.cost.total < target.costAtLeast)
    )
      return false;
    if (target.nameIncludes && !definition.name.includes(target.nameIncludes)) return false;
    if (target.tokenOnly && !card.instanceId.startsWith("token-")) return false;
    return true;
  });
  return cards;
}

type PlayTarget = Extract<AcTarget, { type: "card" | "contender" | "contenderOrClash" }> & {
  label?: string;
};

/** Effect trees carried by a definition, tagged with their owning ability. */
function effectTreesOf(
  definition: AcCardDefinition,
): readonly { abilityIndex: number | null; effects: readonly AcEffect[] }[] {
  const trees: { abilityIndex: number | null; effects: readonly AcEffect[] }[] = [];
  if (definition.cardType === "action")
    trees.push({ abilityIndex: null, effects: definition.effects });
  if (definition.cardType === "accessory" && definition.effects)
    trees.push({ abilityIndex: null, effects: definition.effects });
  (definition.abilities ?? []).forEach((ability, abilityIndex) => {
    if ("effects" in ability && Array.isArray(ability.effects))
      trees.push({ abilityIndex, effects: ability.effects });
  });
  return trees;
}

function cardsWhere(
  playerView: ProjectedState,
  predicate: (card: ProjectedState["cards"][number], definition: AcCardDefinition) => boolean,
): EntityCandidate[] {
  const candidates: EntityCandidate[] = [];
  for (const card of playerView.cards) {
    if (
      !IN_PLAY_ZONES.includes(card.zone) &&
      card.zone !== "hand" &&
      card.zone !== "oblivion" &&
      card.zone !== "banished"
    )
      continue;
    if (!card.definitionId) continue;
    const definition = safeDefinition(card.definitionId);
    if (!definition) continue;
    if (predicate(card, definition)) {
      candidates.push(candidateRef(card.instanceId));
    }
  }
  return candidates;
}

function readyClashCandidates(playerView: ProjectedState, seat: Seat): EntityCandidate[] {
  return cardsWhere(
    playerView,
    (card, definition) =>
      card.controller === seat &&
      card.zone === "clash" &&
      card.ready &&
      definition.cardType === "clash",
  );
}

function contenderCandidates(playerView: ProjectedState, seat: Seat): EntityCandidate[] {
  return cardsWhere(
    playerView,
    (card, definition) =>
      card.controller === seat && card.zone === "contender" && definition.cardType === "contender",
  );
}

function handCards(playerView: ProjectedState, seat: Seat): ProjectedState["cards"] {
  return playerView.cards.filter((card) => card.controller === seat && card.zone === "hand");
}

function handSelectionInput(
  playerView: ProjectedState,
  seat: Seat,
  id: string,
  label: string,
): InteractionInput | null {
  const candidates: EntityCandidate[] = handCards(playerView, seat).map((card) =>
    candidateRef(card.instanceId),
  );
  if (candidates.length === 0) return null;
  return {
    kind: "entity-selection",
    id,
    text: { key: label },
    required: true,
    role: "source",
    entityKinds: ["card"],
    min: 1,
    max: 1,
    ordered: false,
    candidates,
  };
}

/** A required entity selection with no legal candidates cannot be offered. */
function requiredInputEmpty(input: InteractionInput): boolean {
  return (
    input.kind === "entity-selection" &&
    input.required === true &&
    input.candidates.filter((candidate) => candidate.enabled).length < input.min
  );
}

function isAmbushCard(definition: AcCardDefinition): boolean {
  return "keywords" in definition && definition.keywords?.includes("ambush") === true;
}

function candidateRef(instanceId: string): EntityCandidate {
  return { entity: entityRef(instanceId), enabled: true };
}

function entityRef(instanceId: string): EntityRef {
  return { kind: "card", instanceId };
}

function safeDefinition(definitionId: string | null): AcCardDefinition | undefined {
  if (!definitionId) return undefined;
  try {
    return getCard(definitionId);
  } catch {
    return undefined;
  }
}

function costLabel(definition: AcCardDefinition): string {
  if (definition.cardType === "contender") return "Contender";
  const cost = (definition as { cost?: { total: number; x?: boolean } }).cost;
  if (!cost) return "free";
  return cost.x ? `X+${cost.total}` : String(cost.total);
}

function canSet(definition: AcCardDefinition): boolean {
  return (
    (definition.cardType === "accessory" && definition.subtype === "trap") ||
    isAmbushCard(definition)
  );
}

type AcCounterTag = "counter-attack" | "counter-play" | "counter-trap";

function counterTagForWindow(playerView: ProjectedState): AcCounterTag | undefined {
  return playerView.responseWindow?.kind;
}

/**
 * Response windows carry Counter - Attack / Counter - Play tags; activated
 * abilities record the same gate as "attack" / "play" (rules 302, 308.3).
 */
function windowTagToAbilityCounter(tag: AcCounterTag): "attack" | "play" | undefined {
  if (tag === "counter-attack") return "attack";
  if (tag === "counter-play") return "play";
  return undefined;
}

function pendingChoicesForSeat(playerView: ProjectedState, seat: Seat): PendingChoice[] {
  return playerView.pendingChoices.filter((choice) => choice.playerId === seat);
}

function singleEntity(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const first = value.find((entry): entry is string => typeof entry === "string");
    return first;
  }
  return undefined;
}

/** Flattens an allocation value ({instanceId: amount}) into a division record. */
function allocationDivision(value: unknown): Record<string, number> {
  const division: Record<string, number> = {};
  if (value && typeof value === "object") {
    for (const [instanceId, amount] of Object.entries(value as Record<string, unknown>)) {
      const numeric = typeof amount === "number" ? amount : Number(amount);
      if (Number.isFinite(numeric) && numeric > 0) division[instanceId] = Math.trunc(numeric);
    }
  }
  return division;
}

function otherSeat(seat: Seat): Seat {
  return seat === "player-one" ? "player-two" : "player-one";
}

function statusFor(
  playerView: ProjectedState,
  seat: Seat,
  decisionSeat?: Seat,
): EngineInteractionView["status"] {
  if (playerView.phase.name === "complete") return "game-over";
  if (playerView.phase.name === "setup") {
    const step = openingActionFor(playerView, seat);
    return step === "wait" ? "waiting" : step === "start" ? "ready" : "choosing";
  }
  if (pendingChoicesForSeat(playerView, seat).length > 0) return "choosing";
  if (playerView.pendingChoicePlayerId || playerView.pendingChoices.length > 0) return "waiting";
  if (decisionSeat) return decisionSeat === seat ? "ready" : "waiting";
  if (playerView.responseWindow)
    return playerView.responseWindow.openFor === seat ? "ready" : "waiting";
  const isActive = playerView.activePlayer === seat;
  if (isActive) return "ready";
  return "waiting";
}

function requestId(stateVersion: number, id: string): string {
  return `alpha-clash:${stateVersion}:${id}`;
}

export type { AcCardType };

function remainingTargets(values: InteractionSubmission["values"]): string[] | undefined {
  const keys = Object.keys(values)
    .filter((key) => key === "targetIds" || /^targetIds:\d+$/.test(key))
    .sort((a, b) => Number(a.split(":")[1] ?? 1) - Number(b.split(":")[1] ?? 1));
  if (!keys.length) return undefined;
  return keys.flatMap((key) =>
    Array.isArray(values[key])
      ? values[key].filter((id): id is string => typeof id === "string")
      : [],
  );
}
