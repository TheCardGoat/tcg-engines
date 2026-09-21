import { getCard } from "@tcg/alpha-clash-cards";
import type { AcCardDefinition, AcCardType, AcEffect, AcTarget } from "@tcg/alpha-clash-types";
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
  stateVersion: number;
  playerView: ProjectedState;
}): EngineInteractionView {
  const { seat, playerView, stateVersion } = input;
  const other = seat === "player-one" ? "player-two" : "player-one";
  const actions: InteractionAction[] = [];
  const isActive = playerView.activePlayer === seat;
  const windowOpenForSeat = playerView.responseWindow?.openFor === seat;
  const phase = playerView.phase;

  // 1. Pending choices (rule 608) always come first; the engine's
  //    guardCommand blocks everything else while one is open.
  for (const choice of playerView.pendingChoices) {
    if (choice.playerId !== seat) continue;
    actions.push(choiceAction(choice, stateVersion));
  }

  // 2. Setup: mulligan once, then start the game (rule 103.5). The mulligan
  //    action disappears once this seat has taken it — the engine rejects a
  //    second mulligan, so the view must not advertise one.
  if (phase.name === "setup") {
    if (playerView.players[seat].hasMulliganed !== true) {
      actions.push(
        simpleAction(
          "mulligan",
          "mulligan",
          "Take a mulligan (reshuffle and redraw 8)",
          stateVersion,
        ),
      );
    }
    actions.push(simpleAction("startGame", "activate", "Start the game", stateVersion));
  }

  // 3. Expansion Phase, Resource Step (408.1): deploy one card or pass.
  if (
    phase.name === "expansion" &&
    phase.step === "resource" &&
    isActive &&
    playerView.pendingChoices.length === 0
  ) {
    const handInput = handSelectionInput(playerView, seat, "cardId", "Choose a card to deploy");
    if (handInput) {
      actions.push({
        id: "deployResource",
        requestId: requestId(stateVersion, "deployResource"),
        intent: "resource-card",
        text: { key: "Deploy a card to the Resource Zone" },
        enabled: true,
        inputs: [handInput],
      });
    }
    actions.push(simpleAction("passResource", "pass", "Skip the Resource Step", stateVersion));
  }

  // 4. Primary Phase (503): the main decision surface.
  if (phase.name === "primary" && isActive && playerView.pendingChoices.length === 0) {
    actions.push(simpleAction("endTurn", "pass", "End turn", stateVersion));
    if (!playerView.portalOpen) {
      actions.push(
        simpleAction(
          "activatePortal",
          "activate",
          "Activate the Portal (2 resources)",
          stateVersion,
        ),
      );
    }
    const clashAction = initiateClashAction(playerView, seat, other, stateVersion);
    if (clashAction) actions.push(clashAction);
    actions.push(...handPlayActions(playerView, seat, stateVersion, { window: false }));
    actions.push(...accessoryActions(playerView, seat, stateVersion));
  }

  // 5. Response windows (114.3): respond with Counter-tagged cards or pass.
  if (windowOpenForSeat && playerView.pendingChoices.length === 0) {
    actions.push(simpleAction("passCounter", "pass", "Pass", stateVersion));
    actions.push(...handPlayActions(playerView, seat, stateVersion, { window: true }));
    actions.push(...counterAbilityActions(playerView, seat, stateVersion));
  }

  // 6. Clash steps the defender owes a decision (504.2c).
  if (phase.name === "clash" && playerView.clash && playerView.clash.step === "obstruct") {
    const defender = playerView.cards.find(
      (card) => card.instanceId === playerView.clash?.targetId,
    )?.controller;
    if (defender === seat) {
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
            required: false,
            role: "defender",
            entityKinds: ["card"],
            min: 0,
            // The schema requires max to fit the enabled candidates; a
            // defender with fewer than 8 ready Clash cards would otherwise
            // get an unparsable view and be unable to act (rule 504.2c).
            max: Math.min(8, readyClashCandidates(playerView, seat).length),
            ordered: false,
            candidates: readyClashCandidates(playerView, seat),
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
    pendingChoicesForSeat(playerView, seat).length === 0
  ) {
    if (playerView.clash.step === "beforeDamage") {
      // Rule 504.2f (v8.0): the attacking player has priority for effects
      // before damage; both seats may pass and the engine validates the
      // order (damage only after the attacker has passed).
      actions.push(simpleAction("passClashStep", "pass", "Pass", stateVersion));
    } else {
      const stepSeat =
        playerView.clash.step === "attackerBuff"
          ? playerView.cards.find((card) => card.instanceId === playerView.clash?.attackerId)
              ?.controller
          : playerView.cards.find((card) => card.instanceId === playerView.clash?.targetId)
              ?.controller;
      if (stepSeat === seat) {
        actions.push(...clashBuffActions(playerView, seat, stateVersion));
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
        text: { key: "Concede the match?" },
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
    status: statusFor(playerView, seat),
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
      if (typeof values.confirm === "boolean") {
        payload.optionId = values.confirm ? "yes" : "no";
      } else if (
        typeof values.selection === "string" ||
        typeof values.selection === "number" ||
        typeof values.selection === "boolean"
      ) {
        payload.optionId = String(values.selection);
      } else if (typeof values.count === "number") {
        payload.optionId = String(Math.trunc(values.count));
      } else if (values.allocation !== undefined) {
        payload.division = allocationDivision(values.allocation);
      }
      return { moveType, payload };
    }
    case "playCard":
    case "respond": {
      const payload: NativePayload = { cardId: args[0] ?? "" };
      if (targetId) payload.targetId = targetId;
      const targetIds = stringList("targetIds");
      if (targetIds) payload.targetIds = targetIds;
      if (xValue !== undefined) payload.xValue = xValue;
      const alternate = stringList("alternateCostSacrificeIds");
      if (alternate) payload.alternateCostSacrificeIds = alternate;
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
          ...(stringList("targetIds") ? { targetIds: stringList("targetIds") } : {}),
          ...(xValue !== undefined ? { xValue } : {}),
        },
      };
    case "attachWeapon":
      return { moveType, payload: { weaponId: args[0] ?? "", targetId: targetId ?? "" } };
    case "detachWeapon":
      return { moveType, payload: { weaponId: args[0] ?? "" } };
    case "initiateClash":
      return {
        moveType,
        payload: {
          attackerId: singleEntity(values.attackerId) ?? "",
          targetId: singleEntity(values.targetId) ?? "",
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
    case "mulligan":
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

function choiceAction(choice: PendingChoice, stateVersion: number): InteractionAction {
  const id = `resolveChoice:${choice.id}`;
  const base = {
    id,
    requestId: requestId(stateVersion, id),
    intent: "choose-option" as const,
    text: { key: choice.prompt },
    enabled: true,
  };
  switch (choice.kind) {
    case "option":
      return {
        ...base,
        inputs: [
          {
            kind: "boolean",
            id: "confirm",
            text: { key: choice.prompt },
            required: true,
            trueText: { key: choice.options.find((option) => option.id === "yes")?.label ?? "Yes" },
            falseText: { key: choice.options.find((option) => option.id === "no")?.label ?? "No" },
          },
        ],
      };
    case "modal":
      return {
        ...base,
        inputs: [
          {
            kind: "option-selection",
            id: "selection",
            text: { key: choice.prompt },
            required: true,
            min: 1,
            max: 1,
            options: choice.options.map((option): InteractionOption => ({
              id: option.id,
              text: { key: option.label },
              enabled: true,
            })),
          },
        ],
      };
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
          },
        ],
      };
    case "count":
      return {
        ...base,
        inputs: [
          {
            kind: "number",
            id: "count",
            text: { key: choice.prompt },
            required: true,
            min: 0,
            max: choice.max,
            step: 1,
          },
        ],
      };
    case "division":
      return {
        ...base,
        inputs: [
          {
            kind: "entity-allocation",
            id: "allocation",
            text: { key: `${choice.prompt} (divide ${choice.total} damage)` },
            required: true,
            role: "target",
            entityKinds: ["card"],
            totalMin: choice.total,
            totalMax: choice.total,
            candidates: choice.candidates.map((candidateId) => ({
              entity: entityRef(candidateId),
              enabled: true,
              min: 1,
              max: Math.max(1, choice.total),
            })),
          },
        ],
      };
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
  options: { window: boolean },
): InteractionAction[] {
  const actions: InteractionAction[] = [];
  for (const card of handCards(playerView, seat)) {
    if (!card.definitionId) continue;
    const definition = safeDefinition(card.definitionId);
    if (!definition) continue;

    if (options.window) {
      // Counter windows accept Counter-tagged Quick Actions, Trap
      // activations, and Ambush entrances (304.7, 704.17h).
      const tag = counterTagForWindow(playerView);
      if (!tag) continue;
      const tags = (definition as { counterTags?: readonly AcCounterTag[] }).counterTags;
      const isAmbush =
        definition.cardType === "clash" && definition.keywords?.includes("ambush") === true;
      const usable =
        (definition.cardType === "action" &&
          definition.subtype === "quick" &&
          tags?.includes(tag) === true) ||
        (definition.cardType === "accessory" &&
          (definition.subtype === "trap" || isAmbushCard(definition)) &&
          tags?.includes(tag) === true) ||
        isAmbush;
      if (!usable) continue;
      const inputs = chosenTargetInputs(definition, playerView, seat, { hand: true });
      if (inputs.some((candidate) => requiredInputEmpty(candidate))) continue;
      actions.push({
        id: `respond:${card.instanceId}`,
        requestId: requestId(stateVersion, `respond:${card.instanceId}`),
        intent: "play-card",
        text: { key: isAmbush ? `Ambush ${definition.name}` : `Counter with ${definition.name}` },
        enabled: true,
        inputs,
      });
      continue;
    }

    if (definition.cardType === "contender") continue;
    const inputs = playInputs(definition, playerView, seat);
    if (inputs.some((candidate) => requiredInputEmpty(candidate))) continue;
    actions.push({
      id: `playCard:${card.instanceId}`,
      requestId: requestId(stateVersion, `playCard:${card.instanceId}`),
      intent: "play-card",
      text: {
        key: `Play ${definition.name} (${costLabel(definition)})`,
      },
      enabled: true,
      inputs,
    });
    if (canSet(definition)) {
      actions.push({
        id: `setCard:${card.instanceId}`,
        requestId: requestId(stateVersion, `setCard:${card.instanceId}`),
        intent: "move-card",
        text: { key: `Set ${definition.name} face down` },
        enabled: true,
        inputs: [],
      });
    }
  }
  return actions;
}

function playInputs(
  definition: AcCardDefinition,
  playerView: ProjectedState,
  seat: Seat,
): InteractionInput[] {
  const inputs = chosenTargetInputs(definition, playerView, seat, { hand: true });
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
  if (definition.cardType === "clash" && definition.alternateCost) {
    inputs.push({
      kind: "entity-selection",
      id: "alternateCostSacrificeIds",
      text: {
        key: `Or pay by sending ${definition.alternateCost.send.amount} Clash card(s) to Oblivion`,
      },
      required: false,
      role: "cost",
      entityKinds: ["card"],
      min: definition.alternateCost.send.amount,
      max: definition.alternateCost.send.amount,
      ordered: false,
      candidates: cardsWhere(playerView, (card, cardDefinition) => {
        void cardDefinition;
        return (
          card.controller === seat &&
          card.zone === "clash" &&
          safeDefinition(card.definitionId)?.cardType === "clash"
        );
      }),
    });
  }
  return inputs;
}

/** Chosen card selectors need play-time candidates (rule 113.6b). */
function chosenTargetInputs(
  definition: AcCardDefinition,
  playerView: ProjectedState,
  seat: Seat,
  _context: { hand: boolean },
): InteractionInput[] {
  const inputs: InteractionInput[] = [];
  const targets = chosenTargetsOf(definition);
  let index = 0;
  for (const target of targets) {
    const id = index === 0 ? "targetId" : `targetIds`;
    inputs.push({
      kind: "entity-selection",
      id,
      text: { key: target.label ?? "Choose a target" },
      required: true,
      role: "target",
      entityKinds: ["card"],
      min: 1,
      max: 1,
      ordered: false,
      candidates: candidatesForTarget(playerView, seat, target),
    });
    index += 1;
  }
  return inputs;
}

function initiateClashAction(
  playerView: ProjectedState,
  seat: Seat,
  other: Seat,
  stateVersion: number,
): InteractionAction | null {
  const targets: EntityCandidate[] = [
    ...contenderCandidates(playerView, other),
    ...readyClashCandidates(playerView, other),
  ];
  const attackers = readyClashCandidates(playerView, seat);
  if (attackers.length === 0 || targets.length === 0) return null;
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
        text: { key: "Choose an engaged attacker" },
        required: true,
        role: "attacker",
        entityKinds: ["card"],
        min: 1,
        max: 1,
        ordered: false,
        candidates: readyClashCandidates(playerView, seat),
      },
      {
        kind: "entity-selection",
        id: "targetId",
        text: { key: "Choose the clash target" },
        required: true,
        role: "defender",
        entityKinds: ["card"],
        min: 1,
        max: 1,
        ordered: false,
        candidates: targets,
      },
    ],
  };
}

