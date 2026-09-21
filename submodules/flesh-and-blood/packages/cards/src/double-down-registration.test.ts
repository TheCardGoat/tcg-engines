import { describe, expect, it } from "vitest";
import { getFleshAndBloodCard } from "./catalog.ts";
import { loadFleshAndBloodStructuredCards } from "./runtime-registry.ts";

// Definition/registration contract only, not card gameplay coverage.
// Official CardVault HVY176 snapshot refreshed 2026-09-20:
// .ralph/flesh-and-blood/card-validation/evidence/double-down-source-refresh.json.
const canonicalId = "8JF8CGqcQRDnGWNBhkhtD";
const printings = [
  { id: "GQJwnBpgRDhJbTRGGthH7", collector: "FAB194" },
  { id: "JpWqMFwFPzRRTDFMBPPMj", collector: "HVY176" },
  { id: "d8mHkDnJ9GF67Jb6GmRr8", collector: "HVY176" },
] as const;

describe("Double Down source identity and registration contract", () => {
  it("accounts for every locally catalogued printing", () => {
    const card = getFleshAndBloodCard(canonicalId);
    expect(card?.printings.map((printing) => printing.id).sort()).toEqual(
      printings.map((printing) => printing.id).sort(),
    );
  });

  for (const printing of printings) {
    it(`loads ${printing.collector} printing ${printing.id} with official printed properties`, async () => {
      const catalog = getFleshAndBloodCard(printing.id);
      expect(catalog?.canonicalId).toBe(canonicalId);
      expect(catalog?.name).toBe("Double Down");
      const loaded = await loadFleshAndBloodStructuredCards([printing.id]);
      const card = loaded.get(canonicalId);
      expect(card?.canonicalId).toBe(canonicalId);
      expect(card?.slug).toBe("double-down-red");
      expect(card?.base).toMatchObject({
        numeric: { cost: 2, pitch: 1, defense: 3 },
        typeBox: {
          types: ["Action"],
          supertypeSets: [["Guardian"], ["Warrior"]],
        },
      });
    });
  }
});
