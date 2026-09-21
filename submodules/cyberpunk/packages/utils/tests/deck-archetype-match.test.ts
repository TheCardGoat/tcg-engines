import { describe, expect, test } from "vite-plus/test";

import { authoredBotLabDeckSpecs } from "../src/authored-decks.ts";
import {
  DECK_ARCHETYPE_SIGNATURES,
  matchDeckProfile,
  resolveDeckProfile,
} from "../src/deck-archetype-match.ts";

function tokensFor(spec: (typeof authoredBotLabDeckSpecs)[number]): string[] {
  const tokens: string[] = [...spec.legends];
  for (const [name, count] of Object.entries(spec.mainDeck)) {
    for (let i = 0; i < count; i++) tokens.push(name);
  }
  return tokens;
}

describe("deck archetype signatures", () => {
  test("covers every authored profile exactly once", () => {
    const ids = DECK_ARCHETYPE_SIGNATURES.map((signature) => signature.profileId);
    expect(ids.sort()).toEqual(authoredBotLabDeckSpecs.map((spec) => spec.id).sort());
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("each authored list matches only its own profile", () => {
    for (const spec of authoredBotLabDeckSpecs) {
      const matched = matchDeckProfile(tokensFor(spec));
      expect(matched?.deckId, spec.id).toBe(spec.id);
    }
  });

  test("Overwatch + Netdriver is Hanako, not the rifle-only control list", () => {
    expect(
      matchDeckProfile(["Overwatch: Panam's Gift", "NetWatch Netdriver", "Sandevistan"])?.deckId,
    ).toBe("authored-hanako-netdriver-gigs-draw-engine");
    expect(
      matchDeckProfile(["Overwatch: Panam's Gift", "Overwatch: Panam's Gift", "Sandevistan"])
        ?.deckId,
    ).toBe("authored-overwatch-recharge-control");
  });

  test("Relic + Placide is surgical; Smasher is the wipe even with Relic", () => {
    expect(
      matchDeckProfile(["The Relic: Experimental Biochip", "Placide: Voodoo Sentinel"])?.deckId,
    ).toBe("authored-relic-placide-surgical-reanimation");
    expect(
      matchDeckProfile([
        "The Relic: Experimental Biochip",
        "Adam Smasher: Metal Over Meat",
        "Placide: Voodoo Sentinel",
      ])?.deckId,
    ).toBe("authored-relic-smasher-total-sweep");
  });

  test("three Yorinobu Units beat Johnny + Satori; Deadman beats both", () => {
    expect(
      matchDeckProfile([
        "Yorinobu Arasaka: Steel Dragon",
        "Yorinobu Arasaka: Steel Dragon",
        "Yorinobu Arasaka: Steel Dragon",
        "Johnny Silverhand: Never Stop Fighting",
        "Satori: Sword of Saburo",
        "Satori: Sword of Saburo",
      ])?.deckId,
    ).toBe("authored-yorinobu-two-units-for-one");
    expect(
      matchDeckProfile([
        "Johnny Silverhand: Never Stop Fighting",
        "Johnny Silverhand: Never Stop Fighting",
        "Satori: Sword of Saburo",
        "Satori: Sword of Saburo",
      ])?.deckId,
    ).toBe("authored-johnny-fight-ready-steal");
    expect(
      matchDeckProfile([
        "Deadman Transmitter",
        "Johnny Silverhand: Never Stop Fighting",
        "Satori: Sword of Saburo",
      ])?.deckId,
    ).toBe("authored-cyberpsychosis-deadman-burst-insurance");
  });

  test("Field Operator is the Green value list; Psycho Squad is the Blue tempo list", () => {
    expect(matchDeckProfile(["Field Operator", "Kerry Eurodyne: The Last Rockerboy"])?.deckId).toBe(
      "authored-ryg-low-cost-value",
    );
    expect(matchDeckProfile(["Psycho Squad", "Kerry Eurodyne: The Last Rockerboy"])?.deckId).toBe(
      "authored-ryb-low-cost-tempo",
    );
    expect(
      matchDeckProfile(["Swordwise Huscle", "Mantis Blades", "Kerry Eurodyne: The Last Rockerboy"])
        ?.deckId,
    ).toBeUndefined();
  });

  test("unknown bags stay unbound", () => {
    expect(matchDeckProfile([])).toBeUndefined();
    expect(matchDeckProfile(["Corpo Security", "Peace Offering", "The Heist"])).toBeUndefined();
  });

  test("resolveDeckProfile prefers an authored fixture id over the card bag", () => {
    const judyCards = tokensFor(
      authoredBotLabDeckSpecs.find((spec) => spec.id === "authored-judy-top-deck-discount")!,
    );
    expect(
      resolveDeckProfile({
        deckId: "authored-overwatch-recharge-control",
        cards: judyCards,
      })?.deckId,
    ).toBe("authored-overwatch-recharge-control");
    expect(resolveDeckProfile({ cards: judyCards })?.deckId).toBe(
      "authored-judy-top-deck-discount",
    );
  });
});
