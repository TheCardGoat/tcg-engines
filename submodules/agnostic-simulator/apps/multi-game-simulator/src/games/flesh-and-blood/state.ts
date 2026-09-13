export interface FabPresentationCard {
  readonly id: string;
  readonly cardId: string;
  readonly ownerId: string;
  readonly zone: FabPresentationZone;
  readonly equipmentSlot?: "weapon1" | "weapon2";
  /** Public CR 3.0.14 top-card that this sub-card is physically under. */
  readonly hostInstanceId?: string;
  readonly face: "up" | "down";
  /** Physical card that generated a synthetic rules-stack presentation entry. */
  readonly sourceInstanceId?: string;
  /** Chosen atelier printing for this instance; absent = deck default art. */
  readonly printingId?: string;
  /** The public, physical state of an object on the table. */
  readonly tapped?: boolean;
  /** Public rules counters physically on this object (damage marking excluded). */
  readonly counters?: readonly FabPresentationCounter[];
  /** Authoritative current values, after the engine applies continuous effects. */
  readonly currentNumeric?: Readonly<
    Partial<Record<"power" | "defense" | "life" | "intellect" | "pitch" | "cost", number>>
  >;
  /** Role on the active combat-chain link when zone is combat-chain. */
  readonly chainRole?: FabChainCardRole;
}

export interface FabPresentationCounter {
  readonly label: string;
  readonly count: number;
  readonly modifier?: {
    readonly property: "power" | "defense" | "life";
    readonly value: number;
  };
}

export type FabChainCardRole = "attack" | "defend" | "attack-reaction" | "defense-reaction";

/**
 * Per-seat priority mode mirrored from the engine's owner-private viewer
 * projection (`viewer.priorityAutomation`). Structurally identical to the
 * engine's `FabPriorityAutomationMode`; null means the seat is not available
 * to this viewer (spectator/replay), which fails closed to always-hold.
 */
export type FabPriorityAutomationMode = "auto-pass" | "always-hold" | "play-and-skip";

export type FabPresentationZone =
  | "deck"
  | "hand"
  | "graveyard"
  | "banished"
  | "arsenal"
  | "pitch"
  | "soul"
  | "hero"
  | "head"
  | "chest"
  | "arms"
  | "legs"
  | "weapon"
  | "permanent"
  | "hosted"
  | "combat-chain"
  | "stack";

/** Combat steps (CR 7.0.1): Layer → Attack → Defend → Reaction → Damage → Resolution → Close. */
export type FabPresentationCombatStep =
  | "layer"
  | "attack"
  | "defend"
  | "reaction"
  | "damage"
  | "resolution"
  | "close";

export type FabPresentationAttackTarget =
  | { readonly kind: "hero"; readonly playerId: string }
  | {
      readonly kind: "object";
      readonly instanceId: string;
      readonly controllerIdAtDeclaration: string;
      /** Viewer-disclosed identity when the target has left the arena. */
      readonly departedCardId?: string;
    };

export interface FabPresentationCombatLink {
  readonly attackInstanceId: string;
  readonly attackingPlayerId: string;
  readonly defendingPlayerId: string;
  readonly attackTarget: FabPresentationAttackTarget;
  readonly additionalAttackTargets: readonly FabPresentationAttackTarget[];
  /** Defending cards remain attached to the target they were declared for. */
  readonly defendingInstanceIdsByTarget: Readonly<Record<string, readonly string[]>>;
  readonly defendingInstanceIds: readonly string[];
  /** Attack/defense reaction instance ids currently on the chain. */
  readonly reactionInstanceIds: readonly string[];
  readonly attackPower: number;
  readonly keywords: readonly string[];
  readonly damageResolved: boolean;
  /** Physical damage actually dealt by this attack once the damage step resolves. */
  readonly damage?: number;
  readonly didHit: boolean;
  readonly defenseReactionsBlocked: boolean;
}

/**
 * A prior chain link that has already resolved.
 * Only present when the engine/adapter (or a presentation fixture) supplies it —
 * never invented from zone cards alone.
 */
export interface FabPresentationResolvedLink {
  readonly attackInstanceId: string;
  readonly attackingPlayerId: string;
  readonly defendingPlayerId: string;
  readonly attackTarget?: FabPresentationAttackTarget;
  readonly additionalAttackTargets?: readonly FabPresentationAttackTarget[];
  readonly defendingInstanceIdsByTarget?: Readonly<Record<string, readonly string[]>>;
  /** Cards committed during the defend step, retained for chain-link history. */
  readonly defendingInstanceIds?: readonly string[];
  /** Attack and defense reactions that participated in this resolved link. */
  readonly reactionInstanceIds?: readonly string[];
  /** Final evaluated power, when the source retained that resolved-link snapshot. */
  readonly attackPower?: number;
  /** Final evaluated defense, when the source retained that resolved-link snapshot. */
  readonly totalDefense?: number;
  readonly damage: number;
  readonly didHit: boolean;
}

