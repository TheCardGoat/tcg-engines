import type {
  LogCardReference,
  LorcanaCardSnapshot,
  LorcanaPlayerSide,
  ActionCandidate,
  MoveLogEntrySnapshot,
} from "@/features/simulator/model/contracts.js";

// ============================================================================
// Card Factories
// ============================================================================

export interface CardFactoryOptions {
  id?: string;
  name?: string;
  cost?: number;
  type?: "character" | "action" | "item" | "location";
  facePresentation?: "faceUp" | "faceDown";
  inkType?: string[];
  inkable?: boolean;
  strength?: number;
  willpower?: number;
  loreValue?: number;
  damage?: number;
  readyState?: "ready" | "exerted";
  isDrying?: boolean;
  text?: string;
  textEntries?: LorcanaCardSnapshot["textEntries"];
  keywords?: string[];
  // Card image properties
  set?: string;
  cardNumber?: number;
}

let cardIdCounter = 0;

export function createCardSnapshot(
  ownerSide: LorcanaPlayerSide,
  zoneId: "hand" | "play" | "inkwell" | "discard" | "deck",
  options: CardFactoryOptions = {},
): LorcanaCardSnapshot {
  const id = options.id ?? `card-${++cardIdCounter}`;
  const type = options.type ?? "character";

  return {
    cardId: id,
    definitionId: `test-${nameToId(options.name ?? "Card")}-${options.cost ?? 1}`,
    isMasked: false,
    label: options.name ?? `Test Card ${cardIdCounter}`,
    ownerId: ownerSide,
    ownerSide,
    zoneId,
    facePresentation: options.facePresentation ?? (zoneId === "inkwell" ? "faceDown" : "faceUp"),
    cardType: type,
    cost: options.cost ?? 1,
    inkType: options.inkType ?? ["amber"],
    inkable: options.inkable ?? true,
    keywords: options.keywords ?? [],
    text: options.text ?? "Test card text.",
    textEntries: options.textEntries ? [...options.textEntries] : [],
    strength: options.strength ?? (type === "character" ? 2 : undefined),
    baseStrength: options.strength ?? (type === "character" ? 2 : undefined),
    willpower: options.willpower ?? (type === "character" ? 3 : undefined),
    baseWillpower: options.willpower ?? (type === "character" ? 3 : undefined),
    loreValue: options.loreValue ?? (type === "character" ? 1 : undefined),
    baseLoreValue: options.loreValue ?? (type === "character" ? 1 : undefined),
    damage: options.damage ?? 0,
    readyState: options.readyState ?? "ready",
    isDrying: options.isDrying ?? false,
    cardsUnderCount: 0,
    hasQuestRestriction: false,
    // Card image properties
    set: options.set,
    cardNumber: options.cardNumber,
  };
}

export function createCharacterCard(
  ownerSide: LorcanaPlayerSide,
  zoneId: "hand" | "play" | "inkwell" | "discard" | "deck",
  options: Omit<CardFactoryOptions, "type"> = {},
): LorcanaCardSnapshot {
  return createCardSnapshot(ownerSide, zoneId, { ...options, type: "character" });
}

export function createActionCard(
  ownerSide: LorcanaPlayerSide,
  zoneId: "hand" | "discard" | "deck",
  options: Omit<CardFactoryOptions, "type"> = {},
): LorcanaCardSnapshot {
  return createCardSnapshot(ownerSide, zoneId, { ...options, type: "action" });
}

export function createLogCardReference(
  ownerSide: LorcanaPlayerSide,
  options: CardFactoryOptions = {},
): LogCardReference {
  const id = options.id ?? `card-${++cardIdCounter}`;
  return {
    cardId: id,
    definitionId: `test-${nameToId(options.name ?? "Card")}-${options.cost ?? 1}`,
    label: options.name ?? `Test Card ${cardIdCounter}`,
    inkType: options.inkType ?? ["amber"],
    inkable: options.inkable ?? true,
    isMasked: false,
    ownerSide,
  };
}

// ============================================================================
// Hand Factories
// ============================================================================

export function createHand(
  ownerSide: LorcanaPlayerSide,
  count: number,
  options: CardFactoryOptions = {},
): LorcanaCardSnapshot[] {
  return Array.from({ length: count }, (_, i) =>
    createCardSnapshot(ownerSide, "hand", {
      name: `Hand Card ${i + 1}`,
      ...options,
    }),
  );
}

// ============================================================================
// Board (Play Area) Factories
// ============================================================================

export function createBoardCharacters(
  ownerSide: LorcanaPlayerSide,
  count: number,
  options: Omit<CardFactoryOptions, "type"> = {},
): LorcanaCardSnapshot[] {
  return Array.from({ length: count }, (_, i) =>
    createCharacterCard(ownerSide, "play", {
      name: `Character ${i + 1}`,
      ...options,
    }),
  );
}

