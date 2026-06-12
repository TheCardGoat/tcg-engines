import type { Patch } from "immer";
import type { Action, Duration, EffectTrigger, Keyword } from "@tcg/op-types";

export type MatchSeat = "north" | "south";
export type Viewer = MatchSeat | "judge" | "spectator";
export type MatchStatus = "setup" | "active" | "finished";
export type MatchPhase = "setup" | "refresh" | "draw" | "don" | "main" | "end" | "finished";
export type CardZone = "leader" | "deck" | "hand" | "life" | "character" | "stage" | "trash";
export type PromptKind = "choice" | "judge";
export type ChoiceKind = "selectTargets" | "selectCards" | "confirm" | "costPayment";
export type EngineActor = MatchSeat | "judge" | "system";
export type LogVisibility = "public" | "private" | "judge";
export type ResolutionStatus = "idle" | "running" | "waitingForPrompt";

export interface MatchPlayerConfig {
  leaderCardId: string;
  mainDeck: string[];
  playerName?: string;
  donDeckCount?: number;
}

export interface MatchConfig {
  firstPlayer: MatchSeat;
  players: Record<MatchSeat, MatchPlayerConfig>;
  judgeFallback?: boolean;
  seed?: number | string;
  shuffleDecks?: boolean;
  skipFirstTurnDraw?: boolean;
  openingHandSize?: number;
  maxCharacterSlots?: number;
}

export interface CardInstance {
  instanceId: string;
  cardId: string;
  owner: MatchSeat;
  controller: MatchSeat;
  zone: CardZone;
  zoneIndex: number;
  rested: boolean;
  attachedDon: number;
  playedOnTurn: number | null;
  faceUp: boolean;
  publicKnowledge: boolean;
  usedEffectKeys: string[];
}

export interface ModifierState {
  id: string;
  sourceInstanceId: string | null;
  targetId: string;
  type: "power" | "cost" | "keyword" | "flag";
  value?: number;
  keyword?: Keyword;
  flag?:
    | "cannotAttack"
    | "cannotBeKO"
    | "cannotBeRemoved"
    | "cannotActivate"
    | "canAttackActive"
    | "cannotBeRested"
    | "freeze";
  duration: Duration | "unsupported";
  expiresAtTurn: number | null;
  expiresAtBattleId: string | null;
  expiresOnTurnStartOfSeat: MatchSeat | null;
}

export interface PromptOption {
  id: string;
  label: string;
  value: string;
  targetId?: string;
}

export type PromptResolutionContext =
  | {
      intent: "battleBlocker";
      battleId: string;
    }
  | {
      intent: "battleCounter";
      battleId: string;
    }
  | {
      intent: "lifeTrigger";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: "trigger";
    }
  | {
      intent: "effectOptional";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      trashHandIds?: string[];
    }
  | {
      intent: "effectCostTrashFromHand";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      amount: number;
      candidateIds: string[];
    }
  | {
      intent: "effectTargetSelection";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Action;
    }
  | {
      intent: "judge";
      issueId?: string | null;
    };

export interface PromptState {
  id: string;
  kind: PromptKind;
  choiceKind: ChoiceKind | null;
  seat: MatchSeat | "judge";
  label: string;
  details: string;
  sourceCardId: string | null;
  sourceInstanceId: string | null;
  eventId: string | null;
  status: "pending" | "resolved" | "cancelled";
  options: PromptOption[];
  minSelections: number;
  maxSelections: number;
  context: Record<string, string | number | boolean | string[] | null>;
  resolutionContext: PromptResolutionContext | null;
}

export interface BattleState {
  id: string;
  attackerId: string;
  originalTargetId: string;
  targetId: string;
  defendingSeat: MatchSeat;
  step: "declare" | "block" | "counter" | "damage" | "complete";
  blockerId: string | null;
  counterCardIds: string[];
  counterTotal: number;
  attackPower: number;
  defensePower: number;
  result: "pending" | "hit" | "ko" | "blocked" | "no_damage";
}