export interface FabPresentationCombat {
  readonly open: boolean;
  readonly step: FabPresentationCombatStep;
  /**
   * Public game-process state: while true, the defending player must act and
   * rules priority is closed. Keep this distinct from `priorityPlayerId` so
   * every viewer can render the same interaction-agency signal.
   */
  readonly defenseDeclarationPending: boolean;
  /** Authoritative 1-based number of the current chain link. */
  readonly chainLinkNumber?: number;
  readonly activeLink: FabPresentationCombatLink | null;
  /**
   * Resolved links earlier in this combat chain, oldest first.
   * Omitted or empty when the source does not expose multi-link history.
   */
  readonly resolvedLinks?: readonly FabPresentationResolvedLink[];
  /**
   * Pending stack/layer instance ids, ordered so index 0 resolves next.
   * Only when the source exposes ordered stack contents.
   */
  readonly stackInstanceIds?: readonly string[];
}

export type FabPresentationEffectScope =
  | { readonly kind: "player"; readonly playerId: string }
  | { readonly kind: "object"; readonly instanceId: string }
  | { readonly kind: "future-object"; readonly playerId: string }
  | { readonly kind: "game" };

export interface FabPresentationEffect {
  readonly id: string;
  readonly controllerId: string;
  readonly sourceEntityId?: string;
  readonly sourceCanonicalId?: string;
  readonly sourceLabel: string;
  readonly label: string;
  readonly detail: string;
  readonly tone: "buff" | "debuff" | "neutral";
  readonly durationLabel: string;
  readonly status: "armed" | "applying";
  readonly remainingUses: number | null;
  readonly scopes: readonly FabPresentationEffectScope[];
}

export interface FabPresentationState {
  readonly players: readonly string[];
  readonly cards: Record<string, FabPresentationCard>;
  readonly cardDefinitions: Record<string, FabCardDefinition>;
  readonly life: Record<string, number>;
  /** Floating resource points (CR resource pool), per player. */
  readonly resourcePoints: Record<string, number>;
  /** Chi points available to pay chi costs, per player. */
  readonly chiPoints?: Record<string, number>;
  /** Action points available this turn, per player. */
  readonly actionPoints: Record<string, number>;
  /** Public remaining attack activations for arena weapons, keyed by physical object. */
  readonly attackActivationsByInstanceId?: Readonly<
    Record<
      string,
      {
        readonly controllerId: string;
        readonly total: number;
        readonly used: number;
        readonly remaining: number;
      }
    >
  >;
  /** Public cards currently in each hero's soul. */
  readonly soulCounts?: Readonly<Record<string, number>>;
  /** Hero intellect (draw-up-to target), per player. */
  readonly intellect: Record<string, number>;
  /** Public, active-only signature conditions attached to each seated hero. */
  readonly heroSignals: Readonly<Record<string, readonly FabPresentationHeroSignal[]>>;
  /** Persisted start-of-game outcome; unlike activePlayerId it never changes. */
  readonly firstTurnPlayerId: string;
  readonly activePlayerId: string | null;
  readonly priorityPlayerId: string | null;
  readonly turnNumber: number;
  readonly phase: "start" | "action" | "end";
  /** Viewer-safe effects currently armed or applying. */
  readonly activeEffects: readonly FabPresentationEffect[];
  /** Owner-private optional-trigger controls keyed by physical source instance. */
  readonly optionalTriggerAutomation?: Readonly<
    Record<string, "ask" | "auto-accept" | "auto-decline">
  >;
  /** Owner-private priority mode for the viewing seat; null when not seated. */
  readonly priorityAutomation?: FabPriorityAutomationMode | null;
  /**
   * Engine-computed stop-points for the viewing seat's current window: true
   * windows (defense declaration, terminal pass, attacker chain close) must
   * never be closed by any automation, client countdown included.
   */
  readonly priorityManualOnly?: boolean | null;
  /** Rules-native meaning of the viewing seat's current priority window. */
  readonly priorityWindow?: import("@tcg/flesh-and-blood-engine/simulator").FabViewerState["priorityWindow"];
  /** Owner-private one-shot priority-hold arm; null when not seated. */
  readonly priorityHoldArmed?: boolean | null;
  /**
   * Pending rules layers, ordered so index 0 resolves next.
   * This remains available outside a combat chain (for example, an action
   * followed by an instant ability while its controller retains priority).
   */
  readonly stackInstanceIds?: readonly string[];
  readonly combat: FabPresentationCombat | null;
  /** Public context for a card that remains announced while its cost is paid. */
  readonly prompt?: {
    readonly kind: "pay-resource-cost";
    readonly cardId: string;
  } | null;
  readonly terminal: boolean;
  /** Authoritative game result. Present iff `terminal` is true. */
  readonly result: FabPresentationResult | null;
}

export type FabPresentationHeroSignal =
  | { readonly kind: "flag"; readonly id: "cheered" | "booed" | "charged" }
  | {
      readonly kind: "count";
      readonly id: "intimidate" | "weapon-attacks" | "soul-added";
      readonly value: number;
    };

