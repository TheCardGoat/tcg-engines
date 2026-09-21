import type { AcCommand, MatchState, PlayerId } from "@tcg/alpha-clash-engine";
import { getCard } from "@tcg/alpha-clash-cards";

/**
 * Deterministic practice-bot policy for Alpha Clash. This is simulator
 * automation, not a rules authority: every command it proposes goes through
 * the engine's dispatch boundary, which rejects anything illegal.
 *
 * Policy, in priority order:
 * 1. Resolve a pending choice owned by the seat (safe defaults).
 * 2. Pass an open response window (declining counters).
 * 3. Declare one obstructor during the Obstruct Step when possible.
 * 4. In the Resource Step, deploy the first hand card.
 * 5. In Primary, play the cheapest affordable card, then end the turn;
 *    start the clash when a ready attacker exists.
 */
export function alphaClashBotCommand(state: MatchState, seat: PlayerId): AcCommand | null {
  const choice = state.pendingChoices.find((entry) => entry.playerId === seat);
  if (choice) return resolveChoiceCommand(choice);

  if (state.responseWindow) {
    if (state.responseWindow.openFor !== seat) return null;
    const counter = counterCommand(state, seat);
    return counter ?? { type: "pass", playerId: seat };
  }

  const phase = state.phase;
  if (phase.name === "setup") {
    return { type: "startGame" };
  }

  if (state.clash) {
    if (phase.name === "clash" && state.clash.step === "obstruct") {
      const defender = state.cards[state.clash.targetId]?.controller;
      if (defender === seat) {
        const obstructor = firstReadyClash(state, seat);
        return obstructor
          ? { type: "declareObstructors", playerId: seat, obstructorIds: [obstructor] }
          : { type: "pass", playerId: seat };
      }
    }
    return { type: "pass", playerId: seat };
  }

  if (phase.name === "expansion" && phase.step === "resource") {
    const hand = cardsInZone(state, seat, "hand");
    const first = hand[0];
    return first
      ? { type: "deployResource", playerId: seat, cardId: first }
      : { type: "pass", playerId: seat };
  }

  if (phase.name === "primary") {
    const attacker = firstReadyClash(state, seat);
    if (attacker) {
      const opponentContender = contenderOf(state, other(seat));
      if (opponentContender) {
        return {
          type: "initiateClash",
          playerId: seat,
          attackerId: attacker,
          targetId: opponentContender,
        };
      }
    }
    const play = cheapestPlayableCommand(state, seat);
    if (play) return play;
    return { type: "endTurn", playerId: seat };
  }

  return null;
}

function resolveChoiceCommand(choice: MatchState["pendingChoices"][number]): AcCommand {
  const base = { type: "resolveChoice" as const, playerId: choice.playerId, choiceId: choice.id };
  switch (choice.kind) {
    case "option":
      // Declining is always safe for optional triggers.
      return { ...base, optionId: "no" };
    case "modal":
      return { ...base, optionId: choice.options[0]?.id ?? "0" };
    case "target":
      return { ...base, optionId: choice.candidates[0] };
    case "count":
      return { ...base, optionId: "0" };
    case "division":
      return { ...base, division: {} };
    default:
      return { ...base, optionId: "no" };
  }
}

function counterCommand(state: MatchState, seat: PlayerId): AcCommand | null {
  const tag = state.responseWindow?.kind;
  if (!tag) return null;
  // Set face-down Traps and Ambush copies respond from the Accessory Zone.
  for (const card of cardsInZone(state, seat, "accessory")) {
    if (!state.cards[card]?.faceDown) continue;
    const definition = definitionOf(state, card);
    if (!definition) continue;
    const tags = (definition as { counterTags?: readonly string[] }).counterTags ?? [];
    if (tags.includes(tag)) return { type: "respond", playerId: seat, cardId: card };
  }
  for (const card of cardsInZone(state, seat, "hand")) {
    const definition = definitionOf(state, card);
    if (!definition) continue;
    if (definition.cardType === "action" && definition.subtype === "quick") {
      if ((definition.counterTags ?? []).includes(tag)) {
        return { type: "respond", playerId: seat, cardId: card };
      }
    }
    if (
      definition.cardType === "clash" &&
      definition.keywords?.includes("ambush") === true &&
      (definition.counterTags ?? []).includes(tag)
    ) {
      return { type: "respond", playerId: seat, cardId: card };
    }
  }
  return null;
}

function cheapestPlayableCommand(state: MatchState, seat: PlayerId): AcCommand | null {
  const readyResources = readyResourceCount(state, seat);
  const hand = cardsInZone(state, seat, "hand");
  const playable = hand
    .map((cardId) => ({ cardId, definition: definitionOf(state, cardId) }))
    .filter(
      (
        entry,
      ): entry is { cardId: string; definition: NonNullable<ReturnType<typeof definitionOf>> } =>
        entry.definition !== undefined &&
        entry.definition.cardType !== "contender" &&
        !((entry.definition as { cost?: { total?: number } }).cost?.total === undefined),
    )
    .sort(
      (left, right) =>
        ((left.definition as { cost?: { total?: number } }).cost?.total ?? 0) -
        ((right.definition as { cost?: { total?: number } }).cost?.total ?? 0),
    );
  for (const entry of playable) {
    const cost = (entry.definition as { cost?: { total?: number } }).cost?.total ?? 0;
    if (cost > readyResources) continue;
    if ((entry.definition as { cost?: { x?: boolean } }).cost?.x) continue;
    return { type: "playCard", playerId: seat, cardId: entry.cardId };
  }
  return null;
}

function readyResourceCount(state: MatchState, seat: PlayerId): number {
  return Object.values(state.cards).filter(
    (card) => card.controller === seat && card.zone === "resource" && card.ready,
  ).length;
}

function firstReadyClash(state: MatchState, seat: PlayerId): string | undefined {
  return cardsInZone(state, seat, "clash").find((cardId) => {
    const card = state.cards[cardId];
    if (!card?.ready) return false;
    // Attached Weapons share the Clash Zone but are not Clash cards and
    // can neither attack nor obstruct (rules 504.2c / 506.1).
    return definitionOf(state, cardId)?.cardType === "clash";
  });
}

function contenderOf(state: MatchState, seat: PlayerId): string | undefined {
  return cardsInZone(state, seat, "contender")[0];
}

function cardsInZone(
  state: MatchState,
  seat: PlayerId,
  zone: MatchState["cards"][string]["zone"],
): string[] {
  return Object.values(state.cards)
    .filter((card) => card.controller === seat && card.zone === zone)
    .map((card) => card.instanceId);
}

function definitionOf(state: MatchState, cardId: string) {
  const card = state.cards[cardId];
  if (!card) return undefined;
  return state.definitions[card.definitionId] ?? tryCatalog(card.definitionId);
}

function tryCatalog(definitionId: string) {
  try {
    return getCard(definitionId);
  } catch {
    return undefined;
  }
}

function other(seat: PlayerId): PlayerId {
  return seat === "player-one" ? "player-two" : "player-one";
}

export function alphaClashBotCommandCandidates(state: MatchState, seat: PlayerId): AcCommand[] {
  const primary = alphaClashBotCommand(state, seat);
  const fallbacks: AcCommand[] = [];
  if (state.phase.name === "primary" && !state.pendingChoices.length) {
    fallbacks.push({ type: "endTurn", playerId: seat });
  }
  fallbacks.push({ type: "pass", playerId: seat });
  return primary ? [primary, ...fallbacks] : fallbacks;
}
