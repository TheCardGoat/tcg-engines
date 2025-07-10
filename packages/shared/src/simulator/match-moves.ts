export type Zones = "hand" | "play" | "discard" | "inkwell" | "deck";

export type MatchMove =
  | ChangeGameModeMove
  | AlterHandMove
  | RequestMove
  | ConcedeMatchMove
  | ConcedeGameMove
  | ShiftMove
  | ResolveLayerMove
  | SkipLayerMove
  | AcceptOptionalLayerMove
  | DrawCardMove
  | RevealCardMove
  | UpdateLoreMove
  | ShuffleDeckMove
  | ScryMove
  | UndoMove
  | UndoTurnMove
  | UndoLastTurnMove
  | ActivateAbilityMove
  | UpdateCardDamageMove
  | ChooseWhoGoesFirstMove
  | QuestMove
  | QuestWithAllMove
  | TapCardMove
  | MoveCardMove
  | TutorCardMove
  | SingTogetherMove
  | SingMove
  | PassTurnMove
  | PutCardIntoInkwellMove
  | EnterLocationMove
  | MoveToLocationMove
  | AnswerPlayerRequest
  | CancelPlayerRequest
  | ChallengeMove
  | PlayerJoinedMove
  | PlayerLeftMove
  | PlayCardMove
  | DropPlayerMove;

interface BaseMove {
  type: MatchMove["type"];
  number?: number;
  id?: string;
}

export interface AnswerPlayerRequest extends BaseMove {
  type: "ANSWER_PLAYER_REQUEST";
  accepted: boolean;
}

export interface PlayerJoinedMove extends BaseMove {
  type: "PLAYER_JOINED";
  playerId: string;
}

export interface PlayerLeftMove extends BaseMove {
  type: "PLAYER_LEFT";
  playerId: string;
}

export interface DropPlayerMove extends BaseMove {
  type: "DROP_PLAYER";
  playerId: string;
  dropped?: boolean;
  timeLeft?: number;
}

export interface CancelPlayerRequest extends BaseMove {
  type: "CANCEL_PLAYER_REQUEST";
  cancelled: boolean;
}

export interface ChangeGameModeMove extends BaseMove {
  type: "CHANGE_GAME_MODE";
  manual: boolean;
}

export interface UndoMoveBase extends BaseMove {
  type: "UNDO";
}

export interface UndoMoveWithTurn extends UndoMoveBase {
  turn: number;
  move?: never;
}

export interface UndoMoveWithMove extends UndoMoveBase {
  turn?: never;
  move: number;
}

export type UndoMove = UndoMoveWithTurn | UndoMoveWithMove;

export interface UndoTurnMove extends BaseMove {
  type: "UNDO_TURN";
}

export interface UndoLastTurnMove extends BaseMove {
  type: "UNDO_LAST_TURN";
}

export interface ChooseWhoGoesFirstMove extends BaseMove {
  type: "CHOOSE_FIRST_PLAYER";
  player: string;
}

export interface AlterHandMove extends BaseMove {
  type: "ALTER_HAND";
  player: string;
  cards: string[];
}

export interface RequestMove extends BaseMove {
  type: "REQUEST";
  payload: {
    type: "ENABLE_CHAT";
    mode: "free_text" | "predefined";
  };
}

export interface PassTurnMove extends BaseMove {
  type: "PASS_TURN";
  player: string;
  forced?: boolean;
}

export interface ActivateAbilityMove extends BaseMove {
  type: "ACTIVATE_ABILITY";
  instanceId: string;
  ability?: string;
  costs?: string[];
}

export interface UpdateCardDamageMove extends BaseMove {
  type: "UPDATE_CARD_DAMAGE";
  instanceId: string;
  damage: number;
  operation: "add" | "remove" | "set";
}

export interface QuestMove extends BaseMove {
  type: "QUEST";
  instanceId: string;
}

export interface QuestWithAllMove extends BaseMove {
  type: "QUEST_WITH_ALL";
  playerId: string;
}

export interface TapCardMove extends BaseMove {
  type: "TAP_CARD";
  instanceId: string;
  exerted?: boolean;
  toggle?: boolean;
}

export interface MoveCardMove extends BaseMove {
  type: "MOVE_CARD";
  instanceId: string;
  to: Zones;
  position: "first" | "last";
}

export interface TutorCardMove extends BaseMove {
  type: "TUTOR_CARD";
  instanceId: string;
}

export interface RevealCardMove extends BaseMove {
  type: "REVEAL_CARD";
  instanceId: string;
}

export interface UpdateLoreMove extends BaseMove {
  type: "UPDATE_LORE";
  player: string;
  lore: number;
}

export interface DrawCardMove extends BaseMove {
  type: "DRAW_CARD";
  player: string;
}

export interface ShuffleDeckMove extends BaseMove {
  type: "SHUFFLE_DECK";
  player: string;
}

export interface ConcedeMatchMove extends BaseMove {
  type: "CONCEDE_MATCH";
}

export interface ConcedeGameMove extends BaseMove {
  type: "CONCEDE_GAME";
}

export interface PutCardIntoInkwellMove extends BaseMove {
  type: "PUT_CARD_INTO_INKWELL";
  instanceId: string;
}

export interface SingTogetherMove extends BaseMove {
  type: "SING_TOGETHER";
  song: string;
  singers: string[];
}

export interface SingMove extends BaseMove {
  type: "SING";
  song: string;
  singer: string;
}

export interface EnterLocationMove extends BaseMove {
  type: "ENTER_LOCATION";
  character: string;
  location: string;
}

export interface MoveToLocationMove extends BaseMove {
  type: "MOVE_TO_LOCATION";
  character: string;
  location: string;
}

export interface ChallengeMove extends BaseMove {
  type: "CHALLENGE";
  attacker: string;
  defender: string;
}

export interface ShiftMove extends BaseMove {
  type: "SHIFT";
  shifter: string;
  shifted: string;
  costs?: string[];
}

export interface ScryParams {
  top?: string[];
  bottom?: string[];
  hand?: string[];
  inkwell?: string[];
  discard?: string[];
  play?: string[];
}

export interface ScryMove extends BaseMove, ScryParams {
  type: "SCRY";
  playerId: string;
}

export interface ResolverLayerParams {
  layerId: string;
  targets?: string[];
  mode?: string;
  nameACard?: string;
  skip?: boolean;
  scry?: ScryParams;
  targetPlayer?: string;
}

export interface ResolveLayerMove extends BaseMove, ResolverLayerParams {
  type: "RESOLVE_LAYER";
  activePlayer: string;
}

export interface SkipLayerMove extends BaseMove {
  type: "SKIP_LAYER";
  layerId: string;
  activePlayer: string;
}

export interface AcceptOptionalLayerMove extends BaseMove {
  type: "ACCEPT_OPTIONAL_LAYER";
  layerId: string;
  activePlayer: string;
}

export interface PlayCardMove extends BaseMove {
  type: "PLAY_CARD";
  instanceId: string;
  bodyguard?: boolean;
  alternativeCosts?: string[];
}
