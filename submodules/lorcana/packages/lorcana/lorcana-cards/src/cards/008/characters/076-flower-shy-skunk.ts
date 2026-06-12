import type { CharacterCard } from "@tcg/lorcana-types";
import { flowerShySkunkI18n } from "./076-flower-shy-skunk.i18n";

export const flowerShySkunk: CharacterCard = {
  id: "1FG",
  canonicalId: "ci_1FG",
  reprints: ["set8-076"],
  cardType: "character",
  name: "Flower",
  version: "Shy Skunk",
  inkType: ["amethyst"],
  franchise: "Bambi",
  set: "008",
  cardNumber: 76,
  rarity: "rare",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_36e404bad05f458dad8ab8a894d0118f",
    tcgPlayer: 631342,
  },
  text: [
    {
      title: "LOOKING FOR FRIENDS",
      description:
        "Whenever you play another character, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        type: "scry",
        amount: 1,
        destinations: [
          {
            zone: "deck-top",
            min: 0,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
      id: "ry8-1",
      name: "LOOKING FOR FRIENDS",
      text: "LOOKING FOR FRIENDS Whenever you play another character, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      trigger: {
        event: "play",
        on: {
          controller: "you",
          cardType: "character",
          excludeSelf: true,
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: flowerShySkunkI18n,
};
