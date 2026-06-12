import type { CharacterCard } from "@tcg/lorcana-types";
import { honeyLemonCostumedCatalystI18n } from "./111-honey-lemon-costumed-catalyst.i18n";

export const honeyLemonCostumedCatalyst: CharacterCard = {
  id: "MDv",
  canonicalId: "ci_MDv",
  reprints: ["set8-111"],
  cardType: "character",
  name: "Honey Lemon",
  version: "Costumed Catalyst",
  inkType: ["emerald", "sapphire"],
  franchise: "Big Hero 6",
  set: "008",
  cardNumber: 111,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_68a30037a4074eed8e5d0924b542cec9",
    tcgPlayer: 631421,
  },
  text: [
    {
      title: "LET'S DO THIS!",
      description:
        "Whenever you play a Floodborn character, if you used Shift to play them, you may return chosen character to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
  abilities: [
    {
      condition: {
        type: "used-shift",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "1h9-1",
      name: "LET'S DO THIS!",
      text: "LET'S DO THIS! Whenever you play a Floodborn character, if you used Shift to play them, you may return chosen character to their player's hand.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Floodborn",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: honeyLemonCostumedCatalystI18n,
};
