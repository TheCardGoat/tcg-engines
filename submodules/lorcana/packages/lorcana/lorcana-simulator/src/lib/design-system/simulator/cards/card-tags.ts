import type { Component } from "svelte";
import BanIcon from "@lucide/svelte/icons/ban";
import DropletsIcon from "@lucide/svelte/icons/droplets";
import FlameIcon from "@lucide/svelte/icons/flame";
import FootprintsIcon from "@lucide/svelte/icons/footprints";
import HandHelpingIcon from "@lucide/svelte/icons/hand-helping";
import HeartCrackIcon from "@lucide/svelte/icons/heart-crack";
import HeartIcon from "@lucide/svelte/icons/heart";
import MapPinnedIcon from "@lucide/svelte/icons/map-pinned";
import MoonStarIcon from "@lucide/svelte/icons/moon-star";
import Music4Icon from "@lucide/svelte/icons/music-4";
import PackageOpenIcon from "@lucide/svelte/icons/package-open";
import Repeat2Icon from "@lucide/svelte/icons/repeat-2";
import ShieldAlertIcon from "@lucide/svelte/icons/shield-alert";
import ShieldBanIcon from "@lucide/svelte/icons/shield-ban";
import ShieldIcon from "@lucide/svelte/icons/shield";
import ShieldMinusIcon from "@lucide/svelte/icons/shield-minus";
import ShieldPlusIcon from "@lucide/svelte/icons/shield-plus";
import SparklesIcon from "@lucide/svelte/icons/sparkles";
import StarIcon from "@lucide/svelte/icons/star";
import SwordsIcon from "@lucide/svelte/icons/swords";
import TriangleAlertIcon from "@lucide/svelte/icons/triangle-alert";
import WindIcon from "@lucide/svelte/icons/wind";
import ZapIcon from "@lucide/svelte/icons/zap";
import { m } from "$lib/i18n/messages.js";
import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";
import { getStatSmallIconUrl, getLoreIconUrl } from "@/features/simulator/model/asset-urls.js";

type TagTone = "default" | "info" | "success" | "warning" | "danger";

export interface LorcanaCardTag {
  id: string;
  label: string;
  tooltip: string;
  icon: Component<{ class?: string }>;
  tone?: TagTone;
}

export interface LorcanaCardStatModifier extends LorcanaCardTag {
  stat: "strength" | "willpower" | "lore";
  value: number;
  signedValue: string;
  iconUrl: string;
}

export interface LorcanaCardStatBadge {
  id: string;
  stat: "strength" | "willpower" | "lore";
  currentValue: number;
  iconUrl: string;
  tone: "neutral" | "success" | "warning";
  label: string;
}

export interface LorcanaCardTagGroups {
  tags: LorcanaCardTag[];
  statModifiers: LorcanaCardStatModifier[];
  statBadges: LorcanaCardStatBadge[];
}

function parseNumericKeyword(card: LorcanaCardSnapshot, keyword: string): number | null {
  const pattern =
    keyword === "Shift"
      ? /^(?:Puppy |Universal )?Shift (\d+)(?: \{I\})?$/i
      : keyword === "Singer"
        ? /^Singer (\d+)$/i
        : keyword === "Sing Together"
          ? /^Sing Together (\d+)$/i
          : keyword === "Boost"
            ? /^Boost (\d+)(?: \{I\})?$/i
            : keyword === "Resist"
              ? /^Resist \+(\d+)$/i
              : keyword === "Challenger"
                ? /^Challenger \+(\d+)$/i
                : null;

  for (const entry of card.textEntries ?? []) {
    const normalizedTitle = entry.title.trim();
    if (!normalizedTitle) {
      continue;
    }

    const match = pattern ? normalizedTitle.match(pattern) : null;
    if (!match) {
      continue;
    }

    const value = Number.parseInt(match[1], 10);
    return Number.isFinite(value) ? value : null;
  }

  return null;
}

function hasKeyword(card: LorcanaCardSnapshot, keyword: string): boolean {
  return (card.keywords ?? []).includes(keyword);
}

