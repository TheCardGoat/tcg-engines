import type { Ability, ResolutionAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { GameEffect, ResolvingParam, Zones } from "@lorcanito/lorcana-engine/types/types";
type MatchMetadata = {
    chat: "free_text" | "preset" | "disabled";
};
export type InternalLogEntry = {
    id: string;
    sender?: string;
    instanceId?: string;
    private?: {
        [playerId: string]: {
            instanceId: string;
        };
    };
} & LogEntry;
export type LogEntry = LogEntryTap | ChatEntry | ConcedeGameRequest | GameRequestEntry | NewGameEntry | WonDieRollEntry | AddInkWellEntry | ResolvingAbilitiesEntry | ScryEntry | ShiftEntry | PlayCardEntry | GoingFirst | ShuffleCardIntoDeckEntry | TurnEntry | ChangeLobbyModeEntry | ChallengeEntry | ReadyEntry | ManualModeEntry | PassTurnEntry | EffectEntry | ResolveEffectEntry | InvalidResolutionTarget | CancelEffectEntry | OptionalLayerAdded | OptionalLayerAccepted | SkipEffectEntry | DiscardEntry | ConditionNotMetEntry | CantPayCostEntry | SingEntry | SingTogetherEntry | SetEntry | DrawEntry | RevealCardEntry | HideCardEntry | BackToLobbyEntry | GameRestartedEntry | RestartMatchEntry | WinGameEntry | ClaimVictoryEntry | CancelGameEntry | TieGameEntry | ConcedeGameEntry | WinMatchEntry | ConcedeMatchEntry | RematchRequestedEntry | RematchAcceptedEntry | RestartingGameEntry | LobbyCreated | LobbyReady | PlayerLeft | PlayerJoined | PlayerReady | PlayerOffline | PlayerOnline | MoveDamageEntry | LogEntryDamageChange | LogEntryLoadDeck | LogEntryLoadDeckFailed | LogEntryShuffleDeck | LogEntryLoreChange | GainLocationLore | EnterLocationEntry | ReadyToStartGameEntry | LookingAtTopCardsEntry | LogEntryMoveCard | MulliganEntry | AutoOptionalEngaged | EndGameEntry | AutoTargetEngaged | RequestGameCancellationEntry | AcceptGameCancellationEntry | RejectGameCancellationEntry | TutoringCardEntry | TutoredCardEntry | QuestWithAllEntry | PlayerRequestAnswerEntry | UndoMoveEntry | UndoTurnEntry | UndoTurnRequestEntry | UndoMoveRequestEntry | ManualModeRequestEntry | DrawEmptyDeckEntry | LogEntryQuest | LogEntryEffectPrevention | DropPlayerEntry | LogEntrySkipDrawStep;
interface LogEntryBase {
    type: LogEntry["type"];
    id?: number | string;
    timestamp?: number;
}
export interface DrawEmptyDeckEntry extends LogEntryBase {
    type: "DRAW_EMPTY_DECK";
    player: string;
}
export interface DropPlayerEntry extends LogEntryBase {
    type: "DROP_PLAYER";
    playerId: string;
    dropped?: boolean;
    timeLeft?: number;
    reason?: string;
}
export interface PlayerRequestAnswerEntry extends LogEntryBase {
    type: "PLAYER_REQUEST_ANSWER";
    sender: string;
    accepted: boolean;
}
export interface UndoTurnRequestEntry extends LogEntryBase {
    type: "UNDO_TURN_REQUEST";
    sender: string;
    toggle: boolean;
    message: string;
}
export interface UndoMoveRequestEntry extends LogEntryBase {
    type: "UNDO_MOVE_REQUEST";
    sender: string;
    toggle: boolean;
    message: string;
}
export interface ManualModeRequestEntry extends LogEntryBase {
    type: "MANUAL_MODE_REQUEST";
    sender: string;
    toggle: boolean;
    message: string;
}
export interface TutoringCardEntry extends LogEntryBase {
    type: "TUTORING";
}
export interface ChangeLobbyModeEntry extends LogEntryBase {
    type: "CHANGE_LOBBY_MODE";
    mode: "best-of-one" | "best-of-two" | "best-of-three";
    player: string;
}
export interface TutoredCardEntry extends LogEntryBase {
    type: "TUTORED";
    instanceId: string;
}
export interface LookingAtTopCardsEntry extends LogEntryBase {
    type: "LOOKING_AT_TOP_CARDS";
    amount: number;
}
export interface ChatEntry extends LogEntryBase {
    type: "CHAT";
    mode: MatchMetadata["chat"];
}
export interface ConcedeGameRequest extends LogEntryBase {
    type: "CONCEDE_GAME_REQUEST";
    player: string;
}
export interface GameRequestEntry extends LogEntryBase {
    type: "REQUEST";
    payload: {
        type: "ENABLE_CHAT";
        mode: "free_text";
    };
}
export interface LogEntryTap extends LogEntryBase {
    type: "TAP";
    value: boolean;
    instanceId?: string;
    cardId?: string;
    inkwell?: boolean | null;
}
export interface LogEntrySkipDrawStep extends LogEntryBase {
    type: "SKIP_DRAW_STEP";
    player: string;
}
export interface ResolvingAbilitiesEntry extends LogEntryBase {
    type: "RESOLVING_ABILITIES";
    abilities: ResolutionAbility[];
}
export interface LogEntryDamageChange extends LogEntryBase {
    type: "DAMAGE_CHANGE";
    from: number;
    to: number;
    instanceId: string;
}
export interface MoveDamageEntry extends LogEntryBase {
    type: "MOVE_DAMAGE";
    from: string;
    to: string;
    amount: number;
}
export interface LogEntryMoveCard extends LogEntryBase {
    type: "MOVE_CARD";
    from: Zones;
    to: Zones;
    position?: "first" | "last";
    isPublic?: boolean;
    instanceId: string;
    owner: string;
    isPrivate?: boolean;
}
export interface SingEntry extends LogEntryBase {
    type: "SING";
    song: string;
    singer: string;
}
export interface SingTogetherEntry extends LogEntryBase {
    type: "SING_TOGETHER";
    song: string;
    singers: string[];
}
export interface QuestWithAllEntry extends LogEntryBase {
    type: "QUEST_WITH_ALL";
    player: string;
    cards: string[];
    total: number;
}
export interface LogEntryQuest extends LogEntryBase {
    type: "QUEST";
    instanceId: string;
    cardId?: string;
    amount: number;
}
export interface LogEntryEffectPrevention extends LogEntryBase {
    type: "EFFECT_PREVENTION";
    effect: "REMOVE_DAMAGE" | "DEAL_DAMAGE";
    amount: number;
    source?: string;
    target?: string;
}
export interface LogEntryLoreChange extends LogEntryBase {
    type: "LORE_CHANGE";
    player?: string;
    restrictedBy?: string;
    from: number;
    to: number;
}
export interface LogEntryLoadDeck extends LogEntryBase {
    type: "LOAD_DECK";
    player: string;
}
export interface LogEntryLoadDeckFailed extends LogEntryBase {
    type: "LOAD_DECK_FAILED";
    player: string;
}
export interface LogEntryShuffleDeck extends LogEntryBase {
    type: "SHUFFLE_DECK";
}
export interface GoingFirst extends LogEntryBase {
    type: "GOING_FIRST";
    player: string;
}
export interface PlayerJoined extends LogEntryBase {
    type: "PLAYER_JOINED";
    player: string;
    name?: string;
}
export interface PlayerLeft extends LogEntryBase {
    type: "PLAYER_LEFT";
    player: string;
    name?: string;
}
export interface LobbyCreated extends LogEntryBase {
    type: "LOBBY_CREATED";
    player: string;
}
export interface LobbyReady extends LogEntryBase {
    type: "LOBBY_READY";
}
export interface PlayerReady extends LogEntryBase {
    type: "PLAYER_READY";
    player: string;
    name?: string;
}
export interface PlayerOffline extends LogEntryBase {
    type: "PLAYER_OFFLINE";
    player: string;
    timestamp: number;
}
export interface PlayerOnline extends LogEntryBase {
    type: "PLAYER_ONLINE";
    player: string;
    timestamp: number;
}
export interface ReadyEntry extends LogEntryBase {
    type: "READY";
    player: string;
}
export interface SetEntry extends LogEntryBase {
    type: "SET";
    player: string;
}
export interface DrawEntry extends LogEntryBase {
    type: "DRAW";
    player: string;
    cards: string[];
}
export interface DiscardEntry extends LogEntryBase {
    type: "DISCARD";
    cards: string[];
}
export interface EndGameEntry extends LogEntryBase {
    type: "END_GAME";
    winner: string;
    reason: string;
}
export interface PassTurnEntry extends LogEntryBase {
    type: "PASS_TURN";
    player: string;
    turn: number;
}
export interface NewGameEntry extends LogEntryBase {
    type: "NEW_GAME";
}
export interface TurnEntry extends LogEntryBase {
    type: "NEW_TURN";
    turn: number;
    instanceId: string;
}
export interface ChallengeEntry extends LogEntryBase {
    type: "CHALLENGE";
    attacker: string;
    defender: string;
    strength: {
        attacker: number;
        defender: number;
    };
    banish: {
        attacker: boolean;
        defender: boolean;
    };
    damage: {
        attacker: number;
        defender: number;
    };
}
export interface MulliganEntry extends LogEntryBase {
    type: "MULLIGAN";
    cards: string[];
    player: string;
}
export interface ReadyToStartGameEntry extends LogEntryBase {
    type: "READY_TO_START";
    solo?: boolean;
}
export interface AddInkWellEntry extends LogEntryBase {
    type: "ADD_TO_INKWELL";
    instanceId: string;
    zone: Zones;
}
export interface WonDieRollEntry extends LogEntryBase {
    type: "WON_DIE_ROLL";
    player: string;
}
export interface GameRestartedEntry extends LogEntryBase {
    type: "GAME_RESTARTED";
    player: string;
}
export interface RestartingGameEntry extends LogEntryBase {
    type: "RESTARTING_GAME";
    player: string;
}
export interface RestartMatchEntry extends LogEntryBase {
    type: "RESTART_MATCH";
    player: string;
}
export interface WinMatchEntry extends LogEntryBase {
    type: "WIN_MATCH";
    player: string;
}
export interface WinGameEntry extends LogEntryBase {
    type: "WIN_GAME";
    player: string;
}
export interface ClaimVictoryEntry extends LogEntryBase {
    type: "CLAIM_VICTORY";
    player: string;
    reason: string;
    duration: number;
}
export interface TieGameEntry extends LogEntryBase {
    type: "TIE_GAME";
    player: string;
}
export interface CancelGameEntry extends LogEntryBase {
    type: "CANCEL_GAME";
    player: string;
}
export interface RequestGameCancellationEntry extends LogEntryBase {
    type: "REQUEST_GAME_CANCELLATION";
    player: string;
}
export interface AcceptGameCancellationEntry extends LogEntryBase {
    type: "ACCEPT_GAME_CANCELLATION";
    player: string;
}
export interface RejectGameCancellationEntry extends LogEntryBase {
    type: "REJECT_GAME_CANCELLATION";
    player: string;
}
export interface ConcedeGameEntry extends LogEntryBase {
    type: "CONCEDE_GAME";
    player: string;
}
export interface ConcedeMatchEntry extends LogEntryBase {
    type: "CONCEDE_MATCH";
    player: string;
}
export interface RematchRequestedEntry extends LogEntryBase {
    type: "REMATCH_REQUESTED";
    player: string;
}
export interface RematchAcceptedEntry extends LogEntryBase {
    type: "REMATCH_ACCEPTED";
    player: string;
}
export interface BackToLobbyEntry extends LogEntryBase {
    type: "BACK_TO_LOBBY";
    player: string;
}
export interface RevealCardEntry extends LogEntryBase {
    type: "REVEAL_CARD";
    player: string;
    card: string | string[];
    from: Zones;
}
export interface HideCardEntry extends LogEntryBase {
    type: "HIDE_CARD";
    player: string;
    cards: string[];
    from: Zones;
}
export interface ScryEntry extends LogEntryBase {
    type: "SCRY";
    bottom: number;
    top: number;
    inkwell: number;
    hand: number | string[];
    discard: number | string[];
    play: number | string[];
    shouldReveal?: boolean;
}
export interface ShiftEntry extends LogEntryBase {
    type: "SHIFT";
    shifter: string;
    shifted: string;
    costs?: string[];
}
export interface PlayCardEntry extends LogEntryBase {
    type: "PLAY_CARD";
    instanceId: string;
    payedCost: number;
    originalCost: number;
    alternativeCosts?: string[];
}
export interface ShuffleCardIntoDeckEntry extends LogEntryBase {
    type: "SHUFFLE_CARD";
    instanceId: string;
}
export interface ManualModeEntry extends LogEntryBase {
    type: "MANUAL_MODE";
    sender: string;
    toggle: boolean;
}
export interface ResolveEffectEntry extends LogEntryBase {
    type: "RESOLVE_LAYER";
    params?: ResolvingParam;
    layer?: GameEffect;
}
export interface InvalidResolutionTarget extends LogEntryBase {
    type: "INVALID_TARGET_RESOLUTION";
    effect: GameEffect;
}
export interface EffectEntry extends LogEntryBase {
    type: "EFFECT";
    effect: GameEffect;
}
export interface CancelEffectEntry extends LogEntryBase {
    type: "CANCEL_EFFECT";
    effect: GameEffect;
}
export interface SkipEffectEntry extends LogEntryBase {
    type: "SKIP_EFFECT";
    ability?: Ability;
    source: string;
}
export interface OptionalLayerAccepted extends LogEntryBase {
    type: "OPTIONAL_ABILITY_ON_STACK_ACCEPTED";
    ability?: Ability;
    source: string;
}
export interface OptionalLayerAdded extends LogEntryBase {
    type: "OPTIONAL_ABILITY_ON_STACK_ADDED";
    ability?: Ability;
    source: string;
}
export interface ConditionNotMetEntry extends LogEntryBase {
    type: "CONDITION_NOT_MET";
    layer: GameEffect;
}
export interface CantPayCostEntry extends LogEntryBase {
    type: "CANT_PAY_COSTS";
}
export interface AutoOptionalEngaged extends LogEntryBase {
    type: "AUTO_OPTIONAL_ENGAGED";
    ability?: string;
}
export interface AutoTargetEngaged extends LogEntryBase {
    type: "AUTO_TARGET_ENGAGED";
    targets: string[];
}
export interface UndoTurnEntry extends LogEntryBase {
    type: "UNDO_TURN";
    turn: number;
}
export interface UndoTurnEntry extends LogEntryBase {
    type: "UNDO_TURN";
    turn: number;
    move: number;
}
export interface UndoMoveEntry extends LogEntryBase {
    type: "UNDO_MOVE";
    turn: number;
    move: number;
}
export interface EnterLocationEntry extends LogEntryBase {
    type: "ENTER_LOCATION";
    location: string;
    character: string;
}
export interface GainLocationLore extends LogEntryBase {
    type: "GAIN_LOCATION_LORE";
    location: string;
    player: string;
    lore: number;
}
export {};
//# sourceMappingURL=Log.d.ts.map