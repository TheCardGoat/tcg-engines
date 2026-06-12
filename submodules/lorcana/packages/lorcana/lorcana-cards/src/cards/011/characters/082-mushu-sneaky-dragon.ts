import type { CharacterCard } from "@tcg/lorcana-types";
import { mushuSneakyDragonI18n } from "./082-mushu-sneaky-dragon.i18n";

export const mushuSneakyDragon: CharacterCard = {
  id: "feU",
  canonicalId: "ci_m8p",
  reprints: ["set11-082"],
  cardType: "character",
  name: "Mushu",
  version: "Sneaky Dragon",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "011",
  cardNumber: 82,
  rarity: "uncommon",
  cost: 5,
  strength: 3,
  willpower: 2,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_239773eb4b194139916d4c31bba66356",
    tcgPlayer: 677147,
  },
  text: [
    {
      title: "SNOWY SURPRISE",
      description: "When you play this character, deal 2 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Dragon"],
  abilities: [
    {
      id: "1by-1",
      effect: {
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      name: "SNOWY SURPRISE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "SNOWY SURPRISE When you play this character, deal 2 damage to chosen character.",
    },
  ],
  i18n: mushuSneakyDragonI18n,
};
