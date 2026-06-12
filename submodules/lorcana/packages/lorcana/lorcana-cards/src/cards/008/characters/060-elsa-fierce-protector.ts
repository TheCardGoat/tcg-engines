import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaFierceProtectorI18n } from "./060-elsa-fierce-protector.i18n";

export const elsaFierceProtector: CharacterCard = {
  id: "F8U",
  canonicalId: "ci_F8U",
  reprints: ["set8-060"],
  cardType: "character",
  name: "Elsa",
  version: "Fierce Protector",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "008",
  cardNumber: 60,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a6a007b0f7ae4fa19480721bacd2b0b6",
    tcgPlayer: 631391,
  },
  text: [
    {
      title: "ICE OVER 1",
      description: "{I}, Choose and discard a card — Exert chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 1,
        discardCards: 1,
        discardChosen: true,
      },
      effect: {
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "exert",
      },
      id: "x49-1",
      name: "ICE OVER",
      text: "ICE OVER 1 {I} , Choose and discard a card — Exert chosen opposing character.",
      type: "activated",
    },
  ],
  i18n: elsaFierceProtectorI18n,
};
