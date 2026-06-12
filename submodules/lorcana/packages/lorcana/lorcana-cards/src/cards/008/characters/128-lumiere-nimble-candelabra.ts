import type { CharacterCard } from "@tcg/lorcana-types";
import { lumiereNimbleCandelabraI18n } from "./128-lumiere-nimble-candelabra.i18n";

export const lumiereNimbleCandelabra: CharacterCard = {
  id: "p7H",
  canonicalId: "ci_p7H",
  reprints: ["set8-128"],
  cardType: "character",
  name: "Lumiere",
  version: "Nimble Candelabra",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "008",
  cardNumber: 128,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a5ab1a4a40304395b5363fff5858b9a8",
    tcgPlayer: 631434,
  },
  text: [
    {
      title: "QUICK-STEP",
      description: "While you have an item card in your discard, this character gains Evasive.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "1k4-1",
      name: "QUICK-STEP",
      type: "static",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["discard"],
          cardTypes: ["item"],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      text: "QUICK-STEP While you have an item card in your discard, this character gains Evasive.",
    },
  ],
  i18n: lumiereNimbleCandelabraI18n,
};