export type FabPresentationResult =
  | {
      readonly kind: "win";
      readonly winnerId: string;
      readonly loserId: string;
      readonly reason: string;
    }
  | { readonly kind: "draw"; readonly reason: string };

export interface FabCardDefinition {
  readonly name: string;
  readonly cardType: string;
  /** Authored catalog slug used for stable public card identity. */
  readonly slug?: string;
  /** Catalog identity retained when a synthetic UI card represents a source card ability. */
  readonly presentationCanonicalId?: string;
  /** Printed source name retained when a synthetic stack label describes an ability. */
  readonly presentationName?: string;
  /** Printed FAB type line, retained for public card inspection. */
  readonly typeLine?: string;
  /** Complete printed rules text available to the local match projection. */
  readonly printedText?: string;
  readonly imageUrl?: string;
  readonly pitchValue?: number;
  readonly cost?: number;
  readonly power?: number;
  readonly defense?: number;
  readonly life?: number;
  /** Printed keyword names used by compact combat-chain affordances. */
  readonly keywords?: readonly string[];
  /** Public keyword projection used by hero-special UI. */
  readonly isBloodDebt?: boolean;
}

export type FabPresentationAction =
  | { readonly type: "draw"; readonly ownerId: string; readonly count: number }
  | { readonly type: "pitch_card"; readonly cardId: string }
  | { readonly type: "play_card"; readonly cardId: string }
  | { readonly type: "move_card"; readonly cardId: string; readonly zone: FabPresentationZone }
  | { readonly type: "end_turn" }
  | { readonly type: "end_game"; readonly winnerId: string | null; readonly reason: string };

export function reduceFabPresentationState(
  state: FabPresentationState,
  action: FabPresentationAction,
): FabPresentationState {
  switch (action.type) {
    case "draw": {
      const deckCards = Object.values(state.cards).filter(
        (c) => c.ownerId === action.ownerId && c.zone === "deck",
      );
      const toMove = deckCards.slice(0, action.count);
      if (toMove.length === 0) return state;
      const nextCards = { ...state.cards };
      for (const card of toMove) {
        nextCards[card.id] = { ...card, zone: "hand", face: "up" };
      }
      return { ...state, cards: nextCards };
    }
    case "pitch_card": {
      const card = state.cards[action.cardId];
      if (!card || card.ownerId !== state.activePlayerId) return state;
      return {
        ...state,
        cards: {
          ...state.cards,
          [action.cardId]: { ...card, zone: "pitch", face: "up" },
        },
      };
    }
    case "play_card": {
      const card = state.cards[action.cardId];
      if (!card || card.ownerId !== state.activePlayerId) return state;
      const def = state.cardDefinitions[card.cardId];
      const isAttack =
        def?.cardType === "action" && (def.power ?? 0) > 0 && def.defense !== undefined;
      // Attack actions open / join the combat chain as the attacker when no chain is open.
      if (isAttack && (!state.combat || !state.combat.open || !state.combat.activeLink)) {
        const opponent = state.players.find((id) => id !== card.ownerId) ?? card.ownerId;
        return {
          ...state,
          cards: {
            ...state.cards,
            [action.cardId]: {
              ...card,
              zone: "combat-chain",
              face: "up",
              chainRole: "attack",
            },
          },
          combat: {
            open: true,
            step: "defend",
            defenseDeclarationPending: true,
            activeLink: {
              attackInstanceId: action.cardId,
              attackingPlayerId: card.ownerId,
              defendingPlayerId: opponent,
              attackTarget: { kind: "hero", playerId: opponent },
              additionalAttackTargets: [],
              defendingInstanceIdsByTarget: { [opponent]: [] },
              defendingInstanceIds: [],
              reactionInstanceIds: [],
              attackPower: def?.power ?? 0,
              keywords: [],
              damageResolved: false,
              didHit: false,
              defenseReactionsBlocked: false,
            },
          },
        };
      }
      return {
        ...state,
        cards: {
          ...state.cards,
          [action.cardId]: { ...card, zone: "graveyard", face: "up" },
        },
      };
    }
    case "move_card": {
      const card = state.cards[action.cardId];
      if (!card) return state;
      return {
        ...state,
        cards: {
          ...state.cards,
          [action.cardId]: { ...card, zone: action.zone },
        },
      };
    }
    case "end_turn": {
      const current = state.activePlayerId;
      if (!current) return state;
      const opponent = state.players.find((id) => id !== current);
      return {
        ...state,
        activePlayerId: opponent ?? current,
        priorityPlayerId: opponent ?? current,
        turnNumber: state.turnNumber + 1,
        combat: null,
      };
    }
    case "end_game": {
      const loserId = action.winnerId
        ? (state.players.find((playerId) => playerId !== action.winnerId) ?? null)
        : null;
      return {
        ...state,
        terminal: true,
        result:
          action.winnerId && loserId
            ? { kind: "win", winnerId: action.winnerId, loserId, reason: action.reason }
            : { kind: "draw", reason: action.reason },
        combat: null,
      };
    }
    default:
      return state;
  }
}
