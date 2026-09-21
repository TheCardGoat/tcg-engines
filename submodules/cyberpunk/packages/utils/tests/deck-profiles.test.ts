import { describe, expect, test } from "vite-plus/test";
import { structuredCards } from "@tcg/cyberpunk-cards";

import { authoredBotLabDeckSpecs } from "../src/authored-decks.ts";
import {
  allDeckStrategyProfiles,
  authoredDeckStrategyProfiles,
  deckProfileFor,
} from "../src/deck-profiles.ts";

const cardByEngineName = new Map(structuredCards.map((card) => [card.name, card]));
const cardByDisplayName = new Map(structuredCards.map((card) => [card.displayName, card]));

describe("authored deck strategy profiles", () => {
  test("covers every authored bot-lab deck exactly once", () => {
    expect(Object.keys(authoredDeckStrategyProfiles).sort()).toEqual(
      authoredBotLabDeckSpecs.map((spec) => spec.id).sort(),
    );
    expect(allDeckStrategyProfiles).toHaveLength(authoredBotLabDeckSpecs.length);
  });

  test("each profile names its own deck and carries a plan", () => {
    for (const [deckId, profile] of Object.entries(authoredDeckStrategyProfiles)) {
      expect(profile.deckId, deckId).toBe(deckId);
      expect(profile.plan.length, deckId).toBeGreaterThan(0);
    }
  });

  test("every referenced card name resolves against the real catalog", () => {
    const resolve = (deckId: string, name: string) => {
      expect(cardByEngineName.has(name), `${deckId}: "${name}"`).toBe(true);
    };
    for (const profile of allDeckStrategyProfiles) {
      for (const name of profile.coreCards) resolve(profile.deckId, name);
      for (const name of profile.mulligan?.engineNames ?? []) resolve(profile.deckId, name);
      for (const name of profile.mulligan?.congestionNames ?? []) resolve(profile.deckId, name);
      for (const [gear, hosts] of Object.entries(profile.gearHosts ?? {})) {
        resolve(profile.deckId, gear);
        for (const host of hosts) resolve(profile.deckId, host);
      }
      for (const gear of Object.keys(profile.gearHostTypes ?? {})) {
        resolve(profile.deckId, gear);
      }
      for (const name of profile.preferSpendOverAttack ?? []) resolve(profile.deckId, name);
    }
  });

  test("every referenced card is actually in its deck", () => {
    const engineNamesByDeck = new Map<string, Set<string>>(
      authoredBotLabDeckSpecs.map((spec) => [
        spec.id,
        new Set(
          [...spec.legends, ...Object.keys(spec.mainDeck)].map(
            (display) => cardByDisplayName.get(display)?.name ?? `<unresolved:${display}>`,
          ),
        ),
      ]),
    );
    const assertInDeck = (deckId: string, name: string) => {
      expect(engineNamesByDeck.get(deckId)?.has(name) ?? false, `${deckId}: "${name}"`).toBe(true);
    };
    for (const profile of allDeckStrategyProfiles) {
      for (const name of profile.coreCards) assertInDeck(profile.deckId, name);
      for (const name of profile.mulligan?.engineNames ?? []) assertInDeck(profile.deckId, name);
      for (const name of profile.mulligan?.congestionNames ?? [])
        assertInDeck(profile.deckId, name);
      for (const [gear, hosts] of Object.entries(profile.gearHosts ?? {})) {
        assertInDeck(profile.deckId, gear);
        for (const host of hosts) assertInDeck(profile.deckId, host);
      }
      for (const gear of Object.keys(profile.gearHostTypes ?? {})) {
        assertInDeck(profile.deckId, gear);
      }
      for (const name of profile.preferSpendOverAttack ?? []) assertInDeck(profile.deckId, name);
    }
  });

  test("profiles reference engine-visible printed names, not display subtitles", () => {
    for (const profile of allDeckStrategyProfiles) {
      for (const name of profile.coreCards) expect(name.includes(":"), name).toBe(false);
      for (const name of profile.mulligan?.engineNames ?? [])
        expect(name.includes(":"), name).toBe(false);
      for (const name of profile.mulligan?.congestionNames ?? [])
        expect(name.includes(":"), name).toBe(false);
      for (const name of profile.preferSpendOverAttack ?? [])
        expect(name.includes(":"), name).toBe(false);
    }
  });

  test("deckProfileFor resolves authored ids and rejects unknown ones", () => {
    expect(deckProfileFor("authored-overwatch-recharge-control")?.deckId).toBe(
      "authored-overwatch-recharge-control",
    );
    expect(deckProfileFor("not-a-deck")).toBeUndefined();
  });

  test("mulligan congestion vetoes only name expensive payoffs", () => {
    for (const profile of allDeckStrategyProfiles) {
      for (const name of profile.mulligan?.congestionNames ?? []) {
        const cost = cardByEngineName.get(name)?.cost ?? 0;
        expect(cost, `${profile.deckId}: "${name}"`).toBeGreaterThanOrEqual(6);
      }
    }
  });

  test("Relic lines prefer a Unit host; Overwatch lines prefer a Legend host", () => {
    expect(
      authoredDeckStrategyProfiles["authored-relic-placide-surgical-reanimation"].gearHostTypes?.[
        "The Relic"
      ],
    ).toBe("unit");
    expect(
      authoredDeckStrategyProfiles["authored-overwatch-recharge-control"].gearHostTypes?.Overwatch,
    ).toBe("legend");
  });
});
