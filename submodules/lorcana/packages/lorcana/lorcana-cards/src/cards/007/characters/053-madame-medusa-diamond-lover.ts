import type { CharacterCard } from "@tcg/lorcana-types";
import { madameMedusaDiamondLoverI18n } from "./053-madame-medusa-diamond-lover.i18n";

export const madameMedusaDiamondLover: CharacterCard = {
  id: "75X",
  canonicalId: "ci_75X",
  reprints: ["set7-053"],
  cardType: "character",
  name: "Madame Medusa",
  version: "Diamond Lover",
  inkType: ["amethyst", "ruby"],
  franchise: "Rescuers",
  set: "007",
  cardNumber: 53,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2f6408a754bf40a7a71655da8edc5223",
    tcgPlayer: 618696,
  },
  text: [
    {
      title: "SEARCH THE SWAMP",
      description:
        "Whenever this character quests, you may deal 2 damage to another chosen character of yours to put the top 3 cards of chosen player's deck into their discard.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "select-target",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                excludeSelf: true,
              },
            },
            {
              type: "deal-damage",
              amount: 2,
              target: {
                reference: "selected-first",
              },
            },
            {
              type: "select-target",
              target: "CHOSEN_PLAYER",
            },
            {
              type: "mill",
              amount: 3,
              target: "CHOSEN_PLAYER",
            },
          ],
        },
        type: "optional",
      },
      id: "13m-1",
      name: "SEARCH THE SWAMP",
      text: "SEARCH THE SWAMP Whenever this character quests, you may deal 2 damage to another chosen character of yours to put the top 3 cards of chosen player's deck into their discard.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: madameMedusaDiamondLoverI18n,
};
