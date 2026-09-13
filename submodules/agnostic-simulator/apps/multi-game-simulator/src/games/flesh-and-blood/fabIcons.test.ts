import { describe, expect, it } from "vitest";

import { fabPresentationCatalog } from "@tcg/flesh-and-blood-cards/presentation-catalog";
import {
  FAB_ICON_CDN_BASE,
  fabOfficialIconCdnUrl,
  fabOfficialIconLocalUrl,
  fabOfficialIconUrl,
  fabPitchIconId,
  normalizeFabKeyword,
  registeredFabKeywordIds,
  resolveFabKeyword,
  sortFabKeywordsForChain,
} from "./fabIcons";

describe("fabIcons", () => {
  it("prefers CDN URLs for official support icons (not card art)", () => {
    for (const id of ["power", "defense", "resource", "life", "pitch-1"] as const) {
      expect(fabOfficialIconUrl(id)).toBe(fabOfficialIconCdnUrl(id));
      expect(fabOfficialIconCdnUrl(id)).toContain(FAB_ICON_CDN_BASE);
      expect(fabOfficialIconCdnUrl(id)).toContain(id);
      expect(fabOfficialIconLocalUrl(id).length).toBeGreaterThan(0);
    }
  });

  it("maps pitch values to pitch gem icons", () => {
    expect(fabPitchIconId(1)).toBe("pitch-1");
    expect(fabPitchIconId(2)).toBe("pitch-2");
    expect(fabPitchIconId(3)).toBe("pitch-3");
    expect(fabPitchIconId(4)).toBe("pitch-4");
    expect(fabPitchIconId(0)).toBeNull();
  });

  it("normalizes keyword tokens to stable slugs", () => {
    expect(normalizeFabKeyword("Go Again")).toBe("go-again");
    expect(normalizeFabKeyword("go again")).toBe("go-again");
    expect(normalizeFabKeyword("go_again")).toBe("go-again");
    expect(normalizeFabKeyword("On hit")).toBe("on-hit");
    expect(normalizeFabKeyword("DOMINATE")).toBe("dominate");
    expect(normalizeFabKeyword("blade break")).toBe("blade-break");
    expect(normalizeFabKeyword("blood debt")).toBe("blood-debt");
  });

  it("resolves combat keywords to consistent icons and labels", () => {
    const onHit = resolveFabKeyword("on hit");
    expect(onHit.id).toBe("on-hit");
    expect(onHit.shortCode).toBe("HIT");
    expect(onHit.label).toMatch(/on-hit/i);

    const goAgain = resolveFabKeyword("go again");
    expect(goAgain.id).toBe("go-again");
    expect(goAgain.shortCode).toBe("GA");
    expect(goAgain.label).toMatch(/go again/i);
    expect(goAgain.Lucide).toBeTruthy();

    const dominate = resolveFabKeyword("dominate");
    expect(dominate.id).toBe("dominate");
    expect(dominate.shortCode).toBe("DOM");

    const overpower = resolveFabKeyword("overpower");
    expect(overpower.id).toBe("overpower");
    expect(overpower.shortCode).toBe("OP");

    const wager = resolveFabKeyword("wager");
    expect(wager.id).toBe("wager");
    expect(wager.shortCode).toBe("WAG");
    expect(wager.hint).toMatch(/prize/i);
  });

  it("sorts chain keywords by combat priority (go again / dominate first)", () => {
    const sorted = sortFabKeywordsForChain([
      "phantasm",
      "dominate",
      "go-again",
      "on-hit",
      "overpower",
      "dominate",
    ]);
    expect(sorted.map((k) => k.id)).toEqual([
      "on-hit",
      "go-again",
      "dominate",
      "overpower",
      "phantasm",
    ]);
  });

  it("covers core combat glossary keywords with registered icons", () => {
    const required = [
      "on-hit",
      "go-again",
      "dominate",
      "overpower",
      "phantasm",
      "crush",
      "intimidate",
      "wager",
      "boost",
      "battleworn",
      "blade-break",
      "temper",
      "ward",
      "blood-debt",
      "combo",
    ];
    const registered = new Set(registeredFabKeywordIds());
    for (const id of required) {
      expect(registered.has(id), `missing keyword icon for ${id}`).toBe(true);
    }
  });

  it("falls back gracefully for unknown keywords", () => {
    const unknown = resolveFabKeyword("Custom Keyword X");
    expect(unknown.id).toBe("custom-keyword-x");
    expect(unknown.label).toMatch(/Custom Keyword X/i);
    expect(unknown.Lucide).toBeTruthy();
  });
});

const NON_KEYWORD_CATALOG_TAGS = new Set([
  "and Lightning",
  "Attack",
  "Attack Reaction",
  "Heavy",
  "Ice",
  "Instant",
]);

describe("FAB keyword icon catalog", () => {
  it("gives Clash and Ambush distinct registered icon definitions", () => {
    const fallback = resolveFabKeyword("not-a-real-keyword");
    const clash = resolveFabKeyword("Clash");
    const ambush = resolveFabKeyword("Ambush");

    expect(clash).toMatchObject({ id: "clash", label: "Clash", shortCode: "CLA" });
    expect(ambush).toMatchObject({ id: "ambush", label: "Ambush", shortCode: "AMB" });
    expect(clash.Lucide).not.toBe(fallback.Lucide);
    expect(ambush.Lucide).not.toBe(fallback.Lucide);
    expect(ambush.Lucide).not.toBe(clash.Lucide);
  });

  it.each([
    ["Ward 2", "ward"],
    ["Opt X", "opt"],
    ["Arcane Barrier 3", "arcane-barrier"],
    ["Katsu Specialization", "specialization"],
    ["Earth and Ice Fusion", "fusion"],
    ["Essence of Earth and Lightning", "essence"],
    ["Lightning Bond", "bond"],
    ["Binds", "binds"],
    ["Channel Ice", "channel"],
    ["Lightning Flow", "flow"],
  ])("resolves the catalog variant %s through %s", (raw, expectedId) => {
    expect(resolveFabKeyword(raw).id).toBe(expectedId);
  });

  it("registers every statically generated keyword or effect family", async () => {
    const records = Object.values(fabPresentationCatalog.records);
    const registered = new Set(registeredFabKeywordIds());
    const unresolved = [
      ...new Set(
        records
          .flatMap((record) => record.keywords)
          .filter((keyword) => !NON_KEYWORD_CATALOG_TAGS.has(keyword))
          .filter((keyword) => !registered.has(resolveFabKeyword(keyword).id)),
      ),
    ].sort();

    expect(unresolved).toEqual([]);
  });
});
