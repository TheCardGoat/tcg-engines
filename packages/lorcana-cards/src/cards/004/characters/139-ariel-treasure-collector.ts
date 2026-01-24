import type { CharacterCard } from "@tcg/lorcana-types";

export const arielTreasureCollector: CharacterCard = {
  id: "hyy",
  cardType: "character",
  name: "Ariel",
  version: "Treasure Collector",
  fullName: "Ariel - Treasure Collector",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Ward (Opponents can't choose this character except to challenge.)\nTHE GIRL WHO HAS EVERYTHING While you have more items in play than each opponent, this character gets +2 {L}.",
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 3,
  cardNumber: 139,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "40c4bd3ba073f42de5b7fe1697a04fdd67105db4",
  },
  abilities: [
    {
      id: "hyy-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "hyy-2",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
      text: "THE GIRL WHO HAS EVERYTHING While you have more items in play than each opponent, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
