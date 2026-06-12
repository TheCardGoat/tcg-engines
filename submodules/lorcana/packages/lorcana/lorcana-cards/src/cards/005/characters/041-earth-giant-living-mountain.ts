import type { CharacterCard } from "@tcg/lorcana-types";
import { earthGiantLivingMountainI18n } from "./041-earth-giant-living-mountain.i18n";

export const earthGiantLivingMountain: CharacterCard = {
  id: "hC5",
  canonicalId: "ci_hC5",
  reprints: ["set5-041"],
  cardType: "character",
  name: "Earth Giant",
  version: "Living Mountain",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  cardNumber: 41,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_314343a109e74d31bb84143aeb72d25f",
    tcgPlayer: 561487,
  },
  text: [
    {
      title: "UNEARTHED",
      description: "When you play this character, each opponent draws a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "1xh-1",
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "draw",
      },
      name: "UNEARTHED",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "UNEARTHED When you play this character, each opponent draws a card.",
    },
  ],
  i18n: earthGiantLivingMountainI18n,
};
