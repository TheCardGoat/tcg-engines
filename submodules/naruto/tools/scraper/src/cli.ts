import path from "node:path";
import { fileURLToPath } from "node:url";

import { scrapeCommunityCardSources, writeSnapshot } from "./index.ts";

function option(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main(): Promise<void> {
  const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
  const configuredOutput = option("out") ?? ".cache/raw/naruto-community-card-sources.json";
  const outputPath = path.isAbsolute(configuredOutput)
    ? configuredOutput
    : path.resolve(workspaceRoot, configuredOutput);
  const snapshot = await scrapeCommunityCardSources();
  await writeSnapshot(snapshot, outputPath);

  console.log(`Wrote ${snapshot.sources.narutoCardGameSimulator.cards.length} simulator cards.`);
  console.log(`Wrote ${snapshot.sources.exBurst.cards.length} ExBurst cards.`);
  console.log(
    `Reconciled ${snapshot.reconciliation.exactNumberMatches} exact numbers with ${snapshot.reconciliation.conflicts.length} conflicts.`,
  );
  console.log(outputPath);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