export interface SetupState {
  started: boolean;
  mulliganUsed: Record<MatchSeat, boolean>;
}

export interface EngineCapabilityIssue {
  id: string;
  sequence: number;
  turn: number;
  phase: MatchPhase;
  kind:
    | "unsupportedAction"
    | "unsupportedCondition"
    | "unsupportedTarget"
    | "unsupportedCost"
    | "unsupportedTiming"
    | "invariantViolation";
  code: string;
  actor: EngineActor;
  sourceCardId: string | null;
  sourceInstanceId: string | null;
  eventId: string | null;
  details: string;
}

export type ResolutionItem =
  | {
      id: string;
      kind: "beginTurn";
      seat: MatchSeat;
      skipDraw: boolean;
    }
  | {
      id: string;
      kind: "effectBlock";
      sourceInstanceId: string;
      controller: MatchSeat;
      trigger: EffectTrigger;
      blockIndex: number;
      trashHandIds?: string[];
      confirmed?: boolean;
    }
  | {
      id: string;
      kind: "effectAction";
      sourceInstanceId: string;
      controller: MatchSeat;
      action: Action;
      selectedTargetIds?: string[];
    }
  | {
      id: string;
      kind: "battleBlockStep";
      battleId: string;
    }
  | {
      id: string;
      kind: "battleCounterStep";
      battleId: string;
    }
  | {
      id: string;
      kind: "battleFinalize";
      battleId: string;
    };

export interface PlayerState {
  seat: MatchSeat;
  playerName: string;
  leaderCardId: string;
  leaderInstanceId: string;
  deck: string[];
  hand: string[];
  life: string[];
  trash: string[];
  characterArea: Array<string | null>;
  stageArea: string | null;
  activeDon: number;
  restedDon: number;
  donDeckCount: number;
}

export interface EngineEvent {
  id: string;
  sequence: number;
  turn: number;
  phase: MatchPhase;
  type:
    | "commandAccepted"
    | "commandRejected"
    | "matchCreated"
    | "mulligan"
    | "gameStarted"
    | "phaseChanged"
    | "cardPlayed"
    | "cardMoved"
    | "donAttached"
    | "attackDeclared"
    | "promptCreated"
    | "promptResolved"
    | "resolutionQueued"
    | "battleResolved"
    | "effectResolved"
    | "capabilityIssue"
    | "judgeAction"
    | "winnerDeclared";
  actor: EngineActor;
  sourceCardId: string | null;
  sourceInstanceId: string | null;
  targetIds: string[];
  eventId: string | null;
  visibility: LogVisibility;
  payload: Record<string, string | number | boolean | string[] | null>;
}

export interface GameLogEntry {
  id: string;
  turn: number;
  phase: MatchPhase;
  sequence: number;
  actor: EngineActor;
  sourceCardId: string | null;
  sourceInstanceId: string | null;
  targetIds: string[];
  eventId: string | null;
  visibility: LogVisibility;
  message: string;
  privateMessages: Partial<Record<MatchSeat, string>>;
  judgeMessage: string | null;
}

export interface MatchState {
  config: Required<
    Pick<
      MatchConfig,
      | "judgeFallback"
      | "openingHandSize"
      | "maxCharacterSlots"
      | "shuffleDecks"
      | "skipFirstTurnDraw"
    >
  > &
    Pick<MatchConfig, "firstPlayer" | "players" | "seed">;
  status: MatchStatus;
  activeSeat: MatchSeat;
  turnNumber: number;
  phase: MatchPhase;
  players: Record<MatchSeat, PlayerState>;
  cards: Record<string, CardInstance>;
  modifiers: Record<string, ModifierState>;
  promptQueue: PromptState[];
  battle: BattleState | null;
  winner: MatchSeat | null;
  setup: SetupState;
  idCounter: number;
  eventSequence: number;
  logSequence: number;
  capabilitySequence: number;
  eventHistory: EngineEvent[];
  logHistory: GameLogEntry[];
  capabilityHistory: EngineCapabilityIssue[];
  resolutionQueue: ResolutionItem[];
  resolutionStatus: ResolutionStatus;
  commandHistory: Array<GameCommand | JudgeCommand>;
}

