import type {
  CardEffect,
  EffectActivation,
  EffectCondition,
  EffectTiming,
  EffectType,
  KeywordEffectEntry,
  CardType,
} from "@tcg/gundam-types";
import { TIMING_LABEL_MAP, parseHeader } from "./header.ts";
import { parseSteps } from "./steps.ts";
import { parseCondition } from "./conditions.ts";
import { parseKeywordEffectName } from "./helpers.ts";
import { parseTargetFilter } from "./target-filter.ts";

// ─────────────────────────────────────────────────────────────────────────────
// Printed-keyword detection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * If a segment's entire content is a printed keyword declaration — that is,
 * `<Keyword>` or `<Keyword N>` optionally followed by a parenthesized reminder
 * text and nothing else — return the corresponding `KeywordEffectEntry`.
 *
 * Returns `null` for segments that merely *reference* or *grant* a keyword
 * (e.g. "this Unit gains <Blocker>", "While this Unit has <Repair>, ..."),
 * since those are not intrinsic to the card and must not be promoted into
 * `card.keywordEffects`.
 *
 * Used by both `parseConstantEffect` (to drop the segment so it doesn't
 * become a `grantKeyword` effect) and by the normalizer's
 * `parseKeywordEffects` (to populate `card.keywordEffects`). Keeping one
 * shared recognizer ensures the two stay in sync.
 */
export function extractPrintedKeyword(segment: string): KeywordEffectEntry | null {
  const m = segment.match(/^<([A-Za-z][\w\s-]*?)(?:\s+(\d+))?>\s*(\((?:[^()]|\([^()]*\))*\))?\s*$/);
  if (!m) return null;
  const kw = parseKeywordEffectName(m[1]);
  if (!kw) return null;
  return m[2] ? { keyword: kw, value: parseInt(m[2], 10) } : { keyword: kw };
}

// ─────────────────────────────────────────────────────────────────────────────
// Segment splitting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Split cleaned effect text into one segment per CardEffect.
 * A new segment starts on each 【Timing】 block (that is a timing keyword, not Once per Turn).
 * Standalone "While..." and "<Keyword>" lines are their own segments.
 */
export function splitIntoSegments(text: string): string[] {
  const segments: string[] = [];
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let current = "";
  for (const line of lines) {
    // Command alternate-Pilot metadata is normalized separately. When it
    // follows a real command effect, terminate that effect and omit the
    // metadata line from CardEffect parsing. Standalone Pilot text remains
    // parseable for the dedicated parser API case.
    if (/^【Pilot】/i.test(line) && current.trim()) {
      segments.push(current.trim());
      current = "";
      continue;
    }

    // Skip pure-explanation lines: "(rest this unit to...)"
    if (
      /^\([^)]*(?:rest this|when this unit|at the end of your turn|this unit can't be blocked)[^)]*\)$/i.test(
        line,
      )
    ) {
      // attach to current segment if it exists, otherwise skip
      if (current) current += " " + line;
      continue;
    }

    // Check if this line starts a new effect segment
    const startsNewSegment = lineStartsNewSegment(line, current);
    if (startsNewSegment && current.trim()) {
      segments.push(current.trim());
      current = line;
    } else {
      current = current ? current + " " + line : line;
    }
  }
  if (current.trim()) segments.push(current.trim());

  return segments;
}

