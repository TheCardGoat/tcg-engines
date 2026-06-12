import { getCard } from "../../cards/src/index.ts";
import type { LeaderCard } from "@tcg/op-types";
import {
  cardName,
  emitEvent,
  emitLog,
  getCardForInstance,
  getInstance,
  getPlayer,
  leaderLife,
  nextIdentifier,
  shuffle,
} from "./shared.ts";
import type {
  CardInstance,
  CardZone,
  ChoiceKind,
  MatchSeat,
  MatchState,
  ModifierState,
  PlayerState,
  PromptState,
} from "./types.ts";

const DEFAULT_DON_DECK_COUNT = 10;

function removeFromList(list: string[], value: string) {
  const index = list.indexOf(value);
  if (index >= 0) {
    list.splice(index, 1);
  }
}

function reindexLinearZone(
  state: MatchState,
  seat: MatchSeat,
  zone: "deck" | "hand" | "life" | "trash",
) {
  const player = getPlayer(state, seat);
  for (const [index, instanceId] of player[zone].entries()) {
    const instance = getInstance(state, instanceId);
    instance.zone = zone;
    instance.zoneIndex = index;
  }
}

function describeHiddenCard(state: MatchState, instanceId: string): string {
  const instance = getInstance(state, instanceId);
  if (instance.publicKnowledge || instance.zone === "leader" || instance.zone === "character") {
    return cardName(getCardForInstance(state, instanceId));
  }

  return "a hidden card";
}

function removeFromCurrentZone(state: MatchState, instanceId: string) {
  const instance = getInstance(state, instanceId);
  const player = getPlayer(state, instance.owner);

  switch (instance.zone) {
    case "deck":
      removeFromList(player.deck, instanceId);
      reindexLinearZone(state, instance.owner, "deck");
      break;
    case "hand":
      removeFromList(player.hand, instanceId);
      reindexLinearZone(state, instance.owner, "hand");
      break;
    case "life":
      removeFromList(player.life, instanceId);
      reindexLinearZone(state, instance.owner, "life");
      break;
    case "trash":
      removeFromList(player.trash, instanceId);
      reindexLinearZone(state, instance.owner, "trash");
      break;
    case "character":
      if (player.characterArea[instance.zoneIndex] === instanceId) {
        player.characterArea[instance.zoneIndex] = null;
      } else {
        const fallback = player.characterArea.indexOf(instanceId);
        if (fallback >= 0) {
          player.characterArea[fallback] = null;
        }
      }
      break;
    case "stage":
      if (player.stageArea === instanceId) {
        player.stageArea = null;
      }
      break;
    case "leader":
      break;
  }
}

function placeInZone(
  state: MatchState,
  instanceId: string,
  owner: MatchSeat,
  zone: CardZone,
  options: {
    slotIndex?: number;
    deckPosition?: "top" | "bottom";
    faceUp?: boolean;
    publicKnowledge?: boolean;
  } = {},
) {
  const instance = getInstance(state, instanceId);
  const player = getPlayer(state, owner);

  instance.owner = owner;
  instance.controller = owner;
  instance.zone = zone;
  instance.faceUp = options.faceUp ?? (zone !== "deck" && zone !== "life" && zone !== "hand");
  instance.publicKnowledge =
    options.publicKnowledge ??
    (zone === "trash" || zone === "character" || zone === "stage" || zone === "leader");
  instance.zoneIndex = 0;

  switch (zone) {
    case "deck": {
      if (options.deckPosition === "bottom") {
        player.deck.push(instanceId);
      } else {
        player.deck.unshift(instanceId);
      }
      reindexLinearZone(state, owner, "deck");
      break;
    }
    case "hand":
      player.hand.push(instanceId);
      reindexLinearZone(state, owner, "hand");
      break;
    case "life":
      player.life.push(instanceId);
      reindexLinearZone(state, owner, "life");
      break;
    case "trash":
      player.trash.push(instanceId);
      reindexLinearZone(state, owner, "trash");
      break;
    case "character": {
      const slotIndex =
        options.slotIndex ?? player.characterArea.findIndex((entry) => entry === null);
      if (slotIndex < 0 || slotIndex >= player.characterArea.length) {
        throw new Error(`No open character slot for ${instanceId}`);
      }
      player.characterArea[slotIndex] = instanceId;
      instance.zoneIndex = slotIndex;
      instance.faceUp = true;
      instance.publicKnowledge = true;
      break;
    }
    case "stage":
      player.stageArea = instanceId;
      instance.zoneIndex = 0;
      instance.faceUp = true;
      instance.publicKnowledge = true;
      break;
    case "leader":
      instance.zoneIndex = 0;
      instance.faceUp = true;
      instance.publicKnowledge = true;
      break;
  }
}

