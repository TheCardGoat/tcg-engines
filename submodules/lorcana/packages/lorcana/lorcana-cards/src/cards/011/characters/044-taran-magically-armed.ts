import type { CharacterCard } from "@tcg/lorcana-types";
import { taranMagicallyArmedI18n } from "./044-taran-magically-armed.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const taranMagicallyArmed: CharacterCard = {
  id: "8Qz",
  canonicalId: "ci_8Qz",
  reprints: ["set11-044"],
  cardType: "character",
  name: "Taran",
  version: "Magically Armed",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "011",
  cardNumber: 44,
  rarity: "uncommon",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_b0231e5ba8c34691ac5bf29e6fc96c46",
    tcgPlayer: 673420,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "WEAKEN THE CAULDRON",
      description:
        "When you play this character, put up to 2 cards from chosen player's discard on the bottom of their deck in any order.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    rush,
    {
      id: "u75-2",
      effect: {
        orderBy: "owner",
        ordering: "player-choice",
        target: {
          cardTypes: ["card"],
          count: {
            upTo: 2,
          },
          owner: "any",
          selector: "chosen",
          zones: ["discard"],
        },
        type: "put-on-bottom",
      },
      name: "WEAKEN THE CAULDRON",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "WEAKEN THE CAULDRON When you play this character, put up to 2 cards from chosen player's discard on the bottom of their deck in any order.",
    },
  ],
  i18n: taranMagicallyArmedI18n,
};
