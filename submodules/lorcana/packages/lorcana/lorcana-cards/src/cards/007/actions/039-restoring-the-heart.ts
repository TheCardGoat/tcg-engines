import type { ActionCard } from "@tcg/lorcana-types";
import { restoringTheHeartI18n } from "./039-restoring-the-heart.i18n";

export const restoringTheHeart: ActionCard = {
  id: "PpP",
  canonicalId: "ci_PpP",
  reprints: ["set7-039"],
  cardType: "action",
  name: "Restoring the Heart",
  inkType: ["amber", "sapphire"],
  franchise: "Moana",
  set: "007",
  cardNumber: 39,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_a9d9c4039f5445c582413664824aad1d",
    tcgPlayer: 618132,
  },
  text: "Remove up to 3 damage from chosen character or location. Draw a card.",
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: { type: "up-to", value: 3 },
            target: "CHOSEN_CHARACTER_OR_LOCATION",
            type: "remove-damage",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "inl-1",
      text: "Remove up to 3 damage from chosen character or location. Draw a card.",
      type: "action",
    },
  ],
  i18n: restoringTheHeartI18n,
};
