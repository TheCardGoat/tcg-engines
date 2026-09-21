/**
 * Player-facing log quality audit for One Piece bot matches.
 *
 * The simulator log must be concise and precise: one clear line per
 * player-meaningful happening. These heuristics flag the known failure
 * modes seen in engine-emitted logs so every playtest batch tracks them.
 * Pure functions over the string log lines; no engine imports.
 */

export interface LogAuditFinding {
  /** Stable machine id, e.g. "double-logged-draw". */
  category: string;
  severity: "defect" | "style";
  count: number;
  example: string | null;
}

export interface LogAuditResult {
  totalLines: number;
  findings: LogAuditFinding[];
  /** Defect-category findings per 100 lines (style categories excluded). */
  defectDensity: number;
}

interface CategoryRule {
  category: string;
  severity: "defect" | "style";
  /** Matches a single line in isolation. */
  single?: RegExp;
  /** Matches when `single` matched line i and this matches line i+1. */
  followedBy?: RegExp;
  description: string;
  /** Known-legit repeat shapes excluded from the consecutive-duplicate tripwire. */
  exempt?: RegExp;
}

const RULES: readonly CategoryRule[] = [
  {
    category: "double-logged-draw",
    severity: "defect",
    single: /moves a hidden card from Deck to Hand\.$/,
    followedBy: / draws? \d+ cards?\.$/,
    description:
      "A draw emits both a raw zone-movement line and a 'draws N card' line; players see the same thing twice.",
  },
  {
    category: "double-logged-play",
    severity: "defect",
    single: /moves a hidden card from Hand to Character area\.$/,
    followedBy: / plays /,
    description: "Playing a card emits both a raw zone-movement line and a 'plays X' line.",
  },
  {
    category: "unformatted-life-look",
    severity: "defect",
    single: /looks at Life$/,
    description:
      "The life-look prompt logs as a fragment without a period, the owner seat, or the card count.",
  },
  {
    category: "battle-ko-double-line",
    severity: "defect",
    single: /from Character area to Trash\.$/,
    followedBy: / is K\.O\.'d\.$/,
    description:
      "A battle K.O. emits both the raw trash-movement line and the 'X is K.O.'d.' line.",
  },
  {
    category: "effect-ko-double-line",
    severity: "defect",
    single: /from Character area to Trash\.$/,
    followedBy: / K\.O\.'s /,
    description:
      "An effect K.O. emits both the raw trash-movement line and the 'X K.O.'s Y.' line.",
  },
  {
    category: "requirement-reads-as-event",
    severity: "defect",
    single: /trashes \d+ card\(s\) from hand\.$/,
    followedBy: / trashes \d+ card from hand\.$/,
    description:
      "A mandatory trash-from-hand requirement label collides with its own resolution line.",
  },
  {
    category: "vague-target",
    severity: "defect",
    single: /needs a target/,
    description:
      "'Needs a target' without naming the candidates or the chosen target tells the player nothing.",
  },
  {
    category: "empty-prevention-target",
    severity: "defect",
    single: / prevents\s+from /,
    description:
      "A 'prevents ...' line has an empty target list — an optional-target effect resolved with zero targets but the log asserts a prevention.",
  },
  {
    category: "double-space-in-line",
    severity: "defect",
    single: /\S  \S/,
    description:
      "Two consecutive spaces mid-sentence — an empty target list was interpolated where a name should render.",
  },
  {
    category: "dev-jargon",
    severity: "defect",
    single: /\bonPlay\b|effect resolution|from effect resolution/,
    description:
      "Developer vocabulary ('onPlay', 'effect resolution') leaks into player-facing lines.",
  },
  {
    category: "terse-prompt-header",
    severity: "style",
    single: / counter step$|may activate a trigger$|may block$/,
    description: "Prompt-phase headers are telegraphic fragments rather than sentences.",
  },
  {
    category: "unpunctuated-line",
    severity: "defect",
    single: /[^.!?]$/,
    description:
      "Player-facing line is an unpunctuated fragment; prompt labels must read as full sentences.",
  },
  {
    category: "consecutive-duplicate",
    severity: "defect",
    description: "The exact same line twice in a row.",
    // Known-legit repeats: two same-name copies played back-to-back, stacked
    // [Counter] power pumps resolving once per copy, and damage ticks from
    // separate consecutive battles with identical outcomes.
    exempt: / plays |gives .* power this battle\.$|takes \d+ damage\.$/,
  },
  {
    category: "empty-message",
    severity: "defect",
    single: /^\s*$/,
    description: "Empty log line.",
  },
  {
    category: "overlong-line",
    severity: "style",
    single: /.{221,}/,
    description: "Line longer than 220 characters; hard to read in the log pane.",
  },
];

export function auditGameLog(lines: readonly string[]): LogAuditResult {
  const counts = new Map<
    string,
    { severity: "defect" | "style"; count: number; example: string | null }
  >();
  const record = (rule: CategoryRule, line: string | null) => {
    const entry = counts.get(rule.category) ?? { severity: rule.severity, count: 0, example: null };
    entry.count += 1;
    if (entry.example === null && line !== null) entry.example = line;
    counts.set(rule.category, entry);
  };

  for (const [index, line] of lines.entries()) {
    for (const rule of RULES) {
      if (!rule.single) continue;
      if (!rule.single.test(line)) continue;
      if (rule.followedBy) {
        const next = lines[index + 1];
        if (next === undefined || !rule.followedBy.test(next)) continue;
      }
      record(rule, line);
    }
    if (index > 0 && lines[index - 1] === line && line.trim().length > 0) {
      const rule = RULES.find((r) => r.category === "consecutive-duplicate")!;
      if (!rule.exempt || !rule.exempt.test(line)) {
        record(rule, line);
      }
    }
  }

  const findings: LogAuditFinding[] = [...counts.entries()]
    .map(([category, entry]) => ({
      category,
      severity: entry.severity,
      count: entry.count,
      example: entry.example,
    }))
    .sort((a, b) => b.count - a.count);

  const defectCount = findings
    .filter((f) => f.severity === "defect")
    .reduce((sum, f) => sum + f.count, 0);

  return {
    totalLines: lines.length,
    findings,
    defectDensity: lines.length > 0 ? Math.round((defectCount / lines.length) * 10000) / 100 : 0,
  };
}

export function formatLogAudit(result: LogAuditResult): string {
  const parts = result.findings.map((f) => `${f.category}=${f.count}`);
  return `${result.totalLines} lines, defectDensity=${result.defectDensity}%${
    parts.length > 0 ? `: ${parts.join(", ")}` : ""
  }`;
}
