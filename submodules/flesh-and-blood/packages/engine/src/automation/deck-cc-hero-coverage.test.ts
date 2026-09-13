import { describe, expect, it } from "vitest";
import { fleshAndBloodDeckCardLibrary } from "../../../cards/src/deck-library.ts";
import { listAdultCcLegalHeroPrintings } from "./adult-cc-heroes.ts";
import { getFabDeck, listFabDecks } from "./deck-catalog.ts";
import { validateFabDeckTextFixture } from "./validate-text-deck.ts";

describe("adult Classic Constructed hero coverage", () => {
  it("gives every adult CC-legal hero printing a validator-clean CC list", () => {
    const heroes = listAdultCcLegalHeroPrintings(fleshAndBloodDeckCardLibrary);
    expect(heroes.length).toBeGreaterThan(0);
    const ccLists = listFabDecks({ format: "classic-constructed" });
    const missing: string[] = [];
    const illegal: string[] = [];

    for (const hero of heroes) {
      const fixtures = ccLists.filter((deck) => deck.hero === hero.name);
      if (fixtures.length === 0) {
        missing.push(hero.name);
        continue;
      }
      const accepted = fixtures.filter((fixture) => {
        const result = validateFabDeckTextFixture(fleshAndBloodDeckCardLibrary, fixture);
        return result.unresolved.length === 0 && result.valid;
      });
      if (accepted.length === 0) {
        illegal.push(
          `${hero.name}: ${fixtures
            .map((fixture) => {
              const result = validateFabDeckTextFixture(fleshAndBloodDeckCardLibrary, fixture);
              return `${fixture.id} unresolved=${result.unresolved.join("|") || "none"} issues=${result.issues
                .map((issue) => issue.code)
                .join("|")}`;
            })
            .join("; ")}`,
        );
      }
    }

    expect(missing, "adult CC-legal heroes without a CC list").toEqual([]);
    expect(illegal, "CC lists rejected by the shipped validator").toEqual([]);
  });

  it("seats a two-handed weapon on Bravo coverage so empty-hand turns can still attack", () => {
    const bravo = getFabDeck("cc-coverage-bravo-showstopper");
    expect(bravo?.arena ?? "").toMatch(/Anothos/);
  });

  it("uses the shipped validator as the legality oracle, not fixture presence", () => {
    const remembrance = getFabDeck("cc-konrad-weiss-oscilio");
    const hamburg = getFabDeck("cc-hamburg-2nd-oscilio");
    if (!remembrance || !hamburg) throw new Error("expected Oscilio catalog lists");
    const banned = validateFabDeckTextFixture(fleshAndBloodDeckCardLibrary, remembrance);
    const legal = validateFabDeckTextFixture(fleshAndBloodDeckCardLibrary, hamburg);
    expect(banned.valid).toBe(false);
    expect(banned.issues.some((issue) => issue.code === "format_legal")).toBe(true);
    expect(legal.unresolved).toEqual([]);
    expect(legal.valid).toBe(true);
  });
});
