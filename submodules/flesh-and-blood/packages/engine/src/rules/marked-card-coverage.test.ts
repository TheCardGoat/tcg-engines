/**
 * Complete authored-card inventory for CR 9.3.
 *
 * The behavioural tests for Hunter's Klaive, Cindra, and Arakni exercise the
 * shared engine paths. This table-driven guard gives every authored Marked
 * producer/consumer its own test case, so a newly authored use cannot bypass
 * those paths unnoticed.
 */
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fleshAndBloodStructuredCardsByCanonicalId } from "../../../cards/src/cards/index.ts";
import { MARKED_AAA_OWNERS, markedLedgerEntries } from "./marked-card-ledger.ts";

const markedCards = markedLedgerEntries(fleshAndBloodStructuredCardsByCanonicalId.values());
const packagesRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

describe("CR 9.3 authored Marked card coverage", () => {
  it("discovers authored Marked producers and consumers", () => {
    expect(markedCards.some(({ role }) => role === "producer")).toBe(true);
    expect(markedCards.some(({ role }) => role === "consumer")).toBe(true);
  });

  it("has exactly one checked-in AAA owner for every discovered Marked card", () => {
    expect(Object.keys(MARKED_AAA_OWNERS).sort()).toEqual(
      [...new Set(markedCards.map(({ canonicalId }) => canonicalId))].sort(),
    );
  });

  it.each(markedCards)("$canonicalId $slug ($role) is assigned to $family", (entry) => {
    expect(entry.aaaOwner).toMatch(/(?:^|\/)\S+\.test\.ts$/);
    expect(existsSync(resolve(packagesRoot, entry.aaaOwner!))).toBe(true);
    expect(entry.family).toBeTruthy();
  });
});