/** C4/C5 (504.2d-e): the acting player may play one Clash Buff. */
function clashBuffActions(
  playerView: ProjectedState,
  seat: Seat,
  stateVersion: number,
): InteractionAction[] {
  const actions: InteractionAction[] = [];
  for (const card of handCards(playerView, seat)) {
    if (!card.definitionId) continue;
    const definition = safeDefinition(card.definitionId);
    if (definition?.cardType !== "action" || definition.subtype !== "clash-buff") continue;
    const inputs = playInputs(definition, playerView, seat);
    if (inputs.some((candidate) => requiredInputEmpty(candidate))) continue;
    actions.push({
      id: `playCard:${card.instanceId}`,
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
    if (card.controller !== seat || card.zone !== "accessory" || card.faceDown) continue;
    const definition = card.definitionId ? safeDefinition(card.definitionId) : undefined;
    if (!definition) continue;
    if (definition.cardType === "accessory" && definition.subtype === "weapon") {
      const candidates = cardsWhere(
        playerView,
        (owned, def) => def.cardType === "clash" && owned.controller === seat,
      );
      if (candidates.length === 0) continue;
      actions.push({
        id: `attachWeapon:${card.instanceId}`,
        requestId: requestId(stateVersion, `attachWeapon:${card.instanceId}`),
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

function counterAbilityActions(
  playerView: ProjectedState,
  seat: Seat,
  stateVersion: number,
): InteractionAction[] {
  const actions: InteractionAction[] = [];
  const tag = counterTagForWindow(playerView);
  if (!tag) return actions;
  for (const card of playerView.cards) {
    if (card.controller !== seat || !card.definitionId) continue;
    const definition = safeDefinition(card.definitionId);
    if (!definition) continue;
    // Activated abilities exist on Contenders, Clash cards, Clashgrounds,
    // and Accessories; Actions resolve through play/respond instead.
    const abilities = definition.cardType === "action" ? [] : (definition.abilities ?? []);
    const abilityCounter = windowTagToAbilityCounter(tag);
    abilities.forEach((ability, abilityIndex) => {
      if (ability.kind !== "activated") return;
      if (ability.counter !== abilityCounter) return;
      const fromHere =
        card.zone === "hand"
          ? ability.activation === "hand"
          : IN_PLAY_ZONES.includes(card.zone) ||
            (card.zone === "oblivion" && ability.activation === "oblivion");
      if (!fromHere) return;
      const inputs = chosenTargetInputs(definition, playerView, seat, {
        hand: card.zone === "hand",
      });
      if (inputs.some((candidate) => requiredInputEmpty(candidate))) return;
      actions.push({
        id: `activateAbility:${card.instanceId}:${abilityIndex}`,
        requestId: requestId(stateVersion, `activateAbility:${card.instanceId}:${abilityIndex}`),
        intent: "activate",
        text: { key: ability.text },
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
    if (target.cardTypes && !target.cardTypes.includes(definition.cardType)) return false;
    const affiliation = (definition as { affiliation?: string }).affiliation;
    if (target.affiliations && !target.affiliations.some((a) => affiliation === a)) {
      return false;
    }
    if (
      target.subtypes &&
      !target.subtypes.some((s) => (definition as { subtype?: string }).subtype === s)
    ) {
      return false;
    }
    if (target.nameIncludes && !definition.name.includes(target.nameIncludes)) return false;
    if (target.tokenOnly && !card.instanceId.startsWith("token-")) return false;
    return true;
  });
  return cards;
}

type PlayTarget = Extract<AcTarget, { type: "card" }> & { label?: string };

function chosenTargetsOf(definition: AcCardDefinition): PlayTarget[] {
  const found: PlayTarget[] = [];
  const walk = (effects: readonly { type: string; target?: unknown }[] | undefined): void => {
    if (!effects) return;
    for (const effect of effects) {
      const target = effect.target as AcTarget | undefined;
      if (target && target.type === "card" && (target as { chosen?: boolean }).chosen === true) {
        found.push(target as PlayTarget);
      }
    }
  };
  for (const effects of effectTreesOf(definition)) {
    walk(effects as readonly { type: string; target?: unknown }[]);
  }
  return found;
}

/** Effect trees carried by a definition: Actions carry one top-level tree. */
function effectTreesOf(definition: AcCardDefinition): readonly (readonly AcEffect[])[] {
  if (definition.cardType === "action") return [definition.effects];
  const trees: (readonly AcEffect[])[] = [];
  for (const ability of definition.abilities ?? []) {
    if ("effects" in ability && Array.isArray(ability.effects)) {
      trees.push(ability.effects);
    }
  }
  return trees;
}

function cardsWhere(
  playerView: ProjectedState,
  predicate: (card: ProjectedState["cards"][number], definition: AcCardDefinition) => boolean,
): EntityCandidate[] {
  const candidates: EntityCandidate[] = [];
  for (const card of playerView.cards) {
    if (!IN_PLAY_ZONES.includes(card.zone) && card.zone !== "hand") continue;
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
    input.kind === "entity-selection" && input.required === true && input.candidates.length === 0
  );
}

function isAmbushCard(definition: AcCardDefinition): boolean {
  return definition.cardType === "clash" && definition.keywords?.includes("ambush") === true;
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
  if (definition.cardType === "accessory") return definition.subtype === "trap";
  if (definition.cardType === "clash") return definition.keywords?.includes("ambush") === true;
  return false;
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

function statusFor(playerView: ProjectedState, seat: Seat): EngineInteractionView["status"] {
  if (playerView.phase.name === "complete") return "game-over";
  if (pendingChoicesForSeat(playerView, seat).length > 0) return "choosing";
  const isActive = playerView.activePlayer === seat;
  if (isActive || playerView.responseWindow?.openFor === seat) return "ready";
  return "waiting";
}

function requestId(stateVersion: number, id: string): string {
  return `alpha-clash:${stateVersion}:${id}`;
}

export type { AcCardType };