export function moveCard(
  state: MatchState,
  instanceId: string,
  owner: MatchSeat,
  zone: CardZone,
  options: Parameters<typeof placeInZone>[4] & {
    actor?: MatchSeat | "judge" | "system";
    eventId?: string | null;
    sourceInstanceId?: string | null;
    visibility?: "public" | "private" | "judge";
    privateMessages?: Partial<Record<MatchSeat, string>>;
    judgeMessage?: string | null;
    suppressLog?: boolean;
  } = {},
) {
  const previous = {
    owner: getInstance(state, instanceId).owner,
    zone: getInstance(state, instanceId).zone,
    description: describeHiddenCard(state, instanceId),
  };
  removeFromCurrentZone(state, instanceId);
  placeInZone(state, instanceId, owner, zone, options);
  const next = getInstance(state, instanceId);
  emitEvent(state, "cardMoved", options.actor ?? "system", {
    sourceCardId: next.cardId,
    sourceInstanceId: instanceId,
    eventId: options.eventId ?? null,
    visibility: options.visibility ?? "public",
    data: {
      fromZone: previous.zone,
      toZone: zone,
      fromOwner: previous.owner,
      toOwner: owner,
    },
  });
  if (!options.suppressLog) {
    emitLog(
      state,
      options.actor ?? "system",
      `${getPlayer(state, owner).playerName} moves ${previous.description} from ${previous.zone} to ${zone}.`,
      {
        sourceCardId: next.cardId,
        sourceInstanceId: instanceId,
        eventId: options.eventId ?? null,
        visibility: options.visibility ?? "public",
        privateMessages: options.privateMessages,
        judgeMessage:
          options.judgeMessage ??
          `${getPlayer(state, owner).playerName} moves ${cardName(getCardForInstance(state, instanceId))} from ${previous.zone} to ${zone}.`,
      },
    );
  }
}

function createInstance(
  state: MatchState,
  owner: MatchSeat,
  cardId: string,
  zone: CardZone,
  zoneIndex: number,
): CardInstance {
  const instance: CardInstance = {
    instanceId: nextIdentifier(state, "card"),
    cardId,
    owner,
    controller: owner,
    zone,
    zoneIndex,
    rested: false,
    attachedDon: 0,
    playedOnTurn: null,
    faceUp: zone !== "deck" && zone !== "life" && zone !== "hand",
    publicKnowledge: zone === "leader",
    usedEffectKeys: [],
  };
  state.cards[instance.instanceId] = instance;
  return instance;
}

export function addModifier(
  state: MatchState,
  sourceInstanceId: string | null,
  targetId: string,
  modifier: Omit<ModifierState, "id" | "sourceInstanceId" | "targetId">,
) {
  const id = nextIdentifier(state, "mod");
  state.modifiers[id] = {
    id,
    sourceInstanceId,
    targetId,
    ...modifier,
  };
}

function removeModifier(state: MatchState, modifierId: string) {
  delete state.modifiers[modifierId];
}

export function cleanupBattleModifiers(state: MatchState, battleId: string) {
  for (const modifier of Object.values(state.modifiers)) {
    if (modifier.expiresAtBattleId === battleId) {
      removeModifier(state, modifier.id);
    }
  }
}

export function cleanupTurnEndModifiers(state: MatchState, turnNumber: number) {
  for (const modifier of Object.values(state.modifiers)) {
    if (modifier.expiresAtTurn === turnNumber) {
      removeModifier(state, modifier.id);
    }
  }
}

function cleanupTurnStartModifiers(state: MatchState, seat: MatchSeat) {
  for (const modifier of Object.values(state.modifiers)) {
    if (modifier.expiresOnTurnStartOfSeat === seat) {
      removeModifier(state, modifier.id);
    }
  }
}

export function getOpenCharacterSlots(state: MatchState, seat: MatchSeat): number[] {
  return getPlayer(state, seat).characterArea.flatMap((instanceId, index) =>
    instanceId ? [] : [index],
  );
}