export interface PromptResolution {
  promptId: string;
  optionId?: string;
  selectedIds?: string[];
  note?: string;
  confirm?: boolean;
}

export interface GameCommandBase {
  seat: MatchSeat;
}

export type GameCommand =
  | ({ type: "mulligan" } & GameCommandBase)
  | ({ type: "startGame" } & GameCommandBase)
  | ({ type: "endTurn" } & GameCommandBase)
  | ({
      type: "playCard";
      instanceId: string;
      slotIndex?: number;
    } & GameCommandBase)
  | ({
      type: "attachDon";
      targetId: string;
      amount?: number;
    } & GameCommandBase)
  | ({
      type: "declareAttack";
      attackerId: string;
      targetId: string;
    } & GameCommandBase)
  | ({
      type: "activateEffect";
      sourceInstanceId: string;
      trigger: "activateMain" | "main";
      trashHandIds?: string[];
    } & GameCommandBase)
  | ({
      type: "resolvePrompt";
    } & GameCommandBase &
      PromptResolution);

export type JudgeCommand =
  | {
      type: "judgeResolvePrompt";
      seat: "judge";
      promptId: string;
      note: string;
    }
  | {
      type: "judgeMoveCard";
      seat: "judge";
      instanceId: string;
      owner: MatchSeat;
      zone: Exclude<CardZone, "leader">;
      slotIndex?: number;
      deckPosition?: "top" | "bottom";
      note?: string;
    }
  | {
      type: "judgeSetWinner";
      seat: "judge";
      winner: MatchSeat;
      note?: string;
    };

export type EngineCommand = GameCommand | JudgeCommand;

export interface ApplyCommandResult {
  state: MatchState;
  accepted: boolean;
  reason: string | null;
  events: EngineEvent[];
  logs: GameLogEntry[];
  patches: Patch[];
  inversePatches: Patch[];
  capabilityIssues: EngineCapabilityIssue[];
}

export interface ReplayResult {
  state: MatchState;
  results: ApplyCommandResult[];
}

export interface LegalCommandDescriptor {
  type: EngineCommand["type"];
  seat: EngineActor;
  label: string;
  sourceId?: string;
  targetIds?: string[];
  slotChoices?: number[];
  promptId?: string;
  options?: PromptOption[];
}

export type ProjectedDecisionKind =
  | "chooseAction"
  | "chooseOption"
  | "selectCards"
  | "selectTargets"
  | "payCost"
  | "orderItems"
  | "confirm"
  | "respond"
  | "resolveStep";

export type ProjectedEntityKind =
  | "card"
  | "player"
  | "zone"
  | "counter"
  | "token"
  | "die"
  | "option";

export interface ProjectedEntityRef {
  kind: ProjectedEntityKind;
  id: string;
  ownerId?: string;
  zoneId?: string;
}

export interface ProjectedDecisionConstraint {
  id: string;
  label: string;
  operator?: "eq" | "neq" | "lt" | "lte" | "gt" | "gte" | "includes";
  value?: string | number | boolean;
  gameSpecific?: boolean;
}

export interface ProjectedEntityCandidate {
  ref: ProjectedEntityRef;
  label: string;
  legal: boolean;
  disabledReason?: string;
  matchedConstraints?: string[];
  publicInfo?: Record<string, string | number | boolean | null>;
}

export interface ProjectedActionCandidate {
  id: string;
  label: string;
  commandType: EngineCommand["type"];
  source?: ProjectedEntityRef;
  targets?: ProjectedEntityRef[];
  slotChoices?: number[];
  options?: PromptOption[];
}

