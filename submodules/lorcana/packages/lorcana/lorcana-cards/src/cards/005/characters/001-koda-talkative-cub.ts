import type { CharacterCard } from "@tcg/lorcana-types";
import { kodaTalkativeCubI18n } from "./001-koda-talkative-cub.i18n";

export const kodaTalkativeCub: CharacterCard = {
  id: "4iY",
  canonicalId: "ci_4iY",
  reprints: ["set5-001"],
  cardType: "character",
  name: "Koda",
  version: "Talkative Cub",
  inkType: ["amber"],
  franchise: "Brother Bear",
  set: "005",
  cardNumber: 1,
  rarity: "rare",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7202d58f49f84525b3a9364c319772f3",
    tcgPlayer: 560505,
  },
  text: [
    {
      title: "TELL EVERYBODY",
      description: "During opponents' turns, you can't lose lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "4iY-1",
      name: "TELL EVERYBODY",
      text: "TELL EVERYBODY During opponents' turns, you can't lose lore.",
      type: "replacement",
      replaces: "lose-lore",
      replacement: "prevent",
      condition: {
        type: "during-turn",
        whose: "opponent",
      },
    },
  ],
  i18n: kodaTalkativeCubI18n,
};