function hasRestriction(card: LorcanaCardSnapshot, restriction: string): boolean {
  return typeof card.temporaryRestrictions?.[restriction] === "number";
}

function pushTag(tags: LorcanaCardTag[], tag: LorcanaCardTag | null): void {
  if (tag) {
    tags.push(tag);
  }
}

function getSignedCopy(value: number): { amount: string; sign: string } {
  return {
    amount: String(Math.abs(value)),
    sign: value > 0 ? "+" : "-",
  };
}

function getAtLocationTooltip(card: LorcanaCardSnapshot): string {
  if (card.atLocationLabel) {
    return `This character is currently at location: ${card.atLocationLabel}`;
  }

  return m["sim.card.tags.atLocation.tooltip"]({});
}

function getActiveStatEffectTooltip(
  card: LorcanaCardSnapshot,
  stat: "strength" | "willpower" | "lore",
  fallback: string,
): string {
  const relatedEffects = (card.activeEffects ?? []).filter((effect) => effect.stat === stat);
  if (relatedEffects.length === 0) {
    return fallback;
  }

  return relatedEffects.map((effect) => effect.description).join("; ");
}

function buildLorcanaCardTagGroups(card: LorcanaCardSnapshot): LorcanaCardTagGroups & {
  orderedTags: LorcanaCardTag[];
} {
  const preStatTags: LorcanaCardTag[] = [];
  const postStatTags: LorcanaCardTag[] = [];
  const statModifiers: LorcanaCardStatModifier[] = [];
  const strengthDelta =
    typeof card.strength === "number" && typeof card.baseStrength === "number"
      ? card.strength - card.baseStrength
      : 0;
  const willpowerDelta =
    typeof card.willpower === "number" && typeof card.baseWillpower === "number"
      ? card.willpower - card.baseWillpower
      : 0;
  const loreDelta =
    typeof card.loreValue === "number" && typeof card.baseLoreValue === "number"
      ? card.loreValue - card.baseLoreValue
      : 0;
  const singerValue = parseNumericKeyword(card, "Singer");
  const singTogetherValue = parseNumericKeyword(card, "Sing Together");
  const boostValue = parseNumericKeyword(card, "Boost");
  const shiftValue = parseNumericKeyword(card, "Shift");
  const resistValue = card.keywordValues?.resist ?? parseNumericKeyword(card, "Resist") ?? 0;
  const challengerValue =
    card.keywordValues?.challenger ?? parseNumericKeyword(card, "Challenger") ?? 0;

  pushTag(
    preStatTags,
    card.isDrying
      ? {
          id: "fresh-ink",
          label: m["sim.card.tags.freshInk.label"]({}),
          tooltip: m["sim.card.tags.freshInk.tooltip"]({}),
          icon: DropletsIcon,
          tone: "info",
        }
      : null,
  );

  pushTag(
    preStatTags,
    card.damage && card.damage > 0
      ? {
          id: "damage",
          label: m["sim.card.tags.damage.label"]({ count: card.damage }),
          tooltip: m["sim.card.tags.damage.tooltip"]({ count: card.damage }),
          icon: HeartCrackIcon,
          tone: "danger",
        }
      : null,
  );

  if (loreDelta !== 0) {
    const signedCopy = getSignedCopy(loreDelta);
    statModifiers.push({
      id: "lore-bonus",
      stat: "lore",
      label: m["sim.card.tags.loreDelta.label"]({
        amount: signedCopy.amount,
        sign: signedCopy.sign,
      }),
      tooltip: getActiveStatEffectTooltip(
        card,
        "lore",
        m["sim.card.tags.loreDelta.tooltip"]({
          amount: signedCopy.amount,
          sign: signedCopy.sign,
        }),
      ),
      icon: StarIcon,
      iconUrl: getLoreIconUrl(),
      tone: loreDelta > 0 ? "success" : "warning",
      value: loreDelta,
      signedValue: `${signedCopy.sign}${signedCopy.amount}`,
    });
  }

  if (strengthDelta !== 0) {
    const signedCopy = getSignedCopy(strengthDelta);
    statModifiers.push({
      id: "strength-bonus",
      stat: "strength",
      label: m["sim.card.tags.strengthDelta.label"]({
        amount: signedCopy.amount,
        sign: signedCopy.sign,
      }),
      tooltip: getActiveStatEffectTooltip(
        card,
        "strength",
        m["sim.card.tags.strengthDelta.tooltip"]({
          amount: signedCopy.amount,
          sign: signedCopy.sign,
        }),
      ),
      icon: SwordsIcon,
      iconUrl: getStatSmallIconUrl("strength"),
      tone: strengthDelta > 0 ? "success" : "warning",
      value: strengthDelta,
      signedValue: `${signedCopy.sign}${signedCopy.amount}`,
    });
  }

  if (willpowerDelta !== 0) {
    const signedCopy = getSignedCopy(willpowerDelta);
    statModifiers.push({
      id: "willpower-bonus",
      stat: "willpower",
      label: m["sim.card.tags.willpowerDelta.label"]({
        amount: signedCopy.amount,
        sign: signedCopy.sign,
      }),
      tooltip: getActiveStatEffectTooltip(
        card,
        "willpower",
        m["sim.card.tags.willpowerDelta.tooltip"]({
          amount: signedCopy.amount,
          sign: signedCopy.sign,
        }),
      ),
      icon: HeartIcon,
      iconUrl: getStatSmallIconUrl("defense"),
      tone: willpowerDelta > 0 ? "success" : "warning",
      value: willpowerDelta,
      signedValue: `${signedCopy.sign}${signedCopy.amount}`,
    });
  }

  const statBadges: LorcanaCardStatBadge[] = [];
  const hasAnyStatDelta = strengthDelta !== 0 || willpowerDelta !== 0 || loreDelta !== 0;

  if (hasAnyStatDelta && (card.cardType === "character" || card.cardType === "location")) {
    if (typeof card.strength === "number" && card.cardType === "character") {
      statBadges.push({
        id: "strength",
        stat: "strength",
        currentValue: card.strength,
        iconUrl: getStatSmallIconUrl("strength"),
        tone: strengthDelta > 0 ? "success" : strengthDelta < 0 ? "warning" : "neutral",
        label: `Strength ${card.strength}`,
      });
    }

    if (typeof card.willpower === "number") {
      statBadges.push({
        id: "willpower",
        stat: "willpower",
        currentValue: card.willpower,
        iconUrl: getStatSmallIconUrl("defense"),
        tone: willpowerDelta > 0 ? "success" : willpowerDelta < 0 ? "warning" : "neutral",
        label: `Willpower ${card.willpower}`,
      });
    }

    if (typeof card.loreValue === "number") {
      statBadges.push({
        id: "lore",
        stat: "lore",
        currentValue: card.loreValue,
        iconUrl: getLoreIconUrl(),
        tone: loreDelta > 0 ? "success" : loreDelta < 0 ? "warning" : "neutral",
        label: `Lore ${card.loreValue}`,
      });
    }
  }

  if (
    card.cardType === "location" &&
    typeof card.loreValue === "number" &&
    !statBadges.some((badge) => badge.id === "lore")
  ) {
    statBadges.push({
      id: "lore",
      stat: "lore",
      currentValue: card.loreValue,
      iconUrl: getLoreIconUrl(),
      tone: loreDelta > 0 ? "success" : loreDelta < 0 ? "warning" : "neutral",
      label: `Lore ${card.loreValue}`,
    });
  }

  pushTag(
    postStatTags,
    card.readyState === "exerted"
      ? {
          id: "exerted",
          label: m["sim.card.tags.exerted.label"]({}),
          tooltip: m["sim.card.tags.exerted.tooltip"]({}),
          icon: MoonStarIcon,
          tone: "warning",
        }
      : null,
  );

  pushTag(
    postStatTags,
    card.atLocationId
      ? {
          id: "at-location",
          label: m["sim.card.tags.atLocation.label"]({}),
          tooltip: getAtLocationTooltip(card),
          icon: MapPinnedIcon,
          tone: "info",
        }
      : null,
  );

  pushTag(
    postStatTags,
    hasRestriction(card, "cant-ready")
      ? {
          id: "cant-ready",
          label: m["sim.card.tags.cantReady.label"]({}),
          tooltip: m["sim.card.tags.cantReady.tooltip"]({}),
          icon: ShieldMinusIcon,
          tone: "warning",
        }
      : null,
  );

  pushTag(
    postStatTags,
    hasRestriction(card, "cant-challenge")
      ? {
          id: "cant-challenge",
          label: m["sim.card.tags.cantChallenge.label"]({}),
          tooltip: m["sim.card.tags.cantChallenge.tooltip"]({}),
          icon: ShieldBanIcon,
          tone: "warning",
        }
      : null,
  );

  pushTag(
    postStatTags,
    card.hasQuestRestriction
      ? {
          id: "cant-quest",
          label: m["sim.card.tags.cantQuest.label"]({}),
          tooltip: m["sim.card.tags.cantQuest.tooltip"]({}),
          icon: BanIcon,
          tone: "warning",
        }
      : null,
  );

  pushTag(
    postStatTags,
    hasKeyword(card, "Ward")
      ? {
          id: "ward",
          label: m["sim.card.tags.ward.label"]({}),
          tooltip: m["sim.card.tags.ward.tooltip"]({}),
          icon: ShieldIcon,
          tone: "info",
        }
      : null,
  );

  pushTag(
    postStatTags,
    hasKeyword(card, "Vanish")
      ? {
          id: "vanish",
          label: m["sim.card.tags.vanish.label"]({}),
          tooltip: m["sim.card.tags.vanish.tooltip"]({}),
          icon: SparklesIcon,
          tone: "default",
        }
      : null,
  );

  pushTag(
    postStatTags,
    hasKeyword(card, "Support")
      ? {
          id: "support",
          label: m["sim.card.tags.support.label"]({}),
          tooltip: m["sim.card.tags.support.tooltip"]({}),
          icon: HandHelpingIcon,
          tone: "success",
        }
      : null,
  );

  pushTag(
    postStatTags,
    hasKeyword(card, "Singer")
      ? {
          id: "singer",
          label: singerValue
            ? m["sim.card.tags.singer.labelValue"]({ value: singerValue })
            : m["sim.card.tags.singer.label"]({}),
          tooltip: singerValue
            ? m["sim.card.tags.singer.tooltipValue"]({ value: singerValue })
            : m["sim.card.tags.singer.tooltip"]({}),
          icon: Music4Icon,
          tone: "info",
        }
      : null,
  );

  pushTag(
    postStatTags,
    hasKeyword(card, "Sing Together")
      ? {
          id: "sing-together",
          label: singTogetherValue
            ? m["sim.card.tags.singTogether.labelValue"]({ value: singTogetherValue })
            : m["sim.card.tags.singTogether.label"]({}),
          tooltip: singTogetherValue
            ? m["sim.card.tags.singTogether.tooltipValue"]({ value: singTogetherValue })
            : m["sim.card.tags.singTogether.tooltip"]({}),
          icon: Music4Icon,
          tone: "info",
        }
      : null,
  );

  pushTag(
    postStatTags,
    card.playedViaShift === true
      ? {
          id: "shifted",
          label: m["sim.card.tags.shifted.label"]({}),
          tooltip: m["sim.card.tags.shifted.tooltip"]({}),
          icon: Repeat2Icon,
          tone: "info",
        }
      : null,
  );

  pushTag(
    postStatTags,
    card.zoneId === "hand" && hasKeyword(card, "Shift")
      ? {
          id: "shift",
          label: shiftValue
            ? m["sim.card.tags.shift.labelValue"]({ value: shiftValue })
            : m["sim.card.tags.shift.label"]({}),
          tooltip: shiftValue
            ? m["sim.card.tags.shift.tooltipValue"]({ value: shiftValue })
            : m["sim.card.tags.shift.tooltip"]({}),
          icon: Repeat2Icon,
          tone: "info",
        }
      : null,
  );

  pushTag(
    postStatTags,
    hasKeyword(card, "Evasive")
      ? {
          id: "evasive",
          label: m["sim.card.tags.evasive.label"]({}),
          tooltip: m["sim.card.tags.evasive.tooltip"]({}),
          icon: WindIcon,
          tone: "info",
        }
      : null,
  );

  pushTag(
    postStatTags,
    challengerValue > 0
      ? {
          id: "challenger",
          label: m["sim.card.tags.challenger.label"]({ value: challengerValue }),
          tooltip: m["sim.card.tags.challenger.tooltip"]({ value: challengerValue }),
          icon: TriangleAlertIcon,
          tone: "warning",
        }
      : null,
  );

  pushTag(
    postStatTags,
    hasKeyword(card, "Boost")
      ? {
          id: "boost",
          label: boostValue
            ? m["sim.card.tags.boost.labelValue"]({ value: boostValue })
            : m["sim.card.tags.boost.label"]({}),
          tooltip: boostValue
            ? m["sim.card.tags.boost.tooltipValue"]({ value: boostValue })
            : m["sim.card.tags.boost.tooltip"]({}),
          icon: ZapIcon,
          tone: "success",
        }
      : null,
  );

  pushTag(
    postStatTags,
    hasKeyword(card, "Rush")
      ? {
          id: "rush",
          label: m["sim.card.tags.rush.label"]({}),
          tooltip: m["sim.card.tags.rush.tooltip"]({}),
          icon: FlameIcon,
          tone: "danger",
        }
      : null,
  );

  pushTag(
    postStatTags,
    hasKeyword(card, "Bodyguard")
      ? {
          id: "bodyguard",
          label: m["sim.card.tags.bodyguard.label"]({}),
          tooltip: m["sim.card.tags.bodyguard.tooltip"]({}),
          icon: ShieldAlertIcon,
          tone: "warning",
        }
      : null,
  );

  pushTag(
    postStatTags,
    hasKeyword(card, "Reckless")
      ? {
          id: "reckless",
          label: m["sim.card.tags.reckless.label"]({}),
          tooltip: m["sim.card.tags.reckless.tooltip"]({}),
          icon: FootprintsIcon,
          tone: "warning",
        }
      : null,
  );

  pushTag(
    postStatTags,
    resistValue > 0
      ? {
          id: "resist",
          label: m["sim.card.tags.resist.label"]({ value: resistValue }),
          tooltip: m["sim.card.tags.resist.tooltip"]({ value: resistValue }),
          icon: ShieldPlusIcon,
          tone: "success",
        }
      : null,
  );

  pushTag(
    postStatTags,
    (card.cardsUnderCount ?? 0) > 0
      ? {
          id: "cards-under",
          label: m["sim.card.tags.cardsUnder.label"]({ count: card.cardsUnderCount }),
          tooltip: m["sim.card.tags.cardsUnder.tooltip"]({ count: card.cardsUnderCount }),
          icon: PackageOpenIcon,
          tone: "default",
        }
      : null,
  );

  const tags = [...preStatTags, ...postStatTags];

  return {
    tags,
    statModifiers,
    statBadges,
    orderedTags: [...preStatTags, ...statModifiers, ...postStatTags],
  };
}

export function getLorcanaCardTagGroups(card: LorcanaCardSnapshot): LorcanaCardTagGroups {
  const { tags, statModifiers, statBadges } = buildLorcanaCardTagGroups(card);
  return { tags, statModifiers, statBadges };
}

export function getLorcanaCardTags(card: LorcanaCardSnapshot): LorcanaCardTag[] {
  return buildLorcanaCardTagGroups(card).orderedTags;
}
