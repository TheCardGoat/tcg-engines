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
  const m = segment.match(
    /^(?:<([A-Za-z][\w\s-]*?)(?:\s+(\d+))?>|\[([A-Za-z][\w\s-]*?)(?:\s+(\d+))?\])\s*(\((?:[^()]|\([^()]*\))*\))?\s*$/,
  );
  if (!m) return null;
  const kw = parseKeywordEffectName(m[1] ?? m[3]);
  if (!kw) return null;
  const value = m[2] ?? m[4];
  return value ? { keyword: kw, value: parseInt(value, 10) } : { keyword: kw };
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

  // Keyword reminder text can itself contain parentheses, which makes it
  // unsuitable for the strict `extractPrintedKeyword` matcher. A following
  // timing sentence is nevertheless a distinct effect.
  if (/^<[^>]+>/.test(currentSeg) && /^(?:This|When|At the end|During|While|【)/i.test(line)) {
    return true;
  }

  // A newline after a completed Burst can introduce an untimed, continuous
  // self-stat effect. It is not part of revealing the Shield; preserve its
  // separate effect identity so the bonus remains active while the Pilot is
  // paired.
  if (
    /^【Burst】.+[.!?]$/.test(currentSeg) &&
    /^(?:Increase this Unit['’]s (?:AP|HP) by an amount equal to|This Unit and all your Units with|If there are \d+ or more other rested Units in play,)/i.test(
      line,
    )
  ) {
    return true;
  }

  // Starts with 【TimingKeyword】 (not a modifier)
  const bracketM = line.match(/^【([^】]+)】/);
  if (bracketM) {
    const label = bracketM[1].toLowerCase();
    const mapped = TIMING_LABEL_MAP[label];
    // Modifiers like OncePerTurn don't start a new segment
    if (mapped && mapped !== "OncePerTurn" && mapped !== "Pilot") return true;
    if (
      mapped === "OncePerTurn" &&
      /】\s*(?:When|During your(?: opponent'?s?)? turn, when)\b/i.test(line)
    )
      return true;
    if (/^(?:when paired|during pair|when linked|during link)\s*[·・･]/i.test(label)) return true;
    // Activate:Main/Action always starts new
    if (label.startsWith("activate")) return true;
  }

  // Starts with "While ..." or "<Keyword>" at line start → new constant segment
  if (/^while\b/i.test(line)) return true;
  if (/^when\b/i.test(line)) return true;
  if (/^all friendly\b.*during your opponent'?s turn\.?$/i.test(line)) return true;
  if (/^all your\b.*Unit tokens? get (?:AP|HP)[+-]\d+\.?$/i.test(line)) return true;
  if (/^At the end of your turn\b/i.test(line)) return true;
  if (/^<[\w\s-]+?>/.test(line)) return true;
  if (/^This Unit gains the same number of <Repair \d+>/i.test(line)) return true;
  if (/^This Base can(?:'|’)?t receive enemy effect damage\.?$/i.test(line)) return true;

  // Starts with "During your opponent's turn, ..." → new constant segment
  if (/^[Dd]uring your turn\b/.test(line)) return true;
  if (/^[Dd]uring your opponent'?s? turn\b/.test(line)) return true;

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constant effect parsing
// ─────────────────────────────────────────────────────────────────────────────

function parseConstantEffect(
  segment: string,
  sourceText: string,
  cardType?: CardType,
): CardEffect | null {
  // Printed card keyword segment (e.g. "<Repair 1>" or "<Blocker> (reminder)").
  // These belong in `card.keywordEffects`, not the `effects` array. Drop here
  // so they don't produce a spurious `grantKeyword` effect. The normalizer
  // uses the same recognizer via `extractPrintedKeyword` to populate
  // `card.keywordEffects`.
  if (extractPrintedKeyword(segment)) {
    return null;
  }

  const cantAttackWithTrashCountM = segment.match(
    /^This Unit can(?:'|’)t attack while there are (\d+) or (less|more) cards in your trash\.?$/i,
  );
  if (cantAttackWithTrashCountM) {
    return {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: cantAttackWithTrashCountM[2].toLowerCase() === "less" ? "lte" : "gte",
            count: Number.parseInt(cantAttackWithTrashCountM[1], 10),
          },
        ],
      },
      directives: [
        {
          action: {
            action: "cantAttack",
            duration: "permanent",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
      sourceText,
    };
  }

  if (
    /^If there are 2 or more enemy players and this Unit is rested, friendly Shields can't receive battle damage from enemy Units\.?$/i.test(
      segment,
    )
  ) {
    return {
      type: "constant",
      activation: {
        conditions: [
          { type: "enemyPlayerCount", comparison: "gte", count: 2 },
          { type: "selfIsRested" },
        ],
      },
      directives: [
        {
          action: {
            action: "preventDamageToZone",
            protectedArea: { kind: "zone", zone: "shieldArea" },
            unitFilter: { owner: "opponent", cardType: "unit" },
            duration: "permanent",
          },
        },
      ],
      sourceText,
    };
  }

  if (
    /^If there are 2 or more enemy players, this Unit gains <Blocker>\.?(?:\s+\(Rest this Unit to change the attack target to it\.\))?$/i.test(
      segment,
    )
  ) {
    return {
      type: "constant",
      activation: { conditions: [{ type: "enemyPlayerCount", comparison: "gte", count: 2 }] },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Blocker",
            duration: "permanent",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
      sourceText,
    };
  }

  const opponentDiscardCostM = segment.match(
    /^During a turn where your opponent has discarded due to one of your effects, this card in your hand gets cost -(\d+)\.?$/i,
  );
  if (opponentDiscardCostM) {
    return {
      type: "constant",
      activation: { conditions: [{ type: "opponentDiscardedByYourEffectThisTurn" }] },
      directives: [
        {
          action: {
            action: "costReduction",
            amount: Number.parseInt(opponentDiscardCostM[1], 10),
            target: { owner: "self", zone: "hand" },
          },
        },
      ],
      sourceText,
    };
  }

  const opponentTurnStatM = segment.match(
    /^All friendly \(([^)]+)\) Units? that are Lv\.?\s*(\d+) get AP\+(\d+) during your opponent'?s turn\.?$/i,
  );
  if (opponentTurnStatM) {
    return {
      type: "constant",
      activation: { conditions: [{ type: "isTurn", whose: "opponent" }] },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: Number.parseInt(opponentTurnStatM[3], 10),
            duration: "permanent",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: "all",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: opponentTurnStatM[1].toLowerCase(),
                },
                {
                  attribute: "level",
                  comparison: "eq",
                  value: Number.parseInt(opponentTurnStatM[2], 10),
                },
              ],
            },
          },
        },
      ],
      sourceText,
    };
  }

  const opponentTurnTokenStatM = segment.match(
    /^All friendly Unit tokens get (AP|HP)\+(-?\d+) during your opponent'?s turn\.?$/i,
  );
  if (opponentTurnTokenStatM) {
    return {
      type: "constant",
      activation: { conditions: [{ type: "isTurn", whose: "opponent" }] },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: opponentTurnTokenStatM[1].toLowerCase() as "ap" | "hp",
            amount: Number.parseInt(opponentTurnTokenStatM[2], 10),
            duration: "permanent",
            target: { owner: "friendly", cardType: "unit", count: "all", isToken: true },
          },
        },
      ],
      sourceText,
    };
  }

  const allYourTokenStatM = segment.match(
    /^All your \(([^)]+)\) Unit tokens get (AP|HP)([+-]\d+)\.?$/i,
  );
  if (allYourTokenStatM) {
    return {
      type: "constant",
      activation: cardType === "pilot" ? { conditions: [{ type: "duringPair" }] } : {},
      directives: [
        {
          action: {
            action: "statModifier",
            stat: allYourTokenStatM[2].toLowerCase() as "ap" | "hp",
            amount: Number.parseInt(allYourTokenStatM[3], 10),
            duration: "permanent",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: "all",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: allYourTokenStatM[1].toLowerCase(),
                },
              ],
              isToken: true,
            },
          },
        },
      ],
      sourceText,
    };
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
      const battlingTarget = parseTargetFilter(condText);
      const directives = battlingTarget.isBattling
        ? steps.map((directive) => {
            if (
              !("action" in directive) ||
              directive.action.action !== "grantKeyword" ||
              directive.action.target.owner !== "self"
            )
              return directive;
            return {
              ...directive,
              action: {
                ...directive.action,
                target: { ...directive.action.target, isBattling: battlingTarget.isBattling },
              },
            };
          })
        : steps;
      return {
        type: "constant",
        activation: cond ? { conditions: [cond] } : {},
        directives,
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
      if (
        /^this Unit is battling an enemy Unit with <Blocker>$/i.test(whileM[1]!) &&
        /^this Unit can'?t receive battle damage\.?$/i.test(whileM[2]!)
      ) {
        return {
          type: "constant",
          activation: { conditions },
          directives: [
            {
              action: {
                action: "preventDamage",
                target: { owner: "self", cardType: "unit" },
                unitFilter: {
                  owner: "opponent",
                  cardType: "unit",
                  hasKeyword: "Blocker",
                  isBattling: true,
                },
                damageType: "battle",
                duration: "permanent",
              },
            },
          ],
          sourceText,
        };
      }
      const cond = parseCondition(whileM[1]);
      if (cond) conditions.push(cond);
      const battlingTarget = parseTargetFilter(whileM[1]);
      rest = whileM[2].trim();

      const steps = parseSteps(rest);
      const directives = battlingTarget.isBattling
        ? steps.map((directive) => {
            if (
              !("action" in directive) ||
              directive.action.action !== "grantKeyword" ||
              directive.action.target.owner !== "self"
            )
              return directive;
            return {
              ...directive,
              action: {
                ...directive.action,
                target: { ...directive.action.target, isBattling: battlingTarget.isBattling },
              },
            };
          })
        : steps;
      return {
        type: "constant",
        activation: { conditions },
        directives,
        sourceText,
      };
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
  const endTurnTrashTraitReadyResourceM = segment.match(
    /^At the end of your turn, if there are (\d+) or more \(([^)]+)\) cards in your trash, choose (\d+) of your Resources?\. Set (?:it|them) as active\.?$/i,
  );
  if (endTurnTrashTraitReadyResourceM) {
    const [, minimumCount, trait, resourceCount] = endTurnTrashTraitReadyResourceM;
    return {
      type: "triggered",
      activation: {
        timing: ["endOfTurn"],
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "trash",
            comparison: "gte",
            count: Number.parseInt(minimumCount!, 10),
            hasTrait: trait!.toLowerCase(),
          },
        ],
      },
      directives: [
        {
          action: {
            action: "setActive",
            target: {
              owner: "friendly",
              zone: "resourceArea",
              count: Number.parseInt(resourceCount!, 10),
            },
          },
        },
      ],
      sourceText: segment,
    };
  }

  const baseRestInsteadM = segment.match(
    /^when you would rest a Unit with a friendly \(([^)]+)\) Unit['’]s effect, you may rest this Base instead\.?$/i,
  );
  if (baseRestInsteadM) {
    return {
      type: "substitution",
      activation: {},
      directives: [
        {
          action: {
            action: "substituteUnitRestWithSelf",
            sourceUnitTrait: baseRestInsteadM[1].toLowerCase(),
          },
        },
      ],
      sourceText: segment,
    };
  }

  // Damage reduction phrased as "When this Unit receives ..." is a
  // prevention effect, not a post-damage trigger. Represent it as a constant
  // so the combat prevention pass can reduce the damage before it is marked.
  const conditionalEnemyDamageReductionM = segment.match(
    /^When this Unit receives enemy damage, if you have an \(([^)]+)\) Pilot in play, reduce it by (\d+)\.?$/i,
  );
  if (conditionalEnemyDamageReductionM) {
    return {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "friendly",
            zone: "battleArea",
            cardType: "pilot",
            hasTrait: conditionalEnemyDamageReductionM[1].toLowerCase(),
            comparison: "gte",
            count: 1,
          },
        ],
      },
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: Number.parseInt(conditionalEnemyDamageReductionM[2], 10),
            target: { owner: "self", cardType: "unit" },
            source: "enemy",
            duration: "permanent",
          },
        },
      ],
      sourceText: segment,
    };
  }

  const selfBattleDamageReductionM = segment.match(
    /^When this Unit receives enemy battle damage, reduce it by (\d+)\.?$/i,
  );
  if (selfBattleDamageReductionM) {
    return {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: Number.parseInt(selfBattleDamageReductionM[1], 10),
            target: { owner: "self", cardType: "unit" },
            damageType: "battle",
            source: "enemy",
            duration: "thisTurn",
          },
        },
      ],
      sourceText: segment,
    };
  }

  // Replacement effect: a Unit can stand in for resting its controller's
  // Base. This is a declarative marker consumed by the rest handler.
  if (
    /^When you rest your Base with one of your Units['’] effects, you may rest this Unit instead\.?$/i.test(
      segment,
    )
  ) {
    return {
      type: "substitution",
      activation: {},
      directives: [{ action: { action: "substituteBaseRestWithSelf" } }],
      sourceText: segment,
    };
  }

  const conditionalPlayOverrideM = segment.match(
    /^When playing this card from your hand, if (\d+) or more enemy Units are in play, play it as if it has (\d+) Lv\. and cost\.?$/i,
  );
  if (conditionalPlayOverrideM) {
    return {
      type: "substitution",
      activation: {},
      directives: [
        {
          action: {
            action: "deployCostOverride",
            level: Number.parseInt(conditionalPlayOverrideM[2], 10),
            cost: Number.parseInt(conditionalPlayOverrideM[2], 10),
            condition: {
              type: "unitCount",
              owner: "opponent",
              comparison: "gte",
              count: Number.parseInt(conditionalPlayOverrideM[1], 10),
            },
          },
        },
      ],
      sourceText: segment,
    };
  }

  const namedHostPairingCostOverrideM = segment.match(
    /^When playing this card from your hand and pairing it with a Unit with "([^"]+)" in its card name, play this card as if it has (\d+) cost\.?$/i,
  );
  if (namedHostPairingCostOverrideM) {
    return {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "pairingCostOverride",
            cost: Number.parseInt(namedHostPairingCostOverrideM[2], 10),
            unit: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "name",
                  comparison: "includes",
                  value: namedHostPairingCostOverrideM[1],
                },
              ],
            },
          },
        },
      ],
      sourceText: segment,
    };
  }

  const endTurnRestAllM = segment.match(
    /^At the end of your turn, if this Unit is rested, rest all Units\. If this effect rested (\d+) or more Units, draw (\d+)\.?$/i,
  );
  if (endTurnRestAllM) {
    return {
      type: "triggered",
      activation: { timing: ["endOfTurn"], conditions: [{ type: "selfIsRested" }] },
      directives: [
        { action: { action: "rest", target: { owner: "any", cardType: "unit", count: "all" } } },
        {
          action: {
            action: "drawIfTargetMatches",
            count: Number.parseInt(endTurnRestAllM[2], 10),
            target: {
              owner: "any",
              cardType: "unit",
              count: Number.parseInt(endTurnRestAllM[1], 10),
            },
          },
        },
      ],
      sourceText: segment,
    };
  }

  const endTurnDamageReadyM = segment.match(
    /^At the end of your turn, you may choose 1 of your \(([^)]+)\) Units\. Deal (\d+) damage to it\. Set it as active\.?$/i,
  );
  if (endTurnDamageReadyM) {
    const target = {
      owner: "friendly" as const,
      cardType: "unit" as const,
      count: 1,
      attributeFilters: [
        {
          attribute: "trait" as const,
          comparison: "includes" as const,
          value: endTurnDamageReadyM[1].toLowerCase(),
        },
      ],
    };
    return {
      type: "triggered",
      activation: { timing: ["endOfTurn"] },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: Number.parseInt(endTurnDamageReadyM[2], 10),
            target,
          },
          optional: true,
        },
        {
          action: { action: "setActive", target },
          dependsOnPrevious: true,
          sharesTargetChoiceWithPrevious: true,
        },
      ],
      sourceText: segment,
    };
  }

  const endTurnDestroyM = segment.match(
    /^At the end of your turn, you may destroy this Unit\.?\s*(?:If you do,?\s*(.*))?$/i,
  );
  if (endTurnDestroyM) {
    const followUp = endTurnDestroyM[1] ? parseSteps(endTurnDestroyM[1]) : [];
    return {
      type: "triggered",
      activation: { timing: ["endOfTurn"] },
      directives: [
        {
          action: { action: "destroy", target: { owner: "self", cardType: "unit" } },
          optional: true,
        },
        ...followUp.map((directive) =>
          "action" in directive ? { ...directive, dependsOnPrevious: true } : directive,
        ),
      ],
      sourceText: segment,
    };
  }

  if (
    /^At the end of the turn when this Unit is paired with a Pilot, set it as active\.?$/i.test(
      segment,
    )
  ) {
    return {
      type: "triggered",
      activation: { timing: ["endOfTurn"] },
      directives: [
        { action: { action: "setActive", target: { owner: "self", cardType: "unit" } } },
      ],
      sourceText: segment,
    };
  }

  const playSubstitutionM = segment.match(
    /^When playing this card from your hand, you may discard (\d+) \(([^)]+)\) (Unit|Pilot|Command|Base) cards?\. If you do, play this card as if it has (\d+) Lv\. and cost\.?$/i,
  );
  if (playSubstitutionM) {
    const count = Number.parseInt(playSubstitutionM[1], 10);
    return {
      type: "substitution",
      activation: {},
      directives: [
        {
          action: {
            action: "playCostSubstitution",
            level: Number.parseInt(playSubstitutionM[4], 10),
            cost: Number.parseInt(playSubstitutionM[4], 10),
            discardTarget: {
              owner: "friendly",
              zone: "hand",
              cardType: playSubstitutionM[3].toLowerCase() as "unit" | "pilot" | "command" | "base",
              count,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: playSubstitutionM[2].toLowerCase(),
                },
              ],
            },
          },
        },
      ],
      sourceText: segment,
    };
  }

  const destroyLinkPlaySubstitutionM = segment.match(
    /^When playing this card from your hand, you may destroy (\d+) of your Link Units with "([^"]+)" in its card name that is Lv\.?\s*(\d+)\. If you do, play this card as if it has (\d+) Lv\. and cost\.?$/i,
  );
  if (destroyLinkPlaySubstitutionM) {
    return {
      type: "substitution",
      activation: {},
      directives: [
        {
          action: {
            action: "deployCostSubstitution",
            level: Number.parseInt(destroyLinkPlaySubstitutionM[4], 10),
            cost: Number.parseInt(destroyLinkPlaySubstitutionM[4], 10),
            destroyTarget: {
              owner: "friendly",
              zone: "battleArea",
              cardType: "unit",
              count: Number.parseInt(destroyLinkPlaySubstitutionM[1], 10),
              isLinkUnit: true,
              attributeFilters: [
                {
                  attribute: "name",
                  comparison: "includes",
                  value: destroyLinkPlaySubstitutionM[2],
                },
                {
                  attribute: "level",
                  comparison: "eq",
                  value: Number.parseInt(destroyLinkPlaySubstitutionM[3], 10),
                },
              ],
            },
          },
          optional: true,
        },
      ],
      sourceText: segment,
    };
  }

  const whenM = segment.match(/^When\s+(.+?),\s*(.*)$/i);
  if (!whenM) return null;

  const triggerText = whenM[1].trim();
  const body = whenM[2].trim();
  const triggerLower = triggerText.toLowerCase();
  let timing: EffectTiming | undefined;
  const conditions: EffectCondition[] = [];
  let qualification: CardEffect["activation"]["qualification"] | undefined;
  const selfOrFriendlyTraitDeployM = triggerText.match(
    /^this Unit or one of your \(([^)]+)\) Units? is deployed$/i,
  );

  // Official cards use ordinary "When …" sentences for several engine
  // events, rather than a bracketed timing label. Keep the event card filter
  // on the activation so observer effects do not fire for unrelated events.
  if (/you place an EX Resource/i.test(triggerText)) {
    timing = "onExResourcePlaced";
    conditions.push({ type: "eventPlayerIsSelf" });
  } else if (/one of your EX Resources is exiled from the game/i.test(triggerText)) {
    timing = "onExResourceExiled";
    conditions.push({ type: "eventPlayerIsSelf" });
  } else if (
    /you use this Unit['’]s <Support> to increase a \([^)]+\) Unit['’]s AP/i.test(triggerText)
  ) {
    const supportTargetTrait = triggerText.match(/to increase a \(([^)]+)\) Unit['’]s AP/i)![1]!;
    timing = "onSupportUsed";
    conditions.push({
      type: "eventCardMatches",
      target: {
        owner: "friendly",
        cardType: "unit",
        attributeFilters: [
          { attribute: "trait", comparison: "includes", value: supportTargetTrait.toLowerCase() },
        ],
      },
    });
  } else if (
    /you play and activate an? \([^)]+\) Command card using an EX Resource/i.test(triggerText)
  ) {
    const playedExCommandM = triggerText.match(
      /you play and activate an? \(([^)]+)\) Command card using an EX Resource/i,
    )!;
    timing = "onCommandEffectActivated";
    conditions.push(
      { type: "eventPlayerIsSelf" },
      { type: "eventPaidExResources", comparison: "gte", count: 1 },
      {
        type: "eventCardMatches",
        target: {
          owner: "friendly",
          cardType: "command",
          attributeFilters: [
            {
              attribute: "trait",
              comparison: "includes",
              value: playedExCommandM[1].toLowerCase(),
            },
          ],
        },
      },
    );
  } else if (
    /you activate (?:an? )?\([^)]+\) Command['’]s? 【Main】\/【Action】(?: effect)?/i.test(
      triggerText,
    )
  ) {
    const trait = triggerText.match(
      /you activate (?:an? )?\(([^)]+)\) Command['’]s? 【Main】\/【Action】/i,
    )?.[1];
    timing = "onCommandEffectActivated";
    conditions.push(
      { type: "eventPlayerIsSelf" },
      {
        type: "eventCardMatches",
        target: {
          owner: "friendly",
          cardType: "command",
          attributeFilters: [
            { attribute: "trait", comparison: "includes", value: trait!.toLowerCase() },
          ],
        },
      },
    );
  } else if (/you activate a Command['’]s? 【Main】\/【Action】 effect/i.test(triggerText)) {
    timing = "onCommandEffectActivated";
    conditions.push({ type: "eventPlayerIsSelf" });
  } else if (/another Unit attacks an enemy Unit/i.test(triggerText)) {
    timing = "attack";
    conditions.push(
      {
        type: "eventSourceMatches",
        target: { owner: "friendly", cardType: "unit", excludeSource: true },
      },
      { type: "eventAttackTargetsUnit" },
    );
  } else if (/one of your other Units? with <[^>]+> attacks/i.test(triggerText)) {
    timing = "attack";
    const eventSource = parseTargetFilter(triggerText);
    eventSource.owner = "friendly";
    eventSource.cardType = "unit";
    conditions.push(
      { type: "eventPlayerIsSelf" },
      { type: "eventSourceMatches", target: eventSource },
    );
  } else if (selfOrFriendlyTraitDeployM) {
    timing = "deploy";
    conditions.push(
      { type: "eventPlayerIsSelf" },
      {
        type: "eventCardMatches",
        target: {
          owner: "friendly",
          cardType: "unit",
          attributeFilters: [
            {
              attribute: "trait",
              comparison: "includes",
              value: selfOrFriendlyTraitDeployM[1].toLowerCase(),
            },
          ],
        },
      },
    );
  } else if (
    /(?:another |one of your )?(?:friendly )?.*\bUnits?\b.*\bis deployed\b/i.test(triggerText)
  ) {
    timing = "deploy";
  } else {
    const pairedPilotLevelM = triggerText.match(
      /you pair a Pilot that is Lv\.(\d+) or lower with one of your Units/i,
    );
    if (pairedPilotLevelM) {
      timing = "whenPaired";
      qualification = {
        attribute: "level",
        comparison: "lte",
        value: Number.parseInt(pairedPilotLevelM[1], 10),
      };
      conditions.push({ type: "eventPlayerIsSelf" });
    } else {
      const pairedPilotTraitColorM = triggerText.match(
        /you pair a \(([^)]+)\) Pilot with one of your (blue|green|red|white|purple) Units/i,
      );
      if (pairedPilotTraitColorM) {
        timing = "whenPaired";
        qualification = {
          attribute: "trait",
          comparison: "includes",
          value: pairedPilotTraitColorM[1].toLowerCase(),
        };
        conditions.push(
          { type: "eventPlayerIsSelf" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [
                {
                  attribute: "color",
                  comparison: "eq",
                  value: pairedPilotTraitColorM[2].toLowerCase(),
                },
              ],
            },
          },
        );
      } else if (/you pair a Pilot with this Unit or one of your white Units/i.test(triggerText)) {
        timing = "whenPaired";
        conditions.push(
          { type: "eventPlayerIsSelf" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              attributeFilters: [{ attribute: "color", comparison: "eq", value: "white" }],
            },
          },
        );
      }
    }
  }

  if (/this Unit receives? (?:effect |battle )?damage from an enemy/i.test(triggerText)) {
    return {
      type: "constant",
      activation: {},
      directives: parseSteps(segment),
      sourceText: segment,
    };
  }

  if (
    timing === "deploy" &&
    !selfOrFriendlyTraitDeployM &&
    /Units?\b.*\bis deployed\b/i.test(triggerText)
  ) {
    conditions.push({ type: "eventCardMatches", target: parseTargetFilter(triggerText) });
  } else if (/this Unit deals battle damage to an enemy Unit/i.test(triggerText)) {
    timing = "onBattleDamageDealtToUnit";
    conditions.push(
      { type: "eventSourceIsSelf" },
      {
        type: "eventCardMatches",
        target: parseTargetFilter(triggerText),
      },
    );
  } else if (
    /this Unit destroys? an enemy shield area card with (?:battle )?damage/i.test(triggerText)
  ) {
    timing = "onShieldAreaCardDestroyByBattle";
  } else if (
    /this Unit destroys? an enemy Unit paired with a \([^)]+\) Pilot with battle damage/i.test(
      triggerText,
    )
  ) {
    const defeatedPilotTraitM = triggerText.match(
      /this Unit destroys? an enemy Unit paired with a \(([^)]+)\) Pilot with battle damage/i,
    )!;
    timing = "onDestroyByBattle";
    conditions.push(
      { type: "eventCardIsSelf" },
      {
        type: "eventDefeatedCardMatches",
        target: {
          owner: "opponent",
          cardType: "unit",
          attributeFilters: [
            {
              attribute: "pairedPilotTrait",
              comparison: "includes",
              value: defeatedPilotTraitM[1].toLowerCase(),
            },
          ],
        },
      },
    );
  } else if (
    /damage from one of your Units paired with a \([^)]+\) Pilot destroys an enemy shield area card/i.test(
      triggerText,
    )
  ) {
    const pairedPilotShieldDestroyM = triggerText.match(
      /damage from one of your Units paired with a \(([^)]+)\) Pilot destroys an enemy shield area card/i,
    )!;
    timing = "onShieldAreaCardDestroyByBattle";
    conditions.push({
      type: "eventCardMatches",
      target: {
        owner: "friendly",
        cardType: "unit",
        attributeFilters: [
          {
            attribute: "pairedPilotTrait",
            comparison: "includes",
            value: pairedPilotShieldDestroyM[1].toLowerCase(),
          },
        ],
      },
    });
  } else if (
    /one of your .*Units? destroys? an enemy shield area card with (?:battle )?damage/i.test(
      triggerText,
    )
  ) {
    timing = "onShieldAreaCardDestroyByBattle";
    const eventCardTarget = parseTargetFilter(triggerText);
    eventCardTarget.owner = "friendly";
    eventCardTarget.cardType = "unit";
    conditions.push({ type: "eventCardMatches", target: eventCardTarget });
  } else if (/this Unit destroys? an enemy card with battle damage/i.test(triggerText)) {
    // "enemy card" covers both a defending Unit and the Base/Shield card
    // destroyed by a direct attack. The engine publishes distinct events
    // for those two battle outcomes, so retain both accepted timings.
    timing = "onDestroyByBattle";
  } else if (
    /(?:this|one of your|a friendly .*?) Units?(?: that is Lv\.\d+ or (?:lower|higher))? destroys? an enemy Unit with battle damage/i.test(
      triggerText,
    )
  ) {
    timing = "onDestroyByBattle";
    if (/^a friendly\b/i.test(triggerText)) {
      const eventCardTarget = parseTargetFilter(triggerText);
      eventCardTarget.owner = "friendly";
      eventCardTarget.cardType = "unit";
      conditions.push({ type: "eventCardMatches", target: eventCardTarget });
    }
  } else if (/this Unit is rested by an effect/i.test(triggerText)) {
    timing = "onRestedByEffect";
  } else if (
    /one of your Units? is rested by one of your opponent'?s? effects?/i.test(triggerText)
  ) {
    timing = "onRestedByEnemyEffect";
    const eventCardTarget = parseTargetFilter(triggerText);
    eventCardTarget.owner = "friendly";
    eventCardTarget.cardType = "unit";
    conditions.push(
      { type: "eventPlayerIsOpponent" },
      { type: "eventCardMatches", target: eventCardTarget },
    );
  } else if (/this Unit receives enemy effect damage/i.test(triggerText)) {
    timing = "onEnemyEffectDamage";
  } else if (/this Unit receives effect damage/i.test(triggerText)) {
    timing = "onEffectDamageReceived";
  } else if (
    /one of your other \([^)]+\) Units? receives damage from an enemy/i.test(triggerText)
  ) {
    const otherTraitDamageM = triggerText.match(
      /one of your other \(([^)]+)\) Units? receives damage from an enemy/i,
    )!;
    timing = "onBattleDamageReceived";
    conditions.push(
      { type: "eventDamageSourceIsOpponent" },
      {
        type: "eventCardMatches",
        target: {
          owner: "friendly",
          cardType: "unit",
          excludeSource: true,
          attributeFilters: [
            {
              attribute: "trait",
              comparison: "includes",
              value: otherTraitDamageM[1].toLowerCase(),
            },
          ],
        },
      },
    );
  } else if (/one of your (?:friendly )?.*Units? receives effect damage/i.test(triggerText)) {
    timing = "onEffectDamageReceived";
    conditions.push({ type: "eventCardMatches", target: parseTargetFilter(triggerText) });
  } else if (/your .*Units? deals battle damage to an enemy Unit/i.test(triggerText)) {
    timing = "onBattleDamageDealtToUnit";
    const eventSourceTarget = parseTargetFilter(triggerText);
    eventSourceTarget.owner = "friendly";
    eventSourceTarget.cardType = "unit";
    conditions.push(
      { type: "eventSourceMatches", target: eventSourceTarget },
      {
        type: "eventCardMatches",
        target: { owner: "opponent", cardType: "unit" },
      },
    );
  } else if (/this Unit['’]s AP is reduced by an enemy effect/i.test(triggerText)) {
    timing = "onApReducedByEnemy";
  } else if (/this (?:rested )?Unit is set as active by an effect/i.test(triggerText)) {
    timing = "onSetActiveByEffect";
  } else if (/this Unit recovers? HP/i.test(triggerText)) {
    timing = "whenHealed";
  } else if (/this (?:Unit|Base) receives? battle damage from an enemy/i.test(triggerText)) {
    timing = "onBattleDamageReceived";
  } else if (/this Unit receives? enemy battle damage/i.test(triggerText)) {
    timing = "onBattleDamageReceived";
  } else if (/a friendly .*Unit links\b/i.test(triggerText)) {
    timing = "whenLinked";
  } else if (/this Unit is blocked by an enemy/i.test(triggerText)) {
    timing = "onBlocked";
  } else if (/you pay .*for .*Units?(?:['’]s?)? effects?/i.test(triggerText)) {
    timing = "onUnitEffectCostPaid";
    if (/(?:one of your|a friendly) Units?(?:['’]s?)? effects?/i.test(triggerText)) {
      conditions.push(
        { type: "eventPlayerIsSelf" },
        {
          type: "eventCardMatches",
          target: { owner: "friendly", cardType: "unit" },
        },
      );
    }
  } else if (/you draw with an effect/i.test(triggerText)) {
    timing = "onDrawByEffect";
  }

  if (!timing) return null;

  if (
    /^this (?:Unit|Base)\b/i.test(triggerText) &&
    !selfOrFriendlyTraitDeployM &&
    !conditions.some(
      (condition) => condition.type === "eventCardIsSelf" || condition.type === "eventSourceIsSelf",
    )
  ) {
    conditions.push({ type: "eventCardIsSelf" });
  }
  if (timing === "onDrawByEffect" && /^you\b/i.test(triggerText)) {
    conditions.push({ type: "eventPlayerIsSelf" });
  }
  if (timing === "whenLinked" && /a friendly .*Unit links\b/i.test(triggerText)) {
    conditions.push({ type: "eventCardMatches", target: parseTargetFilter(triggerText) });
  }

  let directiveBody = body;
  const leadingConditionM = directiveBody.match(/^if (.+?),\s*(.*)$/is);
  if (leadingConditionM) {
    const condition = parseCondition(leadingConditionM[1]);
    if (condition) {
      conditions.push(condition);
      directiveBody = leadingConditionM[2].trim();
    }
  }
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
  const eventSourceStatReference =
    /one of your other Units? with <[^>]+> attacks/i.test(triggerText) &&
    /that Unit/i.test(directiveBody);
  if (eventSourceStatReference) directiveBody = directiveBody.replace(/that Unit/gi, "this Unit");
  const eventSourceKeywordBody = directiveBody.replace(
    /\s+\(When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area\.\)$/i,
    "",
  );
  const eventSourceKeywordM = eventSourceKeywordBody.match(
    /^the attacking Unit gains <([^>\d]+?)(?:\s+(\d+))?> during this battle\.?$/i,
  );
  let directives = eventSourceKeywordM
    ? [
        {
          action: {
            action: "grantKeywordEventSource" as const,
            keyword: parseKeywordEffectName(eventSourceKeywordM[1].trim())!,
            ...(eventSourceKeywordM[2]
              ? { keywordValue: Number.parseInt(eventSourceKeywordM[2], 10) }
              : {}),
            duration: "thisBattle" as const,
            sourceFilter: {
              owner: "friendly" as const,
              cardType: "unit" as const,
              excludeSource: true,
            },
          },
        },
      ]
    : parseSteps(directiveBody);
  const exResourceExiledDamageReductionM = directiveBody.match(
    /^you may choose (\d+) of your Units?\. During this turn, when it receives enemy damage, reduce it by (\d+)\.?$/i,
  );
  if (timing === "onExResourceExiled" && exResourceExiledDamageReductionM) {
    directives = [
      {
        optional: true,
        action: {
          action: "reduceNextDamage",
          amount: Number.parseInt(exResourceExiledDamageReductionM[2], 10),
          duration: "thisTurn",
          source: "enemy",
          target: {
            owner: "friendly",
            cardType: "unit",
            count: Number.parseInt(exResourceExiledDamageReductionM[1], 10),
          },
        },
      },
    ];
  }
  if (
    timing === "onBattleDamageDealtToUnit" &&
    /^destroy that enemy Unit\.?$/i.test(directiveBody)
  ) {
    directives = [{ action: { action: "destroyEventCard" as const } }];
  }
  if (
    timing === "onBattleDamageDealtToUnit" &&
    /^(?:you may )?return the enemy Unit to its owner['’]s hand\.?$/i.test(directiveBody)
  ) {
    directives = [
      {
        action: { action: "returnEventCardToHand" as const },
        ...(/^you may /i.test(directiveBody) ? { optional: true } : {}),
      },
    ];
  }
  const recoverEventCardM = directiveBody.match(/^that friendly Unit may recover (\d+) HP\.?$/i);
  if (timing === "onDestroyByBattle" && recoverEventCardM) {
    const eventCardCondition = conditions.find(
      (condition) => condition.type === "eventCardMatches",
    );
    directives = [
      {
        optional: true,
        action: {
          action: "recoverHPEventCard" as const,
          amount: Number.parseInt(recoverEventCardM[1], 10),
          ...(eventCardCondition?.type === "eventCardMatches"
            ? { sourceFilter: eventCardCondition.target }
            : {}),
        },
      },
    ];
  }
  const damageEventSourceM = directiveBody.match(/^deal (\d+) damage to that Unit\.?$/i);
  if (
    timing === "onBattleDamageReceived" &&
    /this (?:Unit|Base) receives? battle damage from an enemy Unit/i.test(triggerText) &&
    damageEventSourceM
  ) {
    const sourceFilter = parseTargetFilter(triggerText);
    sourceFilter.owner = "opponent";
    sourceFilter.cardType = "unit";
    directives = [
      {
        action: {
          action: "dealDamageEventSource" as const,
          amount: Number.parseInt(damageEventSourceM[1], 10),
          sourceFilter,
        },
      },
    ];
  }
  if (timing === "onBlocked" && /this Unit is blocked by an enemy Unit/i.test(triggerText)) {
    const unitFilter = parseTargetFilter(triggerText);
    unitFilter.owner = "opponent";
    unitFilter.cardType = "unit";
    directives = directives.map((directive) => {
      if (!("action" in directive) || directive.action.action !== "preventDamage") return directive;
      return { ...directive, action: { ...directive.action, unitFilter } };
    });
  }
  if (eventSourceStatReference) {
    directives = directives.map((directive) => {
      if (!("action" in directive) || directive.action.action !== "rest") return directive;
      const target = {
        ...directive.action.target,
        ...(directive.action.target.attributeFilters
          ? {
              attributeFilters: directive.action.target.attributeFilters.map((filter) =>
                filter.attribute === "level" &&
                typeof filter.value === "object" &&
                filter.value !== null &&
                "ref" in filter.value &&
                filter.value.ref === "source"
                  ? { ...filter, value: { ...filter.value, ref: "eventSource" as const } }
                  : filter,
              ),
            }
          : {}),
      };
      return { ...directive, action: { ...directive.action, target } };
    });
  }
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
      timing: /this Unit destroys? an enemy card with battle damage/i.test(triggerText)
        ? ["onDestroyByBattle", "onShieldAreaCardDestroyByBattle"]
        : /one of your other \([^)]+\) Units? receives damage from an enemy/i.test(triggerText)
          ? ["onBattleDamageReceived", "onEnemyEffectDamage"]
          : [timing],
      ...(conditions.length > 0 ? { conditions } : {}),
      ...(qualification ? { qualification } : {}),
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

  const friendlyUnitDestroyedByEffectDrawM = trimmed.match(
    /^(【Once per Turn】\s*)?When one of your Units is destroyed by an effect, draw (\d+)\.?$/i,
  );
  if (friendlyUnitDestroyedByEffectDrawM) {
    return {
      type: "triggered",
      activation: {
        timing: ["destroyed"],
        ...(friendlyUnitDestroyedByEffectDrawM[1]
          ? { restrictions: [{ type: "oncePerTurn" as const }] }
          : {}),
        conditions: [
          {
            type: "eventCardMatches",
            target: { owner: "friendly", cardType: "unit" },
          },
          { type: "eventDamageType", damageType: "effect" },
        ],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: Number.parseInt(friendlyUnitDestroyedByEffectDrawM[2], 10),
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const activateBaseAfterFriendlyTraitEffectDestructionM = trimmed.match(
    /^【Activate[･·]Main】Rest this Base：If one of your Units has been destroyed by one of your \(([^)]+)\) card['’]s effects during this turn, deploy 1 \(([^)]+)\) Unit card that is Lv\.(\d+) or lower from your hand\.?$/i,
  );
  if (activateBaseAfterFriendlyTraitEffectDestructionM) {
    const [, sourceTrait, deployTrait, maximumLevel] =
      activateBaseAfterFriendlyTraitEffectDestructionM;
    return {
      type: "activated",
      activation: {
        timing: ["activate:main"],
        conditions: [
          {
            type: "friendlyUnitDestroyedByFriendlyTraitThisTurn",
            trait: sourceTrait!.toLowerCase(),
          },
        ],
      },
      cost: { restSelf: true },
      directives: [
        {
          action: {
            action: "deploy",
            target: {
              owner: "friendly",
              zone: "hand",
              count: 1,
              cardType: "unit",
              attributeFilters: [
                { attribute: "trait", comparison: "includes", value: deployTrait!.toLowerCase() },
                {
                  attribute: "level",
                  comparison: "lte",
                  value: Number.parseInt(maximumLevel!, 10),
                },
              ],
            },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  // "When one of your (Trait) Unit tokens receives enemy effect damage" is
  // an always-on damage replacement, not a triggered effect after damage has
  // been marked. Keep the source card generic: a Pilot can protect a separate
  // friendly token as long as the target matches this filter.
  const friendlyTokenEnemyEffectDamageReductionM = trimmed.match(
    /^When one of your \(([^)]+)\) Unit tokens receives enemy effect damage, reduce it by (\d+)\.?$/i,
  );
  if (friendlyTokenEnemyEffectDamageReductionM) {
    return {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "reduceNextDamage",
            amount: Number.parseInt(friendlyTokenEnemyEffectDamageReductionM[2], 10),
            target: {
              owner: "friendly",
              cardType: "unit",
              isToken: true,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: friendlyTokenEnemyEffectDamageReductionM[1].toLowerCase(),
                },
              ],
            },
            damageType: "effect",
            source: "enemy",
            duration: "permanent",
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const enemyTrashHandReductionM = trimmed.match(
    /^While an enemy player has (\d+) or more cards in their trash, this card in your hand gets Lv\.\s*-(\d+) and cost\s*-(\d+)\.?$/i,
  );
  if (enemyTrashHandReductionM) {
    const selfInHand = {
      owner: "self" as const,
      zone: "hand" as const,
      cardType: "unit" as const,
    };
    return {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "trash",
            comparison: "gte",
            count: Number.parseInt(enemyTrashHandReductionM[1], 10),
          },
        ],
      },
      directives: [
        {
          action: {
            action: "levelReductionByCount",
            amountPerMatch: Number.parseInt(enemyTrashHandReductionM[2], 10),
            countFilter: selfInHand,
            target: selfInHand,
          },
        },
        {
          action: {
            action: "costReductionByCount",
            amountPerMatch: Number.parseInt(enemyTrashHandReductionM[3], 10),
            countFilter: selfInHand,
            target: selfInHand,
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const enemyTrashUnitStatM = trimmed.match(
    /^While an enemy player has (\d+) or more cards in their trash, this Unit gets AP\+(\d+) and HP\+(\d+)\.?$/i,
  );
  if (enemyTrashUnitStatM) {
    return {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "trash",
            comparison: "gte",
            count: Number.parseInt(enemyTrashUnitStatM[1], 10),
          },
        ],
      },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: Number.parseInt(enemyTrashUnitStatM[2], 10),
            duration: "permanent",
            target: { owner: "self", cardType: "unit" },
          },
        },
        {
          action: {
            action: "statModifier",
            stat: "hp",
            amount: Number.parseInt(enemyTrashUnitStatM[3], 10),
            duration: "permanent",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const deployedTurnRestedAttackM = trimmed.match(
    /^On the turn this Unit is deployed, it may choose a rested enemy Unit as its attack target and attack it\.?$/i,
  );
  if (deployedTurnRestedAttackM) {
    return {
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [
        {
          action: {
            action: "allowAttackDeployedThisTurn",
            duration: "thisTurn",
            target: { owner: "self", cardType: "unit" },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "rested",
            },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const linkedAttackTrashReturnM = trimmed.match(
    /^【During Link】【Attack】Choose (\d+) cards from your trash\. Return them to their owner'?s deck and shuffle it\. If you do, set this Unit as active\. It gains <First Strike> during this turn\.(?:\s*\(.+\))?$/is,
  );
  if (linkedAttackTrashReturnM) {
    const count = Number.parseInt(linkedAttackTrashReturnM[1], 10);
    const trashTarget = { owner: "friendly" as const, zone: "trash" as const, count };
    return {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          { type: "duringLink" },
          { type: "cardInZone", owner: "friendly", zone: "trash", comparison: "gte", count },
        ],
      },
      directives: [
        {
          action: {
            action: "returnToDeck",
            position: "bottom",
            shuffle: true,
            target: trashTarget,
          },
        },
        {
          action: { action: "setActive", target: { owner: "self", cardType: "unit" } },
          dependsOnPrevious: true,
        },
        {
          action: {
            action: "grantKeyword",
            keyword: "FirstStrike",
            duration: "thisTurn",
            target: { owner: "self", cardType: "unit" },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText: trimmed,
    };
  }

  const pairedAttackTokenPermissionM = trimmed.match(
    /^【During Pair】【Attack】Choose (\d+) of your \(([^)]+)\) Unit tokens\. It may attack on the turn it is deployed\.?$/i,
  );
  if (pairedAttackTokenPermissionM) {
    return {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [{ type: "duringPair" }, { type: "eventSourceIsSelf" }],
      },
      directives: [
        {
          action: {
            action: "allowAttackDeployedThisTurn",
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              isToken: true,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: pairedAttackTokenPermissionM[2].toLowerCase(),
                },
              ],
              count: Number.parseInt(pairedAttackTokenPermissionM[1], 10),
            },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const enemyLinkDestroyedWhileAttackingM = trimmed.match(
    /^【Once per Turn】\s*When an enemy Link Unit is destroyed with damage while this Unit is attacking, draw (\d+)\.?$/i,
  );
  if (enemyLinkDestroyedWhileAttackingM) {
    return {
      type: "triggered",
      activation: {
        timing: ["onEnemyLinkUnitDestroyed"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [{ type: "selfIsAttacking" }],
      },
      directives: [
        {
          action: {
            action: "draw",
            count: Number.parseInt(enemyLinkDestroyedWhileAttackingM[1], 10),
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const activatedEnemyLowApRecoverM = trimmed.match(
    /^【Activate[･·]Action】【Once per Turn】If an enemy Unit with (\d+) or less AP is in play, this Unit recovers (\d+) HP\.?$/i,
  );
  if (activatedEnemyLowApRecoverM) {
    return {
      type: "activated",
      activation: {
        timing: ["activate:action"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [
          {
            type: "cardInZone",
            owner: "opponent",
            zone: "battleArea",
            cardType: "unit",
            comparison: "gte",
            count: 1,
            attributeFilters: [
              {
                attribute: "ap",
                comparison: "lte",
                value: Number.parseInt(activatedEnemyLowApRecoverM[1], 10),
              },
            ],
          },
        ],
      },
      directives: [
        {
          action: {
            action: "recoverHP",
            amount: Number.parseInt(activatedEnemyLowApRecoverM[2], 10),
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const restFriendlyAndEnemyM = trimmed.match(
    /^【Main】Choose (\d+) active friendly \(([^)]+)\) Unit and (\d+) active enemy Unit\. Rest them\.?$/i,
  );
  if (restFriendlyAndEnemyM) {
    return {
      type: "command",
      activation: { timing: ["main"] },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "active",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: restFriendlyAndEnemyM[2].toLowerCase(),
                },
              ],
              count: Number.parseInt(restFriendlyAndEnemyM[1], 10),
            },
          },
        },
        {
          action: {
            action: "rest",
            target: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              count: Number.parseInt(restFriendlyAndEnemyM[3], 10),
            },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const allEnemyRestM = trimmed.match(
    /^【(Deploy|Attack)】All enemy players each choose 1 of their active Units\. Rest them\.?$/i,
  );
  if (allEnemyRestM) {
    return {
      type: "triggered",
      activation: { timing: [allEnemyRestM[1].toLowerCase() as "deploy" | "attack"] },
      directives: [
        {
          action: {
            action: "queueEffectForPlayers",
            scope: "opponents",
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "rest",
                    target: { owner: "friendly", cardType: "unit", state: "active", count: 1 },
                  },
                },
              ],
              sourceText: "Choose 1 of your active Units. Rest it.",
            },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const restFriendlyThenEnemyPlayersM = trimmed.match(
    /^【Main】\/【Action】Choose 1 active friendly \(([^)]+)\) Unit\. Rest it\. If you do, all enemy players each choose 1 of their active Units\. Rest them\.?$/i,
  );
  if (restFriendlyThenEnemyPlayersM) {
    return {
      type: "command",
      activation: { timing: ["main", "action"] },
      directives: [
        {
          action: {
            action: "rest",
            target: {
              owner: "friendly",
              cardType: "unit",
              state: "active",
              count: 1,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: restFriendlyThenEnemyPlayersM[1].toLowerCase(),
                },
              ],
            },
          },
        },
        {
          action: {
            action: "queueEffectForPlayers",
            scope: "opponents",
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "rest",
                    target: { owner: "friendly", cardType: "unit", state: "active", count: 1 },
                  },
                },
              ],
              sourceText: "Choose 1 of your active Units. Rest it.",
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText: trimmed,
    };
  }

  const destroyFriendlyThenEnemyPlayersM = trimmed.match(
    /^【Attack】You may choose 1 of your Units\. Destroy it\. If you do, all enemy players each choose 1 of their non-battling Units\. Destroy them\.?$/i,
  );
  if (destroyFriendlyThenEnemyPlayersM) {
    return {
      type: "triggered",
      activation: { timing: ["attack"] },
      directives: [
        {
          action: {
            action: "destroy",
            target: { owner: "friendly", cardType: "unit", count: 1 },
          },
          optional: true,
        },
        {
          action: {
            action: "queueEffectForPlayers",
            scope: "opponents",
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "destroy",
                    target: { owner: "friendly", cardType: "unit", isBattling: false, count: 1 },
                  },
                },
              ],
              sourceText: "Choose 1 of your non-battling Units. Destroy it.",
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText: trimmed,
    };
  }

  const twoEnemyBreachM = trimmed.match(
    /^【Deploy】If there are (\d+) or more enemy players, choose (\d+) to (\d+) friendly Units\. They gain <Breach (\d+)> during this turn\.?(?:\s*\(.+\))?$/is,
  );
  if (twoEnemyBreachM) {
    return {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [
          {
            type: "enemyPlayerCount",
            comparison: "gte",
            count: Number.parseInt(twoEnemyBreachM[1], 10),
          },
        ],
      },
      directives: [
        {
          action: {
            action: "grantKeyword",
            keyword: "Breach",
            keywordValue: Number.parseInt(twoEnemyBreachM[4], 10),
            duration: "thisTurn",
            target: {
              owner: "friendly",
              cardType: "unit",
              count: {
                min: Number.parseInt(twoEnemyBreachM[2], 10),
                max: Number.parseInt(twoEnemyBreachM[3], 10),
              },
            },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const twoEnemyMostUnitsReturnM = trimmed.match(
    /^【Deploy】If there are (\d+) or more enemy players, choose 1 Unit belonging to an enemy player with the most Units\. Return it to its owner's hand\.?$/i,
  );
  if (twoEnemyMostUnitsReturnM) {
    return {
      type: "triggered",
      activation: {
        timing: ["deploy"],
        conditions: [
          {
            type: "enemyPlayerCount",
            comparison: "gte",
            count: Number.parseInt(twoEnemyMostUnitsReturnM[1], 10),
          },
        ],
      },
      directives: [
        {
          action: {
            action: "returnToHand",
            target: {
              owner: "any",
              cardType: "unit",
              count: 1,
              ownerHasMostUnits: true,
            },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const eachEnemyReturnM = trimmed.match(
    /^【Deploy】Choose 1 Unit with (\d+) or less HP belonging to each enemy player\. Return them to their owners' hands\.?$/i,
  );
  if (eachEnemyReturnM) {
    return {
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [
        {
          action: {
            action: "queueEffectForPlayers",
            scope: "opponents",
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "returnToHand",
                    target: {
                      owner: "friendly",
                      cardType: "unit",
                      count: 1,
                      attributeFilters: [
                        {
                          attribute: "hp",
                          comparison: "lte",
                          value: Number.parseInt(eachEnemyReturnM[1]!, 10),
                        },
                      ],
                    },
                  },
                },
              ],
              sourceText:
                "Choose 1 of your Units with 4 or less HP. Return it to its owner's hand.",
            },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const allPlayersResourceM = trimmed.match(
    /^【During Link】【Attack】【Once per Turn】All players each choose 1 of their Resources\. Set them as active\.?$/i,
  );
  if (allPlayersResourceM) {
    return {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [{ type: "duringLink" }],
        restrictions: [{ type: "oncePerTurn" }],
      },
      directives: [
        {
          action: {
            action: "queueEffectForPlayers",
            scope: "all",
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "setActive",
                    target: { owner: "friendly", cardType: "resource", count: 1 },
                  },
                },
              ],
              sourceText: "Choose 1 of your Resources. Set it as active.",
            },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const allPlayersTopDeckM = trimmed.match(
    /^【(Attack|Main)】All players each look at the top card of their deck\. If it is (?:a card that is Lv\.(\d+) or higher|a Unit card), they may reveal it and add it to their hand\. They return any remaining card to the top or bottom of their deck\.?$/i,
  );
  if (allPlayersTopDeckM) {
    const level = allPlayersTopDeckM[2] ? Number.parseInt(allPlayersTopDeckM[2], 10) : undefined;
    return {
      type: allPlayersTopDeckM[1].toLowerCase() === "main" ? "command" : "triggered",
      activation: { timing: [allPlayersTopDeckM[1].toLowerCase() as "attack" | "main"] },
      directives: [
        {
          action: {
            action: "queueEffectForPlayers",
            scope: "all",
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "lookAtTopDeck",
                    count: 1,
                    return: "chooseTop",
                    tutorFilter: {
                      owner: "friendly",
                      count: 1,
                      ...(level !== undefined
                        ? {
                            attributeFilters: [
                              {
                                attribute: "level" as const,
                                comparison: "gte" as const,
                                value: level,
                              },
                            ],
                          }
                        : { cardType: "unit" as const }),
                    },
                  },
                },
              ],
              sourceText:
                "Look at the top card of your deck. You may reveal it and add it to your hand. Return it to the top or bottom of your deck.",
            },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const destroyThenMillRetrieveM = trimmed.match(
    /^【Deploy】You may choose 1 of your other Units\. Destroy it\. If you do, place the top (\d+) cards of your deck into your trash\. Add 1 \(([^)]+)\) Unit card you placed from your deck with this effect to your hand\.?$/i,
  );
  if (destroyThenMillRetrieveM) {
    return {
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [
        {
          action: {
            action: "destroy",
            target: { owner: "friendly", cardType: "unit", excludeSource: true, count: 1 },
          },
          optional: true,
        },
        {
          action: {
            action: "millDeckThenAddToHand",
            count: Number.parseInt(destroyThenMillRetrieveM[1], 10),
            target: {
              owner: "friendly",
              zone: "trash",
              cardType: "unit",
              count: 1,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: destroyThenMillRetrieveM[2].toLowerCase(),
                },
              ],
            },
          },
          dependsOnPrevious: true,
        },
      ],
      sourceText: trimmed,
    };
  }

  const pairedDiscardActivateM = trimmed.match(
    /^【When Paired】Draw (\d+)\. Then, discard (\d+)\. If you discard a \(([^)]+)\) Command card with this effect, you may activate its 【(Main|Action)】\.?$/i,
  );
  if (pairedDiscardActivateM) {
    return {
      type: "triggered",
      activation: { timing: ["whenPaired"] },
      directives: [
        {
          action: {
            action: "drawThenDiscard",
            drawCount: Number.parseInt(pairedDiscardActivateM[1], 10),
            discardCount: Number.parseInt(pairedDiscardActivateM[2], 10),
            activateDiscardedCommand: {
              trait: pairedDiscardActivateM[3].toLowerCase(),
              timing: pairedDiscardActivateM[4].toLowerCase() as "main" | "action",
            },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const specialMoveAttackM = trimmed.match(
    /^【During Link】【Attack】If you have activated a \(([^)]+)\) Command card['’]s 【Main】\/【Action】 during this turn, choose 1 enemy Unit\. Deal (\d+) damage to it\.?$/i,
  );
  if (specialMoveAttackM) {
    return {
      type: "triggered",
      activation: {
        timing: ["attack"],
        conditions: [
          { type: "duringLink" },
          {
            type: "activatedCommandThisTurn",
            owner: "friendly",
            target: {
              owner: "friendly",
              cardType: "command",
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: specialMoveAttackM[1].toLowerCase(),
                },
              ],
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: Number.parseInt(specialMoveAttackM[2], 10),
            target: { owner: "opponent", cardType: "unit", count: 1 },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const paidUnitEffectEndTurnM = trimmed.match(
    /^【During Link】At the end of a turn where you have paid [①1] or more for one of your other ((?:\([^)]+\)\/)*\([^)]+\)) Units?'? effects, choose 1 of your \(([^)]+)\) Units?\. Set it as active\.?$/i,
  );
  if (paidUnitEffectEndTurnM) {
    const paidTraits = Array.from(paidUnitEffectEndTurnM[1].matchAll(/\(([^)]+)\)/g)).map((m) =>
      m[1].toLowerCase(),
    );
    const paidFilter =
      paidTraits.length === 1
        ? { attribute: "trait" as const, comparison: "includes" as const, value: paidTraits[0] }
        : {
            attribute: "or" as const,
            filters: paidTraits.map((value) => ({
              attribute: "trait" as const,
              comparison: "includes" as const,
              value,
            })),
          };
    const target = {
      owner: "friendly" as const,
      cardType: "unit" as const,
      state: "rested" as const,
      count: 1,
      attributeFilters: [
        {
          attribute: "trait" as const,
          comparison: "includes" as const,
          value: paidUnitEffectEndTurnM[2].toLowerCase(),
        },
      ],
    };
    return {
      type: "triggered",
      activation: {
        timing: ["onUnitEffectCostPaid"],
        restrictions: [{ type: "oncePerTurn" }],
        conditions: [
          { type: "duringLink" },
          {
            type: "eventCardMatches",
            target: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
              attributeFilters: [paidFilter],
            },
          },
        ],
      },
      directives: [
        {
          action: {
            action: "createDelayedTrigger",
            duration: "thisTurn",
            eventType: "turnEnded",
            eventCardFilter: { owner: "self", cardType: "unit" },
            effect: {
              type: "triggered",
              activation: { timing: ["endOfTurn"], conditions: [{ type: "duringLink" }] },
              directives: [{ action: { action: "setActive", target } }],
              sourceText: `At the end of the turn, choose 1 of your (${paidUnitEffectEndTurnM[2]}) Units. Set it as active.`,
            },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const deployedThisTurnAttackGateM = trimmed.match(
    /^This Unit can only attack during a turn when one of your ((?:\([^)]+\)\/)*\([^)]+\)) Units? is deployed\.?$/i,
  );
  if (deployedThisTurnAttackGateM) {
    const traits = Array.from(deployedThisTurnAttackGateM[1].matchAll(/\(([^)]+)\)/g)).map((m) =>
      m[1].toLowerCase(),
    );
    return {
      type: "constant",
      activation: {
        conditions: [
          {
            type: "deployedThisTurnCount",
            owner: "friendly",
            cardType: "unit",
            comparison: "eq",
            count: 0,
            attributeFilters: [
              traits.length === 1
                ? { attribute: "trait", comparison: "includes", value: traits[0] }
                : {
                    attribute: "or",
                    filters: traits.map((value) => ({
                      attribute: "trait" as const,
                      comparison: "includes" as const,
                      value,
                    })),
                  },
            ],
          },
        ],
      },
      directives: [
        {
          action: {
            action: "cantAttack",
            duration: "permanent",
            target: { owner: "self", cardType: "unit" },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const exPaidRestSameTargetM = trimmed.match(
    /^【Main】Choose 1 enemy Unit\. It gets AP-(\d+) during this turn\. If you use an EX Resource to play this card, rest the enemy Unit\.?$/i,
  );
  if (exPaidRestSameTargetM) {
    const target = { owner: "opponent" as const, cardType: "unit" as const, count: 1 };
    return {
      type: "command",
      activation: { timing: ["main"] },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: -Number.parseInt(exPaidRestSameTargetM[1], 10),
            duration: "thisTurn",
            target,
          },
        },
        {
          action: { action: "rest", target, requiresPaidExResources: true },
          dependsOnPrevious: true,
          sharesTargetChoiceWithPrevious: true,
        },
      ],
      sourceText: trimmed,
    };
  }

  const grantedLinkDestroyedTriggerM = trimmed.match(
    /^【Action】Choose 1 friendly \(([^)]+)\) Unit\. It gains the following effect during this turn:\s*■\s*【During Link】【Destroyed】Choose 1 friendly \(([^)]+)\) Unit\. Set it as active\.?$/i,
  );
  if (grantedLinkDestroyedTriggerM) {
    const [, grantedUnitTrait, readyUnitTrait] = grantedLinkDestroyedTriggerM;
    const grantedTarget = {
      owner: "friendly" as const,
      cardType: "unit" as const,
      attributeFilters: [
        {
          attribute: "trait" as const,
          comparison: "includes" as const,
          value: grantedUnitTrait!.toLowerCase(),
        },
      ],
      count: 1,
    };
    return {
      type: "command",
      activation: { timing: ["action"] },
      directives: [
        {
          action: {
            action: "createDelayedTrigger",
            duration: "thisTurn",
            eventType: "unitDestroyed",
            target: grantedTarget,
            eventCardFilter: { ...grantedTarget, count: undefined, isLinkUnit: true },
            effect: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "setActive",
                    target: {
                      owner: "friendly",
                      cardType: "unit",
                      attributeFilters: [
                        {
                          attribute: "trait",
                          comparison: "includes",
                          value: readyUnitTrait!.toLowerCase(),
                        },
                      ],
                      count: 1,
                    },
                  },
                },
              ],
              sourceText: `Choose 1 friendly (${readyUnitTrait}) Unit. Set it as active.`,
            },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  const chooseOneM = trimmed.match(
    /^【(Main|Action)】When playing this card, choose 1 of the following effects and activate it:\s*■\s*(.+?)\s*■\s*(.+?)\s*$/is,
  );
  if (chooseOneM) {
    const timing = chooseOneM[1].toLowerCase() as "main" | "action";
    const optionTexts = [chooseOneM[2].trim(), chooseOneM[3].trim()];
    return {
      type: "command",
      activation: { timing: [timing] },
      directives: [
        {
          kind: "chooseOne",
          options: optionTexts.map((optionText) => {
            const directives = parseSteps(optionText);
            // A modal option that has no card target can resolve with the modal
            // selection itself. Keep the queued continuation when a target is
            // required: its legal candidates must be calculated only after the
            // controller has chosen this option.
            const resolvesWithoutTargetPrompt = directives.every(
              (directive) => "action" in directive && !("target" in directive.action),
            );
            return {
              label: optionText,
              directives: resolvesWithoutTargetPrompt
                ? directives
                : [
                    {
                      action: {
                        action: "resolveThenQueue",
                        followUp: {
                          type: "triggered",
                          activation: { timing: [] },
                          directives,
                          sourceText: optionText,
                        },
                      },
                    },
                  ],
            };
          }),
        },
      ],
      sourceText: trimmed,
    };
  }

  const discardToPairFromTrashM = trimmed.match(
    /^【Activate[·･]Main】Discard (\d+) \(([^)]+)\)\/\(([^)]+)\) Unit card[：:]If a Pilot is not paired with this Unit, choose (\d+) \(([^)]+)\) Pilot card that is Lv\.(\d+) or lower from your trash\. Pair it with this Unit\.?$/i,
  );
  if (discardToPairFromTrashM) {
    const traitFilters = [discardToPairFromTrashM[2], discardToPairFromTrashM[3]].map((value) => ({
      attribute: "trait" as const,
      comparison: "includes" as const,
      value: value.toLowerCase(),
    }));
    return {
      type: "activated",
      activation: { timing: ["activate:main"], conditions: [{ type: "selfIsUnpaired" }] },
      cost: {
        discardCount: Number.parseInt(discardToPairFromTrashM[1], 10),
        discardFilter: {
          owner: "friendly",
          zone: "hand",
          cardType: "unit",
          count: Number.parseInt(discardToPairFromTrashM[1], 10),
          attributeFilters: [{ attribute: "or", filters: traitFilters }],
        },
      },
      directives: [
        {
          action: {
            action: "pairPilot",
            target: {
              owner: "friendly",
              zone: "trash",
              cardType: "pilot",
              count: Number.parseInt(discardToPairFromTrashM[4], 10),
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: discardToPairFromTrashM[5].toLowerCase(),
                },
                {
                  attribute: "level",
                  comparison: "lte",
                  value: Number.parseInt(discardToPairFromTrashM[6], 10),
                },
              ],
            },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  // Card identity metadata is normalized into `alternateNames`, not emitted
  // as a runtime CardEffect.
  if (/^This card['’]s name is also treated as \[[^\]]+\]\.?(?:\s*<br>)?$/i.test(trimmed)) {
    return null;
  }

  if (extractPrintedKeyword(trimmed)) return null;

  if (
    /^【Deploy】Add 1 of your Shields to your hand\. Then, if it is your turn, choose 1 Unit with 2 or less HP belonging to each enemy player\. Return them to their owners' hands\.?$/i.test(
      trimmed,
    )
  ) {
    return {
      type: "triggered",
      activation: { timing: ["deploy"] },
      directives: [
        {
          action: {
            action: "resolveThenQueue",
            first: { action: "addShieldToHand", count: 1 },
            condition: { type: "isTurn", whose: "friendly" },
            followUp: {
              type: "triggered",
              activation: { timing: [] },
              directives: [
                {
                  action: {
                    action: "returnToHand",
                    target: {
                      owner: "opponent",
                      cardType: "unit",
                      count: 1,
                      attributeFilters: [{ attribute: "hp", comparison: "lte", value: 2 }],
                    },
                  },
                },
              ],
              sourceText:
                "Then, if it is your turn, choose 1 Unit with 2 or less HP belonging to each enemy player. Return them to their owners' hands.",
            },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

  if (
    /^If there are 2 or more enemy players and this Unit is rested, friendly Shields can't receive battle damage from enemy Units\.?$/i.test(
      trimmed,
    )
  ) {
    return parseConstantEffect(trimmed, trimmed);
  }
  if (/^If there are 2 or more enemy players, this Unit gains <Blocker>/i.test(trimmed)) {
    return parseConstantEffect(trimmed, trimmed);
  }
  if (
    /^During a turn where your opponent has discarded due to one of your effects,/i.test(trimmed)
  ) {
    return parseConstantEffect(trimmed, trimmed);
  }
  if (
    /^This Unit can(?:'|’)t attack while there are \d+ or (?:less|more) cards in your trash\.?$/i.test(
      trimmed,
    )
  ) {
    return parseConstantEffect(trimmed, trimmed);
  }
  if (/^All your\b.*Unit tokens? get (?:AP|HP)[+-]\d+\.?$/i.test(trimmed)) {
    return parseConstantEffect(trimmed, trimmed, cardType);
  }

  const turnPrefixedTrigger = extractLeadingTurnCondition(trimmed);
  if (turnPrefixedTrigger.condition && /^when\b/i.test(turnPrefixedTrigger.body)) {
    const triggered = parseFreeStandingWhenEffect(turnPrefixedTrigger.body);
    if (triggered) {
      return {
        ...triggered,
        activation: {
          ...triggered.activation,
          conditions: [turnPrefixedTrigger.condition, ...(triggered.activation.conditions ?? [])],
        },
        sourceText: trimmed,
      };
    }
  }

  // Constant effects (While, standalone keyword, During your [opponent's] turn)
  if (
    /^while\b/i.test(trimmed) ||
    /^<[\w\s-]/.test(trimmed) ||
    /^[Dd]uring your turn\b/.test(trimmed) ||
    /^[Dd]uring your opponent'?s? turn\b/.test(trimmed) ||
    /^all friendly\b.*during your opponent'?s turn\.?$/i.test(trimmed)
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

    const attackingDamagedEnemyKeywordM = header.rest.match(
      /^If you are attacking a damaged enemy Unit, this Unit gains <([^>\d]+?)(?:\s+(\d+))?> during this battle\.?(?:\s+\([^)]*\))?$/i,
    );
    if (header.timings.includes("attack") && attackingDamagedEnemyKeywordM) {
      const keyword = parseKeywordEffectName(attackingDamagedEnemyKeywordM[1].trim());
      if (keyword) {
        return {
          type: "constant",
          activation: {},
          directives: [
            {
              action: {
                action: "grantKeyword",
                keyword,
                ...(attackingDamagedEnemyKeywordM[2]
                  ? { keywordValue: Number.parseInt(attackingDamagedEnemyKeywordM[2], 10) }
                  : {}),
                duration: "thisBattle",
                target: {
                  owner: "self",
                  cardType: "unit",
                  isBattling: {
                    opponentMatches: { owner: "opponent", cardType: "unit", state: "damaged" },
                  },
                },
              },
            },
          ],
          sourceText: trimmed,
        };
      }
    }

    const trashGatedKeywordAttackTargetM = header.rest.match(
      /^If (there are \d+ or more cards in your trash), this Unit may choose an active enemy Unit with a keyword effect as its attack target\.?$/i,
    );
    if (trashGatedKeywordAttackTargetM) {
      const condition = parseCondition(trashGatedKeywordAttackTargetM[1]);
      if (condition) {
        const headerActivation = buildActivation();
        return {
          type: "constant",
          activation: {
            ...headerActivation,
            conditions: [...(headerActivation.conditions ?? []), condition],
          },
          directives: [
            {
              action: {
                action: "chooseAttackTarget",
                unit: { owner: "self", cardType: "unit", count: 1 },
                attackTarget: {
                  owner: "opponent",
                  cardType: "unit",
                  state: "active",
                  hasAnyKeyword: true,
                },
              },
            },
          ],
          sourceText: trimmed,
        };
      }
    }

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
    let destroyedWithBattleDamage = false;
    if (header.developmentCount !== undefined) {
      effectBody = effectBody
        .replace(
          /^You may exile the specified number of \(G Generation\) cards in your trash from the game\. If you do, activate the following effect:\s*■\s*/i,
          "",
        )
        .trim();
    }
    if (
      /^At the end of the turn when this Unit is paired with a Pilot, set it as active\.?$/i.test(
        effectBody,
      )
    ) {
      return {
        type: "triggered",
        activation: {
          timing: ["endOfTurn"],
          ...(activationConditions.length > 0 ? { conditions: activationConditions } : {}),
        },
        directives: [
          { action: { action: "setActive", target: { owner: "self", cardType: "unit" } } },
        ],
        sourceText: trimmed,
      };
    }

    const destroyedByFriendlyTraitEffectM = effectBody.match(
      /^If this Unit is destroyed by one of your \(([^)]+)\) card['’]s effects, add it from your trash to your hand\.?$/i,
    );
    if (destroyedByFriendlyTraitEffectM && header.timings.includes("destroyed")) {
      return {
        type: "triggered",
        activation: {
          ...buildActivation(),
          conditions: [
            ...activationConditions,
            {
              type: "eventSourceMatches",
              target: {
                owner: "friendly",
                attributeFilters: [
                  {
                    attribute: "trait",
                    comparison: "includes",
                    value: destroyedByFriendlyTraitEffectM[1].toLowerCase(),
                  },
                ],
              },
            },
          ],
        },
        directives: [
          { action: { action: "addFromTrash", target: { owner: "self", zone: "trash" } } },
        ],
        sourceText: trimmed,
      };
    }

    // A Pilot's 【During Link】 text describes the linked Unit with "this".
    // Lift that trait qualification into activation instead of treating it as
    // a resolution-time conditional, so both its stat and keyword grants
    // apply only while it is linked to the specified Unit.
    const linkedUnitTraitConstant = effectBody.match(
      /^if this is an? ((?:\([^)]+\)\/?)+) Unit,\s*(.*)$/is,
    );
    if (
      linkedUnitTraitConstant &&
      (activationConditions.some((condition) => condition.type === "duringLink") ||
        header.timings.includes("whenLinked"))
    ) {
      const traits = [...linkedUnitTraitConstant[1]!.matchAll(/\(([^)]+)\)/g)].map((match) =>
        match[1]!.trim().toLowerCase(),
      );
      activationConditions.push({
        type: "linkedUnitHasTrait",
        trait: traits.length === 1 ? traits[0]! : traits,
      });
      effectBody = linkedUnitTraitConstant[2]!.trim();
    }

    if (effectType === "command") {
      // A Command's leading “If …, choose …” is a play precondition, not an
      // inert resolution branch: without the condition the player cannot
      // reach the printed choice. Keep the condition in activation so the
      // command is rejected before it creates an impossible prompt.
      const leadingIf = effectBody.match(/^if\s+(.+?),\s*(.*)$/is);
      if (leadingIf && /^choose\b/i.test(leadingIf[2])) {
        const condition = parseCondition(leadingIf[1]);
        if (condition) {
          activationConditions.push(condition);
          effectBody = leadingIf[2].trim();
        }
      }
    } else if (effectType === "triggered") {
      const destroyedWithBattleDamageM = effectBody.match(
        /^if this Unit is destroyed with battle damage,\s*(.*)$/is,
      );
      if (destroyedWithBattleDamageM && header.timings.includes("destroyed")) {
        activationConditions.push({ type: "eventDamageType", damageType: "battle" });
        effectBody = destroyedWithBattleDamageM[1]!.trim();
        destroyedWithBattleDamage = true;
      }
      const leadingIf = effectBody.match(/^if\s+(.+?),\s*(.*)$/is);
      if (leadingIf && !/^when\b/i.test(leadingIf[2])) {
        const condition = parseCondition(leadingIf[1]);
        if (
          cardType === "pilot" &&
          condition?.type === "selfHasTrait" &&
          !header.timings.includes("destroyed")
        ) {
          activationConditions.push({
            type: "linkedUnitHasTrait",
            trait: condition.trait,
          });
          effectBody = leadingIf[2].trim();
        } else if (cardType === "pilot" && condition?.type === "selfHasTrait") {
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
          condition?.type === "isAttackingUnit" &&
          header.timings.includes("attack") &&
          /^you may return\b/i.test(leadingIf[2])
        ) {
          // Keep the conditional directive for resolution, but also gate
          // activation so a direct attack does not enqueue an inert prompt.
          activationConditions.push(condition);
        } else if (
          condition?.type === "deployedFromZone" &&
          header.timings.includes("deploy") &&
          /^(?:choose\b|draw \d+\.?$)/i.test(leadingIf[2])
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
          (/^(?:choose\b|this gains?\b)/i.test(leadingIf[2]) ||
            (header.timings.includes("destroyed") && /^deploy\b/i.test(leadingIf[2])) ||
            (header.timings.includes("burst") &&
              /^add this card to your hand\b/i.test(leadingIf[2])))
        ) {
          activationConditions.push(condition);
          effectBody = leadingIf[2].trim();
        } else if (
          condition?.type === "unitCount" &&
          /^place \d+ EX Resource\.?$/i.test(leadingIf[2])
        ) {
          // With no later choice or contingent operation, this leading
          // condition controls whether the triggered effect activates rather
          // than merely producing an empty resolution branch.
          activationConditions.push(condition);
          effectBody = leadingIf[2].trim();
        } else if (
          condition?.type === "cardInZone" &&
          (/^(?:choose\b|this gains?\b)/i.test(leadingIf[2]) ||
            /^draw \d+\.\s*if you do,\s*discard \d+\.?$/i.test(leadingIf[2]) ||
            (header.timings.includes("whenLinked") && /^deal\b/i.test(leadingIf[2])) ||
            (header.timings.includes("burst") &&
              /^add this card to your hand\b/i.test(leadingIf[2])) ||
            /^deploy\b/i.test(leadingIf[2]) ||
            (header.timings.includes("destroyed") &&
              /^place \d+ EX Resource\b/i.test(leadingIf[2])))
        ) {
          activationConditions.push(condition);
          effectBody = leadingIf[2].trim();
        } else if (
          condition &&
          /^(?:choose\b|you may pair\b|this gains?\b|this Unit gets?\b)/i.test(leadingIf[2])
        ) {
          activationConditions.push(condition);
          effectBody = leadingIf[2].trim();
        }
      }

      const pairedPilotColorM = effectBody.match(
        /return a (blue|green|red|white|purple) Pilot paired with this Unit to its owner['’]s hand/i,
      );
      if (pairedPilotColorM && header.timings.includes("attack")) {
        activationConditions.push({
          type: "selfPairedPilotHasColor",
          color: pairedPilotColorM[1].toLowerCase() as
            | "blue"
            | "green"
            | "red"
            | "white"
            | "purple",
        });
      }
    }

    function buildActivation() {
      const activation: EffectActivation = {
        ...(header.timings.length > 0 ? { timing: header.timings } : {}),
        ...(activationConditions.length > 0 ? { conditions: activationConditions } : {}),
        ...(header.oncePerTurn ? { restrictions: [{ type: "oncePerTurn" as const }] } : {}),
        ...(header.pilotQualifier
          ? {
              qualification: header.pilotQualifier.filter
                ? header.pilotQualifier.filter
                : header.pilotQualifier.hasTrait
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

    const opponentMayDrawM = effectBody.match(
      /^Choose 1 enemy player\. They may draw (\d+)\. If they draw with this effect, draw (\d+)\.?$/i,
    );
    if (opponentMayDrawM) {
      const [, opponentDrawCount, controllerDrawCount] = opponentMayDrawM;
      return {
        type: effectType,
        activation: buildActivation(),
        directives: [
          {
            action: {
              action: "queueEffectForOpponent",
              effect: {
                type: "triggered",
                activation: { timing: [] },
                directives: [
                  {
                    optional: true,
                    action: { action: "draw", count: Number.parseInt(opponentDrawCount!, 10) },
                  },
                  {
                    dependsOnPrevious: true,
                    action: {
                      action: "queueEffectForOpponent",
                      effect: {
                        type: "triggered",
                        activation: { timing: [] },
                        directives: [
                          {
                            action: {
                              action: "draw",
                              count: Number.parseInt(controllerDrawCount!, 10),
                            },
                          },
                        ],
                        sourceText: `Draw ${controllerDrawCount}.`,
                      },
                    },
                  },
                ],
                sourceText: `You may draw ${opponentDrawCount}. If you do, your opponent draws ${controllerDrawCount}.`,
              },
            },
          },
        ],
        sourceText: trimmed,
      };
    }

    const enemyHandDiscardM = effectBody.match(
      /^Choose 1 enemy player with (\d+) or more cards in their hand\. They discard (\d+)\.?$/i,
    );
    if (enemyHandDiscardM) {
      return {
        type: effectType,
        activation: {
          ...buildActivation(),
          conditions: [
            ...activationConditions,
            {
              type: "handCount",
              owner: "opponent",
              comparison: "gte",
              count: Number.parseInt(enemyHandDiscardM[1], 10),
            },
          ],
        },
        directives: [
          {
            action: {
              action: "queueEffectForOpponent",
              effect: {
                type: "triggered",
                activation: { timing: [] },
                directives: [
                  {
                    action: {
                      action: "discard",
                      count: Number.parseInt(enemyHandDiscardM[2], 10),
                    },
                  },
                ],
                sourceText: "Choose 1 card from your hand to discard.",
              },
            },
          },
        ],
        sourceText: trimmed,
      };
    }

    const opponentMayDiscardOrDeployM = effectBody.match(
      /^(?:When this Unit destroys an enemy shield area card with battle damage, )?that enemy player may discard (\d+)\. If they don't discard with this effect, you may deploy (\d+) \(([^)]+)\) Unit card that is Lv\.(\d+) or lower from your hand\.?$/i,
    );
    if (opponentMayDiscardOrDeployM) {
      const [, discardCount, deployCount, trait, maximumLevel] = opponentMayDiscardOrDeployM;
      const activation = buildActivation();
      if (
        /^When this Unit destroys an enemy shield area card with battle damage,/i.test(effectBody)
      ) {
        activation.timing = ["onShieldAreaCardDestroyByBattle"];
        activation.conditions = [...(activation.conditions ?? []), { type: "eventCardIsSelf" }];
      }
      const deployTarget = {
        owner: "friendly" as const,
        zone: "hand" as const,
        count: Number.parseInt(deployCount!, 10),
        cardType: "unit" as const,
        attributeFilters: [
          {
            attribute: "trait" as const,
            comparison: "includes" as const,
            value: trait!.toLowerCase(),
          },
          {
            attribute: "level" as const,
            comparison: "lte" as const,
            value: Number.parseInt(maximumLevel!, 10),
          },
        ],
      };
      const controllerDeploy = {
        action: {
          action: "queueEffectForOpponent" as const,
          effect: {
            type: "triggered" as const,
            activation: { timing: [] },
            directives: [
              { optional: true, action: { action: "deploy" as const, target: deployTarget } },
            ],
            sourceText: `You may deploy ${deployCount} (${trait}) Unit card that is Lv.${maximumLevel} or lower from your hand.`,
          },
        },
      };
      return {
        type: "triggered",
        activation,
        directives: [
          {
            action: {
              action: "queueEffectForOpponent",
              effect: {
                type: "triggered",
                activation: { timing: [] },
                directives: [
                  {
                    condition: {
                      type: "handCount",
                      owner: "friendly",
                      comparison: "gte",
                      count: Number.parseInt(discardCount!, 10),
                    },
                    thenDirectives: [
                      {
                        kind: "chooseOne",
                        options: [
                          {
                            label: `Discard ${discardCount} card`,
                            directives: [
                              {
                                action: {
                                  action: "resolveThenQueue",
                                  followUp: {
                                    type: "triggered",
                                    activation: { timing: [] },
                                    directives: [
                                      {
                                        action: {
                                          action: "discard",
                                          count: Number.parseInt(discardCount!, 10),
                                        },
                                      },
                                    ],
                                    sourceText: "Choose 1 card from your hand to discard.",
                                  },
                                },
                              },
                            ],
                          },
                          { label: "Do not discard", directives: [controllerDeploy] },
                        ],
                      },
                    ],
                    elseDirectives: [controllerDeploy],
                  },
                ],
                sourceText:
                  "You may discard 1. If you don't, your opponent may deploy a qualifying Unit.",
              },
            },
          },
        ],
        sourceText: trimmed,
      };
    }

    const copyKeywordsFromTrashM = effectBody.match(
      /^Choose 1 Unit card with ((?:<[\w\s-]+>\/?)+) from your trash\. During this turn, this Unit gets AP\+(\d+) and all ((?:<[\w\s-]+>\/?)+) on that Unit card\.?$/i,
    );
    if (copyKeywordsFromTrashM) {
      const [, sourceKeywordText, apAmount, copiedKeywordText] = copyKeywordsFromTrashM;
      const sourceKeywords = Array.from(sourceKeywordText!.matchAll(/<([^>]+)>/g))
        .map((match) => parseKeywordEffectName(match[1].trim()))
        .filter((keyword): keyword is NonNullable<typeof keyword> => keyword !== undefined);
      const copiedKeywords = Array.from(copiedKeywordText!.matchAll(/<([^>]+)>/g))
        .map((match) => parseKeywordEffectName(match[1].trim()))
        .filter((keyword): keyword is NonNullable<typeof keyword> => keyword !== undefined);
      if (
        sourceKeywords.length > 0 &&
        sourceKeywords.length === copiedKeywords.length &&
        sourceKeywords.every((keyword, index) => keyword === copiedKeywords[index])
      ) {
        const source = {
          owner: "friendly" as const,
          cardType: "unit" as const,
          zone: "trash" as const,
          count: 1,
          attributeFilters: [
            {
              attribute: "or" as const,
              filters: sourceKeywords.map((value) => ({
                attribute: "keyword" as const,
                comparison: "includes" as const,
                value,
              })),
            },
          ],
        };
        return {
          type: effectType,
          activation: buildActivation(),
          ...(header.cost ? { cost: header.cost } : {}),
          directives: [
            {
              action: {
                action: "statModifier",
                stat: "ap",
                amount: Number.parseInt(apAmount!, 10),
                duration: "thisTurn",
                target: { owner: "self", cardType: "unit" },
              },
            },
            {
              action: {
                action: "copyKeywordEffects",
                duration: "thisTurn",
                source,
                target: { owner: "self", cardType: "unit" },
              },
            },
          ],
          sourceText: trimmed,
        };
      }
    }

    const optionalDiscardThenDeckTutorM = effectBody.match(
      /^You may discard (\d+)\. If you do, (Look at the top \d+ cards of your deck\. You may reveal \d+ .+? among them and add it to your hand\. Return the remaining cards randomly to the bottom of your deck\.)$/i,
    );
    if (optionalDiscardThenDeckTutorM) {
      const [, discardCount, deckTutorText] = optionalDiscardThenDeckTutorM;
      const deckTutorDirectives = parseSteps(deckTutorText!);
      const followUpSourceText = deckTutorText!.replace(/^./, (value) => value.toUpperCase());
      if (deckTutorDirectives.length === 1) {
        return {
          type: effectType,
          activation: {
            ...buildActivation(),
            conditions: [
              ...activationConditions,
              {
                type: "cardInZone",
                owner: "friendly",
                zone: "deck",
                comparison: "gte",
                count: 1,
              },
            ],
          },
          directives: [
            {
              action: {
                action: "resolveThenQueue",
                first: { action: "discard", count: Number.parseInt(discardCount!, 10) },
                followUp: {
                  type: "triggered",
                  activation: { timing: [] },
                  directives: deckTutorDirectives,
                  sourceText: followUpSourceText,
                },
              },
              optional: true,
            },
          ],
          sourceText: trimmed,
        };
      }
    }

    const optionalDiscardThenReturnLowestM = effectBody.match(
      /^You may discard (\d+)\. If you do, choose 1 enemy Unit with the lowest Lv\. Return it to the bottom of its owner['’]s deck\.?$/i,
    );
    if (optionalDiscardThenReturnLowestM) {
      const discardCount = Number.parseInt(optionalDiscardThenReturnLowestM[1]!, 10);
      const target = {
        owner: "opponent" as const,
        cardType: "unit" as const,
        count: 1,
        lowest: "level" as const,
      };
      return {
        type: effectType,
        activation: buildActivation(),
        directives: [
          {
            optional: true,
            action: {
              action: "resolveThenQueue",
              first: { action: "discard", count: discardCount },
              followUp: {
                type: "triggered",
                activation: { timing: [] },
                directives: [{ action: { action: "returnToDeck", position: "bottom", target } }],
                sourceText:
                  "If you do, choose 1 enemy Unit with the lowest Lv. Return it to the bottom of its owner's deck.",
              },
            },
          },
        ],
        sourceText: trimmed,
      };
    }

    const exileTrashThenEnemyUnitM = effectBody.match(
      /^(If you are attacking the enemy player, )?(You may )?Choose (.+?) from your trash\. Exile (?:it|them) from the game\. If you do, (choose 1 enemy Unit(?:\/Base)?(?: that is Lv\.\d+ or lower)?\. (?:Destroy it|Deal \d+ damage to it)\.)$/i,
    );
    if (exileTrashThenEnemyUnitM) {
      const [, attackingPlayerText, optionalText, trashTargetText, followUpText] =
        exileTrashThenEnemyUnitM;
      const firstTarget = parseTargetFilter(`${trashTargetText} from your trash`);
      const enemyTargetText = followUpText!
        .replace(/^choose\s+/i, "")
        .replace(/\. (?:destroy it|deal \d+ damage to it)\.$/i, "");
      const enemyTarget = parseTargetFilter(enemyTargetText);
      const followUpDirectives = parseSteps(followUpText!);
      if (followUpDirectives.length === 1) {
        const enemyTargetCondition = {
          owner: "opponent" as const,
          cardType: enemyTarget.cardType,
          comparison: "gte" as const,
          count: 1,
          ...(enemyTarget.attributeFilters
            ? { attributeFilters: enemyTarget.attributeFilters }
            : {}),
        };
        const enemyEligibility = (
          Array.isArray(enemyTarget.cardType) && enemyTarget.cardType.includes("base")
            ? {
                type: "or" as const,
                conditions: [
                  {
                    type: "cardInZone" as const,
                    ...enemyTargetCondition,
                    zone: "battleArea" as const,
                    cardType: "unit" as const,
                  },
                  {
                    type: "cardInZone" as const,
                    ...enemyTargetCondition,
                    zone: "baseSection" as const,
                    cardType: "base" as const,
                  },
                ],
              }
            : {
                type: "cardInZone" as const,
                ...enemyTargetCondition,
                zone: "battleArea" as const,
              }
        ) as EffectCondition;
        return {
          type: effectType,
          activation: {
            ...buildActivation(),
            conditions: [
              ...activationConditions,
              ...(attackingPlayerText ? [{ type: "isAttackingPlayer" as const }] : []),
              enemyEligibility,
            ],
          },
          directives: [
            {
              action: {
                action: "resolveThenQueue",
                first: {
                  action: "exile",
                  target: { ...firstTarget, owner: "friendly", zone: "trash" },
                },
                followUp: {
                  type: "triggered",
                  activation: { timing: [] },
                  directives: followUpDirectives,
                  sourceText: `If you do, ${followUpText!.replace(/^./, (value) => value.toLowerCase())}`,
                },
              },
              ...(optionalText ? { optional: true } : {}),
            },
          ],
          sourceText: trimmed,
        };
      }
    }

    const restBaseThenReduceEnemyApM = effectBody.match(
      /^Choose 1 active friendly Base\. Rest it\. If you do, choose 1 enemy Unit that is Lv\.(\d+) or lower\. It gets AP-(\d+) during this battle\.?$/i,
    );
    if (restBaseThenReduceEnemyApM) {
      const [, maximumLevel, amount] = restBaseThenReduceEnemyApM;
      const enemyTarget = {
        owner: "opponent" as const,
        cardType: "unit" as const,
        count: 1,
        attributeFilters: [
          {
            attribute: "level" as const,
            comparison: "lte" as const,
            value: Number.parseInt(maximumLevel!, 10),
          },
        ],
      };
      return {
        type: effectType,
        activation: {
          ...buildActivation(),
          conditions: [
            ...activationConditions,
            {
              type: "cardInZone",
              owner: "opponent",
              zone: "battleArea",
              cardType: "unit",
              comparison: "gte",
              count: 1,
              attributeFilters: enemyTarget.attributeFilters,
            },
          ],
        },
        directives: [
          {
            action: {
              action: "resolveThenQueue",
              first: {
                action: "rest",
                target: { owner: "friendly", cardType: "base", state: "active", count: 1 },
              },
              followUp: {
                type: "triggered",
                activation: { timing: [] },
                directives: [
                  {
                    action: {
                      action: "statModifier",
                      stat: "ap",
                      amount: -Number.parseInt(amount!, 10),
                      duration: "thisBattle",
                      target: enemyTarget,
                    },
                  },
                ],
                sourceText: `If you do, choose 1 enemy Unit that is Lv.${maximumLevel} or lower. It gets AP-${amount} during this battle.`,
              },
            },
          },
        ],
        sourceText: trimmed,
      };
    }

    const destroyOtherUnitThenDamageM = effectBody.match(
      /^You may choose 1 of your other Units\. Destroy it\. If you do, choose 1 enemy Unit that is Lv\.(\d+) or lower\. Deal (\d+) damage to it\.?$/i,
    );
    if (destroyOtherUnitThenDamageM) {
      const [, maximumLevel, amount] = destroyOtherUnitThenDamageM;
      const enemyTarget = {
        owner: "opponent" as const,
        cardType: "unit" as const,
        count: 1,
        attributeFilters: [
          {
            attribute: "level" as const,
            comparison: "lte" as const,
            value: Number.parseInt(maximumLevel!, 10),
          },
        ],
      };
      return {
        type: effectType,
        activation: {
          ...buildActivation(),
          conditions: [
            ...activationConditions,
            {
              type: "cardInZone",
              owner: "opponent",
              zone: "battleArea",
              cardType: "unit",
              comparison: "gte",
              count: 1,
              attributeFilters: enemyTarget.attributeFilters,
            },
          ],
        },
        directives: [
          {
            action: {
              action: "resolveThenQueue",
              first: {
                action: "destroy",
                target: {
                  owner: "friendly",
                  cardType: "unit",
                  count: 1,
                  excludeSource: true,
                },
              },
              followUp: {
                type: "triggered",
                activation: { timing: [] },
                directives: [
                  {
                    action: {
                      action: "dealDamage",
                      amount: Number.parseInt(amount!, 10),
                      target: enemyTarget,
                    },
                  },
                ],
                sourceText: `If you do, choose 1 enemy Unit that is Lv.${maximumLevel} or lower. Deal ${amount} damage to it.`,
              },
            },
            optional: true,
          },
        ],
        sourceText: trimmed,
      };
    }

    const linkedTurnSelfStatM = effectBody.match(
      /^This Unit gets (AP|HP)([+-]\d+) during your turn\.?$/i,
    );
    if (
      linkedTurnSelfStatM &&
      header.conditions.some((condition) => condition.type === "duringLink")
    ) {
      return {
        type: "constant",
        activation: {
          ...buildActivation(),
          conditions: [...activationConditions, { type: "isTurn", whose: "friendly" }],
        },
        directives: [
          {
            action: {
              action: "statModifier",
              stat: linkedTurnSelfStatM[1].toLowerCase() as "ap" | "hp",
              amount: Number.parseInt(linkedTurnSelfStatM[2], 10),
              duration: "permanent",
              target: { owner: "self", cardType: "unit" },
            },
          },
        ],
        sourceText: trimmed,
      };
    }

    const pilotGatedDamageReductionM = effectBody.match(
      /^If you have an? \(([^)]+)\) Pilot in play, when this Unit receives damage from an enemy, reduce it by (\d+)\.?$/i,
    );
    if (pilotGatedDamageReductionM) {
      return {
        type: "constant",
        activation: {
          ...buildActivation(),
          conditions: [
            ...activationConditions,
            {
              type: "cardInZone",
              owner: "friendly",
              zone: "battleArea",
              cardType: "pilot",
              hasTrait: pilotGatedDamageReductionM[1].toLowerCase(),
              comparison: "gte",
              count: 1,
            },
          ],
        },
        directives: [
          {
            action: {
              action: "reduceNextDamage",
              amount: Number.parseInt(pilotGatedDamageReductionM[2], 10),
              target: { owner: "self", cardType: "unit" },
              source: "enemy",
              duration: "permanent",
            },
          },
        ],
        sourceText: trimmed,
      };
    }

    // A condition-only header can qualify an embedded trigger, for example:
    // “【During Pair】During your turn, when this Unit destroys ...”. Preserve
    // the header and leading-turn gates while letting the when-clause own the
    // event timing and body.
    if (header.timings.length === 0 && /^(?:when\b|at the end of your turn\b)/i.test(effectBody)) {
      const triggered = parseFreeStandingWhenEffect(effectBody);
      if (triggered) {
        const headerActivation = buildActivation();
        const pairedSupportTraitCondition =
          triggered.activation.timing?.includes("onSupportUsed") &&
          header.conditions.some((condition) => condition.type === "duringPair") &&
          header.pilotQualifier?.hasTrait
            ? [
                {
                  type: "selfPairedPilotHasTrait" as const,
                  trait: header.pilotQualifier.hasTrait,
                },
              ]
            : [];
        return {
          ...triggered,
          activation: {
            ...triggered.activation,
            conditions: [
              ...header.conditions,
              ...pairedSupportTraitCondition,
              ...(leadingTurn.condition ? [leadingTurn.condition] : []),
              ...(triggered.activation.conditions ?? []),
            ],
            ...(header.oncePerTurn
              ? {
                  restrictions: [
                    ...(triggered.activation.restrictions ?? []),
                    { type: "oncePerTurn" as const },
                  ],
                }
              : {}),
            ...(headerActivation.qualification && pairedSupportTraitCondition.length === 0
              ? { qualification: headerActivation.qualification }
              : {}),
          },
          ...(header.cost ? { cost: header.cost } : {}),
          sourceText: trimmed,
        };
      }
    }

    if (header.timings.length === 0 && /^while\b/i.test(effectBody)) {
      const constant = parseConstantEffect(effectBody, trimmed);
      if (constant) {
        const headerActivation = buildActivation();
        return {
          ...constant,
          activation: {
            ...constant.activation,
            conditions: [...activationConditions, ...(constant.activation.conditions ?? [])],
            ...(header.oncePerTurn
              ? {
                  restrictions: [
                    ...(constant.activation.restrictions ?? []),
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

    const burstPilotUnitM = isBurst
      ? effectBody.match(
          /^Add this card to your hand\. If there are (\d+) or more \(([^)]+)\) cards in your trash, you may deploy it as an \(AP(\d+)[・·･]HP(\d+)\) Unit instead\. \(Don't treat it as a Pilot\.\)$/i,
        )
      : null;
    if (burstPilotUnitM) {
      return {
        type: "triggered",
        activation: buildActivation(),
        directives: [
          { action: { action: "addSelfToHand" } },
          {
            condition: {
              type: "cardInZone",
              owner: "friendly",
              zone: "trash",
              comparison: "gte",
              count: Number.parseInt(burstPilotUnitM[1], 10),
              hasTrait: burstPilotUnitM[2].toLowerCase(),
            },
            thenDirectives: [
              {
                action: {
                  action: "deploySelfAsUnit",
                  ap: Number.parseInt(burstPilotUnitM[3], 10),
                  hp: Number.parseInt(burstPilotUnitM[4], 10),
                },
                optional: true,
              },
            ],
          },
        ],
        sourceText: trimmed,
      };
    }

    // An activated ability whose leading condition governs its whole sentence
    // must be unavailable when the condition is false. In particular, the
    // trailing sentence in “If …, set this Unit as active. It can't attack …”
    // is part of the same conditional resolution, not an unconditional effect.
    if (isActivated) {
      const leadingIf = effectBody.match(/^if\s+(.+?),\s*(.*)$/is);
      const isWholeAbilityGate =
        leadingIf &&
        (/^set this Unit as active\b/i.test(leadingIf[2]) ||
          (/^there are \d+ or more .*cards? in your trash$/i.test(leadingIf[1]) &&
            /^choose\b/i.test(leadingIf[2])) ||
          /^it is your opponent'?s turn$/i.test(leadingIf[1]) ||
          /^you have (?:a|an|\d+) Unit with "[^"]+" in its card name that is Lv\.?\s*\d+ or higher in play$/i.test(
            leadingIf[1],
          ));
      if (isWholeAbilityGate && leadingIf) {
        const condition = parseCondition(leadingIf[1]);
        if (condition) {
          activationConditions.push(condition);
          effectBody = leadingIf[2].trim();
        }
      }
    }

    const optionalTraitTrashExileRestM = effectBody.match(
      /^You may choose (\d+) \(([^)]+)\) cards? from your trash\. Exile them from the game\. If you do, choose 1 enemy Unit that is Lv\.\d+ or lower\. Rest it\.?$/i,
    );
    if (optionalTraitTrashExileRestM) {
      activationConditions.push({
        type: "cardInZone",
        owner: "friendly",
        zone: "trash",
        comparison: "gte",
        count: Number.parseInt(optionalTraitTrashExileRestM[1], 10),
        hasTrait: optionalTraitTrashExileRestM[2].toLowerCase(),
      });
    }

    const sharedBattleDestructionDrawM = destroyedWithBattleDamage
      ? effectBody.match(/^you and the player who destroyed this Unit draw (\d+)\.?$/i)
      : undefined;
    let steps = sharedBattleDestructionDrawM
      ? [
          {
            action: {
              action: "draw" as const,
              count: Number.parseInt(sharedBattleDestructionDrawM[1]!, 10),
            },
          },
          {
            action: {
              action: "drawEventDestroyer" as const,
              count: Number.parseInt(sharedBattleDestructionDrawM[1]!, 10),
            },
          },
        ]
      : parseSteps(effectBody);
    if (
      activationConditions.some((condition) => condition.type === "duringLink") &&
      activationConditions.some((condition) => condition.type === "linkedUnitHasTrait")
    ) {
      steps = steps.map((directive) => {
        if (
          "action" in directive &&
          (directive.action.action === "statModifier" ||
            directive.action.action === "grantKeyword") &&
          directive.action.target.owner === "self" &&
          directive.action.target.cardType === undefined
        ) {
          return {
            ...directive,
            action: {
              ...directive.action,
              target: { ...directive.action.target, cardType: "unit" as const },
            },
          };
        }
        return directive;
      });
    }
    if (header.conditions.some((condition) => condition.type === "duringLink")) {
      steps = steps.map((directive) => {
        if (
          "action" in directive &&
          directive.action.action === "grantTrait" &&
          directive.action.duration === "permanent"
        ) {
          return {
            ...directive,
            action: { ...directive.action, duration: "whileLinked" as const },
          };
        }
        return directive;
      });
    }
    if (header.developmentCount !== undefined) {
      steps = [
        {
          action: {
            action: "exile",
            target: {
              owner: "friendly",
              zone: "trash",
              count: header.developmentCount,
              attributeFilters: [
                {
                  attribute: "trait",
                  comparison: "includes",
                  value: "g generation",
                },
              ],
            },
          },
          optional: true,
        },
        ...steps.map((directive) =>
          "action" in directive ? { ...directive, dependsOnPrevious: true } : directive,
        ),
      ];
    }

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
            conditions: [
              ...header.conditions,
              ...(leadingTurn.condition ? [leadingTurn.condition] : []),
              ...(triggered.activation.conditions ?? []),
            ],
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

  if (/^At the end of your turn\b/i.test(trimmed)) {
    return parseFreeStandingWhenEffect(trimmed);
  }

  // A leading condition on a hand-only cost modifier controls whether that
  // constant applies; it is not a resolution-time branch on an already
  // playable card.
  const conditionalHandCostM = trimmed.match(
    /^If (.+?),\s*(this card in your hand gets cost\s*-\d+\.?)$/is,
  );
  if (conditionalHandCostM) {
    const condition = parseCondition(conditionalHandCostM[1]);
    const directives = parseSteps(conditionalHandCostM[2]);
    if (condition && directives.length > 0) {
      return {
        type: "constant",
        activation: { conditions: [condition] },
        directives,
        sourceText: trimmed,
      };
    }
  }

  const restedUnitsGrantKeywordM = trimmed.match(
    /^If there are (\d+) or more other rested Units in play, this Unit gains <([A-Za-z-]+)(?:\s+(\d+))?>\.?(?:\s+\(.+\))?$/i,
  );
  if (restedUnitsGrantKeywordM) {
    const [, count, keywordName, keywordValue] = restedUnitsGrantKeywordM;
    const keyword = parseKeywordEffectName(keywordName!);
    if (keyword) {
      return {
        type: "constant",
        activation: {
          conditions: [
            {
              type: "unitCount",
              owner: "any",
              comparison: "gte",
              count: Number.parseInt(count!, 10),
              state: "rested",
              excludeSelf: true,
            },
          ],
        },
        directives: [
          {
            action: {
              action: "grantKeyword",
              keyword,
              ...(keywordValue ? { keywordValue: Number.parseInt(keywordValue, 10) } : {}),
              duration: "permanent",
              target: { owner: "self", cardType: "unit" },
            },
          },
        ],
        sourceText: trimmed,
      };
    }
  }

  // Free-standing constant: "This Unit may .../can't ..." without a timing bracket
  const selfAndNamedUnitsApM = trimmed.match(
    /^This Unit and all your Units with "([^"]+)" or "([^"]+)" in their card name get AP\+(\d+)\.?$/i,
  );
  if (selfAndNamedUnitsApM) {
    const [, firstName, secondName, amount] = selfAndNamedUnitsApM;
    return {
      type: "constant",
      activation: {},
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: Number.parseInt(amount!, 10),
            duration: "permanent",
            target: { owner: "self", cardType: "unit" },
          },
        },
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: Number.parseInt(amount!, 10),
            duration: "permanent",
            target: {
              owner: "friendly",
              cardType: "unit",
              excludeSource: true,
              attributeFilters: [
                {
                  attribute: "or",
                  filters: [
                    { attribute: "name", comparison: "includes", value: firstName! },
                    { attribute: "name", comparison: "includes", value: secondName! },
                  ],
                },
              ],
            },
          },
        },
      ],
      sourceText: trimmed,
    };
  }

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

  // Other free-standing continuous effects can begin with a verb (for
  // example, "Reduce the cost of this card in your hand …"). Preserve them
  // when the action parser recognized a concrete directive; otherwise keep
  // the lossless fallback below.
  const freeStandingSteps = parseSteps(trimmed);
  if (
    freeStandingSteps.length > 0 &&
    freeStandingSteps.every(
      (directive) => !("action" in directive) || directive.action.action !== "unparsedText",
    )
  ) {
    return {
      type: "constant",
      activation: {},
      directives: freeStandingSteps,
      sourceText: trimmed,
    };
  }

  return {
    type: "constant",
    activation: {},
    directives: [{ action: { action: "unparsedText", text: trimmed } }],
    sourceText: trimmed,
  };
}
