import type { CharacterCard } from "@tcg/lorcana-types";
import { brunoMadrigalOasisOracleI18n } from "./154-bruno-madrigal-oasis-oracle.i18n";

export const brunoMadrigalOasisOracle: CharacterCard = {
  id: "6Lw",
  canonicalId: "ci_6Lw",
  reprints: ["set12-154"],
  cardType: "character",
  name: "Bruno Madrigal",
  version: "Oasis Oracle",
  inkType: ["sapphire"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 154,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_da0f9560eccf4967bb614cd049667f83",
  },
  text: [
    {
      title: "FIND THAT VISION",
      description:
        "Once during your turn, whenever you remove damage from one of your characters, you may look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of your deck.",
    },
    {
      title: "YOU'LL BE OKAY",
      description:
        "Whenever this character quests, you may remove all damage from chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Madrigal"],
  abilities: [
    {
      id: "6Lw-1",
      name: "FIND THAT VISION",
      type: "triggered",
      trigger: {
        event: "remove-damage",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        restrictions: [
          {
            type: "once-per-turn",
          },
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "scry",
          amount: 2,
          target: "CONTROLLER",
          destinations: [
            {
              zone: "hand",
              min: 1,
              max: 1,
            },
            {
              zone: "deck-bottom",
              remainder: true,
            },
          ],
        },
      },
      text: "FIND THAT VISION Once during your turn, whenever you remove damage from one of your characters, you may look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of your deck.",
    },
    {
      id: "6Lw-2",
      name: "YOU'LL BE OKAY",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "remove-damage",
          amount: "all",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
      text: "YOU'LL BE OKAY Whenever this character quests, you may remove all damage from chosen character.",
    },
  ],
  i18n: brunoMadrigalOasisOracleI18n,
};
