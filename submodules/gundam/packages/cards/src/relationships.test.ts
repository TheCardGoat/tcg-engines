import { describe, expect, it } from "vite-plus/test";
import type { Card } from "@tcg/gundam-types";
import * as cardExports from "./index.ts";
import {
  parseGundamNamedLinkRequirements,
  resolveGundamCardRelationships,
} from "./relationships.ts";

function isCard(value: unknown): value is Card {
  return (
    typeof value === "object" &&
    value !== null &&
    "cardNumber" in value &&
    "canonicalId" in value &&
    "type" in value
  );
}

const catalog = Object.values(cardExports).filter(isCard);

function card(cardNumber: string): Card {
  const match = catalog.find((candidate) => candidate.cardNumber === cardNumber);
  if (!match) throw new Error(`Missing card fixture ${cardNumber}`);
  return match;
}

describe("Gundam Link relationships", () => {
  it("parses multiple bracketed names without turning trait clauses into relationships", () => {
    expect(
      parseGundamNamedLinkRequirements(
        "(Support) Trait / [Shagia Frost] / [Olba Frost] / [Shagia Frost]",
      ),
    ).toEqual([
      { raw: "Shagia Frost", normalized: "shagia frost" },
      { raw: "Olba Frost", normalized: "olba frost" },
    ]);
  });

  it("resolves each named alternative with printing identity", () => {
    const result = resolveGundamCardRelationships(card("GD03-040"), catalog);

    expect(result.diagnostics).toEqual([]);
    expect(result.relationships).toEqual([
      expect.objectContaining({
        kind: "link-partner",
        direction: "unit-to-pilot",
        sourceCanonicalId: "GD03-040",
        sourceCondition: "[Shagia Frost] / [Olba Frost]",
        target: expect.objectContaining({
          canonicalId: "GD02-093",
          printingId: "GD02-093",
          name: "Olba Frost",
          cardType: "pilot",
        }),
      }),
      expect.objectContaining({
        target: expect.objectContaining({
          canonicalId: "GD02-092",
          printingId: "GD02-092",
          name: "Shagia Frost",
          cardType: "pilot",
        }),
      }),
    ]);
  });

  it("omits unresolved named requirements instead of guessing", () => {
    const partial = resolveGundamCardRelationships(card("GD05-026"), catalog);
    expect(partial.relationships.map(({ target }) => target.name)).toEqual(["Prospera Mercury"]);
    expect(partial.diagnostics).toContainEqual(
      expect.objectContaining({
        code: "unresolved-link-name",
        requirement: "Ericht Samaya",
      }),
    );
  });

  it("returns every canonical Pilot whose card name contains the bracketed text", () => {
    const sameNamePilots = resolveGundamCardRelationships(card("ST10-002"), catalog);
    expect(sameNamePilots.diagnostics).toEqual([]);
    expect(sameNamePilots.relationships.map(({ target }) => target.canonicalId)).toEqual([
      "GD02-097",
      "ST10-011",
    ]);

    const partialName = resolveGundamCardRelationships(card("GD02-053"), catalog);
    expect(partialName.diagnostics).toEqual([]);
    expect(partialName.relationships).toContainEqual(
      expect.objectContaining({
        sourceCondition: "[Garrod Ran]",
        target: expect.objectContaining({
          canonicalId: "GD02-094",
          name: "Garrod Ran & Tiffa Adill",
        }),
      }),
    );
  });

  it("does not expand a trait-only Link Condition into generic cards", () => {
    const result = resolveGundamCardRelationships(card("ST10-007"), catalog);

    expect(result.relationships).toEqual([]);
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: "no-named-link-requirement",
        sourceCondition: "(G Generation) Trait",
      }),
    ]);
  });

  it("projects reverse Unit relationships for a matching Pilot", () => {
    const result = resolveGundamCardRelationships(card("GD02-092"), catalog);

    expect(result.relationships).toContainEqual(
      expect.objectContaining({
        kind: "link-partner",
        direction: "pilot-to-unit",
        sourceCanonicalId: "GD02-092",
        sourceCondition: "[Shagia Frost] / [Olba Frost]",
        target: expect.objectContaining({
          canonicalId: "GD03-040",
          printingId: "GD03-040",
          name: "Gundam Virsago & Gundam Ashtaron",
          cardType: "unit",
        }),
      }),
    );

    const partialNameResult = resolveGundamCardRelationships(card("GD02-094"), catalog);
    expect(partialNameResult.relationships).toContainEqual(
      expect.objectContaining({
        kind: "link-partner",
        direction: "pilot-to-unit",
        sourceCanonicalId: "GD02-094",
        sourceCondition: "[Garrod Ran]",
        target: expect.objectContaining({
          canonicalId: "GD02-053",
          name: "Gundam X",
          cardType: "unit",
        }),
      }),
    );
  });
});
