import { describe, expect, test } from "vite-plus/test";
import * as cardExports from "@tcg/op-cards";
import type { OPCard } from "@tcg/op-types";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

function isCardDefinition(value: unknown): value is OPCard {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<OPCard>;
  return typeof candidate.id === "string" && typeof candidate.cardType === "string";
}

const exportedCards = Object.values(cardExports as Record<string, unknown>).filter(
  isCardDefinition,
);
const cardsSourceRoot = join(dirname(fileURLToPath(import.meta.url)), "../../cards/src/cards");

function cardSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return cardSourceFiles(path);
    }
    if (
      !entry.name.endsWith(".ts") ||
      entry.name.endsWith(".i18n.ts") ||
      entry.name === "index.ts"
    ) {
      return [];
    }
    return [path];
  });
}

describe("card ability coverage inventory", () => {
  test("covers every card source file with one exported card definition", async () => {
    const sourceFiles = cardSourceFiles(cardsSourceRoot);
    const cardDefinitionsByFile = await Promise.all(
      sourceFiles.map(async (sourceFile) => {
        const module = (await import(pathToFileURL(sourceFile).href)) as Record<string, unknown>;
        return Object.values(module).filter(isCardDefinition);
      }),
    );

    expect(cardDefinitionsByFile.every((definitions) => definitions.length === 1)).toBe(true);
    expect(exportedCards.length).toBe(sourceFiles.length);
  });
});
