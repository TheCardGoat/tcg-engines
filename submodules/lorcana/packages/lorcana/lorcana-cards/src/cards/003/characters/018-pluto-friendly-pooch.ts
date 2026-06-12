import type { CharacterCard } from "@tcg/lorcana-types";
import { plutoFriendlyPoochI18n } from "./018-pluto-friendly-pooch.i18n";

export const plutoFriendlyPooch: CharacterCard = {
  id: "Dl1",
  canonicalId: "ci_jIB",
  reprints: ["set3-018", "set9-021"],
  cardType: "character",
  name: "Pluto",
  version: "Friendly Pooch",
  inkType: ["amber"],
  set: "003",
  cardNumber: 18,
  rarity: "uncommon",
  cost: 1,
  strength: 0,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_c042279e4692458c906cc27ec66448ab",
    tcgPlayer: 649969,
  },
  text: [
    {
      title: "GOOD DOG",
      description: "{E} — You pay 1 {I} less for the next character you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        cardType: "character",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "16c-1",
      name: "GOOD DOG",
      text: "GOOD DOG {E} — You pay 1 {I} less for the next character you play this turn.",
      type: "activated",
    },
  ],
  i18n: plutoFriendlyPoochI18n,
};
