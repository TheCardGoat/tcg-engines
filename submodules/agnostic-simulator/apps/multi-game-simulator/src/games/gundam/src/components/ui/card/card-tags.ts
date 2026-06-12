import type { LucideIcon } from "lucide-react";
import {
  ActivityIcon,
  ArrowUpIcon,
  BanIcon,
  HeartCrackIcon,
  Link2Icon,
  MoonStarIcon,
  ShieldAlertIcon,
  ShieldBanIcon,
  ShieldPlusIcon,
  SparklesIcon,
  SwordsIcon,
  WrenchIcon,
  ZapIcon,
} from "lucide-react";

import { m } from "../../../lib/i18n/messages.ts";
import type { GameCardData, KeywordEffect, KeywordEffectEntry } from "../types.ts";

export type TagTone = "default" | "info" | "success" | "warning" | "danger";

export interface CardTag {
  readonly id: string;
  readonly icon: LucideIcon;
  readonly label: string;
  readonly tooltip: string;
  readonly tone: TagTone;
}

const KEYWORD_META: Record<KeywordEffect, { icon: LucideIcon; tone: TagTone }> = {
  Blocker: { icon: ShieldAlertIcon, tone: "info" },
  Repair: { icon: WrenchIcon, tone: "success" },
  Breach: { icon: ShieldPlusIcon, tone: "danger" },
  FirstStrike: { icon: ZapIcon, tone: "warning" },
  HighManeuver: { icon: SparklesIcon, tone: "info" },
  Support: { icon: ArrowUpIcon, tone: "success" },
  Suppression: { icon: SwordsIcon, tone: "warning" },
};

function keywordTag(entry: KeywordEffectEntry, idPrefix = "kw", toneOverride?: TagTone): CardTag {
  const meta = KEYWORD_META[entry.keyword];
  const base = `sim.card.keyword.${entry.keyword}`;
  const label =
    entry.value != null ? m[`${base}.labelValue`]({ value: entry.value }) : m[`${base}.label`]();
  const tooltip =
    entry.value != null
      ? m[`${base}.tooltipValue`]({ value: entry.value })
      : m[`${base}.tooltip`]();
  return {
    id: `${idPrefix}-${entry.keyword}`,
    icon: meta.icon,
    label,
    tooltip,
    tone: toneOverride ?? meta.tone,
  };
}

function asKeywordEffect(keyword: string | undefined): KeywordEffect | null {
  if (!keyword) return null;
  return keyword in KEYWORD_META ? (keyword as KeywordEffect) : null;
}

function keywordFromActiveEffect(effect: NonNullable<GameCardData["activeEffects"]>[number]) {
  const direct = asKeywordEffect(effect.keyword);
  if (direct) return direct;

  const fromDescription = effect.description.match(/^Grant:\s*(\w+)$/i)?.[1];
  return asKeywordEffect(fromDescription);
}

export function getCardTags(card: GameCardData): readonly CardTag[] {
  const tags: CardTag[] = [];

  const seenKeywords = new Set<KeywordEffect>();

  for (const entry of card.keywords ?? []) {
    tags.push(keywordTag(entry));
    seenKeywords.add(entry.keyword);
  }

  if (card.grantedKeywords) {
    for (const kw of card.grantedKeywords) {
      if (seenKeywords.has(kw as KeywordEffect)) continue;
      const meta = KEYWORD_META[kw as KeywordEffect];
      if (!meta) continue;
      const base = `sim.card.keyword.${kw}`;
      tags.push({
        id: `granted-${kw}`,
        icon: meta.icon,
        label: m[`${base}.label`](),
        tooltip: m[`${base}.tooltip`](),
        tone: "success",
      });
      seenKeywords.add(kw as KeywordEffect);
    }
  }

  const nonKeywordEffects =
    card.activeEffects?.filter((effect) => {
      const keyword = keywordFromActiveEffect(effect);
      if (!keyword) return true;
      if (seenKeywords.has(keyword)) return false;
      tags.push(keywordTag({ keyword }, "effect", "success"));
      seenKeywords.add(keyword);
      return false;
    }) ?? [];

  // Restriction chips. `cantAttack` covers both engine-sourced
  // "cannot-attack" restrictions AND non-Link units deployed this turn
  // (rule 3-2-4). Disambiguate via `deployedThisTurn` + `isLinkUnit` so
  // the tooltip tells the player *why*. The matching full-card overlay
  // (see CardFace `DeployedOverlay`) is the strong visual; this chip
  // adds the semantic "why" without duplicating the deploy-sickness UI.
  if (card.cantAttack) {
    const deployed = card.deployedThisTurn === true && card.isLinkUnit !== true;
    tags.push({
      id: "cant-attack",
      icon: BanIcon,
      label: m["sim.card.tags.cantAttack.label"](),
      tooltip: deployed
        ? m["sim.card.tags.cantAttackDeployed.tooltip"]()
        : m["sim.card.tags.cantAttack.tooltip"](),
      tone: "danger",
    });
  }

  if (card.cantBlock) {
    tags.push({
      id: "cant-block",
      icon: ShieldBanIcon,
      label: m["sim.card.tags.cantBlock.label"](),
      tooltip: m["sim.card.tags.cantBlock.tooltip"](),
      tone: "warning",
    });
  }

  if (nonKeywordEffects.length > 0) {
    tags.push({
      id: "effects",
      icon: ActivityIcon,
      label: `${nonKeywordEffects.length}`,
      tooltip: nonKeywordEffects
        .map((e) => (e.sourceLabel ? `${e.sourceLabel}: ${e.description}` : e.description))
        .join(" · "),
      tone: "success",
    });
  }

  if (card.exerted) {
    tags.push({
      id: "rested",
      icon: MoonStarIcon,
      label: m["sim.card.tags.rested.label"](),
      tooltip: m["sim.card.tags.rested.tooltip"](),
      tone: "warning",
    });
  }

  if (card.linkRequirement) {
    tags.push({
      id: "link",
      icon: Link2Icon,
      label: m["sim.card.tags.link.label"](),
      tooltip: m["sim.card.tags.link.tooltipValue"]({ requirement: card.linkRequirement }),
      tone: "info",
    });
  }

  if ((card.damage ?? 0) > 0) {
    tags.push({
      id: "damage",
      icon: HeartCrackIcon,
      label: `${card.damage}`,
      tooltip: m["sim.card.tags.damage.tooltip"]({ count: card.damage ?? 0 }),
      tone: "danger",
    });
  }

  return tags;
}

export const TAG_TONE_CLASSES: Record<TagTone, string> = {
  default: "border-white/12 bg-black/35 text-white/90",
  info: "border-sky-400/35 bg-sky-500/16 text-sky-100",
  success: "border-emerald-400/35 bg-emerald-500/16 text-emerald-100",
  warning: "border-amber-400/35 bg-amber-500/18 text-amber-50",
  danger: "border-rose-400/35 bg-rose-500/18 text-rose-50",
};
