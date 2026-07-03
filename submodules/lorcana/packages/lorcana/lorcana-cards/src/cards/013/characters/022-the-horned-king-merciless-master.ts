import type { CharacterCard } from "@tcg/lorcana-types";
import { theHornedKingMercilessMasterI18n } from "./022-the-horned-king-merciless-master.i18n";

export const theHornedKingMercilessMaster: CharacterCard = {
  id: "Dyo",
  canonicalId: "ci_Dyo",
  slug: "lorcana-ci_Dyo",
  printings: [
    {
      id: "set13-022",
      artId: "set13-022",
      setCode: "set13",
      collectorNumber: "22",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set13-022"],
  cardType: "character",
  name: "The Horned King",
  version: "Merciless Master",
  inkType: ["amber"],
  franchise: "Black Cauldron",
  set: "013",
  cardNumber: 22,
  rarity: "legendary",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_979b5517872f41dd902e486a8d50435f",
  },
  text: [
    {
      title: "CAULDRON'S POWER",
      description:
        "While this character is exerted, you may play characters from your discard. If you do, they enter play exerted. (You pay all costs.)",
    },
  ],
  classifications: ["Storyborn", "Villain", "King", "Sorcerer"],
  abilities: [
    {
      type: "static",
      name: "Cauldron's Power",
      text: "While this character is exerted, you may play characters from your discard. If you do, they enter play exerted. (You pay all costs.)",
      effect: {
        type: "play-from-discard",
        cardType: "character",
        entersExerted: true,
        whileSourceExerted: true,
      },
    },
  ],
  i18n: theHornedKingMercilessMasterI18n,
};