export type ProjectedDecisionStep =
  | {
      id: string;
      kind: "chooseAction";
      label: string;
      actions: ProjectedActionCandidate[];
    }
  | {
      id: string;
      kind: "chooseOption";
      label: string;
      options: PromptOption[];
      min: number;
      max: number;
    }
  | {
      id: string;
      kind: "selectEntity";
      role: string;
      label: string;
      entityKinds: ProjectedEntityKind[];
      min: number;
      max: number;
      candidates: ProjectedEntityCandidate[];
      constraints: ProjectedDecisionConstraint[];
      selected: ProjectedEntityRef[];
      allowDuplicates?: boolean;
      optional?: boolean;
      uiHints?: {
        highlightZones?: string[];
        preferredPresentation?: "board" | "modal" | "drawer" | "inline";
        emptyMessage?: string;
      };
    }
  | {
      id: string;
      kind: "payCost";
      label: string;
      costType?: string;
      entityKinds: ProjectedEntityKind[];
      min: number;
      max: number;
      candidates: ProjectedEntityCandidate[];
      constraints: ProjectedDecisionConstraint[];
      selected: ProjectedEntityRef[];
    }
  | {
      id: string;
      kind: "orderItems";
      label: string;
      candidates: ProjectedEntityCandidate[];
      min: number;
      max: number;
    }
  | {
      id: string;
      kind: "confirm";
      label: string;
      confirmLabel: string;
      cancelLabel: string;
      options: PromptOption[];
    };

export interface ProjectedDecisionSubmitSpec {
  commandType: EngineCommand["type"];
  payloadSchemaVersion: number;
  promptId?: string;
  requiredStepIds: string[];
}

export interface ProjectedDecisionValidationSummary {
  staleStateId?: number;
  errors: string[];
}

export interface ProjectedDecision {
  id: string;
  gameId: "one-piece";
  actorId: MatchSeat | "judge";
  priority: "active" | "response" | "simultaneous" | "judge";
  kind: ProjectedDecisionKind;
  title: string;
  message?: string;
  source?: ProjectedEntityRef;
  timing?: {
    phase?: MatchPhase;
    step?: BattleState["step"];
    trigger?: string;
    stackItemId?: string;
  };
  steps: ProjectedDecisionStep[];
  currentStepId?: string;
  canCancel?: boolean;
  cancelLabel?: string;
  canPass?: boolean;
  passLabel?: string;
  validation?: ProjectedDecisionValidationSummary;
  submit: ProjectedDecisionSubmitSpec;
  extensions?: Record<string, string | number | boolean | string[] | null>;
}

export interface ProjectedCard {
  instanceId: string | null;
  cardId: string | null;
  name: string | null;
  owner: MatchSeat;
  zone: CardZone;
  rested: boolean;
  attachedDon: number;
  power: number | null;
  cost: number | null;
  hidden: boolean;
}

export interface ProjectedPlayerState {
  seat: MatchSeat;
  playerName: string;
  leader: ProjectedCard;
  handCount: number;
  deckCount: number;
  lifeCount: number;
  trash: ProjectedCard[];
  stage: ProjectedCard | null;
  characters: Array<ProjectedCard | null>;
  hand: ProjectedCard[];
  life: ProjectedCard[];
  deckTop: ProjectedCard | null;
  activeDon: number;
  restedDon: number;
  donDeckCount: number;
}

export interface ProjectedPrompt {
  id: string;
  kind: PromptKind;
  choiceKind: ChoiceKind | null;
  seat: MatchSeat | "judge";
  label: string;
  details: string;
  options: PromptOption[];
  minSelections: number;
  maxSelections: number;
}

export interface ProjectedLogEntry {
  id: string;
  turn: number;
  phase: MatchPhase;
  sequence: number;
  actor: EngineActor;
  sourceCardId: string | null;
  sourceInstanceId: string | null;
  targetIds: string[];
  eventId: string | null;
  visibility: LogVisibility;
  message: string;
}

export interface PlayerView {
  viewer: Viewer;
  status: MatchStatus;
  activeSeat: MatchSeat;
  turnNumber: number;
  phase: MatchPhase;
  winner: MatchSeat | null;
  players: Record<MatchSeat, ProjectedPlayerState>;
  prompts: ProjectedPrompt[];
  decisions: ProjectedDecision[];
  battle: BattleState | null;
  logs: ProjectedLogEntry[];
}
