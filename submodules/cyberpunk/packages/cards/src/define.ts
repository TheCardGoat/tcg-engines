import type {
  Ability,
  AttachmentDefinition,
  CardKeyword,
  StructuredCardDefinition,
  TimingTrigger,
} from "@tcg/cyberpunk-types";

/**
 * Canonical attachment for Gear that equips to a friendly unit or face-up legend in play.
 * All current Gear (7 cards) share this exact shape. Authors should call this rather than
 * inline the literal so the rule lives in one place.
 */
export function gearAttachmentToUnitOrLegend(): AttachmentDefinition {
  return {
    text: "Equip to a unit or face-up legend.",
    target: {
      selector: "card",
      controller: "friendly",
      zones: ["field", "legendArea"],
      cardTypes: ["unit", "legend"],
      face: "faceUp",
    },
  };
}

const TIMING_TRIGGERS: ReadonlySet<TimingTrigger> = new Set(["play", "attack", "flip", "call"]);

export function deriveTimingTriggers(abilities: readonly Ability[]): TimingTrigger[] {
  const seen: TimingTrigger[] = [];
  for (const ability of abilities) {
    const tag = ability.trigger?.trigger;
    if (tag && TIMING_TRIGGERS.has(tag as TimingTrigger)) {
      const t = tag as TimingTrigger;
      if (!seen.includes(t)) seen.push(t);
    }
  }
  return seen;
}

export function deriveKeywords(abilities: readonly Ability[]): CardKeyword[] {
  const seen: CardKeyword[] = [];
  for (const ability of abilities) {
    if (ability.kind === "keyword" && ability.keyword && !seen.includes(ability.keyword)) {
      seen.push(ability.keyword);
    }
  }
  return seen;
}

export function deriveCardSurface(card: StructuredCardDefinition): {
  timingTriggers: TimingTrigger[];
  keywords: CardKeyword[];
} {
  return {
    timingTriggers: deriveTimingTriggers(card.abilities),
    keywords: deriveKeywords(card.abilities),
  };
}
