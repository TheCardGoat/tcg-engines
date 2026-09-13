import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";
import { catalogIds } from "@tcg/flesh-and-blood-engine/simulator";

import { HERO_SPECIAL_UI_CATALOG, listHeroesWithTextFixtures } from "./catalog";
import { FAB_UI_MODULES } from "./modules";
import {
  FAB_HERO_TEXT_FIXTURES,
  getHeroTextFixture,
  renderAllHeroTextFixtures,
  renderUxHandoffTable,
} from "./textFixtures";
import {
  FAB_HERO_SPECIAL_SCENARIOS,
  assertAllHeroSpecialScenariosBoot,
  listMissingHeroSpecialSeeds,
} from "./visualScenarios";

const here = dirname(fileURLToPath(import.meta.url));

describe("FAB hero special UI catalog", () => {
  it("has unique ids", () => {
    const ids = HERO_SPECIAL_UI_CATALOG.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every catalog entry lists at least one module and one mustShow item", () => {
    for (const hero of HERO_SPECIAL_UI_CATALOG) {
      expect(hero.mustShow.length, hero.id).toBeGreaterThan(0);
      expect(hero.modules.length, hero.id).toBeGreaterThan(0);
      expect(hero.slugs.length, hero.id).toBeGreaterThan(0);
    }
  });

  it("every module id on a hero exists in FAB_UI_MODULES", () => {
    const known = new Set(FAB_UI_MODULES.map((m) => m.id));
    for (const hero of HERO_SPECIAL_UI_CATALOG) {
      for (const mod of hero.modules) {
        expect(known.has(mod), `${hero.id} → ${mod}`).toBe(true);
      }
    }
  });

  it("every hasTextFixture hero has a board builder / fixture", () => {
    const withFlag = listHeroesWithTextFixtures();
    expect(FAB_HERO_TEXT_FIXTURES.length).toBe(withFlag.length);

    for (const hero of withFlag) {
      const fixture = getHeroTextFixture(hero.id);
      expect(fixture, `missing text fixture for ${hero.id}`).toBeDefined();
      expect(fixture!.board).toContain(`FIXTURE id: ${hero.id}`);
      expect(fixture!.board).toContain("MUST SHOW");
      expect(fixture!.board).toContain("ASCII BOARD");
      // Board should surface at least the first acceptance line somewhere.
      expect(fixture!.board.length).toBeGreaterThan(200);
    }
  });

  it("signature fixtures include key chrome for Dromai / Levia / chi heroes", () => {
    const dromai = getHeroTextFixture("dromai")!.board;
    expect(dromai).toMatch(/Ash/i);
    expect(dromai).toMatch(/dragon|Ashwing|Azvolai/i);
    expect(dromai).toMatch(/played-red/i);

    const levia = getHeroTextFixture("levia")!.board;
    expect(levia).toMatch(/Blood Debt/i);
    expect(levia).toMatch(/MITIGATED|mitigation/i);
    expect(levia).toMatch(/banished/i);

    const zen = getHeroTextFixture("zen")!.board;
    expect(zen).toMatch(/Chi/i);
    expect(zen).toMatch(/Crouching Tiger/i);

    const boltyn = getHeroTextFixture("boltyn")!.board;
    expect(boltyn).toMatch(/soul/i);
    expect(boltyn).toMatch(/charged/i);
  });

  it("keeps committed markdown handoff + text fixtures in sync", () => {
    const fixturesMd = renderAllHeroTextFixtures();
    const handoffMd = renderUxHandoffTable();

    expect(fixturesMd).toContain("# FAB Hero Special UI — Visual Text Fixtures");
    expect(fixturesMd).toContain("FIXTURE id: dromai");
    expect(fixturesMd).toContain("FIXTURE id: levia");
    expect(handoffMd).toMatch(/^\| ID\s+\| Hero\s+\| Tier\s+\|/m);
    expect(handoffMd).toContain("| `dromai`");
    expect(handoffMd).toContain("| `levia`");

    expect(readFileSync(join(here, "text-fixtures.md"), "utf8")).toBe(fixturesMd);
    expect(readFileSync(join(here, "UX_HANDOFF.md"), "utf8")).toBe(handoffMd);
  });

  it("registers engine visual scenarios for every hero-special family", () => {
    expect(listMissingHeroSpecialSeeds()).toEqual([]);
    expect(FAB_HERO_SPECIAL_SCENARIOS).toHaveLength(HERO_SPECIAL_UI_CATALOG.length);
    expect(FAB_HERO_SPECIAL_SCENARIOS.some((s) => s.id === "hero-special-dromai")).toBe(true);
    expect(FAB_HERO_SPECIAL_SCENARIOS.some((s) => s.id === "hero-special-levia")).toBe(true);
  });

  it("boots every hero-special visual scenario without throwing", () => {
    assertAllHeroSpecialScenariosBoot();
  });

  it("seats real Generic cards in every visual fixture deck", () => {
    for (const scenario of FAB_HERO_SPECIAL_SCENARIOS) {
      const state = scenario.boot().runtime.getState();
      for (const playerId of ["player-1", "player-2"]) {
        const deck = state.containers.zonesByPlayerId[playerId]?.deck ?? [];
        expect(
          deck.map((instanceId) => state.objects[instanceId]?.canonicalId),
          scenario.id,
        ).toEqual(Array(10).fill(catalogIds.nimblismBlue));
      }
    }
  });
});
