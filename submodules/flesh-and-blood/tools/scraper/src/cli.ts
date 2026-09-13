import path from "node:path";
import { fileURLToPath } from "node:url";

import { FAB_CUBE_DEFAULT_REF, scrapeFabCube, writeRawSnapshot } from "./index.ts";

function option(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main(): Promise<void> {
  const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
  const configuredOutput = option("out") ?? ".cache/raw";
  const outputRoot = path.isAbsolute(configuredOutput)
    ? configuredOutput
    : path.resolve(workspaceRoot, configuredOutput);

  const githubToken = process.env.GITHUB_TOKEN;
  const snapshot = await scrapeFabCube({
    sourceRef: option("ref") ?? FAB_CUBE_DEFAULT_REF,
    ...(githubToken ? { githubToken } : {}),
  });
  console.log(await writeRawSnapshot(snapshot, outputRoot));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
