import { describe, expect, it } from "vite-plus/test";

import {
  DECK_LEGALITY_REPORT_SCHEMA_VERSION,
  decodeDeckLegalityReportFromJson,
  encodeDeckLegalityReportToJson,
  type DeckLegalityReportV1,
} from "./deck-legality-report.js";

describe("DeckLegalityReportV1 transport", () => {
  it("roundtrips a game-agnostic structured legality report", () => {
    const report: DeckLegalityReportV1 = {
      schemaVersion: DECK_LEGALITY_REPORT_SCHEMA_VERSION,
      game: "gundam",
      formatId: "best-of-three",
      valid: false,
      policy: {
        id: "policy-1",
        version: "2026-07-24",
        effectiveFrom: "2026-07-24",
        sourceUrls: ["https://example.test/policy"],
        unresolvedExceptions: [
          {
            id: "starter-exception",
            message: "Requires proof of an unchanged starter lineup.",
            sourceUrl: "https://example.test/policy",
          },
        ],
      },
      violations: [
        {
          code: "format-copy-limit",
          message: "Card is limited to two copies.",
          zones: ["main", "sideboard"],
          cardIdentities: [{ canonicalId: "CARD-001" }],
          actual: 3,
          allowed: 2,
        },
      ],
    };

    const encoded = encodeDeckLegalityReportToJson(report);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok || !encoded.json) return;
    expect(decodeDeckLegalityReportFromJson(encoded.json)).toEqual({
      ok: true,
      report,
    });
  });

  it("rejects malformed reports without game-specific assumptions", () => {
    const decoded = decodeDeckLegalityReportFromJson(
      JSON.stringify({
        schemaVersion: 1,
        game: "gundam",
        formatId: "",
        valid: "yes",
        violations: [{ code: "", message: "bad", zones: [1] }],
      }),
    );

    expect(decoded.ok).toBe(false);
    if (decoded.ok) return;
    expect(decoded.errors).toEqual(
      expect.arrayContaining([
        "formatId must be a non-empty string",
        "valid must be a boolean",
        "violations[0].code must be a non-empty string",
        "violations[0].zones[0] must be a non-empty string",
      ]),
    );
  });
});