export function createPrompt(
  state: MatchState,
  prompt: Omit<PromptState, "id" | "status">,
): PromptState {
  const nextPrompt: PromptState = {
    id: nextIdentifier(state, "prompt"),
    status: "pending",
    ...prompt,
  };
  state.promptQueue.push(nextPrompt);
  emitEvent(state, "promptCreated", prompt.seat === "judge" ? "judge" : "system", {
    sourceCardId: prompt.sourceCardId,
    sourceInstanceId: prompt.sourceInstanceId,
    eventId: prompt.eventId,
    visibility: prompt.seat === "judge" ? "judge" : "public",
    data: {
      promptId: nextPrompt.id,
      kind: prompt.kind,
      choiceKind: prompt.choiceKind,
      seat: prompt.seat,
    },
  });
  emitLog(
    state,
    prompt.seat === "judge" ? "judge" : "system",
    prompt.seat === "judge" ? "Judge review required." : prompt.label,
    {
      sourceCardId: prompt.sourceCardId,
      sourceInstanceId: prompt.sourceInstanceId,
      eventId: prompt.eventId,
      visibility: prompt.seat === "judge" ? "judge" : "public",
      judgeMessage: `${prompt.label} ${prompt.details}`.trim(),
    },
  );
  return nextPrompt;
}

export function enqueueJudgePrompt(
  state: MatchState,
  sourceInstanceId: string | null,
  label: string,
  details: string,
  options: {
    issueId?: string | null;
    eventId?: string | null;
  } = {},
) {
  const sourceCardId = sourceInstanceId ? getInstance(state, sourceInstanceId).cardId : null;
  return createPrompt(state, {
    kind: "judge",
    choiceKind: null,
    seat: "judge",
    label,
    details,
    sourceCardId,
    sourceInstanceId,
    eventId: options.eventId ?? null,
    options: [
      {
        id: "ack",
        label: "Acknowledge",
        value: "ack",
      },
    ],
    minSelections: 0,
    maxSelections: 0,
    context: {},
    resolutionContext: {
      intent: "judge",
      issueId: options.issueId ?? null,
    },
  });
}

export function createChoicePrompt(
  state: MatchState,
  prompt: Omit<PromptState, "id" | "status" | "kind"> & {
    choiceKind: ChoiceKind;
  },
): PromptState {
  return createPrompt(state, {
    ...prompt,
    kind: "choice",
  });
}

export function findPendingPrompt(state: MatchState, promptId: string): PromptState | undefined {
  return state.promptQueue.find((prompt) => prompt.id === promptId && prompt.status === "pending");
}

export function formatCardList(state: MatchState, instanceIds: string[]): string {
  return instanceIds
    .map((instanceId) => cardName(getCardForInstance(state, instanceId)))
    .join(", ");
}

export function drawTopCard(state: MatchState, seat: MatchSeat): string | null {
  const player = getPlayer(state, seat);
  const instanceId = player.deck.shift() ?? null;

  if (!instanceId) {
    return null;
  }

  moveCard(state, instanceId, seat, "hand", {
    faceUp: false,
    publicKnowledge: false,
    actor: seat,
    visibility: "private",
    privateMessages: {
      [seat]: `You drew ${cardName(getCardForInstance(state, instanceId))}.`,
    },
    judgeMessage: `${getPlayer(state, seat).playerName} draws ${cardName(getCardForInstance(state, instanceId))}.`,
  });
  return instanceId;
}

export function addDonFromDeck(
  state: MatchState,
  seat: MatchSeat,
  amount: number,
  rested: boolean,
) {
  const player = getPlayer(state, seat);
  const actual = Math.min(amount, player.donDeckCount);

  player.donDeckCount -= actual;
  if (rested) {
    player.restedDon += actual;
  } else {
    player.activeDon += actual;
  }
}

export function drawCards(state: MatchState, seat: MatchSeat, amount: number, reason: string) {
  const drawn: string[] = [];

  for (let index = 0; index < amount; index += 1) {
    const instanceId = drawTopCard(state, seat);
    if (!instanceId) {
      break;
    }
    drawn.push(instanceId);
  }

  if (drawn.length === 0) {
    return;
  }

  emitLog(
    state,
    seat,
    `${getPlayer(state, seat).playerName} draws ${drawn.length} card${drawn.length === 1 ? "" : "s"}.`,
    {
      visibility: "private",
      privateMessages: {
        [seat]: `${reason}: ${formatCardList(state, drawn)}.`,
      },
      judgeMessage: `${getPlayer(state, seat).playerName} draws ${formatCardList(state, drawn)}.`,
    },
  );
}

