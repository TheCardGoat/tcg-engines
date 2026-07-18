import type { Action, Condition, EffectTrigger } from "@tcg/op-types";

export type ParsedCondition =
  | Extract<Condition, { condition: "donAttached" }>
  | Extract<Condition, { condition: "turn" }>;

export type RawCost =
  | { type: "restDon"; amount: number }
  | { type: "returnDon"; amount: number; minimumAmount?: never }
  | { type: "returnDon"; minimumAmount: number; amount?: never }
  | { type: "trashFromHand"; raw: string }
  | { type: "trashFromDeck"; amount: number; position: "top" }
  | { type: "trashLife"; amount: number; position: "top" | "bottom" | "choice" }
  | { type: "restThisCard" }
  | { type: "trashThisCard" }
  | { type: "returnThisToHand" }
  | { type: "returnThisToDeck"; position: "top" | "bottom" }
  | { type: "returnThisAndHandToDeck"; handAmount: number; position: "top" | "bottom" }
  | { type: "turnLifeFaceUp"; count: number; faceUp: boolean }
  | { type: "returnCharacter"; raw: string }
  | { type: "returnCharacterToDeck"; raw: string }
  | { type: "returnFromTrashToDeck"; raw: string }
  | { type: "returnHandToDeck"; amount: number; position: "top" | "bottom" }
  | { type: "addLifeToHand"; amount: number; position: "top" | "bottom" | "choice" }
  | { type: "revealFromHand"; raw: string }
  | { type: "restCards"; raw: string }
  | { type: "trashCharacter"; raw: string }
  | { type: "koCharacter"; raw: string }
  | { type: "playCard"; raw: string }
  | { type: "trashCard"; raw: string }
  | { type: "modifyLeaderPower"; value: number; duration: "thisTurn"; requiresActive?: boolean }
  | { type: "unknown"; raw: string };

export interface RawEffectSegment {
  /** The trigger(s) for this segment. Dual triggers produce length 2. Empty = permanent effect. */
  triggers: EffectTrigger[];
  /** Conditions extracted from bracket prefixes (DON!! attached, turn conditions) */
  conditions: ParsedCondition[];
  /** Whether [Once Per Turn] was found in the prefix chain */
  oncePerTurn: boolean;
  /** Costs extracted from the prefix/cost area before the colon */
  costs: RawCost[];
  /** Whether "You may" appeared in the cost area */
  optional: boolean;
  /** The raw action text after all prefix/cost parsing */
  rawActionText: string;
  /** For "Choose one:" patterns, the individual bullet items */
  choiceItems?: string[];
  /** Action text printed after the final choice bullet and resolved after the choice */
  postChoiceActionText?: string;
}

export interface ParsedEffectText {
  /** Text segments that precede any trigger bracket */
  plainStatements: string[];
  /** Parsed effect segments, each corresponding to a future EffectBlock */
  segments: RawEffectSegment[];
  /** Errata note stripped from end, if present */
  errata?: string;
}

export interface ParseActionsResult {
  parsed: Action[];
  unparsed: string;
}

export interface InlineConditionResult {
  condition: Condition;
  remainingText: string;
}
