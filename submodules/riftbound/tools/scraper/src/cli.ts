import path from "node:path";
import { fileURLToPath } from "node:url";

import { scrapeRiotCardGallery, scrapeRiotContentApi, writeRawSnapshot } from "./index.ts";

function option(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main(): Promise<void> {
  const source = process.argv[2];
  const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
  const configuredOutput = option("out") ?? ".cache/raw";
  const outputRoot = path.isAbsolute(configuredOutput)
    ? configuredOutput
    : path.resolve(workspaceRoot, configuredOutput);

  if (source === "gallery") {
    const snapshot = await scrapeRiotCardGallery(option("locale") ?? "en-US");
    console.log(await writeRawSnapshot(snapshot, outputRoot));
    return;
  }

  if (source === "riot") {
    const snapshot = await scrapeRiotContentApi({
      apiKey: process.env.RIOT_API_KEY ?? "",
      region: option("region") ?? process.env.RIFTBOUND_RIOT_REGION ?? "europe",
      locale: option("locale") ?? process.env.RIFTBOUND_LOCALE ?? "en",
    });
    console.log(await writeRawSnapshot(snapshot, outputRoot));
    return;
  }

  throw new Error("Usage: cli.ts gallery|riot [--locale value] [--region value] [--out path]");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
