import * as path from "node:path";
import type {
  AbilityDefinition,
  ActionCard,
  CardText,
  CardTextEntry,
  CharacterCard,
  ItemCard,
  LocationCard,
} from "@tcg/lorcana-types";

export type LorcanaCard = CharacterCard | ActionCard | ItemCard | LocationCard;
export type Severity = "high" | "medium" | "low";

export type FindingCategory =
  | "trigger-like-missing"
  | "trigger-like-family-mismatch"
  | "trigger-timing-mismatch"
  | "trigger-subject-mismatch"
  | "activated-like-missing"
  | "activated-like-family-mismatch"
  | "cost-reduction-family-mismatch"
  | "keyword-grant-missing"
  | "empty-abilities-suspicious"
  | "entry-alignment-missing"
  | "malformed-title-description-split"
  | "ability-name-leak"
  | "missing-ability-name"
  | "canonical-parity";

export interface Finding {
  severity: Severity;
  category: FindingCategory;
  cardName: string;
  canonicalId: string;
  setCardNumber: string;
  filePath: string;
  textSnippet: string;
  expectedSignal: string;
  observedSignal: string;
  whySuspicious: string;
}

export interface Summary {
  cardsScanned: number;
  textEntriesScanned: number;
  findingsBySeverity: Record<Severity, number>;
  findingsByCategory: Record<FindingCategory, number>;
}

export interface NormalizedTextEntry {
  title: string;
  description: string;
  signalText: string;
  fullText: string;
}

export type RecursiveValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | RecursiveObject
  | RecursiveValue[];

export interface RecursiveObject {
  type?: string;
  keyword?: string;
  keywords?: RecursiveValue;
  grantsRush?: boolean;
  trigger?: RecursiveValue;
  events?: RecursiveValue;
  effect?: RecursiveValue;
  ability?: RecursiveValue;
  abilities?: RecursiveValue;
  [key: string]: RecursiveValue;
}

export interface AbilitySignals {
  abilityCount: number;
  topLevelTypes: string[];
  nestedTypes: string[];
  topLevelTriggerEvents: string[];
  nestedTriggerEvents: string[];
  effectFamilies: string[];
  keywords: string[];
  grantedKeywords: string[];
  hasTopLevelTriggered: boolean;
  hasTopLevelReplacement: boolean;
  hasActivatedSupport: boolean;
  hasFloatingTriggeredAction: boolean;
  hasCostReductionSupport: boolean;
  hasKeywordGrantSupport: boolean;
  topLevelTriggerSubjects: string[];
}

export interface ExpectedTriggerClause {
  event: string;
  timing: "when" | "whenever" | "at";
}

export interface AbilitySummary {
  abilityCount: number;
  topLevelTypes: string[];
  triggerEvents: string[];
  effectFamilies: string[];
  keywords: string[];
}

export interface CliOptions {
  json: boolean;
  limit: number;
  canonicalParity: boolean;
}

export interface SuspectedTitleSplit {
  reconstructedTitle: string;
  reconstructedDescription: string;
  reconstructedFullText: string;
}

export const PACKAGE_ROOT = path.resolve(import.meta.dir, "../..");
export const CARDS_ROOT = path.resolve(PACKAGE_ROOT, "src/cards");
export const CARD_DIRECTORY_BY_TYPE = {
  action: "actions",
  character: "characters",
  item: "items",
  location: "locations",
} as const;

export const SEVERITY_ORDER: Record<Severity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const KNOWN_KEYWORD_PATTERNS = [
  { keyword: "Bodyguard", pattern: /\b(?:gain|gains|get|gets)\s+Bodyguard\b/i },
  { keyword: "Challenger", pattern: /\b(?:gain|gains|get|gets)\s+Challenger(?:\s*\+\d+)?\b/i },
  { keyword: "Evasive", pattern: /\b(?:gain|gains|get|gets)\s+Evasive\b/i },
  { keyword: "Rush", pattern: /\b(?:gain|gains|get|gets)\s+Rush\b/i },
  { keyword: "Support", pattern: /\b(?:gain|gains|get|gets)\s+Support\b/i },
  { keyword: "Resist", pattern: /\b(?:gain|gains|get|gets)\s+Resist(?:\s*\+\d+)?\b/i },
  { keyword: "Singer", pattern: /\b(?:gain|gains|get|gets)\s+Singer(?:\s+\d+)?\b/i },
  { keyword: "Vanish", pattern: /\b(?:gain|gains|get|gets)\s+Vanish\b/i },
  { keyword: "Ward", pattern: /\b(?:gain|gains|get|gets)\s+Ward\b/i },
  { keyword: "Reckless", pattern: /\b(?:gain|gains|get|gets)\s+Reckless\b/i },
] as const;

export const PLAIN_TEXT_TITLE_PATTERN =
  /^(?<title>[A-Z0-9][A-Z0-9'",.!?&/:;+-]*(?: [A-Z0-9][A-Z0-9'",.!?&/:;+-]*)*) (?<description>(?:When|Whenever|At|During|While|If|Choose|Each|Your|This|Once)\b.*)$/;

export const SPLIT_TITLE_CONTINUATION_PATTERN =
  /^(?<titleContinuation>[A-Z0-9][A-Z0-9'",.!?&/:;+-]*(?: [A-Z0-9][A-Z0-9'",.!?&/:;+-]*){0,5}) (?<description>(?:When|Whenever|At|During|While|If|Choose|Each|Your|This|Once|Characters)\b.*)$/;

export const NON_EFFECT_FAMILY_TYPES = new Set([
  "action",
  "activated",
  "triggered",
  "static",
  "keyword",
  "replacement",
  "optional",
  "conditional",
  "sequence",
  "choice",
  "or",
  "for-each",
  "for-each-opponent",
]);

export { type AbilityDefinition, type CardText, type CardTextEntry };
