import type { AttributeFilter, TargetFilter } from "@tcg/gundam-types";
import { parseCardType, parseKeywordEffectName } from "./helpers.ts";

/**
 * Build a TargetFilter from natural-language target description.
 * Examples:
 *   "1 rested enemy Unit with 5 or less HP"
 *   "1 friendly (ZAFT) Unit with 5 or more AP"
 *   "all enemy Units other than Link Units"
 *   "1 enemy Link Unit"
 */
export function parseTargetFilter(desc: string): TargetFilter {
  const pairedPilotM = desc.match(
    /^(?:choose\s+)?(?:\d+\s+)?Pilot paired with an enemy Unit that is Lv\.?\s*(\d+) or lower$/i,
  );
  if (pairedPilotM) {
    return {
      owner: "opponent",
      cardType: "pilot",
      count: 1,
      attributeFilters: [
        {
          attribute: "pairedUnitLevel",
          comparison: "lte",
          value: Number.parseInt(pairedPilotM[1], 10),
        },
      ],
    };
  }
  const unitPairedWithTraitPilotM = desc.match(
    /^(?:choose\s+)?(\d+)\s+(?:(?:of your|friendly)\s+)?Units? paired with an? \(([^)]+)\) Pilot\.?$/i,
  );
  if (unitPairedWithTraitPilotM) {
    return {
      owner: "friendly",
      cardType: "unit",
      count: Number.parseInt(unitPairedWithTraitPilotM[1], 10),
      attributeFilters: [
        {
          attribute: "pairedPilotTrait",
          comparison: "includes",
          value: unitPairedWithTraitPilotM[2].toLowerCase(),
        },
      ],
    };
  }
  if (/enemy Base\/enemy Shield this Unit is battling/i.test(desc)) {
    return {
      owner: "opponent",
      attributeFilters: [
        {
          attribute: "or",
          filters: [
            { attribute: "zone", comparison: "eq", value: "baseSection" },
            { attribute: "zone", comparison: "eq", value: "shieldArea" },
          ],
        },
      ],
      isBattling: true,
    };
  }

  // Extract and peel off any "battling [descriptor]" sub-clause before the
  // rest of the rules run, so that attributes inside the sub-clause
  // (keywords, Lv., trait parens, etc.) don't leak onto the outer filter.
  //
  // Phrasings handled:
  //   "battling this Unit" / "battling this card" → isBattling: true
  //   "battling a|an|the <descriptor singular>"   → isBattling: { opponentMatches: <sub> }
  // Plural ("battling enemy Units") is not expressible by the predicate
  // (it narrows one combatant, not a set); we skip emission and leave the
  // clause in place so a human notices. See isBattlingExtraction below.
  // Parenthesized keyword reminder text is explanatory, not a trait filter.
  // Preserve actual trait markers such as `(Titans)` while removing only a
  // trailing sentence-like reminder beginning with While/When.
  const withoutReminderText = desc.replace(
    /\s+\(\s*(?:while|when|at the end)\s+[^)]*[.!?]\s*\)\s*$/i,
    "",
  );
  const extraction = extractBattlingClause(withoutReminderText);
  const workingDesc = extraction.stripped;
  const lower = workingDesc.toLowerCase();
  const filter: TargetFilter = { owner: "any" };

  // Owner
  if (lower.includes("opponent")) filter.owner = "opponent";
  else if (lower.includes("enemy")) filter.owner = "opponent";
  else if (/belonging to another player/i.test(workingDesc)) filter.owner = "opponent";
  else if (
    lower.includes("friendly") ||
    lower.includes("your") ||
    lower.match(/\bone of (your|my)\b/)
  )
    filter.owner = "friendly";
  else if (
    lower.includes("this unit") ||
    lower.includes("this base") ||
    lower.includes("this card")
  )
    filter.owner = "self";
  else if (/^it\b/.test(lower.trim())) filter.owner = "self";

  // Card type
  if (/\bUnits?\/Bases?\b/i.test(workingDesc)) filter.cardType = ["unit", "base"];
  else {
    const ct = parseCardType(workingDesc);
    if (ct) filter.cardType = ct;
  }

  // Count — "all" → "all", "1 to 2" → {min,max}, "1" → number
  if (/^all\b/i.test(workingDesc.trim())) {
    filter.count = "all";
  } else {
    const countM = workingDesc.match(/(\d+)\s+to\s+(\d+)/);
    if (countM) filter.count = { min: parseInt(countM[1]), max: parseInt(countM[2]) };
    else {
      const singleCountM = workingDesc.match(/^(?:choose\s+)?(\d+)\s/i);
      if (singleCountM) filter.count = parseInt(singleCountM[1]);
    }
  }

  // State
  const states: Array<"active" | "rested" | "damaged" | "undamaged"> = [];
  if (lower.includes("undamaged")) states.push("undamaged");
  else if (lower.includes("damaged")) states.push("damaged");
  if (lower.includes("active") && !lower.includes("set it as active")) states.push("active");
  if (lower.includes("rested")) states.push("rested");
  if (states.length === 1) filter.state = states[0];
  else if (states.length > 1) filter.state = states;
  if (/\bis being attacked\b/i.test(workingDesc)) filter.isBeingAttacked = true;

  // Attribute filters (numeric and string predicates)
  const attributeFilters: AttributeFilter[] = [];

  // Color — "1 of your green Units", "a blue Command card", etc.
  // Keep this tied to a card noun so incidental color words elsewhere in a
  // sentence do not become target restrictions.
  const colorM = workingDesc.match(
    /\b(blue|green|red|white|purple)\s+(?!Base Team\b)(?:\([^)]+\)\s+)?(?:[A-Za-z-]+\s+)*(?:Units?|Bases?|Pilots?|Command cards?|cards?)\b/i,
  );
  if (colorM) {
    attributeFilters.push({
      attribute: "color",
      comparison: "eq",
      value: colorM[1].toLowerCase(),
    });
  }

  const excludedNameM = workingDesc.match(/without "([^"]+)" in its card name/i);
  if (excludedNameM)
    attributeFilters.push({
      attribute: "name",
      comparison: "excludes",
      value: excludedNameM[1],
    });
  const includedNameM = workingDesc.match(/with "([^"]+)" in its card name/i);
  if (includedNameM)
    attributeFilters.push({
      attribute: "name",
      comparison: "includes",
      value: includedNameM[1],
    });

  // HP filter
  const hpMostM = workingDesc.match(/(\d+)\s+or\s+less\s+HP/i);
  if (hpMostM)
    attributeFilters.push({ attribute: "hp", comparison: "lte", value: parseInt(hpMostM[1]) });
  const hpLeastM = workingDesc.match(/(\d+)\s+or\s+more\s+HP/i);
  if (hpLeastM)
    attributeFilters.push({ attribute: "hp", comparison: "gte", value: parseInt(hpLeastM[1]) });
  const hpExactM = workingDesc.match(/with\s+(\d+)\s+HP/i);
  if (hpExactM)
    // Units at 0 HP leave play, so the printed "with 1 HP" threshold is
    // represented by the engine's inclusive surviving-HP predicate.
    attributeFilters.push({ attribute: "hp", comparison: "lte", value: parseInt(hpExactM[1]) });

  // AP filter
  const apMostM = workingDesc.match(/(\d+)\s+or\s+less\s+AP/i);
  if (apMostM)
    attributeFilters.push({ attribute: "ap", comparison: "lte", value: parseInt(apMostM[1]) });
  const apLeastM = workingDesc.match(/(\d+)\s+or\s+more\s+AP/i);
  if (apLeastM)
    attributeFilters.push({ attribute: "ap", comparison: "gte", value: parseInt(apLeastM[1]) });

  // Level filter
  const lvMostM = workingDesc.match(/Lv\.?\s*(\d+)\s+or\s+lower/i);
  if (lvMostM)
    attributeFilters.push({ attribute: "level", comparison: "lte", value: parseInt(lvMostM[1]) });
  const lvLeastM = workingDesc.match(/Lv\.?\s*(\d+)\s+or\s+higher/i);
  if (lvLeastM)
    attributeFilters.push({ attribute: "level", comparison: "gte", value: parseInt(lvLeastM[1]) });
  const lvExactM = workingDesc.match(
    /(?:that is|whose Lv\.? is)?\s*Lv\.?\s*(\d+)(?!\s+or\s+(?:lower|higher))/i,
  );
  if (lvExactM)
    attributeFilters.push({ attribute: "level", comparison: "eq", value: parseInt(lvExactM[1]) });

  // A printed "Lv.N or lower or has M or less AP" is a disjunction, not
  // two simultaneous constraints. Keep non-numeric filters outside it.
  if (/\bor has\b/i.test(workingDesc)) {
    const numericFilters = attributeFilters.filter(
      (filter) =>
        filter.attribute === "level" || filter.attribute === "ap" || filter.attribute === "hp",
    );
    if (numericFilters.length >= 2) {
      attributeFilters.splice(
        0,
        attributeFilters.length,
        ...attributeFilters.filter((filter) => !numericFilters.includes(filter)),
        { attribute: "or", filters: numericFilters },
      );
    }
  }
  // Source-stat comparisons — "equal to or lower than this Unit['s Lv./AP/HP]",
  // "less than this Unit's AP", etc. The RHS is emitted as a SourceStatRef
  // sentinel; the engine resolves it against the source's stat (or, for
  // pilot-resident effects, the paired unit's stat per rule 3-3-9-1).
  // The stat defaults from context: a "Lv."/"AP"/"HP" keyword to the left
  // of "this Unit" names both the candidate's attribute and the source's
  // stat to compare against.
  const sourceStatPatterns: Array<{
    re: RegExp;
    attribute: "level" | "ap" | "hp";
    comparison: "eq" | "lt" | "lte" | "gt" | "gte";
    stat: "level" | "ap" | "hp";
  }> = [
    // "Lv. [is] equal to or lower than this Unit[('s Lv.)]"
    {
      re: /lv\.?\s+(?:is\s+)?equal to or lower than this unit/i,
      attribute: "level",
      comparison: "lte",
      stat: "level",
    },
    {
      re: /lv\.?\s+(?:is\s+)?equal to or higher than this unit/i,
      attribute: "level",
      comparison: "gte",
      stat: "level",
    },
    {
      re: /lv\.?\s+(?:is\s+)?(?:less|lower) than this unit/i,
      attribute: "level",
      comparison: "lt",
      stat: "level",
    },
    {
      re: /lv\.?\s+(?:is\s+)?(?:greater|higher|more) than this unit/i,
      attribute: "level",
      comparison: "gt",
      stat: "level",
    },
    {
      re: /lv\.?\s+(?:is\s+)?equal to this unit/i,
      attribute: "level",
      comparison: "eq",
      stat: "level",
    },
    // AP
    {
      re: /ap\s+(?:is\s+)?(?:less|lower) than this unit(?:'s ap)?/i,
      attribute: "ap",
      comparison: "lt",
      stat: "ap",
    },
    {
      re: /ap\s+(?:is\s+)?(?:greater|higher|more) than this unit(?:'s ap)?/i,
      attribute: "ap",
      comparison: "gt",
      stat: "ap",
    },
    {
      re: /ap\s+(?:is\s+)?equal to or (?:lower|less) than this unit(?:'s ap)?/i,
      attribute: "ap",
      comparison: "lte",
      stat: "ap",
    },
    {
      re: /ap\s+(?:is\s+)?equal to or higher than this unit(?:'s ap)?/i,
      attribute: "ap",
      comparison: "gte",
      stat: "ap",
    },
    {
      re: /ap\s+(?:is\s+)?equal to this unit(?:'s ap)?/i,
      attribute: "ap",
      comparison: "eq",
      stat: "ap",
    },
    // HP
    {
      re: /hp\s+(?:is\s+)?(?:less|lower) than this unit(?:'s hp)?/i,
      attribute: "hp",
      comparison: "lt",
      stat: "hp",
    },
    {
      re: /hp\s+(?:is\s+)?(?:greater|higher|more) than this unit(?:'s hp)?/i,
      attribute: "hp",
      comparison: "gt",
      stat: "hp",
    },
    {
      re: /hp\s+(?:is\s+)?equal to or lower than this unit(?:'s hp)?/i,
      attribute: "hp",
      comparison: "lte",
      stat: "hp",
    },
    {
      re: /hp\s+(?:is\s+)?equal to or higher than this unit(?:'s hp)?/i,
      attribute: "hp",
      comparison: "gte",
      stat: "hp",
    },
    {
      re: /hp\s+(?:is\s+)?equal to this unit(?:'s hp)?/i,
      attribute: "hp",
      comparison: "eq",
      stat: "hp",
    },
  ];
  for (const p of sourceStatPatterns) {
    if (p.re.test(lower)) {
      attributeFilters.push({
        attribute: p.attribute,
        comparison: p.comparison,
        value: { ref: "source", stat: p.stat },
      });
      break;
    }
  }

  // Trait — "(Operation Meteor)", "(ZAFT)", etc.
  // Support trait-OR groups: "(Zeon)/(Neo Zeon)" or "(Zeon) OR (Neo Zeon)".
  // Collect consecutive parenthesised traits joined by "/" or the literal
  // word "or" and emit a single `attribute: "or"` disjunction. Falls back
  // to a single trait predicate when only one parenthesised trait is
  // present.
  const traitGroupRe = /\(([^)·\d][^)]*)\)(?:\s*(?:\/|or)\s*\(([^)·\d][^)]*)\))+/i;
  const traitGroupM = workingDesc.match(traitGroupRe);
  if (traitGroupM) {
    // Re-scan the whole matched span to collect every trait in the group.
    const span = traitGroupM[0];
    const traits: string[] = [];
    const single = /\(([^)·\d][^)]*)\)/g;
    let m: RegExpExecArray | null;
    while ((m = single.exec(span)) !== null) {
      if (!m[1].match(/^(AP|HP)\d/)) traits.push(m[1].toLowerCase());
    }
    if (traits.length >= 2) {
      attributeFilters.push({
        attribute: "or",
        filters: traits.map((t) => ({
          attribute: "trait" as const,
          comparison: "includes" as const,
          value: t,
        })),
      });
    } else if (traits.length === 1) {
      // Fallback: re-scan filtered everything but one trait — emit a
      // plain single-trait predicate rather than nothing.
      attributeFilters.push({
        attribute: "trait",
        comparison: "includes",
        value: traits[0],
      });
    }
  } else {
    const traitM = workingDesc.match(/\(([^)·\d][^)]*)\)/);
    if (traitM && !traitM[1].match(/^(AP|HP)\d/))
      attributeFilters.push({
        attribute: "trait",
        comparison: "includes",
        value: traitM[1].toLowerCase(),
      });
  }

  const effectTimingM = workingDesc.match(/with (?:a )?【(Destroyed)】 effect/i);
  if (effectTimingM) {
    attributeFilters.push({
      attribute: "effectTiming",
      comparison: "includes",
      value: effectTimingM[1].toLowerCase() as "destroyed",
    });
  }

  if (attributeFilters.length > 0) filter.attributeFilters = attributeFilters;

  // Zone — "this card in your hand" targets self while in the Hand zone
  if (lower.includes("in your hand") && lower.includes("this card")) {
    filter.owner = "self";
    filter.zone = "hand";
  }
  if (lower.includes("in your trash") && lower.includes("this card")) {
    filter.owner = "self";
    filter.zone = "trash";
  }
  if (lower.includes("from your trash")) {
    filter.zone = "trash";
  }
  if (
    filter.cardType === "resource" &&
    /\b(?:your|friendly) Resources?\b/i.test(workingDesc) &&
    filter.zone === undefined
  ) {
    filter.zone = "resourceArea";
  }

  // Link unit
  if (/other than Link Units?/i.test(workingDesc)) filter.isLinkUnit = false;
  else if (lower.includes("link unit") || lower.includes("linked unit")) filter.isLinkUnit = true;

  // Token
  if (lower.includes("token")) filter.isToken = true;
  if (lower.includes("other than unit tokens")) filter.isToken = false;

  if (/highest Lv\.?/i.test(workingDesc)) filter.highest = "level";
  if (/lowest HP/i.test(workingDesc)) filter.lowest = "hp";

  if (/no (?:a )?paired Pilot|has no Pilot paired with it/i.test(workingDesc)) {
    (filter.attributeFilters ??= []).push({ attribute: "paired", comparison: "eq", value: false });
  }
  if (/paired with a Pilot/i.test(workingDesc)) {
    (filter.attributeFilters ??= []).push({ attribute: "paired", comparison: "eq", value: true });
  }

  const sourceExclusionText = lower
    .replace(/\banother player\b/g, "")
    .replace(/\bother than unit tokens?\b/g, "")
    .replace(/\bother than link units?\b/g, "");
  if (/\b(?:other|another)\b(?=[\s\S]*?\bunits?\b)/.test(sourceExclusionText)) {
    filter.excludeSource = true;
  }

  // Keyword has
  const kwMatch = workingDesc.match(/<([\w\s-]+?)(?:\s+\d+)?>/);
  if (kwMatch) {
    const kw = parseKeywordEffectName(kwMatch[1]);
    if (kw) {
      if (/\bwithout\s+<[^>]+>/i.test(workingDesc)) filter.lacksKeyword = kw;
      else filter.hasKeyword = kw;
    }
  }

  // Attach isBattling LAST so the outer filter is shaped first. A recursive
  // call is used for the relational sub-form; opponentMatches itself is a
  // TargetFilter, parsed from the nested descriptor with the same rules.
  if (extraction.opponentDescriptor !== undefined) {
    const sub = parseTargetFilter(extraction.opponentDescriptor);
    filter.isBattling = { opponentMatches: sub };
  }

  return filter;
}

/**
 * Pull a "battling [descriptor]" clause out of a target description.
 *
 * The clause stops at the first sentence-terminating punctuation (comma,
 * semicolon, period) or at end-of-string. Three shapes are recognised:
 *
 *   "battling this Unit"   / "battling this card"
 *       → { isBattling: true } (candidate is in combat; no sub-filter)
 *
 *   "battling a|an|the <singular-descriptor>"
 *       → { opponentDescriptor: <descriptor> } — callers recurse to parse
 *         the descriptor into a TargetFilter for `isBattling.opponentMatches`
 *
 *   "battling <plural>" (e.g. "battling enemy Units")
 *       → no emission. The predicate narrows one combatant, not a set, so
 *         a set-level battling phrase is ambiguous and we leave it to a
 *         human. The clause is NOT stripped in that case, so any fallback
 *         rules downstream still see the text.
 *
 * The returned `stripped` string has the matched span removed so that
 * attributes inside the sub-clause (keywords like <Blocker>, Lv.N, trait
 * parens, etc.) do not leak onto the outer filter.
 */
interface BattlingExtraction {
  stripped: string;
  opponentDescriptor?: string;
}

function extractBattlingClause(desc: string): BattlingExtraction {
  // Find "battling" as a word; capture everything until a clause
  // terminator. We use a non-greedy body and a positive lookahead on
  // `,`, `;`, end-of-string, or a sentence-final `.` (period followed by
  // whitespace/end, NOT by a digit/letter — which would be an
  // abbreviation like "Lv.2" that should stay inside the clause).
  const re = /\bbattling\s+(.+?)(?=[,;]|\.(?:\s|$)|$)/i;
  const m = desc.match(re);
  if (!m || m.index === undefined) return { stripped: desc };

  const body = m[1].trim();
  const bodyLower = body.toLowerCase();

  // Self-form: "battling this Unit" / "battling this card". The candidate
  // must be battling the source, not merely participating in any battle.
  const selfMatch = body.match(/^this\s+(?:unit|card)\b/i);
  if (selfMatch) {
    const stripped = spliceOut(desc, m.index, m[0].length);
    return { stripped, opponentDescriptor: selfMatch[0] };
  }

  // Relational singular: must start with a/an/the. Reject plurals like
  // "battling enemy Units" — the first non-article word ending in `s`
  // (and not "this"/"base"/"shield"/etc.) is a strong plural signal.
  const articleM = body.match(/^(a|an|the)\s+(.+)$/i);
  const oneOfYourM = body.match(/^one of your\s+(.+)$/i);
  if (oneOfYourM) {
    const stripped = spliceOut(desc, m.index, m[0].length);
    return { stripped, opponentDescriptor: `friendly ${oneOfYourM[1]}` };
  }
  if (!articleM) {
    // Neither "this Unit" nor an article-led descriptor — skip emission
    // and leave the clause in place for downstream logging/inspection.
    return { stripped: desc };
  }
  const rest = articleM[2];
  // Cheap plural guard: any word "Units"/"Bases"/"Shields" in the body
  // means the clause addresses a set rather than one combatant. The
  // predicate can't model that — leave it alone.
  if (/\b(units|bases|shields)\b/i.test(bodyLower)) {
    return { stripped: desc };
  }

  // Recurse: parse `rest` ("friendly Unit with <Blocker>", "enemy Unit
  // that is Lv.2 or lower", etc.) as a nested TargetFilter descriptor.
  const stripped = spliceOut(desc, m.index, m[0].length);
  return { stripped, opponentDescriptor: rest };
}

function spliceOut(s: string, start: number, len: number): string {
  const before = s.slice(0, start).replace(/\s+$/, "");
  const after = s.slice(start + len).replace(/^\s+/, "");
  // Collapse leftover "is" / "are" that would dangle ("this Unit is .").
  const glued = `${before} ${after}`.trim();
  return glued.replace(/\s+(is|are)\s*([.,;]|$)/i, "$2").replace(/\s{2,}/g, " ");
}
