import { describe, expect, it } from "vitest";
import { highOctaneRed } from "./cards/actions/high-octane.ts";
import { invokeSurayaYellow } from "./cards/actions/invoke-suraya.ts";
import { venombackFabricYellow } from "./cards/actions/venomback-fabric.ts";
import { scabskinLeathers } from "./cards/equipment/scabskin-leathers.ts";
import { squizzyFloof } from "./cards/heroes/squizzy-floof.ts";
import { crackedBaubleYellow } from "./cards/resources/cracked-bauble.ts";
import { gold } from "./cards/tokens/gold.ts";
import { STRUCTURED_CARDS_BY_CANONICAL_ID } from "./generated/card-registry.generated.ts";
import { loadFleshAndBloodStructuredCards } from "./runtime-registry.ts";

describe("generated structured FAB card registry", () => {
  it("returns a known structured card through its canonical catalog identity", async () => {
    const cards = await loadFleshAndBloodStructuredCards([highOctaneRed.canonicalId]);
    expect(cards.get(highOctaneRed.canonicalId)).toBe(
      STRUCTURED_CARDS_BY_CANONICAL_ID.get(highOctaneRed.canonicalId),
    );
  });

  it("has a generated entry for every known structured card and rejects unknown ids", async () => {
    expect(STRUCTURED_CARDS_BY_CANONICAL_ID.get(highOctaneRed.canonicalId)?.canonicalId).toBe(
      highOctaneRed.canonicalId,
    );
    await expect(loadFleshAndBloodStructuredCards(["unknown-card"])).resolves.toEqual(new Map());
  });

  it("preloads non-Token objects created by authored behavior", async () => {
    const cards = await loadFleshAndBloodStructuredCards([squizzyFloof.canonicalId]);
    expect(cards.get("token:cracked-bauble")).toBe(
      STRUCTURED_CARDS_BY_CANONICAL_ID.get(crackedBaubleYellow.canonicalId),
    );
  });

  it("preloads every authored Token under its runtime token slug", async () => {
    const cards = await loadFleshAndBloodStructuredCards([highOctaneRed.canonicalId]);
    const tokens = [...STRUCTURED_CARDS_BY_CANONICAL_ID.values()].filter((card) =>
      card.base.typeBox.types.includes("Token"),
    );

    expect(tokens.length).toBeGreaterThan(0);
    for (const token of tokens) {
      const registered = cards.get(`token:${token.slug}`);
      expect(registered).toBeDefined();
      if (registered === token) continue;
      expect(registered?.layout.kind).toBe("twin");
      if (registered?.layout.kind === "twin") {
        expect(
          [registered.layout.front.name, registered.layout.back.name].map((name) =>
            name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-"),
          ),
        ).toContain(token.slug);
      }
    }
  });

  it("registers an independently printed Gold token as its own physical identity", async () => {
    const cards = await loadFleshAndBloodStructuredCards([highOctaneRed.canonicalId]);
    expect(cards.get("token:gold")).toBe(STRUCTURED_CARDS_BY_CANONICAL_ID.get(gold.canonicalId));
  });

  it("distinguishes independent back printings from paired DFC back printings", async () => {
    const independent = await loadFleshAndBloodStructuredCards(["pfmzrNTL69LzFtMwLhm7Q"]);
    expect(independent.get(scabskinLeathers.canonicalId)).toBe(
      STRUCTURED_CARDS_BY_CANONICAL_ID.get(scabskinLeathers.canonicalId),
    );

    const paired = await loadFleshAndBloodStructuredCards(["KHRfzdLTN7fBPQhqfCpq7"]);
    expect(paired.get(venombackFabricYellow.canonicalId)?.canonicalId).toBe(
      venombackFabricYellow.canonicalId,
    );
    expect(paired.has(scabskinLeathers.canonicalId)).toBe(false);
  });

  it("keeps the localized back-face AST when assembling a paired card", async () => {
    const cards = await loadFleshAndBloodStructuredCards([invokeSurayaYellow.canonicalId]);
    const physical = cards.get(invokeSurayaYellow.canonicalId);
    expect(physical?.layout.kind).toBe("flip");
    if (physical?.layout.kind === "flip") {
      expect(physical.layout.front.abilities.every((ability) => ability.text.trim())).toBe(true);
      expect(physical.layout.back.abilities.length).toBeGreaterThan(0);
      expect(physical.layout.back.abilities.every((ability) => ability.text.trim())).toBe(true);
    }
  });
});
