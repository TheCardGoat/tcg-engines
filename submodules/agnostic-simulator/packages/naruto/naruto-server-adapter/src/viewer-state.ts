import type {
  CardInstance,
  GameState,
  PlayerId,
  SupportInstance,
} from "@tcg-engines/naruto-engine";

export type NarutoViewer =
  | { role: "player"; actorId: string }
  | { role: "spectator" }
  | { role: "replay" };

export interface NarutoViewerState {
  readonly gameSlug: "naruto";
  readonly stateVersion: number;
  readonly viewer: { readonly role: NarutoViewer["role"]; readonly seat?: PlayerId };
  readonly state: Record<string, unknown>;
}

/**
 * Produce the only state shape allowed to cross the server/browser boundary.
 * It intentionally is not typed as `GameState`: hidden zones contain opaque
 * position tokens instead of engine instances, and the deterministic RNG seed
 * is omitted so a viewer cannot reconstruct a shuffled deck.
 */
export function projectNarutoViewerState(input: {
  state: GameState;
  stateVersion: number;
  seats: Readonly<Record<PlayerId, string>>;
  viewer: NarutoViewer;
}): NarutoViewerState {
  const { state, stateVersion, seats, viewer } = input;
  const viewerSeat = viewer.role === "player" ? seatForActor(seats, viewer.actorId) : undefined;
  if (viewer.role === "player" && viewerSeat === undefined) {
    throw new Error(`Actor ${viewer.actorId} is not seated in this Naruto game.`);
  }
  const scope = viewerSeat ?? viewer.role;

  return {
    gameSlug: "naruto",
    stateVersion,
    viewer: viewerSeat ? { role: viewer.role, seat: viewerSeat } : { role: viewer.role },
    state: {
      rulesProfile: { ...state.rulesProfile },
      turn: state.turn,
      activePlayer: state.activePlayer,
      phase: state.phase,
      step: state.step,
      priority: state.priority,
      pendingAttack: state.pendingAttack ? { ...state.pendingAttack } : null,
      pendingChoice: projectPendingChoice(state, viewerSeat),
      chain: state.chain.map((link) => ({ ...link })),
      resolvingSupport: state.resolvingSupport ? { ...state.resolvingSupport } : null,
      consecutivePasses: state.consecutivePasses,
      awaitingMulligan: state.awaitingMulligan,
      winner: state.winner,
      log: state.log.map((entry) => ({
        ...entry,
        values: entry.values ? { ...entry.values } : undefined,
      })),
      players: {
        p1: projectPlayer(state, "p1", viewerSeat, scope),
        p2: projectPlayer(state, "p2", viewerSeat, scope),
      },
    },
  };
}

function projectPlayer(
  state: GameState,
  owner: PlayerId,
  viewerSeat: PlayerId | undefined,
  scope: string,
): Record<string, unknown> {
  const player = state.players[owner];
  const ownsPrivateZones = owner === viewerSeat;
  return {
    id: player.id,
    name: player.name,
    leaderId: player.leaderId,
    life: player.life,
    leaderRested: player.leaderRested,
    leaderAttacksUsed: player.leaderAttacksUsed,
    leaderCannotAttackUntilTurn: player.leaderCannotAttackUntilTurn,
    deckCount: player.deck.length,
    hand: player.hand.map((card, index) =>
      ownsPrivateZones ? publicCard(card) : hiddenCard(scope, owner, "hand", index),
    ),
    trash: player.trash.map(publicCard),
    characters: player.characters.map((character) => (character ? { ...character } : null)),
    supports: player.supports.map((support, index) =>
      projectSupport(support, owner, ownsPrivateZones, scope, index),
    ),
    chakra: player.chakra.map((chakra, index) =>
      ownsPrivateZones
        ? { ...chakra }
        : {
            uid: opaqueHiddenId(scope, owner, "chakra", index),
            faceUp: chakra.faceUp,
          },
    ),
    exPileCount: player.exPile.length,
    summon: { ...player.summon },
    summonsUsedThisTurn: player.summonsUsedThisTurn,
    leaderUsedThisTurn: player.leaderUsedThisTurn,
    mulliganDone: player.mulliganDone,
    chakraLockedUntilTurn: player.chakraLockedUntilTurn,
  };
}

function projectSupport(
  support: SupportInstance | null,
  owner: PlayerId,
  ownsPrivateZones: boolean,
  scope: string,
  index: number,
): Record<string, unknown> | null {
  if (!support) return null;
  if (ownsPrivateZones || support.revealed === true) return { ...support };
  return {
    uid: opaqueHiddenId(scope, owner, "support", index),
    revealed: false,
  };
}

function projectPendingChoice(
  state: GameState,
  viewerSeat: PlayerId | undefined,
): Record<string, unknown> | null {
  const choice = state.pendingChoice;
  if (!choice) return null;
  if (choice.player === viewerSeat) {
    return {
      ...choice,
      options: choice.options.map((option) => ({ ...option })),
      data: { ...choice.data },
    };
  }
  return {
    player: choice.player,
    promptKey: choice.promptKey,
    cancellable: choice.cancellable,
    optionCount: choice.options.length,
  };
}

function publicCard(card: CardInstance): CardInstance {
  return { uid: card.uid, cardId: card.cardId };
}

function hiddenCard(
  scope: string,
  owner: PlayerId,
  zone: "hand",
  index: number,
): { readonly uid: string } {
  return { uid: opaqueHiddenId(scope, owner, zone, index) };
}

function opaqueHiddenId(
  scope: string,
  owner: PlayerId,
  zone: "hand" | "support" | "chakra",
  index: number,
): string {
  return `hidden:${scope}:${owner}:${zone}:${index}`;
}

function seatForActor(
  seats: Readonly<Record<PlayerId, string>>,
  actorId: string,
): PlayerId | undefined {
  if (seats.p1 === actorId) return "p1";
  if (seats.p2 === actorId) return "p2";
  return undefined;
}
