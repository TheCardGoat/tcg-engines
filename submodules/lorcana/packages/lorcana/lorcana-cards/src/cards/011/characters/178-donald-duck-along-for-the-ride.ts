import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckAlongForTheRideI18n } from "./178-donald-duck-along-for-the-ride.i18n";

export const donaldDuckAlongForTheRide: CharacterCard = {
  id: "I70",
  canonicalId: "ci_4PF",
  reprints: ["set11-178"],
  cardType: "character",
  name: "Donald Duck",
  version: "Along for the Ride",
  inkType: ["steel"],
  set: "011",
  cardNumber: 178,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_197bd1d5d07843d49d892ea9536fcbed",
    tcgPlayer: 677155,
  },
  text: [
    {
      title: "COMIN' THROUGH!",
      description: "When you play this character, you may banish chosen item.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "s02-1",
      name: "COMIN' THROUGH!",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["item"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "banish",
        },
        type: "optional",
      },
      type: "triggered",
      text: "COMIN’ THROUGH! When you play this character, you may banish chosen item.",
    },
  ],
  i18n: donaldDuckAlongForTheRideI18n,
};