export function createInkwell(ownerSide: LorcanaPlayerSide, count: number): LorcanaCardSnapshot[] {
  return Array.from({ length: count }, (_, i) =>
    createCardSnapshot(ownerSide, "inkwell", {
      name: `Ink ${i + 1}`,
      type: "action",
      inkType: ["amber"],
    }),
  );
}

export function createDiscard(ownerSide: LorcanaPlayerSide, count: number): LorcanaCardSnapshot[] {
  return Array.from({ length: count }, (_, i) =>
    createCardSnapshot(ownerSide, "discard", {
      name: `Discarded ${i + 1}`,
    }),
  );
}

// ============================================================================
// Action Candidate Factories
// ============================================================================

export function createActionCandidate(
  id: string,
  label: string,
  enabled: boolean = true,
  options: Partial<ActionCandidate> = {},
): ActionCandidate {
  return {
    id: id as ActionCandidate["id"],
    label,
    enabled,
    reason: enabled ? undefined : "This action is not available right now.",
    moveId: options.moveId,
    params: options.params,
    ...options,
  };
}

export function createDefaultActions(enabled: boolean = true): ActionCandidate[] {
  return [
    createActionCandidate("play-card", "Play Card", enabled, { moveId: "playCard" }),
    createActionCandidate("ink-card", "Ink Card", enabled, {
      moveId: "putCardIntoInkwell",
    }),
    createActionCandidate("quest", "Quest", enabled, { moveId: "quest" }),
    createActionCandidate("challenge", "Challenge", enabled, { moveId: "challenge" }),
    createActionCandidate("pass-turn", "Pass Turn", enabled, { moveId: "passTurn" }),
  ];
}

// ============================================================================
// Log Entry Factories
// ============================================================================

let logIdCounter = 0;

export function createLogEntry(
  title: string,
  options: Partial<MoveLogEntrySnapshot> = {},
): MoveLogEntrySnapshot {
  return {
    id: `log-${++logIdCounter}`,
    timestamp: Date.now() - Math.floor(Math.random() * 60000),
    moveId: options.moveId ?? "passTurn",
    actorSide: options.actorSide ?? "playerOne",
    title,
    ...options,
    turnNumber: options.turnNumber ?? 1,
  };
}

export function createSampleLog(count: number = 5): MoveLogEntrySnapshot[] {
  const moveIds = [
    "passTurn",
    "playCard",
    "quest",
    "challenge",
    "putCardIntoInkwell",
    "passTurn",
  ] as const satisfies readonly MoveLogEntrySnapshot["moveId"][];
  const actions = [
    { title: "Drew a card" },
    { title: "Played a card" },
    { title: "Quested" },
    { title: "Challenged" },
    { title: "Put into inkwell" },
    { title: "Passed turn" },
  ];

  return actions.slice(0, count).map((action, i) =>
    createLogEntry(action.title, {
      actorSide: i % 2 === 0 ? "playerOne" : "playerTwo",
      moveId: moveIds[i] ?? "passTurn",
    }),
  );
}

// ============================================================================
// Complete Game State Factories
// ============================================================================

export interface PlayerState {
  name: string;
  side: LorcanaPlayerSide;
  lore: number;
  hand: LorcanaCardSnapshot[];
  play: LorcanaCardSnapshot[];
  inkwell: LorcanaCardSnapshot[];
  discard: LorcanaCardSnapshot[];
  deckCount: number;
  handCount: number;
}

export function createPlayerState(
  side: LorcanaPlayerSide,
  options: {
    name?: string;
    lore?: number;
    handCount?: number;
    playCount?: number;
    inkwellCount?: number;
    discardCount?: number;
    deckCount?: number;
  } = {},
): PlayerState {
  const hand = createHand(side, options.handCount ?? 5);
  return {
    name: options.name ?? (side === "playerOne" ? "Player One" : "Player Two"),
    side,
    lore: options.lore ?? 0,
    hand,
    play: createBoardCharacters(side, options.playCount ?? 2),
    inkwell: createInkwell(side, options.inkwellCount ?? 4),
    discard: createDiscard(side, options.discardCount ?? 2),
    deckCount: options.deckCount ?? 40,
    handCount: hand.length,
  };
}

// ============================================================================
// Utilities
// ============================================================================

function nameToId(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function maskCards(cards: LorcanaCardSnapshot[]): LorcanaCardSnapshot[] {
  return cards.map((card) => ({
    ...card,
    isMasked: true,
    label: "???",
    cardType: undefined,
    cost: undefined,
    strength: undefined,
    willpower: undefined,
    loreValue: undefined,
    text: undefined,
  }));
}
