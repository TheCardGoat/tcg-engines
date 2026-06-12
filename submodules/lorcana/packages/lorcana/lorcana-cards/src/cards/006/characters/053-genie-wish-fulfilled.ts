import type { CharacterCard } from "@tcg/lorcana-types";
import { genieWishFulfilledI18n } from "./053-genie-wish-fulfilled.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const genieWishFulfilled: CharacterCard = {
  id: "B2Y",
  canonicalId: "ci_M3n",
  reprints: ["set6-053"],
  cardType: "character",
  name: "Genie",
  version: "Wish Fulfilled",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "006",
  cardNumber: 53,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_9a41d700cf2749da8eed29420df7467c",
    tcgPlayer: 593007,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "WHAT HAPPENS NOW?",
      description: "When you play this character, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    evasive,
    {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "n6c-2",
      name: "WHAT HAPPENS NOW?",
      text: "WHAT HAPPENS NOW? When you play this character, draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: genieWishFulfilledI18n,
};