function lineStartsNewSegment(line: string, currentSeg: string): boolean {
  if (!currentSeg) return false;

  if (extractPrintedKeyword(currentSeg) && /^(?:This|When|During|While|【)/i.test(line)) {
    return true;
  }

  // Starts with 【TimingKeyword】 (not a modifier)
  const bracketM = line.match(/^【([^】]+)】/);
  if (bracketM) {
    const label = bracketM[1].toLowerCase();
    const mapped = TIMING_LABEL_MAP[label];
    // Modifiers like OncePerTurn don't start a new segment
    if (mapped && mapped !== "OncePerTurn" && mapped !== "Pilot") return true;
    if (mapped === "OncePerTurn" && /】\s*When\b/i.test(line)) return true;
    // Activate:Main/Action always starts new
    if (label.startsWith("activate")) return true;
  }

  // Starts with "While ..." or "<Keyword>" at line start → new constant segment
  if (/^while\b/i.test(line)) return true;
  if (/^when\b/i.test(line)) return true;
  if (/^<[\w\s-]+?>/.test(line)) return true;

  // Starts with "During your opponent's turn, ..." → new constant segment
  if (/^[Dd]uring your turn\b/.test(line)) return true;
  if (/^[Dd]uring your opponent'?s? turn\b/.test(line)) return true;

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constant effect parsing
// ─────────────────────────────────────────────────────────────────────────────

function parseConstantEffect(segment: string, sourceText: string): CardEffect | null {
  // Printed card keyword segment (e.g. "<Repair 1>" or "<Blocker> (reminder)").
  // These belong in `card.keywordEffects`, not the `effects` array. Drop here
  // so they don't produce a spurious `grantKeyword` effect. The normalizer
  // uses the same recognizer via `extractPrintedKeyword` to populate
  // `card.keywordEffects`.
  if (extractPrintedKeyword(segment)) {
    return null;
  }

  // "While ..." constant
  if (/^while\b/i.test(segment)) {
    // Extract the condition (everything before the first comma or ", it gains/gets")
    const condBodyM = segment.match(/^[Ww]hile ([^,]+),\s*(.*)/s);
    if (condBodyM) {
      const condText = condBodyM[1];
      const effectBody = condBodyM[2]
        .trim()
        .replace(/\s+\([^)]*\)\s*$/, "")
        .replace(/\.$/, "");

      const cond = parseCondition(condText);
      const steps = parseSteps(effectBody);
      return {
        type: "constant",
        activation: cond ? { conditions: [cond] } : {},
        directives: steps,
        sourceText,
      };
    }
  }

  // "During your turn, while this Unit has <Breach>..." — special form
  const duringYourTurnM = segment.match(/^[Dd]uring your turn[,.]?\s*(.*)/s);
  if (duringYourTurnM) {
    let rest = duringYourTurnM[1].trim();
    const conditions: NonNullable<CardEffect["activation"]["conditions"]> = [
      { type: "isTurn", whose: "friendly" },
    ];
    if (/^when\b/i.test(rest)) {
      const triggered = parseFreeStandingWhenEffect(rest);
      if (triggered) {
        return {
          ...triggered,
          activation: {
            ...triggered.activation,
            conditions: [...conditions, ...(triggered.activation.conditions ?? [])],
          },
          sourceText,
        };
      }
    }
    const whileM = rest.match(/^while\s+([^,]+),\s*(.*)$/is);
    if (whileM) {
      const cond = parseCondition(whileM[1]);
      if (cond) conditions.push(cond);
      rest = whileM[2].trim();
    }
    const steps = parseSteps(rest);
    return {
      type: "constant",
      activation: {
        conditions,
      },
      directives: steps,
      sourceText,
    };
  }

  // "During your opponent's turn, ..."
  const duringOpponentTurnM = segment.match(/^[Dd]uring your opponent'?s? turn[,.]?\s*(.*)/s);
  if (duringOpponentTurnM) {
    const rest = duringOpponentTurnM[1];
    const steps = parseSteps(rest);
    return {
      type: "constant",
      activation: {
        conditions: [{ type: "isTurn", whose: "opponent" }],
      },
      directives: steps,
      sourceText,
    };
  }

  return null;
}

function extractLeadingTurnCondition(text: string): {
  body: string;
  condition?: EffectCondition;
} {
  const friendly = text.match(/^[Dd]uring your turn[,.]?\s*(.*)/s);
  if (friendly) {
    return {
      body: friendly[1].trim(),
      condition: { type: "isTurn", whose: "friendly" },
    };
  }

  const opponent = text.match(/^[Dd]uring your opponent'?s? turn[,.]?\s*(.*)/s);
  if (opponent) {
    return {
      body: opponent[1].trim(),
      condition: { type: "isTurn", whose: "opponent" },
    };
  }

  return { body: text };
}

function parseFreeStandingWhenEffect(segment: string): CardEffect | null {
  const whenM = segment.match(/^When\s+(.+?),\s*(.*)$/i);
  if (!whenM) return null;

  const triggerText = whenM[1].trim();
  const body = whenM[2].trim();
  const triggerLower = triggerText.toLowerCase();
  let timing: EffectTiming | undefined;

  if (/this Unit receives? (?:effect |battle )?damage from an enemy/i.test(triggerText)) {
    return {
      type: "constant",
      activation: {},
      directives: parseSteps(segment),
      sourceText: segment,
    };
  }

  if (/this Unit deals battle damage to an enemy Unit/i.test(triggerText)) {
    timing = "onBattleDamageDealtToUnit";
  } else if (
    /this Unit destroys? an enemy shield area card with battle damage/i.test(triggerText)
  ) {
    timing = "onShieldAreaCardDestroyByBattle";
  } else if (
    /(?:this|one of your) Units? destroys? an enemy Unit with battle damage/i.test(triggerText)
  ) {
    timing = "onDestroyByBattle";
  } else if (/this Unit is rested by an effect/i.test(triggerText)) {
    timing = "onRestedByEffect";
  } else if (/a friendly .*Unit links\b/i.test(triggerText)) {
    timing = "whenLinked";
  } else if (/this Unit is blocked by an enemy/i.test(triggerText)) {
    timing = "onBlocked";
  } else if (/you pay .*for .*Unit'?s? effects?/i.test(triggerText)) {
    timing = "onUnitEffectCostPaid";
  } else if (/you draw with an effect/i.test(triggerText)) {
    timing = "onDrawByEffect";
  }

  if (!timing) return null;

  const conditions: EffectCondition[] = [];
  if (/^this Unit\b/i.test(triggerText)) conditions.push({ type: "eventCardIsSelf" });
  if (timing === "onDrawByEffect" && /^you\b/i.test(triggerText)) {
    conditions.push({ type: "eventPlayerIsSelf" });
  }
  if (timing === "whenLinked" && /a friendly .*Unit links\b/i.test(triggerText)) {
    conditions.push({ type: "eventCardMatches", target: parseTargetFilter(triggerText) });
  }

  let directiveBody = body;
  if (timing === "onDrawByEffect") {
    const linkedColorM = directiveBody.match(
      /^if this is a (blue|green|red|white|purple) Unit,\s*(.*)$/is,
    );
    if (linkedColorM) {
      conditions.push({
        type: "linkedUnitHasColor",
        color: linkedColorM[1].toLowerCase() as "blue" | "green" | "red" | "white" | "purple",
      });
      directiveBody = linkedColorM[2].trim();
    }
  }
  let directives = parseSteps(directiveBody);
  if (timing === "whenLinked" && /a friendly .*Unit links\b/i.test(triggerText)) {
    const sourceFilter = parseTargetFilter(triggerText);
    directives = directives.map((directive) => {
      if (!("action" in directive) || directive.action.action !== "grantKeyword") return directive;
      return {
        ...directive,
        action: {
          action: "grantKeywordEventCard" as const,
          keyword: directive.action.keyword,
          ...(directive.action.keywordValue !== undefined
            ? { keywordValue: directive.action.keywordValue }
            : {}),
          duration: directive.action.duration,
          sourceFilter,
        },
      };
    });
  }

  return {
    type: "triggered",
    activation: {
      timing: [timing],
      ...(conditions.length > 0 ? { conditions } : {}),
      ...(triggerLower.includes("once per turn")
        ? { restrictions: [{ type: "oncePerTurn" as const }] }
        : {}),
    },
    directives,
    sourceText: segment,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main segment parser
// ─────────────────────────────────────────────────────────────────────────────

export function parseSegment(
  segment: string,
  _originalText: string,
  cardType?: CardType,
): CardEffect | null {
  const trimmed = segment.trim();

  // Ignore empty or dash
  if (!trimmed || trimmed === "-") return null;

  // Constant effects (While, standalone keyword, During your [opponent's] turn)
  if (
    /^while\b/i.test(trimmed) ||
    /^<[\w\s-]/.test(trimmed) ||
    /^[Dd]uring your turn\b/.test(trimmed) ||
    /^[Dd]uring your opponent'?s? turn\b/.test(trimmed)
  ) {
    return parseConstantEffect(trimmed, trimmed);
  }

  // Keyword-block effect
  if (trimmed.startsWith("【")) {
    const header = parseHeader(trimmed);

    // Printed activated-keyword reminder text is represented by
    // card.keywordEffects; it must not also become an unparsed ability.
    if (extractPrintedKeyword(header.rest)) return null;

    const leadingTurn = extractLeadingTurnCondition(header.rest);
    const activationConditions = [
      ...header.conditions,
      ...(leadingTurn.condition ? [leadingTurn.condition] : []),
    ];

    // Pilot keyword only
    if (header.pilotName && header.timings.length === 0 && header.conditions.length === 0) {
      return {
        type: "command",
        activation: { timing: ["main"] },
        directives: [],
        pilotKeyword: { pilotName: header.pilotName },
        sourceText: trimmed,
      };
    }

    if (header.timings.length === 0 && header.conditions.length === 0 && !header.oncePerTurn)
      return null;

    const isActivated = header.timings.some(
      (t) => t === "activate:main" || t === "activate:action",
    );
    const isCommand = !isActivated && header.timings.some((t) => t === "main" || t === "action");
    const isBurst = header.timings[0] === "burst";

    // Determine EffectType
    let effectType: EffectType = "triggered";
    if (isActivated) effectType = "activated";
    else if (isCommand) effectType = "command";
    else if (activationConditions.length > 0 && header.timings.length === 0)
      effectType = "constant";

    let effectBody = leadingTurn.body;
    if (effectType === "triggered") {
      const leadingIf = effectBody.match(/^if\s+(.+?),\s*(.*)$/is);
      if (leadingIf && !/^when\b/i.test(leadingIf[2])) {
        const condition = parseCondition(leadingIf[1]);
        if (cardType === "pilot" && condition?.type === "selfHasTrait") {
          activationConditions.push({ type: "duringPair" }, condition);
          effectBody = leadingIf[2].trim();
        } else if (cardType === "pilot" && condition?.type === "and") {
          const selfTrait = condition.conditions.find((entry) => entry.type === "selfHasTrait");
          const turnGate = condition.conditions.find((entry) => entry.type === "isTurn");
          if (selfTrait && turnGate?.type === "isTurn") {
            activationConditions.push({ type: "duringPair" }, selfTrait);
            effectBody = `If it is ${turnGate.whose === "friendly" ? "your" : "your opponent's"} turn, ${leadingIf[2].trim()}`;
          }
        } else if (
          condition?.type === "isAttackingUnit" &&
          header.timings.includes("attack") &&
          /^choose\b/i.test(leadingIf[2])
        ) {
          activationConditions.push(condition);
          effectBody = leadingIf[2].trim();
        } else if (
          condition?.type === "deployedFromZone" &&
          header.timings.includes("deploy") &&
          /^choose\b/i.test(leadingIf[2])
        ) {
          activationConditions.push(condition);
          effectBody = leadingIf[2].trim();
        } else if (
          condition?.type === "selfStat" &&
          header.timings.includes("attack") &&
          /^choose\b/i.test(leadingIf[2])
        ) {
          activationConditions.push(condition);
          effectBody = leadingIf[2].trim();
        } else if (
          condition?.type === "unitCount" &&
          /^(?:choose\b|this gains?\b)/i.test(leadingIf[2])
        ) {
          activationConditions.push(condition);
          effectBody = leadingIf[2].trim();
        } else if (
          condition?.type === "cardInZone" &&
          header.timings.includes("whenLinked") &&
          /^deal\b/i.test(leadingIf[2])
        ) {
          activationConditions.push(condition);
          effectBody = leadingIf[2].trim();
        }
      }
    }

    function buildActivation() {
      const activation: EffectActivation = {
        ...(header.timings.length > 0 ? { timing: header.timings } : {}),
        ...(activationConditions.length > 0 ? { conditions: activationConditions } : {}),
        ...(header.oncePerTurn ? { restrictions: [{ type: "oncePerTurn" as const }] } : {}),
        ...(header.pilotQualifier
          ? {
              qualification: header.pilotQualifier.hasTrait
                ? {
                    attribute: "trait" as const,
                    comparison: "includes" as const,
                    value: header.pilotQualifier.hasTrait,
                  }
                : header.pilotQualifier.color
                  ? {
                      attribute: "color" as const,
                      comparison: "eq" as const,
                      value: header.pilotQualifier.color,
                    }
                  : header.pilotQualifier.maxLevel !== undefined
                    ? {
                        attribute: "level" as const,
                        comparison: "lte" as const,
                        value: header.pilotQualifier.maxLevel,
                      }
                    : header.pilotQualifier.minLevel !== undefined
                      ? {
                          attribute: "level" as const,
                          comparison: "gte" as const,
                          value: header.pilotQualifier.minLevel,
                        }
                      : undefined,
            }
          : {}),
      };
      return activation;
    }

    // A condition-only header can qualify an embedded trigger, for example:
    // “【During Pair】During your turn, when this Unit destroys ...”. Preserve
    // the header and leading-turn gates while letting the when-clause own the
    // event timing and body.
    if (header.timings.length === 0 && /^when\b/i.test(effectBody)) {
      const triggered = parseFreeStandingWhenEffect(effectBody);
      if (triggered) {
        const headerActivation = buildActivation();
        return {
          ...triggered,
          activation: {
            ...triggered.activation,
            conditions: [...activationConditions, ...(triggered.activation.conditions ?? [])],
            ...(header.oncePerTurn
              ? {
                  restrictions: [
                    ...(triggered.activation.restrictions ?? []),
                    { type: "oncePerTurn" as const },
                  ],
                }
              : {}),
            ...(headerActivation.qualification
              ? { qualification: headerActivation.qualification }
              : {}),
          },
          ...(header.cost ? { cost: header.cost } : {}),
          sourceText: trimmed,
        };
      }
    }

    // "Burst: Activate this card's 【Main】." → short-circuit
    if (isBurst && /activate this card'?s?\s*【main】/i.test(header.rest)) {
      return {
        type: "triggered",
        activation: buildActivation(),
        ...(header.cost ? { cost: header.cost } : {}),
        directives: [{ action: { action: "activateTiming", timing: "main" } }],
        sourceText: trimmed,
      };
    }

    const steps = parseSteps(effectBody);

    // "Once per Turn" triggered (no timing keyword, just OPT + trigger description)
    if (header.timings.length === 0 && header.oncePerTurn) {
      const triggered = /^when\b/i.test(effectBody)
        ? parseFreeStandingWhenEffect(effectBody)
        : null;
      if (triggered) {
        const headerActivation = buildActivation();
        return {
          ...triggered,
          activation: {
            ...triggered.activation,
            conditions: [...activationConditions, ...(triggered.activation.conditions ?? [])],
            restrictions: [
              ...(triggered.activation.restrictions ?? []),
              { type: "oncePerTurn" as const },
            ],
            ...(headerActivation.qualification
              ? { qualification: headerActivation.qualification }
              : {}),
          },
          ...(header.cost ? { cost: header.cost } : {}),
          sourceText: trimmed,
        };
      }
      return {
        type: "triggered",
        activation: {
          restrictions: [{ type: "oncePerTurn" as const }],
        },
        ...(header.cost ? { cost: header.cost } : {}),
        directives: steps,
        sourceText: trimmed,
      };
    }

    return {
      type: effectType,
      activation: buildActivation(),
      ...(header.cost ? { cost: header.cost } : {}),
      directives: steps,
      ...(header.pilotName ? { pilotKeyword: { pilotName: header.pilotName } } : {}),
      sourceText: trimmed,
    };
  }

  // Free-standing "Once per Turn" trigger with no bracket (e.g. in pilot effects)
  if (/^\[?Once per Turn\]?/i.test(trimmed)) {
    const body = trimmed.replace(/^\[?Once per Turn\]?\s*/i, "");
    const triggered = /^when\b/i.test(body) ? parseFreeStandingWhenEffect(body) : null;
    if (triggered) {
      return {
        ...triggered,
        activation: {
          ...triggered.activation,
          restrictions: [
            ...(triggered.activation.restrictions ?? []),
            { type: "oncePerTurn" as const },
          ],
        },
        sourceText: trimmed,
      };
    }
    const steps = parseSteps(body);
    return {
      type: "triggered",
      activation: {
        restrictions: [{ type: "oncePerTurn" as const }],
      },
      directives: steps,
      sourceText: trimmed,
    };
  }

  if (/^When\b/i.test(trimmed)) {
    return parseFreeStandingWhenEffect(trimmed);
  }

  // Free-standing constant: "This Unit may .../can't ..." without a timing bracket
  if (/^This (?:Unit|card)\b/i.test(trimmed)) {
    const steps = parseSteps(trimmed);
    if (steps.length > 0) {
      return {
        type: "constant",
        activation: {},
        directives: steps,
        sourceText: trimmed,
      };
    }
  }

  return {
    type: "constant",
    activation: {},
    directives: [{ action: { action: "unparsedText", text: trimmed } }],
    sourceText: trimmed,
  };
}
