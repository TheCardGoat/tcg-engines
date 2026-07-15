import type { CharacterCard } from "@tcg/lorcana-types";
import { mushuSneakyDragonEpicI18n } from "./212-mushu-sneaky-dragon-epic.i18n";

export const mushuSneakyDragonEpic: CharacterCard = {
  id: "B8x",
  canonicalId: "ci_m8p",
  slug: "lorcana-ci_m8p",
  printings: [
    {
      id: "set11-212-epic",
      artId: "ci_m8p-epic",
      setCode: "set11",
      collectorNumber: "212",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set11-082"],
  cardType: "character",
  name: "Mushu",
  version: "Sneaky Dragon",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "011",
  cardNumber: 212,
  rarity: "common",
  specialRarity: "epic",
  cost: 5,
  strength: 3,
  willpower: 2,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_239773eb4b194139916d4c31bba66356",
    tcgPlayer: "677147",
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
  i18n: mushuSneakyDragonEpicI18n,
};
