import type { ActionCard } from "@tcg/lorcana-types";
import { youreWelcomeEnchantedI18n } from "./213-youre-welcome-enchanted.i18n";

export const youreWelcomeEnchanted: ActionCard = {
  id: "OUH",
  canonicalId: "ci_IPh",
  slug: "lorcana-ci_IPh",
  printings: [
    {
      id: "set5-213-enchanted",
      artId: "ci_IPh-enchanted",
      setCode: "set5",
      collectorNumber: "213",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set5-096"],
  cardType: "action",
  name: "You're Welcome",
  inkType: ["emerald"],
  franchise: "Moana",
  set: "005",
  cardNumber: 213,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_f799b47b4b894912a8d83942d0fa4d22",
    tcgPlayer: "561983",
  },
  text: "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
  actionSubtype: "song",
  abilities: [
    {
      id: "1my-1",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "shuffle-into-deck",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character", "item", "location"],
            },
          },
          {
            type: "draw",
            amount: 2,
            target: "CARD_OWNER",
          },
        ],
      },
      type: "action",
      text: "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
    },
  ],
  i18n: youreWelcomeEnchantedI18n,
};
