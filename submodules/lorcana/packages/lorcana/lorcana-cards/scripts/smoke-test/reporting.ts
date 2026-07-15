import type { CliOptions, Finding, Summary } from "./types";

export function parseCliOptions(argv: string[]): CliOptions {
  let limit = 50;

  for (const argument of argv) {
    if (argument.startsWith("--limit=")) {
      const rawValue = Number(argument.slice("--limit=".length));
      if (Number.isFinite(rawValue) && rawValue > 0) {
        limit = rawValue;
      }
    }
  }

  return {
    canonicalParity: argv.includes("--canonical-parity"),
    json: argv.includes("--json"),
    limit,
  };
}

export function printHumanReadableReport(
  summary: Summary,
  findings: Finding[],
  limit: number,
): void {
  console.log("Card Ability Smoke Test");
  console.log("=======================");
  console.log(`Cards scanned: ${summary.cardsScanned}`);
  console.log(`Text entries scanned: ${summary.textEntriesScanned}`);
  console.log(
    `Findings: high=${summary.findingsBySeverity.high}, medium=${summary.findingsBySeverity.medium}, low=${summary.findingsBySeverity.low}`,
  );
  console.log("");
  console.log("Findings by category:");
  for (const [category, count] of Object.entries(summary.findingsByCategory)) {
    console.log(`- ${category}: ${count}`);
  }

  console.log("");
  console.log(`Top findings (${Math.min(limit, findings.length)} of ${findings.length}):`);

  for (const finding of findings.slice(0, limit)) {
    console.log("");
    console.log(
      `[${finding.severity.toUpperCase()}] ${finding.category} :: ${finding.cardName} (${finding.setCardNumber})`,
    );
    if (finding.filePath) {
      console.log(`file: ${finding.filePath}`);
    }
    console.log(`canonicalId: ${finding.canonicalId}`);
    console.log(`text: ${finding.textSnippet}`);
    console.log(`expected: ${finding.expectedSignal}`);
    console.log(`observed: ${finding.observedSignal}`);
    console.log(`why: ${finding.whySuspicious}`);
  }

  if (findings.length > limit) {
    console.log("");
    console.log(
      `... ${findings.length - limit} more findings omitted. Re-run with --limit=<n> or --json.`,
    );
  }
}
