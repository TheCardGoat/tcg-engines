import { describe, expect, it } from "vite-plus/test";
import { fleshAndBloodDeckCardLibrary } from "../../../cards/src/deck-library.ts";
import { playFabMatch as playFabMatchWithLibrary } from "./bench/play-match.ts";
import { FAB_HERO_PROFILE_BINDINGS } from "./heuristic/profiles/index.ts";
import {
  FAB_AUTOMATED_ACTION_STRATEGIES,
  getSafeFabAutomatedActionStrategyOption,
} from "./strategy-registry.ts";

function playFabMatch(input: Omit<Parameters<typeof playFabMatchWithLibrary>[0], "cardLibrary">) {
  return playFabMatchWithLibrary({ ...input, cardLibrary: fleshAndBloodDeckCardLibrary });
}

describe("hero-bound strategy model", () => {
  it("declares a scope for every strategy", () => {
    for (const option of FAB_AUTOMATED_ACTION_STRATEGIES) {
      expect(["hero", "dispatcher", "generic"], `${option.id} has a scope`).toContain(option.scope);
    }
  });

  it("binds each hero strategy to a hero matcher and hides it from pickers", () => {
    const heroOptions = FAB_AUTOMATED_ACTION_STRATEGIES.filter((o) => o.scope === "hero");
    expect(heroOptions.map((o) => o.id).sort()).toEqual(
      FAB_HERO_PROFILE_BINDINGS.map((b) => b.id).sort(),
    );
    for (const option of heroOptions) {
      expect(typeof option.heroMatch, `${option.id} has a heroMatch`).toBe("function");
      expect(option.testOnly, `${option.id} is testOnly`).toBe(true);
    }
  });

  it("keeps generic and dispatcher strategies hero-agnostic", () => {
    for (const option of FAB_AUTOMATED_ACTION_STRATEGIES) {
      if (option.scope === "hero") continue;
      expect(option.heroMatch, `${option.id} must not declare a heroMatch`).toBeUndefined();
    }
    expect(getSafeFabAutomatedActionStrategyOption("hero-profile").scope).toBe("dispatcher");
    expect(getSafeFabAutomatedActionStrategyOption("value-extract").scope).toBe("generic");
  });

  it("derives the hero-profile description from the binding table", () => {
    const description = getSafeFabAutomatedActionStrategyOption("hero-profile").description;
    for (const binding of FAB_HERO_PROFILE_BINDINGS) {
      expect(description).toContain(binding.label);
    }
  });
});

describe("hero-bound strategy enforcement", () => {
  it("throws when a hero-bound strategy is seated on a non-matching hero", () => {
    // teklovossen is hero-bound; the default catalog seat is Gravy Bones.
    expect(() =>
      playFabMatch({
        seed: "binding-mismatch",
        p1Strategy: "teklovossen",
        p2Strategy: "value-extract",
        recordFrames: false,
        maxActions: 8,
      }),
    ).toThrow(/hero-bound/);
  });

  it("runs a matching hero binding without opting out", { timeout: 60_000 }, () => {
    const played = playFabMatch({
      seed: "binding-match",
      p1Strategy: "rhinar",
      p2Strategy: "value-extract",
      p1Deck: "cc-guilherme-coutinho-rhinar",
      recordFrames: false,
      maxActions: 40,
    });
    expect(played.p1Strategy).toBe("rhinar");
    expect(played.actionCount).toBeGreaterThan(0);
  });

  it(
    "runs a deliberate off-hero strategy when allowStrategyHeroMismatch is set",
    { timeout: 60_000 },
    () => {
      const played = playFabMatch({
        seed: "binding-optout",
        p1Strategy: "teklovossen",
        p2Strategy: "value-extract",
        allowStrategyHeroMismatch: true,
        recordFrames: false,
        maxActions: 40,
      });
      expect(played.p1Strategy).toBe("teklovossen");
      expect(played.actionCount).toBeGreaterThan(0);
    },
  );

  it(
    "does not enforce against the hero-profile dispatcher or generic strategies",
    { timeout: 120_000 },
    () => {
      // Dispatcher + generic scopes are valid on any hero and must not throw.
      for (const id of ["hero-profile", "value-extract", "heuristic"] as const) {
        const played = playFabMatch({
          seed: `binding-generic-${id}`,
          p1Strategy: id,
          p2Strategy: "value-extract",
          recordFrames: false,
          maxActions: 40,
        });
        expect(played.p1Strategy).toBe(id);
      }
    },
  );
});