export function buildInitialPlayerState(
  state: MatchState,
  seat: MatchSeat,
  config: MatchState["config"],
): PlayerState {
  const playerConfig = config.players[seat];
  const leader = getCard(playerConfig.leaderCardId);
  if (leader.cardType !== "leader") {
    throw new Error(`Leader expected for ${seat}, got ${leader.cardType}`);
  }

  const leaderInstance = createInstance(state, seat, leader.id, "leader", 0);
  const deckCardIds = config.shuffleDecks
    ? shuffle(playerConfig.mainDeck, `${config.seed ?? "0"}:${seat}`)
    : [...playerConfig.mainDeck];

  const deckInstances = deckCardIds.map((cardId, index) =>
    createInstance(state, seat, cardId, "deck", index),
  );

  const player: PlayerState = {
    seat,
    playerName: playerConfig.playerName ?? seat[0]!.toUpperCase() + seat.slice(1),
    leaderCardId: leader.id,
    leaderInstanceId: leaderInstance.instanceId,
    deck: deckInstances.map((instance) => instance.instanceId),
    hand: [],
    life: [],
    trash: [],
    characterArea: Array.from({ length: config.maxCharacterSlots }, () => null),
    stageArea: null,
    activeDon: 0,
    restedDon: 0,
    donDeckCount: playerConfig.donDeckCount ?? DEFAULT_DON_DECK_COUNT,
  };

  state.players[seat] = player;

  for (let index = 0; index < leaderLife(leader as LeaderCard); index += 1) {
    const instanceId = player.deck.shift();
    if (!instanceId) {
      throw new Error(`Deck for ${seat} does not have enough cards to build life`);
    }
    placeInZone(state, instanceId, seat, "life", {
      faceUp: false,
      publicKnowledge: false,
    });
  }

  for (let index = 0; index < config.openingHandSize; index += 1) {
    const drawn = drawTopCard(state, seat);
    if (!drawn) {
      break;
    }
  }

  return player;
}

function resetStartOfTurnState(state: MatchState, seat: MatchSeat) {
  const player = getPlayer(state, seat);
  let returningDon = 0;

  for (const instance of Object.values(state.cards)) {
    if (instance.owner !== seat) {
      continue;
    }

    if (instance.zone === "leader" || instance.zone === "character" || instance.zone === "stage") {
      instance.rested = false;
      instance.usedEffectKeys = [];
      if (instance.attachedDon > 0) {
        returningDon += instance.attachedDon;
        instance.attachedDon = 0;
      }
    }
  }

  player.activeDon += player.restedDon + returningDon;
  player.restedDon = 0;
  cleanupTurnStartModifiers(state, seat);
}

export function beginTurn(state: MatchState, seat: MatchSeat, skipDraw: boolean) {
  state.activeSeat = seat;

  state.phase = "refresh";
  emitEvent(state, "phaseChanged", "system", {
    data: {
      seat,
      phase: "refresh",
    },
  });
  emitLog(state, "system", `${getPlayer(state, seat).playerName} enters Refresh.`, {
    visibility: "public",
  });
  resetStartOfTurnState(state, seat);

  state.phase = "draw";
  emitEvent(state, "phaseChanged", "system", {
    data: {
      seat,
      phase: "draw",
    },
  });
  emitLog(state, "system", `${getPlayer(state, seat).playerName} enters Draw.`, {
    visibility: "public",
  });
  if (!skipDraw) {
    drawCards(state, seat, 1, `${getPlayer(state, seat).playerName} draws for turn`);
  }

  state.phase = "don";
  emitEvent(state, "phaseChanged", "system", {
    data: {
      seat,
      phase: "don",
    },
  });
  emitLog(state, "system", `${getPlayer(state, seat).playerName} enters DON!! phase.`, {
    visibility: "public",
  });
  addDonFromDeck(state, seat, 2, false);

  state.phase = "main";
  emitEvent(state, "phaseChanged", "system", {
    data: {
      seat,
      phase: "main",
    },
  });
  emitLog(state, "system", `${getPlayer(state, seat).playerName} enters Main.`, {
    visibility: "public",
  });
}
