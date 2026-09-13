import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  FAB_CUBE_DEFAULT_REF,
  FAB_CUBE_LANGUAGES,
  type FabCubeLanguage,
} from "../../scraper/src/index.ts";
import {
  DEFAULT_LOCALIZED_LANGUAGES,
  generateLocalizedCatalogFiles,
} from "./localized-generation.ts";

function option(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function repeatedOption(name: string): string[] {
  const values: string[] = [];
  for (let index = 0; index < process.argv.length; index += 1) {
    if (process.argv[index] === `--${name}`) {
      const value = process.argv[index + 1];
      if (value) values.push(value);
    }
  }
  return values;
}

async function main(): Promise<void> {
  const requested = repeatedOption("language");
  const invalid = requested.filter(
    (language) => !FAB_CUBE_LANGUAGES.includes(language as FabCubeLanguage),
  );
  if (invalid.length > 0) throw new Error(`Unknown fab-cube language(s): ${invalid.join(", ")}`);
  if (requested.includes("english")) {
    throw new Error("The English catalog is not a translation layer; omit english.");
  }
  const languages =
    requested.length > 0
      ? (requested as Exclude<FabCubeLanguage, "english">[])
      : DEFAULT_LOCALIZED_LANGUAGES;
  const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
  const assetManifest = option("asset-manifest");
  if (!assetManifest) throw new Error("--asset-manifest is required");
  const summary = await generateLocalizedCatalogFiles({
    workspaceRoot,
    assetManifestPath: path.resolve(assetManifest),
    sourceRef: option("ref") ?? FAB_CUBE_DEFAULT_REF,
    languages,
    ...(process.env.GITHUB_TOKEN ? { githubToken: process.env.GITHUB_TOKEN } : {}),
  });
  console.log(JSON.stringify({ languages: summary }, null, 2));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
