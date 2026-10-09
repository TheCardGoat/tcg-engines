import { readFileSync } from "node:fs";
import { describe, expect, test } from "vite-plus/test";
import * as cardExports from "@tcg/op-cards";
import type { OPCard } from "@tcg/op-types";

import {
  buildProofIndex,
  extractCardIds,
  gradeSource,
  hasMeaningfulDecline,
  isCard,
  isVanilla,
  listCardBehaviorTestFiles,
  primaryProofPathForCard,
  type GradeAResult,
} from "./grade-a-checker.ts";

describe("Grade A card behavior proofs", () => {
  test("indexes unnumbered event Leaders without inventing a collector number", () => {
    const id = "EVENT-LEADER-MONKEY-D-LUFFY";
    expect([...extractCardIds('"EVENT-LEADER-MONKEY-D-LUFFY" and "OP01-001"')]).toEqual([
      id,
      "OP01-001",
    ]);
    const primary = "tests/cards/leaders/event-leader-monkey-d-luffy.test.ts";
    expect(
      primaryProofPathForCard(id, new Map([[id, ["tests/cards/other.test.ts", primary]]])),
    ).toBe(primary);
  });

  test("binds literal card IDs in optional play proofs to the exact subject", () => {
    const card = Object.values(cardExports).find(
      (entry) => isCard(entry) && entry.id === "OP17-098",
    );
    if (!isCard(card)) throw new Error("Expected Kong Gun definition");
    const proof = `test("decline Main", () => {
      engine.playCard("OP17-098");
      engine.asSouth().declineOptional();
      expect(engine.getView("south").players.south.activeDon).toBe(6);
    });`;
    expect(hasMeaningfulDecline(proof, card)).toBe(true);
    expect(
      hasMeaningfulDecline(proof.replace('playCard("OP17-098")', 'playCard("OP17-077")'), card),
    ).toBe(false);
  });

  test("binds optional battle-end decline to the subject's physical combatant", () => {
    const card = Object.values(cardExports).find(
      (entry) => isCard(entry) && entry.id === "ST08-013",
    );
    if (!isCard(card)) throw new Error("Expected Bon Kurei definition");
    const proof = `test("declines battle-end KO", () => {
      const engine = OnePieceTestEngine.create({ character: [{ cardId: "ST08-013", attachedDon: 1 }] });
      const subject = engine.findCardInZone("south", "character", "ST08-013");
      engine.declareAttack(subject, other, "south");
      engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
      expect(engine.getView("south").players.south.characters.length).toBe(1);
    });`;
    expect(hasMeaningfulDecline(proof, card)).toBe(true);
    expect(
      hasMeaningfulDecline(
        proof.replace("declareAttack(subject, other", "declareAttack(other, subject"),
        card,
      ),
    ).toBe(true);
    expect(
      hasMeaningfulDecline(
        proof.replace("declareAttack(subject, other", "declareAttack(unrelated, other"),
        card,
      ),
    ).toBe(false);
    expect(
      hasMeaningfulDecline(
        proof.replace(
          'findCardInZone("south", "character", "ST08-013")',
          'findCardInZone("south", "character", "ST08-012")',
        ),
        card,
      ),
    ).toBe(false);
  });

  test("prefers a numbered Stage subject over a Character fixture import", () => {
    const stage = "src/cards/OP15/stages/057.test.ts";
    const fixture = "src/cards/OP15/characters/023-arlong.test.ts";
    expect(primaryProofPathForCard("OP15-057", new Map([["OP15-057", [fixture, stage]]]))).toBe(
      stage,
    );
    expect(
      primaryProofPathForCard(
        "OP14-057",
        new Map([["OP14-057", [stage, "src/cards/OP14/stages/057.test.ts"]]]),
      ),
    ).toBe("src/cards/OP14/stages/057.test.ts");
  });

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
