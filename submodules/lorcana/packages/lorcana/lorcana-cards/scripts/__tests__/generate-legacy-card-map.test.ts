import { describe, expect, it } from "bun:test";
import path from "node:path";
import {
  collectValidatedTests,
  collectCardFiles,
  findLegacyMatch,
  generateLegacyCardMapRows,
  LEGACY_CARDS_ROOT,
  NEW_CARDS_ROOT,
  normalizeKind,
  normalizeSlug,
} from "../generate-legacy-card-map";

describe("generate-legacy-card-map", () => {
  it("normalizes known kind aliases", () => {
    expect(normalizeKind("character")).toBe("characters");
    expect(normalizeKind("songs")).toBe("actions");
    expect(normalizeKind("abilities")).toBeNull();
  });

  it("normalizes punctuation drift used by legacy filenames", () => {
    expect(normalizeSlug("031-world-s-greatest-criminal-mind")).toBe(
      "worlds greatest criminal mind",
    );
    expect(normalizeSlug("063-i-m-stuck-")).toBe("im stuck");
    expect(normalizeSlug("176-cerberus-threeheaded-dog")).toBe("cerberus threeheaded dog");
    expect(normalizeSlug("176-cerberus-three-headed-dog")).toBe("cerberus three headed dog");
  });

  it("maps the goofy example card and test paths", () => {
    const rows = generateLegacyCardMapRows(NEW_CARDS_ROOT, LEGACY_CARDS_ROOT);
    const row = rows.find((entry) =>
      entry.new_card_path.endsWith("/008/characters/004-goofy-groundbreaking-chef.ts"),
    );

    expect(row).toBeDefined();
    expect(row?.new_test_path).toBe(
      path.join(NEW_CARDS_ROOT, "008/characters/004-goofy-groundbreaking-chef.test.ts"),
    );
    expect(row?.legacy_card_path).toBe(
      path.join(LEGACY_CARDS_ROOT, "008/character/004-goofy-groundbreaking-chef.ts"),
    );
    expect(row?.legacy_test_path).toBe(
      path.join(LEGACY_CARDS_ROOT, "008/character/004-goofy-groundbreaking-chef.test.ts"),
    );
    expect(row?.match_type).toBe("exact");
    expect(["true", "false"]).toContain(row?.validated_by_llm);
  });

  it("reads validated tests from checked audit inventory entries", () => {
    const validatedTests = collectValidatedTests(NEW_CARDS_ROOT);
    expect(
      validatedTests.has(path.join(NEW_CARDS_ROOT, "001/actions/029-just-in-time.test.ts")),
    ).toBeTrue();
  });

  it("matches punctuation-drifted action filenames by card number", () => {
    const legacyCards = collectCardFiles(LEGACY_CARDS_ROOT);
    const newCards = collectCardFiles(NEW_CARDS_ROOT);
    const indexes = {
      exact: new Map(),
      byNumber: new Map(),
      bySlug: new Map(),
    };

    for (const card of legacyCards) {
      const exactKey = `${card.setCode}|${card.normalizedKind}|${card.number}|${card.normalizedSlug}`;
      const numberKey = `${card.setCode}|${card.normalizedKind}|${card.number}`;
      const slugKey = `${card.setCode}|${card.normalizedKind}|${card.normalizedSlug}`;
      indexes.exact.set(exactKey, [...(indexes.exact.get(exactKey) ?? []), card]);
      indexes.byNumber.set(numberKey, [...(indexes.byNumber.get(numberKey) ?? []), card]);
      indexes.bySlug.set(slugKey, [...(indexes.bySlug.get(slugKey) ?? []), card]);
    }

    const cerberus = newCards.find((card) =>
      card.absolutePath.endsWith("/001/characters/176-cerberus-three-headed-dog.ts"),
    );
    const imStuck = newCards.find((card) =>
      card.absolutePath.endsWith("/002/actions/063-im-stuck.ts"),
    );

    expect(cerberus).toBeDefined();
    expect(imStuck).toBeDefined();

    expect(findLegacyMatch(cerberus!, indexes)).toMatchObject({
      matchType: "number_only",
      card: {
        absolutePath: path.join(
          LEGACY_CARDS_ROOT,
          "001/characters/176-cerberus-threeheaded-dog.ts",
        ),
      },
    });
    expect(findLegacyMatch(imStuck!, indexes)).toMatchObject({
      matchType: "exact",
      card: {
        absolutePath: path.join(LEGACY_CARDS_ROOT, "002/actions/063-im-stuck.ts"),
      },
    });
  });

  it("falls back from legacy songs to new actions", () => {
    const rows = generateLegacyCardMapRows(NEW_CARDS_ROOT, LEGACY_CARDS_ROOT);
    const row = rows.find((entry) =>
      entry.new_card_path.endsWith("/001/actions/064-friends-on-the-other-side.ts"),
    );

    expect(row).toBeDefined();
    expect(row?.legacy_card_path).toBe(
      path.join(LEGACY_CARDS_ROOT, "001/songs/064-friends-on-the-other-side.ts"),
    );
  });

  it("excludes index, aggregator, and helper files", () => {
    const cards = collectCardFiles(NEW_CARDS_ROOT);
    expect(cards.some((card) => card.absolutePath.endsWith("/index.ts"))).toBeFalse();
    expect(cards.some((card) => card.absolutePath.endsWith("/actions.ts"))).toBeFalse();
    expect(cards.some((card) => card.absolutePath.endsWith("/characters.ts"))).toBeFalse();
    expect(cards.some((card) => card.absolutePath.endsWith("/test-helpers.ts"))).toBeFalse();
  });

  it("sorts by normalized card name instead of numeric prefix", () => {
    const rows = generateLegacyCardMapRows(NEW_CARDS_ROOT, LEGACY_CARDS_ROOT);
    const sortNames = rows.map((row) => row.sort_name);
    const sorted = [...sortNames].sort((left, right) => left.localeCompare(right));
    expect(sortNames).toEqual(sorted);
  });

  it("marks unresolved cards as missing instead of guessing", () => {
    const rows = generateLegacyCardMapRows(NEW_CARDS_ROOT, LEGACY_CARDS_ROOT);
    const row = rows.find((entry) =>
      entry.new_card_path.endsWith(
        "/002/characters/205-cinderella-ballroom-sensation-enchanted.ts",
      ),
    );
    expect(row).toBeDefined();
    expect(row?.legacy_card_path).toBe("MISSING");
    expect(row?.legacy_test_path).toBe("MISSING");
    expect(row?.match_type).toBe("missing");
  });

  it("adds validated_by_llm to every row", () => {
    const rows = generateLegacyCardMapRows(NEW_CARDS_ROOT, LEGACY_CARDS_ROOT);
    expect(
      rows.every((row) => row.validated_by_llm === "true" || row.validated_by_llm === "false"),
    ).toBeTrue();
  });
});
