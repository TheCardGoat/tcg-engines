import type { CharacterCard } from "@tcg/lorcana-types";
import { shereKhanFierceAndFuriousI18n } from "./128-shere-khan-fierce-and-furious.i18n";

export const shereKhanFierceAndFurious: CharacterCard = {
  id: "vOh",
  canonicalId: "ci_vOh",
  reprints: ["set10-128"],
  cardType: "character",
  name: "Shere Khan",
  version: "Fierce and Furious",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "010",
  cardNumber: 128,
  rarity: "rare",
  cost: 8,
  strength: 8,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_024a30a70f624c58bc3219532ffdd37c",
    tcgPlayer: 659419,
  },
  text: [
    {
      title: "Shift 5 {I}",
    },
    {
      title: "WILD RAGE 1",
      description:
        "{I}, Deal 1 damage to this character — Ready this character. He can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Floodborn", "Villain"],
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1uf-1",
      keyword: "Shift",
      text: "Shift 5 {I}",
      type: "keyword",
    },
    {
      cost: {
        ink: 1,
      },
      effect: {
        steps: [
          {
            amount: 1,
            target: {
              selector: "self",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "deal-damage",
          },
          {
            target: {
              selector: "self",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "ready",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: "SELF",
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "1uf-2",
      name: "WILD RAGE 1",
      text: "WILD RAGE 1 {I}, Deal 1 damage to this character — Ready this character. He can't quest for the rest of this turn.",
      type: "activated",
    },
  ],
  i18n: shereKhanFierceAndFuriousI18n,
};
