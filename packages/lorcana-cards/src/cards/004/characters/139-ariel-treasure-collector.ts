import type { CharacterCard } from "@tcg/lorcana-types";

export const arielTreasureCollector: CharacterCard = {
  abilities: [
    {
      id: "hyy-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
      id: "hyy-2",
      text: "THE GIRL WHO HAS EVERYTHING While you have more items in play than each opponent, this character gets +2 {L}.",
      type: "action",
    },
  ],
  cardNumber: 139,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 6,
  externalIds: {
    ravensburger: "40c4bd3ba073f42de5b7fe1697a04fdd67105db4",
  },
  franchise: "Little Mermaid",
  fullName: "Ariel - Treasure Collector",
  id: "hyy",
  inkType: ["sapphire"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Ariel",
  set: "004",
  strength: 3,
  text: "Ward (Opponents can't choose this character except to challenge.)\nTHE GIRL WHO HAS EVERYTHING While you have more items in play than each opponent, this character gets +2 {L}.",
  version: "Treasure Collector",
  willpower: 4,
};
