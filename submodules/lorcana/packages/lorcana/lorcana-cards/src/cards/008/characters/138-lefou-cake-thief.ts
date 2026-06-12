import type { CharacterCard } from "@tcg/lorcana-types";
import { lefouCakeThiefI18n } from "./138-lefou-cake-thief.i18n";

export const lefouCakeThief: CharacterCard = {
  id: "Peq",
  canonicalId: "ci_Peq",
  reprints: ["set8-138"],
  cardType: "character",
  name: "LeFou",
  version: "Cake Thief",
  inkType: ["ruby", "sapphire"],
  franchise: "Beauty and the Beast",
  set: "008",
  cardNumber: 138,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b89e331f531c40c7a269911b0ca4a92b",
    tcgPlayer: 631440,
  },
  text: [
    {
      title: "ALL FOR ME",
      description:
        "{E}, Banish one of your items — Chosen opponent loses 1 lore and you gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      cost: {
        exert: true,
        banishItem: true,
      },
      effect: {
        steps: [
          {
            amount: 1,
            target: "OPPONENT",
            type: "lose-lore",
          },
          {
            amount: 1,
            type: "gain-lore",
          },
        ],
        type: "sequence",
      },
      id: "13j-1",
      name: "ALL FOR ME",
      text: "ALL FOR ME {E}, Banish one of your items — Chosen opponent loses 1 lore and you gain 1 lore.",
      type: "activated",
    },
  ],
  i18n: lefouCakeThiefI18n,
};
