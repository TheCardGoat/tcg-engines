import type { CharacterCard } from "@tcg/lorcana-types";
import { kronkJuniorChipmunkI18n } from "./185-kronk-junior-chipmunk.i18n";
import { resist } from "../../../helpers/abilities/resist";

export const kronkJuniorChipmunk: CharacterCard = {
  id: "XpE",
  canonicalId: "ci_XpE",
  reprints: ["set2-185"],
  cardType: "character",
  name: "Kronk",
  version: "Junior Chipmunk",
  inkType: ["steel"],
  franchise: "Emperors New Groove",
  set: "002",
  cardNumber: 185,
  rarity: "rare",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_452868f6888045018e50e2b4e41e0f7b",
    tcgPlayer: 527775,
  },
  text: [
    {
      title: "Resist +1",
    },
    {
      title: "SCOUT LEADER",
      description:
        "During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    resist(1),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "6z5-2",
      name: "SCOUT LEADER",
      text: "SCOUT LEADER During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: kronkJuniorChipmunkI18n,
};
