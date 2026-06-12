import type { CardColor, EffectCondition, EffectCost, EffectTiming } from "@tcg/gundam-types";
import { CARD_COLORS } from "./helpers.ts";

// ─────────────────────────────────────────────────────────────────────────────
// Timing label map
// ─────────────────────────────────────────────────────────────────────────────

type ContinuousHeaderCondition = Extract<EffectCondition, { type: "duringPair" | "duringLink" }>;
type ContinuousHeaderConditionType = ContinuousHeaderCondition["type"];
type HeaderLabel = EffectTiming | ContinuousHeaderConditionType | "OncePerTurn" | "Pilot";

export const TIMING_LABEL_MAP: Record<string, HeaderLabel> = {
  burst: "burst",
  deploy: "deploy",
  attack: "attack",
  "when paired": "whenPaired",
  "during pair": "duringPair",
  "when linked": "whenLinked",
  "during link": "duringLink",
  destroyed: "destroyed",
  main: "main",
  action: "action",
  activate·main: "activate:main",
  activate·action: "activate:action",
  "once per turn": "OncePerTurn",
  pilot: "Pilot",
};

// ─────────────────────────────────────────────────────────────────────────────
// ParsedHeader interface
// ─────────────────────────────────────────────────────────────────────────────

export interface ParsedHeader {
  timings: EffectTiming[];
  conditions: EffectCondition[];
  oncePerTurn: boolean;
  cost: EffectCost | undefined;
  pilotName: string | undefined;
  /** Pilot color/trait restriction from composite brackets, e.g. 【During Pair·Red Pilot】 */
  pilotQualifier:
    | { color?: CardColor; hasTrait?: string; maxLevel?: number; minLevel?: number }
    | undefined;
  /** remaining text after all 【...】 blocks */
  rest: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Header parser
// ─────────────────────────────────────────────────────────────────────────────

/** Extract all consecutive 【Keyword】 blocks from the front of a segment. */
export function parseHeader(segment: string): ParsedHeader {
  const timings: EffectTiming[] = [];
  const conditions: EffectCondition[] = [];
  let oncePerTurn = false;
  let pilotName: string | undefined;
  let pilotQualifier:
    | { color?: CardColor; hasTrait?: string; maxLevel?: number; minLevel?: number }
    | undefined;
  const cost: EffectCost = {};
  let hasCost = false;
  let pos = 0;

  while (pos < segment.length) {
    const bracketStart = segment.indexOf("【", pos);
    if (bracketStart === -1) break;
    // Only absorb if the bracket is at the current leading position (ignoring spaces)
    if (segment.slice(pos, bracketStart).trim() !== "") break;
    const bracketEnd = segment.indexOf("】", bracketStart);
    if (bracketEnd === -1) break;
    const label = segment.slice(bracketStart + 1, bracketEnd).trim();

    // Pilot: capture the pilot name from the rest of the segment
    if (label.toLowerCase() === "pilot") {
      const nameMatch = segment.slice(bracketEnd + 1).match(/^\s*\[([^\]]+)\]/);
      if (nameMatch) pilotName = nameMatch[1];
      pos = bracketEnd + 1;
      break;
    }

    const mapped = TIMING_LABEL_MAP[label.toLowerCase()];
    if (mapped === "OncePerTurn") {
      oncePerTurn = true;
    } else if (mapped === "Pilot") {
      // handled above
    } else if (mapped === "duringPair" || mapped === "duringLink") {
      conditions.push({ type: mapped });
    } else if (mapped) {
      timings.push(mapped);
    } else {
      // Try composite: "During Pair·Red Pilot" / "When Paired·(White Base Team) Pilot"
      // Also handles level qualifiers like "During Pair·Lv.3 or Lower Pilot"
      const compositeM = label.match(/^([\w\s]+)·([\w\s().]+)\s+pilot$/i);
      if (compositeM) {
        const baseLabel = compositeM[1].trim().toLowerCase();
        const qualifierText = compositeM[2].trim();
        const baseMapped = TIMING_LABEL_MAP[baseLabel];
        if (baseMapped && baseMapped !== "OncePerTurn" && baseMapped !== "Pilot") {
          if (baseMapped === "duringPair" || baseMapped === "duringLink") {
            conditions.push({ type: baseMapped });
          } else {
            timings.push(baseMapped);
          }
          // Qualifier: "(Trait Name)" | color word | "Lv.X or Lower/Higher"
          const traitM = qualifierText.match(/^\(([^)]+)\)$/);
          if (traitM) {
            pilotQualifier = { hasTrait: traitM[1].toLowerCase() };
          } else {
            const lvQualM = qualifierText.match(/Lv\.?\s*(\d+)\s+or\s+(lower|higher)/i);
            if (lvQualM) {
              const lvNum = parseInt(lvQualM[1]);
              pilotQualifier =
                lvQualM[2].toLowerCase() === "lower" ? { maxLevel: lvNum } : { minLevel: lvNum };
            } else {
              const col = CARD_COLORS[qualifierText.toLowerCase()];
              if (col) pilotQualifier = { color: col };
            }
          }
        } else {
          break;
        }
      } else {
        // Unknown bracket — stop consuming header
        break;
      }
    }

    pos = bracketEnd + 1;

    // After the bracket check for cost symbols: ②, ①, etc., then ：
    const afterBracket = segment.slice(pos);
    const costMatch = afterBracket.match(/^([①②③④⑤⑥]*)：/);
    if (costMatch) {
      const circleDigits: Record<string, number> = {
        "①": 1,
        "②": 2,
        "③": 3,
        "④": 4,
        "⑤": 5,
        "⑥": 6,
      };
      let total = 0;
      for (const ch of costMatch[1]) total += circleDigits[ch] ?? 0;
      if (total > 0) {
        cost.payResources = total;
        hasCost = true;
      }
      pos += costMatch[0].length;
      break; // cost colon ends the header
    }

    // "Rest this Base：" or "Rest this Card："
    const restSelfMatch = segment.slice(pos).match(/^Rest this \w+[：:]/);
    if (restSelfMatch) {
      cost.restSelf = true;
      hasCost = true;
      pos += restSelfMatch[0].length;
      break;
    }
  }

  // Also handle "Main/Action" with a slash between two bracket groups already parsed
  // e.g. "【Main】/【Action】" — absorb the slash + second bracket
  const afterTimings = segment.slice(pos);
  const slashBracket = afterTimings.match(/^\/【(\w+)】/);
  if (slashBracket) {
    const extra = TIMING_LABEL_MAP[slashBracket[1].toLowerCase()];
    if (extra && extra !== "OncePerTurn" && extra !== "Pilot") {
      if (extra === "duringPair" || extra === "duringLink") {
        conditions.push({ type: extra });
      } else {
        timings.push(extra);
      }
    }
    pos += slashBracket[0].length;
  }

  return {
    timings,
    conditions,
    oncePerTurn,
    cost: hasCost ? cost : undefined,
    pilotName,
    pilotQualifier,
    rest: segment.slice(pos).trim(),
  };
}
