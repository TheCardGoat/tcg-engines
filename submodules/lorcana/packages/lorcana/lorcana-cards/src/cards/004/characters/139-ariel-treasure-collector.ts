import type { CharacterCard } from "@tcg/lorcana-types";
import { arielTreasureCollectorI18n } from "./139-ariel-treasure-collector.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const arielTreasureCollector: CharacterCard = {
  id: "Sxx",
  canonicalId: "ci_Sxx",
  reprints: ["set4-139"],
  cardType: "character",
  name: "Ariel",
  version: "Treasure Collector",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 139,
  rarity: "common",
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_268651d4999a481faa22b6598a4dea0c",
    tcgPlayer: 549440,
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "THE GIRL WHO HAS EVERYTHING",
      description:
        "While you have more items in play than each opponent, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    ward,
    {
      condition: {
        type: "comparison",
        left: {
          type: "item-count",
          controller: "you",
        },
        comparison: "greater-than",
        right: {
          type: "item-count",
          controller: "opponent",
        },
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "hyy-2",
      name: "THE GIRL WHO HAS EVERYTHING",
      text: "THE GIRL WHO HAS EVERYTHING While you have more items in play than each opponent, this character gets +2 {L}.",
      type: "static",
    },
  ],
  i18n: arielTreasureCollectorI18n,
};
