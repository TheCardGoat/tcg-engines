import type { CharacterCard } from "@tcg/lorcana-types";
import { kidaCreativeThinkerI18n } from "./164-kida-creative-thinker.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const kidaCreativeThinker: CharacterCard = {
  id: "F39",
  canonicalId: "ci_F39",
  reprints: ["set7-164"],
  cardType: "character",
  name: "Kida",
  version: "Creative Thinker",
  inkType: ["sapphire"],
  franchise: "Atlantis",
  set: "007",
  cardNumber: 164,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_19e9e680d0d044d6a5fa0d39b5ab3206",
    tcgPlayer: 619501,
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "KEY TO THE PUZZLE",
      description:
        "{E} — Look at the top 2 cards of your deck. Put one into your ink supply, face down and exerted, and the other on top of your deck.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    ward,
    {
      cost: {
        exert: true,
      },
      effect: {
        type: "scry",
        amount: 2,
        destinations: [
          {
            zone: "inkwell",
            min: 1,
            max: 1,
            exerted: true,
            facedown: true,
          },
          {
            zone: "deck-top",
            remainder: true,
          },
        ],
      },
      id: "13v-2",
      name: "KEY TO THE PUZZLE",
      text: "KEY TO THE PUZZLE {E} – Look at the top 2 cards of your deck. Put one into your ink supply, face down and exerted, and the other on top of your deck.",
      type: "activated",
    },
  ],
  i18n: kidaCreativeThinkerI18n,
};
