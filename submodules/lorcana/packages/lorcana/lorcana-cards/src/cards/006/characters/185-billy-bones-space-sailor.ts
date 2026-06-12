import type { CharacterCard } from "@tcg/lorcana-types";
import { billyBonesSpaceSailorI18n } from "./185-billy-bones-space-sailor.i18n";

export const billyBonesSpaceSailor: CharacterCard = {
  id: "MbE",
  canonicalId: "ci_MbE",
  reprints: ["set6-185"],
  cardType: "character",
  name: "Billy Bones",
  version: "Space Sailor",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  cardNumber: 185,
  rarity: "uncommon",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_bd9c0c2fd69e467c82c247d1733c0d19",
    tcgPlayer: 587375,
  },
  text: [
    {
      title: "KEEP IT HIDDEN",
      description: "When this character is banished, you may banish chosen item or location.",
    },
  ],
  classifications: ["Storyborn", "Alien", "Pirate"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item", "location"],
          },
          type: "banish",
        },
        type: "optional",
      },
      id: "1oc-1",
      name: "KEEP IT HIDDEN",
      text: "KEEP IT HIDDEN When this character is banished, you may banish chosen item or location.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: billyBonesSpaceSailorI18n,
};
