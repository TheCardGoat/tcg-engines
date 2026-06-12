import type { AbilitySignals, FindingCategory } from "./types";
import { KNOWN_KEYWORD_PATTERNS } from "./types";
import { normalizeCardTextContent } from "./utils";

export function isWrongActionFamily(signals: AbilitySignals): boolean {
  return signals.topLevelTypes.includes("action") && !signals.hasFloatingTriggeredAction;
}

export function classifyTriggerFindingCategory(signals: AbilitySignals): FindingCategory {
  if (
    signals.hasTopLevelTriggered ||
    signals.hasFloatingTriggeredAction ||
    signals.hasTopLevelReplacement ||
    isWrongActionFamily(signals)
  ) {
    return "trigger-like-family-mismatch";
  }

  return "trigger-like-missing";
}

export function classifyActivatedFindingCategory(signals: AbilitySignals): FindingCategory {
  if (
    signals.topLevelTypes.includes("activated") ||
    signals.topLevelTypes.includes("action") ||
    signals.topLevelTypes.includes("triggered") ||
    signals.nestedTypes.includes("activated")
  ) {
    return "activated-like-family-mismatch";
  }

  return "activated-like-missing";
}

export function startsWithTriggerSignal(text: string): boolean {
  return /^\s*(?:(?:Once\s+)?during\b[^,]*,\s*|while\b[^,]*,\s*)*(?:When|Whenever|At)\b/i.test(
    text,
  );
}

export function isReplacementLikeText(text: string): boolean {
  return /\bwould\b/i.test(text) && /\binstead\b/i.test(text);
}

export function isActivatedLikeText(text: string): boolean {
  return /^\s*(?:\{E\}(?:\s+one of your [^-—,\n]+)?|\d+\s*\{I\}|\{I\}|Banish this (?:item|character))(?:\s*,?\s*(?:\{E\}(?:\s+one of your [^-—,\n]+)?|\d+\s*\{I\}|\{I\}|Banish this (?:item|character)))*\s*(?:—|–|-)/.test(
    text,
  );
}

export function isCostReductionText(text: string): boolean {
  return /\bpay\s+\d+\s+\{I\}\s+less\b/i.test(text);
}

export function detectKeywordGrant(text: string): string | null {
  for (const { keyword, pattern } of KNOWN_KEYWORD_PATTERNS) {
    if (pattern.test(text)) {
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const negativeGainPattern = new RegExp(`(?:can't|cant)\\s+gain\\s+${escapedKeyword}\\b`, "i");
      const loseKeywordPattern = new RegExp(`lose(?:s)?\\s+${escapedKeyword}\\b`, "i");

      if (negativeGainPattern.test(text) || loseKeywordPattern.test(text)) {
        continue;
      }

      return keyword;
    }
  }

  return null;
}

export function isDeckbuildingOnlyText(text: string): boolean {
  return /\bin your deck\b/i.test(text);
}

export function isGameplayAbilityLikeText(text: string): boolean {
  if (isDeckbuildingOnlyText(text)) {
    return false;
  }

  return (
    startsWithTriggerSignal(text) ||
    isReplacementLikeText(text) ||
    isActivatedLikeText(text) ||
    isCostReductionText(text) ||
    detectKeywordGrant(text) !== null ||
    /\b(?:Shift\b|While\b|During\b|Your\b|Each\b|Whenever\b|When\b|At\b|can't\b|can't\b|gets?\b|gain(?:s)?\b|lose(?:s)?\b|draw\b|deal\b|ready\b|exert\b|banish\b|put\b|return\b|move\b)\b/i.test(
      text,
    )
  );
}

export function isLikelyKeywordOnlyTitle(title: string): boolean {
  return /^(?:Shift|Puppy Shift|Universal Shift|Vanish|Evasive|Bodyguard|Support|Alert|Reckless|Rush|Ward|Singer|Sing Together|Challenger|Resist|Boost)\b/i.test(
    title.trim(),
  );
}

export function isLikelyEntryAlignmentNoise(entry: { title: string }): boolean {
  const trimmedTitle = entry.title.trim();

  if (!trimmedTitle) {
    return true;
  }

  if (
    trimmedTitle.startsWith("•") ||
    trimmedTitle.startsWith("-") ||
    trimmedTitle.startsWith("*")
  ) {
    return true;
  }

  if (/^\([^)]*\)$/.test(trimmedTitle)) {
    return true;
  }

  if (isLikelyKeywordOnlyTitle(trimmedTitle)) {
    return true;
  }

  return false;
}
