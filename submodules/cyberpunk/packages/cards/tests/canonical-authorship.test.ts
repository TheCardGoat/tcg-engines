import { describe, expect, it } from "vite-plus/test";
import type { CardDefinition } from "@tcg/cyberpunk-types";

import { cards, RUNTIME_SET_CODES, structuredCards } from "../src/index.ts";

const runtimeSetCodes = new Set<string>(RUNTIME_SET_CODES);
const sourceCards: readonly CardDefinition[] = cards;

describe("canonical card authorship", () => {
  it("keeps every sourced card field and printing on its one canonical authored definition", () => {
    const problems: string[] = [];

    for (const authored of structuredCards) {
      if (authored.slug === "lucyna-kushinada") continue;

      const source = sourceCards.find(
        (candidate) =>
          candidate.slug === authored.slug &&
          candidate.set.code === authored.set.code &&
          candidate.type === authored.type,
      );
      if (!source) {
        problems.push(`${authored.slug}: missing ${authored.set.code} source card`);
        continue;
      }

      const sourcedFields = [
        "name",
        "subname",
        "displayName",
        "rulesText",
        "flavorText",
        "description",
        "youtubeUrl",
        "sourceUrl",
        "color",
        "cost",
        "power",
        "ram",
        "artist",
        "printNumber",
        "imageUrl",
        "legality",
        "hasSellTag",
      ] as const;
      for (const field of sourcedFields) {
        if (authored[field] !== source[field]) {
          problems.push(`${authored.slug}: ${field} differs from ${authored.set.code} source`);
        }
      }

      if (JSON.stringify(authored.classifications) !== JSON.stringify(source.classifications)) {
        problems.push(`${authored.slug}: classifications differ from ${authored.set.code} source`);
      }

      const sourcePrintingIds = new Set(
        sourceCards
          .filter(
            (candidate) =>
              candidate.slug === authored.slug && runtimeSetCodes.has(candidate.set.code),
          )
          .flatMap((candidate) => candidate.printings.map((printing) => printing.id)),
      );
      const authoredPrintingIds = new Set(authored.printings.map((printing) => printing.id));
      if (
        sourcePrintingIds.size !== authoredPrintingIds.size ||
        [...sourcePrintingIds].some((printingId) => !authoredPrintingIds.has(printingId))
      ) {
        problems.push(
          `${authored.slug}: canonical printings do not match runtime source printings`,
        );
      }
    }

    expect(structuredCards).toHaveLength(152);
    expect(problems).toEqual([]);
  });
});
