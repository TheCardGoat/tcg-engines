import { describe, expect, it } from "vitest";
import { historyTokenKindFromCanonicalId, historyTokenKindOf } from "./history-facts.ts";

describe("historyTokenKindFromCanonicalId", () => {
  it("recognizes slugs, token: prefixes, and persisted catalog aliases", () => {
    expect(historyTokenKindFromCanonicalId("token:gold")).toBe("gold");
    expect(historyTokenKindFromCanonicalId("8qdmprPg7kckn8ktMTKQh")).toBe("gold");
    expect(historyTokenKindFromCanonicalId("Cn8tK9KRm7d9KbcQk6Pqm")).toBe("toughness");
    expect(historyTokenKindFromCanonicalId("JtkWt6Kzpgz9qpPLPp8Ff")).toBe("gate-to-i-arathael");
    expect(historyTokenKindFromCanonicalId("token:vigor")).toBe("vigor");
    expect(historyTokenKindFromCanonicalId("token:might")).toBe("might");
  });

  it("does not treat the Agility // Gold physical id as Gold", () => {
    expect(historyTokenKindFromCanonicalId("WqTTMjDgKKCp7Lnb7LH6d")).toBeNull();
  });
});

describe("historyTokenKindOf", () => {
  it("requires a created-token for ledger writes", () => {
    expect(historyTokenKindOf({ objectKind: "created-token", canonicalId: "token:gold" })).toBe(
      "gold",
    );
    expect(
      historyTokenKindOf({ objectKind: "catalog-card", canonicalId: "WqTTMjDgKKCp7Lnb7LH6d" }),
    ).toBeNull();
  });

  it("classifies the Agility // Gold physical id by active face", () => {
    const physicalId = "WqTTMjDgKKCp7Lnb7LH6d";
    expect(
      historyTokenKindOf({
        objectKind: "created-token",
        canonicalId: physicalId,
        activeFace: {
          kind: "paired",
          family: "twin",
          activeFaceIds: [`${physicalId}:face:back`],
        },
      }),
    ).toBe("gold");
    expect(
      historyTokenKindOf({
        objectKind: "created-token",
        canonicalId: physicalId,
        activeFace: {
          kind: "paired",
          family: "twin",
          activeFaceIds: [`${physicalId}:face:front`],
        },
      }),
    ).toBeNull();
    expect(
      historyTokenKindOf({
        objectKind: "created-token",
        canonicalId: physicalId,
      }),
    ).toBeNull();
  });
});
