import { readFileSync } from "node:fs";
import { describe, expect, test } from "vite-plus/test";
import * as cardExports from "@tcg/op-cards";
import type { OPCard } from "@tcg/op-types";

import {
  buildProofIndex,
  gradeSource,
  isCard,
  isVanilla,
  listCardBehaviorTestFiles,
  primaryProofPathForCard,
  type GradeAResult,
} from "./grade-a-checker.ts";

describe("Grade A card behavior proofs", () => {
  test("every non-vanilla ability card primary proof is Grade A", () => {
    const allCards = Object.values(cardExports as Record<string, unknown>).filter(isCard);
    const byCanonical = new Map<string, OPCard>();
    for (const card of allCards) {
      if (card.cardType === "don") continue;
      const key = `${card.cardType}:${card.canonicalId || card.id}`;
      if (!byCanonical.has(key)) byCanonical.set(key, card);
    }

    const testFiles = listCardBehaviorTestFiles();
    const proofIndex = buildProofIndex(testFiles);

    const failures: GradeAResult[] = [];
    const graded: GradeAResult[] = [];
    const missingPrimary: string[] = [];

    for (const card of byCanonical.values()) {
      if (isVanilla(card)) continue;
      const base = (card.canonicalId || card.id).split("_")[0]!.toUpperCase();
      const primary = primaryProofPathForCard(base, proofIndex);
      if (!primary) {
        missingPrimary.push(`${card.cardType} ${base} (${card.name})`);
        continue;
      }
      const source = readFileSync(primary, "utf8");
      const result = gradeSource(primary, source, card);
      result.cardId = base;
      if (result.grade === "SKIP") continue;
      graded.push(result);
      if (!result.ok) failures.push(result);
    }

    // eslint-disable-next-line no-console
    console.info(
      `[grade-a] graded primaries=${graded.length} failures=${failures.length} missingPrimary=${missingPrimary.length}`,
    );
    if (failures.length > 0) {
      const sample = failures
        .slice(0, 40)
        .map(
          (f) =>
            `${f.cardId ?? "?"} ${f.grade} ${f.path.replace(/.*packages\/engine\//, "")}: ${f.reasons.join("; ")}`,
        );
      // eslint-disable-next-line no-console
      console.info(`[grade-a] sample failures:\n${sample.join("\n")}`);
    }

    expect(
      missingPrimary,
      `Missing primary proofs:\n${missingPrimary.slice(0, 30).join("\n")}`,
    ).toEqual([]);
    expect(
      failures,
      [
        `Non-Grade-A primary proofs (${failures.length}):`,
        ...failures
          .slice(0, 60)
          .map(
            (f) =>
              `${f.cardId} [${f.grade}] ${f.path.replace(/.*packages\/engine\//, "")}: ${f.reasons.join("; ")}`,
          ),
        failures.length > 60 ? `…and ${failures.length - 60} more` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    ).toEqual([]);
  }, 120_000);
});
