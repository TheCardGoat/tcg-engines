import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckAlongForTheRideEpicI18n } from "./220-donald-duck-along-for-the-ride-epic.i18n";

export const donaldDuckAlongForTheRideEpic: CharacterCard = {
  id: "V8a",
  canonicalId: "ci_4PF",
  slug: "lorcana-ci_4PF",
  printings: [
    {
      id: "set11-220-epic",
      artId: "ci_4PF-epic",
      setCode: "set11",
      collectorNumber: "220",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set11-178"],
  cardType: "character",
  name: "Donald Duck",
  version: "Along for the Ride",
  inkType: ["steel"],
  set: "011",
  cardNumber: 220,
  rarity: "common",
  specialRarity: "epic",
  cost: 5,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_197bd1d5d07843d49d892ea9536fcbed",
    tcgPlayer: "677155",
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
  i18n: donaldDuckAlongForTheRideEpicI18n,
};
