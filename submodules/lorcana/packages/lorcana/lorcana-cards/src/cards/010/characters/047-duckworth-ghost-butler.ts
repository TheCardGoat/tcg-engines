import type { CharacterCard } from "@tcg/lorcana-types";
import { rush } from "../../../helpers/abilities/rush";
import { duckworthGhostButlerI18n } from "./047-duckworth-ghost-butler.i18n";

export const duckworthGhostButler: CharacterCard = {
  id: "8zy",
  canonicalId: "ci_8zy",
  reprints: ["set10-047"],
  cardType: "character",
  name: "Duckworth",
  version: "Ghost Butler",
  inkType: ["amethyst"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 47,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 1,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_8fc9a082fe1d49d0a81867c9665b00b2",
    tcgPlayer: 658331,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "FINAL ACT",
      description:
        "During your turn, when this character is banished, you may put the top card of your deck facedown under one of your characters or locations with Boost.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Ghost"],
  abilities: [
    rush,
    {
      id: "8zy-2",
      name: "FINAL ACT",
      text: "FINAL ACT During your turn, when this character is banished, you may put the top card of your deck facedown under one of your characters or locations with Boost.",
      type: "triggered",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          source: "top-of-deck",
          type: "put-under",
          under: {
            cardTypes: ["character", "location"],
            count: 1,
            owner: "you",
            selector: "chosen",
            zones: ["play"],
            filter: [
              {
                keyword: "Boost",
                type: "has-keyword",
              },
            ],
          },
        },
        type: "optional",
      },
    },
  ],
  i18n: duckworthGhostButlerI18n,
};
