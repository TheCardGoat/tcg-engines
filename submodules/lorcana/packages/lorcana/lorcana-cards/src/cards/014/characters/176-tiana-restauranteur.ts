import type { CharacterCard } from "@tcg/lorcana-types";
import { tianaRestauranteurI18n } from "./176-tiana-restauranteur.i18n";

export const tianaRestauranteur: CharacterCard = {
  id: "Imr",
  canonicalId: "ci_Imr",
  slug: "lorcana-ci_Imr",
  printings: [
    {
      id: "set14-176",
      artId: "set14-176",
      setCode: "set14",
      collectorNumber: "176",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-176"],
  cardType: "character",
  name: "Tiana",
  version: "Restauranteur",
  inkType: ["steel"],
  franchise: "Princess and the Frog",
  set: "014",
  cardNumber: 176,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Handpicked",
      description:
        "When you play this character, you may draw a card, then choose and discard a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    {
      id: "Imr-1",
      name: "Handpicked",
      type: "triggered",
      text: "Handpicked When you play this character, you may draw a card, then choose and discard a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "draw",
              amount: 1,
              target: "CONTROLLER",
            },
            {
              type: "discard",
              amount: 1,
              chosen: true,
              target: "CONTROLLER",
            },
          ],
        },
      },
    },
  ],
  i18n: tianaRestauranteurI18n,
};
