import type { CharacterCard } from "@tcg/lorcana-types";
import { teKHeartlessI18n } from "./192-te-k-heartless.i18n";

export const teKHeartless: CharacterCard = {
  id: "KcY",
  canonicalId: "ci_KcY",
  reprints: ["set1-192"],
  cardType: "character",
  name: "Te Kā",
  version: "Heartless",
  inkType: ["steel"],
  franchise: "Moana",
  set: "001",
  cardNumber: 192,
  rarity: "legendary",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5fa3eadb1c984d63b845035c1e227af9",
    tcgPlayer: 508954,
  },
  text: [
    {
      title: "SEEK THE HEART",
      description:
        "During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Deity"],
  abilities: [
    {
      id: "bmj-1",
      type: "triggered",
      name: "SEEK THE HEART",
      text: "SEEK THE HEART During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
    },
  ],
  i18n: teKHeartlessI18n,
};
